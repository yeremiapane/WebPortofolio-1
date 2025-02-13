/* ============= index.js ============= */

/** GLOBAL VARIABLES **/
let currentPageArticles = 1;
let currentPageCertificates = 1;
let currentCommentsPage = 1;
let currentCommentID = null;
let currentArticleId = null;
let currentCertificateId = null;

/** LOGOUT USER **/
function logoutUser() {
    localStorage.removeItem('authToken');
    showToast('You have logged out.', 'info');
    window.location.href = '/admin/login'; // Sesuaikan path login
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showToast('You must log in first.', 'error');
        window.location.href = '/admin/login';
        return;
    }
    // Global header auth
    window.authHeader = { 'Authorization': `Bearer ${token}` };

    // Load dashboard secara default
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
    }

    initializeSidebar();
});

/** SIDEBAR & TOGGLE **/
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

/** LOAD CONTENT DINAMIS **/
function loadContent(page, title) {
    const dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) return;

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
            if (page === '/admin_dashboard_pages/dashboard.html') {
                loadArticles();
                loadCertificates();
                loadStats();
            } else if (page === '/admin_dashboard_pages/write_articles.html') {
                initializeWriteArticles();
                setupArticlePreview(); // setup preview
                const form = document.getElementById('writeArticleForm');
                if (form) {
                    form.addEventListener('submit', e => {
                        e.preventDefault();
                        submitArticleForm();
                    });
                }
            } else if (page === '/admin_dashboard_pages/update_articles.html') {
                initializeWriteArticles();
                setupArticlePreview();
                initializeUpdateArticle();
            } else if (page === '/admin_dashboard_pages/write_certificates.html') {
                initializeWriteCertificates();
                initializeUpdateQuillDescription();
                initializeCertificateImagePreview();
                const form = document.getElementById('writeCertificateForm');
                if (form) {
                    form.addEventListener('submit', e => {
                        e.preventDefault();
                        submitCertificateForm();
                    });
                }
            } else if (page === '/admin_dashboard_pages/update_certificate.html') {
                initializeWriteCertificates();
                initializeUpdateCertificate();
                initializeCertificateImagePreview();
            } else if (page === '/admin_dashboard_pages/comments.html') {
                initializeComments();
            }
        })
        .catch(err => {
            showToast(`Error loading content: ${err}`, 'error');
            console.error('Error loading content:', err);
        });
}


/** TOAST ALERT **/
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

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            container.removeChild(toast);
        }
    }, 4000);
}

/** STATS (DASHBOARD) **/
function loadStats() {
    fetch('/stats', { headers: window.authHeader })
        .then(res => {
            if (!res.ok) {
                showToast(`Failed to fetch stats (Status ${res.status})`, 'error');
                throw new Error('Failed to fetch stats');
            }
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
            showToast('Stats loaded successfully', 'success');
        })
        .catch(err => {
            showToast(`Error fetching dashboard stats: ${err}`, 'error');
            console.error('Error fetching dashboard stats:', err);
        });
}

/** COMMENTS **/
function initializeComments() {
    console.log("Initialize Comments Page");
    loadComments(1);

    const searchBox = document.getElementById('searchComments');
    if (searchBox) {
        searchBox.addEventListener('input', () => {
            currentCommentsPage = 1;
            loadComments(currentCommentsPage);
        });
    }

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

    const btnCloseDetail = document.getElementById('btnCloseDetail');
    if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', () => {
            document.getElementById('commentDetailSection').style.display = 'none';
        });
    }

    const btnReply = document.getElementById('btnReply');
    if (btnReply) {
        btnReply.addEventListener('click', () => {
            document.getElementById('replyContainer').style.display = 'block';
        });
    }

    const btnSubmitReply = document.getElementById('btnSubmitReply');
    if (btnSubmitReply) {
        btnSubmitReply.addEventListener('click', () => {
            submitReply();
        });
    }

    const btnApprove = document.getElementById('btnApprove');
    if (btnApprove) {
        btnApprove.addEventListener('click', () => {
            if (currentCommentID) approveComment(currentCommentID);
        });
    }

    const btnReject = document.getElementById('btnReject');
    if (btnReject) {
        btnReject.addEventListener('click', () => {
            if (currentCommentID) rejectComment(currentCommentID);
        });
    }

    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (currentCommentID) resetComment(currentCommentID);
        });
    }

    // Add Event Listener for Delete Button in Detail Section
    const btnDelete = document.getElementById('btnDelete');
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            if (currentCommentID) deleteComment(currentCommentID);
        });
    }
}

function loadComments(page = 1) {
    currentCommentsPage = page;
    const searchVal = document.getElementById('searchComments')?.value.trim() || '';
    const url = `/admin/comments?page=${page}&limit=10&search=${encodeURIComponent(searchVal)}`;

    fetch(url, { headers: window.authHeader })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to load comments', 'error');
                throw new Error('Failed to fetch comments');
            }
            return res.json();
        })
        .then(data => {
            const items = data.data || [];
            const totalPages = data.total_page || 1;

            const commentsTable = document.getElementById('commentsTable');
            const commentsTbody = document.getElementById('commentsTbody');
            const commentsPagination = document.getElementById('commentsPagination');
            const commentsPageInfo = document.getElementById('commentsPageInfo');

            if (!items.length) {
                commentsTable.style.display = 'none';
                commentsPagination.style.display = 'none';
                document.getElementById('commentDetailSection').style.display = 'none'; // Hide detail if no comments
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
                            <button onclick="deleteComment(${cmt.ID})" class="btn-delete">Delete</button>
                        </td>
                    </tr>
                `;
                commentsTbody.insertAdjacentHTML('beforeend', row);
            });

            commentsPageInfo.textContent = `Page ${data.page} of ${totalPages}`;
            const prevBtn = document.getElementById('commentsPrev');
            const nextBtn = document.getElementById('commentsNext');
            if (data.page > 1) {
                prevBtn.style.display = 'inline-block';
            } else {
                prevBtn.style.display = 'none';
            }
            if (data.page < totalPages) {
                nextBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'none';
            }

            showToast('Comments loaded successfully', 'success');
        })
        .catch(err => {
            showToast(`Error loadComments: ${err}`, 'error');
            console.error('Error loadComments:', err);
        });
}

function detailComment(commentId) {
    currentCommentID = commentId;
    fetch(`/admin/comments/${commentId}`, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to get comment detail', 'error');
                throw new Error('Failed to get comment detail');
            }
            return res.json();
        })
        .then(comment => {
            document.getElementById('detailCommentID').textContent = comment.id;
            document.getElementById('detailArticleID').textContent = comment.article_id;
            document.getElementById('detailParentID').textContent = comment.parent_id || '';
            document.getElementById('detailName').textContent = comment.name || 'Anonymous';
            document.getElementById('detailEmail').textContent = comment.email || '';
            document.getElementById('detailStatus').textContent = comment.status;
            // Assuming content is sanitized on the server, but sanitize again for safety
            const content = comment.content;

            // For security, perform sanitization
            const safeContent = DOMPurify.sanitize(content);

            // Render sanitized content
            document.getElementById('detailContent').innerHTML = safeContent;

            // Show the detail section
            document.getElementById('commentDetailSection').style.display = 'block';
            document.getElementById('replyContainer').style.display = 'none';
            showToast('Comment detail loaded', 'success');
        })
        .catch(err => {
            console.error('detailComment error:', err);
        });
}

function approveComment(commentId) {
    fetch(`/admin/comments/${commentId}/approve`, {
        method: 'PATCH',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Comment failed to approve', 'error');
                throw new Error('Failed to approve comment');
            }
            return res.json();
        })
        .then(data => {
            showToast("Comment Approved!", "success");
            loadComments(currentCommentsPage);
            document.getElementById('detailStatus').textContent = 'approved';
        })
        .catch(err => console.error('approveComment error:', err));
}

function rejectComment(commentId) {
    fetch(`/admin/comments/${commentId}/reject`, {
        method: 'PATCH',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast("Failed to reject comment!", "error");
                throw new Error('Failed to reject comment');
            }
            return res.json();
        })
        .then(data => {
            showToast("Comment Rejected!", "success");
            loadComments(currentCommentsPage);
            document.getElementById('detailStatus').textContent = 'rejected';
        })
        .catch(err => console.error('rejectComment error:', err));
}

function resetComment(commentId) {
    fetch(`/admin/comments/${commentId}/reset`, {
        method: 'PATCH',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to reset comment', 'error');
                throw new Error('Failed to reset comment');
            }
            return res.json();
        })
        .then(data => {
            showToast('Comment reset to pending!', 'success');
            loadComments(currentCommentsPage);
            document.getElementById('detailStatus').textContent = 'pending';
        })
        .catch(err => console.error('resetComment error:', err));
}

function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) return;

    fetch(`/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to delete comment', 'error');
                throw new Error('Failed to delete comment');
            }
            return res.json();
        })
        .then(data => {
            showToast('Comment deleted successfully!', 'success');
            // Refresh the comments list
            loadComments(currentCommentsPage);
            // Hide the detail section
            document.getElementById('commentDetailSection').style.display = 'none';
        })
        .catch(err => {
            console.error('Error deleting comment:', err);
            showToast(`Error deleting comment: ${err}`, 'error');
        });
}

function submitReply() {
    if (!currentCommentID) {
        showToast('No comment selected', 'warning');
        return;
    }
    const replyText = document.getElementById('replyContent').value.trim();
    if (!replyText) {
        showToast('Reply content is empty', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('content', replyText);

    fetch(`/admin/comments/${currentCommentID}/reply`, {
        method: 'POST',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to reply comment', 'error');
                throw new Error('Failed to reply comment');
            }
            return res.json();
        })
        .then(data => {
            showToast('Reply sent successfully!', 'success');
            loadComments(currentCommentsPage);
            document.getElementById('replyContainer').style.display = 'none';
            document.getElementById('replyContent').value = '';
        })
        .catch(err => console.error('Error submitReply:', err));
}

/** ARTICLES **/
function loadArticles(page = 1) {
    currentPageArticles = page;
    fetch(`/articles/filter?limit=10&page=${page}`, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to load articles', 'error');
                throw new Error('Failed to load articles');
            }
            return res.json();
        })
        .then(data => {
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

            showToast("Articles loaded", "success");
        })
        .catch(err => {
            console.error('Error loadArticles:', err);
        });
}

function updateArticle(id) {
    window.currentArticleId = id;
    loadContent('/admin_dashboard_pages/update_articles.html', 'Update Article');
}
window.updateArticle = updateArticle;

function deleteArticle(id) {
    if (!confirm('Are you sure to delete this article?')) return;
    fetch(`/admin/articles/${id}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to delete article', 'error');
                throw new Error('Failed to delete article');
            }
            return res.json();
        })
        .then(data => {
            showToast('Article deleted successfully!', 'success');
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('Error deleting article:', err));
}

/** Submit Article (Write) **/
function submitArticleForm() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const description = document.getElementById('description').value.trim();
    const mainImageFile = document.getElementById('image').files[0];
    const content = document.querySelector('#quillEditor .ql-editor').innerHTML.trim();

    if (!title || !author || !category || !tags || !description || !content) {
        showToast('Please fill all fields', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', author);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('content', content);
    if (mainImageFile) formData.append('main_image', mainImageFile);

    fetch('/admin/articles', {
        method: 'POST',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to create article', 'error');
                throw new Error('Failed to create article');
            }
            return res.json();
        })
        .then(data => {
            showToast('Article created successfully!', 'success');
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('submitArticleForm:', err));
}

/** Update Article **/
function initializeUpdateArticle() {
    const articleId = window.currentArticleId;
    if (!articleId) {
        showToast('Missing article ID.', 'error');
        return;
    }

    fetch(`/articles/${articleId}`, { headers: window.authHeader })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to fetch article detail', 'error');
                throw new Error('Failed to fetch article detail');
            }
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
            showToast("Article detail loaded", "success");
        })
        .catch(err => {
            console.error('Error fetch article:', err);
            showToast('Error loading article detail', 'error');
        });

    const updateForm = document.getElementById('updateArticleForm');
    if (updateForm) {
        updateForm.addEventListener('submit', e => {
            e.preventDefault();
            updateArticleSubmit(articleId);
        });
    }
}

/** SETUP ARTICLE PREVIEW **/
function setupArticlePreview() {
    const previewButton = document.getElementById('previewButton');
    if (previewButton) {
        previewButton.addEventListener('click', () => {
            const title = document.getElementById('title')?.value || '';
            const author = document.getElementById('author')?.value || '';
            const category = document.getElementById('category')?.value || '';
            const tags = document.getElementById('tags')?.value || '';
            const description = document.getElementById('description')?.value || '';
            const quillEditor = document.querySelector('#quillEditor .ql-editor');
            const content = quillEditor ? quillEditor.innerHTML : '';

            // image preview
            const mainImageFile = document.getElementById('image')?.files[0];
            let imagePreviewUrl = '';
            if (mainImageFile) {
                imagePreviewUrl = URL.createObjectURL(mainImageFile);
            }

            // Tampilkan preview ke modal
            const previewContent = document.getElementById('previewContent');
            const previewModal = document.getElementById('previewModal');
            const closePreview = document.getElementById('closePreview');

            if (!previewContent || !previewModal) {
                showToast('Preview modal elements not found', 'error');
                return;
            }

            const sanitizedContent = DOMPurify.sanitize(content);
            let htmlPreview = `
                <h2>${title}</h2>
                <h4>By ${author}</h4>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Tags:</strong> ${tags}</p>
                <p><strong>Description:</strong> ${description}</p>
                ${imagePreviewUrl ? `<img src="${imagePreviewUrl}" alt="${title}" style="max-width:200px;" />` : ''}
                <div>${sanitizedContent}</div>
            `;

            previewContent.innerHTML = htmlPreview;
            previewModal.style.display = 'block';

            if (closePreview) {
                closePreview.addEventListener('click', () => {
                    previewModal.style.display = 'none';
                    if (imagePreviewUrl) {
                        URL.revokeObjectURL(imagePreviewUrl);
                    }
                });
            }
        });
    }
}

function updateArticleSubmit(articleId) {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const description = document.getElementById('description').value.trim();
    const content = document.querySelector('#quillEditor .ql-editor').innerHTML.trim();
    const mainImageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', author);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('content', content);
    if (mainImageFile) formData.append('main_image', mainImageFile);

    fetch(`/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: window.authHeader,
        body: formData
    })
        .then(res => {
            if(!res.ok) {
                showToast('Failed to update article', 'error');
                throw new Error('Failed to update article');
            }
            return res.json();
        })
        .then(data => {
            showToast('Article updated successfully!', 'success');
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => {
            console.error('Error updating article:', err);
            showToast(`Error updating article: ${err}`, 'error');
        });
}

/** QUILL EDITOR INISIALISASI (Write Article) **/
function initializeWriteArticles() {
    console.log("initializeWriteArticles: setting up Quill");
    Quill.register('modules/blotFormatter', QuillBlotFormatter.default);
    const Font = Quill.import('formats/font');
    Font.whitelist = ['Roboto', 'Montserrat', 'Nunito Sans', 'Mulish']
    Quill.register(Font, true);

    const editorEl = document.getElementById('quillEditor');
    if (!editorEl) return;

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'font': Font.whitelist }],
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

/** CERTIFICATES **/


/** Fungsi untuk Menginisialisasi Quill Editor **/
function initializeUpdateQuillDescription() {
    const quill = new Quill('#quillDescription', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // Sinkronkan konten Quill ke textarea tersembunyi sebelum form dikirim
    const form = document.getElementById('updateCertificateForm');
    const hiddenTextarea = document.getElementById('Certificate_description');

    if (form && hiddenTextarea) {
        form.addEventListener('submit', function(event) {
            hiddenTextarea.value = quill.root.innerHTML;
            if (!quill.getText().trim()) {
                event.preventDefault();
                showToast('Description cannot be empty.', 'warning');
                return;
            }
        });
    }

    return quill;
}


function loadCertificates(page = 1) {
    currentPageCertificates = page;
    fetch(`/certificates?page=${page}&limit=10`, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to load certificates', 'error');
                throw new Error('Failed to load certificates');
            }
            return res.json();
        })
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

            function getMonthName(num) {
                const months = [
                    "January","February","March","April","May","June",
                    "July","August","September","October","November","December"
                ];
                return months[num - 1] || "";
            }

            certData.forEach(cert => {
                let issueString = '';
                if (cert.IssueMonth && cert.IssueYear){
                    const monthName = getMonthName(cert.IssueMonth);
                    issueString = `${monthName} ${cert.IssueYear}`;
                }

                let endString = '';
                if (cert.EndMonth && cert.EndYear){
                    const monthName = getMonthName(cert.EndMonth);
                    endString = `${monthName} ${cert.EndYear}`;
                }else{
                    endString = 'No Expiry Date';
                }


                const row = `
                <tr>
                    <td>${cert.ID}</td>
                    <td>${cert.Title}</td>
                    <td>${cert.Publisher || 'N/A'}</td>
                    <td>${cert.Category}</td>
                    <td>${issueString}</td>
                    <td>${endString}</td>
                    <td>${cert.CreatedAt || 'N/A'}</td>
                    
                    <td>
                        <button onclick="updateCertificate(${cert.ID})">Update</button>
                        <button onclick="deleteCertificate(${cert.ID})">Delete</button>
                    </td>
                </tr>
            `;
                certificatesTableBody.insertAdjacentHTML('beforeend', row);
            });
            showToast('Certificates loaded', 'success');
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
            if(!res.ok) {
                showToast('Failed to delete certificate', 'error');
                throw new Error('Failed to delete certificate');
            }
            return res.json();
        })
        .then(data => {
            showToast('Certificate deleted successfully!', 'success');
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('Error deleting certificate:', err));
}

function updateCertificate(id) {
    window.currentCertificateId = id;
    loadContent('/admin_dashboard_pages/update_certificate.html', 'Update Certificate');
}

/** Write Certificates **/
function initializeWriteCertificates() {
    console.log("initializeWriteCertificates: no Quill needed unless you want it");
}

/** Submit Certificate (Write) **/
/** Submit Certificate (Write) **/
/** Submit Certificate (Write) **/
function submitCertificateForm() {
    // Ambil nilai input
    const title     = document.getElementById('Certificate_title').value.trim();
    const publisher = document.getElementById('Certificate_publisher').value.trim();
    const category  = document.getElementById('Certificate_category').value.trim();
    const skills    = document.getElementById('Certificate_skills').value.trim();

    const issueMonth = document.getElementById('Certificate_issue_month').value.trim();
    const issueYear  = document.getElementById('Certificate_issue_year').value.trim();
    const endMonth   = document.getElementById('Certificate_end_month').value.trim();
    const endYear    = document.getElementById('Certificate_end_year').value.trim();

    const description = document.getElementById('Certificate_description').value.trim(); // Ambil dari textarea
    const verificationLink = document.getElementById('Certificate_verification_link').value.trim();
    const verificationCode = document.getElementById('Certificate_verification_code').value.trim();

    const imageFiles = document.getElementById('Certificate_image').files; // Mengambil semua file

    // Validasi minimal
    if (!title || !publisher || !category || !skills || !description) { // Tidak lagi memerlukan imageFile
        showToast('Please fill all required fields.', 'warning');
        return;
    }

    // Buat FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', publisher);
    formData.append('category', category);
    formData.append('skills', skills);
    formData.append('description', description); // Deskripsi berformat HTML

    // Jika user mengisi issueMonth / issueYear
    if (issueMonth)  formData.append('issue_month', issueMonth);
    if (issueYear)   formData.append('issue_year', issueYear);
    if (endMonth)    formData.append('end_month', endMonth);
    if (endYear)     formData.append('end_year', endYear);

    if (verificationLink) {
        formData.append('verification_link', verificationLink);
    }

    if (verificationCode){
        formData.append('verification_code', verificationCode)
    }

    // Jika user mengupload file
    if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]); // Tambahkan setiap file dengan nama 'images'
        }
    }

    // Kirim ke endpoint backend (contoh: /admin/certificates)
    fetch('/admin/certificates', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Pastikan header auth ditambahkan dengan benar
            // Hapus 'Content-Type' karena FormData akan mengaturnya secara otomatis
        },
        body: formData
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error || 'Failed to create certificate'); });
            }
            return res.json();
        })
        .then(resp => {
            showToast('Certificate created successfully!', 'success');
            // Mungkin redirect ke dashboard
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => {
            console.error('Error create certificate:', err);
            showToast(`Error: ${err.message}`, 'error');
        });
}



/** Update Certificate **/
function initializeUpdateCertificate() {
    // Pastikan certificate ID tersedia
    const certId = window.currentCertificateId;
    if (!certId) {
        showToast('Missing certificate ID.', 'error');
        return;
    }

    // Inisialisasi Quill untuk update certificate
    const quill = initializeUpdateQuillDescription();

    // Fetch data certificate dari backend
    fetch(`/certificates/${certId}`, { headers: window.authHeader })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to fetch certificate detail', 'error');
                throw new Error('Failed to fetch certificate detail');
            }
            return res.json();
        })
        .then(cert => {
            // Isi field form dengan data certificate
            document.getElementById('Certificate_title').value = cert.Title || '';
            document.getElementById('Certificate_publisher').value = cert.Publisher || '';
            document.getElementById('Certificate_category').value = cert.Category || '';
            document.getElementById('Certificate_skills').value = cert.Skills || '';

            if (cert.IssueMonth) {
                document.getElementById('Certificate_issue_month').value = cert.IssueMonth;
            }
            if (cert.IssueYear) {
                document.getElementById('Certificate_issue_year').value = cert.IssueYear;
            }
            if (cert.EndMonth) {
                document.getElementById('Certificate_end_month').value = cert.EndMonth;
            }
            if (cert.EndYear) {
                document.getElementById('Certificate_end_year').value = cert.EndYear;
            }

            // Isi textarea tersembunyi (jika diperlukan)
            document.getElementById('Certificate_description').value = cert.Description || '';
            // Set konten ke Quill Editor
            quill.root.innerHTML = cert.Description || '';

            if (cert.VerificationLink) {
                document.getElementById('Certificate_verification_link').value = cert.VerificationLink;
            }

            if (cert.VerificationCode) {
                document.getElementById('Certificate_verification_code').value = cert.VerificationCode;
            }

            showToast('Certificate detail loaded', 'success');
        })
        .catch(err => {
            console.error('Error load certificate detail:', err);
            showToast('Error loading certificate detail', 'error');
        });

    // Tangani submit form update certificate
    const form = document.getElementById('updateCertificateForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            updateCertificateSubmit(certId);
        });
    }
}



function updateCertificateSubmit(certId) {
    const title     = document.getElementById('Certificate_title').value.trim();
    const publisher = document.getElementById('Certificate_publisher').value.trim();
    const category  = document.getElementById('Certificate_category').value.trim();
    const skills    = document.getElementById('Certificate_skills').value.trim();

    const issueMonth = document.getElementById('Certificate_issue_month').value.trim();
    const issueYear  = document.getElementById('Certificate_issue_year').value.trim();
    const endMonth   = document.getElementById('Certificate_end_month').value.trim();
    const endYear    = document.getElementById('Certificate_end_year').value.trim();

    const description = document.getElementById('Certificate_description').value.trim();
    const verificationLink = document.getElementById('Certificate_verification_link').value.trim();
    const verificationCode = document.getElementById('Certificate_verification_code').value.trim();
    const imageFiles = document.getElementById('Certificate_image').files; // Mengambil semua file

    // Validasi minimal
    if (!title || !publisher || !category || !skills || !description) { // Menghapus imageFile dari validasi
        showToast('Please fill all required fields.', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('publisher', publisher);
    formData.append('category', category);
    formData.append('skills', skills);
    formData.append('description', description);
    if (issueMonth)  formData.append('issue_month', issueMonth);
    if (issueYear)   formData.append('issue_year', issueYear);
    if (endMonth)    formData.append('end_month', endMonth);
    if (endYear)     formData.append('end_year', endYear);
    if (verificationLink) formData.append('verification_link', verificationLink);
    if (verificationCode) formData.append('verification_code', verificationCode);

    if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }
    }

    fetch(`/admin/certificates/${certId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
    })
        .then(res => {
            if(!res.ok) {
                return res.json().then(err => { throw new Error(err.error || 'Failed to update certificate'); });
            }
            return res.json();
        })
        .then(resp => {
            showToast('Certificate updated successfully!', 'success');
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => {
            console.error(err);
            showToast(`Error updating certificate: ${err.message}`, 'error');
        });
}

/** Preview Gambar untuk Certificate **/
function initializeCertificateImagePreview() {
    const imageInput = document.getElementById('Certificate_image');
    const previewContainer = document.getElementById('Certificate_image_preview');

    if (!imageInput || !previewContainer) {
        console.error('Element input gambar atau container preview tidak ditemukan.');
        return;
    }

    imageInput.addEventListener('change', function(event) {
        const files = event.target.files;
        previewContainer.innerHTML = ''; // Reset preview

        if (files.length === 0) {
            previewContainer.style.display = 'none';
            return;
        } else {
            previewContainer.style.display = 'flex';
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validasi tipe file (opsional)
            if (!file.type.startsWith('image/')) {
                showToast(`File ${file.name} bukan gambar.`, 'warning');
                continue;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                img.style.objectFit = 'cover';
                img.style.margin = '5px';
                img.style.border = '1px solid #ccc';
                img.style.borderRadius = '4px';
                previewContainer.appendChild(img);
            }

            reader.onerror = function() {
                showToast(`Gagal membaca file ${file.name}.`, 'error');
            }

            reader.readAsDataURL(file);
        }
    });
}

