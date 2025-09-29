// Main JavaScript functionality for the Port Information Website

// Initialize Lucide icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollEffects();
    initImageFallback();
    initButtonAnimations();
    initTabSwitching();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');

    if (!mobileMenuBtn || !mobileNav) return;

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileNav.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking on mobile links
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileNav.classList.add('open');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('open');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects (Header background, active navigation)
function initScrollEffects() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

    if (!header) return;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.style.background = 'rgba(10, 14, 26, 0.98)';
            header.style.backdropFilter = 'blur(12px)';
        } else {
            header.style.background = 'rgba(10, 14, 26, 0.95)';
            header.style.backdropFilter = 'blur(8px)';
        }
    }

    function updateActiveNavigation() {
        const scrollY = window.scrollY;
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Throttle scroll events for better performance
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateHeader();
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateHeader();
    updateActiveNavigation();
}

// Image Fallback Functionality
function initImageFallback() {
    const images = document.querySelectorAll('img[data-fallback], .hero-image');
    
    const fallbackSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=`;
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create fallback container
            const fallbackContainer = document.createElement('div');
            fallbackContainer.className = 'image-fallback';
            fallbackContainer.style.cssText = `
                display: inline-block;
                background-color: #1e2a42;
                text-align: center;
                align-items: center;
                justify-content: center;
                width: ${this.offsetWidth || 300}px;
                height: ${this.offsetHeight || 200}px;
                border-radius: 0.625rem;
            `;
            
            const fallbackImg = document.createElement('img');
            fallbackImg.src = fallbackSvg;
            fallbackImg.alt = 'Failed to load image';
            fallbackImg.style.cssText = 'width: 88px; height: 88px; opacity: 0.6;';
            
            fallbackContainer.appendChild(fallbackImg);
            
            // Replace original image with fallback
            this.parentNode.replaceChild(fallbackContainer, this);
        });
    });
}

// Button Animations and Effects
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            // Ensure button has relative positioning for ripple
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Arrow icon animation on hover for buttons with arrows
        const arrowIcon = button.querySelector('[data-lucide="arrow-right"]');
        if (arrowIcon) {
            button.addEventListener('mouseenter', function() {
                arrowIcon.style.transform = 'translateX(4px)';
                arrowIcon.style.transition = 'transform 0.3s ease';
            });
            
            button.addEventListener('mouseleave', function() {
                arrowIcon.style.transform = 'translateX(0)';
            });
        }
    });
}

// Tab Switching Functionality for Marketplace
function initTabSwitching() {
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabTriggers.length || !tabContents.length) return;
    
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all triggers and contents
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked trigger
            this.classList.add('active');
            
            // Show corresponding tab content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add smooth transition effect
            targetContent.style.opacity = '0';
            targetContent.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
                targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 50);
        });
    });
}

// Intersection Observer for animations (optional enhancement)
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .section-title, .section-description');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add ripple animation keyframes to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .nav-link.active,
    .nav-link-mobile.active {
        color: var(--secondary) !important;
        filter: drop-shadow(0 0 8px rgba(255, 149, 0, 0.6));
    }
    
    .image-fallback {
        display: flex !important;
    }
`;
document.head.appendChild(style);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initSmoothScrolling,
        initScrollEffects,
        initImageFallback,
        initButtonAnimations,
        initScrollAnimations,
        initTabSwitching
    };
}