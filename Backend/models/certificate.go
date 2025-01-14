package models

import "time"

type Certificate struct {
	ID               uint   `gorm:"primary_key"`
	Title            string `gorm:"not null"`
	Publisher        string `gorm:"not null"`
	Images           string `gorm:"type:longtext"`
	StartDate        *time.Time
	EndDate          *time.Time
	Description      string
	VerificationLink *string `gorm:"null"`
	Category         string
	Skills           string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
