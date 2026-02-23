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

window.addEventListener('load', () => {
    setVH();
    // Force scroll to top
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
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
