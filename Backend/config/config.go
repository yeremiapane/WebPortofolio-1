package config

import (
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func InitDB() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found using system environment variables")
	}
	dbDsn := os.Getenv("DB_CONNECTION_STRING")
	if dbDsn == "" {
		log.Fatal("DB_CONNECTION_STRING environment variable not set")
	}
	db, err := gorm.Open(mysql.Open(dbDsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect db : ", err)
	}

	DB = db
}
