/* ============= index.js ============= */
let currentPageArticles = 1;
let currentPageCertificates = 1;

function logoutUser() {
    localStorage.removeItem('authToken');
    alert('You have logged out.');
    window.location.href = '/Frontend/admin/src/pages/login/index.html'; // Sesuaikan path login
}

// Dipanggil saat halaman load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You must log in first.');
        window.location.href = '/Frontend/admin/src/pages/login/index.html';
        return;
    }

    // Global header auth
    window.authHeader = {
        'Authorization': `Bearer ${token}`
    };

    // Load dashboard secara default
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        loadContent('dashboard.html', 'Dashboard');
    }

    initializeSidebar();
});

/* SIDEBAR & TOGGLE */
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

/* Pemuatan Halaman Dinamis */
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
            dynamicContent.innerHTML = html;
            document.title = title;

            // Inisialisasi sesuai halaman
            if (page === 'dashboard.html') {
                loadArticles();
                loadCertificates();
                loadStats();
            }
            else if (page === 'write_articles.html') {
                initializeWriteArticles();
                const writeArticleForm = document.getElementById('writeArticleForm');
                if (writeArticleForm) {
                    writeArticleForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        submitArticleForm();
                    });
                }
            }
            else if (page === 'update_articles.html') {
                initializeWriteArticles();
                initializeUpdateArticle();
            }
            else if (page === 'write_certificates.html') {
                initializeWriteCertificates();
                const writeCertificateForm = document.getElementById('writeCertificateForm');
                if (writeCertificateForm) {
                    writeCertificateForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        submitCertificateForm();
                    });
                }
            }
            else if (page === 'update_certificate.html') {
                initializeWriteCertificates();
                initializeUpdateCertificate();
            }
            else if (page === 'comments.html'){
                initializeComments();
            }
        })
        .catch(err => {
            showToast(`Error loading content ${err}`, 'error')
            console.error('Error loading content:', err);
        });
}

/*======================= Bagian Statistic ====================*/
function loadStats() {
    fetch('/admin/stats', {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch stats');
            showToast(`Error Failed to fetch stats ${res.status}`, 'error');
            return res.json();
        })
        .then(data => {
            document.getElementById('dashTotalArticles').textContent = data.total_articles;
            document.getElementById('dashTotalCertificates').textContent = data.total_certificates;
            document.getElementById('dashTotalComments').textContent = data.total_comments;
            document.getElementById('dashApprovedComments').textContent = data.approved_comments;
            document.getElementById('dashPendingComments').textContent = data.pending_comments;
            document.getElementById('dashRejectedComments').textContent = data.rejected_comments;
            document.getElementById('dashTotalLikes').textContent = data.total_likes;
            document.getElementById('dashTotalViews').textContent = data.total_views;
        })
        .catch(err => {
            showToast("Error fetching dashboard stats", 'error');
            console.error('Error fetching dashboard stats:', err);
        });
}


/*=======================Bagian Comments=======================*/
function initializeComments() {
    console.log("Initialize Comments Page");

    loadComments(1); // load halaman pertama

    // Setup search
    const searchBox = document.getElementById('searchComments');
    if (searchBox) {
        searchBox.addEventListener('input', () => {
            currentCommentsPage = 1;
            loadComments(currentCommentsPage);
        });
    }

    // Setup pagination
    const prevBtn = document.getElementById('commentsPrev');
    const nextBtn = document.getElementById('commentsNext');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentCommentsPage--;
            if (currentCommentsPage < 1) currentCommentsPage = 1;
            loadComments(currentCommentsPage);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentCommentsPage++;
            loadComments(currentCommentsPage);
        });
    }

    // Tombol close detail
    const btnCloseDetail = document.getElementById('btnCloseDetail');
    if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', () => {
            document.getElementById('commentDetailSection').style.display = 'none';
        });
    }

    // Tombol reply
    const btnReply = document.getElementById('btnReply');
    if (btnReply) {
        btnReply.addEventListener('click', () => {
            document.getElementById('replyContainer').style.display = 'block';
        });
    }

    // Tombol submit reply
    const btnSubmitReply = document.getElementById('btnSubmitReply');
    if (btnSubmitReply) {
        btnSubmitReply.addEventListener('click', () => {
            submitReply();
        });
    }

    // Tombol Approve
    const btnApprove = document.getElementById('btnApprove');
    if (btnApprove) {
        btnApprove.addEventListener('click', () => {
            if (currentCommentID) approveComment(currentCommentID);
        });
    }

    // Tombol Reject
    const btnReject = document.getElementById('btnReject');
    if (btnReject) {
        btnReject.addEventListener('click', () => {
            if (currentCommentID) rejectComment(currentCommentID);
        });
    }

    // Tombol Reset
    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (currentCommentID) resetComment(currentCommentID);
        });
    }
}


let currentCommentsPage = 1;
let currentCommentID = null; // untuk menyimpan ID comment yg sedang di-detail

function loadComments(page = 1) {
    currentCommentsPage = page;

    // Ambil search
    const searchVal = document.getElementById('searchComments')?.value.trim() || '';
    // Endpoint GET /admin/comments?limit=&page=&search=
    const url = `http://localhost:8080/admin/comments?page=${page}&limit=10&search=${encodeURIComponent(searchVal)}`;

    fetch(url, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch comments');
            return res.json();
        })
        .then(data => {
            // data = { data: [...], total_data, page, limit, total_page }
            const items = data.data || [];
            const total = data.total_data || 0;
            const totalPages = data.total_page || 1;

            const commentsTable = document.getElementById('commentsTable');
            const commentsTbody = document.getElementById('commentsTbody');
            const commentsPagination = document.getElementById('commentsPagination');
            const commentsPageInfo = document.getElementById('commentsPageInfo');

            if (!items.length) {
                commentsTable.style.display = 'none';
                commentsPagination.style.display = 'none';
                return;
            }
            commentsTable.style.display = 'table';
            commentsPagination.style.display = 'flex';
            commentsTbody.innerHTML = '';

            items.forEach(cmt => {
                const row = `
          <tr>
            <td>${cmt.ID}</td>
            <td>${cmt.ArticleID}</td>
            <td>${cmt.Name || 'Anonymous'}</td>
            <td>${cmt.Email || ''}</td>
            <td>${cmt.Content}</td>
            <td>${cmt.Status}</td>
            <td>
              <button onclick="detailComment(${cmt.ID})">Detail</button>
            </td>
          </tr>
        `;
                commentsTbody.insertAdjacentHTML('beforeend', row);
            });

            commentsPageInfo.textContent = `Page ${data.page} of ${totalPages}`;

            const prevBtn = document.getElementById('commentsPrev');
            const nextBtn = document.getElementById('commentsNext');
            prevBtn.style.display = (page > 1) ? 'inline-block' : 'none';
            nextBtn.style.display = (page < totalPages) ? 'inline-block' : 'none';
        })
        .catch(err => {
            showToast("error loadComments", "error")
            console.error('Error loadComments:', err);
        });
}


function approveComment(commentId) {
    fetch(`http://localhost:8080/admin/comments/${commentId}/approve`, {
        method: 'PATCH',
        headers: window.authHeader
    })
        .then(res => {
            showToast("Comment failed to approve", "error")
            if (!res.ok) throw new Error('Failed to approve comment');
            return res.json();
        })
        .then(data => {
            // alert('Comment approved!');
            showToast("Comment Approved!", "success")
            loadComments(currentCommentsPage);
            document.getElementById('detailStatus').textContent = 'approved';
        })
        .catch(err => console.error('approveComment error:', err));
}

function rejectComment(commentId) {
    fetch(`http://localhost:8080/admin/comments/${commentId}/reject`, {
        method: 'PATCH',
        headers: window.authHeader
    })
        .then(res => {
            showToast("Failed to reject comment!", "error")
            if (!res.ok) throw new Error('Failed to reject comment');
            return res.json();
        })
        .then(data => {
            // alert('Comment rejected!');
            showToast("Comment Rejected!", "success")
            loadComments(currentCommentsPage);
            document.getElementById('detailStatus').textContent = 'rejected';
        })
        .catch(err => console.error('rejectComment error:', err));
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Buat elemen toast
    const toast = document.createElement('div');
    toast.classList.add('toast');

    // Tambahkan kelas tipe (toast-success / toast-error / toast-warning / toast-info)
    switch (type) {
        case 'success':
            toast.classList.add('toast-success');
            break;
        case 'error':
            toast.classList.add('toast-error');
            break;
        case 'warning':
            toast.classList.add('toast-warning');
            break;
        default:
            toast.classList.add('toast-info');
    }

    // Isi pesan
    toast.textContent = message;

    // Masukkan ke container
    container.appendChild(toast);

    // Hapus setelah animasi fadeOut selesai (4 detik total)
    setTimeout(() => {
        if (toast.parentElement) {
            container.removeChild(toast);
        }
    }, 4000);
}


function resetComment(commentId) {
    fetch(`http://localhost:8080/admin/comments/${commentId}/reset`, {
        method: 'PATCH',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to reset comment');
            return res.json();
        })
        .then(data => {
            alert('Comment reset to pending!');
            loadComments(currentCommentsPage);
            document.getElementById('detailStatus').textContent = 'pending';
        })
        .catch(err => console.error('resetComment error:', err));
}


let currentCommentID = null;

function detailComment(commentId) {
    currentCommentID = commentId; // simpan ID ke global
    // GET /admin/comments/:id => detail
    fetch(`http://localhost:8080/admin/comments/${commentId}`, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to get comment detail');
            return res.json();
        })
        .then(comment => {
            document.getElementById('detailCommentID').textContent = comment.id;
            document.getElementById('detailArticleID').textContent = comment.article_id;
            document.getElementById('detailParentID').textContent = comment.parent_id || '';
            document.getElementById('detailName').textContent = comment.name || 'Anonymous';
            document.getElementById('detailEmail').textContent = comment.email || '';
            document.getElementById('detailStatus').textContent = comment.status;
            document.getElementById('detailContent').textContent = comment.content;

            // Tampilkan detail section
            document.getElementById('commentDetailSection').style.display = 'block';
            // Sembunyikan replyContainer
            document.getElementById('replyContainer').style.display = 'none';
        })
        .catch(err => console.error('detailComment error:', err));
}

function submitReply() {
    if (!currentCommentID) {
        alert('No comment selected');
        return;
    }
    const replyText = document.getElementById('replyContent').value.trim();
    if (!replyText) {
        alert('Reply content is empty');
        return;
    }

    const formData = new FormData();
    formData.append('content', replyText);

    fetch(`http://localhost:8080/admin/comments/${currentCommentID}/reply`, {
        method: 'POST',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to reply comment');
            return res.json();
        })
        .then(data => {
            alert('Reply sent successfully!');
            // reload comments
            loadComments(currentCommentsPage);
            // close reply container
            document.getElementById('replyContainer').style.display = 'none';
            document.getElementById('replyContent').value = '';
        })
        .catch(err => console.error('Error submitReply:', err));
}



/* ====================== BAGIAN ARTIKEL ====================== */
function loadArticles(page = 1) {
    currentPageArticles = page;
    fetch(`/articles/filter?limit=10&page=${page}`, {
        headers: window.authHeader
    })
        .then(res => res.json())
        .then(data => {
            // data = { data: [...], total_data, page, limit, total_page }
            const articlesTable = document.getElementById('articlesTable');
            const articlesTableBody = document.getElementById('articlesTableBody');
            const articlesPagination = document.getElementById('articlesPagination');

            if (!articlesTable || !articlesTableBody || !articlesPagination) return;

            if (!data.data || data.data.length === 0) {
                articlesTable.style.display = 'none';
                articlesPagination.style.display = 'none';
                return;
            }
            articlesTable.style.display = 'table';
            articlesPagination.style.display = 'block';

            articlesTableBody.innerHTML = '';
            data.data.forEach(article => {
                const row = `
          <tr>
            <td>${article.ID}</td>
            <td>${article.Title}</td>
            <td>${article.CreatedAt || 'N/A'}</td>
            <td>${article.Publisher || 'N/A'}</td>
            <td>
              <button onclick="updateArticle(${article.ID})">Update</button>
              <button onclick="deleteArticle(${article.ID})">Delete</button>
            </td>
          </tr>
        `;
                articlesTableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(err => console.error('Error loadArticles:', err));
}

function updateArticle(id) {
    window.currentArticleId = id; // simpan agar nanti di update_articles.html dipakai
    loadContent('update_articles.html', 'Update Article');
}

function deleteArticle(id) {
    if (!confirm('Are you sure to delete this article?')) return;

    fetch(`/admin/articles/${id}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete article');
            return res.json();
        })
        .then(data => {
            alert('Article deleted successfully!');
            loadContent('dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('Error deleting article:', err));
}

/* Submit Article (Write) */
function submitArticleForm() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageFile = document.getElementById('image').files[0];
    const content = document.querySelector('#quillEditor .ql-editor').innerHTML.trim();

    if (!title || !author || !category || !tags || !description || !content) {
        alert('Please fill all fields');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', author); // server side mungkin "publisher"
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('content', content);
    if (imageFile) formData.append('main_image', imageFile);

    fetch('/admin/articles', {
        method: 'POST',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to create article');
            return res.json();
        })
        .then(resp => {
            alert('Article created successfully!');
            loadContent('dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('submitArticleForm:', err));
}

/* Update Article */
function initializeUpdateArticle() {
    const articleId = window.currentArticleId;
    if (!articleId) {
        alert('Missing article ID.');
        return;
    }

    // fetch detail
    fetch(`/articles/${articleId}`, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch article detail');
            return res.json();
        })
        .then(article => {
            document.getElementById('title').value = article.Title || '';
            document.getElementById('author').value = article.Publisher || '';
            document.getElementById('category').value = article.Category || '';
            document.getElementById('tags').value = article.Tags || '';
            document.getElementById('description').value = article.Description || '';

            const editor = document.querySelector('#quillEditor .ql-editor');
            if (editor) editor.innerHTML = article.Content || '';
        })
        .catch(err => {
            console.error('Error fetch article:', err);
            alert('Error loading article');
        });

    const form = document.getElementById('updateArticleForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        updateArticleSubmit(articleId);
    });
}

function updateArticleSubmit(articleId) {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const description = document.getElementById('description').value.trim();
    const content = document.querySelector('#quillEditor .ql-editor').innerHTML.trim();
    const imageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', author);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('content', content);
    if (imageFile) formData.append('main_image', imageFile);

    fetch(`/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if(!res.ok) throw new Error('Failed to update article');
            return res.json();
        })
        .then(data => {
            showToast(`Article ${data} update successfully!`, 'success');
            // alert('Article updated successfully!');
            loadContent('dashboard.html', 'Dashboard');
        })
        .catch(err => {

            console.error('Error updating article:', err);
            showToast(`Error Update article ${err}`, 'error');
        });
}

/* Quill Editor Inisialisasi (Write Article) */
function initializeWriteArticles() {
    console.log("initializeWriteArticles: setting up Quill");
    Quill.register('modules/blotFormatter', QuillBlotFormatter.default);

    const editorEl = document.getElementById('quillEditor');
    if (!editorEl) return;

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

    new Quill('#quillEditor', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions,
            syntax: {
                highlight: text => hljs.highlightAuto(text).value
            },
            blotFormatter: {}
        }
    });
}

/* ====================== BAGIAN CERTIFICATE ====================== */
function loadCertificates(page = 1) {
    currentPageCertificates = page;
    fetch(`/certificates?page=${page}&limit=10`, {
        headers: window.authHeader
    })
        .then(res => res.json())
        .then(certData => {
            const certificatesTable = document.getElementById('certificatesTable');
            const certificatesTableBody = document.getElementById('certificatesTableBody');
            const certificatesPagination = document.getElementById('certificatesPagination');

            if (!certificatesTable || !certificatesTableBody || !certificatesPagination) return;

            if (!Array.isArray(certData) || certData.length === 0) {
                certificatesTable.style.display = 'none';
                certificatesPagination.style.display = 'none';
                return;
            }

            certificatesTable.style.display = 'table';
            certificatesPagination.style.display = 'block';
            certificatesTableBody.innerHTML = '';

            certData.forEach(cert => {
                const row = `
          <tr>
            <td>${cert.id}</td>
            <td>${cert.title}</td>
            <td>${cert.published_at || 'N/A'}</td>
            <td>${cert.author || 'N/A'}</td>
            <td>
              <button onclick="updateCertificate(${cert.id})">Update</button>
              <button onclick="deleteCertificate(${cert.id})">Delete</button>
            </td>
          </tr>
        `;
                certificatesTableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(err => console.error('Error loadCertificates:', err));
}

function deleteCertificate(id) {
    if(!confirm('Are you sure to delete this certificate?')) return;

    fetch(`/admin/certificates/${id}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(res => {
            if(!res.ok) throw new Error('Failed to delete certificate');
            return res.json();
        })
        .then(data => {
            showToast(`Certificate ${data} deleted successfully `, 'success')
            // alert('Certificate deleted successfully!');
            loadContent('dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('Error deleting certificate:', err));
}

function updateCertificate(id) {
    window.currentCertificateId = id;
    loadContent('update_certificate.html', 'Update Certificate');
}

/* Write Certificates */
function initializeWriteCertificates() {
    console.log("initializeWriteCertificates: no Quill needed unless you want it");
}

/* Submit Certificate (Write) */
function submitCertificateForm() {
    const title = document.getElementById('Certificate_title').value.trim();
    const publisher = document.getElementById('Certificate_publisher').value.trim();
    const category = document.getElementById('Certificate_category').value.trim();
    const tags = document.getElementById('Certificate_tags').value.trim();
    const description = document.getElementById('Certificate_description').value.trim();
    const imageFile = document.getElementById('Certificate_image').files[0];
    const verificationLink = document.getElementById('Certificate_verification_link').value.trim();

    if (!title || !publisher || !category || !tags || !description || !imageFile) {
        alert('Please fill all fields and select an image');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', publisher);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('cert_image', imageFile); // sesuai field server
    if (verificationLink) {
        formData.append('link', verificationLink);
    }

    fetch('/admin/certificates', {
        method: 'POST',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if(!res.ok) throw new Error('Failed to create certificate');
            return res.json();
        })
        .then(resp => {
            alert('Certificate created successfully!');
            loadContent('dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('Error create certificate:', err));
}

/* Update Certificate */
function initializeUpdateCertificate() {
    const certId = window.currentCertificateId;
    if(!certId) {
        alert('Missing certificate ID');
        return;
    }

    // fetch detail
    fetch(`/certificates/${certId}`, {
        headers: window.authHeader
    })
        .then(res => {
            if(!res.ok) throw new Error('Failed to fetch certificate detail');
            return res.json();
        })
        .then(cert => {
            document.getElementById('Certificate_title').value = cert.title || '';
            document.getElementById('Certificate_publisher').value = cert.publisher || '';
            document.getElementById('Certificate_category').value = cert.category || '';
            document.getElementById('Certificate_tags').value = cert.tags || '';
            document.getElementById('Certificate_description').value = cert.description || '';
            if(cert.link) {
                document.getElementById('Certificate_verification_link').value = cert.link;
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error load certificate detail');
        });

    const form = document.getElementById('updateCertificateForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        updateCertificateSubmit(certId);
    });
}

function updateCertificateSubmit(certId) {
    const title = document.getElementById('Certificate_title').value.trim();
    const publisher = document.getElementById('Certificate_publisher').value.trim();
    const category = document.getElementById('Certificate_category').value.trim();
    const tags = document.getElementById('Certificate_tags').value.trim();
    const description = document.getElementById('Certificate_description').value.trim();
    const imageFile = document.getElementById('Certificate_image').files[0];
    const link = document.getElementById('Certificate_verification_link').value.trim();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', publisher);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('description', description);
    if (imageFile) {
        formData.append('cert_image', imageFile);
    }
    if (link) {
        formData.append('link', link);
    }

    fetch(`/admin/certificates/${certId}`, {
        method: 'PUT',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if(!res.ok) throw new Error('Failed to update certificate');
            return res.json();
        })
        .then(resp => {
            alert('Certificate updated successfully!');
            loadContent('dashboard.html', 'Dashboard');
        })
        .catch(err => {
            console.error(err);
            alert('Error updating certificate');
        });
}
