package models

import (
	"time"

	"gorm.io/gorm"
)

// Portfolio represents the main portfolio entity
type Portfolio struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"not null" validate:"required"`
	ImageURL    string         `json:"image_url" gorm:"not null" validate:"required,url"`
	Description string         `json:"description" gorm:"type:text;not null" validate:"required"`
	LiveDemoURL *string        `json:"live_demo_url" gorm:"type:varchar(500)" validate:"omitempty,url"`
	GithubURL   *string        `json:"github_url" gorm:"type:varchar(500)" validate:"omitempty,url"`
	Overview    string         `json:"overview" gorm:"type:text;not null" validate:"required"`
	Category    string         `json:"category" gorm:"not null" validate:"required,oneof=Development 'Data Analytics' 'Data Engineer'"`
	ProjectTime string         `json:"project_time" gorm:"not null" validate:"required"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Enhanced relationships
	TechnologyStacks []TechnologyStack `json:"technology_stacks" gorm:"foreignKey:PortfolioID;constraint:OnDelete:CASCADE"`
	ProjectGallery   []ProjectImage    `json:"project_gallery" gorm:"foreignKey:PortfolioID;constraint:OnDelete:CASCADE"`
	CustomSections   []CustomSection   `json:"custom_sections" gorm:"foreignKey:PortfolioID;constraint:OnDelete:CASCADE"`
	ProjectStats     []ProjectStat     `json:"project_stats" gorm:"foreignKey:PortfolioID;constraint:OnDelete:CASCADE"`
	ProjectInfo      []ProjectInfo     `json:"project_info" gorm:"foreignKey:PortfolioID;constraint:OnDelete:CASCADE"`
}

// TechnologyStack represents technology categories and their items
type TechnologyStack struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	PortfolioID uint       `json:"portfolio_id" gorm:"not null"`
	Category    string     `json:"category" gorm:"not null" validate:"required"` // e.g., "Frontend", "Backend", "Database"
	Items       []TechItem `json:"items" gorm:"foreignKey:TechnologyStackID;constraint:OnDelete:CASCADE"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// TechItem represents individual technology items within a stack
type TechItem struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	TechnologyStackID uint      `json:"technology_stack_id" gorm:"not null"`
	Name              string    `json:"name" gorm:"not null" validate:"required"`
	Version           *string   `json:"version,omitempty"`
	Description       *string   `json:"description,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// ProjectImage represents images in project gallery/documentation
type ProjectImage struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	PortfolioID uint      `json:"portfolio_id" gorm:"not null"`
	ImageURL    string    `json:"image_url" gorm:"not null" validate:"required,url"`
	Title       *string   `json:"title,omitempty"`
	Description *string   `json:"description,omitempty"`
	Order       int       `json:"order" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CustomSection represents flexible custom sections (Features, Challenges, Solutions, etc.)
type CustomSection struct {
	ID          uint                `json:"id" gorm:"primaryKey"`
	PortfolioID uint                `json:"portfolio_id" gorm:"not null"`
	Title       string              `json:"title" gorm:"not null" validate:"required"`                                 // e.g., "Challenges", "Solutions", "Features"
	SectionType string              `json:"section_type" gorm:"not null" validate:"required,oneof=list gallery mixed"` // list, gallery, mixed
	Order       int                 `json:"order" gorm:"default:0"`
	Items       []CustomSectionItem `json:"items" gorm:"foreignKey:CustomSectionID;constraint:OnDelete:CASCADE"`
	CreatedAt   time.Time           `json:"created_at"`
	UpdatedAt   time.Time           `json:"updated_at"`
}

// CustomSectionItem represents individual items within custom sections
type CustomSectionItem struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	CustomSectionID uint      `json:"custom_section_id" gorm:"not null"`
	Title           string    `json:"title" gorm:"not null" validate:"required"`
	Description     string    `json:"description" gorm:"type:text"`
	ImageURL        *string   `json:"image_url,omitempty" validate:"omitempty,url"`
	Tag             *string   `json:"tag,omitempty"` // For categorizing items (e.g., "Technical", "Business")
	Order           int       `json:"order" gorm:"default:0"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// ProjectStat represents project statistics (like in the frontend: 4 Months, 2 Team Members, etc.)
type ProjectStat struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	PortfolioID uint      `json:"portfolio_id" gorm:"not null"`
	Label       string    `json:"label" gorm:"not null" validate:"required"` // e.g., "Duration", "Team Size", "KPIs Tracked"
	Value       string    `json:"value" gorm:"not null" validate:"required"` // e.g., "4 Months", "2", "10+"
	Icon        *string   `json:"icon,omitempty"`                            // FontAwesome icon class
	Order       int       `json:"order" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ProjectInfo represents additional project information (Client, Duration, etc.)
type ProjectInfo struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	PortfolioID uint      `json:"portfolio_id" gorm:"not null"`
	Label       string    `json:"label" gorm:"not null" validate:"required"` // e.g., "Client", "Duration", "My Role"
	Value       string    `json:"value" gorm:"not null" validate:"required"` // e.g., "RetailCorp Ltd.", "4 Months"
	Order       int       `json:"order" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// PortfolioRequest represents the request structure for creating/updating portfolio
type PortfolioRequest struct {
	Title       string  `json:"title" validate:"required"`
	ImageURL    string  `json:"image_url" validate:"required,url"`
	Description string  `json:"description" validate:"required"`
	LiveDemoURL *string `json:"live_demo_url" validate:"omitempty,url"`
	GithubURL   *string `json:"github_url" validate:"omitempty,url"`
	Overview    string  `json:"overview" validate:"required"`
	Category    string  `json:"category" validate:"required,oneof=Development 'Data Analytics' 'Data Engineer'"`
	ProjectTime string  `json:"project_time" validate:"required"`

	TechnologyStacks []TechnologyStackRequest `json:"technology_stacks"`
	ProjectGallery   []ProjectImageRequest    `json:"project_gallery"`
	CustomSections   []CustomSectionRequest   `json:"custom_sections"`
	ProjectStats     []ProjectStatRequest     `json:"project_stats"`
	ProjectInfo      []ProjectInfoRequest     `json:"project_info"`
}

type TechnologyStackRequest struct {
	Category string            `json:"category" validate:"required"`
	Items    []TechItemRequest `json:"items"`
}

type TechItemRequest struct {
	Name        string  `json:"name" validate:"required"`
	Version     *string `json:"version,omitempty"`
	Description *string `json:"description,omitempty"`
}

type ProjectImageRequest struct {
	ImageURL    string  `json:"image_url" validate:"required,url"`
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Order       int     `json:"order"`
}

type CustomSectionRequest struct {
	Title       string                     `json:"title" validate:"required"`
	SectionType string                     `json:"section_type" validate:"required,oneof=list gallery mixed"`
	Order       int                        `json:"order"`
	Items       []CustomSectionItemRequest `json:"items"`
}

type CustomSectionItemRequest struct {
	Title       string  `json:"title" validate:"required"`
	Description string  `json:"description"`
	ImageURL    *string `json:"image_url,omitempty" validate:"omitempty,url"`
	Tag         *string `json:"tag,omitempty"`
	Order       int     `json:"order"`
}

type ProjectStatRequest struct {
	Label string  `json:"label" validate:"required"`
	Value string  `json:"value" validate:"required"`
	Icon  *string `json:"icon,omitempty"`
	Order int     `json:"order"`
}

type ProjectInfoRequest struct {
	Label string `json:"label" validate:"required"`
	Value string `json:"value" validate:"required"`
	Order int    `json:"order"`
}

// PortfolioResponse represents the response structure
type PortfolioResponse struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	ImageURL    string    `json:"image_url"`
	Description string    `json:"description"`
	LiveDemoURL *string   `json:"live_demo_url"`
	GithubURL   *string   `json:"github_url"`
	Overview    string    `json:"overview"`
	Category    string    `json:"category"`
	ProjectTime string    `json:"project_time"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	TechnologyStacks []TechnologyStack `json:"technology_stacks"`
	ProjectGallery   []ProjectImage    `json:"project_gallery"`
	CustomSections   []CustomSection   `json:"custom_sections"`
	ProjectStats     []ProjectStat     `json:"project_stats"`
	ProjectInfo      []ProjectInfo     `json:"project_info"`
}
