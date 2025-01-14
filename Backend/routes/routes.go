package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter"
	gincache "github.com/ulule/limiter/drivers/middleware/gin"
	"github.com/ulule/limiter/drivers/store/memory"
	"github.com/yeremiapane/WebPortofolio-1/Backend/controllers"
	"github.com/yeremiapane/WebPortofolio-1/Backend/middleware"
	"log"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// CORS
	r.Use(middleware.CORSMiddleware())

	// Rate-limiting: 50 request / jam
	rate, err := limiter.NewRateFromFormatted("50-H")
	if err != nil {
		log.Fatalf("Failed to parse rate : %v", err)
	}
	store := memory.NewStore()

	// Ganti nama variabel
	rateLimitMiddleware := gincache.NewMiddleware(limiter.New(store, rate))
	r.Use(rateLimitMiddleware)

	// Public routes
	r.POST("/login", controllers.Login)
	r.POST("/register", controllers.RegisterAdmin)

	// Certificate
	r.GET("/certificates", controllers.GetAllCertificates)
	r.GET("/certificates/:id", controllers.GetCertificateByID)

	// Articles
	r.GET("/articles", controllers.GetAllArticles)
	r.GET("/articles/:id", controllers.GetArticleByID)
	r.POST("/comments", controllers.CreateComment) // komentar publik

	// Group admin, pakai AuthMiddleware
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	{
		// CRUD Certificate
		admin.POST("/certificates", controllers.CreateCertificate)
		admin.PUT("/certificates/:id", controllers.UpdateCertificate)
		admin.DELETE("/certificates/:id", controllers.DeleteCertificate)

		// CRUD Article
		admin.POST("/articles", controllers.CreateArticle)
		admin.PUT("/articles/:id", controllers.UpdateArticle)
		admin.DELETE("/articles/:id", controllers.DeleteArticle)
		admin.POST("/articles/:id/like", controllers.LikeArticle)

		// Comments moderation
		admin.GET("/articles/:articleID/comments", controllers.GetCommentsByArticle)
		admin.PUT("/comments/:id/moderate", controllers.ModerateComment)
	}

	return r
}
