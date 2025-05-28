// ===== Portfolio JavaScript =====

// Initialize loading screen first
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
        'Loading Portfolio...',
        'Preparing Projects...',
        'Loading Images...',
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
    initNavigation();
    initPortfolioFilter();
    initAnimations();
    initScrollAnimations();
    initFloatingIcons();
    initPortfolioInteractions();
    initTheme();
    initPerformanceOptimizations();
    initErrorHandling();
    initAccessibility();
}

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const loadingContainer = document.getElementById('loading-container');
const portfolioGrid = document.getElementById('portfolio-grid');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const statNumbers = document.querySelectorAll('.stat-number');
const filterStatus = document.getElementById('filter-status');
const filterCount = document.getElementById('filter-count');

// Filter configuration
const filterConfig = {
    all: {
        icon: 'fas fa-th-large',
        text: 'Showing All Projects',
        animation: 'bounceIn'
    },
    developer: {
        icon: 'fas fa-code',
        text: 'Showing Developer Projects',
        animation: 'slideInLeft'
    },
    'data-analyst': {
        icon: 'fas fa-chart-line',
        text: 'Showing Data Analyst Projects',
        animation: 'slideInRight'
    },
    'data-engineer': {
        icon: 'fas fa-database',
        text: 'Showing Data Engineer Projects',
        animation: 'zoomIn'
    }
};

// ===== Navigation Functions =====
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links and handle filtering
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Get filter value
            const filter = link.getAttribute('data-filter');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Handle different navigation actions
            if (filter && filter !== 'about' && filter !== 'contact') {
                // Smooth scroll to portfolio section first
                smoothScrollTo('#portfolio');
                
                // Then filter after a short delay
                setTimeout(() => {
                    filterPortfolioCards(filter);
                }, 300);
            } else if (filter === 'about') {
                // Scroll to about section when implemented
                console.log('About section - to be implemented');
                // For now, scroll to hero section
                smoothScrollTo('#home');
            } else if (filter === 'contact') {
                // Scroll to contact section when implemented
                console.log('Contact section - to be implemented');
                // For now, scroll to footer
                smoothScrollTo('.footer');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link on scroll
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// ===== Portfolio Filter Functions =====
function initPortfolioFilter() {
    // Initial load - show all projects
    filterPortfolioCards('all');
}

function filterPortfolioCards(filter) {
    // Update filter status
    updateFilterStatus(filter);
    
    // Show loading animation
    showLoading();
    
    // Add filtering class to grid
    portfolioGrid.classList.add('filtering');
    
    // First, hide all cards with exit animation
    portfolioCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('hidden');
            card.classList.remove('show');
        }, index * 30);
    });
    
    // After hiding animation, show filtered cards
    setTimeout(() => {
        let visibleCount = 0;
        const config = filterConfig[filter];
        
        portfolioCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                    card.style.animation = `${config.animation} 0.8s ease-out ${visibleCount * 0.15}s both`;
                    visibleCount++;
                }, 200 + (visibleCount * 100));
            }
        });
        
        // Update count and hide loading
        setTimeout(() => {
            updateFilterCount(visibleCount);
            hideLoading();
            portfolioGrid.classList.remove('filtering');
        }, 200 + (visibleCount * 100) + 800);
        
    }, portfolioCards.length * 30 + 300);
}

function showLoading() {
    loadingContainer.classList.add('show');
}

function hideLoading() {
    loadingContainer.classList.remove('show');
}

function updateFilterStatus(filter) {
    const config = filterConfig[filter];
    const filterIcon = filterStatus.querySelector('.filter-icon i');
    const filterText = filterStatus.querySelector('.filter-text');
    
    // Add updating class for animation
    filterStatus.classList.add('updating');
    
    setTimeout(() => {
        // Update icon and text
        filterIcon.className = config.icon;
        filterText.textContent = config.text;
        
        // Remove updating class
        filterStatus.classList.remove('updating');
    }, 150);
}

function updateFilterCount(count) {
    filterCount.textContent = `(${count})`;
    
    // Add bounce animation to count
    filterCount.style.animation = 'bounceIn 0.5s ease-out';
    setTimeout(() => {
        filterCount.style.animation = '';
    }, 500);
}

// ===== Animation Functions =====
function initAnimations() {
    // Counter animation for stats
    animateCounters();
    
    // Intersection Observer for scroll animations
    initScrollAnimations();
    
    // Floating icons animation
    initFloatingIcons();
}

function animateCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    statNumbers.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out both';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe portfolio cards
    portfolioCards.forEach(card => {
        observer.observe(card);
    });

    // Observe other elements
    const animatedElements = document.querySelectorAll('.section-header, .filter-buttons');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random rotation animation
        icon.style.animation += `, rotate ${15 + index * 5}s linear infinite`;
        icon.style.animationDelay = `${index * 0.5}s, ${index * 2}s`;
        
        // Add enhanced hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) translateY(-15px) rotate(10deg)';
            icon.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) translateY(0) rotate(0deg)';
            icon.style.boxShadow = '';
        });
    });
    
    // Add scroll parallax effect
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingIcons.forEach((icon, index) => {
            const speed = 0.5 + (index * 0.1);
            icon.style.transform += ` translateY(${rate * speed}px)`;
        });
    }, 10));
}

// ===== Utility Functions =====
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    } else {
        console.warn(`Element with selector "${target}" not found`);
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

// ===== Portfolio Card Interactions =====
function initPortfolioInteractions() {
    portfolioCards.forEach(card => {
        const viewBtn = card.querySelector('.btn-view');
        const codeBtn = card.querySelector('.btn-code');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Add your view project logic here
                console.log('View project clicked');
            });
        }
        
        if (codeBtn) {
            codeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Add your view code logic here
                console.log('View code clicked');
            });
        }
        
        // Add enhanced card tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
            card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
        
        // Add click animation
        card.addEventListener('mousedown', () => {
            card.style.transform += ' scale(0.98)';
        });
        
        card.addEventListener('mouseup', () => {
            card.style.transform = card.style.transform.replace(' scale(0.98)', '');
        });
    });
}

// ===== Theme Functions =====
function initTheme() {
    // Add theme toggle functionality if needed
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for theme changes
    prefersDark.addEventListener('change', (e) => {
        // Handle theme change if needed
        console.log('Theme preference changed:', e.matches ? 'dark' : 'light');
    });
}

// ===== Performance Optimizations =====
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimize scroll events
    const optimizedScroll = debounce(() => {
        // Handle scroll events here
    }, 16);
    
    window.addEventListener('scroll', optimizedScroll);
}

// ===== Error Handling =====
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// ===== Accessibility =====
function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
}

// ===== Additional CSS Animations =====
const additionalStyles = `
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.floating-icon {
    transition: transform 0.3s ease;
}

.portfolio-card {
    transition: transform 0.3s ease;
}
`;

// Add additional styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== Initialize Everything =====
// Initialization is now handled by initLoadingScreen() and initPortfolio()

// ===== Export functions for external use =====
window.PortfolioApp = {
    filterPortfolioCards,
    smoothScrollTo,
    animateCounter
}; 