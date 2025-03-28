// ==========================
// Fungsi slugify (opsional)
// ==========================
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')      // Ganti spasi dengan tanda -
        .replace(/[^\w\-]+/g, '')  // Hapus karakter selain huruf, angka, underscore, atau tanda -
        .replace(/\-\-+/g, '-');   // Ganti tanda - berulang menjadi satu
}

// ==========================
// Loading Screen Management
// ==========================
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const sectionCategories = document.getElementById('sectionCategories');
const sectionArticles = document.getElementById('sectionArticles');

// Total loading progress counts to 100
let loadingProgress = 0;
const PROGRESS_CATEGORIES = 30; // Categories data is 30% of loading
const PROGRESS_ARTICLES = 70;   // Articles data is 70% of loading

// Update loading progress
function updateLoadingProgress(section, increment) {
  loadingProgress += increment;
  loadingBar.style.width = `${loadingProgress}%`;
  
  // Mark section as loaded
  if (section) {
    const sectionElement = document.getElementById(`section${section}`);
    if (sectionElement) {
      sectionElement.classList.add('loaded');
    }
  }
  
  // Update loading text based on progress
  if (loadingProgress < 40) {
    loadingText.textContent = 'Memuat kategori...';
  } else if (loadingProgress < 80) {
    loadingText.textContent = 'Memuat artikel...';
  } else {
    loadingText.textContent = 'Hampir selesai...';
  }
  
  // Hide loading screen when complete
  if (loadingProgress >= 100) {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      // Remove from DOM after animation completes
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 300);
  }
}

// ==========================
// NAVBAR TOGGLE (Responsive)
// ==========================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navbarLinks = document.getElementById('navbarLinks');

hamburgerBtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
    // contoh ganti style display
    if (navbarLinks.style.display === 'none') {
        navbarLinks.style.display = 'block';
    } else {
        navbarLinks.style.display = 'none';
    }
});

// ==========================
// Konfigurasi Endpoint
// ==========================
const ARTICLES_FILTER_ENDPOINT = '/articles/filter'; // endpoint filter
const CATEGORIES_ENDPOINT = '/categories';            // endpoint kategori

// ==========================
// Variabel Global
// ==========================
let currentPage = 1;            // Halaman saat ini
const limit = 10;               // Jumlah artikel per halaman
let totalPages = 1;             // Akan diupdate dari server
let currentCategory = '';       // Kategori terpilih
let currentSearch = '';         // Keyword pencarian

// DOM Elements
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const blogGrid = document.getElementById('blogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// ==========================
// Fetch Daftar Kategori
// ==========================
function fetchCategories() {
    loadingText.textContent = 'Memuat daftar kategori...';
    
    fetch(CATEGORIES_ENDPOINT)
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Failed to fetch categories');
            }
            return resp.json();
        })
        .then(categories => {
            // Bersihkan lalu tambahkan "All Categories"
            categorySelect.innerHTML = '<option value="">All Categories</option>';

            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;  // value = nama kategori
                opt.textContent = cat; // teks yang ditampilkan
                categorySelect.appendChild(opt);
            });
            
            // Update loading progress
            updateLoadingProgress('Categories', PROGRESS_CATEGORIES);
        })
        .catch(err => {
            console.error('Error fetching categories:', err);
            // fallback jika error
            categorySelect.innerHTML = '<option value="">All Categories</option>';
            // Still update progress on error
            updateLoadingProgress('Categories', PROGRESS_CATEGORIES);
        });
}

// ==========================
// Fetch Articles (Server-Side Filter & Pagination)
// ==========================
function fetchArticles(isLoadMore = false) {
    // If initial load (not load more), update loading message
    if (!isLoadMore) {
        loadingText.textContent = 'Memuat artikel...';
    }
    
    // Siapkan query parameter
    // Contoh: /articles/filter?category=xxx&search=xxx&page=1&limit=10
    let url = `${ARTICLES_FILTER_ENDPOINT}?page=${currentPage}&limit=${limit}`;

    if (currentCategory) {
        url += `&category=${encodeURIComponent(currentCategory)}`;
    }
    if (currentSearch) {
        url += `&search=${encodeURIComponent(currentSearch)}`;
    }

    fetch(url)
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Failed to fetch articles');
            }
            return resp.json();
        })
        .then(data => {
            // data seharusnya memiliki format:
            // {
            //   data: [...array of articles...],
            //   total_data: 20,
            //   page: 1,
            //   limit: 10,
            //   total_page: 2
            // }

            const articles = data.data || [];
            totalPages = data.total_page || 1;

            // Render / tampilan
            // Jika isLoadMore = false, clear grid terlebih dahulu
            renderArticles(articles, isLoadMore);

            // Tampilkan/tidak tombol loadMore
            if (currentPage >= totalPages) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
            }
            
            // Only update loading progress if this is the initial load
            if (!isLoadMore) {
                updateLoadingProgress('Articles', PROGRESS_ARTICLES);
            }
        })
        .catch(err => {
            console.error('Error fetching articles:', err);
            // Still update progress on error if initial load
            if (!isLoadMore) {
                loadingText.textContent = 'Gagal memuat artikel. Silakan coba lagi...';
                updateLoadingProgress('Articles', PROGRESS_ARTICLES);
            }
        });
}

// ==========================
// Render Artikel ke Halaman
// ==========================
function renderArticles(articles, append = false) {
    // Jika bukan append (bukan "Load More"), bersihkan grid
    if (!append) {
        blogGrid.innerHTML = '';
    }

    // Looping setiap artikel
    articles.forEach(article => {
        // Asumsi properti object: 
        // { ID, Title, MainImage, Category, Description, Publisher, ReadingTime, Likes, ... }
        const id = article.ID || 0;
        const title = article.Title || 'Untitled';
        const category = article.Category || 'Uncategorized';
        const desc = article.Description || 'No description';
        const image = article.MainImage
            ? `/${article.MainImage}`
            : 'https://via.placeholder.com/400x200?text=No+Image';
        const publisher = article.Publisher || 'Anonymous';
        const readingTime = article.ReadingTime || 0;
        const likes = article.Likes || 0;
        const comment = article.Comments || 0;

        // Buat elemen card
        const card = document.createElement('div');
        card.classList.add('blog-card');
        card.innerHTML = `
          <img src="${image}" alt="${title}">
          <div class="blog-card-content">
            <span class="blog-category">${category}</span>
            <h3 class="blog-title">${title}</h3>
            <p class="blog-desc">${desc.substring(0, 250)}...</p>
            <div class="blog-meta">
              <span>
                <ion-icon name="time-outline"></ion-icon> ${readingTime} min
              </span>
              <span>
                <ion-icon name="heart-outline"></ion-icon> ${likes}
              </span>
              <span>
                <ion-icon name="chatbubble-outline"></ion-icon> ${comment}
              </span>
            </div>
            <div class="blog-footer">
              <span>By ${publisher}</span>
              <a href="/article/${id}/${slugify(title)}" class="blog-readmore">Read More</a>
            </div>
          </div>
        `;
        blogGrid.appendChild(card);
    });
}

// ==========================
// Event: LOAD MORE
// ==========================
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    // isLoadMore = true => kita append artikel baru
    fetchArticles(true);
});

// ==========================
// Event: Perubahan Kategori
// ==========================
categorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    // Reset pencarian
    // (Terserah mau di-reset atau tidak, disesuaikan)
    // currentSearch = '';
    // searchInput.value = '';

    // Reset page ke 1
    currentPage = 1;
    fetchArticles(false);
});

// ==========================
// Event: Search
// ==========================
searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value;
    // Reset page
    currentPage = 1;
    fetchArticles(false);
});

// ==========================
// DOM Loaded
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    loadingProgress = 0;
    loadingBar.style.width = '0%';
    
    // Pertama, ambil daftar kategori
    fetchCategories();

    // Mulai ambil artikel pertama kali
    currentPage = 1;
    fetchArticles(false);
});