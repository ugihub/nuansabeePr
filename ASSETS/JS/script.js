// Fungsi untuk mendeteksi perangkat dengan performa rendah - dipindahkan ke awal
function checkLowPerformanceDevice() {
    const isOldMobile = /Android 4|iPhone 5|iPhone 4|iPad 2|iPod/.test(navigator.userAgent);
    const isLowRAM = navigator.deviceMemory && navigator.deviceMemory < 4;
    return isOldMobile || isLowRAM || (window.innerWidth < 768 && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
}

// 1. Loading Animation - Improved with smoother transition and error handling
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (!loader) return;

    if (typeof gsap !== 'undefined') {
        gsap.to(loader, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            onComplete: () => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }
        });
    } else {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1200);
    }
});

// 2. Modal Functions - Improved with null safety and animations
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        const modalContent = modal.querySelector('.modal-content') || modal.children[0];
        if (modalContent && typeof gsap !== 'undefined') {
            gsap.to(modalContent, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        } else if (modalContent) {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }
    }, 10);
}

window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const modalContent = modal.querySelector('.modal-content') || modal.children[0];
    if (modalContent && typeof gsap !== 'undefined') {
        gsap.to(modalContent, {
            scale: 0.95,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                modal.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 100);
            }
        });
    } else {
        if (modalContent) {
            modalContent.style.transform = 'scale(0.95)';
            modalContent.style.opacity = '0';
        }
        modal.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 250);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (typeof gsap !== 'undefined') {
                if (menuOpen) {
                    gsap.to(mobileMenu, {
                        y: 0,
                        duration: 0.4,
                        ease: "power3.out",
                        onStart: () => {
                            mobileMenu.classList.remove('-translate-y-full');
                            mobileMenu.style.display = 'flex';
                            document.body.style.overflow = 'hidden';
                        }
                    });
                } else {
                    gsap.to(mobileMenu, {
                        y: -window.innerHeight,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            mobileMenu.classList.add('-translate-y-full');
                            document.body.style.overflow = 'auto';
                        }
                    });
                }
            } else {
                if (menuOpen) {
                    mobileMenu.classList.remove('-translate-y-full');
                    mobileMenu.style.display = 'flex';
                    mobileMenu.style.transform = 'translateY(0)';
                    document.body.style.overflow = 'hidden';
                } else {
                    mobileMenu.style.transform = 'translateY(-100%)';
                    setTimeout(() => {
                        mobileMenu.classList.add('-translate-y-full');
                        document.body.style.overflow = 'auto';
                    }, 300);
                }
            }
        });

        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                if (typeof gsap !== 'undefined') {
                    gsap.to(mobileMenu, {
                        y: -window.innerHeight,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            mobileMenu.classList.add('-translate-y-full');
                            document.body.style.overflow = 'auto';
                        }
                    });
                } else {
                    mobileMenu.style.transform = 'translateY(-100%)';
                    setTimeout(() => {
                        mobileMenu.classList.add('-translate-y-full');
                        document.body.style.overflow = 'auto';
                    }, 300);
                }
            });
        });
    }

    // 4. AOS Init
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // 5. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
            } else {
                backToTop.classList.add('opacity-0', 'invisible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. Ripple Effect for Buttons
    document.querySelectorAll('.ripple').forEach(button => {
        button.addEventListener('click', function (e) {
            try {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const ripple = this.querySelector('.ripple-effect') || document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                this.appendChild(ripple);

                if (typeof ripple.animate === 'function') {
                    const animation = ripple.animate([
                        { transform: 'scale(0)', opacity: 1 },
                        { transform: 'scale(8)', opacity: 0 }
                    ], {
                        duration: 800,
                        easing: 'ease-out'
                    });

                    if (animation.onfinish !== undefined) {
                        animation.onfinish = () => ripple.remove();
                    } else {
                        setTimeout(() => ripple.remove(), 800);
                    }
                } else {
                    ripple.style.transition = 'all 800ms ease-out';
                    ripple.style.transform = 'scale(8)';
                    ripple.style.opacity = '0';
                    setTimeout(() => ripple.remove(), 800);
                }
            } catch (error) {
                console.warn('Error in ripple effect:', error);
            }
        });
    });

    // 7. GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const isMobile = window.innerWidth < 768;
        const isLowPerformance = checkLowPerformanceDevice();

        const animationDuration = isLowPerformance ? 0.6 : (isMobile ? 0.8 : 1);
        const animationDistance = isLowPerformance ? 20 : (isMobile ? 30 : 50);

        ScrollTrigger.batch('.animate-on-scroll', {
            onEnter: batch => {
                gsap.from(batch, {
                    opacity: 0,
                    y: animationDistance,
                    duration: animationDuration,
                    stagger: isLowPerformance ? 0.05 : 0.1,
                    ease: "power2.out"
                });
            },
            start: 'top 90%'
        });

        gsap.utils.toArray('.stagger-fade-in').forEach(container => {
            const elements = container.querySelectorAll('.stagger-item');
            if (elements.length) {
                ScrollTrigger.create({
                    trigger: container,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.from(elements, {
                            opacity: 0,
                            y: isLowPerformance ? 15 : 20,
                            stagger: isLowPerformance ? 0.05 : 0.1,
                            duration: animationDuration,
                            ease: "power2.out"
                        });
                    },
                    once: isLowPerformance
                });
            }
        });

        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            gsap.from(heroTitle, {
                opacity: 0,
                scale: 0.95,
                duration: isLowPerformance ? 0.8 : 1.2,
                delay: 0.3,
                ease: "power3.out"
            });
        }

        let resizeScrollTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeScrollTimer);
            resizeScrollTimer = setTimeout(() => {
                try {
                    ScrollTrigger.refresh(true);
                } catch (e) {
                    console.warn('Error refreshing ScrollTrigger:', e);
                }
            }, 250);
        });
    }

    // 8. Particles.js Initialization
    let particlesInitialized = false;

    function initParticles() {
        if (particlesInitialized) return;
        const container = document.getElementById('particles-js');
        if (!container) return;

        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isLowPerformance = checkLowPerformanceDevice();

        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: isLowPerformance ? 10 : (isMobile ? 20 : (isTablet ? 35 : 50)),
                        density: {
                            enable: true,
                            value_area: isLowPerformance ? 800 : (isMobile ? 600 : 800)
                        }
                    },
                    color: { value: "#C68642" },
                    shape: {
                        type: "circle",
                        stroke: { width: 0, color: "#000000" }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: isMobile ? 2 : 3,
                        random: true,
                        anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                    },
                    line_linked: {
                        enable: !isLowPerformance && !isMobile,
                        distance: isMobile ? 100 : 150,
                        color: "#C68642",
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: isLowPerformance ? 0.5 : (isMobile ? 1 : 2),
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: isMobile ? "window" : "canvas",
                    events: {
                        onhover: {
                            enable: !isLowPerformance && !isMobile,
                            mode: "grab"
                        },
                        onclick: {
                            enable: !isLowPerformance,
                            mode: isMobile ? "repulse" : "push"
                        },
                        resize: true
                    }
                },
                retina_detect: !isLowPerformance && !isMobile
            });
            particlesInitialized = true;
        }
    }

    // Resize handler
    let resizeTimer;
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const currentWidth = window.innerWidth;
            const widthDifference = Math.abs(currentWidth - lastWidth);
            const significantChange = widthDifference > 100;
            if (significantChange) {
                lastWidth = currentWidth;
                try {
                    if (window.pJSDom && window.pJSDom.length > 0) {
                        window.pJSDom[0].pJS.fn.vendors.destroypJS();
                    }
                    particlesInitialized = false;
                    initParticles();
                } catch (e) {
                    console.warn('Error reinitializing particles:', e);
                }
            }
            if (typeof ScrollTrigger !== 'undefined') {
                try {
                    ScrollTrigger.refresh();
                } catch (e) {
                    console.warn('Error refreshing ScrollTrigger:', e);
                }
            }
        }, 250);
    });

    initParticles(); // Initial call
});

// Newsletter form handler
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("investor-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = this.querySelector("input[name='user_name']").value.trim();
        const email = this.querySelector("input[name='user_email']").value.trim();
        const message = this.querySelector("textarea[name='user_message']").value.trim();
        const button = this.querySelector("button[type='submit']");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        button.disabled = true;
        button.textContent = "Sending...";

        emailjs.send("service_vm9k7tv", "template_n9mxg0j", {
            name: name,
            email: email,
            message: message
        }).then(() => {
            alert("Thank you for reaching out! We'll be in touch.");
            form.reset();
            button.disabled = false;
            button.textContent = "Join Us";
        }).catch((error) => {
            alert("Failed to send your message. Please try again.");
            console.error("EmailJS Error:", error);
            button.disabled = false;
            button.textContent = "Join Us";
        });
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;

    document.querySelectorAll('.fade-in').forEach((el) => {
        if (!isMobile && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.from(el, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                },
            });
        } else {
            // Untuk mobile: langsung tampilkan tanpa animasi
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 30) {
        navbar.classList.add('nav-blur'); // Tambahkan efek blur
    } else {
        navbar.classList.remove('nav-blur'); // Hilangkan saat di atas
    }
});

const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const menuCards = Array.from(document.querySelectorAll('.menu-card'));

function filterAndSortMenu() {
    const query = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    let filtered = menuCards.filter(card =>
        card.dataset.name.toLowerCase().includes(query)
    );

    if (sortBy === 'name-asc') {
        filtered.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    } else if (sortBy === 'name-desc') {
        filtered.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
    } else if (sortBy === 'price-asc') {
        filtered.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    }

    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    filtered.forEach(card => grid.appendChild(card));
}

searchInput.addEventListener('input', filterAndSortMenu);
sortSelect.addEventListener('change', filterAndSortMenu);

document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const allCards = Array.from(document.querySelectorAll('.menu-card'));
    const grid = document.querySelector('.grid');
    const pagination = document.getElementById("pagination");

    let filteredCards = [...allCards];
    let currentPage = 1;
    const itemsPerPage = 3;

    function renderPagination() {
        const pageCount = Math.ceil(filteredCards.length / itemsPerPage);
        pagination.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors duration-300 mx-1 ${i === currentPage ? 'bg-[#C68642] text-white' : 'bg-white text-[#1E1E1E] hover:bg-[#C68642] hover:text-white'
                }`;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderCards();
                renderPagination();
            });
            pagination.appendChild(btn);
        }
    }

    function renderCards() {
        grid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        filteredCards.slice(start, end).forEach(card => grid.appendChild(card));
    }

    function filterByCategory(category) {
        currentPage = 1;
        filteredCards = (category === "All")
            ? [...allCards]
            : allCards.filter(card => card.dataset.category === category);

        renderCards();
        renderPagination();
    }

    // Handle category click
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update style active
            categoryButtons.forEach(b => b.classList.remove('bg-[#C68642]', 'text-white'));
            categoryButtons.forEach(b => b.classList.add('bg-white', 'text-[#1E1E1E]'));

            btn.classList.remove('bg-white', 'text-[#1E1E1E]');
            btn.classList.add('bg-[#C68642]', 'text-white');

            // Filter
            const selected = btn.dataset.category;
            filterByCategory(selected);
        });
    });

    // Inisialisasi pertama
    filterByCategory("All");
});
