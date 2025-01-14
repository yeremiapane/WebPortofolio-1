package models

import "time"

type User struct {
	ID            uint      `gorm:"primary_key"`
	Username      string    `gorm:"unique;not null"`
	Password_hash string    `gorm:"not null"`
	Created_at    time.Time `gorm:"autoCreateTime"`
	Updated_at    time.Time `gorm:"autoCreateTime"`
}
