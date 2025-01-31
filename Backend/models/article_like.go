package models

import "time"

type ArticleLike struct {
	ID        uint   `gorm:"primaryKey"`
	ArticleID uint   `gorm:"not null;index"`
	SessionID string `gorm:"not null;index"`
	CreatedAt time.Time
	Article   Article `gorm:"foreignKey:ArticleID;constraint:OnDelete:CASCADE;"`
}
