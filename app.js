// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initScrollProgress();
    initScrollAnimations();
    initNavigation();
    initTestimonialsCarousel();
    initFAQ();
    initPricingToggle();
    initModal();
    initContactForm();
    initBackToTop();
    initSmoothScrolling();

    // Scroll Progress Bar
    function initScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Scroll Animations with Intersection Observer
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.animate-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach((element) => {
            observer.observe(element);
        });
    }

    // Navigation
    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile nav when clicking on links
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Navbar background on scroll
        const navbar = document.querySelector('.nav-container');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.1)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            }
        });
    }

    // Testimonials Carousel
    function initTestimonialsCarousel() {
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('carousel-dots');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (!track) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const cardCount = cards.length;
        let currentIndex = 0;
        let autoplayInterval;

        // Create dots
        for (let i = 0; i < cardCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth + 24; // Include gap
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
            resetAutoplay();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cardCount;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cardCount) % cardCount;
            updateCarousel();
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(autoplayInterval);
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            startAutoplay();
        });

        // Start autoplay
        startAutoplay();

        // Pause autoplay on hover
        track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        track.addEventListener('mouseleave', startAutoplay);

        // Handle resize
        window.addEventListener('resize', updateCarousel);
    }

    // FAQ Accordion
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        });
    }

    // Pricing Toggle (Monthly/Yearly)
    function initPricingToggle() {
        const toggle = document.getElementById('billing-toggle');
        const priceAmounts = document.querySelectorAll('.price-amount');
        
        if (!toggle) return;

        toggle.addEventListener('change', () => {
            const isYearly = toggle.checked;
            
            priceAmounts.forEach(amount => {
                const monthlyPrice = amount.getAttribute('data-monthly');
                const yearlyPrice = amount.getAttribute('data-yearly');
                
                if (monthlyPrice && yearlyPrice) {
                    if (isYearly) {
                        amount.textContent = `$${yearlyPrice}`;
                        // Add subtle animation
                        amount.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            amount.style.transform = 'scale(1)';
                        }, 200);
                    } else {
                        amount.textContent = `$${monthlyPrice}`;
                        amount.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            amount.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
            });
        });
    }

    // Modal Functionality
    function initModal() {
        const modal = document.getElementById('demo-modal');
        const watchDemoBtn = document.getElementById('watch-demo');
        const closeBtn = document.getElementById('modal-close');
        const overlay = modal?.querySelector('.modal-overlay');
        
        if (!modal) return;

        function openModal() {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Add animation
            setTimeout(() => {
                modal.querySelector('.modal-content').style.transform = 'scale(1)';
                modal.querySelector('.modal-content').style.opacity = '1';
            }, 10);
        }

        function closeModal() {
            modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            modal.querySelector('.modal-content').style.opacity = '0';
            
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 300);
        }

        // Event listeners
        watchDemoBtn?.addEventListener('click', openModal);
        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });

        // Initialize modal styles
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.opacity = '0';
            modalContent.style.transition = 'all 0.3s ease';
        }
    }

    // Contact Form
    function initContactForm() {
        const form = document.getElementById('contact-form');
        
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            // Simple email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            button.textContent = 'Starting Trial...';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNotification('🎉 Free trial started! Check your email for next steps.', 'success');
                form.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
    }

    // Back to Top Button
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.nav-container').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Utility Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? 'rgba(33, 128, 141, 0.95)' : 'rgba(192, 21, 47, 0.95)'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 350px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        // Close button event
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });

        function removeNotification(notif) {
            notif.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notif.parentNode) {
                    notif.parentNode.removeChild(notif);
                }
            }, 300);
        }
    }

    // CTA Button Handlers
    function initCTAButtons() {
        const ctaButtons = document.querySelectorAll('.btn--primary, .pricing-cta');
        
        ctaButtons.forEach(button => {
            if (button.textContent.includes('Start Free Trial')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification('🚀 Redirecting to sign up...', 'info');
                    
                    // Simulate redirect
                    setTimeout(() => {
                        showNotification('🎉 Welcome! Your free trial is ready to start.', 'success');
                    }, 1500);
                });
            } else if (button.textContent.includes('Contact Sales')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification('📧 Redirecting to contact form...', 'info');
                });
            }
        });
    }

    // Initialize CTA buttons
    initCTAButtons();

    // Parallax Effect for Hero Section
    function initParallax() {
        const hero = document.querySelector('.hero');
        const floatingCards = document.querySelectorAll('.floating-card');
        
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            hero.style.transform = `translateY(${rate}px)`;
            
            // Animate floating cards
            floatingCards.forEach((card, index) => {
                const speed = 0.2 + (index * 0.1);
                card.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
            });
        });
    }

    // Initialize parallax
    initParallax();

    // Typing Effect for Hero Title (Optional Enhancement)
    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        const gradientText = heroTitle.querySelector('.gradient-text');
        
        if (gradientText) {
            const gradientContent = gradientText.textContent;
            const beforeGradient = text.split(gradientContent)[0];
            
            // Reset content
            heroTitle.innerHTML = beforeGradient + '<span class="gradient-text"></span>';
            const newGradientSpan = heroTitle.querySelector('.gradient-text');
            
            let index = 0;
            function typeGradientText() {
                if (index < gradientContent.length) {
                    newGradientSpan.textContent += gradientContent.charAt(index);
                    index++;
                    setTimeout(typeGradientText, 100);
                }
            }
            
            // Start typing after a delay
            setTimeout(typeGradientText, 1000);
        }
    }

    // Add loading animation
    function initLoadingAnimation() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    }

    // Initialize loading animation
    initLoadingAnimation();

    // Performance optimization: Debounce scroll events
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

    // Apply debouncing to scroll-heavy functions
    const debouncedScrollHandler = debounce(() => {
        // Any heavy scroll operations can go here
    }, 16); // ~60fps

    window.addEventListener('scroll', debouncedScrollHandler);

    // Add intersection observer for performance optimization
    function initLazyLoading() {
        const images = document.querySelectorAll('img[src*="placeholder"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // In a real app, you would load the actual image here
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.style.opacity = '0.5';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }

    // Initialize lazy loading
    initLazyLoading();

    // Add keyboard navigation support
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Allow keyboard navigation for testimonials
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const carousel = document.querySelector('.testimonials-carousel');
                if (carousel && document.activeElement.closest('.testimonials-carousel')) {
                    e.preventDefault();
                    const buttons = carousel.querySelectorAll('.carousel-btn');
                    if (e.key === 'ArrowLeft') {
                        buttons[0]?.click(); // Previous
                    } else {
                        buttons[1]?.click(); // Next
                    }
                }
            }
        });
    }

    // Initialize keyboard navigation
    initKeyboardNavigation();

    console.log('🚀 ADmyBRAND AI Suite loaded successfully!');
});