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

            // Animate thank-you section elements
            const thankyouEls = entry.target.querySelectorAll('.thankyou-text, .thankyou-divider');
            thankyouEls.forEach(el => {
                el.classList.add('animate');
            });
        }
    });
}, observerOptions);

// Observe ceremony sections
const ceremonySections = document.querySelectorAll('.section-ceremony');
ceremonySections.forEach(section => {
    observer.observe(section);
});

// Observe thank-you section
const sectionThankyou = document.querySelector('.section-thankyou');
if (sectionThankyou) {
    observer.observe(sectionThankyou);
}

// Calendar bell — generate .ics file for "Add to Calendar"
var calendarBell = document.getElementById('calendarBell');
if (calendarBell) {
    calendarBell.addEventListener('click', function () {
        var icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Wedding//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            // Event 1: Lễ Hằng Thuận
            'BEGIN:VEVENT',
            'DTSTART:20260314T180000',
            'DTEND:20260314T210000',
            'SUMMARY:Lễ Hằng Thuận - Hoàng Anh & Dương Nguyên',
            'DESCRIPTION:Lễ Hằng Thuận tại chùa\\nThời gian: 07:00 - 11:00',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Nhắc nhở: Lễ Hằng Thuận ngày mai',
            'END:VALARM',
            'END:VEVENT',
            // Event 2: Lễ Đón Dâu
            'BEGIN:VEVENT',
            'DTSTART:20260320T071500',
            'DTEND:20260320T120000',
            'SUMMARY:Lễ Đón Dâu - Hoàng Anh & Dương Nguyên',
            'DESCRIPTION:Lễ Đón Dâu\\nNhà Trai xuất phát: 07:15\\nĐến Nhà Gái: 07:30\\nLễ Xin Dâu: 08:30\\nRước Dâu: 10:00',
            'LOCATION:Số 32\\, Do Nha 4\\, P. Hồng An\\, Hải Phòng',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Nhắc nhở: Lễ Đón Dâu ngày mai',
            'END:VALARM',
            'END:VEVENT',
            // Event 3: Lễ Thành Hôn (Nhà Trai)
            'BEGIN:VEVENT',
            'DTSTART:20260322T103000',
            'DTEND:20260322T120000',
            'SUMMARY:Lễ Thành Hôn (Nhà Trai) - Hoàng Anh & Dương Nguyên',
            'DESCRIPTION:Tiệc cưới Nhà Trai tại Cảnh Hưng Palace',
            'LOCATION:Cảnh Hưng Palace\\, Hải Phòng',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Nhắc nhở: Tiệc cưới Nhà Trai ngày mai',
            'END:VALARM',
            'END:VEVENT',
            // Event 4: Lễ Vu Quy (Nhà Gái)
            'BEGIN:VEVENT',
            'DTSTART:20260328T110000',
            'DTEND:20260328T123000',
            'SUMMARY:Lễ Vu Quy (Nhà Gái) - Hoàng Anh & Dương Nguyên',
            'DESCRIPTION:Tiệc cưới Nhà Gái tại Hải Đăng Plaza',
            'LOCATION:Hải Đăng Plaza\\, Hải Phòng',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Nhắc nhở: Tiệc cưới Nhà Gái ngày mai',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'wedding-hoang-anh-duong-nguyen.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Smooth scroll for save the date button
const saveTheDateBtn = document.querySelector('.save-date-btn');
if (saveTheDateBtn) {
    saveTheDateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Section2 = index 1 in the sections array
        goToSection(1);
    });
}

// RSVP shortcut button → open RSVP modal
var rsvpShortcut = document.getElementById('rsvpShortcut');
var modalRsvp = document.getElementById('modalRsvp');
if (rsvpShortcut) {
    rsvpShortcut.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openModal(modalRsvp);
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

    // Trigger entrance animations for RSVP modal elements
    if (modal === modalRsvp) {
        modal.querySelectorAll('.bird-illustration, .rsvp-divider, .rsvp-title, .rsvp-date, .rsvp-bottom-line').forEach(function(el) {
            el.classList.add('animate');
        });
    }
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
[modalGroom, modalBride, modalRsvp].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        [modalGroom, modalBride, modalRsvp].forEach(modal => {
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
    // Skip when keyboard is open (form field focused) to prevent iOS jank
    var ae = document.activeElement;
    if (ae) {
        var tag = ae.tagName && ae.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    }
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

var ANIMATION_DURATION = 550; // ms (faster = snappier on mobile)
var WHEEL_COOLDOWN = 700; // ms
var TOUCH_THRESHOLD = 25; // px minimum swipe distance

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

// Check if the active element is a form input/textarea
// Safari iOS: e.target on keydown may not be the focused element, so always check both
function isFormField(el) {
    var elements = [el, document.activeElement];
    for (var i = 0; i < elements.length; i++) {
        var node = elements[i];
        if (!node) continue;
        var tag = node.tagName && node.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || node.isContentEditable) {
            return true;
        }
    }
    return false;
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
        (modalBride && modalBride.classList.contains('active')) ||
        (modalRsvp && modalRsvp.classList.contains('active'))
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

    // Pause dove animations during scroll for better performance
    document.body.classList.add('scrolling');

    smoothScrollTo(sections[index].offsetTop, ANIMATION_DURATION, function () {
        isAnimating = false;
        document.body.classList.remove('scrolling');
    });
}

// Sync currentSection based on actual scroll position
// Call this before processing user input to handle unexpected scroll jumps (e.g. iOS status bar tap)
function syncCurrentSection() {
    if (isAnimating) return;
    var scrollY = getScrollTop();
    var closest = 0;
    var closestDist = Infinity;
    for (var i = 0; i < sections.length; i++) {
        var dist = Math.abs(sections[i].offsetTop - scrollY);
        if (dist < closestDist) {
            closestDist = dist;
            closest = i;
        }
    }
    // If scroll position jumped far from where we think we are, snap immediately
    if (closest !== currentSection) {
        currentSection = closest;
        setScrollTop(sections[closest].offsetTop);
    }
}

function initScrollSnap() {
    // Collect main-flow sections
    var els = document.querySelectorAll('.section-one, .section-ceremony, .section-thankyou');
    sections = [];
    for (var i = 0; i < els.length; i++) {
        sections.push(els[i]);
    }

    if (sections.length === 0) return;

    // --- Touch events (mobile) ---
    document.addEventListener('touchstart', function (e) {
        if (isInsideModal(e.target) || isModalOpen() || isFormField(e.target)) return;
        syncCurrentSection();
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (isInsideModal(e.target) || isModalOpen() || isFormField(e.target)) return;

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
        if (isInsideModal(e.target) || isModalOpen() || isFormField(e.target)) return;
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
        if (isInsideModal(e.target) || isModalOpen() || isFormField(e.target)) return;
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
            // Don't snap when keyboard is open or modal is active
            if (isFormField(document.activeElement)) return;
            if (isModalOpen()) return;
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

// ========== RSVP Form Submission ==========
(function () {
    var rsvpForm = document.getElementById('rsvpForm');
    if (!rsvpForm) return;

    var submitBtn = rsvpForm.querySelector('.rsvp-submit-btn');
    var originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    rsvpForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        var guestName = (rsvpForm.querySelector('#guestName').value || '').trim();
        var sideRadio = rsvpForm.querySelector('input[name="side"]:checked');
        var attendRadio = rsvpForm.querySelector('input[name="attendance"]:checked');
        var guestWish = (rsvpForm.querySelector('#guestWish').value || '').trim();
        var activeSwatch = document.querySelector('.dresscode-item.active .dresscode-name');
        var dressCode = activeSwatch ? activeSwatch.textContent.trim() : '';

        // Validate
        if (!guestName) {
            showFormMessage('Vui lòng nhập tên của bạn 💐', 'error');
            return;
        }
        if (!sideRadio) {
            showFormMessage('Vui lòng chọn bạn là khách của ai 💐', 'error');
            return;
        }
        if (!attendRadio) {
            showFormMessage('Vui lòng xác nhận tham dự 💐', 'error');
            return;
        }

        // Disable button & show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

        var data = {
            name: guestName,
            client: sideRadio.value,
            'will-attend': attendRadio.value,
            'dress-code': dressCode,
            wish: guestWish,
            submittedAt: new Date().toISOString()
        };

        // Send to Firestore
        if (typeof db !== 'undefined') {
            db.collection('rsvps').add(data)
                .then(function () {
                    showFormMessage('Cảm ơn bạn đã xác nhận! 🎉', 'success');
                    rsvpForm.reset();

                    // Notify via n8n webhook (fire & forget)
                    var webhookUrl = 'https://n8n.nguynx.uk/webhook/rsvp';
                    try {
                        fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        }).then(function (res) {
                            console.log('Webhook status:', res.status);
                        }).catch(function (err) {
                            console.error('Webhook failed:', err);
                        });
                    } catch (e) { console.error('Webhook error:', e); }
                })
                .catch(function (err) {
                    console.error('Firestore error:', err);
                    showFormMessage('Có lỗi xảy ra, vui lòng thử lại 😢', 'error');
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                });
        } else {
            console.warn('Firebase chưa được cấu hình.');
            showFormMessage('Hệ thống chưa sẵn sàng, vui lòng thử lại sau 😢', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });

    function showFormMessage(msg, type) {
        // Remove existing message
        var existing = rsvpForm.querySelector('.rsvp-form-message');
        if (existing) existing.remove();

        var msgEl = document.createElement('div');
        msgEl.className = 'rsvp-form-message ' + (type || '');
        msgEl.textContent = msg;
        rsvpForm.appendChild(msgEl);

        // Auto-remove after 4s
        setTimeout(function () {
            if (msgEl.parentNode) {
                msgEl.style.opacity = '0';
                msgEl.style.transform = 'translateY(-8px)';
                setTimeout(function () {
                    if (msgEl.parentNode) msgEl.remove();
                }, 400);
            }
        }, 4000);
    }
})();

// ========== Dresscode Swatch Selection ==========
(function () {
    var items = document.querySelectorAll('.dresscode-item');
    if (!items.length) return;

    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function () {
            var siblings = this.parentNode.querySelectorAll('.dresscode-item');
            for (var j = 0; j < siblings.length; j++) {
                siblings[j].classList.remove('active');
            }
            this.classList.add('active');
        });
    }
})();

// ========== Wishes Marquee from Firestore ==========
(function () {
    var marquee = document.getElementById('wishesMarquee');
    if (!marquee || typeof db === 'undefined') return;

    db.collection('rsvps')
        .orderBy('submittedAt', 'desc')
        .get()
        .then(function (snapshot) {
            var wishes = [];
            snapshot.forEach(function (doc) {
                var d = doc.data();
                if (d.wish && d.wish.trim() && d.name) {
                    wishes.push({ name: d.name, wish: d.wish.trim() });
                }
            });

            if (wishes.length === 0) {
                marquee.innerHTML = '<span class="wishes-empty">Hãy là người đầu tiên gửi lời chúc! 💐</span>';
                marquee.style.animation = 'none';
                marquee.style.justifyContent = 'center';
                return;
            }

            // Build single set of items
            var html = '';
            for (var i = 0; i < wishes.length; i++) {
                html += '<div class="wishes-marquee-item">' +
                    '<span class="wish-author">' + escapeHtml(wishes[i].name) + ':</span>' +
                    '<span class="wish-text">"' + escapeHtml(wishes[i].wish) + '"</span>' +
                    '</div>';
            }

            // Insert once to measure, then duplicate enough times to fill screen + extra
            marquee.innerHTML = html;
            var trackWidth = marquee.parentElement ? marquee.parentElement.offsetWidth : window.innerWidth;
            var contentWidth = marquee.scrollWidth;
            var copies = Math.max(2, Math.ceil((trackWidth * 2) / contentWidth) + 1);
            var fullHtml = '';
            for (var c = 0; c < copies; c++) {
                fullHtml += html;
            }
            marquee.innerHTML = fullHtml;

            // Animation scrolls by (1/copies) so first set loops seamlessly
            var pct = (100 / copies).toFixed(4);
            marquee.style.animation = 'none'; // reset
            marquee.offsetHeight; // force reflow
            // Create dynamic keyframes for exact percentage
            var styleEl = document.createElement('style');
            styleEl.textContent = '@keyframes marqueeScrollDyn{0%{transform:translateX(0)}100%{transform:translateX(-' + pct + '%)}}';
            document.head.appendChild(styleEl);

            var speed = Math.max(12, wishes.length * 5);
            marquee.style.animation = 'marqueeScrollDyn ' + speed + 's linear infinite';
            marquee.style.webkitAnimation = 'marqueeScrollDyn ' + speed + 's linear infinite';
        })
        .catch(function (err) {
            console.error('Error loading wishes:', err);
            marquee.innerHTML = '<span class="wishes-empty">💐</span>';
            marquee.style.animation = 'none';
        });

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
})();
