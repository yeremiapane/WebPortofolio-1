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
        })
        .catch(err => {
            console.error('Error fetching categories:', err);
            // fallback jika error
            categorySelect.innerHTML = '<option value="">All Categories</option>';
        });
}

// ==========================
// Fetch Articles (Server-Side Filter & Pagination)
// ==========================
function fetchArticles(isLoadMore = false) {
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
        })
        .catch(err => {
            console.error('Error fetching articles:', err);
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
    // Pertama, ambil daftar kategori
    fetchCategories();

    // Mulai ambil artikel pertama kali
    currentPage = 1;
    fetchArticles(false);
});