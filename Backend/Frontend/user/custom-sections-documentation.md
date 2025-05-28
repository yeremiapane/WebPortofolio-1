# Custom Sections Documentation

## Overview
Sistem custom section yang telah diimplementasi mendukung berbagai jenis konten dengan icon dinamis, tag, dan layout yang fleksibel. Setiap section dapat dikustomisasi berdasarkan title, section_type, dan konten item.

## Section Types

### 1. List Section (`section_type: "list"`)
Menampilkan konten dalam bentuk list dengan berbagai variasi berdasarkan title section.

#### Features Section
**Trigger**: Title mengandung kata "feature"
**Layout**: Grid layout dengan icon dan tag
**Struktur**:
```html
<div class="features-grid">
  <div class="feature-item">
    <div class="feature-icon">
      <i class="[dynamic-icon]"></i>
    </div>
    <div class="feature-content">
      <h3>[title]</h3>
      <p>[description]</p>
      <span class="feature-tag">[tag]</span>
    </div>
  </div>
</div>
```

**Icon Mapping**:
- Dashboard/Visualization → `fas fa-chart-bar`
- Analytics/Analysis → `fas fa-chart-line`
- Real-time/Live → `fas fa-bolt`
- Security/Secure → `fas fa-shield-alt`
- Performance/Speed → `fas fa-tachometer-alt`
- User/Interface → `fas fa-users`
- Mobile/Responsive → `fas fa-mobile-alt`
- API/Integration → `fas fa-plug`
- Database/Data → `fas fa-database`
- Cloud/Server → `fas fa-cloud`
- Automation/Auto → `fas fa-robot`
- Notification/Alert → `fas fa-bell`
- Search/Filter → `fas fa-search`
- Export/Download → `fas fa-download`
- Report/Reporting → `fas fa-file-alt`

#### Challenges/Solutions Section
**Trigger**: Title mengandung kata "challenge" atau "solution"
**Layout**: List dengan icon dan tag berwarna
**Struktur**:
```html
<div class="challenges-list">
  <div class="challenge-item">
    <div class="challenge-header">
      <div class="challenge-title-wrapper">
        <div class="challenge-icon">
          <i class="[dynamic-icon]"></i>
        </div>
        <h3>[title]</h3>
      </div>
      <span class="challenge-tag [tag-class]">[tag]</span>
    </div>
    <p>[description]</p>
  </div>
</div>
```

**Icon Mapping**:
- Integration/Connect → `fas fa-link`
- Performance/Optimization → `fas fa-tachometer-alt`
- Security/Secure → `fas fa-lock`
- Scalability/Scale → `fas fa-expand-arrows-alt`
- User/Adoption → `fas fa-user-friends`
- Data/Database → `fas fa-database`
- Time/Deadline → `fas fa-clock`
- Budget/Cost → `fas fa-dollar-sign`
- Technical/Technology → `fas fa-cogs`
- Communication/Team → `fas fa-comments`

#### Process Steps Section
**Trigger**: Title mengandung kata "step" atau "process"
**Layout**: Numbered steps dengan timeline
**Struktur**:
```html
<div class="process-steps">
  <div class="process-step">
    <div class="step-number">
      <span>[index + 1]</span>
    </div>
    <div class="step-content">
      <h3>[title]</h3>
      <p>[description]</p>
      <span class="step-tag">[tag]</span>
    </div>
  </div>
</div>
```

#### Benefits/Advantages Section
**Trigger**: Title mengandung kata "benefit" atau "advantage"
**Layout**: Grid dengan icon hijau
**Struktur**:
```html
<div class="benefits-list">
  <div class="benefit-item">
    <div class="benefit-icon">
      <i class="[dynamic-icon]"></i>
    </div>
    <div class="benefit-content">
      <h3>[title]</h3>
      <p>[description]</p>
      <span class="benefit-tag">[tag]</span>
    </div>
  </div>
</div>
```

**Icon Mapping**:
- Efficiency/Productive → `fas fa-rocket`
- Cost/Save → `fas fa-piggy-bank`
- Time/Faster → `fas fa-clock`
- Quality/Improve → `fas fa-star`
- User/Experience → `fas fa-smile`
- Insight/Analytics → `fas fa-lightbulb`
- Automation/Auto → `fas fa-magic`
- Scalability/Growth → `fas fa-chart-line`

#### Default List Section
**Layout**: List dengan icon dan tag
**Struktur**:
```html
<div class="custom-list">
  <div class="list-item">
    <div class="list-item-header">
      <div class="list-icon">
        <i class="[dynamic-icon]"></i>
      </div>
      <h3>[title]</h3>
      <span class="list-tag">[tag]</span>
    </div>
    <p>[description]</p>
  </div>
</div>
```

### 2. Gallery Section (`section_type: "gallery"`)
Menampilkan koleksi gambar dalam grid layout.

**Struktur**:
```html
<div class="gallery-grid">
  <div class="gallery-item">
    <img src="[image_url]" alt="[title]">
    <div class="gallery-overlay">
      <i class="fas fa-expand"></i>
    </div>
  </div>
</div>
```

### 3. Mixed Section (`section_type: "mixed"`)
Menampilkan kombinasi konten dengan gambar dan teks.

#### With Images
**Struktur**:
```html
<div class="mixed-content mixed-content-with-images">
  <div class="mixed-item with-image">
    <div class="mixed-image">
      <img src="[image_url]" alt="[title]" loading="lazy">
      <div class="image-overlay">
        <i class="fas fa-expand"></i>
      </div>
    </div>
    <div class="mixed-content-text">
      <div class="mixed-header">
        <h3>[title]</h3>
        <span class="mixed-tag [tag-class]">[tag]</span>
      </div>
      <p>[description]</p>
    </div>
  </div>
</div>
```

#### Text Only
**Struktur**:
```html
<div class="mixed-content mixed-content-text-only">
  <div class="mixed-item text-only">
    <div class="mixed-icon">
      <i class="[dynamic-icon]"></i>
    </div>
    <div class="mixed-content-text">
      <div class="mixed-header">
        <h3>[title]</h3>
        <span class="mixed-tag [tag-class]">[tag]</span>
      </div>
      <p>[description]</p>
    </div>
  </div>
</div>
```

**Icon Mapping untuk Mixed Content**:
- Overview/Summary → `fas fa-eye`
- Goal/Objective → `fas fa-bullseye`
- Result/Outcome → `fas fa-trophy`
- Lesson/Learning → `fas fa-graduation-cap`
- Recommendation/Suggest → `fas fa-lightbulb`
- Conclusion/Summary → `fas fa-flag-checkered`
- Methodology/Approach → `fas fa-route`
- Tool/Technology → `fas fa-tools`
- Team/Collaboration → `fas fa-users`
- Timeline/Schedule → `fas fa-calendar-alt`

## Tag System

### Tag Classes
- `tag-technical` → Blue theme
- `tag-business` → Green theme
- `tag-performance` → Yellow theme
- `tag-security` → Red theme
- `tag-design` → Purple theme
- `tag-critical` → Dark red theme
- `tag-high` → Orange theme
- `tag-medium` → Yellow theme
- `tag-low` → Light green theme
- `tag-default` → Gray theme

### Tag Usage
Tags dapat digunakan untuk:
1. Kategorisasi konten
2. Prioritas (High, Medium, Low, Critical)
3. Jenis konten (Technical, Business, Design)
4. Status atau tingkat kepentingan

## Project Stats Enhancement

Project stats sekarang mendukung icon dinamis:

**Struktur**:
```html
<div class="stat-item">
  <div class="stat-icon">
    <i class="[icon dari database atau default]"></i>
  </div>
  <div class="stat-number">[value]</div>
  <div class="stat-label">[label]</div>
</div>
```

## Responsive Design

Semua section types telah dioptimalkan untuk:
- Desktop (grid layout)
- Tablet (adjusted grid)
- Mobile (single column, centered icons)

## Animation & Interactions

### Loading Animations
- Fade in up dengan staggered delay
- Skeleton loading untuk data yang belum dimuat

### Hover Effects
- Icon scaling dan rotation
- Box shadow enhancement
- Color transitions
- Transform effects

### Interactive Elements
- Gallery modal untuk gambar
- Expandable content
- Tag hover effects

## Implementation Example

```javascript
// Contoh data dari database
const customSection = {
  title: "Key Features",
  section_type: "list",
  order: 1,
  items: [
    {
      title: "Real-time Analytics Dashboard",
      description: "Interactive dashboard with live data visualization",
      tag: "Technical",
      order: 1
    },
    {
      title: "User-friendly Interface",
      description: "Intuitive design for better user experience",
      tag: "UI/UX",
      order: 2
    }
  ]
};

// Akan menghasilkan features grid dengan:
// - Icon: fas fa-bolt (karena "real-time")
// - Icon: fas fa-users (karena "user")
// - Tag styling: tag-technical dan tag-design
```

## Best Practices

1. **Title Naming**: Gunakan kata kunci yang sesuai untuk auto-icon detection
2. **Tag Consistency**: Gunakan tag yang konsisten untuk styling yang seragam
3. **Order Management**: Atur order untuk kontrol urutan tampilan
4. **Content Balance**: Campurkan section types untuk variasi visual
5. **Image Optimization**: Gunakan gambar yang sudah dioptimasi untuk gallery dan mixed content

## Customization

Sistem ini dapat diperluas dengan:
1. Menambah icon mapping di helper functions
2. Menambah tag classes di CSS
3. Membuat section type baru
4. Menambah animation variants
5. Mengintegrasikan dengan CMS untuk management yang lebih mudah 