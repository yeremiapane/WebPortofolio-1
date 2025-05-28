# Portfolio API Documentation

## Overview
API ini menyediakan fitur CRUD (Create, Read, Update, Delete) untuk mengelola portfolio dengan struktur dinamis yang kompleks.

## Base URL
```
http://localhost:8080
```

## Authentication
Untuk endpoint admin, diperlukan JWT token dalam header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Portfolios (Public)
```
GET /api/portfolios
```

**Query Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah item per halaman (default: 10)
- `category` (optional): Filter berdasarkan kategori ("Development", "Data Analytics", "Data Engineer")
- `search` (optional): Pencarian berdasarkan title atau description

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/portfolios?page=1&limit=5&category=Development&search=web"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Website",
      "image_url": "https://example.com/image.jpg",
      "description": "Full-stack e-commerce website",
      "live_demo_url": "https://demo.example.com",
      "github_url": "https://github.com/user/repo",
      "overview": "This project is a comprehensive e-commerce solution...",
      "category": "Development",
      "project_time": "3 months",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "technology_stacks": [
        {
          "id": 1,
          "portfolio_id": 1,
          "category": "Frontend",
          "items": [
            {
              "id": 1,
              "technology_stack_id": 1,
              "name": "HTML",
              "version": "5",
              "description": "Markup language"
            },
            {
              "id": 2,
              "technology_stack_id": 1,
              "name": "CSS",
              "version": "3",
              "description": "Styling language"
            }
          ]
        },
        {
          "id": 2,
          "portfolio_id": 1,
          "category": "Backend",
          "items": [
            {
              "id": 3,
              "technology_stack_id": 2,
              "name": "Golang",
              "version": "1.21",
              "description": "Backend programming language"
            }
          ]
        }
      ],
      "project_information": [
        {
          "id": 1,
          "portfolio_id": 1,
          "category": "Features",
          "items": [
            {
              "id": 1,
              "project_information_id": 1,
              "title": "User Authentication",
              "description": "Secure login and registration system",
              "order": 1
            }
          ]
        }
      ],
      "dynamic_fields": [
        {
          "id": 1,
          "portfolio_id": 1,
          "field_name": "Team Size",
          "field_type": "text",
          "is_required": false,
          "options": null,
          "items": [
            {
              "id": 1,
              "dynamic_field_id": 1,
              "value": "5 developers",
              "order": 1
            }
          ]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "total_pages": 2
  }
}
```

### 2. Get Portfolio by ID (Public)
```
GET /api/portfolios/:id
```

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/portfolios/1"
```

### 3. Get Portfolio Categories (Public)
```
GET /api/portfolios/categories
```

**Example Response:**
```json
{
  "data": ["Development", "Data Analytics", "Data Engineer"]
}
```

### 4. Create Portfolio (Admin Only)
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
  "title": "E-Commerce Website",
  "image_url": "https://example.com/image.jpg",
  "description": "Full-stack e-commerce website with modern features",
  "live_demo_url": "https://demo.example.com",
  "github_url": "https://github.com/user/repo",
  "overview": "This project is a comprehensive e-commerce solution built with modern technologies. It includes user authentication, product management, shopping cart, payment integration, and admin dashboard.",
  "category": "Development",
  "project_time": "3 months",
  "technology_stacks": [
    {
      "category": "Frontend",
      "items": [
        {
          "name": "HTML",
          "version": "5",
          "description": "Markup language for web structure"
        },
        {
          "name": "CSS",
          "version": "3",
          "description": "Styling language for web design"
        },
        {
          "name": "JavaScript",
          "version": "ES6+",
          "description": "Programming language for web interactivity"
        }
      ]
    },
    {
      "category": "Backend",
      "items": [
        {
          "name": "Golang",
          "version": "1.21",
          "description": "Backend programming language"
        },
        {
          "name": "GIN",
          "version": "1.9",
          "description": "Web framework for Golang"
        },
        {
          "name": "JWT",
          "version": "4.5",
          "description": "JSON Web Token for authentication"
        }
      ]
    },
    {
      "category": "Database",
      "items": [
        {
          "name": "MySQL",
          "version": "8.0",
          "description": "Relational database management system"
        }
      ]
    }
  ],
  "project_information": [
    {
      "category": "Features",
      "items": [
        {
          "title": "User Authentication",
          "description": "Secure login and registration system with JWT tokens",
          "order": 1
        },
        {
          "title": "Product Management",
          "description": "CRUD operations for products with image upload",
          "order": 2
        },
        {
          "title": "Shopping Cart",
          "description": "Add, remove, and modify items in shopping cart",
          "order": 3
        }
      ]
    },
    {
      "category": "Challenges",
      "items": [
        {
          "title": "Payment Integration",
          "description": "Integrating multiple payment gateways securely",
          "order": 1
        },
        {
          "title": "Performance Optimization",
          "description": "Optimizing database queries and API responses",
          "order": 2
        }
      ]
    }
  ],
  "dynamic_fields": [
    {
      "field_name": "Team Size",
      "field_type": "text",
      "is_required": false,
      "items": [
        {
          "value": "5 developers",
          "order": 1
        }
      ]
    },
    {
      "field_name": "Project Status",
      "field_type": "select",
      "is_required": true,
      "options": "[\"Completed\", \"In Progress\", \"On Hold\"]",
      "items": [
        {
          "value": "Completed",
          "order": 1
        }
      ]
    },
    {
      "field_name": "Client Feedback",
      "field_type": "textarea",
      "is_required": false,
      "items": [
        {
          "value": "Excellent work! The website exceeded our expectations.",
          "order": 1
        }
      ]
    }
  ]
}
```

### 5. Update Portfolio (Admin Only)
```
PUT /api/admin/portfolios/:id
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Request Body:** Same structure as Create Portfolio

### 6. Delete Portfolio (Admin Only)
```
DELETE /api/admin/portfolios/:id
```

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Example Request:**
```bash
curl -X DELETE "http://localhost:8080/api/admin/portfolios/1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Field Types for Dynamic Fields

Dynamic fields mendukung berbagai tipe input:

1. **text**: Input teks sederhana
2. **textarea**: Input teks multi-baris
3. **number**: Input angka
4. **url**: Input URL dengan validasi
5. **date**: Input tanggal
6. **select**: Dropdown dengan opsi yang ditentukan dalam field `options`

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Field 'Title' failed validation: required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "error": "Portfolio not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create portfolio",
  "message": "Database connection error"
}
```

## Database Schema

### Portfolio Table
- `id` (Primary Key)
- `title` (String, Required)
- `image_url` (String, Required, URL)
- `description` (Text, Required)
- `live_demo_url` (String, Optional, URL)
- `github_url` (String, Optional, URL)
- `overview` (Text, Required)
- `category` (Enum: Development, Data Analytics, Data Engineer)
- `project_time` (String, Required)
- `created_at`, `updated_at`, `deleted_at`

### Technology Stack Tables
- `technology_stacks`: Kategori teknologi (Frontend, Backend, etc.)
- `tech_items`: Item teknologi individual dalam setiap kategori

### Project Information Tables
- `project_information`: Kategori informasi proyek (Features, Challenges, etc.)
- `info_items`: Item informasi individual dalam setiap kategori

### Dynamic Field Tables
- `dynamic_fields`: Definisi field dinamis
- `dynamic_field_items`: Nilai untuk field dinamis

## Testing

Untuk testing API, Anda dapat menggunakan tools seperti:
- Postman
- curl
- Insomnia
- Thunder Client (VS Code extension)

Pastikan untuk:
1. Mendapatkan JWT token melalui login endpoint terlebih dahulu
2. Menggunakan token tersebut untuk endpoint admin
3. Memvalidasi struktur JSON sesuai dengan contoh di atas 