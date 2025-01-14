package models

import "time"

type Comments struct {
	ID         uint `gorm:"primary_key"`
	ArticleID  uint `gorm:"not null"`
	Name       string
	Email      string
	Content    string `gorm:"type:text;not null"`
	IsApproved bool   `gorm:"default:false"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
