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
	Email     string `json:"email"`
	Content   string `json:"content" binding:"required"`
}

// Tambah komentar (public)
func CreateComment(c *gin.Context) {
	var input CommentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// cek article exist
	var article models.Article
	if err := config.DB.First(&article, input.ArticleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	comment := models.Comments{
		ArticleID: input.ArticleID,
		Name:      input.Name,
		Email:     input.Email,
		Content:   input.Content,
		// isApproved default false
	}

	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
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

// Moderasi komentar: Approve/Reject
func ModerateComment(c *gin.Context) {
	id := c.Param("id")
	action := c.Query("action") // ?action=approve / ?action=reject

	var comment models.Comments
	if err := config.DB.First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	switch action {
	case "approve":
		comment.IsApproved = true
	case "reject":
		// bisa hapus atau tandai
		if err := config.DB.Delete(&comment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Comment rejected and removed"})
		return
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
		return
	}

	if err := config.DB.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comment)
}
