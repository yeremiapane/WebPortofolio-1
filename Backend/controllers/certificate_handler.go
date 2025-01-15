package controllers

import (
	_ "fmt"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
	"net/http"
	"strconv"
	"strings"
)

type CertificateInput struct {
	Title            string   `json:"title" binding:"required"`
	Publisher        string   `json:"publisher" binding:"required"`
	Images           []string `json:"images"`     // array URL
	IssueMonth       int      `json:"issueMonth"` // "MM" (opsional)
	IssueYear        int      `json:"issueYear"`  // "YYYY" (opsional)
	EndMonth         int      `json:"endMonth"`
	EndYear          int      `json:"endYear"`
	Description      string   `json:"description"`
	VerificationLink string   `json:"verificationLink"`
	Category         string   `json:"category"`
	Skills           string   `json:"skills"` // "Go, Docker, Kubernetes"
}

func CreateCertificate(c *gin.Context) {
	title := c.PostForm("title")
	publisher := c.PostForm("publisher")
	category := c.PostForm("category")
	skills := c.PostForm("skills")
	description := c.PostForm("description")
	verificationLink := c.PostForm("verification_link")

	issueMonth, _ := strconv.Atoi(c.PostForm("issue_month"))
	issueYear, _ := strconv.Atoi(c.PostForm("issue_year"))
	endMonthStr := c.PostForm("end_month")
	endYearStr := c.PostForm("end_year")

	var endMonth, endYear *int
	if endMonthStr != "" && endYearStr != "" {
		em, _ := strconv.Atoi(endMonthStr)
		ey, _ := strconv.Atoi(endYearStr)
		endMonth = &em
		endYear = &ey
	}

	// Upload banyak file
	form, _ := c.MultipartForm()
	files := form.File["images"]

	var fileNames []string
	for _, file := range files {
		filename := utils.GenerateFileName("certificate", file.Filename)
		path := "uploads/certificate/" + filename
		if err := c.SaveUploadedFile(file, path); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		fileNames = append(fileNames, filename)
	}

	// "img1.jpg,img2.jpg"
	imagesStr := strings.Join(fileNames, ",")

	certificate := models.Certificate{
		Title:            title,
		Publisher:        publisher,
		Images:           imagesStr,
		IssueMonth:       issueMonth,
		IssueYear:        issueYear,
		EndMonth:         endMonth,
		EndYear:          endYear,
		Description:      description,
		VerificationLink: verificationLink,
		Category:         category,
		Skills:           skills,
	}

	if err := config.DB.Create(&certificate).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, certificate)
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

	// Handle image uploads
	form, _ := c.MultipartForm()
	files := form.File["images"]
	if len(files) > 0 {
		var newImages []string
		for _, file := range files {
			filename := utils.GenerateFileName("certificate", file.Filename)
			path := "uploads/certificate/" + filename
			if err := c.SaveUploadedFile(file, path); err != nil {
				utils.InfoLogger.Printf("Failed to save file image %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
				return
			}
			newImages = append(newImages, filename)
		}
		input.Images = newImages
	}

	cert.Title = input.Title
	cert.Publisher = input.Publisher
	cert.Images = strings.Join(input.Images, ",") // Convert image array to comma-separated string
	cert.IssueMonth = input.IssueMonth
	cert.IssueYear = input.IssueYear
	cert.EndMonth = &input.EndMonth
	cert.EndYear = &input.EndYear
	cert.Description = input.Description
	cert.Category = input.Category
	cert.Skills = input.Skills
	if input.VerificationLink != "" {
		cert.VerificationLink = input.VerificationLink
	} else {
		cert.VerificationLink = ""
	}

	if err := config.DB.Save(&cert).Error; err != nil {
		utils.InfoLogger.Printf("Failed to save certificate: %v", err)
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
