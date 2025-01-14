package main

import (
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/routes"
	"log"
)

func main() {
	config.InitDB()

	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Article{},
		&models.Certificate{},
		&models.Comments{},
	)

	if err != nil {
		log.Fatalf("Failed to AutoMigrate : %v", err)
	}

	r := routes.SetupRoutes()
	r.Run()
}
