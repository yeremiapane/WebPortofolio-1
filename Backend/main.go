package main

import (
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/routes"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
	"log"
)

func main() {
	config.InitConfig()
	utils.InitLogger()
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Article{},
		&models.Certificate{},
		&models.Comments{},
		&models.Visitor{},
		&models.ArticleLike{},
	)

	if err != nil {
		log.Fatalf("Failed to AutoMigrate : %v", err)
	}

	r := routes.SetupRoutes()
	r.Run()
}
