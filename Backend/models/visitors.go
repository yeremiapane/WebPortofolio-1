package models

import "time"

type Visitor struct {
	ID        uint   `gorm:"primaryKey"`
	ArticleId uint   `gorm:"not null;index"`
	SessionId string `gorm:"not null;index"`
	IpAddress string
	UserAgent string
	CreatedAt time.Time
	Article   Article `gorm:"foreignKey:ArticleId;constraint:OnDelete:CASCADE;"`
}
