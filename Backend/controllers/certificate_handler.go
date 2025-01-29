package controllers

import (
	"fmt"
	_ "fmt"
	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
	"net/http"
	"os"
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
	fmt.Println("Hit Create Certificate")
	title := c.PostForm("title")
	publisher := c.PostForm("publisher")
	category := c.PostForm("category")
	skills := c.PostForm("skills")
	description := c.PostForm("description")
	verificationLink := c.PostForm("verification_link")

	// Contoh parsing issue month/year
	issueMonth, _ := strconv.Atoi(c.PostForm("issue_month"))
	issueYear, _ := strconv.Atoi(c.PostForm("issue_year"))

	// End date optional
	var endMonth, endYear *int
	endMonthStr := c.PostForm("end_month")
	endYearStr := c.PostForm("end_year")
	if endMonthStr != "" && endYearStr != "" {
		em, _ := strconv.Atoi(endMonthStr)
		ey, _ := strconv.Atoi(endYearStr)
		endMonth = &em
		endYear = &ey
	}

	fmt.Println("Check Certificate Folder Uploads")
	if err := os.MkdirAll("uploads/certificate", os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads folder"})
		return
	}

	fmt.Println("Input Data images")
	// Mengambil beberapa file
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
		return
	}
	files := form.File["images"] // array input name="images"

	var fileNames []string
	for _, f := range files {
		filename := utils.GenerateFileName("certificate", f.Filename)
		path := "uploads/certificate/" + filename
		if err := c.SaveUploadedFile(f, path); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}
		fileNames = append(fileNames, filename)
	}

	// Gabungkan jadi satu string "img1.jpg,img2.png"
	imagesStr := strings.Join(fileNames, ",")

	certificate := models.Certificate{
		Title:            title,
		Publisher:        publisher,
		Category:         category,
		Skills:           skills,
		Description:      description,
		VerificationLink: verificationLink,
		IssueMonth:       issueMonth,
		IssueYear:        issueYear,
		EndMonth:         endMonth,
		EndYear:          endYear,
		Images:           imagesStr,
	}

	fmt.Println("Certificate Input")
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

	// 1) Cari certificate existing
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Certificate not found"})
		return
	}

	// 2) Ambil data text
	title := c.PostForm("title")
	publisher := c.PostForm("publisher")
	category := c.PostForm("category")
	skills := c.PostForm("skills")
	description := c.PostForm("description")
	verificationLink := c.PostForm("verification_link")

	issueMonth, _ := strconv.Atoi(c.PostForm("issue_month"))
	issueYear, _ := strconv.Atoi(c.PostForm("issue_year"))
	var endMonth, endYear *int
	endMonthStr := c.PostForm("end_month")
	endYearStr := c.PostForm("end_year")
	if endMonthStr != "" && endYearStr != "" {
		em, _ := strconv.Atoi(endMonthStr)
		ey, _ := strconv.Atoi(endYearStr)
		endMonth = &em
		endYear = &ey
	}

	// 3) Ambil file baru (jika ada)
	form, err := c.MultipartForm()
	if err != nil && err != http.ErrNotMultipart {
		// Jika memang form-data error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
		return
	}

	var newFiles []string
	if form != nil {
		files := form.File["images"] // input name="images"
		// 4) Jika user upload file baru, REPLACE
		if len(files) > 0 {
			// Hapus file lama di disk
			oldImages := strings.Split(cert.Images, ",")
			for _, old := range oldImages {
				if old != "" {
					os.Remove("uploads/certificate/" + old)
				}
			}

			// Upload file baru
			for _, file := range files {
				filename := utils.GenerateFileName("certificate", file.Filename)
				path := "uploads/certificate/" + filename
				if err := c.SaveUploadedFile(file, path); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
					return
				}
				newFiles = append(newFiles, filename)
			}
		}
	}

	// 5) Update field
	cert.Title = title
	cert.Publisher = publisher
	cert.Category = category
	cert.Skills = skills
	cert.Description = description
	cert.VerificationLink = verificationLink
	cert.IssueMonth = issueMonth
	cert.IssueYear = issueYear
	cert.EndMonth = endMonth
	cert.EndYear = endYear

	// 6) Jika ada file baru, ganti
	if len(newFiles) > 0 {
		cert.Images = strings.Join(newFiles, ",")
	}
	// else keep old images

	// 7) Simpan ke DB
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

	// Hapus file fisik
	if cert.Images != "" {
		oldImages := strings.Split(cert.Images, ",")
		for _, img := range oldImages {
			if img != "" {
				os.Remove("uploads/certificate/" + img)
			}
		}
	}

	// Hapus data di DB
	if err := config.DB.Delete(&cert).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Certificate deleted"})
}
