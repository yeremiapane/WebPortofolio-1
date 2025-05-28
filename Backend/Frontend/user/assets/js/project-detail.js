// Project Detail JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen first
    initLoadingScreen();
    
    // Initialize all functionality
    initNavbar();
    initImageGallery();
    initShareButton();
    initSmoothScrolling();
    initAnimations();
    initPlayButton();
});

// Loading Screen functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const loadingMessage = document.querySelector('.loading-message');
    
    let progress = 0;
    const messages = [
        'Loading Project Details...',
        'Preparing Content...',
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
        
        // Trigger entrance animations for main content
        triggerEntranceAnimations();
    }
    
    function triggerEntranceAnimations() {
        // Add entrance animations to main sections
        const sections = document.querySelectorAll('.project-hero, .project-details, .related-projects');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }, index * 200);
        });
    }
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
}

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Image Gallery Modal
function initImageGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    let currentImageIndex = 0;
    const images = [
        {
            src: 'https://via.placeholder.com/800x600/4F46E5/ffffff?text=Homepage+Detail',
            alt: 'Homepage Detail'
        },
        {
            src: 'https://via.placeholder.com/800x600/059669/ffffff?text=Product+Page+Detail',
            alt: 'Product Page Detail'
        },
        {
            src: 'https://via.placeholder.com/800x600/DC2626/ffffff?text=Admin+Dashboard+Detail',
            alt: 'Admin Dashboard Detail'
        },
        {
            src: 'https://via.placeholder.com/800x600/7C3AED/ffffff?text=Checkout+Process+Detail',
            alt: 'Checkout Process Detail'
        }
    ];
    
    // Open modal
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentImageIndex = index;
            showModal();
            updateModalImage();
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', hideModal);
    
    // Navigation
    modalPrev.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalImage();
    });
    
    modalNext.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalImage();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                hideModal();
                break;
            case 'ArrowLeft':
                modalPrev.click();
                break;
            case 'ArrowRight':
                modalNext.click();
                break;
        }
    });
    
    function showModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.style.animation = 'fadeIn 0.3s ease-out';
    }
    
    function hideModal() {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
    
    function updateModalImage() {
        const image = images[currentImageIndex];
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        
        // Add loading animation
        modalImage.style.opacity = '0';
        modalImage.onload = function() {
            modalImage.style.transition = 'opacity 0.3s ease';
            modalImage.style.opacity = '1';
        };
    }
}

// Share Button functionality
function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            // Use native Web Share API if available
            navigator.share({
                title: 'E-Commerce Platform - Project Detail',
                text: 'Check out this amazing e-commerce platform project!',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            copyToClipboard(window.location.href);
            showNotification('Link copied to clipboard!');
        }
    });
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4F46E5;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.content-section, .project-card, .sidebar-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Play button functionality
function initPlayButton() {
    const playBtn = document.getElementById('play-demo');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Simulate demo launch
            showNotification('Demo launching...');
            
            // You can replace this with actual demo URL
            setTimeout(() => {
                window.open('#', '_blank');
            }, 1000);
        });
    }
}

// Tech tag hover effects
document.addEventListener('DOMContentLoaded', function() {
    const techTags = document.querySelectorAll('.tech-tag');
    
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Feature items interaction
document.addEventListener('DOMContentLoaded', function() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'rotate(5deg) scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });
});

// Challenge items expand/collapse
document.addEventListener('DOMContentLoaded', function() {
    const challengeItems = document.querySelectorAll('.challenge-item');
    
    challengeItems.forEach(item => {
        const header = item.querySelector('.challenge-header');
        const content = item.querySelector('p');
        
        // Initially collapse content on mobile
        if (window.innerWidth <= 768) {
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease';
            
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                if (content.style.maxHeight === '0px') {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        }
    });
});

// Parallax effect for hero image
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize parallax on larger screens
if (window.innerWidth > 768) {
    initParallax();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .btn-play {
        position: relative;
        overflow: hidden;
    }
    
    .tech-tag {
        transition: all 0.2s ease;
    }
    
    .feature-icon {
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(style);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// Initialize lazy loading
initLazyLoading();

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #4F46E5;
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
    });
}

// Initialize back to top
initBackToTop();

// Progress bar for reading
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4F46E5, #6366F1);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize progress bar
initProgressBar(); 