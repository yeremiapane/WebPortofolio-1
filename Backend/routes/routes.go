package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter"
	gincache "github.com/ulule/limiter/drivers/middleware/gin"
	"github.com/ulule/limiter/drivers/store/memory"
	"log"

	"github.com/yeremiapane/WebPortofolio-1/Backend/controllers"
	"github.com/yeremiapane/WebPortofolio-1/Backend/middleware"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Middleware CORS
	r.Use(middleware.CORSMiddleware())

	// Tambahkan SessionMiddleware setelah CORS Middleware
	r.Use(middleware.SessionMiddleware())

	// Rate limiting: 100 requests per hour
	rate, err := limiter.NewRateFromFormatted("100-H")
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
	}

	// Serve file HTML untuk rute tertentu
	r.GET("/", func(c *gin.Context) {
		c.File("Frontend/user/index.html")
	})

	r.GET("/blog", func(c *gin.Context) {
		c.File("Frontend/user/article_pages.html")
	})

	r.GET("/article/:id", func(c *gin.Context) {
		c.File("Frontend/user/read_article.html")
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
