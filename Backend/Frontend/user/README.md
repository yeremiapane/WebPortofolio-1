# Portfolio Website - Yeremia Yosefan Pane

Sebuah website portfolio modern dan responsif yang menampilkan proyek-proyek dalam bidang web development, data analysis, dan data engineering.

## 🚀 Fitur Utama

### Halaman Portfolio Utama (`portofolio_dev.html`)
- **Hero Section** dengan animasi floating icons
- **Filter Portfolio** berdasarkan kategori (Developer, Data Analyst, Data Engineer)
- **Grid Layout** responsif untuk menampilkan project cards
- **Loading Animation** saat filtering
- **Smooth Scrolling** dan animasi fade-in
- **Mobile-friendly** dengan hamburger menu

### Halaman Detail Project (`project-detail.html`)
- **Project Hero** dengan informasi lengkap project
- **Image Gallery** dengan modal lightbox
- **Tech Stack** yang digunakan
- **Project Information** sidebar
- **Challenges & Solutions** section
- **Related Projects** di bagian bawah
- **Share Button** untuk membagikan project
- **Back to Top** button
- **Reading Progress Bar**

## 📁 Struktur File

```
Backend/Frontend/user/
├── portofolio_dev.html          # Halaman portfolio utama
├── project-detail.html          # Halaman detail project
├── assets/
│   ├── css/
│   │   ├── portfolio.css        # Styling untuk halaman portfolio
│   │   └── project-detail.css   # Styling untuk halaman detail
│   └── js/
│       ├── portfolio.js         # JavaScript untuk halaman portfolio
│       └── project-detail.js    # JavaScript untuk halaman detail
└── README.md                    # Dokumentasi ini
```

## 🎨 Desain & Styling

### Color Palette
- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #059669 (Emerald)
- **Accent**: #DC2626 (Red)
- **Warning**: #EA580C (Orange)
- **Purple**: #7C3AED (Violet)

### Typography
- **Font Family**: Satoshi (Google Fonts)
- **Responsive Font Sizes**: dari 0.75rem hingga 3rem
- **Font Weights**: 400, 500, 600, 700

### Layout
- **Container Max Width**: 1200px
- **Grid System**: CSS Grid dan Flexbox
- **Responsive Breakpoints**:
  - Desktop: > 1024px
  - Tablet: 768px - 1024px
  - Mobile: < 768px

## 🔧 Fitur Interaktif

### Portfolio Filtering
```javascript
// Filter berdasarkan kategori
filterPortfolio('developer')    // Tampilkan project developer
filterPortfolio('data-analyst') // Tampilkan project data analyst
filterPortfolio('data-engineer') // Tampilkan project data engineer
filterPortfolio('all')          // Tampilkan semua project
```

### Image Gallery Modal
- Klik gambar di gallery untuk membuka modal
- Navigasi dengan arrow keys atau tombol prev/next
- Tekan ESC untuk menutup modal
- Klik overlay untuk menutup modal

### Share Functionality
- Menggunakan Web Share API jika tersedia
- Fallback ke copy to clipboard
- Notifikasi toast saat berhasil

## 📱 Responsive Design

### Desktop (> 1024px)
- Grid 3 kolom untuk portfolio cards
- Sidebar layout untuk detail project
- Full navigation menu

### Tablet (768px - 1024px)
- Grid 2 kolom untuk portfolio cards
- Stacked layout untuk detail project
- Collapsed navigation menu

### Mobile (< 768px)
- Grid 1 kolom untuk portfolio cards
- Single column layout
- Hamburger menu navigation
- Touch-friendly buttons

## 🚀 Cara Penggunaan

### 1. Setup
```bash
# Clone atau download file
# Buka portofolio_dev.html di browser
```

### 2. Navigasi
- **Portfolio**: Klik filter di navbar untuk melihat project berdasarkan kategori
- **View Project**: Klik tombol "View Project" pada card untuk melihat detail
- **Back to Portfolio**: Klik tombol "Back to Portfolio" di halaman detail

### 3. Kustomisasi Project

#### Menambah Project Baru
1. Tambahkan card baru di `portofolio_dev.html`:
```html
<div class="portfolio-card" data-category="developer">
    <div class="card-image">
        <img src="path/to/image.jpg" alt="Project Name">
        <div class="card-overlay">
            <div class="overlay-content">
                <a href="project-detail-new.html" class="btn-view">
                    <i class="fas fa-eye"></i>
                    View Project
                </a>
                <button class="btn-code">
                    <i class="fab fa-github"></i>
                    Source Code
                </button>
            </div>
        </div>
    </div>
    <div class="card-content">
        <div class="card-category">
            <i class="fas fa-code"></i>
            Category Name
        </div>
        <h3 class="card-title">Project Title</h3>
        <p class="card-description">Project description...</p>
        <div class="card-tech">
            <span class="tech-tag">Tech1</span>
            <span class="tech-tag">Tech2</span>
        </div>
    </div>
</div>
```

2. Buat halaman detail baru berdasarkan `project-detail.html`
3. Update informasi project sesuai kebutuhan

#### Mengubah Warna Theme
Edit variabel CSS di file CSS:
```css
:root {
    --primary-color: #YourColor;
    --secondary-color: #YourColor;
    /* dst... */
}
```

## 🎯 Fitur Lanjutan

### Animasi
- **Fade In Up**: Untuk elemen yang muncul saat scroll
- **Floating Animation**: Untuk icons di hero section
- **Hover Effects**: Untuk cards dan buttons
- **Loading Spinner**: Saat filtering portfolio

### Performance
- **Lazy Loading**: Untuk gambar
- **Smooth Scrolling**: Untuk navigasi
- **Optimized CSS**: Menggunakan CSS custom properties
- **Minimal JavaScript**: Vanilla JS tanpa dependencies

### Accessibility
- **Keyboard Navigation**: Support untuk tab navigation
- **Screen Reader Friendly**: Semantic HTML
- **Focus Indicators**: Visual feedback untuk keyboard users
- **Alt Text**: Untuk semua gambar

## 🔧 Troubleshooting

### Masalah Umum

1. **Gambar tidak muncul**
   - Pastikan path gambar benar
   - Gunakan placeholder jika gambar belum tersedia

2. **Filter tidak bekerja**
   - Pastikan `data-category` pada card sesuai dengan filter
   - Check console untuk error JavaScript

3. **Modal tidak terbuka**
   - Pastikan ID element sesuai dengan JavaScript
   - Check apakah JavaScript sudah di-load

4. **Responsive tidak bekerja**
   - Pastikan viewport meta tag ada di head
   - Check media queries di CSS

## 📞 Support

Jika ada pertanyaan atau masalah, silakan hubungi:
- **Email**: yeremia.pane@example.com
- **GitHub**: @yeremia-pane
- **LinkedIn**: Yeremia Yosefan Pane

## 📄 License

© 2024 Yeremia Yosefan Pane. All rights reserved.

---

**Happy Coding! 🚀** 