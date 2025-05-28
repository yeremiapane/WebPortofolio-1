# Portfolio API V2 Documentation

## Overview
API V2 ini menyediakan fitur CRUD yang lebih fleksibel untuk mengelola portfolio dengan struktur yang disesuaikan dengan frontend mockup. Mendukung upload gambar, custom sections, dan dynamic fields yang lebih powerful.

## Base URL
```
http://localhost:8080
```

## Authentication
Untuk endpoint admin, diperlukan JWT token dalam header:
```
Authorization: Bearer <your-jwt-token>
```

## New Features in V2
1. **Project Gallery** - Upload multiple images untuk dokumentasi project
2. **Custom Sections** - Sections yang dapat dikustomisasi (Challenges, Solutions, Features, dll.)
3. **Project Stats** - Statistik project (Duration, Team Size, KPIs, dll.)
4. **Project Info** - Informasi tambahan project (Client, My Role, Status, dll.)
5. **Image Upload** - Endpoint khusus untuk upload gambar
6. **Flexible Section Types** - List, Gallery, atau Mixed content

## Endpoints

### 1. Get All Portfolios V2 (Public)
```
GET /api/portfolios
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Sales Performance Dashboard",
      "image_url": "https://example.com/dashboard-preview.jpg",
      "description": "Interactive business intelligence dashboard that analyzes sales trends",
      "live_demo_url": "https://demo.example.com",
      "github_url": "https://github.com/user/repo",
      "overview": "This comprehensive sales performance dashboard was developed to provide actionable insights...",
      "category": "Data Analytics",
      "project_time": "November 2023",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      
      "technology_stacks": [
        {
          "id": 1,
          "category": "Analytics",
          "items": [
            {
              "name": "Tableau",
              "version": "2023.3",
              "description": "Data visualization platform"
            },
            {
              "name": "Python",
              "version": "3.9",
              "description": "Data analysis and processing"
            }
          ]
        },
        {
          "id": 2,
          "category": "Database",
          "items": [
            {
              "name": "SQL Server",
              "version": "2019",
              "description": "Primary database"
            }
          ]
        }
      ],
      
      "project_gallery": [
        {
          "id": 1,
          "image_url": "/uploads/portfolio/main_dashboard_1234567890_abc123.jpg",
          "title": "Main Dashboard",
          "description": "Overview of key performance indicators",
          "order": 1
        },
        {
          "id": 2,
          "image_url": "/uploads/portfolio/customer_analytics_1234567890_def456.jpg",
          "title": "Customer Analytics",
          "description": "Customer segmentation and behavior analysis",
          "order": 2
        }
      ],
      
      "custom_sections": [
        {
          "id": 1,
          "title": "Key Features",
          "section_type": "list",
          "order": 1,
          "items": [
            {
              "id": 1,
              "title": "Interactive Visualizations",
              "description": "Dynamic charts and graphs with drill-down capabilities",
              "tag": null,
              "order": 1
            },
            {
              "id": 2,
              "title": "Real-time Alerts",
              "description": "Automated notifications for performance thresholds",
              "tag": null,
              "order": 2
            }
          ]
        },
        {
          "id": 2,
          "title": "Challenges & Solutions",
          "section_type": "list",
          "order": 2,
          "items": [
            {
              "id": 3,
              "title": "Data Integration",
              "description": "Integrated disparate data sources with different formats",
              "tag": "Technical",
              "order": 1
            },
            {
              "id": 4,
              "title": "Performance Optimization",
              "description": "Implemented caching mechanisms for large datasets",
              "tag": "Performance",
              "order": 2
            }
          ]
        }
      ],
      
      "project_stats": [
        {
          "id": 1,
          "label": "Months",
          "value": "4",
          "icon": "fas fa-calendar",
          "order": 1
        },
        {
          "id": 2,
          "label": "Team Members",
          "value": "2",
          "icon": "fas fa-users",
          "order": 2
        },
        {
          "id": 3,
          "label": "KPIs Tracked",
          "value": "10+",
          "icon": "fas fa-chart-line",
          "order": 3
        }
      ],
      
      "project_info": [
        {
          "id": 1,
          "label": "Client",
          "value": "RetailCorp Ltd.",
          "order": 1
        },
        {
          "id": 2,
          "label": "Duration",
          "value": "4 Months",
          "order": 2
        },
        {
          "id": 3,
          "label": "My Role",
          "value": "Lead Data Analyst",
          "order": 3
        },
        {
          "id": 4,
          "label": "Status",
          "value": "Completed",
          "order": 4
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "total_pages": 1
  }
}
```

### 2. Create Portfolio V2 (Admin Only)
```
POST /api/admin/portfolios
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Example Request Body:**
```json
{
  "title": "Sales Performance Dashboard",
  "image_url": "https://example.com/dashboard-preview.jpg",
  "description": "Interactive business intelligence dashboard that analyzes sales trends, customer behavior, and revenue optimization opportunities using advanced data visualization and statistical modeling techniques.",
  "live_demo_url": "https://demo-dashboard.example.com",
  "github_url": "https://github.com/username/sales-dashboard",
  "overview": "This comprehensive sales performance dashboard was developed to provide actionable insights into business performance across multiple dimensions. The project involved analyzing historical sales data, identifying key performance indicators, and creating interactive visualizations that enable stakeholders to make data-driven decisions.",
  "category": "Data Analytics",
  "project_time": "November 2023",
  
  "technology_stacks": [
    {
      "category": "Analytics",
      "items": [
        {
          "name": "Tableau",
          "version": "2023.3",
          "description": "Primary data visualization platform"
        },
        {
          "name": "Python",
          "version": "3.9",
          "description": "Data analysis and processing"
        },
        {
          "name": "Pandas",
          "version": "1.5.0",
          "description": "Data manipulation library"
        }
      ]
    },
    {
      "category": "Database",
      "items": [
        {
          "name": "SQL Server",
          "version": "2019",
          "description": "Primary database for data storage"
        },
        {
          "name": "Redis",
          "version": "6.2",
          "description": "Caching layer for performance"
        }
      ]
    },
    {
      "category": "Machine Learning",
      "items": [
        {
          "name": "Scikit-learn",
          "version": "1.1.0",
          "description": "Machine learning algorithms"
        },
        {
          "name": "Prophet",
          "version": "1.1",
          "description": "Time series forecasting"
        }
      ]
    }
  ],
  
  "project_gallery": [
    {
      "image_url": "/uploads/portfolio/main_dashboard_1234567890_abc123.jpg",
      "title": "Main Dashboard",
      "description": "Overview of key performance indicators and metrics",
      "order": 1
    },
    {
      "image_url": "/uploads/portfolio/customer_analytics_1234567890_def456.jpg",
      "title": "Customer Analytics",
      "description": "Customer segmentation and behavior analysis",
      "order": 2
    },
    {
      "image_url": "/uploads/portfolio/sales_trends_1234567890_ghi789.jpg",
      "title": "Sales Trends",
      "description": "Historical sales data and trend analysis",
      "order": 3
    },
    {
      "image_url": "/uploads/portfolio/performance_kpis_1234567890_jkl012.jpg",
      "title": "Performance KPIs",
      "description": "Key performance indicators dashboard",
      "order": 4
    }
  ],
  
  "custom_sections": [
    {
      "title": "Key Features",
      "section_type": "list",
      "order": 1,
      "items": [
        {
          "title": "Interactive Visualizations",
          "description": "Dynamic charts and graphs with drill-down capabilities for detailed analysis",
          "order": 1
        },
        {
          "title": "Customer Segmentation",
          "description": "Advanced customer analytics with behavioral segmentation and lifetime value analysis",
          "order": 2
        },
        {
          "title": "Predictive Analytics",
          "description": "Machine learning models for sales forecasting and trend prediction",
          "order": 3
        },
        {
          "title": "Real-time Alerts",
          "description": "Automated notifications for performance thresholds and anomaly detection",
          "order": 4
        }
      ]
    },
    {
      "title": "Challenges & Solutions",
      "section_type": "list",
      "order": 2,
      "items": [
        {
          "title": "Data Integration",
          "description": "Integrated disparate data sources with different formats and update frequencies using ETL pipelines and data validation processes to ensure data quality and consistency.",
          "tag": "Technical",
          "order": 1
        },
        {
          "title": "Performance Optimization",
          "description": "Implemented data aggregation strategies and caching mechanisms to handle large datasets while maintaining real-time dashboard responsiveness for end users.",
          "tag": "Performance",
          "order": 2
        },
        {
          "title": "User Adoption",
          "description": "Designed intuitive user interface with guided tutorials and training materials to ensure smooth adoption across different stakeholder groups and skill levels.",
          "tag": "Business",
          "order": 3
        }
      ]
    },
    {
      "title": "Implementation Process",
      "section_type": "mixed",
      "order": 3,
      "items": [
        {
          "title": "Data Discovery",
          "description": "Analyzed existing data sources and identified key metrics",
          "image_url": "/uploads/portfolio/data_discovery_process.jpg",
          "order": 1
        },
        {
          "title": "Dashboard Design",
          "description": "Created wireframes and prototypes for user interface",
          "image_url": "/uploads/portfolio/dashboard_wireframes.jpg",
          "order": 2
        }
      ]
    }
  ],
  
  "project_stats": [
    {
      "label": "Months",
      "value": "4",
      "icon": "fas fa-calendar",
      "order": 1
    },
    {
      "label": "Team Members",
      "value": "2",
      "icon": "fas fa-users",
      "order": 2
    },
    {
      "label": "KPIs Tracked",
      "value": "10+",
      "icon": "fas fa-chart-line",
      "order": 3
    },
    {
      "label": "Data Sources",
      "value": "5",
      "icon": "fas fa-database",
      "order": 4
    }
  ],
  
  "project_info": [
    {
      "label": "Client",
      "value": "RetailCorp Ltd.",
      "order": 1
    },
    {
      "label": "Duration",
      "value": "4 Months",
      "order": 2
    },
    {
      "label": "Team Size",
      "value": "2 Analysts",
      "order": 3
    },
    {
      "label": "My Role",
      "value": "Lead Data Analyst",
      "order": 4
    },
    {
      "label": "Status",
      "value": "Completed",
      "order": 5
    },
    {
      "label": "Budget",
      "value": "$50k - $100k",
      "order": 6
    }
  ]
}
```

### 3. Upload Portfolio Image (Admin Only)
```
POST /api/admin/portfolios/upload
```

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <your-jwt-token>
```

**Form Data:**
- `image`: File (JPEG, PNG, WebP, GIF - max 5MB)

**Example Response:**
```json
{
  "message": "File uploaded successfully",
  "url": "/uploads/portfolio/dashboard_screenshot_1234567890_abc123.jpg"
}
```

### 4. Update Portfolio V2 (Admin Only)
```
PUT /api/admin/portfolios/:id
```

**Request Body:** Same structure as Create Portfolio V2

### 5. Delete Portfolio (Admin Only)
```
DELETE /api/admin/portfolios/:id
```

## Section Types

### 1. List Type (`"section_type": "list"`)
Untuk menampilkan daftar item dengan title dan description. Cocok untuk:
- Features
- Challenges & Solutions
- Requirements
- Achievements

### 2. Gallery Type (`"section_type": "gallery"`)
Untuk menampilkan galeri gambar dengan caption. Cocok untuk:
- Screenshots
- Process Documentation
- Before/After comparisons

### 3. Mixed Type (`"section_type": "mixed"`)
Kombinasi text dan gambar. Cocok untuk:
- Implementation Process
- Case Studies
- Step-by-step guides

## Custom Section Examples

### Features Section
```json
{
  "title": "Key Features",
  "section_type": "list",
  "order": 1,
  "items": [
    {
      "title": "Real-time Analytics",
      "description": "Live data processing and visualization",
      "order": 1
    }
  ]
}
```

### Challenges Section with Tags
```json
{
  "title": "Challenges & Solutions",
  "section_type": "list",
  "order": 2,
  "items": [
    {
      "title": "Data Integration",
      "description": "Solution for integrating multiple data sources",
      "tag": "Technical",
      "order": 1
    },
    {
      "title": "User Experience",
      "description": "Improving dashboard usability",
      "tag": "UX/UI",
      "order": 2
    }
  ]
}
```

### Process Documentation with Images
```json
{
  "title": "Development Process",
  "section_type": "mixed",
  "order": 3,
  "items": [
    {
      "title": "Wireframing",
      "description": "Initial dashboard layout design",
      "image_url": "/uploads/portfolio/wireframes.jpg",
      "order": 1
    },
    {
      "title": "Data Modeling",
      "description": "Database schema and relationships",
      "image_url": "/uploads/portfolio/data_model.jpg",
      "order": 2
    }
  ]
}
```

## File Upload Guidelines

1. **Supported Formats:** JPEG, PNG, WebP, GIF
2. **Maximum Size:** 5MB per file
3. **Recommended Dimensions:** 
   - Hero images: 1200x800px
   - Gallery images: 800x600px
   - Process images: 600x400px
4. **File Naming:** Files will be automatically renamed with timestamp and UUID

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Field 'Title' failed validation: required"
}
```

### 413 Payload Too Large
```json
{
  "error": "File too large",
  "message": "Maximum file size is 5MB"
}
```

### 415 Unsupported Media Type
```json
{
  "error": "Invalid file type",
  "message": "Only JPEG, PNG, and WebP are allowed"
}
```

## Migration from V1 to V2

Jika Anda sudah menggunakan API V1, berikut mapping untuk migrasi:

| V1 Field | V2 Field | Notes |
|----------|----------|-------|
| `project_information` | `custom_sections` | Lebih fleksibel dengan section types |
| `dynamic_fields` | `custom_sections` + `project_info` | Dipecah menjadi dua konsep |
| - | `project_gallery` | Fitur baru untuk dokumentasi visual |
| - | `project_stats` | Fitur baru untuk statistik project |

## Best Practices

1. **Image Optimization:** Compress images sebelum upload untuk performa yang lebih baik
2. **Section Ordering:** Gunakan field `order` untuk mengatur urutan tampilan
3. **Consistent Naming:** Gunakan naming convention yang konsisten untuk sections
4. **Content Structure:** Pisahkan content berdasarkan tipe (list, gallery, mixed)
5. **Tag Usage:** Gunakan tags untuk kategorisasi items dalam sections 