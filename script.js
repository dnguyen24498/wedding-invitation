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
        // Section2 = index 1 in the sections array
        goToSection(1);
    });
}

// Choose side (Nhà Trai / Nhà Gái) buttons → open modals
const sideBtns = document.querySelectorAll('.side-btn');
const modalGroom = document.getElementById('modalGroom');
const modalBride = document.getElementById('modalBride');

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

sideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const side = btn.dataset.side;

        // Toggle active state on buttons
        sideBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Open corresponding modal
        if (side === 'groom') {
            openModal(modalGroom);
        } else {
            openModal(modalBride);
        }
    });
});

// Close modal on ✕ button
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        // Walk up to find the modal overlay (compatible with all browsers)
        var overlay = closeBtn.closest ? closeBtn.closest('.modal-overlay') : null;
        if (!overlay) {
            var node = closeBtn.parentElement;
            while (node) {
                if (node.classList && node.classList.contains('modal-overlay')) { overlay = node; break; }
                node = node.parentElement;
            }
        }
        if (overlay) closeModal(overlay);
    });
});

// Close modal when clicking outside content
[modalGroom, modalBride].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        [modalGroom, modalBride].forEach(modal => {
            if (modal && modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    }
});

// Scroll indicator clicks (up/down arrows on all sections)
document.querySelectorAll('.scroll-indicator').forEach(function (indicator) {
    indicator.addEventListener('click', function () {
        var direction = indicator.getAttribute('data-direction');
        // Find which section this indicator belongs to
        var parentSection = indicator.parentElement;
        var sectionIndex = -1;
        for (var i = 0; i < sections.length; i++) {
            if (sections[i] === parentSection) {
                sectionIndex = i;
                break;
            }
        }
        if (sectionIndex === -1) return;

        if (direction === 'down' && sectionIndex < sections.length - 1) {
            goToSection(sectionIndex + 1);
        } else if (direction === 'up' && sectionIndex > 0) {
            goToSection(sectionIndex - 1);
        }
    });
});

// Always scroll to section 1 on page load/refresh
// Disable browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Multiple methods to ensure scroll to top on all devices/browsers
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
if (document.body) document.body.scrollTop = 0;

window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

// Fix iOS viewport height (also handles address bar show/hide)
function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}
setVH();
window.addEventListener('resize', setVH);
// iOS-specific: orientationchange fires more reliably than resize on some devices
window.addEventListener('orientationchange', function () {
    setTimeout(setVH, 100);
    setTimeout(setVH, 300); // double-tap for iOS address bar settle
});

// ===== FULLPAGE SCROLL SNAP (RAF-based, cross-browser) =====
var sections = [];
var currentSection = 0;
var isAnimating = false;
var touchStartY = 0;
var touchStartX = 0;
var touchStartTime = 0;
var lastWheelTime = 0;
var wheelAccumulator = 0;
var wheelTimer = null;

var ANIMATION_DURATION = 800; // ms
var WHEEL_COOLDOWN = 900; // ms
var TOUCH_THRESHOLD = 30; // px minimum swipe distance

// Ease-in-out cubic for buttery smooth transitions
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Cross-browser scroll position getter
function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

// Cross-browser scroll-to
function setScrollTop(y) {
    window.scrollTo(0, y);
}

// Check if an element is inside a modal
function isInsideModal(el) {
    if (!el || !el.closest) return false;
    // el.closest may not exist on very old browsers — fallback
    try {
        return !!el.closest('.modal-overlay');
    } catch (e) {
        // Manual parent walk for browsers without .closest()
        var node = el;
        while (node && node !== document) {
            if (node.classList && node.classList.contains('modal-overlay')) return true;
            node = node.parentElement || node.parentNode;
        }
        return false;
    }
}

// Check if a modal is currently open
function isModalOpen() {
    return !!(
        (modalGroom && modalGroom.classList.contains('active')) ||
        (modalBride && modalBride.classList.contains('active'))
    );
}

// Animate scroll from current position to target using RAF
function smoothScrollTo(targetY, duration, callback) {
    var startY = getScrollTop();
    var diff = targetY - startY;

    if (Math.abs(diff) < 2) {
        setScrollTop(targetY);
        if (callback) callback();
        return;
    }

    var startTime = null;

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeInOutCubic(progress);

        setScrollTop(startY + diff * easedProgress);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            setScrollTop(targetY); // ensure exact landing
            if (callback) callback();
        }
    }

    requestAnimationFrame(step);
}

function goToSection(index) {
    if (index < 0 || index >= sections.length || isAnimating) return;
    if (index === currentSection && Math.abs(getScrollTop() - sections[index].offsetTop) < 2) return;

    isAnimating = true;
    currentSection = index;

    smoothScrollTo(sections[index].offsetTop, ANIMATION_DURATION, function () {
        isAnimating = false;
    });
}

function initScrollSnap() {
    // Collect main-flow sections
    var els = document.querySelectorAll('.section-one, .section-ceremony, .section-two');
    sections = [];
    for (var i = 0; i < els.length; i++) {
        sections.push(els[i]);
    }

    if (sections.length === 0) return;

    // --- Touch events (mobile) ---
    document.addEventListener('touchstart', function (e) {
        if (isInsideModal(e.target) || isModalOpen()) return;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (isInsideModal(e.target) || isModalOpen()) return;

        // Calculate direction — only prevent vertical scroll, allow horizontal (for links etc.)
        if (e.touches && e.touches.length > 0) {
            var diffY = Math.abs(e.touches[0].clientY - touchStartY);
            var diffX = Math.abs(e.touches[0].clientX - touchStartX);
            // Only block if predominantly vertical scroll
            if (diffY > diffX) {
                if (e.cancelable) e.preventDefault();
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', function (e) {
        if (isInsideModal(e.target) || isModalOpen()) return;
        if (isAnimating) return;

        var touchEndY = e.changedTouches[0].clientY;
        var touchEndX = e.changedTouches[0].clientX;
        var diffY = touchStartY - touchEndY;
        var diffX = Math.abs(touchStartX - touchEndX);
        var elapsed = Date.now() - touchStartTime;

        // Ignore horizontal swipes (e.g. carousel or accidental)
        if (diffX > Math.abs(diffY) * 1.2) return;

        // Detect quick flick (velocity-based) or long swipe (distance-based)
        var velocity = Math.abs(diffY) / Math.max(elapsed, 1); // px/ms, avoid /0
        var isFlick = velocity > 0.25 && Math.abs(diffY) > 15;
        var isSwipe = Math.abs(diffY) > TOUCH_THRESHOLD;

        if (isFlick || isSwipe) {
            if (diffY > 0 && currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            } else if (diffY < 0 && currentSection > 0) {
                goToSection(currentSection - 1);
            } else {
                goToSection(currentSection);
            }
        } else {
            // Tiny movement — snap back
            goToSection(currentSection);
        }
    }, { passive: true });

    // --- Wheel events (desktop) ---
    // Use accumulated delta to handle trackpad (many small deltas) vs mouse (single large delta)
    document.addEventListener('wheel', function (e) {
        if (isInsideModal(e.target) || isModalOpen()) return;
        if (e.cancelable) e.preventDefault();

        if (isAnimating) return;

        var now = Date.now();
        if (now - lastWheelTime < WHEEL_COOLDOWN) return;

        // Accumulate wheel delta for trackpad support
        wheelAccumulator += e.deltaY;
        clearTimeout(wheelTimer);

        wheelTimer = setTimeout(function () {
            if (isAnimating) {
                wheelAccumulator = 0;
                return;
            }

            if (wheelAccumulator > 30 && currentSection < sections.length - 1) {
                lastWheelTime = Date.now();
                goToSection(currentSection + 1);
            } else if (wheelAccumulator < -30 && currentSection > 0) {
                lastWheelTime = Date.now();
                goToSection(currentSection - 1);
            }
            wheelAccumulator = 0;
        }, 50);
    }, { passive: false });

    // --- Keyboard navigation ---
    document.addEventListener('keydown', function (e) {
        if (isInsideModal(e.target) || isModalOpen()) return;
        if (isAnimating) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            if (currentSection < sections.length - 1) goToSection(currentSection + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) goToSection(currentSection - 1);
        }
    });

    // --- Snap on resize (orientation change, address bar show/hide) ---
    var resizeSnapTimer;
    function snapAfterResize() {
        clearTimeout(resizeSnapTimer);
        resizeSnapTimer = setTimeout(function () {
            if (!isAnimating && sections[currentSection]) {
                setScrollTop(sections[currentSection].offsetTop);
            }
        }, 200);
    }
    window.addEventListener('resize', snapAfterResize);
    window.addEventListener('orientationchange', function () {
        setTimeout(snapAfterResize, 300);
    });
}

window.addEventListener('load', function () {
    setVH();
    initScrollSnap();

    // Force scroll to section 0 on load
    currentSection = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
});

// Also handle DOMContentLoaded for faster response
document.addEventListener('DOMContentLoaded', function () {
    setVH();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
});
