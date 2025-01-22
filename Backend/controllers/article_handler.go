package controllers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
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
	var article models.Article
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	var input ArticleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	imagesJSON, _ := json.Marshal(input.Images)

	article.Title = input.Title
	article.Publisher = input.Publisher
	article.MainImage = input.MainImage
	article.Images = string(imagesJSON)
	article.Category = input.Category
	article.Tags = input.Tags
	article.Content = input.Content
	article.Description = input.Description // <-- set field baru
	article.UpdatedAt = time.Now()

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
	os.Remove(article.MainImage)
	if err := config.DB.Delete(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Article deleted"})
}

// Fitur Like Article
func LikeArticle(c *gin.Context) {
	id := c.Param("id")
	var article models.Article
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}
	article.Likes += 1
	config.DB.Save(&article)
	c.JSON(http.StatusOK, gin.H{"likes": article.Likes})
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
