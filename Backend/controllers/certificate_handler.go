package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"net/http"
	"time"
)

type CertificateInput struct {
	Title            string   `json:"title" binding:"required"`
	Publisher        string   `json:"publisher" binding:"required"`
	Images           []string `json:"images"`     // array URL
	StartMonth       string   `json:"startMonth"` // "MM" (opsional)
	StartYear        string   `json:"startYear"`  // "YYYY" (opsional)
	EndMonth         string   `json:"endMonth"`
	EndYear          string   `json:"endYear"`
	Description      string   `json:"description"`
	VerificationLink string   `json:"verificationLink"`
	Category         string   `json:"category"`
	Skills           string   `json:"skills"` // "Go, Docker, Kubernetes"
}

func CreateCertificate(c *gin.Context) {
	var input CertificateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	imagesJson, err := json.Marshal(input.Images)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var startDate *time.Time
	var endDate *time.Time

	if input.StartYear != "" && input.StartMonth != "" {
		parsed, err := time.Parse("2006-01-02", fmt.Sprintf("%s-%s-01", input.StartYear, input.StartMonth))
		if err == nil {
			startDate = &parsed
		}
	}
	if input.EndYear != "" && input.EndMonth != "" {
		parsed, err := time.Parse("2006-01-02", fmt.Sprintf("%s-%s-01", input.EndYear, input.EndMonth))
		if err == nil {
			endDate = &parsed
		}
	}

	newCert := models.Certificate{
		Title:       input.Title,
		Publisher:   input.Publisher,
		Images:      string(imagesJson),
		StartDate:   startDate,
		EndDate:     endDate, // boleh null
		Description: input.Description,
		Category:    input.Category,
		Skills:      input.Skills,
	}

	if input.VerificationLink != "" {
		newCert.VerificationLink = &input.VerificationLink
	}

	if err := config.DB.Create(&newCert).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, newCert)

}

func GetAllCertificates(c *gin.Context) {
	var certs []models.Certificate
	if err := config.DB.Find(&certs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// opsional: decode images JSON
	c.JSON(http.StatusOK, certs)
}

func GetCertificateByID(c *gin.Context) {
	id := c.Param("id")
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Certificate not found"})
		return
	}
	c.JSON(http.StatusOK, cert)
}

func UpdateCertificate(c *gin.Context) {
	id := c.Param("id")
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Certificate not found"})
		return
	}

	var input CertificateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Proses sama seperti create
	imagesJSON, _ := json.Marshal(input.Images)

	var startDate *time.Time
	var endDate *time.Time
	if input.StartYear != "" && input.StartMonth != "" {
		parsed, _ := time.Parse("2006-01-02", fmt.Sprintf("%s-%s-01", input.StartYear, input.StartMonth))
		startDate = &parsed
	}
	if input.EndYear != "" && input.EndMonth != "" {
		parsed, _ := time.Parse("2006-01-02", fmt.Sprintf("%s-%s-01", input.EndYear, input.EndMonth))
		endDate = &parsed
	}

	cert.Title = input.Title
	cert.Publisher = input.Publisher
	cert.Images = string(imagesJSON)
	cert.StartDate = startDate
	cert.EndDate = endDate
	cert.Description = input.Description
	cert.Category = input.Category
	cert.Skills = input.Skills
	if input.VerificationLink != "" {
		cert.VerificationLink = &input.VerificationLink
	} else {
		cert.VerificationLink = nil
	}

	if err := config.DB.Save(&cert).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cert)
}

func DeleteCertificate(c *gin.Context) {
	id := c.Param("id")
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Certificate not found"})
		return
	}
	if err := config.DB.Delete(&cert).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Certificate deleted"})
}
