// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate contact groups
            const contactGroups = entry.target.querySelectorAll('.contact-group');
            contactGroups.forEach((group, index) => {
                setTimeout(() => {
                    group.classList.add('animate');
                }, index * 200);
            });

            // Animate RSVP elements
            const animateElements = entry.target.querySelectorAll('.bird-illustration, .rsvp-divider, .rsvp-title, .rsvp-date, .rsvp-bottom-line, .rsvp-note');
            animateElements.forEach(el => {
                el.classList.add('animate');
            });

            // Animate wedding items (Bride & Groom sections)
            const weddingItems = entry.target.querySelectorAll('.wedding-item');
            weddingItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 200);
            });

            // Animate ceremony items
            const ceremonyItems = entry.target.querySelectorAll('.ceremony-item');
            ceremonyItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 200);
            });
        }
    });
}, observerOptions);

// Observe section two (RSVP)
const sectionTwo = document.querySelector('.section-two');
if (sectionTwo) {
    observer.observe(sectionTwo);
}

// Observe wedding sections (Bride & Groom)
const weddingSections = document.querySelectorAll('.section-wedding');
weddingSections.forEach(section => {
    observer.observe(section);
});

// Observe ceremony sections
const ceremonySections = document.querySelectorAll('.section-ceremony');
ceremonySections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll for save the date button
const saveTheDateBtn = document.querySelector('.save-date-btn');
if (saveTheDateBtn) {
    saveTheDateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#section2').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#section2').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Always scroll to section 1 on page load/refresh
// Disable browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Multiple methods to ensure scroll to top on all devices
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Fix iOS viewport height
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);

// ===== CUSTOM SCROLL SNAP (JS-based for better mobile support) =====
const sections = [];
let isScrolling = false;
let touchStartY = 0;
let touchEndY = 0;
let currentSection = 0;

function initScrollSnap() {
    // Get all sections
    const sectionElements = document.querySelectorAll('.section-one, .section-ceremony, .section-wedding, .section-two');
    sectionElements.forEach((section, index) => {
        sections.push(section);
    });
    
    if (sections.length === 0) return;
    
    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSection < sections.length - 1) {
                // Swipe up - go to next section
                currentSection++;
                scrollToSection(currentSection);
            } else if (diff < 0 && currentSection > 0) {
                // Swipe down - go to previous section
                currentSection--;
                scrollToSection(currentSection);
            }
        }
    }, { passive: true });
    
    // Mouse wheel for desktop
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        if (e.deltaY > 30 && currentSection < sections.length - 1) {
            // Scroll down
            currentSection++;
            scrollToSection(currentSection);
        } else if (e.deltaY < -30 && currentSection > 0) {
            // Scroll up
            currentSection--;
            scrollToSection(currentSection);
        }
    }, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection < sections.length - 1) {
            currentSection++;
            scrollToSection(currentSection);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
            currentSection--;
            scrollToSection(currentSection);
        }
    });
}

function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// Update current section based on scroll position
function updateCurrentSection() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        if (scrollTop >= sectionTop - windowHeight / 2) {
            currentSection = index;
        }
    });
}

window.addEventListener('load', () => {
    setVH();
    initScrollSnap();
    
    // Force scroll to top
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        currentSection = 0;
        const section1 = document.querySelector('#section1');
        if (section1) {
            section1.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }, 0);
});

// Also handle DOMContentLoaded for faster response
document.addEventListener('DOMContentLoaded', () => {
    setVH();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
});
