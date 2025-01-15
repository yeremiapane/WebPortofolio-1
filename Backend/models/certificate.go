package models

import (
	"time"
)

type Certificate struct {
	ID               uint   `gorm:"primaryKey"`
	Title            string `gorm:"type:varchar(255);not null"`
	Publisher        string `gorm:"type:varchar(100);not null"`
	Images           string `gorm:"type:text"` // "img1.jpg,img2.jpg"
	IssueMonth       int
	IssueYear        int
	EndMonth         *int   `gorm:"null"` // pointer agar bisa null
	EndYear          *int   `gorm:"null"`
	Description      string `gorm:"type:text"`
	VerificationLink string `gorm:"type:varchar(255)"`
	Category         string `gorm:"type:varchar(100)"`
	Skills           string `gorm:"type:text"` // "golang,react,html"
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
