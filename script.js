// Fix iOS viewport height
function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', function() {
    setTimeout(setVH, 100);
});

// ========== MODAL SYSTEM ==========
var modalGroom = document.getElementById('modalGroom');
var modalBride = document.getElementById('modalBride');
var modalRsvp = document.getElementById('modalRsvp');
var wishTickerItems = [];
var wishTickerDefaults = [
    { name: 'Gia đình', wish: 'Chúc hai bạn trăm năm hạnh phúc và luôn nắm tay nhau đi hết cuộc đời.' },
    { name: 'Bạn thân', wish: 'Mãi yêu thương, đồng hành và cùng nhau vun đắp một mái ấm thật bình yên.' },
    { name: 'Đồng nghiệp', wish: 'Chúc cô dâu chú rể luôn ngập tràn tiếng cười, may mắn và thành công.' }
];

function isModalOpen() {
    return (modalGroom && modalGroom.classList.contains('active')) ||
           (modalBride && modalBride.classList.contains('active')) ||
           (modalRsvp && modalRsvp.classList.contains('active'));
}

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

// Choose side image triggers
document.querySelectorAll('.choose-trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var side = this.getAttribute('data-side');
        if (side === 'groom') {
            openModal(modalGroom);
        } else if (side === 'bride') {
            openModal(modalBride);
        }
    });
});

// RSVP button
var rsvpBtn = document.getElementById('rsvpBtn');
if (rsvpBtn) {
    rsvpBtn.addEventListener('click', function() {
        openModal(modalRsvp);
    });
}

// Close buttons
document.querySelectorAll('.modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var modal = this.closest('.modal-overlay');
        closeModal(modal);
    });
});

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

// Close on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function(modal) {
            closeModal(modal);
        });
    }
});

// ========== CALENDAR DOWNLOAD ==========
document.querySelectorAll('.modal-calendar-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var eventType = this.getAttribute('data-event');
        var icsContent;
        
        if (eventType === 'groom') {
            icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'DTSTART:20260322T103000',
                'DTEND:20260322T140000',
                'SUMMARY:Lễ Thành Hôn - Hoàng Anh & Dương Nguyên (Nhà Trai)',
                'DESCRIPTION:Tiệc cưới tại Trung tâm tiệc cưới Cảnh Hưng',
                'LOCATION:Số 32 KĐT Long Sơn, Quán Toan, Hải Phòng',
                'BEGIN:VALARM',
                'TRIGGER:-P1D',
                'ACTION:DISPLAY',
                'DESCRIPTION:Nhắc nhở: Tiệc cưới Nhà Trai ngày mai',
                'END:VALARM',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');
        } else {
            icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'DTSTART:20260328T110000',
                'DTEND:20260328T140000',
                'SUMMARY:Lễ Vu Quy - Hoàng Anh & Dương Nguyên (Nhà Gái)',
                'DESCRIPTION:Tiệc cưới tại Trung tâm tiệc cưới Hải Đăng Plaza',
                'LOCATION:Số 19 Trần Khánh Dư, Ngô Quyền, Hải Phòng',
                'BEGIN:VALARM',
                'TRIGGER:-P1D',
                'ACTION:DISPLAY',
                'DESCRIPTION:Nhắc nhở: Tiệc cưới Nhà Gái ngày mai',
                'END:VALARM',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');
        }
        
        var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'wedding-' + eventType + '.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});

// ========== WISH MARQUEE ==========
function normalizeWishEntry(entry) {
    if (!entry) return null;

    var wishText = (entry.wish || '').toString().trim();
    if (!wishText) return null;

    var author = (entry.name || 'Khách mời').toString().trim();
    if (!author) author = 'Khách mời';

    if (wishText.length > 130) {
        wishText = wishText.slice(0, 129) + '…';
    }

    if (author.length > 22) {
        author = author.slice(0, 21) + '…';
    }

    return {
        name: author,
        wish: wishText
    };
}

function createWishPill(entry) {
    var normalized = normalizeWishEntry(entry);
    if (!normalized) return null;

    var pill = document.createElement('div');
    pill.className = 'wish-pill';

    var text = document.createElement('span');
    text.className = 'wish-pill-text';
    text.textContent = '“' + normalized.wish + '”';

    var heart = document.createElement('span');
    heart.className = 'wish-pill-heart';
    heart.innerHTML = '<i class="fas fa-heart"></i>';

    var name = document.createElement('span');
    name.className = 'wish-pill-name';
    name.textContent = '— ' + normalized.name;

    pill.appendChild(text);
    pill.appendChild(heart);
    pill.appendChild(name);

    return pill;
}

function renderWishTicker(entries) {
    var wishTrack = document.getElementById('wishTrack');
    if (!wishTrack) return;

    var source = Array.isArray(entries) && entries.length ? entries : wishTickerDefaults;
    var normalized = source
        .map(normalizeWishEntry)
        .filter(function(item) { return !!item; })
        .slice(0, 12);

    if (!normalized.length) {
        normalized = wishTickerDefaults.slice();
    }

    wishTickerItems = normalized.slice();
    wishTrack.innerHTML = '';

    var loopItems = normalized.concat(normalized);
    loopItems.forEach(function(item) {
        var node = createWishPill(item);
        if (node) wishTrack.appendChild(node);
    });

    var duration = Math.max(30, Math.min(70, normalized.length * 4.8));
    wishTrack.style.setProperty('--wish-duration', duration + 's');
}

function extractWishesFromSnapshot(snapshot) {
    var wishes = [];
    if (!snapshot || typeof snapshot.forEach !== 'function') return wishes;

    snapshot.forEach(function(doc) {
        var data = doc && typeof doc.data === 'function' ? doc.data() : null;
        var normalized = normalizeWishEntry(data);
        if (normalized) wishes.push(normalized);
    });

    return wishes;
}

function getWishesFromFirebase() {
    if (typeof db === 'undefined') {
        return Promise.resolve([]);
    }

    return db.collection('rsvps').orderBy('submittedAt', 'desc').limit(40).get()
        .then(function(snapshot) {
            return extractWishesFromSnapshot(snapshot);
        })
        .catch(function() {
            return db.collection('rsvps').limit(40).get()
                .then(function(snapshot) {
                    return extractWishesFromSnapshot(snapshot);
                })
                .catch(function() {
                    return [];
                });
        });
}

function prependWishToTicker(entry) {
    var normalized = normalizeWishEntry(entry);
    if (!normalized) return;

    var nextItems = [normalized];
    wishTickerItems.forEach(function(item) {
        if (nextItems.length >= 12) return;

        var isDuplicate = item.name === normalized.name && item.wish === normalized.wish;
        if (!isDuplicate) {
            nextItems.push(item);
        }
    });

    renderWishTicker(nextItems);
}

function initWishTicker() {
    var wishTrack = document.getElementById('wishTrack');
    if (!wishTrack) return;

    renderWishTicker(wishTickerDefaults);

    getWishesFromFirebase().then(function(wishes) {
        if (wishes && wishes.length) {
            renderWishTicker(wishes);
        }
    }).catch(function() {});
}

// ========== RSVP FORM ==========
var rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var guestName = document.getElementById('guestName').value.trim();
        var sideRadio = document.querySelector('input[name="side"]:checked');
        var attendRadio = document.querySelector('input[name="attendance"]:checked');
        var guestWish = document.getElementById('guestWish').value.trim();
        
        if (!guestName) {
            showMessage('Vui lòng nhập tên của bạn', 'error');
            return;
        }
        if (!sideRadio || !attendRadio) {
            showMessage('Vui lòng chọn đầy đủ thông tin', 'error');
            return;
        }
        
        var submitBtn = rsvpForm.querySelector('.submit-btn');
        var originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        
        var data = {
            name: guestName,
            client: sideRadio.value,
            'will-attend': attendRadio.value,
            wish: guestWish,
            submittedAt: new Date().toISOString()
        };
        
        if (typeof db !== 'undefined') {
            db.collection('rsvps').add(data)
                .then(function() {
                    showMessage('Cảm ơn bạn đã xác nhận! 🎉', 'success');
                    prependWishToTicker(data);
                    rsvpForm.reset();
                    
                    // Webhook notification
                    fetch('https://n8n.nguynx.uk/webhook/rsvp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }).catch(function() {});
                })
                .catch(function(err) {
                    console.error(err);
                    showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
                })
                .finally(function() {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                });
        } else {
            showMessage('Hệ thống chưa sẵn sàng', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }
    });
    
    function showMessage(msg, type) {
        var existing = rsvpForm.querySelector('.form-message');
        if (existing) existing.remove();
        
        var msgEl = document.createElement('div');
        msgEl.className = 'form-message ' + type;
        msgEl.textContent = msg;
        rsvpForm.appendChild(msgEl);
        
        setTimeout(function() {
            if (msgEl.parentNode) msgEl.remove();
        }, 4000);
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    setVH();
    window.scrollTo(0, 0);
    initWishTicker();
});

window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});
