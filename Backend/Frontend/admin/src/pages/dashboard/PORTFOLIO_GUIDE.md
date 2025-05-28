# Portfolio Management Guide

## Overview
Sistem manajemen portfolio telah diperbaiki dengan fitur-fitur baru yang lebih modern dan user-friendly. Berikut adalah panduan lengkap untuk menggunakan fitur portfolio.

## Fitur Baru yang Ditambahkan

### 1. Upload Gambar dengan Drag & Drop
- **Drag and Drop**: Seret gambar langsung ke area upload
- **Click to Browse**: Klik area upload untuk memilih file
- **Preview Real-time**: Lihat preview gambar sebelum upload
- **Multiple Images**: Upload hingga 10 gambar sekaligus
- **File Validation**: Validasi otomatis untuk format dan ukuran file

### 2. Image Management
- **Image Preview**: Preview gambar dengan modal view
- **Remove Images**: Hapus gambar individual
- **File Size Display**: Tampilan ukuran file
- **Format Support**: JPG, PNG, GIF (maksimal 5MB per file)

### 3. Enhanced Form Interface
- **Modern UI**: Interface yang lebih modern dengan ikon
- **Better Validation**: Validasi form yang lebih baik
- **Loading States**: Indikator loading saat submit
- **Toast Notifications**: Notifikasi sukses/error yang informatif

## Cara Menggunakan

### Membuat Portfolio Baru

1. **Akses Halaman Create Portfolio**
   - Navigasi ke menu Portfolio → Create New

2. **Isi Informasi Dasar**
   - **Project Title**: Nama project (wajib)
   - **Category**: Pilih kategori project (wajib)
   - **Description**: Deskripsi detail project (wajib)
   - **Start/End Date**: Tanggal mulai dan selesai (opsional)

3. **Upload Gambar Project**
   - Seret gambar ke area upload atau klik untuk browse
   - Maksimal 10 gambar, masing-masing maksimal 5MB
   - Format yang didukung: JPG, PNG, GIF
   - Preview gambar akan muncul otomatis

4. **Technology Stack**
   - **Programming Languages**: JavaScript, Python, dll.
   - **Frameworks & Libraries**: React, Vue.js, dll.
   - **Databases**: MySQL, MongoDB, dll.
   - **Tools & Platforms**: Docker, AWS, dll.

5. **Project Links**
   - **Repository Links**: Link GitHub, GitLab, dll.
   - **Live Demo Links**: Link demo project yang bisa diakses

6. **Additional Information**
   - **Features**: Fitur-fitur utama project
   - **Challenges & Solutions**: Tantangan dan solusi
   - **Achievements**: Pencapaian atau hasil project

7. **Submit Portfolio**
   - Klik tombol "Create Portfolio"
   - Tunggu proses upload selesai
   - Akan redirect ke dashboard setelah berhasil

### Mengupdate Portfolio Existing

1. **Akses Halaman Update**
   - Dari dashboard portfolio, klik tombol "Edit" pada project

2. **Data Existing**
   - Form akan terisi otomatis dengan data existing
   - Gambar existing akan ditampilkan di section "Current Images"

3. **Update Informasi**
   - Edit field yang ingin diubah
   - Tambah/hapus item di tech stack, links, dll.

4. **Manage Gambar**
   - **Current Images**: Lihat gambar yang sudah ada
   - **Remove Existing**: Klik tombol trash untuk hapus gambar lama
   - **Add New Images**: Upload gambar baru di section "Upload New Images"
   - Gambar baru akan ditambahkan ke gambar existing

5. **Save Changes**
   - Klik tombol "Update Portfolio"
   - Konfirmasi perubahan
   - Tunggu proses update selesai

## Fitur-Fitur Form

### Dynamic Fields
- **Add/Remove Items**: Tombol + untuk tambah, × untuk hapus
- **Minimum Requirement**: Minimal 1 item harus ada
- **Validation**: Validasi otomatis untuk field wajib

### Image Upload Features
- **Drag & Drop Zone**: Area upload yang responsif
- **File Validation**: 
  - Format: JPG, PNG, GIF
  - Size: Maksimal 5MB per file
  - Quantity: Maksimal 10 gambar
- **Preview Grid**: Grid layout untuk preview gambar
- **Image Actions**:
  - **View**: Modal untuk melihat gambar full size
  - **Remove**: Hapus gambar dari selection

### Form Validation
- **Required Fields**: Title, Category, Description
- **URL Validation**: Validasi format URL untuk links
- **File Validation**: Validasi format dan ukuran gambar
- **Real-time Feedback**: Error message langsung muncul

## Technical Implementation

### File Structure
```
/admin/src/pages/dashboard/
├── write_portfolio.html      # Form create portfolio
├── update_portfolio.html     # Form update portfolio
├── style.css                 # Enhanced CSS styles
└── assets/
    ├── index.js             # Main JavaScript functions
    └── placeholder.svg      # Placeholder image
```

### Key Features
- **Responsive Design**: Mobile-friendly interface
- **Modern CSS**: CSS Grid, Flexbox, CSS Variables
- **JavaScript ES6+**: Modern JavaScript features
- **File API**: HTML5 File API untuk upload
- **FormData**: Multipart form data untuk file upload

### API Integration
- **Create**: POST `/admin/portfolio`
- **Update**: PUT `/admin/portfolio/{id}`
- **Get**: GET `/admin/portfolio/{id}`
- **File Upload**: Multipart form data dengan field `images`

## Troubleshooting

### Common Issues

1. **Gambar Tidak Muncul**
   - Periksa format file (harus JPG, PNG, atau GIF)
   - Periksa ukuran file (maksimal 5MB)
   - Pastikan koneksi internet stabil

2. **Form Tidak Submit**
   - Pastikan field wajib sudah diisi
   - Periksa console browser untuk error
   - Refresh halaman dan coba lagi

3. **Upload Gagal**
   - Periksa ukuran total file
   - Pastikan tidak melebihi 10 gambar
   - Coba upload satu per satu

### Browser Compatibility
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+
- **Features Required**: 
  - File API
  - FormData
  - CSS Grid
  - ES6 JavaScript

## Best Practices

### Image Guidelines
- **Resolution**: Minimal 800x600 untuk kualitas baik
- **Aspect Ratio**: 16:9 atau 4:3 untuk konsistensi
- **File Size**: Kompres gambar untuk loading yang cepat
- **Naming**: Gunakan nama file yang deskriptif

### Content Guidelines
- **Title**: Singkat dan deskriptif
- **Description**: Detail tapi tidak terlalu panjang
- **Tech Stack**: Sebutkan teknologi utama yang digunakan
- **Links**: Pastikan link aktif dan dapat diakses

### Performance Tips
- **Image Optimization**: Kompres gambar sebelum upload
- **Batch Upload**: Upload beberapa gambar sekaligus
- **Progressive Enhancement**: Form tetap berfungsi tanpa JavaScript

## Security Considerations

### File Upload Security
- **File Type Validation**: Hanya gambar yang diizinkan
- **File Size Limits**: Mencegah upload file besar
- **Server-side Validation**: Validasi ulang di server
- **Secure Storage**: File disimpan di direktori yang aman

### Data Validation
- **Input Sanitization**: Semua input dibersihkan
- **XSS Prevention**: Mencegah script injection
- **CSRF Protection**: Token CSRF untuk form submission

## Future Enhancements

### Planned Features
- **Image Editing**: Crop dan resize gambar
- **Bulk Operations**: Edit multiple portfolio sekaligus
- **Export/Import**: Export portfolio ke PDF/JSON
- **Advanced Search**: Filter dan search yang lebih canggih
- **Analytics**: Statistik view dan engagement

### Performance Improvements
- **Lazy Loading**: Load gambar saat diperlukan
- **CDN Integration**: Serve gambar dari CDN
- **Caching**: Cache data untuk loading yang cepat
- **Compression**: Kompresi otomatis gambar

---

## Support

Jika mengalami masalah atau butuh bantuan:
1. Periksa console browser untuk error message
2. Pastikan semua field wajib sudah diisi
3. Coba refresh halaman
4. Hubungi administrator sistem

**Last Updated**: December 2024
**Version**: 2.0.0 