package routes

import (
	"fmt"
	"github.com/gin-gonic/gin"
	slug2 "github.com/gosimple/slug"
	"github.com/ulule/limiter"
	gincache "github.com/ulule/limiter/drivers/middleware/gin"
	"github.com/ulule/limiter/drivers/store/memory"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"log"
	"net/http"

	"github.com/yeremiapane/WebPortofolio-1/Backend/controllers"
	"github.com/yeremiapane/WebPortofolio-1/Backend/middleware"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 50 << 20
	// Middleware CORS
	r.Use(middleware.CORSMiddleware())

	// Tambahkan SessionMiddleware setelah CORS Middleware
	r.Use(middleware.SessionMiddleware())

	// Rate limiting: 100 requests per hour
	rate, err := limiter.NewRateFromFormatted("300-H")
	if err != nil {
		log.Fatalf("Failed to parse rate : %v", err)
	}
	store := memory.NewStore()
	rateLimitMiddleware := gincache.NewMiddleware(limiter.New(store, rate))
	r.Use(rateLimitMiddleware)

	// Melayani file statis
	r.Static("/Frontend", "./Frontend")
	r.Static("/uploads", "./uploads")
	r.Static("/assets", "./Frontend/user/assets")
	r.Static("/pages", "./Frontend/user")
	r.Static("/admin_user", "./Frontend/admin/src/pages")
	r.Static("/admin_login_assets", "./Frontend/admin/src/pages/login/assets")
	r.Static("/admin_register_assets", "./Frontend/admin/src/pages/register/assets")
	r.Static("/admin_dashboard_assets", "./Frontend/admin/src/pages/dashboard/assets")
	r.Static("/admin_dashboard_pages", "./Frontend/admin/src/pages/dashboard")

	// Routing untuk API

	// Public routes
	r.POST("/login", controllers.Login)

	// Certificate routes
	r.GET("/certificates", controllers.GetAllCertificates)
	r.GET("/certificates/:id", controllers.GetCertificateByID)
	// Articles routes
	r.GET("/articles", controllers.GetAllArticles)
	r.GET("/articles/:id", controllers.GetArticleDetail)
	r.GET("/articles/filter", controllers.GetArticlesWithFilter)       // Disarankan: pisahkan query filter sebagai endpoint tersendiri
	r.POST("/articles/:id/comments", controllers.CreateOrReplyComment) // Komentar publik
	r.GET("/articles/:id/comments", controllers.GetCommentsByArticle)
	r.GET("/categories", controllers.GetAllCategories)
	r.GET("/stats", controllers.GetDashboardStats)

	// Tambahkan di bagian public routes
	r.POST("/articles/:id/toggle_like", controllers.ToggleLikeArticle)
	r.GET("/articles/:id/like_status", controllers.GetLikeStatus)

	// Admin group routes
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	{
		admin.POST("/register", controllers.RegisterAdmin)
		admin.POST("/logout", controllers.Logout)

		// CRUD Certificate
		admin.POST("/certificates", controllers.CreateCertificate)
		admin.PUT("/certificates/:id", controllers.UpdateCertificate)
		admin.DELETE("/certificates/:id", controllers.DeleteCertificate)

		// CRUD Article
		admin.POST("/articles", controllers.CreateArticle)
		admin.PUT("/articles/:id", controllers.UpdateArticle)
		admin.DELETE("/articles/:id", controllers.DeleteArticle)

		// Comments moderation
		admin.GET("/comments", controllers.GetAllAdminComments)
		admin.GET("/comments/:id", controllers.GetCommentDetail)
		admin.POST("/comments/:id/reply", controllers.ReplyComments)
		admin.GET("/articles/:id/comments", controllers.GetCommentsByArticle)
		admin.PATCH("/comments/:id/approve", controllers.ApproveComment)
		admin.PATCH("/comments/:id/reject", controllers.RejectComment)
		admin.PATCH("/comments/:id/reset", controllers.ResetComment)
		admin.DELETE("/comments/:id", controllers.DeleteComment)
	}

	// Serve file HTML untuk rute tertentu
	r.GET("/", func(c *gin.Context) {
		c.File("Frontend/user/index.html")
	})

	r.GET("/blog", func(c *gin.Context) {
		c.File("Frontend/user/article_pages.html")
	})

	r.GET("/article/:id/:slug", func(c *gin.Context) {
		c.File("Frontend/user/read_article.html")
	})

	// Route lama: Redirect ke URL baru yang menyertakan slug
	r.GET("/article/:id", func(c *gin.Context) {
		id := c.Param("id")

		// Ambil artikel dari database menggunakan ID
		var article models.Article
		if err := config.DB.First(&article, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
			return
		}

		// Misalnya, implementasikan fungsi Slugify untuk mengubah judul menjadi slug URL-friendly
		slug := slug2.Make(article.Title)

		// Buat URL baru dengan format /article/:id/:slug
		newURL := fmt.Sprintf("/article/%s/%s", id, slug)

		// Redirect ke URL baru
		c.Redirect(http.StatusMovedPermanently, newURL)
	})

	r.GET("/admin/", func(c *gin.Context) {
		c.File("Frontend/admin/src/pages/dashboard/index.html")
	})

	r.GET("/admin/login", func(c *gin.Context) {
		c.File("Frontend/admin/src/pages/login/index.html")
	})

	r.GET("/admin/register", func(c *gin.Context) {
		c.File("Frontend/admin/src/pages/register/index.html")
	})

	r.GET("/admin/dashboard", func(c *gin.Context) {
		c.File("Frontend/admin/src/pages/dashboard/index.html")
	})

	r.GET("/admin/articles", func(c *gin.Context) {
		c.File("Frontend/admin/src/pages/dashboard/write_articles.html")
	})

	// Tangani rute tak dikenal (404)
	r.NoRoute(func(c *gin.Context) {
		c.File("Frontend/user/404.html")
	})

	return r
}
