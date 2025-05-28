package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/controllers"
	"github.com/yeremiapane/WebPortofolio-1/Backend/middleware"
)

// SetupPortfolioRoutes sets up all portfolio-related routes
func SetupPortfolioRoutes(router *gin.Engine) {
	// Public routes (no authentication required)
	publicPortfolio := router.Group("/api/portfolios")
	{
		publicPortfolio.GET("", controllers.GetAllPortfoliosV2)                // GET /api/portfolios
		publicPortfolio.GET("/:id", controllers.GetPortfolioByIDV2)            // GET /api/portfolios/:id
		publicPortfolio.GET("/categories", controllers.GetPortfolioCategories) // GET /api/portfolios/categories
	}

	// Admin routes (authentication required)
	adminPortfolio := router.Group("/api/admin/portfolios")
	adminPortfolio.Use(middleware.AuthMiddleware()) // Apply authentication middleware
	{
		adminPortfolio.GET("", controllers.GetAllPortfoliosV2)                          // GET /api/admin/portfolios (for admin dashboard)
		adminPortfolio.GET("/:id", controllers.GetPortfolioByIDV2)                      // GET /api/admin/portfolios/:id (for admin)
		adminPortfolio.POST("", controllers.CreatePortfolioV2)                          // POST /api/admin/portfolios (JSON)
		adminPortfolio.POST("/with-files", controllers.CreatePortfolioWithFiles)        // POST /api/admin/portfolios/with-files (multipart)
		adminPortfolio.PUT("/:id", controllers.UpdatePortfolioV2)                       // PUT /api/admin/portfolios/:id
		adminPortfolio.DELETE("/:id", controllers.DeletePortfolio)                      // DELETE /api/admin/portfolios/:id
		adminPortfolio.POST("/upload/hero", controllers.UploadPortfolioHeroImage)       // POST /api/admin/portfolios/upload/hero
		adminPortfolio.POST("/upload/gallery", controllers.UploadPortfolioGalleryImage) // POST /api/admin/portfolios/upload/gallery
	}
}
