package utils

import (
	"regexp"
)

// CountWords menghitung jumlah kata dalam string
func CountWords(text string) int {
	// Hapus tag HTML, dsb. (jika perlu)
	// Sederhana: split spasi
	// Bisa juga pakai regex
	re := regexp.MustCompile(`\S+`)
	words := re.FindAllString(text, -1)
	return len(words)
}

// CalculateReadingTime (misal 200 kata / menit)
func CalculateReadingTime(text string) int {
	wordsCount := CountWords(text)
	readingTime := wordsCount / 200
	if readingTime < 1 {
		readingTime = 1 // minimal 1 menit
	}
	return readingTime
}
