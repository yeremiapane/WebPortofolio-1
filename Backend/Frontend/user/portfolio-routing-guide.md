# Portfolio Routing System Guide

## Overview
Sistem routing portfolio telah diperbarui untuk mendukung URL yang SEO-friendly dengan slug dinamis. Sistem ini memberikan pengalaman yang lebih baik untuk pengguna dan mesin pencari.

## URL Format

### New SEO-Friendly Format
```
/portfolio/{id}/{slug}
```

**Contoh:**
- `/portfolio/1/sales-performance-dashboard`
- `/portfolio/2/e-commerce-platform-development`
- `/portfolio/3/real-time-data-pipeline`

### Legacy Format (Still Supported)
```
/portfolio/detail?id={id}
```

**Contoh:**
- `/portfolio/detail?id=1`
- `/portfolio/detail?id=2`

## Routing Implementation

### Backend Routes (Go/Gin)

#### 1. SEO-Friendly Route
```go
r.GET("/portfolio/:id/:slug", func(c *gin.Context) {
    c.File("Frontend/user/project-detail-data-analyst.html")
})
```

#### 2. ID-Only Route (Auto-Redirect)
```go
r.GET("/portfolio/:id", func(c *gin.Context) {
    id := c.Param("id")
    
    // Validate ID
    if _, err := strconv.Atoi(id); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid portfolio ID"})
        return
    }
    
    // Get portfolio from database
    var portfolio models.Portfolio
    if err := config.DB.First(&portfolio, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
        return
    }
    
    // Create slug and redirect
    slug := slug2.Make(portfolio.Title)
    newURL := fmt.Sprintf("/portfolio/%s/%s", id, slug)
    c.Redirect(http.StatusMovedPermanently, newURL)
})
```

#### 3. Legacy Route (Backward Compatibility)
```go
r.GET("/portfolio/detail", func(c *gin.Context) {
    c.File("Frontend/user/project-detail-data-analyst.html")
})
```

### Frontend JavaScript

#### 1. Navigation Function
```javascript
function viewPortfolioDetail(portfolioId) {
    // Find portfolio data to get title for slug
    const portfolio = portfolioData.find(p => p.id === portfolioId);
    if (!portfolio) {
        console.error('Portfolio not found:', portfolioId);
        return;
    }
    
    // Create slug from title
    const slug = createSlug(portfolio.title);
    
    // Navigate to portfolio detail page with slug and ID
    window.location.href = `/portfolio/${portfolioId}/${slug}`;
}
```

#### 2. Slug Creation
```javascript
function createSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
```

#### 3. URL Parsing
```javascript
getProjectIdFromUrl() {
    // Support both old format (?id=) and new format (/portfolio/id/slug)
    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');
    
    if (queryId) {
        return queryId;
    }
    
    // Extract ID from path: /portfolio/id/slug
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'portfolio') {
        const portfolioId = pathParts[2];
        // Validate that it's a number
        if (!isNaN(portfolioId) && portfolioId !== '') {
            return portfolioId;
        }
    }
    
    return null;
}
```

## SEO Features

### 1. Meta Tags Update
```javascript
updateMetaTags() {
    const data = this.projectData;
    
    // Basic meta tags
    this.updateOrCreateMeta('name', 'description', data.description);
    
    // Open Graph tags
    this.updateOrCreateMeta('property', 'og:title', data.title);
    this.updateOrCreateMeta('property', 'og:description', data.description);
    this.updateOrCreateMeta('property', 'og:image', data.image_url);
    this.updateOrCreateMeta('property', 'og:url', window.location.href);
    this.updateOrCreateMeta('property', 'og:type', 'article');
    
    // Twitter Card tags
    this.updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    this.updateOrCreateMeta('name', 'twitter:title', data.title);
    this.updateOrCreateMeta('name', 'twitter:description', data.description);
    this.updateOrCreateMeta('name', 'twitter:image', data.image_url);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
}
```

### 2. URL Normalization
```javascript
updatePageUrl() {
    // Create slug from project title
    const slug = this.createSlug(this.projectData.title);
    const expectedUrl = `/portfolio/${this.projectData.id}/${slug}`;
    
    // Update URL if it doesn't match the expected format
    if (window.location.pathname !== expectedUrl) {
        window.history.replaceState(null, '', expectedUrl);
    }
}
```

## Error Handling

### 1. Invalid ID Format
```javascript
if (isNaN(this.projectId)) {
    this.showError('Invalid project ID format. Please check the URL.');
    return;
}
```

### 2. Project Not Found
```javascript
if (error.message.includes('404')) {
    this.showError('Project not found. The project may have been removed or the URL is incorrect.');
}
```

### 3. Enhanced Error UI
```javascript
showError(message) {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>Error Loading Project</h2>
                <p>${message}</p>
                <div class="error-actions">
                    <a href="/portfolio" class="btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        Back to Portfolio
                    </a>
                    <button onclick="window.location.reload()" class="btn-secondary">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}
```

## Migration Guide

### From Old URLs to New URLs

#### Automatic Redirects
- `/portfolio/1` → `/portfolio/1/sales-performance-dashboard`
- `/portfolio/detail?id=1` → Works but not redirected (for backward compatibility)

#### Manual Update
Update all internal links from:
```html
<a href="/portfolio/detail?id=1">View Project</a>
```

To:
```javascript
<button onclick="viewPortfolioDetail(1)">View Project</button>
```

## Benefits

### 1. SEO Improvements
- **Descriptive URLs**: URLs now contain project titles
- **Better Indexing**: Search engines can better understand content
- **Social Sharing**: More attractive URLs when shared on social media

### 2. User Experience
- **Readable URLs**: Users can understand what the page is about from the URL
- **Bookmarking**: Easier to bookmark and remember
- **Navigation**: Better browser history

### 3. Technical Benefits
- **Caching**: Better caching strategies with descriptive URLs
- **Analytics**: More meaningful URL tracking
- **Debugging**: Easier to identify pages in logs

## Testing

### 1. URL Formats to Test
```
✅ /portfolio/1/sales-performance-dashboard
✅ /portfolio/1 (should redirect to above)
✅ /portfolio/detail?id=1 (legacy support)
❌ /portfolio/invalid-id (should show error)
❌ /portfolio/999 (should show 404 error)
```

### 2. Navigation Testing
```
✅ Click "Read More" from portfolio grid
✅ Direct URL access
✅ Browser back/forward buttons
✅ Page refresh
✅ Social media sharing
```

### 3. SEO Testing
```
✅ Meta tags are updated correctly
✅ Open Graph tags work for social sharing
✅ Canonical URLs are set
✅ Page titles are dynamic
```

## Best Practices

### 1. Slug Generation
- Use lowercase letters only
- Replace spaces with hyphens
- Remove special characters
- Keep it concise but descriptive

### 2. Error Handling
- Provide clear error messages
- Offer navigation options
- Log errors for debugging
- Graceful fallbacks

### 3. Performance
- Use browser history API for URL updates
- Implement proper caching headers
- Optimize for Core Web Vitals
- Monitor page load times

## Future Enhancements

### 1. Potential Improvements
- Add breadcrumb navigation
- Implement related projects suggestions
- Add project categories in URL structure
- Support for multiple languages in slugs

### 2. Advanced Features
- URL-based filtering and sorting
- Deep linking to specific sections
- Progressive Web App support
- Advanced analytics tracking 