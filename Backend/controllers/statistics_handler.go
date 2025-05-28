package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
)

func GetDashboardStats(c *gin.Context) {
	db := config.DB

	// 1) Hitung total article
	var totalArticles int64
	db.Model(&models.Article{}).Count(&totalArticles)

	// 2) Hitung total certificate
	var totalCertificates int64
	db.Model(&models.Certificate{}).Count(&totalCertificates)

	// 3) Hitung total komentar (semua status)
	var totalComments int64
	db.Model(&models.Comments{}).Count(&totalComments)

	// 4) (Opsional) Hitung komentar approved, pending, rejected
	//    jika ingin lebih detail
	var approvedComments, pendingComments, rejectedComments int64
	db.Model(&models.Comments{}).Where("status = ?", "approved").Count(&approvedComments)
	db.Model(&models.Comments{}).Where("status = ?", "pending").Count(&pendingComments)
	db.Model(&models.Comments{}).Where("status = ?", "rejected").Count(&rejectedComments)

	// 5) Sum Likes (jika Anda punya kolom `Likes` di tabel Article)
	var totalLikes int64
	db.Model(&models.Article{}).Select("SUM(likes)").Scan(&totalLikes)

	// 6) Sum Views (jika Anda punya kolom `view_count` di tabel Article)
	var totalViews int64
	db.Model(&models.Article{}).Select("SUM(view_count)").Scan(&totalViews)

	// 7) Hitung total portfolio
	var totalPortfolios int64
	db.Model(&models.Portfolio{}).Count(&totalPortfolios)

	// 8) Kembalikan respons JSON
	c.JSON(http.StatusOK, gin.H{
		"total_articles":     totalArticles,
		"total_certificates": totalCertificates,
		"total_comments":     totalComments,
		"approved_comments":  approvedComments,
		"pending_comments":   pendingComments,
		"rejected_comments":  rejectedComments,
		"total_likes":        totalLikes,
		"total_views":        totalViews,
		"total_portfolios":   totalPortfolios,
	})
}
