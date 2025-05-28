package utils

import (
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

// IsValidImageType checks if the content type is a valid image type
func IsValidImageType(contentType string) bool {
	validTypes := []string{
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
		"image/gif",
	}

	for _, validType := range validTypes {
		if contentType == validType {
			return true
		}
	}
	return false
}

// GenerateUniqueFilename generates a unique filename with timestamp and UUID
func GenerateUniqueFilename(originalFilename string) string {
	ext := filepath.Ext(originalFilename)
	name := strings.TrimSuffix(originalFilename, ext)

	// Clean the filename
	name = strings.ReplaceAll(name, " ", "_")
	name = strings.ToLower(name)

	// Generate unique identifier
	timestamp := time.Now().Unix()
	uuid := uuid.New().String()[:8]

	return fmt.Sprintf("%s_%d_%s%s", name, timestamp, uuid, ext)
}

// GetImageMimeTypes returns list of allowed image MIME types
func GetImageMimeTypes() []string {
	return []string{
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
		"image/gif",
	}
}

// GetMaxFileSize returns maximum file size in bytes (5MB)
func GetMaxFileSize() int64 {
	return 5 * 1024 * 1024 // 5MB
}
