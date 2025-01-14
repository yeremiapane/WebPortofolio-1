package controllers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"net/http"
	"strings"
	"time"
)

type ArticleInput struct {
	Title     string   `json:"title" binding:"required"`
	Publisher string   `json:"publisher" binding:"required"`
	MainImage string   `json:"mainImage"`
	Images    []string `json:"images"`
	Category  string   `json:"category"`
	Tags      string   `json:"tags"`    // "Go, Docker, Tips"
	Content   string   `json:"content"` // text/HTML/markdown
}

// *Helper* untuk menghitung waktu baca
func estimateReadingTime(content string) int {
	// hitung jumlah kata
	words := strings.Fields(content)
	wordCount := len(words)
	// rata-rata kecepatan baca ~200 kata/menit
	readTime := wordCount / 200
	if readTime == 0 {
		readTime = 1
	}
	return readTime
}

func CreateArticle(c *gin.Context) {
	var input ArticleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	imagesJSON, _ := json.Marshal(input.Images)

	newArticle := models.Article{
		Title:     input.Title,
		Publisher: input.Publisher,
		MainImage: input.MainImage,
		Images:    string(imagesJSON),
		Category:  input.Category,
		Tags:      input.Tags,
		Content:   input.Content,
		Likes:     0,
		// CreatedAt dan UpdatedAt otomatis oleh GORM (jika diaktifkan)
	}

	if err := config.DB.Create(&newArticle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newArticle)
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

// Mendapatkan detail artikel + perkiraan waktu baca
func GetArticleByID(c *gin.Context) {
	id := c.Param("id")
	var article models.Article
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	// Hitung waktu baca
	readTime := estimateReadingTime(article.Content)

	c.JSON(http.StatusOK, gin.H{
		"article":  article,
		"readTime": readTime, // dalam menit
	})
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
