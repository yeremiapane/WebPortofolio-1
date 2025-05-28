/* ============= index.js ============= */

/** GLOBAL VARIABLES **/
let currentPageArticles = 1;
let currentPageCertificates = 1;
let currentPagePortfolio = 1;
let currentCommentsPage = 1;
let currentCommentID = null;
let currentArticleId = null;
let currentCertificateId = null;
let currentPortfolioId = null;

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

    // Initialize sidebar first
    initializeSidebar();
    
    // Load dashboard secara default
    const dynamicContent = document.getElementById('dynamic-content');
    if (dynamicContent) {
        loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
    }
});

/** SIDEBAR & TOGGLE **/
function initializeSidebar() {
    console.log('Initializing sidebar...'); // Debug log
    
    // Initialize sidebar toggle buttons
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
        console.log('Sidebar toggle initialized');
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
        console.log('Mobile menu button initialized');
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
        console.log('Overlay initialized');
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initialize submenu toggles
    initializeSubmenuToggles();
    
    console.log('Sidebar initialization complete');
}

// Toggle sidebar function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (window.innerWidth <= 768) {
        // Mobile behavior
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : 'auto';
    } else {
        // Desktop behavior
        sidebar.classList.toggle('collapsed');
    }
}

// Close sidebar (mobile)
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle window resize
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize submenu toggles using event delegation
function initializeSubmenuToggles() {
    console.log('Initializing submenu toggles with event delegation...');
    
    // Use event delegation on the sidebar menu
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu) {
        sidebarMenu.addEventListener('click', handleMenuClick);
        console.log('Event delegation set up on sidebar menu');
    }
    
    console.log('Submenu toggles initialization complete');
}

// Handle all menu clicks with event delegation
function handleMenuClick(e) {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    console.log('Menu click detected:', target);
    
    // Check if it's a submenu toggle
    const menuItem = target.closest('.menu-item');
    if (menuItem && menuItem.classList.contains('has-submenu') && target.classList.contains('menu-link')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Submenu toggle clicked:', target);
        toggleSubmenu(target);
        return;
    }
    
    // Check if it's a regular menu item, submenu link, or quick action button
    if (target.dataset.page && target.dataset.title) {
        e.preventDefault();
        console.log('Loading content:', target.dataset.page, target.dataset.title);
        loadContent(target.dataset.page, target.dataset.title);
        if (target.classList.contains('menu-link') || target.classList.contains('submenu-link')) {
            setActiveMenu(target);
        }
    }
}

// Toggle submenu
function toggleSubmenu(element) {
    console.log('toggleSubmenu called with:', element);
    const menuItem = element.closest('.menu-item');
    const sidebar = document.getElementById('sidebar');
    
    console.log('Menu item found:', menuItem);
    console.log('Current sidebar state:', sidebar.classList.toString());
    
    // Don't open submenu if sidebar is collapsed on desktop
    if (window.innerWidth > 768 && sidebar.classList.contains('collapsed')) {
        console.log('Sidebar is collapsed on desktop, not opening submenu');
        return;
    }
    
    // Close other open submenus
    const allMenuItems = document.querySelectorAll('.menu-item.has-submenu');
    allMenuItems.forEach(item => {
        if (item !== menuItem) {
            item.classList.remove('open');
        }
    });
    
    // Toggle current submenu
    const wasOpen = menuItem.classList.contains('open');
    menuItem.classList.toggle('open');
    
    console.log('Submenu toggled. Was open:', wasOpen, 'Now open:', menuItem.classList.contains('open'));
}

// Set active menu
function setActiveMenu(element) {
    // Remove active class from all menu items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to current menu item
    const menuItem = element.closest('.menu-item');
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
}

// Make functions globally available
window.toggleSubmenu = toggleSubmenu;
window.setActiveMenu = setActiveMenu;

/** PAGINATION FUNCTIONS **/
function changePage(type, direction) {
    if (type === 'articles') {
        if (direction === -1 && currentPageArticles > 1) {
            currentPageArticles--;
            loadArticles(currentPageArticles);
        } else if (direction === 1) {
            currentPageArticles++;
            loadArticles(currentPageArticles);
        }
    } else if (type === 'certificates') {
        if (direction === -1 && currentPageCertificates > 1) {
            currentPageCertificates--;
            loadCertificates(currentPageCertificates);
        } else if (direction === 1) {
            currentPageCertificates++;
            loadCertificates(currentPageCertificates);
        }
    } else if (type === 'portfolio') {
        if (direction === -1 && currentPagePortfolio > 1) {
            currentPagePortfolio--;
            loadPortfolio(currentPagePortfolio);
        } else if (direction === 1) {
            currentPagePortfolio++;
            loadPortfolio(currentPagePortfolio);
        }
    }
}

// Make changePage globally available
window.changePage = changePage;

// Make loadContent globally available
window.loadContent = loadContent;

/** TABLE SCROLL INITIALIZATION **/
function initializeTableScroll() {
    const tableContainers = document.querySelectorAll('.table-container');
    
    tableContainers.forEach(container => {
        // Remove scroll indicator after first scroll
        container.addEventListener('scroll', function() {
            if (this.style.getPropertyValue('--scrolled') !== 'true') {
                this.style.setProperty('--scrolled', 'true');
                // Hide scroll indicator
                const style = document.createElement('style');
                style.textContent = `
                    .table-container[style*="--scrolled: true"]::after {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }, { once: false });
        
        // Add touch scroll support
        let isScrolling = false;
        container.addEventListener('touchstart', () => {
            isScrolling = true;
        });
        
        container.addEventListener('touchend', () => {
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        });
    });
}

/** QUICK ACTIONS INITIALIZATION **/
function initializeQuickActions() {
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.addEventListener('click', handleMenuClick);
        console.log('Quick actions initialized');
    }
}

/** PAGINATION INITIALIZATION **/
function initializePagination() {
    const paginationContainers = document.querySelectorAll('#articlesPagination, #certificatesPagination, #portfolioPagination');
    paginationContainers.forEach(container => {
        container.addEventListener('click', handlePaginationClick);
    });
    console.log('Pagination initialized');
}

function handlePaginationClick(e) {
    const target = e.target.closest('button');
    if (!target || !target.dataset.type || !target.dataset.direction) return;
    
    const type = target.dataset.type;
    const direction = parseInt(target.dataset.direction);
    
    console.log('Pagination clicked:', type, direction);
    changePage(type, direction);
}

/** LOAD CONTENT DINAMIS **/
function loadContent(page, title) {
    console.log('Loading content:', page, title); // Debug log
    const dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
        console.error('Dynamic content element not found');
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
            
            // Update page title in header
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle) {
                pageTitle.textContent = title;
            }

            // Inisialisasi sesuai halaman
            if (page === '/admin_dashboard_pages/dashboard.html') {
                loadArticles();
                loadCertificates();
                loadPortfolio();
                loadStats();
                initializeQuickActions();
                initializePagination();
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
            } else if (page === '/admin_dashboard_pages/write_portfolio.html') {
                initializeWritePortfolio();
            } else if (page === '/admin_dashboard_pages/update_portfolio.html') {
                initializeUpdatePortfolio();
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
    // Add loading animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.classList.add('table-loading');
    });

    fetch('/stats', { headers: window.authHeader })
        .then(res => {
            if (!res.ok) {
                showToast(`Failed to fetch stats (Status ${res.status})`, 'error');
                throw new Error('Failed to fetch stats');
            }
            return res.json();
        })
        .then(data => {
            // Remove loading animation
            statCards.forEach(card => {
                card.classList.remove('table-loading');
            });

            // Animate numbers counting up
            animateCounter('dashTotalArticles', data.total_articles);
            animateCounter('dashTotalCertificates', data.total_certificates);
            animateCounter('dashTotalComments', data.total_comments);
            animateCounter('dashApprovedComments', data.approved_comments);
            animateCounter('dashPendingComments', data.pending_comments);
            animateCounter('dashRejectedComments', data.rejected_comments);
            animateCounter('dashTotalLikes', data.total_likes);
            animateCounter('dashTotalViews', data.total_views);
            animateCounter('dashTotalPortfolios', data.total_portfolios || 0);
            
            showToast('Stats loaded successfully', 'success');
        })
        .catch(err => {
            // Remove loading animation on error
            statCards.forEach(card => {
                card.classList.remove('table-loading');
            });
            showToast(`Error fetching dashboard stats: ${err}`, 'error');
            console.error('Error fetching dashboard stats:', err);
        });
}

// Animate counter function
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
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
                        <button class="btn-edit" onclick="updateArticle(${article.ID})">Update</button>
                        <button class="btn-delete" onclick="deleteArticle(${article.ID})">Delete</button>
                    </td>
                </tr>
            `;
                articlesTableBody.insertAdjacentHTML('beforeend', row);
            });

            // Initialize table scroll behavior
            initializeTableScroll();
            
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
    Font.whitelist = ['Roboto', 'Montserrat', 'Nunito-Sans', 'Mulish', 'Poppins'];
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
                        <button class="btn-edit" onclick="updateCertificate(${cert.ID})">Update</button>
                        <button class="btn-delete" onclick="deleteCertificate(${cert.ID})">Delete</button>
                    </td>
                </tr>
            `;
                certificatesTableBody.insertAdjacentHTML('beforeend', row);
            });
            
            // Initialize table scroll behavior
            initializeTableScroll();
            
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

/** PORTFOLIO **/
function loadPortfolio(page = 1) {
    currentPagePortfolio = page;
    fetch(`/api/admin/portfolios?page=${page}&limit=10`, {
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                // Check if response is HTML (error page) instead of JSON
                return res.text().then(text => {
                    console.error('Non-JSON response received:', text.substring(0, 200));
                    if (text.includes('<!DOCTYPE')) {
                        throw new Error('Server returned HTML instead of JSON. Check if the endpoint exists.');
                    }
                    throw new Error(`HTTP ${res.status}: ${text}`);
                });
            }
            return res.json();
        })
        .then(data => {
            const portfolioTable = document.getElementById('portfolioTable');
            const portfolioTableBody = document.getElementById('portfolioTableBody');
            const portfolioPagination = document.getElementById('portfolioPagination');

            if (!portfolioTable || !portfolioTableBody || !portfolioPagination) return;

            if (!data.data || data.data.length === 0) {
                portfolioTable.style.display = 'none';
                portfolioPagination.style.display = 'none';
                return;
            }

            portfolioTable.style.display = 'table';
            portfolioPagination.style.display = 'block';
            portfolioTableBody.innerHTML = '';

            data.data.forEach(portfolio => {
                const createdAt = portfolio.created_at ? new Date(portfolio.created_at).toLocaleDateString() : 'N/A';
                const updatedAt = portfolio.updated_at ? new Date(portfolio.updated_at).toLocaleDateString() : 'N/A';
                
                const row = `
                <tr>
                    <td>${portfolio.id}</td>
                    <td>${portfolio.title}</td>
                    <td>${portfolio.category || 'N/A'}</td>
                    <td>${createdAt}</td>
                    <td>${updatedAt}</td>
                    <td>
                        <button class="btn-edit" onclick="updatePortfolio(${portfolio.id})">Update</button>
                        <button class="btn-delete" onclick="deletePortfolio(${portfolio.id})">Delete</button>
                    </td>
                </tr>
            `;
                portfolioTableBody.insertAdjacentHTML('beforeend', row);
            });

            // Initialize table scroll behavior
            initializeTableScroll();
            
            showToast('Portfolio loaded', 'success');
        })
        .catch(err => {
            console.error('Error loadPortfolio:', err);
            showToast(`Error loading portfolio: ${err.message}`, 'error');
        });
}

function updatePortfolio(id) {
    window.currentPortfolioId = id;
    loadContent('/admin_dashboard_pages/update_portfolio.html', 'Update Portfolio');
}
window.updatePortfolio = updatePortfolio;

function deletePortfolio(id) {
    if (!confirm('Are you sure to delete this portfolio?')) return;
    fetch(`/api/admin/portfolios/${id}`, {
        method: 'DELETE',
        headers: window.authHeader
    })
        .then(res => {
            if (!res.ok) {
                showToast('Failed to delete portfolio', 'error');
                throw new Error('Failed to delete portfolio');
            }
            return res.json();
        })
        .then(data => {
            showToast('Portfolio deleted successfully!', 'success');
            loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
        })
        .catch(err => console.error('Error deleting portfolio:', err));
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

/** PORTFOLIO FUNCTIONS **/
function initializeWritePortfolio() {
    console.log("Initialize Write Portfolio Page");
    
    // Initialize image upload functionality
    initializePortfolioImageUpload();
    
    // Initialize form validation
    initializePortfolioFormValidation();
    
    // Initialize button events for portfolio form
    initializePortfolioButtonEvents();
    
    // Initialize custom section modal
    initializeCustomSectionModal();
}

function initializeUpdatePortfolio() {
    console.log("Initialize Update Portfolio Page");
    
    // Initialize image upload functionality
    initializePortfolioImageUpload();
    
    // Initialize form validation
    initializePortfolioFormValidation();
    
    // Initialize button events for portfolio form
    initializePortfolioButtonEvents();
    
    // Initialize custom section modal
    initializeCustomSectionModal();
    
    // Load existing portfolio data
    initializeUpdatePortfolioData();
}

// Portfolio form submission is now handled in the individual HTML files

function populatePortfolioForm(portfolio) {
    console.log('Portfolio data loaded:', portfolio);
    
    try {
        // Fill basic information
        const titleField = document.getElementById('portfolio_title');
        const categoryField = document.getElementById('portfolio_category');
        const descriptionField = document.getElementById('portfolio_description');
        const overviewField = document.getElementById('portfolio_overview');
        const projectTimeField = document.getElementById('portfolio_project_time');
        const liveDemoField = document.getElementById('portfolio_live_demo_url');
        const githubField = document.getElementById('portfolio_github_url');
        
        if (titleField) titleField.value = portfolio.title || '';
        if (categoryField) categoryField.value = portfolio.category || '';
        if (descriptionField) descriptionField.value = portfolio.description || '';
        if (overviewField) overviewField.value = portfolio.overview || '';
        if (projectTimeField) projectTimeField.value = portfolio.project_time || '';
        if (liveDemoField) liveDemoField.value = portfolio.live_demo_url || '';
        if (githubField) githubField.value = portfolio.github_url || '';
        
        // Show current hero image
        if (portfolio.image_url) {
            const currentHeroImage = document.getElementById('currentHeroImage');
            const currentHeroImg = document.getElementById('currentHeroImg');
            const currentHeroName = document.getElementById('currentHeroName');
            
            if (currentHeroImage && currentHeroImg) {
                currentHeroImg.src = portfolio.image_url;
                currentHeroImage.style.display = 'block';
                if (currentHeroName) {
                    currentHeroName.textContent = portfolio.image_url.split('/').pop();
                }
            }
        }
        
        // Populate technology stacks
        if (portfolio.technology_stacks && Array.isArray(portfolio.technology_stacks)) {
            populateTechnologyStacks(portfolio.technology_stacks);
        }
        
        // Populate project gallery
        if (portfolio.project_gallery && Array.isArray(portfolio.project_gallery)) {
            populateProjectGallery(portfolio.project_gallery);
        }
        
        // Populate custom sections
        if (portfolio.custom_sections && Array.isArray(portfolio.custom_sections)) {
            populateCustomSections(portfolio.custom_sections);
        }
        
        // Populate project stats
        if (portfolio.project_stats && Array.isArray(portfolio.project_stats)) {
            populateProjectStats(portfolio.project_stats);
        }
        
        // Populate project info
        if (portfolio.project_info && Array.isArray(portfolio.project_info)) {
            populateProjectInfo(portfolio.project_info);
        }
        
        console.log('Portfolio form populated successfully');
        
    } catch (error) {
        console.error('Error populating portfolio form:', error);
        showToast('Error loading portfolio data into form', 'error');
    }
}

// Helper functions to populate complex data structures
function populateTechnologyStacks(techStacks) {
    console.log('Populating technology stacks:', techStacks);
    console.log('Tech stacks type:', typeof techStacks);
    console.log('Tech stacks is array:', Array.isArray(techStacks));
    
    // Initialize containers - mapping both lowercase and uppercase categories
    const containerMap = {
        'Frontend': 'frontendTech',
        'Backend': 'backendTech', 
        'Database': 'databaseTech',
        'Tools': 'toolsTech',
        'frontend': 'frontendTech',
        'backend': 'backendTech', 
        'database': 'databaseTech',
        'tools': 'toolsTech'
    };
    
    // Clear all containers first
    const uniqueContainerIds = [...new Set(Object.values(containerMap))];
    uniqueContainerIds.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // Check if techStacks is an array
    if (Array.isArray(techStacks)) {
        techStacks.forEach((stack, index) => {
            console.log(`Processing tech stack ${index}:`, stack);
            
            // Handle format: {category: "frontend", items: [...]} or {category: "Frontend", items: [...]}
            if (stack.category && stack.items && Array.isArray(stack.items)) {
                console.log(`Found category format: ${stack.category} with ${stack.items.length} items`);
                const containerId = containerMap[stack.category];
                const container = document.getElementById(containerId);
                
                if (container) {
                    stack.items.forEach((tech, techIndex) => {
                        console.log(`Adding tech item ${techIndex} to ${stack.category}:`, tech);
                        const techItem = document.createElement('div');
                        techItem.className = 'tech-item';
                        
                        // Normalize category name for input names (always lowercase)
                        const normalizedCategory = stack.category.toLowerCase();
                        
                        techItem.innerHTML = `
                            <input type="text" name="${normalizedCategory}_name[]" placeholder="Technology name" value="${tech.name || ''}">
                            <input type="text" name="${normalizedCategory}_version[]" placeholder="Version" value="${tech.version || ''}">
                            <input type="text" name="${normalizedCategory}_description[]" placeholder="Description" value="${tech.description || ''}">
                            <button type="button" class="btn-remove-small">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        container.appendChild(techItem);
                    });
                    console.log(`Successfully added ${stack.items.length} items to ${stack.category} container`);
                } else {
                    console.error(`Container not found for category: ${stack.category}`);
                    console.log('Available containers:', Object.keys(containerMap));
                }
            } 
            // Handle direct tech objects {name: "React", category: "frontend", ...}
            else if (stack.name || stack.technology) {
                console.log('Found direct tech object:', stack);
                const category = stack.category || 'tools';
                const containerId = containerMap[category];
                const container = document.getElementById(containerId);
                
                if (container) {
                    const techItem = document.createElement('div');
                    techItem.className = 'tech-item';
                    
                    // Normalize category name for input names (always lowercase)
                    const normalizedCategory = category.toLowerCase();
                    
                    techItem.innerHTML = `
                        <input type="text" name="${normalizedCategory}_name[]" placeholder="Technology name" value="${stack.name || stack.technology || ''}">
                        <input type="text" name="${normalizedCategory}_version[]" placeholder="Version" value="${stack.version || ''}">
                        <input type="text" name="${normalizedCategory}_description[]" placeholder="Description" value="${stack.description || ''}">
                        <button type="button" class="btn-remove-small">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    container.appendChild(techItem);
                } else {
                    console.error(`Container not found for category: ${category}`);
                }
            }
            // Handle any other possible format
            else {
                console.log('Unknown tech stack format:', stack);
                console.log('Stack keys:', Object.keys(stack));
                
                // Try to extract data from any possible structure
                let category = 'tools';
                let items = [];
                
                // Check if it has a category field with different casing
                if (stack.category) category = stack.category;
                else if (stack.Category) category = stack.Category;
                else if (stack.CATEGORY) category = stack.CATEGORY;
                else if (stack.type) category = stack.type;
                else if (stack.Type) category = stack.Type;
                
                // Check if it has items in different formats
                if (stack.items) items = stack.items;
                else if (stack.Items) items = stack.Items;
                else if (stack.ITEMS) items = stack.ITEMS;
                else if (stack.technologies) items = stack.technologies;
                else if (stack.Technologies) items = stack.Technologies;
                else if (stack.tech) items = stack.tech;
                else if (Array.isArray(stack)) items = stack;
                
                console.log(`Extracted category: ${category}, items:`, items);
                
                if (Array.isArray(items) && items.length > 0) {
                    const containerId = containerMap[category];
                    const container = document.getElementById(containerId);
                    
                    if (container) {
                        items.forEach((tech, techIndex) => {
                            console.log(`Adding extracted tech item ${techIndex}:`, tech);
                            const techItem = document.createElement('div');
                            techItem.className = 'tech-item';
                            
                            // Normalize category name for input names (always lowercase)
                            const normalizedCategory = category.toLowerCase();
                            
                            techItem.innerHTML = `
                                <input type="text" name="${normalizedCategory}_name[]" placeholder="Technology name" value="${tech.name || tech.Name || tech.technology || tech.Technology || ''}">
                                <input type="text" name="${normalizedCategory}_version[]" placeholder="Version" value="${tech.version || tech.Version || ''}">
                                <input type="text" name="${normalizedCategory}_description[]" placeholder="Description" value="${tech.description || tech.Description || ''}">
                                <button type="button" class="btn-remove-small">
                                    <i class="fas fa-times"></i>
                                </button>
                            `;
                            container.appendChild(techItem);
                        });
                    }
                }
            }
        });
    }
    
    // Add at least one empty item to each container if it's empty
    const categoryNames = ['Frontend', 'Backend', 'Database', 'Tools'];
    categoryNames.forEach(category => {
        const containerId = containerMap[category];
        const container = document.getElementById(containerId);
        if (container && container.children.length === 0) {
            console.log(`Adding empty item to ${category} container`);
            addPortfolioTechItem(containerId, category);
        }
    });
    
    console.log('Technology stacks population completed');
}

function populateProjectGallery(gallery) {
    console.log('Populating project gallery:', gallery);
    
    const container = document.getElementById('projectGallery');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    if (gallery.length > 0) {
        gallery.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <div class="gallery-upload-area">
                    <div class="upload-content">
                        <i class="fas fa-image"></i>
                        <p>Upload New Gallery Image</p>
                    </div>
                    <input type="file" name="gallery_image_file[]" accept="image/*">
                </div>
                <div class="current-gallery-image">
                    ${item.image_url ? `<img src="${item.image_url}" alt="Gallery Image" style="max-width: 100px; max-height: 100px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px;">` : ''}
                    ${item.image_url ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">Current Image</p>` : ''}
                </div>
                <div class="gallery-inputs">
                    <input type="text" name="gallery_title[]" placeholder="Image title" value="${item.title || ''}">
                    <textarea name="gallery_description[]" placeholder="Image description" rows="2">${item.description || ''}</textarea>
                    <input type="number" name="gallery_order[]" placeholder="Order" min="1" value="${item.order || index + 1}">
                </div>
                <button type="button" class="btn-remove-small">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(galleryItem);
        });
    } else {
        // Add at least one empty item
        addPortfolioGalleryItem('projectGallery');
    }
}

function populateCustomSections(customSections) {
    console.log('Populating custom sections:', customSections);
    console.log('Custom sections type:', typeof customSections);
    console.log('Custom sections is array:', Array.isArray(customSections));
    
    const container = document.getElementById('customSections');
    if (!container) {
        console.error('Custom sections container not found');
        return;
    }
    
    // Clear existing items
    container.innerHTML = '';
    
    if (!Array.isArray(customSections)) {
        console.log('Custom sections is not an array, skipping');
        return;
    }
    
    customSections.forEach((section, index) => {
        console.log(`Processing custom section ${index}:`, section);
        
        const sectionId = section.id || section.ID || Date.now() + '_' + index;
        const sectionElement = document.createElement('div');
        sectionElement.className = 'custom-section-item';
        sectionElement.setAttribute('data-section-id', sectionId);
        
        // Extract section data with different possible field names
        const title = section.title || section.Title || section.name || section.Name || '';
        const sectionType = section.type || section.Type || section.section_type || section.sectionType || 'mixed';
        const order = section.order || section.Order || 1;
        
        console.log(`Section data: title="${title}", type="${sectionType}", order="${order}"`);
        
        // Handle items/content
        let items = [];
        if (section.items && Array.isArray(section.items)) {
            items = section.items;
        } else if (section.Items && Array.isArray(section.Items)) {
            items = section.Items;
        } else if (section.content && Array.isArray(section.content)) {
            items = section.content;
        } else if (section.Content && Array.isArray(section.Content)) {
            items = section.Content;
        }
        
        console.log(`Found ${items.length} items in section:`, items);
        
        let itemsHtml = '';
        if (items.length > 0) {
            items.forEach((item, itemIndex) => {
                console.log(`Processing item ${itemIndex}:`, item);
                
                const itemTitle = item.title || item.Title || item.name || item.Name || '';
                const itemDescription = item.description || item.Description || item.content || item.Content || '';
                const itemImageUrl = item.image_url || item.imageUrl || item.ImageUrl || item.image || item.Image || '';
                const itemTag = item.tag || item.Tag || '';
                const itemOrder = item.order || item.Order || (itemIndex + 1);
                
                itemsHtml += `
                    <div class="section-item">
                        <input type="text" name="section_${sectionId}_item_title[]" placeholder="Item title" value="${itemTitle}" required>
                        <textarea name="section_${sectionId}_item_description[]" rows="2" placeholder="Item description" required>${itemDescription}</textarea>
                        ${sectionType !== 'list' ? `<input type="url" name="section_${sectionId}_item_image_url[]" placeholder="Image URL" value="${itemImageUrl}">` : ''}
                        <input type="text" name="section_${sectionId}_item_tag[]" placeholder="Tag (optional)" value="${itemTag}">
                        <input type="number" name="section_${sectionId}_item_order[]" placeholder="Order" min="1" value="${itemOrder}">
                        <button type="button" class="btn-remove-small">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
        } else {
            // Add one empty item if no items exist
            itemsHtml = `
                <div class="section-item">
                    <input type="text" name="section_${sectionId}_item_title[]" placeholder="Item title" required>
                    <textarea name="section_${sectionId}_item_description[]" rows="2" placeholder="Item description" required></textarea>
                    ${sectionType !== 'list' ? `<input type="url" name="section_${sectionId}_item_image_url[]" placeholder="Image URL">` : ''}
                    <input type="text" name="section_${sectionId}_item_tag[]" placeholder="Tag (optional)">
                    <input type="number" name="section_${sectionId}_item_order[]" placeholder="Order" min="1" value="1">
                    <button type="button" class="btn-remove-small">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
        
        sectionElement.innerHTML = `
            <h4><i class="fas fa-cog"></i> ${title} (${sectionType})</h4>
            <input type="hidden" name="section_${sectionId}_title" value="${title}">
            <input type="hidden" name="section_${sectionId}_type" value="${sectionType}">
            <input type="hidden" name="section_${sectionId}_order" value="${order}">
            
            <div class="section-items-container">
                ${itemsHtml}
            </div>
            
            <button type="button" class="btn-add-small" data-container="${sectionId}" data-section-type="${sectionType}">
                <i class="fas fa-plus"></i> Add Item
            </button>
            <button type="button" class="btn-remove-section" onclick="removeCustomSectionFromIndex('${sectionId}')">
                <i class="fas fa-trash"></i> Remove Section
            </button>
        `;
        
        container.appendChild(sectionElement);
        console.log(`Custom section "${title}" added successfully`);
    });
    
    console.log('Custom sections population completed');
}

function populateProjectStats(stats) {
    console.log('Populating project stats:', stats);
    
    const container = document.getElementById('projectStats');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    if (stats.length > 0) {
        stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <input type="text" name="stat_label[]" placeholder="Stat label (e.g., Duration)" value="${stat.label || ''}">
                <input type="text" name="stat_value[]" placeholder="Stat value (e.g., 3 months)" value="${stat.value || ''}">
                <button type="button" class="btn-remove-small">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(statItem);
        });
    } else {
        // Add at least one empty item
        addPortfolioStatItem('projectStats');
    }
}

function populateProjectInfo(info) {
    console.log('Populating project info:', info);
    
    const container = document.getElementById('projectInfo');
    if (!container) return;
    
    // Clear existing items
    container.innerHTML = '';
    
    if (info.length > 0) {
        info.forEach(item => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.innerHTML = `
                <input type="text" name="info_label[]" placeholder="Info label (e.g., Client)" value="${item.label || ''}">
                <input type="text" name="info_value[]" placeholder="Info value (e.g., Company Name)" value="${item.value || ''}">
                <button type="button" class="btn-remove-small">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(infoItem);
        });
    } else {
        // Add at least one empty item
        addPortfolioInfoItem('projectInfo');
    }
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

// Portfolio form initialization functions
let portfolioButtonHandler = null;

function initializePortfolioButtonEvents() {
    console.log('Initializing portfolio button events...');
    
    // Remove existing event listener if any
    if (portfolioButtonHandler) {
        document.removeEventListener('click', portfolioButtonHandler);
    }
    
    // Create new event handler
    portfolioButtonHandler = function(e) {
        if (e.target.closest('.btn-add-small')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.btn-add-small');
            const container = button.getAttribute('data-container');
            const category = button.getAttribute('data-category');
            const sectionType = button.getAttribute('data-section-type');
            
            console.log('Add button clicked:', { container, category, sectionType });
            
            if (category === 'Gallery') {
                addPortfolioGalleryItem(container);
            } else if (category === 'Stats') {
                addPortfolioStatItem(container);
            } else if (category === 'Info') {
                addPortfolioInfoItem(container);
            } else if (sectionType) {
                addPortfolioSectionItem(container, sectionType);
            } else if (['Frontend', 'Backend', 'Database', 'Tools'].includes(category)) {
                addPortfolioTechItem(container, category);
            }
        }
        
        if (e.target.closest('.btn-remove-small')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.btn-remove-small');
            const item = button.closest('.tech-item, .gallery-item, .stat-item, .info-item, .section-item');
            const container = item.closest('.tech-inputs-container, .gallery-inputs-container, .stats-inputs-container, .info-inputs-container, .section-items-container');
            
            if (container && container.children.length > 1) {
                item.remove();
                showToast('Item removed', 'success');
            } else {
                showToast('At least one item is required', 'warning');
            }
        }
    };
    
    // Add event listener
    document.addEventListener('click', portfolioButtonHandler);

    // Initialize custom section button
    setTimeout(() => {
        const addCustomSectionBtn = document.getElementById('addCustomSectionBtn');
        if (addCustomSectionBtn && !addCustomSectionBtn.hasAttribute('data-initialized')) {
            addCustomSectionBtn.setAttribute('data-initialized', 'true');
            addCustomSectionBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add Custom Section button clicked');
                
                const modal = document.getElementById('customSectionModal');
                if (modal) {
                    modal.style.display = 'block';
                    console.log('Custom section modal opened');
                } else {
                    console.error('Custom section modal not found');
                }
            });
            console.log('Custom section button initialized');
        }
    }, 100);

    // Initialize cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
            }
        });
    }
}

function addPortfolioTechItem(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    const newItem = document.createElement('div');
    newItem.className = 'tech-item';
    newItem.innerHTML = `
        <input type="text" name="${category.toLowerCase()}_name[]" placeholder="Technology name">
        <input type="text" name="${category.toLowerCase()}_version[]" placeholder="Version">
        <input type="text" name="${category.toLowerCase()}_description[]" placeholder="Description">
        <button type="button" class="btn-remove-small">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newItem);
    
    // Focus on the new input
    const newInput = newItem.querySelector('input');
    if (newInput) {
        newInput.focus();
    }
    
    showToast('New tech item added', 'success');
}

function addPortfolioGalleryItem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    const newItem = document.createElement('div');
    newItem.className = 'gallery-item';
    newItem.innerHTML = `
        <div class="gallery-upload-area">
            <div class="upload-content">
                <i class="fas fa-image"></i>
                <p>Upload Gallery Image</p>
            </div>
            <input type="file" name="gallery_image_file[]" accept="image/*" required>
        </div>
        <div class="gallery-image-preview"></div>
        <div class="gallery-inputs">
            <input type="text" name="gallery_title[]" placeholder="Image title">
            <textarea name="gallery_description[]" rows="2" placeholder="Image description"></textarea>
            <input type="number" name="gallery_order[]" placeholder="Order" min="1" value="1">
        </div>
        <button type="button" class="btn-remove-small">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newItem);
    
    showToast('New gallery item added', 'success');
}

function addPortfolioStatItem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    const newItem = document.createElement('div');
    newItem.className = 'stat-item';
    newItem.innerHTML = `
        <input type="text" name="stat_label[]" placeholder="Label (e.g., Duration)" required>
        <input type="text" name="stat_value[]" placeholder="Value (e.g., 4 Months)" required>
        <input type="text" name="stat_icon[]" placeholder="Icon class (e.g., fas fa-calendar)">
        <input type="number" name="stat_order[]" placeholder="Order" min="1" value="1">
        <button type="button" class="btn-remove-small">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newItem);
    
    showToast('New stat item added', 'success');
}

function addPortfolioInfoItem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    const newItem = document.createElement('div');
    newItem.className = 'info-item';
    newItem.innerHTML = `
        <input type="text" name="info_label[]" placeholder="Label (e.g., Client)" required>
        <input type="text" name="info_value[]" placeholder="Value (e.g., Company Name)" required>
        <input type="number" name="info_order[]" placeholder="Order" min="1" value="1">
        <button type="button" class="btn-remove-small">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newItem);
    
    // Focus on the new input
    const newInput = newItem.querySelector('input');
    if (newInput) {
        newInput.focus();
    }
    
    showToast('New info item added', 'success');
}

function addPortfolioSectionItem(containerId, sectionType) {
    console.log('addPortfolioSectionItem called with:', containerId, sectionType);
    
    const container = document.querySelector(`[data-section-id="${containerId}"] .section-items-container`);
    if (!container) {
        console.error('Section container not found for ID:', containerId);
        console.log('Available sections:', document.querySelectorAll('[data-section-id]'));
        return;
    }
    
    const newItem = document.createElement('div');
    newItem.className = 'section-item';
    newItem.innerHTML = `
        <input type="text" name="section_${containerId}_item_title[]" placeholder="Item title" required>
        <textarea name="section_${containerId}_item_description[]" rows="2" placeholder="Item description" required></textarea>
        ${sectionType !== 'list' ? `<input type="url" name="section_${containerId}_item_image_url[]" placeholder="Image URL">` : ''}
        <input type="text" name="section_${containerId}_item_tag[]" placeholder="Tag (optional)">
        <input type="number" name="section_${containerId}_item_order[]" placeholder="Order" min="1" value="1">
        <button type="button" class="btn-remove-small">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add event listener to the remove button
    const removeBtn = newItem.querySelector('.btn-remove-small');
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if this is the last item in the container
            if (container.children.length > 1) {
                newItem.remove();
                showToast('Section item removed', 'success');
            } else {
                showToast('At least one item is required in each section', 'warning');
            }
        });
    }
    
    container.appendChild(newItem);
    
    // Focus on the new input
    const newInput = newItem.querySelector('input');
    if (newInput) {
        newInput.focus();
    }
    
    showToast('New section item added', 'success');
    console.log('Section item added successfully to:', containerId);
}

function initializeCustomSectionModal() {
    console.log('Initializing custom section modal...');
    
    setTimeout(() => {
        const modal = document.getElementById('customSectionModal');
        const closeBtn = document.getElementById('closeCustomSectionModal');
        const cancelBtn = document.getElementById('cancelCustomSection');
        const customSectionForm = document.getElementById('customSectionForm');

        if (!modal || !closeBtn || !cancelBtn || !customSectionForm) {
            console.log('Custom section modal elements not found yet');
            return;
        }

        // Hide modal function
        function hideModal() {
            modal.style.display = 'none';
            customSectionForm.reset();
            console.log('Custom section modal closed');
        }

        // Close button event
        if (!closeBtn.hasAttribute('data-initialized')) {
            closeBtn.setAttribute('data-initialized', 'true');
            closeBtn.addEventListener('click', hideModal);
        }

        // Cancel button event
        if (!cancelBtn.hasAttribute('data-initialized')) {
            cancelBtn.setAttribute('data-initialized', 'true');
            cancelBtn.addEventListener('click', hideModal);
        }

        // Form submission event
        if (!customSectionForm.hasAttribute('data-initialized')) {
            customSectionForm.setAttribute('data-initialized', 'true');
            customSectionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Custom section form submitted');
                addCustomSectionFromModal();
                hideModal();
            });
        }

        // Click outside modal to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });

        console.log('Custom section modal initialized');
    }, 200);
}

function addCustomSectionFromModal() {
    const sectionTitle = document.getElementById('sectionTitle')?.value;
    const sectionType = document.getElementById('sectionType')?.value;
    const sectionOrder = document.getElementById('sectionOrder')?.value || 1;

    if (!sectionTitle || !sectionType) {
        showToast('Please fill all required fields', 'warning');
        return;
    }

    const container = document.getElementById('customSections');
    if (!container) {
        console.error('Custom sections container not found');
        return;
    }

    const sectionId = 'section_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Create the section element
    const sectionElement = document.createElement('div');
    sectionElement.className = 'custom-section-item';
    sectionElement.setAttribute('data-section-id', sectionId);
    
    sectionElement.innerHTML = `
        <h4><i class="fas fa-cog"></i> ${sectionTitle} (${sectionType})</h4>
        <input type="hidden" name="section_${sectionId}_title" value="${sectionTitle}">
        <input type="hidden" name="section_${sectionId}_type" value="${sectionType}">
        <input type="hidden" name="section_${sectionId}_order" value="${sectionOrder}">
        
        <div class="section-items-container">
            <div class="section-item">
                <input type="text" name="section_${sectionId}_item_title[]" placeholder="Item title" required>
                <textarea name="section_${sectionId}_item_description[]" rows="2" placeholder="Item description" required></textarea>
                ${sectionType !== 'list' ? `<input type="url" name="section_${sectionId}_item_image_url[]" placeholder="Image URL">` : ''}
                <input type="text" name="section_${sectionId}_item_tag[]" placeholder="Tag (optional)">
                <input type="number" name="section_${sectionId}_item_order[]" placeholder="Order" min="1" value="1">
                <button type="button" class="btn-remove-small">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        
        <button type="button" class="btn-add-small" data-container="${sectionId}" data-section-type="${sectionType}">
            <i class="fas fa-plus"></i> Add Item
        </button>
        <button type="button" class="btn-remove-section">
            <i class="fas fa-trash"></i> Remove Section
        </button>
    `;

    // Add the section to container
    container.appendChild(sectionElement);

    // Add event listeners to the new buttons
    const addItemBtn = sectionElement.querySelector('.btn-add-small');
    const removeSectionBtn = sectionElement.querySelector('.btn-remove-section');

    // Add Item button event listener
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add Item button clicked for section:', sectionId);
            addPortfolioSectionItem(sectionId, sectionType);
        });
        console.log('Add Item button event listener added for section:', sectionId);
    }

    // Remove Section button event listener
    if (removeSectionBtn) {
        removeSectionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            removeCustomSectionFromIndex(sectionId);
        });
        console.log('Remove Section button event listener added for section:', sectionId);
    }

    showToast(`Custom section "${sectionTitle}" added successfully`, 'success');
    console.log('Custom section added with working buttons:', sectionTitle, sectionType, sectionId);
}

function removeCustomSectionFromIndex(sectionId) {
    if (confirm('Are you sure you want to remove this section?')) {
        const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (sectionElement) {
            sectionElement.remove();
            showToast('Custom section removed', 'success');
            console.log('Custom section removed:', sectionId);
        }
    }
}

// Make function globally available
window.removeCustomSectionFromIndex = removeCustomSectionFromIndex;

function addPortfolioDynamicFieldValue(containerId, fieldType) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    const fieldId = containerId;
    const fieldName = container.closest('.dynamic-field-item').querySelector(`input[name="${fieldId}_name"]`)?.value || 'Value';
    
    let inputHtml = '';
    if (fieldType === 'select') {
        const optionsInput = container.closest('.dynamic-field-item').querySelector(`input[name="${fieldId}_options"]`);
        const options = optionsInput?.value ? JSON.parse(optionsInput.value) : [];
        inputHtml = `
            <select name="${fieldId}_value[]">
                <option value="">Select ${fieldName}</option>
                ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
        `;
    } else if (fieldType === 'textarea') {
        inputHtml = `<textarea name="${fieldId}_value[]" rows="3" placeholder="Enter ${fieldName}"></textarea>`;
    } else {
        inputHtml = `<input type="${fieldType}" name="${fieldId}_value[]" placeholder="Enter ${fieldName}">`;
    }

    const newItem = document.createElement('div');
    newItem.className = 'dynamic-value-item';
    newItem.innerHTML = `
        ${inputHtml}
        <button type="button" class="btn-remove-small">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(newItem);
    
    // Focus on the new input/textarea/select
    const newInput = newItem.querySelector('input, textarea, select');
    if (newInput) {
        newInput.focus();
    }
    
    showToast('New dynamic field value added', 'success');
}

function initializePortfolioImageUpload() {
    console.log('Initializing portfolio image upload...');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('portfolio_images');
    
    if (!uploadArea || !fileInput) {
        console.log('Upload elements not found');
        return;
    }
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handlePortfolioFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handlePortfolioFiles(e.target.files);
    });
}

function handlePortfolioFiles(files) {
    const validFiles = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    for (let file of files) {
        if (validatePortfolioFile(file, maxFileSize)) {
            validFiles.push(file);
        }
    }
    
    if (validFiles.length > 0) {
        addPortfolioImagesToPreview(validFiles);
    }
}

function validatePortfolioFile(file, maxFileSize) {
    // Check file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select only image files', 'error');
        return false;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
        showToast(`File ${file.name} is too large. Maximum size is 5MB`, 'error');
        return false;
    }
    
    return true;
}

function addPortfolioImagesToPreview(files) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewGrid = document.getElementById('imagePreviewGrid');
    
    if (!previewContainer || !previewGrid) {
        console.log('Preview elements not found');
        return;
    }
    
    for (let file of files) {
        const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageItem = createPortfolioImagePreviewItem(imageId, e.target.result, file.name);
            previewGrid.appendChild(imageItem);
        };
        reader.readAsDataURL(file);
    }
    
    previewContainer.style.display = 'block';
    showToast('Images added to preview', 'success');
}

function createPortfolioImagePreviewItem(imageId, src, fileName) {
    const item = document.createElement('div');
    item.className = 'image-preview-item';
    item.dataset.imageId = imageId;
    
    item.innerHTML = `
        <div class="image-preview-wrapper">
            <img src="${src}" alt="${fileName}">
            <div class="image-overlay">
                <button type="button" class="btn-remove-image" data-image-id="${imageId}">
                    <i class="fas fa-trash"></i>
                </button>
                <button type="button" class="btn-view-image" data-src="${src}" data-name="${fileName}">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="image-info">
            <span class="image-name">${fileName}</span>
        </div>
    `;
    
    // Add event listeners for image buttons
    const removeBtn = item.querySelector('.btn-remove-image');
    const viewBtn = item.querySelector('.btn-view-image');
    
    removeBtn.addEventListener('click', () => removePortfolioImage(imageId));
    viewBtn.addEventListener('click', () => viewPortfolioImage(src, fileName));
    
    return item;
}

function removePortfolioImage(imageId) {
    const imageItem = document.querySelector(`[data-image-id="${imageId}"]`);
    if (imageItem) {
        imageItem.remove();
        showToast('Image removed', 'success');
    }
    
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewGrid = document.getElementById('imagePreviewGrid');
    if (previewGrid && previewGrid.children.length === 0) {
        previewContainer.style.display = 'none';
    }
}

function viewPortfolioImage(src, fileName) {
    // Create modal to view image
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%; background: white; border-radius: 8px; overflow: hidden;">
            <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">${fileName}</h3>
                <button style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 20px; text-align: center;">
                <img src="${src}" alt="${fileName}" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
            </div>
        </div>
    `;
    
    // Add event listeners for modal
    const closeBtn = modal.querySelector('button');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    document.body.appendChild(modal);
}

function initializePortfolioFormValidation() {
    console.log('Initializing portfolio form validation...');
    
    const form = document.getElementById('writePortfolioForm') || document.getElementById('updatePortfolioForm');
    if (form) {
        form.addEventListener('submit', handlePortfolioFormSubmit);
    }
}

function handlePortfolioFormSubmit(e) {
    e.preventDefault();
    console.log('Portfolio form submitted');
    
    if (validatePortfolioForm()) {
        const isUpdate = e.target.id === 'updatePortfolioForm';
        if (isUpdate) {
            updatePortfolioSubmit(window.currentPortfolioId);
        } else {
            submitPortfolioForm();
        }
    }
}

function validatePortfolioForm() {
    const title = document.getElementById('portfolio_title')?.value.trim();
    const category = document.getElementById('portfolio_category')?.value.trim();
    const description = document.getElementById('portfolio_description')?.value.trim();
    
    if (!title) {
        showToast('Please enter a project title', 'error');
        document.getElementById('portfolio_title')?.focus();
        return false;
    }
    
    if (!category) {
        showToast('Please select a category', 'error');
        document.getElementById('portfolio_category')?.focus();
        return false;
    }
    
    if (!description) {
        showToast('Please enter a project description', 'error');
        document.getElementById('portfolio_description')?.focus();
        return false;
    }
    
    return true;
}

function initializeUpdatePortfolioData() {
    // Get portfolio ID from URL or global variable
    const portfolioId = window.currentPortfolioId || getPortfolioIdFromUrl();
    
    if (!portfolioId) {
        showToast('Portfolio ID not found', 'error');
        return;
    }

    loadPortfolioDataForUpdate(portfolioId);
}

function getPortfolioIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function loadPortfolioDataForUpdate(id) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    fetch(`/api/admin/portfolios/${id}`, {
        headers: window.authHeader || {}
    })
    .then(response => {
        if (!response.ok) {
            // Check if response is HTML (error page) instead of JSON
            return response.text().then(text => {
                console.error('Non-JSON response received:', text.substring(0, 200));
                if (text.includes('<!DOCTYPE')) {
                    throw new Error('Server returned HTML instead of JSON. Check if the endpoint exists.');
                }
                throw new Error(`HTTP ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        const portfolio = data.data || data;
        populatePortfolioForm(portfolio);
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        showToast('Portfolio data loaded successfully', 'success');
    })
    .catch(error => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        console.error('Error loading portfolio:', error);
        showToast('Error loading portfolio data: ' + error.message, 'error');
    });
}

/** Submit Portfolio (Write) **/
function submitPortfolioForm() {
    console.log('Starting portfolio submission...');
    
    // Debug: Check authentication token
    const token = localStorage.getItem('authToken');
    console.log('Auth token exists:', !!token);
    if (token) {
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');
    }
    
    // Get basic information
    const title = document.getElementById('portfolio_title')?.value.trim();
    const category = document.getElementById('portfolio_category')?.value.trim();
    const description = document.getElementById('portfolio_description')?.value.trim();
    const overview = document.getElementById('portfolio_overview')?.value.trim();
    const projectTime = document.getElementById('portfolio_project_time')?.value.trim();
    const liveDemoUrl = document.getElementById('portfolio_live_demo_url')?.value.trim();
    const githubUrl = document.getElementById('portfolio_github_url')?.value.trim();
    
    // Get hero image
    const heroImageFile = document.getElementById('portfolio_hero_image')?.files[0];
    
    // Validate required fields
    if (!title || !category || !description || !overview || !projectTime) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (!heroImageFile) {
        showToast('Please upload a hero image', 'error');
        return;
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('overview', overview);
    formData.append('project_time', projectTime);
    
    if (liveDemoUrl) formData.append('live_demo_url', liveDemoUrl);
    if (githubUrl) formData.append('github_url', githubUrl);
    if (heroImageFile) formData.append('hero_image', heroImageFile);
    
    // Collect technology stack data
    const techData = collectTechnologyStackData();
    if (techData) {
        formData.append('technologies', JSON.stringify(techData));
    }
    
    // Collect gallery data
    const galleryData = collectGalleryData();
    if (galleryData.length > 0) {
        // Prepare gallery data without file objects for JSON
        const galleryDataForJson = galleryData.map(item => ({
            title: item.title,
            description: item.description,
            order: item.order
        }));
        formData.append('gallery', JSON.stringify(galleryDataForJson));
        
        // Add gallery image files with sequential index (0, 1, 2, ...)
        // Backend expects gallery_image_0, gallery_image_1, etc.
        let fileIndex = 0;
        galleryData.forEach((item) => {
            if (item.file) {
                formData.append(`gallery_image_${fileIndex}`, item.file);
                fileIndex++;
            }
        });
    }
    
    // Collect custom sections data
    const customSectionsData = collectCustomSectionsData();
    if (customSectionsData.length > 0) {
        formData.append('custom_sections', JSON.stringify(customSectionsData));
    }
    
    // Collect project stats data
    const statsData = collectProjectStatsData();
    if (statsData.length > 0) {
        formData.append('project_stats', JSON.stringify(statsData));
    }
    
    // Collect project info data
    const infoData = collectProjectInfoData();
    if (infoData.length > 0) {
        formData.append('project_info', JSON.stringify(infoData));
    }
    
    // Show loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    // Debug: Log form data
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    
    // Submit to backend
    fetch('/api/admin/portfolios/with-files', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        if (!response.ok) {
            return response.text().then(text => {
                console.log('Error response text:', text);
                try {
                    const err = JSON.parse(text);
                    throw new Error(err.error || 'Failed to create portfolio');
                } catch (parseError) {
                    throw new Error(`HTTP ${response.status}: ${text}`);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        showToast('Portfolio created successfully!', 'success');
        loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
    })
    .catch(error => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        console.error('Error creating portfolio:', error);
        showToast(`Error: ${error.message}`, 'error');
    });
}

/** Update Portfolio Submit **/
function updatePortfolioSubmit(portfolioId) {
    console.log('Starting portfolio update...', portfolioId);
    
    if (!portfolioId) {
        showToast('Portfolio ID is required for update', 'error');
        return;
    }
    
    // Get basic information
    const title = document.getElementById('portfolio_title')?.value.trim();
    const category = document.getElementById('portfolio_category')?.value.trim();
    const description = document.getElementById('portfolio_description')?.value.trim();
    const overview = document.getElementById('portfolio_overview')?.value.trim();
    const projectTime = document.getElementById('portfolio_project_time')?.value.trim();
    const liveDemoUrl = document.getElementById('portfolio_live_demo_url')?.value.trim();
    const githubUrl = document.getElementById('portfolio_github_url')?.value.trim();
    
    // Get current hero image URL (for update, we need to preserve existing image)
    let heroImageUrl = null;
    const currentHeroImg = document.getElementById('currentHeroImg');
    if (currentHeroImg && currentHeroImg.src) {
        heroImageUrl = currentHeroImg.src;
        console.log('Found existing hero image:', heroImageUrl);
    }
    
    // Validate required fields
    if (!title || !category || !description || !overview || !projectTime) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (!heroImageUrl) {
        showToast('Hero image is required', 'error');
        return;
    }
    
    // Show loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    // Collect all data with detailed logging
    const technologyStacks = collectTechnologyStackData();
    const projectGallery = collectGalleryData();
    const customSections = collectCustomSectionsData();
    const projectStats = collectProjectStatsData();
    const projectInfo = collectProjectInfoData();
    
    console.log('Collected technology stacks:', technologyStacks);
    console.log('Collected project gallery:', projectGallery);
    console.log('Collected custom sections:', customSections);
    console.log('Collected project stats:', projectStats);
    console.log('Collected project info:', projectInfo);
    
    // Convert technology stacks to backend format for JSON API
    const technologyStacksForAPI = [];
    Object.keys(technologyStacks).forEach(category => {
        if (technologyStacks[category].length > 0) {
            technologyStacksForAPI.push({
                category: category,
                items: technologyStacks[category]
            });
        }
    });
    
    // Use JSON format (consistent with HTML page implementation)
    const updateData = {
        title: title,
        category: category,
        description: description,
        overview: overview,
        project_time: projectTime,
        image_url: heroImageUrl,
        live_demo_url: liveDemoUrl || null,
        github_url: githubUrl || null,
        technology_stacks: technologyStacksForAPI,
        project_gallery: projectGallery,
        custom_sections: customSections,
        project_stats: projectStats,
        project_info: projectInfo
    };
    
    console.log('Final update data being sent:', JSON.stringify(updateData, null, 2));
    
    // Submit with JSON
    fetch(`/api/admin/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.log('Error response text:', text);
                try {
                    const err = JSON.parse(text);
                    throw new Error(err.error || 'Invalid request body');
                } catch (parseError) {
                    throw new Error(`HTTP ${response.status}: ${text}`);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        console.log('Portfolio updated successfully:', data);
        showToast('Portfolio updated successfully!', 'success');
        loadContent('/admin_dashboard_pages/dashboard.html', 'Dashboard');
    })
    .catch(error => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        console.error('Error updating portfolio:', error);
        showToast(`Error: ${error.message}`, 'error');
    });
}

/** Helper Functions for Data Collection **/
function collectTechnologyStackData() {
    console.log('Collecting technology stack data...');
    
    // Backend expects format: map[string][]map[string]interface{}
    // Example: {"frontend": [{"name": "React", "version": "18", "description": ""}]}
    const techData = {};
    
    // Collect Frontend technologies
    const frontendItems = document.querySelectorAll('#frontendTech .tech-item');
    const frontendTechs = [];
    frontendItems.forEach(item => {
        const name = item.querySelector('input[name="frontend_name[]"]')?.value.trim();
        const version = item.querySelector('input[name="frontend_version[]"]')?.value.trim();
        const description = item.querySelector('input[name="frontend_description[]"]')?.value.trim();
        
        if (name) {
            frontendTechs.push({ 
                name: name, 
                version: version || "", 
                description: description || "" 
            });
        }
    });
    
    if (frontendTechs.length > 0) {
        techData["frontend"] = frontendTechs;
    }
    
    // Collect Backend technologies
    const backendItems = document.querySelectorAll('#backendTech .tech-item');
    const backendTechs = [];
    backendItems.forEach(item => {
        const name = item.querySelector('input[name="backend_name[]"]')?.value.trim();
        const version = item.querySelector('input[name="backend_version[]"]')?.value.trim();
        const description = item.querySelector('input[name="backend_description[]"]')?.value.trim();
        
        if (name) {
            backendTechs.push({ 
                name: name, 
                version: version || "", 
                description: description || "" 
            });
        }
    });
    
    if (backendTechs.length > 0) {
        techData["backend"] = backendTechs;
    }
    
    // Collect Database technologies
    const databaseItems = document.querySelectorAll('#databaseTech .tech-item');
    const databaseTechs = [];
    databaseItems.forEach(item => {
        const name = item.querySelector('input[name="database_name[]"]')?.value.trim();
        const version = item.querySelector('input[name="database_version[]"]')?.value.trim();
        const description = item.querySelector('input[name="database_description[]"]')?.value.trim();
        
        if (name) {
            databaseTechs.push({ 
                name: name, 
                version: version || "", 
                description: description || "" 
            });
        }
    });
    
    if (databaseTechs.length > 0) {
        techData["database"] = databaseTechs;
    }
    
    // Collect Tools technologies
    const toolsItems = document.querySelectorAll('#toolsTech .tech-item');
    const toolsTechs = [];
    toolsItems.forEach(item => {
        const name = item.querySelector('input[name="tools_name[]"]')?.value.trim();
        const version = item.querySelector('input[name="tools_version[]"]')?.value.trim();
        const description = item.querySelector('input[name="tools_description[]"]')?.value.trim();
        
        if (name) {
            toolsTechs.push({ 
                name: name, 
                version: version || "", 
                description: description || "" 
            });
        }
    });
    
    if (toolsTechs.length > 0) {
        techData["tools"] = toolsTechs;
    }
    
    console.log('Collected technology data (backend format):', techData);
    return techData;
}

function collectGalleryData() {
    const galleryData = [];
    const galleryItems = document.querySelectorAll('#projectGallery .gallery-item');
    
    galleryItems.forEach((item, index) => {
        const title = item.querySelector('input[name="gallery_title[]"]')?.value.trim();
        const description = item.querySelector('textarea[name="gallery_description[]"]')?.value.trim();
        const order = item.querySelector('input[name="gallery_order[]"]')?.value || (index + 1);
        
        // Check for existing image in current-gallery-image div (for update)
        let imageUrl = null;
        const currentImage = item.querySelector('.current-gallery-image img');
        if (currentImage && currentImage.src && !currentImage.src.includes('data:image')) {
            imageUrl = currentImage.src;
        }
        
        // Check for new file upload
        const fileInput = item.querySelector('input[type="file"]');
        let hasNewFile = false;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            hasNewFile = true;
        }
        
        // Only include gallery item if:
        // 1. Has existing valid image URL (for update), OR
        // 2. Has new file upload (for create/update)
        // AND has at least title or description
        if ((imageUrl || hasNewFile) && (title || description)) {
            const galleryItem = {
                title: title || null,
                description: description || null,
                order: parseInt(order) || (index + 1)
            };
            
            // Add image URL if exists and is valid (for update)
            if (imageUrl) {
                galleryItem.image_url = imageUrl;
            }
            
            // Add file reference for FormData handling (for create)
            if (hasNewFile) {
                galleryItem.file = fileInput.files[0];
            }
            
            galleryData.push(galleryItem);
        }
    });
    
    // Sort by order
    galleryData.sort((a, b) => a.order - b.order);
    
    console.log('Collected gallery data:', galleryData);
    return galleryData;
}

function collectCustomSectionsData() {
    console.log('Collecting custom sections data...');
    const sectionsData = [];
    const customSections = document.querySelectorAll('#customSections .custom-section-item');
    
    console.log('Found custom sections:', customSections.length);
    
    customSections.forEach((section, index) => {
        console.log(`Processing section ${index + 1}:`, section);
        
        // Get section metadata from hidden inputs
        const titleInput = section.querySelector('input[name*="_title"]');
        const typeInput = section.querySelector('input[name*="_type"]');
        const orderInput = section.querySelector('input[name*="_order"]');
        
        const title = titleInput?.value || section.querySelector('h4')?.textContent.split(' (')[0];
        const type = typeInput?.value;
        const order = orderInput?.value || (index + 1);
        
        console.log('Section metadata:', { title, type, order });
        
        const items = [];
        
        // Collect items from section
        const sectionItems = section.querySelectorAll('.section-item');
        console.log(`Found ${sectionItems.length} items in section`);
        
        sectionItems.forEach((item, itemIndex) => {
            const itemData = {};
            
            // Get all inputs in this item
            const inputs = item.querySelectorAll('input, textarea, select');
            console.log(`Item ${itemIndex + 1} has ${inputs.length} inputs`);
            
            inputs.forEach(input => {
                const value = input.value?.trim();
                if (value) {
                    // Extract field name from input name attribute
                    let fieldName = input.name;
                    if (fieldName.includes('_item_')) {
                        // Extract the field type (title, description, etc.)
                        const parts = fieldName.split('_item_');
                        if (parts.length > 1) {
                            fieldName = parts[1].replace('[]', '');
                        }
                    }
                    
                    // Convert numeric fields to integers
                    if (fieldName === 'order') {
                        itemData[fieldName] = parseInt(value) || 1;
                    } else {
                        itemData[fieldName] = value;
                    }
                    console.log(`Added field: ${fieldName} = ${itemData[fieldName]}`);
                }
            });
            
            if (Object.keys(itemData).length > 0) {
                items.push(itemData);
                console.log('Added item to section:', itemData);
            }
        });
        
        if (title && items.length > 0) {
            const sectionData = {
                title: title,
                type: type || 'mixed',  // Backend expects "type" not "section_type"
                order: parseInt(order) || (index + 1),
                items: items
            };
            sectionsData.push(sectionData);
            console.log('Added section to data:', sectionData);
        } else {
            console.log('Skipped section - missing title or items:', { title, itemsCount: items.length });
        }
    });
    
    console.log('Final custom sections data:', sectionsData);
    return sectionsData;
}

function collectProjectStatsData() {
    const statsData = [];
    const statItems = document.querySelectorAll('#projectStats .stat-item');
    
    statItems.forEach((item, index) => {
        const label = item.querySelector('input[name="stat_label[]"]')?.value.trim();
        const value = item.querySelector('input[name="stat_value[]"]')?.value.trim();
        const icon = item.querySelector('input[name="stat_icon[]"]')?.value.trim();
        const order = item.querySelector('input[name="stat_order[]"]')?.value || (index + 1);
        
        if (label && value) {
            statsData.push({
                label,
                value,
                icon: icon || 'fas fa-chart-bar',
                order: parseInt(order) || (index + 1)
            });
        }
    });
    
    console.log('Collected project stats:', statsData);
    return statsData;
}

function collectProjectInfoData() {
    const infoData = [];
    const infoItems = document.querySelectorAll('#projectInfo .info-item');
    
    infoItems.forEach((item, index) => {
        const label = item.querySelector('input[name="info_label[]"]')?.value.trim();
        const value = item.querySelector('input[name="info_value[]"]')?.value.trim();
        const order = item.querySelector('input[name="info_order[]"]')?.value || (index + 1);
        
        if (label && value) {
            infoData.push({
                label,
                value,
                order: parseInt(order) || (index + 1)
            });
        }
    });
    
    console.log('Collected project info:', infoData);
    return infoData;
}

