// Dynamic Project Detail JavaScript
class ProjectDetailManager {
    constructor() {
        console.log('ProjectDetailManager: Initializing...');
        this.apiBaseUrl = '/api/portfolios';
        this.projectId = this.getProjectIdFromUrl();
        this.projectData = null;
        
        console.log('ProjectDetailManager: Project ID from URL:', this.projectId);
        this.init();
    }
    
    getProjectIdFromUrl() {
        // Support both old format (?id=) and new format (/portfolio/id/slug)
        const urlParams = new URLSearchParams(window.location.search);
        const queryId = urlParams.get('id');
        
        if (queryId) {
            return queryId;
        }
        
        // Extract ID from path: /portfolio/id/slug
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'portfolio') {
            const portfolioId = pathParts[2];
            // Validate that it's a number
            if (!isNaN(portfolioId) && portfolioId !== '') {
                return portfolioId;
            }
        }
        
        return null;
    }
    
    async init() {
        if (!this.projectId) {
            this.showError('Project ID not found in URL. Please check the URL format.');
            this.hideLoadingScreen();
            return;
        }
        
        // Validate that project ID is a number
        if (isNaN(this.projectId)) {
            this.showError('Invalid project ID format. Please check the URL.');
            this.hideLoadingScreen();
            return;
        }
        
        try {
            await this.loadProjectData();
            this.renderProjectData();
            this.initializeInteractivity();
            this.hideLoadingScreen();
            console.log('ProjectDetailManager: Initialization completed successfully');
        } catch (error) {
            console.error('Error initializing project detail:', error);
            this.hideLoadingScreen();
            if (error.message.includes('404')) {
                this.showError('Project not found. The project may have been removed or the URL is incorrect.');
            } else {
                this.showError('Failed to load project data. Please try again later.');
            }
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            console.log('ProjectDetailManager: Loading screen hidden');
        }
    }
    
    async loadProjectData() {
        try {
            console.log('ProjectDetailManager: Loading data for project ID:', this.projectId);
            const response = await fetch(`${this.apiBaseUrl}/${this.projectId}`);
            
            console.log('ProjectDetailManager: API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            this.projectData = result.data;
            
            console.log('ProjectDetailManager: Project data loaded:', this.projectData);
            console.log('ProjectDetailManager: Project data keys:', Object.keys(this.projectData));
            
            // Debug specific data structures
            if (this.projectData.project_gallery) {
                console.log('ProjectDetailManager: Gallery data found:', this.projectData.project_gallery);
                console.log('ProjectDetailManager: Gallery length:', this.projectData.project_gallery.length);
            } else {
                console.log('ProjectDetailManager: No gallery data found');
            }
            
            if (this.projectData.technology_stacks) {
                console.log('ProjectDetailManager: Technology stacks found:', this.projectData.technology_stacks);
            }
            
            if (this.projectData.custom_sections) {
                console.log('ProjectDetailManager: Custom sections found:', this.projectData.custom_sections);
            }
            
        } catch (error) {
            console.error('ProjectDetailManager: Error loading project data:', error);
            throw error;
        }
    }
    
    renderProjectData() {
        if (!this.projectData) {
            console.error('ProjectDetailManager: No project data available for rendering');
            return;
        }
        
        console.log('ProjectDetailManager: Starting to render project data');
        
        this.updatePageTitle();
        this.updatePageUrl();
        this.renderHeroSection();
        this.renderProjectDetails();
        this.renderTechnologyStack();
        this.renderProjectInfo();
        this.renderGallery();
        this.renderCustomSections();
        this.updateMetaTags();
        this.loadRelatedProjects();
        
        console.log('ProjectDetailManager: Finished rendering project data');
    }
    
    updatePageTitle() {
        document.title = `${this.projectData.title} - Project Detail | Yeremia Yosefan Pane`;
    }
    
    updatePageUrl() {
        // Create slug from project title
        const slug = this.createSlug(this.projectData.title);
        const expectedUrl = `/portfolio/${this.projectData.id}/${slug}`;
        
        // Update URL if it doesn't match the expected format
        if (window.location.pathname !== expectedUrl) {
            window.history.replaceState(null, '', expectedUrl);
        }
    }
    
    createSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    
    updateMetaTags() {
        const data = this.projectData;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', data.description);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = data.description;
            document.head.appendChild(meta);
        }
        
        // Update or create Open Graph meta tags
        this.updateOrCreateMeta('property', 'og:title', data.title);
        this.updateOrCreateMeta('property', 'og:description', data.description);
        this.updateOrCreateMeta('property', 'og:image', data.image_url);
        this.updateOrCreateMeta('property', 'og:url', window.location.href);
        this.updateOrCreateMeta('property', 'og:type', 'article');
        this.updateOrCreateMeta('property', 'og:site_name', 'Yeremia Yosefan Pane Portfolio');
        
        // Update or create Twitter Card meta tags
        this.updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
        this.updateOrCreateMeta('name', 'twitter:title', data.title);
        this.updateOrCreateMeta('name', 'twitter:description', data.description);
        this.updateOrCreateMeta('name', 'twitter:image', data.image_url);
        
        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = window.location.href;
    }
    
    updateOrCreateMeta(attribute, name, content) {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }
    
    renderHeroSection() {
        const data = this.projectData;
        console.log('ProjectDetailManager: Rendering hero section with data:', data);
        
        // Update project category
        const categoryElement = document.querySelector('.project-category span');
        if (categoryElement) {
            categoryElement.textContent = data.category;
            console.log('ProjectDetailManager: Updated category to:', data.category);
        }
        
        // Update project date
        const dateElement = document.querySelector('.project-date span');
        if (dateElement) {
            const formattedDate = new Date(data.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
            dateElement.textContent = formattedDate;
            console.log('ProjectDetailManager: Updated date to:', formattedDate);
        }
        
        // Update project title - remove skeleton and set real content
        const titleElement = document.querySelector('.project-title');
        if (titleElement) {
            titleElement.innerHTML = data.title; // Remove skeleton and set real title
            console.log('ProjectDetailManager: Updated title to:', data.title);
        }
        
        // Update project subtitle/description - remove skeleton and set real content
        const subtitleElement = document.querySelector('.project-subtitle');
        if (subtitleElement) {
            subtitleElement.innerHTML = data.description; // Remove skeleton and set real description
            console.log('ProjectDetailManager: Updated subtitle to:', data.description);
        }
        
        // Update project links
        const primaryLink = document.querySelector('.project-links .btn-primary');
        const secondaryLink = document.querySelector('.project-links .btn-secondary');
        
        if (primaryLink && data.live_demo_url) {
            primaryLink.href = data.live_demo_url;
            primaryLink.style.display = 'inline-flex';
            console.log('ProjectDetailManager: Updated primary link to:', data.live_demo_url);
        } else if (primaryLink) {
            primaryLink.style.display = 'none';
        }
        
        if (secondaryLink && data.github_url) {
            secondaryLink.href = data.github_url;
            secondaryLink.style.display = 'inline-flex';
            console.log('ProjectDetailManager: Updated secondary link to:', data.github_url);
        } else if (secondaryLink) {
            secondaryLink.style.display = 'none';
        }
        
        // Update hero image as background
        const heroBgImage = document.getElementById('hero-bg-image');
        if (heroBgImage) {
            if (data.image_url) {
                heroBgImage.src = data.image_url;
                heroBgImage.alt = data.title;
                
                // Add error handling for image loading
                heroBgImage.onerror = function() {
                    console.warn('ProjectDetailManager: Failed to load hero image, using fallback');
                    this.style.display = 'none';
                };
                
                heroBgImage.onload = function() {
                    console.log('ProjectDetailManager: Hero background image loaded successfully');
                };
                
                console.log('ProjectDetailManager: Updated hero background image to:', data.image_url);
            } else {
                console.warn('ProjectDetailManager: No image URL provided for hero background');
                heroBgImage.style.display = 'none';
            }
        }
        
        // Update project stats
        this.renderProjectStats();
    }
    
    renderProjectStats() {
        const statsContainer = document.querySelector('.project-stats');
        if (!statsContainer || !this.projectData.project_stats) return;
        
        statsContainer.innerHTML = '';
        
        this.projectData.project_stats
            .sort((a, b) => a.order - b.order)
            .forEach(stat => {
                const statElement = document.createElement('div');
                statElement.className = 'stat-item';
                
                // Use custom icon if provided, otherwise use default
                const iconClass = stat.icon || 'fas fa-chart-line';
                
                statElement.innerHTML = `
                    <div class="stat-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="stat-number">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                `;
                statsContainer.appendChild(statElement);
            });
    }
    
    renderProjectDetails() {
        console.log('ProjectDetailManager: Rendering project details');
        
        // Update overview section
        const overviewContent = document.querySelector('.overview-content');
        if (overviewContent) {
            if (this.projectData.overview && this.projectData.overview.trim() !== '') {
                overviewContent.innerHTML = `<p>${this.projectData.overview}</p>`;
                console.log('ProjectDetailManager: Updated overview content');
            } else {
                // Use description as fallback if overview is not available
                overviewContent.innerHTML = `<p>${this.projectData.description}</p>`;
                console.log('ProjectDetailManager: Used description as overview fallback');
            }
        } else {
            console.warn('ProjectDetailManager: Overview content element not found');
        }
    }
    
    renderTechnologyStack() {
        const techStackContainer = document.querySelector('.tech-stack');
        if (!techStackContainer || !this.projectData.technology_stacks) return;
        
        techStackContainer.innerHTML = '';
        
        this.projectData.technology_stacks.forEach(stack => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'tech-category';
            
            const tagsHtml = stack.items.map(item => 
                `<span class="tech-tag">${item.name}</span>`
            ).join('');
            
            categoryElement.innerHTML = `
                <h4>${stack.category}</h4>
                <div class="tech-tags">
                    ${tagsHtml}
                </div>
            `;
            
            techStackContainer.appendChild(categoryElement);
        });
    }
    
    renderProjectInfo() {
        const projectInfoContainer = document.querySelector('.project-info');
        if (!projectInfoContainer || !this.projectData.project_info) return;
        
        projectInfoContainer.innerHTML = '';
        
        this.projectData.project_info
            .sort((a, b) => a.order - b.order)
            .forEach(info => {
                const infoElement = document.createElement('div');
                infoElement.className = 'info-item';
                
                let valueClass = '';
                if (info.label.toLowerCase() === 'status') {
                    valueClass = 'status-completed';
                }
                
                infoElement.innerHTML = `
                    <span class="info-label">${info.label}</span>
                    <span class="info-value ${valueClass}">${info.value}</span>
                `;
                
                projectInfoContainer.appendChild(infoElement);
            });
    }
    
    renderGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        const gallerySection = galleryGrid ? galleryGrid.closest('.content-section') : null;
        
        console.log('ProjectDetailManager: renderGallery called');
        console.log('ProjectDetailManager: galleryGrid found:', !!galleryGrid);
        console.log('ProjectDetailManager: gallerySection found:', !!gallerySection);
        
        if (!galleryGrid) {
            console.error('ProjectDetailManager: Gallery grid not found in DOM');
            return;
        }
        
        console.log('ProjectDetailManager: Project gallery data:', this.projectData.project_gallery);
        console.log('ProjectDetailManager: Gallery array length:', this.projectData.project_gallery ? this.projectData.project_gallery.length : 0);
        
        if (!this.projectData.project_gallery || this.projectData.project_gallery.length === 0) {
            // Hide gallery section if no images
            if (gallerySection) {
                gallerySection.style.display = 'none';
                console.log('ProjectDetailManager: Gallery section hidden - no images');
            }
            return;
        }
        
        // Show gallery section
        if (gallerySection) {
            gallerySection.style.display = 'block';
            console.log('ProjectDetailManager: Gallery section shown');
        }
        
        // Clear existing content
        galleryGrid.innerHTML = '';
        console.log('ProjectDetailManager: Gallery grid cleared');
        
        // Sort and render images
        const sortedImages = this.projectData.project_gallery.sort((a, b) => a.order - b.order);
        console.log('ProjectDetailManager: Sorted images:', sortedImages);
        
        // Validate and clean image data
        const validImages = sortedImages.filter(image => {
            if (!image.image_url) {
                console.warn('ProjectDetailManager: Skipping image without URL:', image);
                return false;
            }
            return true;
        }).map(image => {
            // Ensure all required fields exist with defaults
            return {
                image_url: image.image_url,
                title: image.title || '',
                description: image.description || '',
                order: image.order || 0
            };
        });
        
        console.log('ProjectDetailManager: Valid images after filtering:', validImages);
        
        validImages.forEach((image, index) => {
            console.log(`ProjectDetailManager: Processing image ${index + 1}:`, image);
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-image', index + 1);
            
            // Use title for alt text, fallback to generic text
            const altText = image.title && image.title.trim() !== '' ? image.title : 'Project Gallery Image';
            
            galleryItem.innerHTML = `
                <img src="${image.image_url}" alt="${altText}" loading="lazy" onerror="console.error('Failed to load image:', this.src)">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
            console.log('ProjectDetailManager: Added gallery item to DOM:', image.image_url);
        });
        
        console.log('ProjectDetailManager: Gallery rendering completed. Total items:', validImages.length);
        
        // Store cleaned images for modal use
        this.cleanedGalleryImages = validImages;
        
        // Reinitialize gallery modal with new images
        this.initializeGalleryModal();
    }
    
    renderCustomSections() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent || !this.projectData.custom_sections) return;
        
        // Remove existing custom sections (keep overview and features)
        const existingCustomSections = mainContent.querySelectorAll('.content-section.custom-section');
        existingCustomSections.forEach(section => section.remove());
        
        // Sort custom sections by order
        const sortedSections = this.projectData.custom_sections.sort((a, b) => a.order - b.order);
        
        sortedSections.forEach(section => {
            const sectionElement = this.createCustomSection(section);
            mainContent.appendChild(sectionElement);
        });
    }
    
    createCustomSection(section) {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'content-section custom-section';
        
        let contentHtml = '';
        
        if (section.section_type === 'list') {
            contentHtml = this.createListSection(section);
        } else if (section.section_type === 'gallery') {
            contentHtml = this.createGallerySection(section);
        } else if (section.section_type === 'mixed') {
            contentHtml = this.createMixedSection(section);
        }
        
        sectionElement.innerHTML = `
            <h2 class="section-title">${section.title}</h2>
            ${contentHtml}
        `;
        
        return sectionElement;
    }
    
    createListSection(section) {
        const items = section.items.sort((a, b) => a.order - b.order);
        
        if (section.title.toLowerCase().includes('feature')) {
            // Render as features grid with dynamic icons
            const featuresHtml = items.map(item => {
                // Determine icon based on title or use default
                const iconClass = this.getFeatureIcon(item.title, item.tag);
                
                return `
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="feature-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            ${item.tag ? `<span class="feature-tag">${item.tag}</span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            return `<div class="features-grid">${featuresHtml}</div>`;
        } else if (section.title.toLowerCase().includes('challenge') || section.title.toLowerCase().includes('solution')) {
            // Render as challenges/solutions list
            const challengesHtml = items.map(item => `
                <div class="challenge-item">
                    <div class="challenge-header">
                        <div class="challenge-title-wrapper">
                            <div class="challenge-icon">
                                <i class="${this.getChallengeIcon(item.title, item.tag)}"></i>
                            </div>
                            <h3>${item.title}</h3>
                        </div>
                        ${item.tag ? `<span class="challenge-tag ${this.getTagClass(item.tag)}">${item.tag}</span>` : ''}
                    </div>
                    <p>${item.description}</p>
                </div>
            `).join('');
            
            return `<div class="challenges-list">${challengesHtml}</div>`;
        } else if (section.title.toLowerCase().includes('step') || section.title.toLowerCase().includes('process')) {
            // Render as process steps
            const stepsHtml = items.map((item, index) => `
                <div class="process-step">
                    <div class="step-number">
                        <span>${index + 1}</span>
                    </div>
                    <div class="step-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        ${item.tag ? `<span class="step-tag">${item.tag}</span>` : ''}
                    </div>
                </div>
            `).join('');
            
            return `<div class="process-steps">${stepsHtml}</div>`;
        } else if (section.title.toLowerCase().includes('benefit') || section.title.toLowerCase().includes('advantage')) {
            // Render as benefits list
            const benefitsHtml = items.map(item => `
                <div class="benefit-item">
                    <div class="benefit-icon">
                        <i class="${this.getBenefitIcon(item.title, item.tag)}"></i>
                    </div>
                    <div class="benefit-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        ${item.tag ? `<span class="benefit-tag">${item.tag}</span>` : ''}
                    </div>
                </div>
            `).join('');
            
            return `<div class="benefits-list">${benefitsHtml}</div>`;
        } else {
            // Default list rendering with icons
            const listHtml = items.map(item => `
                <div class="list-item">
                    <div class="list-item-header">
                        <div class="list-icon">
                            <i class="${this.getDefaultIcon(item.title, item.tag)}"></i>
                        </div>
                        <h3>${item.title}</h3>
                        ${item.tag ? `<span class="list-tag">${item.tag}</span>` : ''}
                    </div>
                    <p>${item.description}</p>
                </div>
            `).join('');
            
            return `<div class="custom-list">${listHtml}</div>`;
        }
    }
    
    // Helper methods for determining icons based on content
    getFeatureIcon(title, tag) {
        const titleLower = title.toLowerCase();
        const tagLower = tag ? tag.toLowerCase() : '';
        
        // Icon mapping based on keywords
        if (titleLower.includes('dashboard') || titleLower.includes('visualization')) return 'fas fa-chart-bar';
        if (titleLower.includes('analytics') || titleLower.includes('analysis')) return 'fas fa-chart-line';
        if (titleLower.includes('real-time') || titleLower.includes('live')) return 'fas fa-bolt';
        if (titleLower.includes('security') || titleLower.includes('secure')) return 'fas fa-shield-alt';
        if (titleLower.includes('performance') || titleLower.includes('speed')) return 'fas fa-tachometer-alt';
        if (titleLower.includes('user') || titleLower.includes('interface')) return 'fas fa-users';
        if (titleLower.includes('mobile') || titleLower.includes('responsive')) return 'fas fa-mobile-alt';
        if (titleLower.includes('api') || titleLower.includes('integration')) return 'fas fa-plug';
        if (titleLower.includes('database') || titleLower.includes('data')) return 'fas fa-database';
        if (titleLower.includes('cloud') || titleLower.includes('server')) return 'fas fa-cloud';
        if (titleLower.includes('automation') || titleLower.includes('auto')) return 'fas fa-robot';
        if (titleLower.includes('notification') || titleLower.includes('alert')) return 'fas fa-bell';
        if (titleLower.includes('search') || titleLower.includes('filter')) return 'fas fa-search';
        if (titleLower.includes('export') || titleLower.includes('download')) return 'fas fa-download';
        if (titleLower.includes('report') || titleLower.includes('reporting')) return 'fas fa-file-alt';
        
        // Tag-based icons
        if (tagLower.includes('technical')) return 'fas fa-cogs';
        if (tagLower.includes('business')) return 'fas fa-briefcase';
        if (tagLower.includes('ui/ux')) return 'fas fa-paint-brush';
        if (tagLower.includes('performance')) return 'fas fa-rocket';
        
        return 'fas fa-check-circle'; // Default feature icon
    }
    
    getChallengeIcon(title, tag) {
        const titleLower = title.toLowerCase();
        const tagLower = tag ? tag.toLowerCase() : '';
        
        if (titleLower.includes('integration') || titleLower.includes('connect')) return 'fas fa-link';
        if (titleLower.includes('performance') || titleLower.includes('optimization')) return 'fas fa-tachometer-alt';
        if (titleLower.includes('security') || titleLower.includes('secure')) return 'fas fa-lock';
        if (titleLower.includes('scalability') || titleLower.includes('scale')) return 'fas fa-expand-arrows-alt';
        if (titleLower.includes('user') || titleLower.includes('adoption')) return 'fas fa-user-friends';
        if (titleLower.includes('data') || titleLower.includes('database')) return 'fas fa-database';
        if (titleLower.includes('time') || titleLower.includes('deadline')) return 'fas fa-clock';
        if (titleLower.includes('budget') || titleLower.includes('cost')) return 'fas fa-dollar-sign';
        if (titleLower.includes('technical') || titleLower.includes('technology')) return 'fas fa-cogs';
        if (titleLower.includes('communication') || titleLower.includes('team')) return 'fas fa-comments';
        
        // Tag-based icons
        if (tagLower.includes('technical')) return 'fas fa-wrench';
        if (tagLower.includes('business')) return 'fas fa-chart-line';
        if (tagLower.includes('performance')) return 'fas fa-gauge-high';
        if (tagLower.includes('security')) return 'fas fa-shield-halved';
        
        return 'fas fa-exclamation-triangle'; // Default challenge icon
    }
    
    getBenefitIcon(title, tag) {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('efficiency') || titleLower.includes('productive')) return 'fas fa-rocket';
        if (titleLower.includes('cost') || titleLower.includes('save')) return 'fas fa-piggy-bank';
        if (titleLower.includes('time') || titleLower.includes('faster')) return 'fas fa-clock';
        if (titleLower.includes('quality') || titleLower.includes('improve')) return 'fas fa-star';
        if (titleLower.includes('user') || titleLower.includes('experience')) return 'fas fa-smile';
        if (titleLower.includes('insight') || titleLower.includes('analytics')) return 'fas fa-lightbulb';
        if (titleLower.includes('automation') || titleLower.includes('auto')) return 'fas fa-magic';
        if (titleLower.includes('scalability') || titleLower.includes('growth')) return 'fas fa-chart-line';
        
        return 'fas fa-thumbs-up'; // Default benefit icon
    }
    
    getDefaultIcon(title, tag) {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('requirement') || titleLower.includes('spec')) return 'fas fa-list-check';
        if (titleLower.includes('design') || titleLower.includes('ui')) return 'fas fa-paint-brush';
        if (titleLower.includes('development') || titleLower.includes('code')) return 'fas fa-code';
        if (titleLower.includes('test') || titleLower.includes('quality')) return 'fas fa-vial';
        if (titleLower.includes('deploy') || titleLower.includes('launch')) return 'fas fa-rocket';
        if (titleLower.includes('maintenance') || titleLower.includes('support')) return 'fas fa-tools';
        
        return 'fas fa-circle-dot'; // Default icon
    }
    
    getTagClass(tag) {
        if (!tag) return '';
        
        const tagLower = tag.toLowerCase();
        if (tagLower.includes('technical')) return 'tag-technical';
        if (tagLower.includes('business')) return 'tag-business';
        if (tagLower.includes('performance')) return 'tag-performance';
        if (tagLower.includes('security')) return 'tag-security';
        if (tagLower.includes('ui/ux')) return 'tag-design';
        if (tagLower.includes('critical')) return 'tag-critical';
        if (tagLower.includes('high')) return 'tag-high';
        if (tagLower.includes('medium')) return 'tag-medium';
        if (tagLower.includes('low')) return 'tag-low';
        
        return 'tag-default';
    }
    
    createGallerySection(section) {
        const items = section.items.sort((a, b) => a.order - b.order);
        const galleryHtml = items.map(item => `
            <div class="gallery-item">
                <img src="${item.image_url}" alt="${item.title}">
                <div class="gallery-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `).join('');
        
        return `<div class="gallery-grid">${galleryHtml}</div>`;
    }
    
    createMixedSection(section) {
        const items = section.items.sort((a, b) => a.order - b.order);
        
        // Determine layout based on content
        const hasImages = items.some(item => item.image_url);
        const layoutClass = hasImages ? 'mixed-content-with-images' : 'mixed-content-text-only';
        
        const mixedHtml = items.map((item, index) => {
            if (item.image_url) {
                return `
                    <div class="mixed-item with-image" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="mixed-image">
                            <img src="${item.image_url}" alt="${item.title}" loading="lazy">
                            <div class="image-overlay">
                                <i class="fas fa-expand"></i>
                            </div>
                        </div>
                        <div class="mixed-content-text">
                            <div class="mixed-header">
                                <h3>${item.title}</h3>
                                ${item.tag ? `<span class="mixed-tag ${this.getTagClass(item.tag)}">${item.tag}</span>` : ''}
                            </div>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="mixed-item text-only" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="mixed-icon">
                            <i class="${this.getMixedIcon(item.title, item.tag)}"></i>
                        </div>
                        <div class="mixed-content-text">
                            <div class="mixed-header">
                                <h3>${item.title}</h3>
                                ${item.tag ? `<span class="mixed-tag ${this.getTagClass(item.tag)}">${item.tag}</span>` : ''}
                            </div>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;
            }
        }).join('');
        
        return `<div class="mixed-content ${layoutClass}">${mixedHtml}</div>`;
    }
    
    getMixedIcon(title, tag) {
        const titleLower = title.toLowerCase();
        const tagLower = tag ? tag.toLowerCase() : '';
        
        // Context-specific icons
        if (titleLower.includes('overview') || titleLower.includes('summary')) return 'fas fa-eye';
        if (titleLower.includes('goal') || titleLower.includes('objective')) return 'fas fa-bullseye';
        if (titleLower.includes('result') || titleLower.includes('outcome')) return 'fas fa-trophy';
        if (titleLower.includes('lesson') || titleLower.includes('learning')) return 'fas fa-graduation-cap';
        if (titleLower.includes('recommendation') || titleLower.includes('suggest')) return 'fas fa-lightbulb';
        if (titleLower.includes('conclusion') || titleLower.includes('summary')) return 'fas fa-flag-checkered';
        if (titleLower.includes('methodology') || titleLower.includes('approach')) return 'fas fa-route';
        if (titleLower.includes('tool') || titleLower.includes('technology')) return 'fas fa-tools';
        if (titleLower.includes('team') || titleLower.includes('collaboration')) return 'fas fa-users';
        if (titleLower.includes('timeline') || titleLower.includes('schedule')) return 'fas fa-calendar-alt';
        
        // Tag-based fallback
        if (tagLower.includes('important')) return 'fas fa-star';
        if (tagLower.includes('note')) return 'fas fa-sticky-note';
        if (tagLower.includes('warning')) return 'fas fa-exclamation-triangle';
        if (tagLower.includes('tip')) return 'fas fa-lightbulb';
        
        return 'fas fa-info-circle'; // Default mixed icon
    }
    
    initializeGalleryModal() {
        // Remove existing event listeners
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalImageContainer = document.getElementById('modal-image-container');
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalPrev = document.getElementById('modal-prev');
        const modalNext = document.getElementById('modal-next');
        
        // Zoom controls
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const zoomResetBtn = document.getElementById('zoom-reset');
        
        // Info toggle and overlay
        const infoToggleBtn = document.getElementById('modal-info-toggle');
        const infoOverlay = document.getElementById('modal-image-info-overlay');
        const infoHint = document.getElementById('modal-info-hint');
        const overlayTitle = document.getElementById('overlay-image-title');
        const overlayDescription = document.getElementById('overlay-image-description');
        const overlayOrder = document.getElementById('overlay-image-order');
        
        if (!modal) {
            console.error('ProjectDetailManager: Modal not found in DOM');
            return;
        }
        
        let currentImageIndex = 0;
        const images = this.cleanedGalleryImages || [];
        
        // Zoom and pan variables
        let currentZoom = 1;
        let minZoom = 1;
        let maxZoom = 3;
        let isPanning = false;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;
        let infoOverlayVisible = false;
        let hintShown = false;
        
        console.log('ProjectDetailManager: Initializing gallery modal with', images.length, 'images');
        console.log('ProjectDetailManager: Gallery images data:', images);
        
        // Debug: Check each image data
        images.forEach((image, index) => {
            console.log(`ProjectDetailManager: Image ${index + 1} data:`, {
                title: image.title,
                description: image.description,
                image_url: image.image_url,
                order: image.order
            });
        });
        
        // Open modal
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentImageIndex = index;
                console.log('ProjectDetailManager: Opening modal for image index:', index);
                console.log('ProjectDetailManager: Selected image data:', images[index]);
                showModal();
                updateModalImage();
            });
        });
        
        // Close modal
        if (modalClose) modalClose.addEventListener('click', hideModal);
        if (modalOverlay) modalOverlay.addEventListener('click', hideModal);
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                hideModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigatePrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateNext();
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                resetZoom();
            } else if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                toggleInfoOverlay();
            }
        });
        
        // Navigation
        if (modalPrev) {
            modalPrev.addEventListener('click', navigatePrev);
        }
        
        if (modalNext) {
            modalNext.addEventListener('click', navigateNext);
        }
        
        // Zoom controls
        if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
        if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);
        
        // Info toggle
        if (infoToggleBtn) infoToggleBtn.addEventListener('click', toggleInfoOverlay);
        
        // Mouse wheel zoom
        if (modalImageContainer) {
            modalImageContainer.addEventListener('wheel', function(e) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                zoom(currentZoom + delta, e.clientX, e.clientY);
            });
        }
        
        // Pan functionality
        if (modalImage) {
            modalImage.addEventListener('mousedown', startPan);
            modalImage.addEventListener('mousemove', doPan);
            modalImage.addEventListener('mouseup', endPan);
            modalImage.addEventListener('mouseleave', endPan);
            
            // Touch events for mobile
            modalImage.addEventListener('touchstart', startPanTouch);
            modalImage.addEventListener('touchmove', doPanTouch);
            modalImage.addEventListener('touchend', endPan);
        }
        
        function navigatePrev() {
            if (images.length <= 1) return;
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateModalImage();
        }
        
        function navigateNext() {
            if (images.length <= 1) return;
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateModalImage();
        }
        
        function showModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetZoom();
            hintShown = false;
            infoOverlayVisible = false;
            if (infoOverlay) infoOverlay.classList.remove('visible');
            if (infoToggleBtn) infoToggleBtn.classList.remove('active');
            console.log('ProjectDetailManager: Gallery modal opened');
        }
        
        function hideModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            resetZoom();
            infoOverlayVisible = false;
            hintShown = false;
            if (infoOverlay) infoOverlay.classList.remove('visible');
            if (infoToggleBtn) {
                infoToggleBtn.classList.remove('active', 'hint');
            }
            if (infoHint) infoHint.classList.remove('visible');
            console.log('ProjectDetailManager: Gallery modal closed');
        }
        
        function showInfoHint() {
            if (hintShown || !infoToggleBtn || !infoHint) return;
            
            // Check if current image has title or description
            const currentImage = images[currentImageIndex];
            const hasContent = (currentImage.title && currentImage.title.trim() !== '') || 
                             (currentImage.description && currentImage.description.trim() !== '');
            
            if (!hasContent) return; // Don't show hint if no content to display
            
            hintShown = true;
            
            // Show hint animation on toggle button
            infoToggleBtn.classList.add('hint');
            
            // Show tooltip
            infoHint.classList.add('visible');
            
            // Hide hint after 3 seconds
            setTimeout(() => {
                if (infoToggleBtn) infoToggleBtn.classList.remove('hint');
                if (infoHint) infoHint.classList.remove('visible');
            }, 3000);
        }
        
        function zoomIn() {
            zoom(Math.min(currentZoom + 0.25, maxZoom));
        }
        
        function zoomOut() {
            zoom(Math.max(currentZoom - 0.25, minZoom));
        }
        
        function resetZoom() {
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
            updateZoomControls();
            updateCursor();
        }
        
        function zoom(newZoom, clientX, clientY) {
            const oldZoom = currentZoom;
            currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
            
            if (clientX && clientY && modalImageContainer) {
                const rect = modalImageContainer.getBoundingClientRect();
                const x = clientX - rect.left - rect.width / 2;
                const y = clientY - rect.top - rect.height / 2;
                
                translateX = translateX - x * (currentZoom - oldZoom) / oldZoom;
                translateY = translateY - y * (currentZoom - oldZoom) / oldZoom;
            }
            
            updateImageTransform();
            updateZoomControls();
            updateCursor();
        }
        
        function updateImageTransform() {
            if (modalImage) {
                modalImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
            }
        }
        
        function updateZoomControls() {
            if (zoomInBtn) zoomInBtn.disabled = currentZoom >= maxZoom;
            if (zoomOutBtn) zoomOutBtn.disabled = currentZoom <= minZoom;
            if (zoomResetBtn) zoomResetBtn.disabled = currentZoom === 1 && translateX === 0 && translateY === 0;
        }
        
        function updateCursor() {
            if (!modalImageContainer) return;
            
            modalImageContainer.classList.remove('zoomable', 'zoomed', 'panning');
            
            if (currentZoom === minZoom) {
                modalImageContainer.classList.add('zoomable');
            } else {
                modalImageContainer.classList.add('zoomed');
            }
        }
        
        function startPan(e) {
            if (currentZoom <= minZoom) return;
            
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImageContainer.classList.add('panning');
            e.preventDefault();
        }
        
        function doPan(e) {
            if (!isPanning) return;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
            e.preventDefault();
        }
        
        function endPan() {
            isPanning = false;
            if (modalImageContainer) {
                modalImageContainer.classList.remove('panning');
            }
        }
        
        function startPanTouch(e) {
            if (currentZoom <= minZoom || e.touches.length !== 1) return;
            
            isPanning = true;
            const touch = e.touches[0];
            startX = touch.clientX - translateX;
            startY = touch.clientY - translateY;
            modalImageContainer.classList.add('panning');
            e.preventDefault();
        }
        
        function doPanTouch(e) {
            if (!isPanning || e.touches.length !== 1) return;
            
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            updateImageTransform();
            e.preventDefault();
        }
        
        function toggleInfoOverlay() {
            infoOverlayVisible = !infoOverlayVisible;
            
            if (infoOverlay) {
                if (infoOverlayVisible) {
                    infoOverlay.classList.add('visible');
                } else {
                    infoOverlay.classList.remove('visible');
                }
            }
            
            if (infoToggleBtn) {
                if (infoOverlayVisible) {
                    infoToggleBtn.classList.add('active');
                } else {
                    infoToggleBtn.classList.remove('active');
                }
            }
            
            // Hide hint when user interacts with toggle
            if (infoHint) infoHint.classList.remove('visible');
            if (infoToggleBtn) infoToggleBtn.classList.remove('hint');
        }
        
        function updateModalImage() {
            if (!images[currentImageIndex]) {
                console.error('ProjectDetailManager: No image data for index:', currentImageIndex);
                return;
            }
            
            const currentImage = images[currentImageIndex];
            console.log('ProjectDetailManager: Updating modal with image:', currentImage);
            console.log('ProjectDetailManager: Image title:', currentImage.title);
            console.log('ProjectDetailManager: Image description:', currentImage.description);
            
            // Reset zoom and pan
            resetZoom();
            
            // Reset info overlay state
            infoOverlayVisible = false;
            if (infoOverlay) infoOverlay.classList.remove('visible');
            if (infoToggleBtn) infoToggleBtn.classList.remove('active');
            
            // Add loading state
            if (modalImageContainer) {
                modalImageContainer.classList.add('loading');
            }
            
            // Update image
            if (modalImage) {
                modalImage.style.opacity = '0.5';
                modalImage.src = currentImage.image_url;
                modalImage.alt = currentImage.title || 'Project Gallery Image';
                console.log('ProjectDetailManager: Updated modal image src to:', currentImage.image_url);
                
                modalImage.onload = function() {
                    modalImage.style.opacity = '1';
                    if (modalImageContainer) {
                        modalImageContainer.classList.remove('loading');
                    }
                    updateCursor();
                    
                    // Show hint after image loads (with delay)
                    setTimeout(() => {
                        showInfoHint();
                    }, 1000);
                    
                    console.log('ProjectDetailManager: Modal image loaded successfully');
                };
                
                modalImage.onerror = function() {
                    console.error('ProjectDetailManager: Failed to load modal image:', currentImage.image_url);
                    modalImage.style.opacity = '1';
                    modalImage.alt = 'Failed to load image';
                    if (modalImageContainer) {
                        modalImageContainer.classList.remove('loading');
                    }
                };
            }
            
            // Update overlay content
            if (overlayTitle) {
                const title = currentImage.title;
                if (title && title.trim() !== '') {
                    overlayTitle.textContent = title.trim();
                    overlayTitle.style.display = 'block';
                } else {
                    overlayTitle.style.display = 'none';
                }
            }
            
            if (overlayDescription) {
                const description = currentImage.description;
                if (description && description.trim() !== '') {
                    overlayDescription.textContent = description.trim();
                    overlayDescription.style.display = 'block';
                } else {
                    overlayDescription.style.display = 'none';
                }
            }
            
            // Update order info
            const orderText = `${currentImageIndex + 1} of ${images.length}`;
            
            if (overlayOrder) {
                overlayOrder.textContent = orderText;
            }
            
            // Update navigation buttons state
            if (modalPrev) {
                modalPrev.disabled = images.length <= 1;
                modalPrev.style.display = images.length <= 1 ? 'none' : 'flex';
            }
            
            if (modalNext) {
                modalNext.disabled = images.length <= 1;
                modalNext.style.display = images.length <= 1 ? 'none' : 'flex';
            }
            
            // Update zoom controls
            updateZoomControls();
        }
    }
    
    initializeInteractivity() {
        // Initialize existing project detail functionality
        this.initShareButton();
        this.initBackButton();
        this.initContactLinks();
        this.initSmoothScrolling();
        this.initAnimations();
        
        if (typeof initNavbar === 'function') initNavbar();
        if (typeof initPlayButton === 'function') initPlayButton();
    }
    
    initShareButton() {
        const shareBtn = document.getElementById('share-btn');
        if (!shareBtn) return;
        
        shareBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.shareProject();
        });
    }
    
    initBackButton() {
        const backBtns = document.querySelectorAll('.btn-back, .brand-link');
        backBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateBack();
            });
        });
    }
    
    initContactLinks() {
        // Handle contact CTA links
        const contactLinks = document.querySelectorAll('.btn-contact, a[href="#contact"]');
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToContact();
            });
        });
    }
    
    async shareProject() {
        if (!this.projectData) return;
        
        const shareData = {
            title: this.projectData.title,
            text: this.projectData.description,
            url: window.location.href
        };
        
        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('ProjectDetailManager: Project shared successfully via Web Share API');
            } else {
                // Fallback to clipboard
                await this.copyToClipboard(shareData.url);
                this.showShareNotification('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('ProjectDetailManager: Error sharing project:', error);
            // Fallback to clipboard if share fails
            try {
                await this.copyToClipboard(shareData.url);
                this.showShareNotification('Link copied to clipboard!');
            } catch (clipboardError) {
                console.error('ProjectDetailManager: Clipboard error:', clipboardError);
                this.showShareNotification('Unable to share. Please copy the URL manually.', 'error');
            }
        }
    }
    
    async copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }
    
    showShareNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.share-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `share-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    navigateBack() {
        // Check if user came from portfolio page
        const referrer = document.referrer;
        const isFromPortfolio = referrer.includes('/portfolio') || referrer.includes('/portofolio');
        
        if (isFromPortfolio && window.history.length > 1) {
            // Go back to previous page
            window.history.back();
        } else {
            // Navigate to portfolio page
            window.location.href = '/portfolio';
        }
    }
    
    navigateToContact() {
        // Navigate to main page contact section
        window.location.href = '/#contact';
    }
    
    initSmoothScrolling() {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    initAnimations() {
        // Add scroll animations if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
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
            
            // Observe elements for animation
            document.querySelectorAll('.content-section, .project-card, .feature-item').forEach(el => {
                observer.observe(el);
            });
        }
    }
    
    showError(message) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Error Loading Project</h2>
                    <p>${message}</p>
                    <div class="error-actions">
                        <a href="/portfolio" class="btn-primary">
                            <i class="fas fa-arrow-left"></i>
                            Back to Portfolio
                        </a>
                        <button onclick="window.location.reload()" class="btn-secondary">
                            <i class="fas fa-redo"></i>
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    async loadRelatedProjects() {
        try {
            console.log('ProjectDetailManager: Loading related projects...');
            console.log('ProjectDetailManager: Current project ID:', this.projectId);
            
            // Load all projects first, then filter out current project
            const response = await fetch(`${this.apiBaseUrl}?limit=10`);
            
            if (response.ok) {
                const result = await response.json();
                const allProjects = result.data || [];
                
                // Filter out current project and limit to 3
                const relatedProjects = allProjects
                    .filter(project => project.id.toString() !== this.projectId.toString())
                    .slice(0, 3);
                
                console.log('ProjectDetailManager: All projects count:', allProjects.length);
                console.log('ProjectDetailManager: Related projects after filtering:', relatedProjects.length);
                console.log('ProjectDetailManager: Related projects:', relatedProjects.map(p => ({ id: p.id, title: p.title })));
                
                this.renderRelatedProjects(relatedProjects);
            } else {
                console.warn('ProjectDetailManager: Failed to load related projects, status:', response.status);
                this.hideRelatedProjects();
            }
        } catch (error) {
            console.error('ProjectDetailManager: Error loading related projects:', error);
            this.hideRelatedProjects();
        }
    }
    
    renderRelatedProjects(projects) {
        const relatedGrid = document.getElementById('related-projects-grid');
        if (!relatedGrid) return;
        
        if (!projects || projects.length === 0) {
            this.hideRelatedProjects();
            return;
        }
        
        relatedGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = this.createRelatedProjectCard(project);
            relatedGrid.appendChild(projectCard);
        });
        
        console.log('ProjectDetailManager: Rendered', projects.length, 'related projects');
    }
    
    createRelatedProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category.toLowerCase().replace(' ', '-'));
        
        const categoryIcon = this.getCategoryIcon(project.category);
        const techTags = this.getTechnologyTags(project.technology_stacks);
        const description = project.description.length > 100 
            ? project.description.substring(0, 100) + '...'
            : project.description;
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${project.image_url}" alt="${project.title}" loading="lazy">
                <div class="card-overlay">
                    <div class="overlay-content">
                        <button class="btn-view" onclick="viewRelatedProject(${project.id})">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="card-category">
                    <i class="${categoryIcon}"></i>
                    ${project.category}
                </div>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${description}</p>
                <div class="card-tech">
                    ${techTags}
                </div>
            </div>
        `;
        
        return card;
    }
    
    getCategoryIcon(category) {
        const iconMap = {
            'Development': 'fas fa-code',
            'Data Analytics': 'fas fa-chart-line',
            'Data Engineer': 'fas fa-database'
        };
        return iconMap[category] || 'fas fa-project-diagram';
    }
    
    getTechnologyTags(technologyStacks) {
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
        
        const limitedTechs = allTechs.slice(0, 3);
        
        return limitedTechs.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }
    
    hideRelatedProjects() {
        const relatedSection = document.querySelector('.related-projects');
        if (relatedSection) {
            relatedSection.style.display = 'none';
        }
    }
    
    // Test function to verify modal functionality
    testModalWithSampleData() {
        console.log('ProjectDetailManager: Testing modal with sample data');
        
        // Sample gallery data for testing
        const sampleGallery = [
            {
                image_url: '/uploads/portfolio/sample1.jpg',
                title: 'Sample Image 1',
                description: 'This is a sample description for the first image. It contains some text to test the scrolling functionality.',
                order: 1
            },
            {
                image_url: '/uploads/portfolio/sample2.jpg',
                title: '',
                description: 'This image has no title but has a description.',
                order: 2
            },
            {
                image_url: '/uploads/portfolio/sample3.jpg',
                title: 'Image with Title Only',
                description: '',
                order: 3
            },
            {
                image_url: '/uploads/portfolio/sample4.jpg',
                title: '',
                description: '',
                order: 4
            }
        ];
        
        // Temporarily set sample data
        this.projectData = this.projectData || {};
        this.projectData.project_gallery = sampleGallery;
        
        console.log('ProjectDetailManager: Sample data set, rendering gallery...');
        this.renderGallery();
    }
}