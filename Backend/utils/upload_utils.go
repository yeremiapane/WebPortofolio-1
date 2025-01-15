package utils

import (
	"fmt"
	"time"
)

func GenerateFileName(fileType, originalName string) string {
	// Mis: "time_namafile_artikel_id"
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("%s_%s", timestamp, originalName)
}
