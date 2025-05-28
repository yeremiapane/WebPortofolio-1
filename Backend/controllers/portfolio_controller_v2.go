package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"github.com/yeremiapane/WebPortofolio-1/Backend/utils"
	"gorm.io/gorm"
)

// GetAllPortfoliosV2 retrieves all portfolios with enhanced structure
func GetAllPortfoliosV2(c *gin.Context) {
	var portfolios []models.Portfolio
	var total int64

	// Get pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	category := c.Query("category")
	search := c.Query("search")

	offset := (page - 1) * limit

	// Build query
	query := config.DB.Model(&models.Portfolio{})

	// Apply filters
	if category != "" {
		query = query.Where("category = ?", category)
	}

	if search != "" {
		query = query.Where("title LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Get total count
	query.Count(&total)

	// Get portfolios with preloaded relationships
	result := query.Preload("TechnologyStacks.Items").
		Preload("ProjectGallery").
		Preload("CustomSections.Items").
		Preload("ProjectStats").
		Preload("ProjectInfo").
		Offset(offset).
		Limit(limit).
		Order("created_at DESC").
		Find(&portfolios)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch portfolios",
			"message": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": portfolios,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// GetPortfolioByIDV2 retrieves a single portfolio by ID with enhanced structure
func GetPortfolioByIDV2(c *gin.Context) {
	id := c.Param("id")
	var portfolio models.Portfolio

	result := config.DB.Preload("TechnologyStacks.Items").
		Preload("ProjectGallery").
		Preload("CustomSections.Items").
		Preload("ProjectStats").
		Preload("ProjectInfo").
		First(&portfolio, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Portfolio not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch portfolio",
			"message": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": portfolio,
	})
}

// CreatePortfolioV2 creates a new portfolio with enhanced structure
func CreatePortfolioV2(c *gin.Context) {
	var req models.PortfolioRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request body",
			"message": err.Error(),
		})
		return
	}

	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Start transaction
	tx := config.DB.Begin()

	// Create main portfolio
	portfolio := models.Portfolio{
		Title:       req.Title,
		ImageURL:    req.ImageURL,
		Description: req.Description,
		LiveDemoURL: req.LiveDemoURL,
		GithubURL:   req.GithubURL,
		Overview:    req.Overview,
		Category:    req.Category,
		ProjectTime: req.ProjectTime,
	}

	if err := tx.Create(&portfolio).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create portfolio",
			"message": err.Error(),
		})
		return
	}

	// Create technology stacks
	for _, techStackReq := range req.TechnologyStacks {
		techStack := models.TechnologyStack{
			PortfolioID: portfolio.ID,
			Category:    techStackReq.Category,
		}

		if err := tx.Create(&techStack).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create technology stack",
				"message": err.Error(),
			})
			return
		}

		// Create tech items
		for _, itemReq := range techStackReq.Items {
			techItem := models.TechItem{
				TechnologyStackID: techStack.ID,
				Name:              itemReq.Name,
				Version:           itemReq.Version,
				Description:       itemReq.Description,
			}

			if err := tx.Create(&techItem).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to create tech item",
					"message": err.Error(),
				})
				return
			}
		}
	}

	// Create project gallery
	for _, imageReq := range req.ProjectGallery {
		// Only create gallery item if image_url is not empty
		if imageReq.ImageURL != "" {
			projectImage := models.ProjectImage{
				PortfolioID: portfolio.ID,
				ImageURL:    imageReq.ImageURL,
				Title:       imageReq.Title,
				Description: imageReq.Description,
				Order:       imageReq.Order,
			}

			if err := tx.Create(&projectImage).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to create project image",
					"message": err.Error(),
				})
				return
			}
		}
	}

	// Create custom sections
	for _, sectionReq := range req.CustomSections {
		customSection := models.CustomSection{
			PortfolioID: portfolio.ID,
			Title:       sectionReq.Title,
			SectionType: sectionReq.SectionType,
			Order:       sectionReq.Order,
		}

		if err := tx.Create(&customSection).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create custom section",
				"message": err.Error(),
			})
			return
		}

		// Create custom section items
		for _, itemReq := range sectionReq.Items {
			sectionItem := models.CustomSectionItem{
				CustomSectionID: customSection.ID,
				Title:           itemReq.Title,
				Description:     itemReq.Description,
				ImageURL:        itemReq.ImageURL,
				Tag:             itemReq.Tag,
				Order:           itemReq.Order,
			}

			if err := tx.Create(&sectionItem).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to create custom section item",
					"message": err.Error(),
				})
				return
			}
		}
	}

	// Create project stats
	for _, statReq := range req.ProjectStats {
		projectStat := models.ProjectStat{
			PortfolioID: portfolio.ID,
			Label:       statReq.Label,
			Value:       statReq.Value,
			Icon:        statReq.Icon,
			Order:       statReq.Order,
		}

		if err := tx.Create(&projectStat).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create project stat",
				"message": err.Error(),
			})
			return
		}
	}

	// Create project info
	for _, infoReq := range req.ProjectInfo {
		projectInfo := models.ProjectInfo{
			PortfolioID: portfolio.ID,
			Label:       infoReq.Label,
			Value:       infoReq.Value,
			Order:       infoReq.Order,
		}

		if err := tx.Create(&projectInfo).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create project info",
				"message": err.Error(),
			})
			return
		}
	}

	// Commit transaction
	tx.Commit()

	// Fetch the created portfolio with all relationships
	var createdPortfolio models.Portfolio
	config.DB.Preload("TechnologyStacks.Items").
		Preload("ProjectGallery").
		Preload("CustomSections.Items").
		Preload("ProjectStats").
		Preload("ProjectInfo").
		First(&createdPortfolio, portfolio.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Portfolio created successfully",
		"data":    createdPortfolio,
	})
}

// UpdatePortfolioV2 updates an existing portfolio with enhanced structure
func UpdatePortfolioV2(c *gin.Context) {
	id := c.Param("id")
	var req models.PortfolioRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request body",
			"message": err.Error(),
		})
		return
	}

	// Validate request
	if err := utils.ValidateStruct(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Check if portfolio exists
	var existingPortfolio models.Portfolio
	if err := config.DB.First(&existingPortfolio, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Portfolio not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch portfolio",
			"message": err.Error(),
		})
		return
	}

	// Start transaction
	tx := config.DB.Begin()

	// Update main portfolio
	portfolio := models.Portfolio{
		Title:       req.Title,
		ImageURL:    req.ImageURL,
		Description: req.Description,
		LiveDemoURL: req.LiveDemoURL,
		GithubURL:   req.GithubURL,
		Overview:    req.Overview,
		Category:    req.Category,
		ProjectTime: req.ProjectTime,
	}

	if err := tx.Model(&existingPortfolio).Updates(portfolio).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update portfolio",
			"message": err.Error(),
		})
		return
	}

	// Delete existing related data
	tx.Where("portfolio_id = ?", existingPortfolio.ID).Delete(&models.TechnologyStack{})
	tx.Where("portfolio_id = ?", existingPortfolio.ID).Delete(&models.ProjectImage{})
	tx.Where("portfolio_id = ?", existingPortfolio.ID).Delete(&models.CustomSection{})
	tx.Where("portfolio_id = ?", existingPortfolio.ID).Delete(&models.ProjectStat{})
	tx.Where("portfolio_id = ?", existingPortfolio.ID).Delete(&models.ProjectInfo{})

	// Recreate all related data (same logic as create)
	// Technology stacks
	for _, techStackReq := range req.TechnologyStacks {
		techStack := models.TechnologyStack{
			PortfolioID: existingPortfolio.ID,
			Category:    techStackReq.Category,
		}

		if err := tx.Create(&techStack).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create technology stack",
				"message": err.Error(),
			})
			return
		}

		for _, itemReq := range techStackReq.Items {
			techItem := models.TechItem{
				TechnologyStackID: techStack.ID,
				Name:              itemReq.Name,
				Version:           itemReq.Version,
				Description:       itemReq.Description,
			}

			if err := tx.Create(&techItem).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to create tech item",
					"message": err.Error(),
				})
				return
			}
		}
	}

	// Project gallery
	for _, imageReq := range req.ProjectGallery {
		// Only create gallery item if image_url is not empty
		if imageReq.ImageURL != "" {
			projectImage := models.ProjectImage{
				PortfolioID: existingPortfolio.ID,
				ImageURL:    imageReq.ImageURL,
				Title:       imageReq.Title,
				Description: imageReq.Description,
				Order:       imageReq.Order,
			}

			if err := tx.Create(&projectImage).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to create project image",
					"message": err.Error(),
				})
				return
			}
		}
	}

	// Custom sections
	for _, sectionReq := range req.CustomSections {
		customSection := models.CustomSection{
			PortfolioID: existingPortfolio.ID,
			Title:       sectionReq.Title,
			SectionType: sectionReq.SectionType,
			Order:       sectionReq.Order,
		}

		if err := tx.Create(&customSection).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create custom section",
				"message": err.Error(),
			})
			return
		}

		for _, itemReq := range sectionReq.Items {
			sectionItem := models.CustomSectionItem{
				CustomSectionID: customSection.ID,
				Title:           itemReq.Title,
				Description:     itemReq.Description,
				ImageURL:        itemReq.ImageURL,
				Tag:             itemReq.Tag,
				Order:           itemReq.Order,
			}

			if err := tx.Create(&sectionItem).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to create custom section item",
					"message": err.Error(),
				})
				return
			}
		}
	}

	// Project stats
	for _, statReq := range req.ProjectStats {
		projectStat := models.ProjectStat{
			PortfolioID: existingPortfolio.ID,
			Label:       statReq.Label,
			Value:       statReq.Value,
			Icon:        statReq.Icon,
			Order:       statReq.Order,
		}

		if err := tx.Create(&projectStat).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create project stat",
				"message": err.Error(),
			})
			return
		}
	}

	// Project info
	for _, infoReq := range req.ProjectInfo {
		projectInfo := models.ProjectInfo{
			PortfolioID: existingPortfolio.ID,
			Label:       infoReq.Label,
			Value:       infoReq.Value,
			Order:       infoReq.Order,
		}

		if err := tx.Create(&projectInfo).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create project info",
				"message": err.Error(),
			})
			return
		}
	}

	// Commit transaction
	tx.Commit()

	// Fetch the updated portfolio with all relationships
	var updatedPortfolio models.Portfolio
	config.DB.Preload("TechnologyStacks.Items").
		Preload("ProjectGallery").
		Preload("CustomSections.Items").
		Preload("ProjectStats").
		Preload("ProjectInfo").
		First(&updatedPortfolio, existingPortfolio.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Portfolio updated successfully",
		"data":    updatedPortfolio,
	})
}

// UploadPortfolioHeroImage handles hero image upload for portfolio
func UploadPortfolioHeroImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No file uploaded",
		})
		return
	}

	// Validate file size
	if file.Size > utils.GetMaxFileSize() {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "File too large. Maximum size is 5MB",
		})
		return
	}

	// Validate file type
	if !utils.IsValidImageType(file.Header.Get("Content-Type")) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed",
		})
		return
	}

	// Generate unique filename
	filename := utils.GenerateUniqueFilename(file.Filename)
	uploadPath := "uploads/portfolio/" + filename

	// Save file
	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save file",
		})
		return
	}

	// Return file URL
	fileURL := "/uploads/portfolio/" + filename
	c.JSON(http.StatusOK, gin.H{
		"message": "Hero image uploaded successfully",
		"url":     fileURL,
	})
}

// UploadPortfolioGalleryImage handles gallery image upload for portfolio
func UploadPortfolioGalleryImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No file uploaded",
		})
		return
	}

	// Validate file size
	if file.Size > utils.GetMaxFileSize() {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "File too large. Maximum size is 5MB",
		})
		return
	}

	// Validate file type
	if !utils.IsValidImageType(file.Header.Get("Content-Type")) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed",
		})
		return
	}

	// Generate unique filename
	filename := utils.GenerateUniqueFilename(file.Filename)
	uploadPath := "uploads/portfolio/" + filename

	// Save file
	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save file",
		})
		return
	}

	// Return file URL
	fileURL := "/uploads/portfolio/" + filename
	c.JSON(http.StatusOK, gin.H{
		"message": "Gallery image uploaded successfully",
		"url":     fileURL,
	})
}

// CreatePortfolioWithFiles creates portfolio with file uploads (multipart form)
func CreatePortfolioWithFiles(c *gin.Context) {
	// Parse multipart form
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil { // 32MB max
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse multipart form",
		})
		return
	}

	// Get form data
	title := c.PostForm("title")
	description := c.PostForm("description")
	overview := c.PostForm("overview")
	category := c.PostForm("category")
	projectTime := c.PostForm("project_time")
	liveDemoURL := c.PostForm("live_demo_url")
	githubURL := c.PostForm("github_url")

	// Validate required fields
	if title == "" || description == "" || overview == "" || category == "" || projectTime == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Missing required fields: title, description, overview, category, project_time",
		})
		return
	}

	var heroImageURL string

	// Handle hero image upload
	heroImage, err := c.FormFile("hero_image")
	if err == nil {
		// Validate file
		if heroImage.Size > utils.GetMaxFileSize() {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Hero image too large. Maximum size is 5MB",
			})
			return
		}

		if !utils.IsValidImageType(heroImage.Header.Get("Content-Type")) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid hero image type. Only JPEG, PNG, WebP and GIF are allowed",
			})
			return
		}

		// Save hero image
		filename := utils.GenerateUniqueFilename(heroImage.Filename)
		uploadPath := "uploads/portfolio/" + filename
		if err := c.SaveUploadedFile(heroImage, uploadPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save hero image",
			})
			return
		}
		heroImageURL = "/uploads/portfolio/" + filename
	} else {
		// If no file uploaded, check if URL is provided
		heroImageURL = c.PostForm("image_url")
		if heroImageURL == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Either hero_image file or image_url must be provided",
			})
			return
		}
	}

	// Start transaction
	tx := config.DB.Begin()

	// Create main portfolio
	portfolio := models.Portfolio{
		Title:       title,
		ImageURL:    heroImageURL,
		Description: description,
		Overview:    overview,
		Category:    category,
		ProjectTime: projectTime,
	}

	// Set optional fields
	if liveDemoURL != "" {
		portfolio.LiveDemoURL = &liveDemoURL
	}
	if githubURL != "" {
		portfolio.GithubURL = &githubURL
	}

	if err := tx.Create(&portfolio).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create portfolio",
			"message": err.Error(),
		})
		return
	}

	// Handle technologies data
	technologiesJSON := c.PostForm("technologies")
	fmt.Printf("Technologies JSON received: %s\n", technologiesJSON)
	if technologiesJSON != "" {
		var techData map[string][]map[string]interface{}
		if err := json.Unmarshal([]byte(technologiesJSON), &techData); err != nil {
			fmt.Printf("Error unmarshaling technologies: %v\n", err)
		} else {
			fmt.Printf("Parsed tech data: %+v\n", techData)
			for category, items := range techData {
				fmt.Printf("Processing category: %s with %d items\n", category, len(items))
				if len(items) > 0 {
					// Create technology stack
					techStack := models.TechnologyStack{
						PortfolioID: portfolio.ID,
						Category:    category,
					}

					if err := tx.Create(&techStack).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{
							"error": "Failed to create technology stack",
						})
						return
					}
					fmt.Printf("Created tech stack for category: %s with ID: %d\n", category, techStack.ID)

					// Create tech items
					for _, item := range items {
						name, _ := item["name"].(string)
						fmt.Printf("Processing tech item: %s\n", name)
						if name != "" {
							techItem := models.TechItem{
								TechnologyStackID: techStack.ID,
								Name:              name,
							}

							if version, ok := item["version"].(string); ok && version != "" {
								techItem.Version = &version
							}

							if description, ok := item["description"].(string); ok && description != "" {
								techItem.Description = &description
							}

							if err := tx.Create(&techItem).Error; err != nil {
								tx.Rollback()
								c.JSON(http.StatusInternalServerError, gin.H{
									"error": "Failed to create tech item",
								})
								return
							}
							fmt.Printf("Created tech item: %s\n", name)
						}
					}
				}
			}
		}
	}

	// Handle gallery data
	galleryJSON := c.PostForm("gallery")
	if galleryJSON != "" {
		var galleryData []map[string]interface{}
		if err := json.Unmarshal([]byte(galleryJSON), &galleryData); err == nil {
			for i, item := range galleryData {
				title, _ := item["title"].(string)
				description, _ := item["description"].(string)
				order := i + 1
				if orderFloat, ok := item["order"].(float64); ok {
					order = int(orderFloat)
				}

				// Handle gallery image file
				var imageURL string
				galleryImageFile, err := c.FormFile(fmt.Sprintf("gallery_image_%d", i))
				if err == nil {
					// Validate and save gallery image
					if galleryImageFile.Size > utils.GetMaxFileSize() {
						tx.Rollback()
						c.JSON(http.StatusBadRequest, gin.H{
							"error": "Gallery image too large. Maximum size is 5MB",
						})
						return
					}

					filename := utils.GenerateUniqueFilename(galleryImageFile.Filename)
					uploadPath := "uploads/portfolio/" + filename
					if err := c.SaveUploadedFile(galleryImageFile, uploadPath); err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{
							"error": "Failed to save gallery image",
						})
						return
					}
					imageURL = "/uploads/portfolio/" + filename

					// Create project image record
					projectImage := models.ProjectImage{
						PortfolioID: portfolio.ID,
						ImageURL:    imageURL,
						Order:       order,
					}

					if title != "" {
						projectImage.Title = &title
					}
					if description != "" {
						projectImage.Description = &description
					}

					if err := tx.Create(&projectImage).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{
							"error": "Failed to create gallery image record",
						})
						return
					}
				}
			}
		}
	}

	// Handle custom sections data
	customSectionsJSON := c.PostForm("custom_sections")
	fmt.Printf("Custom sections JSON received: %s\n", customSectionsJSON)
	if customSectionsJSON != "" {
		var sectionsData []map[string]interface{}
		if err := json.Unmarshal([]byte(customSectionsJSON), &sectionsData); err != nil {
			fmt.Printf("Error unmarshaling custom sections: %v\n", err)
		} else {
			fmt.Printf("Parsed sections data: %+v\n", sectionsData)
			for _, section := range sectionsData {
				title, _ := section["title"].(string)
				sectionType, _ := section["type"].(string)
				order := 1
				if orderFloat, ok := section["order"].(float64); ok {
					order = int(orderFloat)
				}

				fmt.Printf("Processing section: title=%s, type=%s, order=%d\n", title, sectionType, order)

				if title != "" && sectionType != "" {
					// Create custom section
					customSection := models.CustomSection{
						PortfolioID: portfolio.ID,
						Title:       title,
						SectionType: sectionType,
						Order:       order,
					}

					if err := tx.Create(&customSection).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{
							"error": "Failed to create custom section",
						})
						return
					}
					fmt.Printf("Created custom section: %s with ID: %d\n", title, customSection.ID)

					// Handle section items
					if items, ok := section["items"].([]interface{}); ok {
						fmt.Printf("Processing %d items for section: %s\n", len(items), title)
						for j, itemInterface := range items {
							if item, ok := itemInterface.(map[string]interface{}); ok {
								itemTitle, _ := item["title"].(string)
								itemDescription, _ := item["description"].(string)
								itemOrder := j + 1
								if itemOrderFloat, ok := item["order"].(float64); ok {
									itemOrder = int(itemOrderFloat)
								}

								fmt.Printf("Processing section item: title=%s, order=%d\n", itemTitle, itemOrder)

								if itemTitle != "" {
									sectionItem := models.CustomSectionItem{
										CustomSectionID: customSection.ID,
										Title:           itemTitle,
										Description:     itemDescription,
										Order:           itemOrder,
									}

									if tag, ok := item["tag"].(string); ok && tag != "" {
										sectionItem.Tag = &tag
									}

									if imageURL, ok := item["image_url"].(string); ok && imageURL != "" {
										sectionItem.ImageURL = &imageURL
									}

									if err := tx.Create(&sectionItem).Error; err != nil {
										tx.Rollback()
										c.JSON(http.StatusInternalServerError, gin.H{
											"error": "Failed to create custom section item",
										})
										return
									}
									fmt.Printf("Created section item: %s\n", itemTitle)
								}
							}
						}
					}
				}
			}
		}
	}

	// Handle project stats data
	statsJSON := c.PostForm("project_stats")
	if statsJSON != "" {
		var statsData []map[string]interface{}
		if err := json.Unmarshal([]byte(statsJSON), &statsData); err == nil {
			for _, stat := range statsData {
				label, _ := stat["label"].(string)
				value, _ := stat["value"].(string)
				order := 1
				if orderFloat, ok := stat["order"].(float64); ok {
					order = int(orderFloat)
				}

				if label != "" && value != "" {
					projectStat := models.ProjectStat{
						PortfolioID: portfolio.ID,
						Label:       label,
						Value:       value,
						Order:       order,
					}

					if icon, ok := stat["icon"].(string); ok && icon != "" {
						projectStat.Icon = &icon
					}

					if err := tx.Create(&projectStat).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{
							"error": "Failed to create project stat",
						})
						return
					}
				}
			}
		}
	}

	// Handle project info data
	infoJSON := c.PostForm("project_info")
	if infoJSON != "" {
		var infoData []map[string]interface{}
		if err := json.Unmarshal([]byte(infoJSON), &infoData); err == nil {
			for _, info := range infoData {
				label, _ := info["label"].(string)
				value, _ := info["value"].(string)
				order := 1
				if orderFloat, ok := info["order"].(float64); ok {
					order = int(orderFloat)
				}

				if label != "" && value != "" {
					projectInfo := models.ProjectInfo{
						PortfolioID: portfolio.ID,
						Label:       label,
						Value:       value,
						Order:       order,
					}

					if err := tx.Create(&projectInfo).Error; err != nil {
						tx.Rollback()
						c.JSON(http.StatusInternalServerError, gin.H{
							"error": "Failed to create project info",
						})
						return
					}
				}
			}
		}
	}

	// Commit transaction
	tx.Commit()

	// Fetch the created portfolio with all relationships
	var createdPortfolio models.Portfolio
	config.DB.Preload("TechnologyStacks.Items").
		Preload("ProjectGallery").
		Preload("CustomSections.Items").
		Preload("ProjectStats").
		Preload("ProjectInfo").
		First(&createdPortfolio, portfolio.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Portfolio created successfully with all data",
		"data":    createdPortfolio,
	})
}

// DeletePortfolio deletes a portfolio by ID
func DeletePortfolio(c *gin.Context) {
	id := c.Param("id")
	var portfolio models.Portfolio

	// Check if portfolio exists
	if err := config.DB.First(&portfolio, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Portfolio not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch portfolio",
			"message": err.Error(),
		})
		return
	}

	// Start transaction
	tx := config.DB.Begin()

	// Delete all related data first (due to foreign key constraints)
	tx.Where("portfolio_id = ?", portfolio.ID).Delete(&models.TechnologyStack{})
	tx.Where("portfolio_id = ?", portfolio.ID).Delete(&models.ProjectImage{})
	tx.Where("portfolio_id = ?", portfolio.ID).Delete(&models.CustomSection{})
	tx.Where("portfolio_id = ?", portfolio.ID).Delete(&models.ProjectStat{})
	tx.Where("portfolio_id = ?", portfolio.ID).Delete(&models.ProjectInfo{})

	// Delete the portfolio itself
	if err := tx.Delete(&portfolio).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to delete portfolio",
			"message": err.Error(),
		})
		return
	}

	// Commit transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "Portfolio deleted successfully",
	})
}

// GetPortfolioCategories retrieves all unique portfolio categories
func GetPortfolioCategories(c *gin.Context) {
	var categories []string

	result := config.DB.Model(&models.Portfolio{}).
		Distinct("category").
		Where("category IS NOT NULL AND category != ''").
		Pluck("category", &categories)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch categories",
			"message": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": categories,
	})
}
