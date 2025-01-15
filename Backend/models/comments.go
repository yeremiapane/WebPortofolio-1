package models

import "time"

type Comments struct {
	ID        uint   `gorm:"primaryKey"`
	ArticleID uint   `gorm:"not null"`
	Name      string `gorm:"size:100;not null"`
	Content   string `gorm:"type:text;not null"`
	Status    string `gorm:"type:enum('pending','approved','rejected');default:'pending'"`
	IsApprove bool   `gorm:"default:false"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
