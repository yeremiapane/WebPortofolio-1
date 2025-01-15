package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var JWTSecret string

func InitConfig() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Ambil env
	JWTSecret = os.Getenv("JWT_SECRET")
	if JWTSecret == "" {
		log.Fatal("JWT_SECRET is not set")
	}

	dsn := os.Getenv("DB_CONNECTION_STRING")
	if dsn == "" {
		log.Fatal("DB_CONNECTION_STRING is not set")
	}

	// Koneksi MySQL
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Cannot connect to DB: %v", err)
	}

	DB = db
}
