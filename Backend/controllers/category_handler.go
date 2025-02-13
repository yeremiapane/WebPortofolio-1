// controllers/category_controller.go

package controllers

import (
	config2 "github.com/yeremiapane/WebPortofolio-1/Backend/config"
	models2 "github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// GetAllCategories mengambil semua kategori unique dari tabel Article
func GetAllCategories(c *gin.Context) {
	var rawCategories []string

	// Di sini saya contohkan menggunakan DISTINCT+LOWER untuk case-insensitive
	// Atau bisa juga "SELECT DISTINCT LOWER(category) as category FROM articles"
	err := config2.DB.
		Model(&models2.Article{}).
		Select("LOWER(category) as category").
		Distinct().
		Pluck("category", &rawCategories). // Pluck hasil ke slice of string
		Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Karena Distinct di SQL belum tentu menghilangkan duplikasi secara sempurna
	// (tergantung database engine dan collation), kita bisa jaga-jaga pakai map/set
	catMap := make(map[string]bool)
	var categories []string
	for _, cat := range rawCategories {
		cat = strings.TrimSpace(cat)
		if cat == "" {
			continue
		}
		if !catMap[cat] {
			catMap[cat] = true
			categories = append(categories, cat)
		}
	}

	// (Opsional) Sort biar rapi
	// sort.Strings(categories)

	c.JSON(http.StatusOK, categories)
}
