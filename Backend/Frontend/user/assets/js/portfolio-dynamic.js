// ===== Dynamic Portfolio JavaScript =====

// Configuration
const API_CONFIG = {
    BASE_URL: window.location.origin,
    ENDPOINTS: {
        PORTFOLIOS: '/api/portfolios',
        CATEGORIES: '/api/portfolios/categories'
    }
};

// Global variables
let portfolioData = [];
let categoriesData = [];
let currentFilter = 'all';

// Initialize loading screen first
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing Portfolio');
    initLoadingScreen();
    
    // Add debug info
    setTimeout(() => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        console.log('Navigation elements found:', {
            navToggle: !!navToggle,
            navMenu: !!navMenu,
            windowWidth: window.innerWidth
        });
    }, 1000);
});

// Loading Screen functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const loadingMessage = document.querySelector('.loading-message');
    
    let progress = 0;
    const messages = [
        'Loading Portfolio...',
        'Fetching Projects...',
        'Loading Categories...',
        'Initializing Components...',
        'Almost Ready...'
    ];
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random increment between 5-20
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Final message
            loadingMessage.textContent = 'Ready!';
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        }
        
        // Update progress bar
        progressBar.style.width = progress + '%';
        
        // Update message based on progress
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
        }, 1000); // Minimum loading time of 1 second
    });
    
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Remove loading screen from DOM after transition
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
        
        // Initialize main portfolio functionality after loading
        initPortfolio();
        
        // Trigger entrance animations for main content
        triggerEntranceAnimations();
    }
    
    function triggerEntranceAnimations() {
        // Add entrance animations to main sections
        const sections = document.querySelectorAll('.hero, .portfolio-section, .footer');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }, index * 200);
        });
    }
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
}

// Main portfolio initialization
function initPortfolio() {
    // Initialize navigation first
    initNavigation();
    
    // Add additional mobile navigation fixes
    initMobileNavigationFixes();
    
    initAnimations();
    initScrollAnimations();
    initFloatingIcons();
    initTheme();
    initPerformanceOptimizations();
    initErrorHandling();
    initAccessibility();
    
    // Load portfolio data
    loadPortfolioData();
}

// Additional mobile navigation fixes
function initMobileNavigationFixes() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        // Ensure toggle is visible on mobile
        if (window.innerWidth <= 768) {
            navToggle.style.display = 'flex';
        }
        
        // Add additional click handler for better compatibility
        navToggle.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
        
        // Prevent default touch behaviors that might interfere
        navToggle.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
        
        // Add visual feedback
        navToggle.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
        });
        
        navToggle.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        });
        
        // Ensure menu is properly positioned
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navToggle.style.display = 'none';
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                navToggle.style.display = 'flex';
            }
        });
    }
}

// ===== API Functions =====
async function loadPortfolioData() {
    try {
        showLoading();
        hideError();
        
        // Load portfolios and categories in parallel
        const [portfoliosResponse, categoriesResponse] = await Promise.all([
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PORTFOLIOS}?limit=50`),
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`)
        ]);
        
        if (!portfoliosResponse.ok || !categoriesResponse.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const portfoliosData = await portfoliosResponse.json();
        const categoriesDataResponse = await categoriesResponse.json();
        
        portfolioData = portfoliosData.data || [];
        categoriesData = categoriesDataResponse.data || [];
        
        // Update hero stats
        updateHeroStats();
        
        // Render portfolio cards
        renderPortfolioCards(portfolioData);
        
        // Update filter count
        updateFilterCount(portfolioData.length);
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        hideLoading();
        showError();
    }
}

function updateHeroStats() {
    const projectsCount = document.getElementById('projects-count');
    const categoriesCount = document.getElementById('categories-count');
    
    if (projectsCount) {
        projectsCount.setAttribute('data-count', portfolioData.length);
        animateCounter(projectsCount, portfolioData.length);
    }
    
    if (categoriesCount) {
        categoriesCount.setAttribute('data-count', categoriesData.length);
        animateCounter(categoriesCount, categoriesData.length);
    }
}

function renderPortfolioCards(portfolios) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = '';
    
    if (portfolios.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Found</h3>
                <p>No projects match the current filter criteria.</p>
            </div>
        `;
        return;
    }
    
    portfolios.forEach(portfolio => {
        const card = createPortfolioCard(portfolio);
        portfolioGrid.appendChild(card);
    });
    
    // Initialize card interactions after rendering
    initPortfolioInteractions();
}

function createPortfolioCard(portfolio) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.setAttribute('data-category', portfolio.category);
    
    // Get category icon
    const categoryIcon = getCategoryIcon(portfolio.category);
    
    // Get technology tags (limit to first 3)
    const techTags = getTechnologyTags(portfolio.technology_stacks);
    
    // Format description (limit to 120 characters)
    const description = portfolio.description.length > 120 
        ? portfolio.description.substring(0, 120) + '...'
        : portfolio.description;
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${portfolio.image_url}" alt="${portfolio.title}" loading="lazy">
            <div class="card-overlay">
                <div class="overlay-content">
                    <button class="btn-view" onclick="viewPortfolioDetail(${portfolio.id})">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    ${portfolio.live_demo_url ? `
                        <a href="${portfolio.live_demo_url}" target="_blank" class="btn-demo">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                    ${portfolio.github_url ? `
                        <a href="${portfolio.github_url}" target="_blank" class="btn-code">
                            <i class="fab fa-github"></i>
                            Source Code
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
        <div class="card-content">
            <div class="card-category">
                <i class="${categoryIcon}"></i>
                ${portfolio.category}
            </div>
            <h3 class="card-title">${portfolio.title}</h3>
            <p class="card-description">${description}</p>
            <div class="card-tech">
                ${techTags}
            </div>
            ${new Date(portfolio.updated_at).toISOString().split("T")[0]? `
                <div class="card-time">
                    <i class="fas fa-clock"></i>last updated <br>
                    ${new Date(portfolio.updated_at).toISOString().split("T")[0]}
                </div>
            ` : ''}
            <div class="card-actions">
                <button class="btn-details" onclick="viewPortfolioDetail(${portfolio.id})">
                    <i class="fas fa-info-circle"></i>
                    Read More
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function getCategoryIcon(category) {
    const iconMap = {
        'Development': 'fas fa-code',
        'Data Analytics': 'fas fa-chart-line',
        'Data Engineer': 'fas fa-database'
    };
    return iconMap[category] || 'fas fa-project-diagram';
}

function getTechnologyTags(technologyStacks) {
    if (!technologyStacks || technologyStacks.length === 0) {
        return '';
    }
    
    const allTechs = [];
    technologyStacks.forEach(stack => {
        if (stack.items && stack.items.length > 0) {
            stack.items.forEach(item => {
                allTechs.push(item.name);
            });
        }
    });
    
    // Limit to first 3 technologies
    const limitedTechs = allTechs.slice(0, 3);
    
    return limitedTechs.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
}

function viewPortfolioDetail(portfolioId) {
    // Find portfolio data to get title for slug
    const portfolio = portfolioData.find(p => p.id === portfolioId);
    if (!portfolio) {
        console.error('Portfolio not found:', portfolioId);
        return;
    }
    
    // Create slug from title
    const slug = createSlug(portfolio.title);
    
    // Navigate to portfolio detail page with slug and ID
    window.location.href = `/portfolio/${portfolioId}/${slug}`;
}

// Helper function to create URL-friendly slug
function createSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// ===== Navigation Functions =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Initializing navigation...', { navToggle: !!navToggle, navMenu: !!navMenu });

    // Mobile menu toggle with simplified handling
    if (navToggle && navMenu) {
        // Clear any existing event listeners
        const newToggle = navToggle.cloneNode(true);
        navToggle.parentNode.replaceChild(newToggle, navToggle);
        
        // Get the new reference
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        
        // Simple click handler
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Toggle button clicked!');
            
            // Toggle classes
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('Menu opened');
            } else {
                document.body.style.overflow = '';
                console.log('Menu closed');
            }
        });
        
        // Touch event for mobile devices
        toggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            console.log('Toggle button touched!');
            
            // Toggle classes
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('Menu opened via touch');
            } else {
                document.body.style.overflow = '';
                console.log('Menu closed via touch');
            }
        }, { passive: false });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Escape key to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Navigation elements not found:', { navToggle: !!navToggle, navMenu: !!navMenu });
    }

    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const filter = link.getAttribute('data-filter');
            const href = link.getAttribute('href');
            
            console.log('Link clicked:', href, filter); // Debug log
            
            // Close mobile menu first
            const toggle = document.getElementById('nav-toggle');
            const menu = document.getElementById('nav-menu');
            if (toggle && menu) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Handle About Me link - redirect to localhost:8080
            if (filter === 'about' || href === 'http://localhost:8080') {
                e.preventDefault();
                window.location.href = 'http://localhost:8080';
                return;
            }
            
            // Handle Contact link - redirect to contact form
            if (filter === 'contact' || href === '/contact-form.html') {
                e.preventDefault();
                window.location.href = '/contact-form.html';
                return;
            }
            
            // Handle internal portfolio navigation
            if (filter && filter !== 'about' && filter !== 'contact') {
                e.preventDefault();
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to portfolio section first
                smoothScrollTo('#portfolio');
                
                // Then filter after a short delay
                setTimeout(() => {
                    filterPortfolioCards(filter);
                }, 300);
            }
        });
    });

    // Navbar scroll effect
    if (navbar) {
        let ticking = false;
        
        function updateNavbar() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    // Footer links
    const footerLinks = document.querySelectorAll('.footer-section a[data-filter]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            
            // Update nav link
            const correspondingNavLink = document.querySelector(`.nav-link[data-filter="${filter}"]`);
            if (correspondingNavLink) {
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                correspondingNavLink.classList.add('active');
            }
            
            // Scroll and filter
            smoothScrollTo('#portfolio');
            setTimeout(() => {
                filterPortfolioCards(filter);
            }, 300);
        });
    });
}

function filterPortfolioCards(filter) {
    currentFilter = filter;
    
    let filteredPortfolios;
    if (filter === 'all') {
        filteredPortfolios = portfolioData;
    } else {
        filteredPortfolios = portfolioData.filter(portfolio => 
            portfolio.category === filter
        );
    }
    
    // Update filter status
    updateFilterStatus(filter);
    
    // Update filter count
    updateFilterCount(filteredPortfolios.length);
    
    // Show loading briefly for smooth transition
    showLoading();
    
    setTimeout(() => {
        renderPortfolioCards(filteredPortfolios);
        hideLoading();
    }, 300);
}

function updateFilterStatus(filter) {
    const filterIcon = document.querySelector('.filter-icon i');
    const filterText = document.querySelector('.filter-text');
    
    const filterConfig = {
        all: {
            icon: 'fas fa-th-large',
            text: 'Showing All Projects'
        },
        'Development': {
            icon: 'fas fa-code',
            text: 'Showing Developer Projects'
        },
        'Data Analytics': {
            icon: 'fas fa-chart-line',
            text: 'Showing Data Analyst Projects'
        },
        'Data Engineer': {
            icon: 'fas fa-database',
            text: 'Showing Data Engineer Projects'
        }
    };
    
    const config = filterConfig[filter] || filterConfig.all;
    
    if (filterIcon) {
        filterIcon.className = config.icon;
    }
    
    if (filterText) {
        filterText.textContent = config.text;
    }
}

function updateFilterCount(count) {
    const filterCount = document.getElementById('filter-count');
    if (filterCount) {
        filterCount.textContent = `(${count})`;
    }
}

// ===== UI Helper Functions =====
function showLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}

function showError() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.style.display = 'flex';
    }
}

function hideError() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

// ===== Animation Functions =====
function initAnimations() {
    // Initialize counter animations
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

function initScrollAnimations() {
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.portfolio-card, .section-header, .hero-content');
    animateElements.forEach(el => observer.observe(el));
}

function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random floating animation
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        
        icon.style.animationDelay = `${randomDelay}s`;
        icon.style.animationDuration = `${randomDuration}s`;
        
        // Add hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function initPortfolioInteractions() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    portfolioCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        // Add click effect
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.closest('.btn-view, .btn-code')) return;
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== Utility Functions =====
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Theme and Performance =====
function initTheme() {
    // Theme switching functionality (if needed in the future)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for theme changes
    prefersDark.addEventListener('change', (e) => {
        // Handle theme change if needed
        console.log('Theme preference changed:', e.matches ? 'dark' : 'light');
    });
}

function initPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Debounced scroll handler
    const debouncedScrollHandler = debounce(() => {
        // Handle scroll events efficiently
    }, 16); // ~60fps
    
    window.addEventListener('scroll', debouncedScrollHandler);
}

function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        // Could send error to logging service
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // Could send error to logging service
    });
}

function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.getElementById('nav-menu');
            
            if (navToggle && navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // Add focus indicators
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('focused');
        });
    });
}

// ===== Export functions for global access =====
window.loadPortfolioData = loadPortfolioData;
window.viewPortfolioDetail = viewPortfolioDetail; 