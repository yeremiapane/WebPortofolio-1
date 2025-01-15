package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"net/http"
)

type CommentInput struct {
	ArticleID uint   `json:"articleID" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Content   string `json:"content" binding:"required"`
	IsApprove bool   `json:"isApprove"`
}

// Tambah komentar (public)
func CreateComment(c *gin.Context) {
	articleID := c.Param("id")
	name := c.PostForm("name")
	content := c.PostForm("content")

	// Validasi ...
	var article models.Article
	if err := config.DB.First(&article, articleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	comment := models.Comments{
		ArticleID: article.ID,
		Name:      name,
		Content:   content,
		Status:    "pending",
	}
	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment submitted, pending approval"})
}

// Mendapatkan komentar yang sudah disetujui
func GetCommentsByArticle(c *gin.Context) {
	articleID := c.Param("articleID")
	var comments []models.Comments
	if err := config.DB.Where("article_id = ? AND is_approved = ?", articleID, true).Order("created_at DESC").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// Moderasi komentar: Approve
func ApproveComment(c *gin.Context) {
	id := c.Param("id")
	var comment models.Comments
	if err := config.DB.First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	comment.Status = "approved"
	config.DB.Save(&comment)
	c.JSON(http.StatusOK, comment)
}

// Moderasi komentar: Reject
func RejectComment(c *gin.Context) {
	id := c.Param("id")
	var comment models.Comments
	if err := config.DB.First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	comment.Status = "rejected"
	config.DB.Save(&comment)
	c.JSON(http.StatusOK, comment)
}

// Moderasi komentar: Reset
func ResetComment(c *gin.Context) {
	id := c.Param("id")
	var comment models.Comments
	if err := config.DB.First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	comment.Status = "pending"
	if err := config.DB.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
}
