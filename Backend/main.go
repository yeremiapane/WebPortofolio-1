package main

import (
	"log"

	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/routes"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
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
		&models.Portfolio{},
		&models.TechnologyStack{},
		&models.TechItem{},
		&models.ProjectImage{},
		&models.CustomSection{},
		&models.CustomSectionItem{},
		&models.ProjectStat{},
		&models.ProjectInfo{},
	)

	if err != nil {
		log.Fatalf("Failed to AutoMigrate : %v", err)
	}

	r := routes.SetupRoutes()
	r.Run()
}
