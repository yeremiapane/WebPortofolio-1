# Portfolio Website - Yeremia Yosefan Pane

## 📋 Deskripsi
Website portfolio modern, minimalis, dan futuristik dengan tema terang yang menampilkan karya-karya dalam bidang Web Development, Data Analysis, dan Data Engineering.

## ✨ Fitur Utama

### 🎨 Desain
- **Modern & Minimalis**: Desain bersih dengan fokus pada konten
- **Futuristik**: Elemen visual dengan animasi floating dan efek hover
- **Tema Terang**: Palet warna yang nyaman untuk mata
- **Responsive**: Optimal di semua perangkat (desktop, tablet, mobile)

### 🚀 Fungsionalitas
- **Single Page Application**: Navigasi smooth tanpa reload halaman
- **Portfolio Filter**: Filter proyek berdasarkan kategori (Developer, Data Analyst, Data Engineer)
- **Animasi Interaktif**: Counter animation, scroll animations, hover effects
- **Mobile Navigation**: Hamburger menu untuk perangkat mobile
- **Lazy Loading**: Optimasi performa dengan lazy loading gambar

### 🎯 Navigasi
- **All Projects**: Menampilkan semua proyek
- **Developer**: Proyek web dan mobile development
- **Data Analyst**: Dashboard dan analisis data
- **Data Engineer**: Pipeline data dan ML engineering
- **About Me**: Informasi personal (akan ditambahkan)
- **Contact**: Form kontak (akan ditambahkan)

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur semantik modern
- **CSS3**: 
  - CSS Variables untuk konsistensi tema
  - Flexbox & Grid untuk layout
  - Animations & Transitions
  - Media queries untuk responsivitas
- **JavaScript ES6+**:
  - Intersection Observer API
  - Event handling
  - DOM manipulation
  - Performance optimizations

### Libraries & Tools
- **Font Awesome 6.4.0**: Icon library
- **Satoshi Font**: Typography modern
- **CSS Custom Properties**: Sistem design tokens

## 📁 Struktur File

```
Backend/Frontend/user/
├── portofolio_dev.html          # Halaman utama portfolio
├── assets/
│   ├── css/
│   │   └── portfolio.css        # Stylesheet utama
│   ├── js/
│   │   └── portfolio.js         # JavaScript functionality
│   └── img/                     # Folder untuk gambar
└── README_Portfolio.md          # Dokumentasi ini
```

## 🎨 Color Palette

### Primary Colors
- **Primary**: `#4F46E5` (Indigo)
- **Secondary**: `#059669` (Emerald)
- **Accent**: `#DC2626` (Red)
- **Warning**: `#EA580C` (Orange)
- **Info**: `#0891B2` (Cyan)
- **Purple**: `#7C3AED` (Purple)

### Background Colors
- **Primary**: `#FFFFFF` (White)
- **Secondary**: `#F8FAFC` (Slate 50)
- **Tertiary**: `#F1F5F9` (Slate 100)
- **Card**: `#FFFFFF` (White)

### Text Colors
- **Primary**: `#1E293B` (Slate 800)
- **Secondary**: `#64748B` (Slate 500)
- **Muted**: `#94A3B8` (Slate 400)

## 🚀 Cara Penggunaan

### 1. Setup
```bash
# Clone atau download file
# Pastikan struktur folder sesuai dengan yang dijelaskan di atas
```

### 2. Menjalankan Website
```bash
# Buka file portofolio_dev.html di browser
# Atau gunakan live server untuk development
```

### 3. Kustomisasi

#### Menambah Proyek Baru
1. Buka `portofolio_dev.html`
2. Tambahkan card baru di dalam `.portfolio-grid`
3. Gunakan struktur yang sama dengan card yang sudah ada
4. Set `data-category` sesuai dengan kategori proyek

```html
<div class="portfolio-card" data-category="developer">
    <!-- Konten card -->
</div>
```

#### Mengubah Warna Tema
1. Buka `assets/css/portfolio.css`
2. Edit CSS variables di bagian `:root`
3. Sesuaikan dengan preferensi warna Anda

#### Menambah Animasi
1. Buka `assets/js/portfolio.js`
2. Tambahkan fungsi animasi baru
3. Panggil fungsi di dalam `initAnimations()`

## 📱 Responsive Breakpoints

- **Desktop**: `> 1024px`
- **Tablet**: `768px - 1024px`
- **Mobile**: `< 768px`
- **Small Mobile**: `< 480px`

## ⚡ Performance Features

### Optimasi
- **CSS Variables**: Mengurangi redundansi kode
- **Debounced Scroll Events**: Optimasi event listener
- **Intersection Observer**: Efficient scroll animations
- **Lazy Loading**: Gambar dimuat saat diperlukan

### Accessibility
- **Keyboard Navigation**: Support navigasi keyboard
- **Focus Management**: Visual feedback untuk focus
- **Semantic HTML**: Struktur yang accessible
- **ARIA Labels**: Screen reader support

## 🔧 Customization Guide

### Mengganti Konten Hero Section
```html
<!-- Edit bagian hero-title dan hero-description -->
<h1 class="hero-title">
    Your Custom
    <span class="gradient-text">Title</span>
    Here
</h1>
```

### Menambah Filter Kategori Baru
1. Tambah button filter baru:
```html
<button class="filter-btn" data-filter="new-category">
    <i class="fas fa-icon"></i>
    New Category
</button>
```

2. Tambah card dengan kategori baru:
```html
<div class="portfolio-card" data-category="new-category">
    <!-- Card content -->
</div>
```

### Mengubah Floating Icons
```html
<!-- Edit di bagian hero-visual -->
<div class="floating-icon" style="--delay: 0s">
    <i class="fab fa-your-icon"></i>
</div>
```

## 🐛 Troubleshooting

### Masalah Umum
1. **Animasi tidak berjalan**: Pastikan JavaScript diload dengan benar
2. **Filter tidak bekerja**: Check console untuk error JavaScript
3. **Responsive tidak optimal**: Periksa CSS media queries
4. **Font tidak load**: Pastikan koneksi internet untuk Google Fonts

### Browser Support
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **IE11**: ❌ Not supported

## 📈 Future Enhancements

### Planned Features
- [ ] Dark mode toggle
- [ ] Project detail modal
- [ ] Contact form integration
- [ ] Blog section
- [ ] Search functionality
- [ ] Project categories expansion
- [ ] Performance metrics dashboard
- [ ] SEO optimization
- [ ] PWA features

### Possible Integrations
- [ ] GitHub API untuk auto-update proyek
- [ ] Google Analytics
- [ ] Contact form backend
- [ ] CMS integration
- [ ] Multi-language support

## 📞 Support

Jika Anda memiliki pertanyaan atau membutuhkan bantuan:
- Email: yeremiayosefanpane@hotmail.com
- LinkedIn: [Yeremia Yosefan Pane](https://www.linkedin.com/in/yeremia-yosefan-pane-74041921a/)
- GitHub: [yeremiapane](https://github.com/yeremiapane)

## 📄 License

© 2024 Yeremia Yosefan Pane. All rights reserved.

---

**Note**: Website ini adalah halaman awal portfolio. Fitur-fitur tambahan seperti About Me dan Contact akan ditambahkan pada tahap pengembangan selanjutnya. 