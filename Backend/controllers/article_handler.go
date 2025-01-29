package controllers

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
	"gorm.io/gorm"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type ArticleInput struct {
	Title       string   `json:"title" binding:"required"`
	Publisher   string   `json:"publisher" binding:"required"`
	MainImage   string   `json:"mainImage"`
	Images      []string `json:"images"`
	Category    string   `json:"category"`
	Tags        string   `json:"tags"`    // "Go, Docker, Tips"
	Content     string   `json:"content"` // text/HTML/markdown
	Description string   `json:"description"`
}

func CreateArticle(c *gin.Context) {
	title := c.PostForm("title")
	publisher := c.PostForm("publisher")
	category := c.PostForm("category")
	tags := c.PostForm("tags")
	content := c.PostForm("content")
	description := c.PostForm("description") // <-- Baru

	if err := os.MkdirAll("uploads/article/", os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads folder"})
		return
	}

	// Upload file
	file, err := c.FormFile("main_image")
	var mainImagePath string
	if err == nil {
		filename := utils.GenerateFileName("article", file.Filename)
		mainImagePath = "uploads/article/" + filename
		if err := c.SaveUploadedFile(file, mainImagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
	}

	readingTime := utils.CalculateReadingTime(content)

	article := models.Article{
		Title:       title,
		Publisher:   publisher,
		Category:    category,
		Tags:        tags,
		MainImage:   mainImagePath,
		Content:     content,
		Description: description, // <-- set field baru
		ReadingTime: readingTime,
	}

	if err := config.DB.Create(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, article)
}

// Mendapatkan daftar artikel, diurutkan berdasarkan CreatedAt desc
func GetAllArticles(c *gin.Context) {
	var articles []models.Article
	if err := config.DB.Order("created_at DESC").Find(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, articles)
}

func UpdateArticle(c *gin.Context) {
	id := c.Param("id")

	// 1) Cek existence article
	var article models.Article
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	// 2) Ambil teks dari form-data
	title := c.PostForm("title")
	publisher := c.PostForm("publisher")
	category := c.PostForm("category")
	tags := c.PostForm("tags")
	content := c.PostForm("content")
	description := c.PostForm("description")

	// 3) Jika ada file main_image baru
	file, errFile := c.FormFile("main_image")
	var newImagePath string
	if errFile == nil {
		// Artinya user upload file
		filename := utils.GenerateFileName("article", file.Filename)
		newImagePath = "uploads/article/" + filename

		// Hapus file lama?
		if article.MainImage != "" {
			os.Remove(article.MainImage)
		}

		// Simpan file baru
		if err := c.SaveUploadedFile(file, newImagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
	}

	// 4) Update field di article
	article.Title = title
	article.Publisher = publisher
	article.Category = category
	article.Tags = tags
	article.Content = content
	article.Description = description
	article.UpdatedAt = time.Now()

	// Jika user memang upload main_image baru
	if newImagePath != "" {
		article.MainImage = newImagePath
	}

	// 5) Simpan ke DB
	if err := config.DB.Save(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, article)
}

func DeleteArticle(c *gin.Context) {
	id := c.Param("id")
	var article models.Article
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	// Hapus main image
	if article.MainImage != "" {
		os.Remove(article.MainImage)
	}

	// Hapus images (jika ada)
	if article.Images != "" {
		oldImages := strings.Split(article.Images, ",")
		for _, old := range oldImages {
			if old != "" {
				os.Remove("uploads/article/" + old)
			}
		}
	}

	if err := config.DB.Delete(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Article deleted"})
}

// ToggleLikeArticle mengatur status like/unlike berdasarkan Session ID
func ToggleLikeArticle(c *gin.Context) {
	id := c.Param("id")
	sessionID, err := c.Cookie("session_id")
	if err != nil || sessionID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Session ID missing"})
		return
	}

	// Validasi Article ID
	articleID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	var article models.Article
	if err := config.DB.First(&article, articleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Cek apakah sesi sudah menyukai artikel ini
	var existingLike models.ArticleLike
	err = config.DB.Where("article_id = ? AND session_id = ?", article.ID, sessionID).First(&existingLike).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Belum like, lakukan like
		newLike := models.ArticleLike{
			ArticleID: article.ID,
			SessionID: sessionID,
		}
		if err := config.DB.Create(&newLike).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like article"})
			return
		}
		article.Likes += 1
		if err := config.DB.Save(&article).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update like count"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"likes":   article.Likes,
			"liked":   true,
			"message": "Article liked",
		})
	} else if err == nil {
		// Sudah like, lakukan unlike
		if err := config.DB.Delete(&existingLike).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unlike article"})
			return
		}
		if article.Likes > 0 {
			article.Likes -= 1
			if err := config.DB.Save(&article).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update like count"})
				return
			}
		}
		c.JSON(http.StatusOK, gin.H{
			"likes":   article.Likes,
			"liked":   false,
			"message": "Article unliked",
		})
	} else {
		// Error lain
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}

// GetLikeStatus mengembalikan apakah sesi saat ini sudah menyukai artikel
func GetLikeStatus(c *gin.Context) {
	id := c.Param("id")
	sessionID, err := c.Cookie("session_id")
	if err != nil || sessionID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Session ID missing"})
		return
	}

	// Validasi Article ID
	articleID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	var article models.Article
	if err := config.DB.First(&article, articleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Cek apakah sesi sudah menyukai artikel ini
	var existingLike models.ArticleLike
	err = config.DB.Where("article_id = ? AND session_id = ?", article.ID, sessionID).First(&existingLike).Error

	liked := false
	if err == nil {
		liked = true
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Error lain
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"likes": article.Likes,
		"liked": liked,
	})
}

func GetArticleDetail(c *gin.Context) {
	id := c.Param("id")

	var article models.Article
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	readTime := utils.CalculateReadingTime(strconv.Itoa(int(article.ReadingTime)))
	article.ReadingTime = readTime

	// Dapatkan session_id
	sessionID, _ := c.Cookie("session_id")
	ipAddress := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")

	// Cek apakah visitor sudah ada di tabel visitors (untuk article ini + session_id)
	var count int64
	config.DB.Model(&models.Visitor{}).
		Where("article_id = ? AND session_id = ?", article.ID, sessionID).
		Count(&count)

	if count == 0 {
		// Tambah 1 view
		article.ViewCount++
		config.DB.Save(&article)

		// Simpan ke tabel visitors
		v := models.Visitor{
			ArticleId: uint(int(article.ID)),
			SessionId: sessionID,
			IpAddress: ipAddress,
			UserAgent: userAgent,
		}
		config.DB.Create(&v)
	}

	c.JSON(http.StatusOK, article)
}

func GetArticlesWithFilter(c *gin.Context) {
	search := c.Query("search")
	category := c.Query("category")
	tags := c.Query("tags") // "tag1,tag2"
	limitStr := c.Query("limit")
	pageStr := c.Query("page")

	// Default limit & page
	limit := 10
	page := 1
	if limitStr != "" {
		if val, err := strconv.Atoi(limitStr); err == nil {
			limit = val
		}
	}
	if pageStr != "" {
		if val, err := strconv.Atoi(pageStr); err == nil {
			page = val
		}
	}
	offset := (page - 1) * limit

	db := config.DB.Model(&models.Article{})

	// Filter search (cari di title atau content)
	if search != "" {
		db = db.Where("title LIKE ? OR content LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Filter category
	if category != "" {
		db = db.Where("category = ?", category)
	}
	// Filter tags -> misal user masukkan "golang,react"
	if tags != "" {
		tagList := strings.Split(tags, ",")
		// Contoh: filter yang mengandung semua tag tersebut:
		for _, t := range tagList {
			t = strings.TrimSpace(t)
			db = db.Where("FIND_IN_SET(?, tags)", t)
		}
	}

	var total int64
	db.Count(&total)

	var articles []models.Article
	if err := db.Limit(limit).Offset(offset).Find(&articles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	c.JSON(http.StatusOK, gin.H{
		"data":       articles,
		"total_data": total,
		"page":       page,
		"limit":      limit,
		"total_page": totalPages,
	})
}
