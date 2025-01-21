let currentPageArticles = 1;
let currentPageCertificates = 1;

/**
 * Fungsi untuk melakukan logout otomatis saat sesi tidak valid.
 */
function logoutUser() {
    localStorage.removeItem('authToken');
    alert('Session expired or invalid. Please login again.');
    window.location.href = '/frontend/admin/src/pages/login/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('You must log in first.');
        window.location.href = '/frontend/admin/src/pages/login/index.html';
        return;
    }

    window.authHeader = {
        'Authorization': `Bearer ${token}`
    };

    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        console.log('Element #dynamic-content found. Loading dashboard...');
        loadContent('dashboard.html', 'Dashboard');
    } else {
        console.error('Element #dynamic-content NOT found!');
    }

    initializeSidebar();
    initializeLogout();
});

/**
 * Inisialisasi sidebar (menu dropdown, dll.)
 */
function initializeSidebar() {
    const arrowElements = document.querySelectorAll(".arrow");
    arrowElements.forEach(item => {
        item.addEventListener("click", () => {
            const parent = item.parentElement.parentElement;
            parent.classList.toggle("showMenu");
        });
    });

    const sidebar = document.querySelector(".sidebar");
    const sidebarBtn = document.querySelector(".bx-menu");
    if (sidebar && sidebarBtn) {
        sidebarBtn.addEventListener("click", () => {
            sidebar.classList.toggle("close");
        });
    }
}

/**
 * Inisialisasi event untuk logout.
 */
function initializeLogout() {
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        profileDetails.addEventListener('click', () => {
            const confirmLogout = confirm('Are you sure you want to log out?');
            if (confirmLogout) {
                logoutUser();
            }
        });
    } else {
        console.error('Profile details element not found!');
    }
}

/**
 * Fungsi untuk memuat konten HTML secara dinamis
 * dan melakukan inisialisasi sesuai halaman.
 */
function loadContent(page, title) {
    const dynamicContent = document.getElementById('dynamic-content');

    if (!dynamicContent) {
        console.error('Dynamic content container not found.');
        return;
    }

    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Page not found: ${page}`);
            }
            return response.text();
        })
        .then(html => {
            console.log(`Page loaded: ${page}`);
            dynamicContent.innerHTML = html;
            document.title = title;

            if (page === 'dashboard.html') {
                console.log('Initializing Dashboard');
                loadArticles();
                loadCertificates();
            } else if (page === 'write_articles.html') {
                console.log('Initializing Write Articles');
                initializeWriteArticles();
                const writeArticleForm = document.getElementById('writeArticleForm');
                if (writeArticleForm) {
                    writeArticleForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        submitArticleForm();
                    });
                } else {
                    console.error("Form #writeArticleForm not found!");
                }
            } else if (page === 'update_articles.html') {
                console.log('Initializing Update Article');
                initializeWriteArticles();
                initializeUpdateArticle();
            } else if (page === 'write_certificates.html') {
                console.log('Initializing Write Certificates');
                initializeWriteCertificates();
                const writeCertificateForm = document.getElementById('writeCertificateForm');
                if (writeCertificateForm) {
                    writeCertificateForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        submitCertificateForm();
                    });
                } else {
                    console.error("Form #writeCertificateForm not found!");
                }
            } else if (page === 'update_certificate.html') {
                console.log('Initializing Update Certificate');
                initializeWriteCertificates()
                initializeUpdateCertificate();
            }
        })
        .catch(err => {
            console.error('Error loading content:', err);
        });
}


/**
 * Fungsi untuk menginisialisasi untuk mengambil data dan memuat kembali kedalam form
 */
function initializeUpdateArticle() {
    const form = document.getElementById('updateArticleForm');
    if (!form) {
        console.error("Update form not found!");
        return;
    }

    // Dapatkan ID artikel dari variabel global yang telah disimpan
    const articleId = window.currentArticleId;
    if (!articleId) {
        alert("Article ID is missing.");
        return;
    }

    // Mengambil detail artikel untuk mengisi form
    fetch(`/articles/${articleId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch article details');
            }
            return response.json();
        })
        .then(article => {
            document.getElementById('title').value = article.title || '';
            document.getElementById('author').value = article.author || '';
            document.getElementById('category').value = article.category || '';
            document.getElementById('tags').value = article.tags || '';
            document.getElementById('description').value = article.description || '';

            if (article.content) {
                const quillEditor = document.querySelector('#quillEditor .ql-editor');
                if (quillEditor) {
                    quillEditor.innerHTML = article.content;
                }
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error loading article details');
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const content = document.querySelector('#quillEditor .ql-editor').innerHTML.trim();
        const category = document.getElementById('category').value.trim();
        const description = document.getElementById('description').value.trim();
        const author = document.getElementById('author').value.trim();
        const tags = document.getElementById('tags').value.trim();
        const imageInput = document.getElementById('image');
        const image = imageInput.files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('author', author);
        formData.append('tags', tags);

        // Lampirkan waktu sekarang sebagai published_at
        formData.append('published_at', new Date().toISOString());

        if (image) {
            formData.append('image', image);
        }

        fetch(`/articles/${articleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to update article');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'Article updated successfully!');
                loadContent("dashboard.html", "Dashboard"); // Kembali ke dashboard setelah update
            })
            .catch(error => {
                console.error(error);
                alert('Error updating article: ' + error.message);
            });
    });
}

/**
 * Fungsi terpisah untuk menangani submit artikel.
 */
function submitArticleForm() {
    const title = document.getElementById('title').value.trim();
    const content = document.querySelector('#quillEditor .ql-editor').innerHTML.trim();
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();
    const author = document.getElementById('author').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const image = document.getElementById('image').files[0];

    if (!title || !content || !category || !description || !author || !tags || !image) {
        alert("Please fill all fields and select an image!");
        return;
    }

    console.log('Submitting article...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('author', author);
    formData.append('tags', tags);
    formData.append('image', image);

    // Debug: cek isi form data
    for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }

    document.body.classList.add('loading');

    fetch('/articles', {
        method: 'POST',
        headers: {
            'Authorization': window.authHeader.Authorization,
        },
        body: formData,
    })
        .then(response => {
            if (response.status === 401) {
                logoutUser();
                throw new Error('Unauthorized');
            }

            console.log("Response status:", response.status);
            return response.json().then(data => {
                if (!response.ok) {
                    console.error("Response data:", data);
                    throw new Error(`Failed to submit article. Status: ${response.status} - ${data.message}`);
                }
                return data;
            });
        })
        .then(data => {
            console.log("Response data:", data);
            if (data.success) {
                alert('Article submitted successfully!');
                loadContent("dashboard.html", "Dashboard");
            } else {
                console.error('Failed to submit article: ', data.message);
                alert('Failed to submit article: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error submitting article:', error);
            alert('Failed to submit article. Please try again.');
        })
        .finally(() => {
            document.body.classList.remove('loading');
        });
}

/**
 * Fungsi Submit Certificate
 */
function submitCertificateForm() {
    const title = document.getElementById('Certificate_title').value.trim();
    const publisher = document.getElementById('Certificate_publisher').value.trim();
    const category = document.getElementById('Certificate_category').value.trim();
    const tags = document.getElementById('Certificate_tags').value.trim();
    const description = document.getElementById('Certificate_description').value.trim();
    const imageInput = document.getElementById('Certificate_image');
    const image = imageInput.files[0];
    const verificationLink = document.getElementById('Certificate_verification_link')?.value.trim();

    if (!title || !publisher || !category || !tags || !description || !image) {
        alert("Please fill all fields and select an image!");
        return;
    }

    console.log('Submitting certificate...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('issued_by', publisher);  // Gunakan key 'issued_by' yang sesuai dengan server
    // Jika field 'category' dan 'tags' tidak digunakan oleh server, pengiriman ini bisa dihapus atau dibiarkan tanpa efek.
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('image', image);
    if (verificationLink) {
        formData.append('verification_link', verificationLink);
    }

    document.body.classList.add('loading');

    fetch('/certificates', {
        method: 'POST',
        headers: {
            'Authorization': window.authHeader.Authorization,
            // Jangan set 'Content-Type' secara manual ketika mengirim FormData; browser akan mengatur boundary yang tepat
        },
        body: formData,
    })
        .then(response => {
            if (response.status === 401) {
                logoutUser();
                throw new Error('Unauthorized');
            }
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Failed to submit certificate');
                });
            }
            return response.json();
        })
        .then(data => {
            // Server mengembalikan objek sertifikat, kita asumsikan sukses jika sampai sini
            alert('Certificate submitted successfully!');
            loadContent("dashboard.html", "Dashboard");
        })
        .catch(error => {
            console.error('Error submitting certificate:', error);
            alert('Failed to submit certificate. Please try again.');
        })
        .finally(() => {
            document.body.classList.remove('loading');
        });
}


/**
 * Inisialisasi Write Certificates
 */
function initializeWriteCertificates() {
    console.log('Write Certificate page initialized.');
    // Tambahkan logika tambahan jika diperlukan untuk halaman tulis sertifikat.
}

/**
 * Inisialisasi untuk Update Certificates
 */
function initializeUpdateCertificate() {
    const form = document.getElementById('updateCertificateForm');
    if (!form) {
        console.error("Update Certificate form not found!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const certificateId = urlParams.get('id') || window.currentCertificateId;
    if (!certificateId) {
        alert("Certificate ID is missing.");
        return;
    }

    // Mendapatkan detail sertifikat untuk mengisi form
    fetch(`/certificates/${certificateId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch certificate details');
            }
            return response.json();
        })
        .then(certificate => {
            document.getElementById('Certificate_title').value = certificate.title || '';
            document.getElementById('Certificate_publisher').value = certificate.issued_by || '';
            document.getElementById('Certificate_description').value = certificate.description || '';
            // Isikan field lain jika diperlukan
        })
        .catch(error => {
            console.error(error);
            alert('Error loading certificate details');
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('Certificate_title').value.trim();
        const issuedBy = document.getElementById('Certificate_publisher').value.trim();
        const description = document.getElementById('Certificate_description').value.trim();
        const imageInput = document.getElementById('Certificate_image');
        const image = imageInput.files[0];
        const verificationLink = document.getElementById('Certificate_verification_link')?.value.trim();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('issued_by', issuedBy);
        formData.append('issued_at', new Date().toISOString());
        if (verificationLink) {
            formData.append('verification_link', verificationLink);
        }
        if (image) {
            formData.append('image', image);
        }

        fetch(`/certificates/${certificateId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to update certificate');
                    });
                }
                if (response.status == 204){
                    return{};
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'Certificate updated successfully!');
                loadContent("dashboard.html", "Dashboard");
            })
            .catch(error => {
                console.error(error);
                alert('Error updating certificate: ' + error.message);
            });
    });
}


/**
 * Inisialisasi Quill untuk halaman Write Articles.
 */
function initializeWriteArticles() {
    const editor = document.getElementById('quillEditor');
    if (!editor) {
        console.error('Editor element not found!');
        return;
    }
    Quill.register('modules/blotFormatter', QuillBlotFormatter.default)

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
    ];

    const quill = new Quill('#quillEditor', {
        theme: 'snow',
        placeholder: 'Start writing your article here...',
        modules: {
            toolbar: toolbarOptions,
            syntax: {
                highlight: text => hljs.highlightAuto(text).value
            },
            blotFormatter: {}
        }
    });
    console.log('Quill.js editor initialized with enriched toolbar and blot formatter!');

    // Logika untuk Preview
    const previewButton = document.getElementById('previewButton');
    const previewModal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');
    const closePreview = document.getElementById('closePreview');

    if (previewButton) {
        previewButton.addEventListener('click', () => {
            const title = document.getElementById('title')?.value || '';
            const author = document.getElementById('author')?.value || '';
            const imageFile = document.getElementById('image')?.files[0];
            const content = quill.root.innerHTML;

            let imagePreviewUrl = '';
            if (imageFile) {
                imagePreviewUrl = URL.createObjectURL(imageFile);
            }

            const sanitizedContent = DOMPurify.sanitize(content);

            previewContent.innerHTML = `
              <section class="flex flex-column" id="mainArticle">
                <header id="article_title">
                  <h1>${title}</h1>
                </header>
                <div id="main_article_image">
                  ${imagePreviewUrl ? `<img src="${imagePreviewUrl}" alt="${title}" />` : ''}
                </div>
                <article class="flex flex-column">
                  <div class="content">
                    <header id="article_writers">
                      <h4>By ${author}</h4>
                      <p>${new Date().toLocaleDateString()}</p>
                    </header>
                  </div>
                  <p>${sanitizedContent}</p>
                </article>
              </section>
            `;
            previewModal.style.display = 'block';
        });
    }

    if (closePreview) {
        closePreview.addEventListener('click', () => {
            previewModal.style.display = 'none';
        });
    }
}


/**
 * Load daftar Articles (paginasi).
 */
function loadArticles(page = 1) {
    const articlesTableBody = document.getElementById('articlesTableBody');
    const articlesTable = document.getElementById('articlesTable');
    const articlesPagination = document.getElementById('articlesPagination');

    if (!articlesTableBody || !articlesTable || !articlesPagination) {
        console.error('Articles table elements not found!');
        return;
    }

    fetch(`/articles?page=${page}&limit=10`, {
        headers: window.authHeader,
    })
        .then(response => response.json())
        .then(articles => {
            articlesTableBody.innerHTML = '';
            if (articles.length === 0) {
                articlesTable.style.display = 'none';
                articlesPagination.style.display = 'none';
            } else {
                articlesTable.style.display = 'table';
                articlesPagination.style.display = 'block';

                articles.forEach(article => {
                    const row = `
          <tr>
            <td>${article.id}</td>
            <td>${article.title}</td>
            <td>${article.published_at || 'N/A'}</td>
            <td>${article.author || 'N/A'}</td>
            <td>
                <button onclick="updateArticle(${article.id})">Update</button>
                <button onclick="deleteArticle(${article.id})">Delete</button>
            </td>
          </tr>`;
                    articlesTableBody.insertAdjacentHTML('beforeend', row);
                });

                togglePaginationVisibility('articles', page, articles.length, 10);
            }
        })
        .catch(err => console.error('Failed to fetch articles:', err));
}

/**
 * Load daftar Certificates (paginasi).
 */
function loadCertificates(page = 1) {
    const certificatesTableBody = document.getElementById('certificatesTableBody');
    const certificatesTable = document.getElementById('certificatesTable');
    const certificatesPagination = document.getElementById('certificatesPagination');

    if (!certificatesTableBody || !certificatesTable || !certificatesPagination) {
        console.error('Certificates table elements not found!');
        return;
    }

    fetch(`/certificates?page=${page}&limit=10`, {
        headers: window.authHeader,
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Failed to fetch certificates');
                });
            }
            return response.json();
        })
        .then(certificates => {
            certificatesTableBody.innerHTML = '';
            if (!Array.isArray(certificates) || certificates.length === 0) {
                certificatesTable.style.display = 'none';
                certificatesPagination.style.display = 'none';
            } else {
                certificatesTable.style.display = 'table';
                certificatesPagination.style.display = 'block';

                certificates.forEach(certificate => {
                    const row = `
                  <tr>
                    <td>${certificate.id}</td>
                    <td>${certificate.title}</td>
                    <td>${certificate.issued_at ? new Date(certificate.issued_at).toLocaleString() : 'N/A'}</td>
                    <td>${certificate.issued_by || 'N/A'}</td>
                    <td>
                        <button onclick="updateCertificate(${certificate.id})">Update</button>
                        <button onclick="deleteCertificate(${certificate.id})">Delete</button>
                    </td>
                  </tr>`;
                    certificatesTableBody.insertAdjacentHTML('beforeend', row);
                });

                togglePaginationVisibility('certificates', page, certificates.length, 10);
            }
        })
        .catch(err => console.error('Failed to fetch certificates:', err));
}


/**
 * Tampilkan / sembunyikan tombol pagination Next/Prev.
 */
function togglePaginationVisibility(type, page, dataLength, limit) {
    const pagination = document.getElementById(`${type}Pagination`);
    if (!pagination) return;

    const prevButton = pagination.querySelector(`button[onclick="changePage('${type}', -1)"]`);
    const nextButton = pagination.querySelector(`button[onclick="changePage('${type}', 1)"]`);

    if (prevButton) prevButton.style.display = page > 1 ? 'inline-block' : 'none';
    if (nextButton) nextButton.style.display = dataLength === limit ? 'inline-block' : 'none';
}

/**
 * Ganti halaman (pagination).
 */
function changePage(type, direction) {
    if (type === 'articles') {
        currentPageArticles += direction;
        if (currentPageArticles < 1) currentPageArticles = 1;
        loadArticles(currentPageArticles);
    } else if (type === 'certificates') {
        currentPageCertificates += direction;
        if (currentPageCertificates < 1) currentPageCertificates = 1;
        loadCertificates(currentPageCertificates);
    }
}

/**
 * Hapus Article.
 */
function deleteArticle(id) {
    fetch(`/articles/${id}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(response => {
            if (response.status === 401) {
                logoutUser();
                return;
            }
            if (response.ok) {
                alert('Article deleted successfully');
                loadArticles();
            } else {
                alert('Failed to delete article');
            }
        })
        .catch(err => console.error('Error:', err));
}

/**
 * Hapus Certificate.
 */
function deleteCertificate(id) {
    fetch(`/certificates/${id}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(response => {
            if (response.status === 401) {
                logoutUser();
                return;
            }
            if (response.ok) {
                alert('Certificate deleted successfully');
                loadCertificates();
            } else {
                alert('Failed to delete certificate');
            }
        })
        .catch(err => console.error('Error:', err));
}

/**
 * Update Article.
 */
function updateArticle(id) {
    loadContent('update_articles.html', 'Update Article');
    window.currentArticleId = id;
}

/**
 * Update Certificate.
 */
function updateCertificate(id) {
    loadContent('update_certificate.html', 'Update Certificate')
    window.currentCertificateId = id;
}
