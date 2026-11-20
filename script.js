/* ============================================
   GADDANGI JAMAN DORA - GJD_AI_World Portfolio Scripts
   ============================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ---- Stars Background (Canvas) ----
class StarsSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
            if (reducedMotion.matches) this.animate();
        });
        reducedMotion.addEventListener('change', () => {
            cancelAnimationFrame(this.frameId);
            this.animate();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.stars = [];
        const count = Math.min(300, Math.floor((this.canvas.width * this.canvas.height) / 5000));
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                baseOpacity: Math.random() * 0.6 + 0.2,
                // Some stars have color tints
                color: this.getStarColor()
            });
        }
    }

    getStarColor() {
        const colors = [
            { r: 255, g: 255, b: 255 },   // white
            { r: 255, g: 255, b: 255 },   // white (more common)
            { r: 255, g: 255, b: 255 },   // white (most common)
            { r: 200, g: 220, b: 255 },   // blue-white
            { r: 255, g: 230, b: 200 },   // warm white
            { r: 180, g: 200, b: 255 },   // blue
            { r: 255, g: 200, b: 180 },   // orange tint
            { r: 255, g: 180, b: 180 },   // red tint
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const time = Date.now() * 0.001;

        this.stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
            const opacity = star.baseOpacity + twinkle * 0.3;
            const size = star.size + twinkle * 0.3;

            // Star glow
            if (star.size > 1.2) {
                const gradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3);
                gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }

            // Star core
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, Math.max(0.3, size), 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${Math.max(0, opacity)})`;
            this.ctx.fill();

            // Cross sparkle on bright stars
            if (star.size > 1.5 && opacity > 0.5) {
                this.ctx.strokeStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity * 0.2})`;
                this.ctx.lineWidth = 0.5;
                const sparkleLen = size * 4;
                this.ctx.beginPath();
                this.ctx.moveTo(star.x - sparkleLen, star.y);
                this.ctx.lineTo(star.x + sparkleLen, star.y);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y - sparkleLen);
                this.ctx.lineTo(star.x, star.y + sparkleLen);
                this.ctx.stroke();
            }
        });

        if (!reducedMotion.matches) {
            this.frameId = requestAnimationFrame(() => this.animate());
        }
    }
}

// ---- Custom Cursor ----
class CustomCursor {
    constructor() {
        this.dot = document.getElementById('cursorDot');
        this.outline = document.getElementById('cursorOutline');
        if (!this.dot || !this.outline) return;

        this.cursorX = 0;
        this.cursorY = 0;
        this.outlineX = 0;
        this.outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .hobby-card, .skill-category, .contact-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        this.animate();
    }

    animate() {
        this.dot.style.left = `${this.cursorX}px`;
        this.dot.style.top = `${this.cursorY}px`;
        this.dot.style.transform = 'translate(-50%, -50%)';

        this.outlineX += (this.cursorX - this.outlineX) * 0.15;
        this.outlineY += (this.cursorY - this.outlineY) * 0.15;
        this.outline.style.left = `${this.outlineX}px`;
        this.outline.style.top = `${this.outlineY}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ---- Typewriter Effect ----
class Typewriter {
    constructor(element, words, speed = 100, pause = 2000) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.pause = pause;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        if (reducedMotion.matches) {
            this.element.textContent = this.words[0];
            return;
        }

        const current = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = current.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.charIndex === current.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ---- Animated Name: accessible text with staggered visual letters ----
class NameAnimator {
    constructor() {
        let letterIndex = 0;

        document.querySelectorAll('.name-text').forEach(name => {
            const text = name.textContent.trim();
            const fragment = document.createDocumentFragment();
            const readableName = document.createElement('span');
            readableName.className = 'sr-only';
            readableName.textContent = text;
            fragment.append(readableName);

            for (const character of text) {
                const letter = document.createElement('span');
                letter.className = 'name-letter';
                letter.setAttribute('aria-hidden', 'true');
                letter.style.setProperty('--letter-index', letterIndex++);
                letter.textContent = character === ' ' ? '\u00a0' : character;
                fragment.append(letter);
            }

            name.replaceChildren(fragment);
            name.classList.add('name-animated');
        });
    }
}

// ---- Scroll Animations ----
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, parseInt(delay));
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ---- Navbar ----
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.getElementById('navLinks');
        this.links = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => this.onScroll());
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActive(link);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.closeMenu();
                this.hamburger.focus();
            }
        });

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    onScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    toggleMenu() {
        const expanded = this.navLinks.classList.toggle('active');
        this.hamburger.classList.toggle('active', expanded);
        this.hamburger.setAttribute('aria-expanded', String(expanded));
        this.hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    }

    closeMenu() {
        this.hamburger?.classList.remove('active');
        this.navLinks?.classList.remove('active');
        this.hamburger?.setAttribute('aria-expanded', 'false');
        this.hamburger?.setAttribute('aria-label', 'Open navigation');
    }

    setActive(activeLink) {
        this.links.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        this.links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ---- Theme Toggle ----
class ThemeManager {
    constructor() {
        this.toggle = document.getElementById('themeToggle');
        this.icon = this.toggle?.querySelector('i');
        this.theme = localStorage.getItem('theme') || 'dark';
        this.apply();

        this.toggle?.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', this.theme);
            this.apply();
        });
    }

    apply() {
        document.documentElement.setAttribute('data-theme', this.theme);
        if (this.icon) {
            this.icon.className = this.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ---- Counter Animation ----
class CounterAnimator {
    constructor() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        if (reducedMotion.matches) {
            element.textContent = target;
            return;
        }
        const duration = 2000;
        const start = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            element.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }
}

// ---- Skill Bars Animation ----
class SkillBars {
    constructor() {
        const fills = document.querySelectorAll('.skill-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.dataset.width;
                    entry.target.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        fills.forEach(fill => observer.observe(fill));
    }
}

// ---- Contact Form ----
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.form?.addEventListener('submit', (e) => this.onSubmit(e));
    }

    onSubmit(e) {
        e.preventDefault();
        const btn = this.form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.style.background = 'linear-gradient(135deg, #00cec9, #55efc4)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            this.form.reset();
        }, 3000);
    }
}

// ---- Smooth Reveal on Page Load ----
class PageLoader {
    constructor() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    // Page load effect
    new PageLoader();

    // Stars background
    const starsCanvas = document.getElementById('starsCanvas');
    if (starsCanvas) new StarsSystem(starsCanvas);

    // Custom cursor (desktop only)
    if (window.innerWidth > 768) {
        new CustomCursor();
    }

    // Typewriter
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        new Typewriter(typewriterEl, [
            'Forward Deployed Engineer',
            'Full-Stack Developer',
            'Problem Solver',
            'Team Player',
            'Creative Thinker'
        ], 80, 2000);
    }

    // Prepare letters before the heading's scroll reveal starts.
    new NameAnimator();

    // Scroll animations
    new ScrollAnimator();

    // Navbar
    new Navbar();

    // Theme
    new ThemeManager();

    // Counters
    new CounterAnimator();

    // Skill bars
    new SkillBars();

    // Contact form
    new ContactForm();
});

// ---- Smooth Scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        }
    });
});
