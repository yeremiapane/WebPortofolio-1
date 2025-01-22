package models

import "time"

type Article struct {
	ID          uint   `gorm:"primary_key"`
	Title       string `gorm:"not null"`
	Publisher   string `gorm:"not null"`
	MainImage   string
	Images      string `gorm:"type:longtext"`
	Category    string
	Tags        string
	Description string `gorm:"type:mediumtext"`
	Content     string `gorm:"type:longtext"`
	Likes       int    `gorm:"default:0"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	ViewCount   int `gorm:"default:0"`
	ReadingTime int `gorm:"default:0"`
}
