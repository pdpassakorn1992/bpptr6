// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Routing Initial State
    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Trigger Stats Counter Animation (Intersection Observer)
    initStatsObserver();
});

// Routing for Single Page Application
function handleHashRouting() {
    const hash = window.location.hash || '#home';
    const tabId = hash.replace('#', '');
    
    // Switch tab
    switchTab(tabId);
}

function switchTab(tabId) {
    const validTabs = ['home', 'commanders', 'contact'];
    if (!validTabs.includes(tabId)) return;

    // Remove active from all tabs
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
    });

    // Add active to selected tab
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Nav Menu Links active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${tabId}`) {
            link.classList.add('active');
        }
    });

    // Close Mobile Menu if open
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Stats Counter Animation
function initStatsObserver() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(numElement => {
                    animateValue(numElement);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(statsSection);
}

function animateValue(obj) {
    const target = parseInt(obj.getAttribute('data-target'), 10);
    let start = 0;
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        obj.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            obj.textContent = target; // Ensure exact final value is set
        }
    }

    requestAnimationFrame(updateCounter);
}
