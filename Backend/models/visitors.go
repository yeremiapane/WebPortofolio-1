package models

import "time"

type Visitor struct {
	ID        uint      `gorm:"primaryKey"`
	ArticleId uint      `gorm:"not null"`
	SessionId string    `gorm:"type:varchar(100);not null"`
	IpAddress string    `gorm:"type:varchar(50)"`
	UserAgent string    `gorm:"type:text"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}
