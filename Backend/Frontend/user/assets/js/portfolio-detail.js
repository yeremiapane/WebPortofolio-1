// ===== Portfolio Detail JavaScript =====

// Configuration
const API_CONFIG = {
    BASE_URL: window.location.origin,
    ENDPOINTS: {
        PORTFOLIOS: '/api/portfolios',
        CATEGORIES: '/api/portfolios/categories'
    }
};

// Global variables
let currentPortfolio = null;
let relatedPortfolios = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
});

// Loading Screen functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const loadingMessage = document.querySelector('.loading-message');
    
    let progress = 0;
    const messages = [
        'Loading Project Details...',
        'Fetching Portfolio Data...',
        'Loading Gallery Images...',
        'Preparing Content...',
        'Almost Ready...'
    ];
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            loadingMessage.textContent = 'Ready!';
            
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        }
        
        progressBar.style.width = progress + '%';
        
        const messageIndex = Math.floor((progress / 100) * (messages.length - 1));
        if (messageIndex < messages.length) {
            loadingMessage.textContent = messages[messageIndex];
        }
    }, 200);
    
    // Ensure loading screen is hidden when all resources are loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (!loadingScreen.classList.contains('hidden')) {
                progress = 100;
                progressBar.style.width = '100%';
                loadingMessage.textContent = 'Ready!';
                
                setTimeout(() => {
                    hideLoadingScreen();
                }, 300);
            }
        }, 1000);
    });
    
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
        
        // Initialize portfolio detail functionality
        initPortfolioDetail();
    }
    
    document.body.style.overflow = 'hidden';
}

// Main initialization
function initPortfolioDetail() {
    initNavigation();
    initImageModal();
    loadPortfolioDetail();
}

// Get portfolio ID from URL
function getPortfolioIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load portfolio detail data
async function loadPortfolioDetail() {
    const portfolioId = getPortfolioIdFromUrl();
    
    if (!portfolioId) {
        showError('No portfolio ID provided');
        return;
    }
    
    try {
        // Load portfolio detail and related portfolios in parallel
        const [portfolioResponse, relatedResponse] = await Promise.all([
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PORTFOLIOS}/${portfolioId}`),
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PORTFOLIOS}?limit=4`)
        ]);
        
        if (!portfolioResponse.ok) {
            throw new Error('Portfolio not found');
        }
        
        const portfolioData = await portfolioResponse.json();
        const relatedData = await relatedResponse.json();
        
        currentPortfolio = portfolioData.data;
        relatedPortfolios = relatedData.data.filter(p => p.id !== currentPortfolio.id).slice(0, 3);
        
        // Render portfolio content
        renderPortfolioDetail(currentPortfolio);
        renderRelatedProjects(relatedPortfolios);
        
        // Show content
        showContent();
        
    } catch (error) {
        console.error('Error loading portfolio detail:', error);
        showError(error.message);
    }
}

// Render portfolio detail content
function renderPortfolioDetail(portfolio) {
    // Update page title
    document.title = `${portfolio.title} - Yeremia Yosefan Pane Portfolio`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = portfolio.title;
    
    // Update hero section
    updateHeroSection(portfolio);
    
    // Update overview section
    updateOverviewSection(portfolio);
    
    // Update technology stack
    updateTechnologySection(portfolio);
    
    // Update gallery
    updateGallerySection(portfolio);
    
    // Update project stats
    updateStatsSection(portfolio);
    
    // Update custom sections
    updateCustomSections(portfolio);
    
    // Update project info
    updateProjectInfoSection(portfolio);
}

// Update hero section
function updateHeroSection(portfolio) {
    const categoryIcon = getCategoryIcon(portfolio.category);
    
    // Update category badge
    const heroBadge = document.getElementById('hero-category');
    heroBadge.innerHTML = `
        <i class="${categoryIcon}"></i>
        <span>${portfolio.category}</span>
    `;
    
    // Update title and description
    document.getElementById('hero-title').textContent = portfolio.title;
    document.getElementById('hero-description').textContent = portfolio.description;
    
    // Update hero image
    const heroImage = document.getElementById('hero-image');
    heroImage.src = portfolio.image_url;
    heroImage.alt = portfolio.title;
    
    // Update action buttons
    updateActionButtons(portfolio);
    
    // Update project meta
    updateProjectMeta(portfolio);
}

// Update action buttons
function updateActionButtons(portfolio) {
    const actionButtons = document.getElementById('action-buttons');
    let buttonsHTML = '';
    
    if (portfolio.live_demo_url) {
        buttonsHTML += `
            <a href="${portfolio.live_demo_url}" target="_blank" class="action-btn primary">
                <i class="fas fa-external-link-alt"></i>
                Live Demo
            </a>
        `;
    }
    
    if (portfolio.github_url) {
        buttonsHTML += `
            <a href="${portfolio.github_url}" target="_blank" class="action-btn secondary">
                <i class="fab fa-github"></i>
                Source Code
            </a>
        `;
    }
    
    actionButtons.innerHTML = buttonsHTML;
}

// Update project meta
function updateProjectMeta(portfolio) {
    const projectMeta = document.getElementById('project-meta');
    let metaHTML = '';
    
    if (portfolio.category) {
        metaHTML += `
            <div class="meta-item">
                <div class="meta-label">Category</div>
                <div class="meta-value">${portfolio.category}</div>
            </div>
        `;
    }
    
    if (portfolio.project_time) {
        metaHTML += `
            <div class="meta-item">
                <div class="meta-label">Duration</div>
                <div class="meta-value">${portfolio.project_time}</div>
            </div>
        `;
    }
    
    if (portfolio.created_at) {
        const date = new Date(portfolio.created_at);
        metaHTML += `
            <div class="meta-item">
                <div class="meta-label">Completed</div>
                <div class="meta-value">${date.getFullYear()}</div>
            </div>
        `;
    }
    
    projectMeta.innerHTML = metaHTML;
}

// Update overview section
function updateOverviewSection(portfolio) {
    const overviewContent = document.getElementById('overview-content');
    
    if (portfolio.overview) {
        // Convert line breaks to paragraphs
        const paragraphs = portfolio.overview.split('\n').filter(p => p.trim());
        const overviewHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        overviewContent.innerHTML = overviewHTML;
    } else {
        overviewContent.innerHTML = '<p>No detailed overview available for this project.</p>';
    }
}

// Update technology section
function updateTechnologySection(portfolio) {
    const techGrid = document.getElementById('tech-grid');
    const techSection = document.getElementById('technology-section');
    
    if (!portfolio.technology_stacks || portfolio.technology_stacks.length === 0) {
        techSection.style.display = 'none';
        return;
    }
    
    techSection.style.display = 'block';
    
    const techHTML = portfolio.technology_stacks.map(stack => {
        const categoryIcon = getTechCategoryIcon(stack.category);
        const itemsHTML = stack.items.map(item => `
            <div class="tech-item">
                <div class="tech-item-name">${item.name}</div>
                ${item.version ? `<div class="tech-item-version">${item.version}</div>` : ''}
            </div>
        `).join('');
        
        return `
            <div class="tech-category">
                <h3>
                    <i class="${categoryIcon}"></i>
                    ${stack.category}
                </h3>
                <div class="tech-items">
                    ${itemsHTML}
                </div>
            </div>
        `;
    }).join('');
    
    techGrid.innerHTML = techHTML;
}

// Update gallery section
function updateGallerySection(portfolio) {
    const galleryGrid = document.getElementById('gallery-grid');
    const gallerySection = document.getElementById('gallery-section');
    
    if (!portfolio.project_gallery || portfolio.project_gallery.length === 0) {
        gallerySection.style.display = 'none';
        return;
    }
    
    gallerySection.style.display = 'block';
    
    const galleryHTML = portfolio.project_gallery.map(image => `
        <div class="gallery-item" onclick="openImageModal('${image.image_url}', '${image.title || ''}', '${image.description || ''}')">
            <img src="${image.image_url}" alt="${image.title || 'Gallery Image'}" loading="lazy">
            <div class="gallery-overlay">
                ${image.title ? `<div class="gallery-title">${image.title}</div>` : ''}
                ${image.description ? `<div class="gallery-description">${image.description}</div>` : ''}
            </div>
        </div>
    `).join('');
    
    galleryGrid.innerHTML = galleryHTML;
}

// Update stats section
function updateStatsSection(portfolio) {
    const statsGrid = document.getElementById('stats-grid');
    const statsSection = document.getElementById('stats-section');
    
    if (!portfolio.project_stats || portfolio.project_stats.length === 0) {
        statsSection.style.display = 'none';
        return;
    }
    
    statsSection.style.display = 'block';
    
    const statsHTML = portfolio.project_stats.map(stat => `
        <div class="stat-card">
            ${stat.icon ? `<div class="stat-icon"><i class="${stat.icon}"></i></div>` : ''}
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
    
    statsGrid.innerHTML = statsHTML;
}

// Update custom sections
function updateCustomSections(portfolio) {
    const customSectionsContainer = document.getElementById('custom-sections');
    
    if (!portfolio.custom_sections || portfolio.custom_sections.length === 0) {
        customSectionsContainer.innerHTML = '';
        return;
    }
    
    const sectionsHTML = portfolio.custom_sections.map(section => {
        const itemsHTML = section.items.map(item => `
            <div class="custom-item">
                ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : ''}
                <h4>${item.title}</h4>
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.tag ? `<span class="tag">${item.tag}</span>` : ''}
            </div>
        `).join('');
        
        return `
            <section class="custom-section">
                <div class="container">
                    <div class="section-header">
                        <h2>${section.title}</h2>
                    </div>
                    <div class="custom-items">
                        ${itemsHTML}
                    </div>
                </div>
            </section>
        `;
    }).join('');
    
    customSectionsContainer.innerHTML = sectionsHTML;
}

// Update project info section
function updateProjectInfoSection(portfolio) {
    const infoGrid = document.getElementById('info-grid');
    const infoSection = document.getElementById('info-section');
    
    if (!portfolio.project_info || portfolio.project_info.length === 0) {
        infoSection.style.display = 'none';
        return;
    }
    
    infoSection.style.display = 'block';
    
    const infoHTML = portfolio.project_info.map(info => `
        <div class="info-item">
            <div class="info-label">${info.label}</div>
            <div class="info-value">${info.value}</div>
        </div>
    `).join('');
    
    infoGrid.innerHTML = infoHTML;
}

// Render related projects
function renderRelatedProjects(projects) {
    const relatedGrid = document.getElementById('related-grid');
    
    if (projects.length === 0) {
        relatedGrid.innerHTML = '<p>No related projects found.</p>';
        return;
    }
    
    const relatedHTML = projects.map(project => {
        const description = project.description.length > 100 
            ? project.description.substring(0, 100) + '...'
            : project.description;
            
        return `
            <a href="/portfolio/detail?id=${project.id}" class="related-card">
                <div class="related-image">
                    <img src="${project.image_url}" alt="${project.title}" loading="lazy">
                </div>
                <div class="related-content">
                    <div class="related-category">${project.category}</div>
                    <h3 class="related-title">${project.title}</h3>
                    <p class="related-description">${description}</p>
                </div>
            </a>
        `;
    }).join('');
    
    relatedGrid.innerHTML = relatedHTML;
}

// Helper functions
function getCategoryIcon(category) {
    const iconMap = {
        'Development': 'fas fa-code',
        'Data Analytics': 'fas fa-chart-line',
        'Data Engineer': 'fas fa-database'
    };
    return iconMap[category] || 'fas fa-project-diagram';
}

function getTechCategoryIcon(category) {
    const iconMap = {
        'Frontend': 'fas fa-palette',
        'Backend': 'fas fa-server',
        'Database': 'fas fa-database',
        'DevOps': 'fas fa-cloud',
        'Tools': 'fas fa-tools',
        'Languages': 'fas fa-code',
        'Frameworks': 'fas fa-layer-group',
        'Libraries': 'fas fa-book'
    };
    return iconMap[category] || 'fas fa-cog';
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Image Modal
function initImageModal() {
    const modal = document.getElementById('image-modal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeImageModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

function openImageModal(imageUrl, title, description) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    
    modalImage.src = imageUrl;
    modalTitle.textContent = title || 'Gallery Image';
    modalDescription.textContent = description || '';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// UI Helper functions
function showContent() {
    const errorContainer = document.getElementById('error-container');
    const portfolioContent = document.getElementById('portfolio-content');
    
    errorContainer.style.display = 'none';
    portfolioContent.style.display = 'block';
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    const portfolioContent = document.getElementById('portfolio-content');
    
    portfolioContent.style.display = 'none';
    errorContainer.style.display = 'flex';
    
    // Update error message if needed
    const errorText = errorContainer.querySelector('p');
    if (errorText && message) {
        errorText.textContent = message;
    }
}

// Smooth scroll for anchor links
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for global access
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal; 