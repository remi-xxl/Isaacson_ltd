/* ============================================
   ISAACSON NIGERIA LIMITED - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Header Scroll Effect ----
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header shadow on scroll
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on section
        updateActiveNav();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ---- Active Navigation Link ----
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.main-nav ul li a');
        const scrollPos = window.scrollY + 150;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- Mobile Menu Toggle ----
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.main-nav ul li a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function (e) {
        if (mainNav.classList.contains('active') &&
            !mainNav.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ---- Hero Slider ----
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        heroSlides.forEach(function (slide) {
            slide.classList.remove('active');
        });
        sliderDots.forEach(function (dot) {
            dot.classList.remove('active');
        });

        heroSlides[index].classList.add('active');
        sliderDots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % heroSlides.length;
        goToSlide(next);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    sliderDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            stopSlider();
            goToSlide(parseInt(this.getAttribute('data-slide')));
            startSlider();
        });
    });

    startSlider();

    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        counters.forEach(function (counter) {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    counter.dataset.animated = 'true';
                }
            }

            updateCounter();
        });
    }

    // Intersection Observer for counter animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    // ---- Scroll Animations ----
    const animateElements = document.querySelectorAll(
        '.service-card, .why-card, .testimonial-card, .contact-card, .about-grid, .director-card'
    );

    const animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(function (el, index) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease ' + (index % 3) * 0.1 + 's, transform 0.6s ease ' + (index % 3) * 0.1 + 's';
        animObserver.observe(el);
    });

    // ---- Contact Form Handling ----
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Build WhatsApp message
            let whatsappMessage = 'Hello Isaacson Nigeria Limited,\n\n';
            whatsappMessage += 'Name: ' + name + '\n';
            if (phone) whatsappMessage += 'Phone: ' + phone + '\n';
            if (service) whatsappMessage += 'Service Needed: ' + service + '\n';
            whatsappMessage += '\nMessage: ' + message;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = 'https://wa.me/2348037162417?text=' + encodedMessage;

            window.open(whatsappURL, '_blank');

            showNotification('Redirecting to WhatsApp...', 'success');
            contactForm.reset();
        });
    }

    // ---- Notification System ----
    function showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.innerHTML = '<div class="notification-content"><span>' + message + '</span><button class="notification-close">&times;</button></div>';

        document.body.appendChild(notification);

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            background: type === 'success' ? '#25D366' : '#e74c3c',
            color: '#fff',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.95rem',
            zIndex: '10000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease',
            maxWidth: '400px'
        });

        // Add animation keyframes
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
            document.head.appendChild(style);
        }

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.3rem',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1'
        });

        closeBtn.addEventListener('click', function () {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(function () {
                notification.remove();
            }, 300);
        });

        // Auto-remove after 5 seconds
        setTimeout(function () {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(function () {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Parallax Effect on Hero ----
    window.addEventListener('scroll', function () {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.scrollY;
            if (scrolled < hero.offsetHeight) {
                const slides = hero.querySelectorAll('.hero-slide');
                slides.forEach(function (slide) {
                    slide.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
                });
            }
        }
    });

    // ---- Form Input Focus Effects ----
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(function (input) {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    // ---- WhatsApp Float Animation on Load ----
    setTimeout(function () {
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            whatsappFloat.style.animation = 'bounceIn 0.6s ease';
            if (!document.getElementById('bounceStyle')) {
                const bounceStyle = document.createElement('style');
                bounceStyle.id = 'bounceStyle';
                bounceStyle.textContent = '@keyframes bounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}';
                document.head.appendChild(bounceStyle);
            }
        }
    }, 1500);

});
