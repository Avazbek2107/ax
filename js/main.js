// ===== GLOBAL VARIABLES =====
let currentUser = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadUser();
    setupEventListeners();
    initCarousel();
    updateUI();
    handleNavigation();
});

// ===== USER MANAGEMENT =====
function loadUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    } else {
        // Default user for demo
        currentUser = {
            id: 1,
            name: 'Foydalanuvchi',
            email: 'demo@axborot.uz',
            role: 'Talaba',
            avatar: ''
        };
    }
}

function saveUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function updateUI() {
    // Update user name across pages
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = currentUser.name;
    });
    
    // Update welcome name on dashboard
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) {
        welcomeName.textContent = currentUser.name;
    }
    
    // Update user role
    document.querySelectorAll('.user-role').forEach(el => {
        el.textContent = currentUser.role;
    });
}

// ===== AUTHENTICATION =====
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout buttons
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
    
    // Password toggles
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', togglePassword);
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Continue learning button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', continueLearning);
    }
    
    // Bookmark buttons
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', toggleBookmark);
    });
    
    // Carousel navigation
    document.querySelectorAll('.carousel-btn.prev').forEach(btn => {
        btn.addEventListener('click', prevSlide);
    });
    
    document.querySelectorAll('.carousel-btn.next').forEach(btn => {
        btn.addEventListener('click', nextSlide);
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    // Demo validation
    if (!email || !password) {
        alert('Iltimos, barcha maydonlarni to\'ldiring!');
        return;
    }
    
    // Simple validation for demo
    if (password.length < 6) {
        alert('Parol kamida 6 belgidan iborat bo\'lishi kerak!');
        return;
    }
    
    // Demo login
    currentUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        role: 'Talaba'
    };
    
    saveUser();
    
    if (remember) {
        localStorage.setItem('rememberedEmail', email);
    }
    
    showNotification('Muvaffaqiyatli kirildi!', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!fullname || !email || !password || !userType) {
        alert('Iltimos, barcha maydonlarni to\'ldiring!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Parollar mos kelmadi!');
        return;
    }
    
    if (password.length < 6) {
        alert('Parol kamida 6 belgidan iborat bo\'lishi kerak!');
        return;
    }
    
    if (!terms) {
        alert('Foydalanish shartlarini qabul qilishingiz kerak!');
        return;
    }
    
    // Demo registration
    currentUser = {
        id: Date.now(),
        name: fullname,
        email: email,
        role: userType === 'student' ? 'Talaba' : 'O\'qituvchi'
    };
    
    saveUser();
    showNotification('Ro\'yxatdan muvaffaqiyatli o\'tdingiz!', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function handleLogout() {
    if (confirm('Platformadan chiqishni xohlaysizmi?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function togglePassword(e) {
    const button = e.currentTarget;
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// ===== FILTER FUNCTIONALITY =====
function handleFilter(e) {
    const btn = e.currentTarget;
    const filterGroup = btn.closest('.filter-group');
    
    // Remove active class from all buttons in this group
    filterGroup.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    const filter = btn.textContent.trim();
    
    // Filter content cards
    const cards = document.querySelectorAll('.content-card');
    cards.forEach(card => {
        const status = card.querySelector('.card-badge')?.textContent || '';
        const difficulty = card.querySelector('.difficulty')?.textContent || '';
        
        if (filter === 'Barchasi') {
            card.style.display = 'block';
        } else if (filter === 'Yakunlangan' && status.includes('Yakunlangan')) {
            card.style.display = 'block';
        } else if (filter === 'Jarayonda' && status.includes('Jarayonda')) {
            card.style.display = 'block';
        } else if (filter === 'Boshlanmagan' && !status) {
            card.style.display = 'block';
        } else if (filter === 'Oson' && difficulty === 'Oson') {
            card.style.display = 'block';
        } else if (filter === 'O\'rtacha' && difficulty === 'O\'rtacha') {
            card.style.display = 'block';
        } else if (filter === 'Qiyin' && difficulty === 'Qiyin') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== CAROUSEL =====
let currentSlide = 0;
let slideInterval;

function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Start auto-play
    startAutoPlay();
    
    // Pause on hover
    carousel.addEventListener('mouseenter', pauseAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel(slides, dots);
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel(slides, dots);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    currentSlide = index;
    updateCarousel(slides, dots);
}

function updateCarousel(slides, dots) {
    const track = document.querySelector('.carousel-track');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function startAutoPlay() {
    pauseAutoPlay();
    slideInterval = setInterval(nextSlide, 5000);
}

function pauseAutoPlay() {
    clearInterval(slideInterval);
}

// ===== BOOKMARK FUNCTIONALITY =====
function toggleBookmark(e) {
    const btn = e.currentTarget;
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.className = 'fas fa-bookmark';
        btn.classList.add('active');
        showNotification('Resurs saqlandi', 'success');
    } else {
        icon.className = 'far fa-bookmark';
        btn.classList.remove('active');
        showNotification('Resurs o\'chirildi', 'info');
    }
}

// ===== CONTINUE LEARNING =====
function continueLearning() {
    // Find first incomplete item
    const incompleteCards = document.querySelectorAll('.section-card .progress-info');
    
    for (let card of incompleteCards) {
        const [completed, total] = card.textContent.split('/').map(n => parseInt(n));
        if (completed < total) {
            const sectionCard = card.closest('.section-card');
            const link = sectionCard.querySelector('a');
            if (link) {
                window.location.href = link.href;
                return;
            }
        }
    }
    
    // If all completed, go to lectures
    window.location.href = 'lectures.html';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    let icon = '';
    let color = '';
    
    switch(type) {
        case 'success':
            icon = 'check-circle';
            color = '#10b981';
            break;
        case 'error':
            icon = 'exclamation-circle';
            color = '#ef4444';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            color = '#f59e0b';
            break;
        default:
            icon = 'info-circle';
            color = '#3b82f6';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${icon}" style="color: ${color}; font-size: 1.25rem;"></i>
        <span style="color: #1f2937;">${message}</span>
        <button style="background: none; border: none; margin-left: 1rem; cursor: pointer;">
            <i class="fas fa-times" style="color: #9ca3af;"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('button').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== NAVIGATION GUARD =====
function handleNavigation() {
    const publicPages = ['index.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!publicPages.includes(currentPage)) {
        const user = localStorage.getItem('currentUser');
        if (!user && currentPage !== '') {
            window.location.href = 'index.html';
        }
    }
}

// ===== ADD GLOBAL STYLES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        border-left: 4px solid var(--notification-color);
    }
    
    .notification-success {
        border-left-color: #10b981;
    }
    
    .notification-error {
        border-left-color: #ef4444;
    }
    
    .notification-warning {
        border-left-color: #f59e0b;
    }
    
    .notification-info {
        border-left-color: #3b82f6;
    }
`;

document.head.appendChild(style);