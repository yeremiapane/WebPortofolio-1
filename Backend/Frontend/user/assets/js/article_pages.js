// NAVBAR TOGGLE (Responsive)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navbarLinks = document.getElementById('navbarLinks');

hamburgerBtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});

// ==========================
// Konfigurasi Endpoint
// ==========================
const BASE_URL = 'http://localhost:8080'; // Ganti sesuai server Anda
const ARTICLES_ENDPOINT = `${BASE_URL}/articles`;
const CATEGORIES_ENDPOINT = `${BASE_URL}/categories`;
// Jika Anda punya endpoint lain (mis. /articles/filter?category=xxx), sesuaikan.

// ==========================
// Variabel Global
// ==========================
let allArticles = [];
let currentIndex = 0;
const articlesPerPage = 10; // Tampilkan 10 artikel per load
const blogGrid = document.getElementById('blogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');

// Data yang sedang kita tampilkan = allArticles (di-filter search => displayedArticles)
// Agar realtime search mudah, kita simpan "latest filtered data" di displayedArticles.
let displayedArticles = [];

// ==========================
// Ambil Daftar Kategori
// ==========================
fetch(CATEGORIES_ENDPOINT)
    .then(resp => {
        if (!resp.ok) throw new Error('Failed to fetch categories');
        return resp.json();
    })
    .then(categories => {
        categorySelect.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });
    })
    .catch(err => console.error('Error fetching categories:', err));

// ==========================
// Fungsi Fetch Articles
// ==========================
function fetchArticles(category = '') {
    let url = ARTICLES_ENDPOINT;
    if (category) {
        url += `?category=${encodeURIComponent(category)}`;
    }
    fetch(url)
        .then(resp => {
            if (!resp.ok) throw new Error('Failed to fetch articles');
            return resp.json();
        })
        .then(articles => {
            allArticles = articles;
            applySearchFilter(); // Akan set displayedArticles sesuai input
        })
        .catch(err => console.error('Error fetching articles:', err));
}

// ==========================
// Tampilkan Subset Artikel
// ==========================
function displayArticles() {
    // Hapus terlebih dahulu isi blogGrid
    blogGrid.innerHTML = '';

    // Subset berdasarkan currentIndex
    const subset = displayedArticles.slice(0, currentIndex);

    subset.forEach(article => {
        // Asumsi property: {ID,Title,MainImage,Category,Description,Publisher,ReadingTime,Likes}
        const id = article.ID || 0;
        const title = article.Title || 'Untitled';
        const category = article.Category || 'Uncategorized';
        const desc = article.Description || 'No description';
        const image = article.MainImage
            ? `${BASE_URL}/${article.MainImage}`
            : 'https://via.placeholder.com/400x200?text=No+Image';
        const publisher = article.Publisher || 'Anonymous';
        const readingTime = article.ReadingTime || 0;
        const likes = article.Likes || 0;

        const card = document.createElement('div');
        card.classList.add('blog-card');

        card.innerHTML = `
        <img src="${image}" alt="${title}">
        <div class="blog-card-content">
          <span class="blog-category">${category}</span>
          <h3 class="blog-title">${title}</h3>
          <p class="blog-desc">${desc.substring(0, 100)}...</p>
          <div class="blog-meta">
            <span>
              <ion-icon name="time-outline"></ion-icon> ${readingTime} min
            </span>
            <span>
              <ion-icon name="heart-outline"></ion-icon> ${likes}
            </span>
          </div>
          <div class="blog-footer">
            <span>By ${publisher}</span>
            <a href="/article/${id}" class="blog-readmore">Read More</a>
          </div>
        </div>
      `;
        blogGrid.appendChild(card);
    });

    // Cek load more
    if (currentIndex >= displayedArticles.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// ==========================
// LOAD MORE
// ==========================
loadMoreBtn.addEventListener('click', () => {
    // Tambah 10 lagi
    currentIndex += articlesPerPage;
    displayArticles();
});

// ==========================
// Filter by search (Local)
// ==========================
// Re-run filter setiap kali mengetik
searchInput.addEventListener('input', () => {
    applySearchFilter();
});

function applySearchFilter() {
    const searchVal = searchInput.value.toLowerCase();
    // Filter dari allArticles berdasarkan Title / Description dsb.
    displayedArticles = allArticles.filter(a => {
        const title = (a.Title || '').toLowerCase();
        const desc = (a.Description || '').toLowerCase();
        return title.includes(searchVal) || desc.includes(searchVal);
    });

    // Reset index
    currentIndex = articlesPerPage;
    displayArticles();
}

// ==========================
// Category Change
// ==========================
categorySelect.addEventListener('change', (e) => {
    const selectedCat = e.target.value;
    searchInput.value = '';
    fetchArticles(selectedCat);
});

// ==========================
// On DOM Loaded
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    // Pertama load all categories = '' (semua)
    fetchArticles('');
});