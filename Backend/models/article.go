package models

import "time"

type Article struct {
	ID        uint   `gorm:"primary_key"`
	Title     string `gorm:"not null"`
	Publisher string `gorm:"not null"`
	MainImage string
	Images    string `gorm:"type:mediumtext"`
	Category  string
	Tags      string
	Content   string `gorm:"type:longtext"`
	Likes     int    `gorm:"default:0"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
