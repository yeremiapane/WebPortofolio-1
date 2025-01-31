package models

import "time"

type Comments struct {
	ID          uint   `gorm:"primaryKey"`
	ArticleID   uint   `gorm:"not null;index"`
	ParentID    *uint  `gorm:"null"` // Boleh null jika komentar utama
	Name        string `gorm:"size:100;not null"`
	Email       string `gorm:"size:100"` // Opsional
	Content     string `gorm:"type:text;not null"`
	Status      string `gorm:"type:enum('pending','approved','rejected');default:'pending'"`
	IsApprove   bool   `gorm:"default:false"`
	IsAnonymous bool   `gorm:"default:false"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	// Relasi ke Article
	Article Article `gorm:"foreignKey:ArticleID;constraint:OnDelete:CASCADE;"`
}
