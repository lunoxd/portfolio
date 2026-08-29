// Fullpage Slider Controller (Holy Hallow Style)
let currentSlide = 0;
const totalSlides = 4;
let isAnimating = false;
const animDuration = 650; // ms

const sliderTrack = document.getElementById('slider-track');
const dotBtns = document.querySelectorAll('.dot-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const logoBtn = document.querySelector('.logo-btn');

function updateSlideUI() {
  if (sliderTrack) {
    sliderTrack.style.transform = `translateY(-${currentSlide * 100}vh)`;
  }

  dotBtns.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  navBtns.forEach((btn, index) => {
    if (index === currentSlide) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides || isAnimating) return;
  isAnimating = true;
  currentSlide = index;
  updateSlideUI();
  setTimeout(() => {
    isAnimating = false;
  }, animDuration);
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

// Wheel / Trackpad listener with debouncing
let wheelTimeout = null;
window.addEventListener('wheel', (e) => {
  if (isAnimating) return;
  // If the active slide has internal scrollable content that isn't at the top/bottom:
  const activeSlide = document.querySelectorAll('.fp-slide')[currentSlide];
  if (activeSlide) {
    const isAtTop = activeSlide.scrollTop <= 5;
    const isAtBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 5;
    if (e.deltaY > 0 && !isAtBottom) return; // Allow internal scrolling down
    if (e.deltaY < 0 && !isAtTop) return; // Allow internal scrolling up
  }

  if (Math.abs(e.deltaY) > 25) {
    if (e.deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}, { passive: true });

// Touch Swipe Listener for mobile/tablets
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isAnimating) return;
  touchEndY = e.changedTouches[0].screenY;
  const diff = touchStartY - touchEndY;
  if (Math.abs(diff) > 45) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}, { passive: true });

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    prevSlide();
  }
});

// Dot Buttons Click
dotBtns.forEach((dot) => {
  dot.addEventListener('click', () => {
    const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
    goToSlide(slideIdx);
  });
});

// Nav Buttons Click
navBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const slideIdx = parseInt(btn.getAttribute('data-slide'), 10);
    goToSlide(slideIdx);
  });
});

// Logo Click
if (logoBtn) {
  logoBtn.addEventListener('click', () => {
    goToSlide(0);
  });
}

// Project Category Filter
const categoryPills = document.querySelectorAll('.category-pill');
const projectCards = document.querySelectorAll('.project-card');
const emptyState = document.querySelector('.empty-projects-state');

categoryPills.forEach((pill) => {
  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.getAttribute('data-filter');
    let visibleCount = 0;

    projectCards.forEach((card) => {
      if (filter === 'all' || card.classList.contains(`is-${filter}`)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
  });
});

// External Link Visit Modal
const visitModal = document.getElementById('visitModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalUrlBox = document.getElementById('modalUrlBox');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

document.querySelectorAll('.contact-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    const url = card.getAttribute('data-url');
    const name = card.getAttribute('data-name');
    const handle = card.getAttribute('data-handle');

    if (!url) return;

    if (url.startsWith('/')) {
      // Internal page like /personal.html
      return;
    }

    e.preventDefault();
    if (visitModal) {
      if (modalTitle) modalTitle.textContent = `Visit ${name}?`;
      if (modalText) modalText.textContent = `Open ${handle} on ${name} in a new browser tab.`;
      if (modalUrlBox) modalUrlBox.textContent = url;
      if (modalConfirmBtn) modalConfirmBtn.href = url;
      visitModal.showModal();
    }
  });
});

if (modalConfirmBtn) {
  modalConfirmBtn.addEventListener('click', () => {
    if (visitModal) visitModal.close();
  });
}

if (modalCancelBtn) {
  modalCancelBtn.addEventListener('click', () => {
    if (visitModal) visitModal.close();
  });
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    if (visitModal) visitModal.close();
  });
}

if (visitModal) {
  visitModal.addEventListener('click', (e) => {
    const dialogDimensions = visitModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      visitModal.close();
    }
  });
}

// URL Hash Navigation Support
function checkInitialHash() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#about') {
    goToSlide(1);
  } else if (hash === '#projects') {
    goToSlide(2);
  } else if (hash === '#contact' || hash === '#links') {
    goToSlide(3);
  } else if (hash === '#overview' || hash === '#hero') {
    goToSlide(0);
  }
}

window.addEventListener('load', checkInitialHash);
window.addEventListener('hashchange', checkInitialHash);

// Theme Toggle (Light / Dark Black Theme)
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '☀';
    if (themeLabel) themeLabel.textContent = 'LIGHT';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) themeIcon.textContent = '☾';
    if (themeLabel) themeLabel.textContent = 'DARK';
  }
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

// Initial UI
updateSlideUI();
checkInitialHash();
