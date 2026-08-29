// Fullpage Slider Controller (Holy Hallow Style)
let currentSlide = 0;
const totalSlides = 5;
let isAnimating = false;
const animDuration = 650; // ms

const sliderTrack = document.getElementById('slider-track');
const dotBtns = document.querySelectorAll('.dot-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-slide]');
const logoBtn = document.querySelector('.logo-btn');

const slideLabels = [
  '01 // Overview',
  '02 // About',
  '03 // Projects',
  '04 // Links',
  '05 // Motto'
];

const mobileCurrentSlideEl = document.getElementById('mobileCurrentSlide');

function updateSlideUI() {
  if (sliderTrack) {
    sliderTrack.style.transform = `translateY(-${currentSlide * 100}vh)`;
  }

  if (mobileCurrentSlideEl && slideLabels[currentSlide]) {
    mobileCurrentSlideEl.textContent = slideLabels[currentSlide];
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

  mobileNavItems.forEach((item, index) => {
    if (index === currentSlide) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

mobileNavItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const slideIndex = parseInt(item.getAttribute('data-slide'), 10);
    goToSlide(slideIndex);
  });
});

function goToSlide(index) {
  if (index < 0 || index >= totalSlides || isAnimating) return;

  isAnimating = true;
  currentSlide = index;
  updateSlideUI();
  setTimeout(() => {
    isAnimating = false;
  }, animDuration);
}

window.goToSlide = goToSlide;

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

// Touch Swipe Listener for mobile/tablets with internal scroll awareness
let touchStartY = 0;
let touchStartX = 0;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].clientY;
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isAnimating) return;
  const touchEndY = e.changedTouches[0].clientY;
  const touchEndX = e.changedTouches[0].clientX;
  const diffY = touchStartY - touchEndY;
  const diffX = touchStartX - touchEndX;

  // Only handle clear vertical gestures
  if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 40) {
    const activeSlide = document.querySelectorAll('.fp-slide')[currentSlide];
    if (activeSlide) {
      const isScrollable = activeSlide.scrollHeight > activeSlide.clientHeight + 10;
      const isAtTop = activeSlide.scrollTop <= 5;
      const isAtBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 5;

      if (diffY > 0) {
        // Swiping Up -> Next Slide
        if (!isScrollable || isAtBottom) {
          nextSlide();
        }
      } else {
        // Swiping Down -> Prev Slide
        if (!isScrollable || isAtTop) {
          prevSlide();
        }
      }
    } else {
      if (diffY > 0) nextSlide();
      else prevSlide();
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

// Mobile Project Paging & Category Filter
let currentMobileProjectIndex = 0;
const filterButtons = document.querySelectorAll('button.category-pill');
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const emptyStateEl = document.querySelector('.empty-projects-state');
const mobileProjectNavEl = document.getElementById('mobileProjectNav');
const projectNavCounterEl = document.getElementById('projectNavCounter');
const projectPrevBtn = document.getElementById('projectPrevBtn');
const projectNextBtn = document.getElementById('projectNextBtn');

function updateMobileProjectView() {
  const activeFilterBtn = document.querySelector('button.category-pill.active');
  const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

  const matchingCards = projectCards.filter((card) => {
    return activeFilter === 'all' || card.classList.contains(`is-${activeFilter}`);
  });

  const totalMatching = matchingCards.length;

  if (window.innerWidth > 768) {
    // Desktop View: Show all matching cards in multi-column grid
    projectCards.forEach((card) => {
      card.style.display = (activeFilter === 'all' || card.classList.contains(`is-${activeFilter}`)) ? 'flex' : 'none';
    });
    if (emptyStateEl) emptyStateEl.style.display = totalMatching === 0 ? 'flex' : 'none';
    if (mobileProjectNavEl) mobileProjectNavEl.style.display = 'none';
    return;
  }

  // Mobile View: Show only ONE project at a time with emoji buttons
  if (totalMatching === 0) {
    projectCards.forEach(c => c.style.display = 'none');
    if (emptyStateEl) emptyStateEl.style.display = 'flex';
    if (mobileProjectNavEl) mobileProjectNavEl.style.display = 'none';
    return;
  }

  if (emptyStateEl) emptyStateEl.style.display = 'none';
  if (mobileProjectNavEl) mobileProjectNavEl.style.display = 'flex';

  if (currentMobileProjectIndex >= totalMatching) {
    currentMobileProjectIndex = 0;
  }

  // Hide all cards, show only the current one
  projectCards.forEach(c => c.style.display = 'none');
  if (matchingCards[currentMobileProjectIndex]) {
    matchingCards[currentMobileProjectIndex].style.display = 'flex';
  }

  if (projectNavCounterEl) {
    projectNavCounterEl.textContent = `0${currentMobileProjectIndex + 1} / 0${totalMatching}`;
  }

  if (projectPrevBtn) {
    projectPrevBtn.disabled = currentMobileProjectIndex === 0;
    projectPrevBtn.style.opacity = currentMobileProjectIndex === 0 ? '0.35' : '1';
  }

  if (projectNextBtn) {
    projectNextBtn.disabled = currentMobileProjectIndex === totalMatching - 1;
    projectNextBtn.style.opacity = currentMobileProjectIndex === totalMatching - 1 ? '0.35' : '1';
  }
}

if (projectPrevBtn) {
  projectPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentMobileProjectIndex > 0) {
      currentMobileProjectIndex--;
      updateMobileProjectView();
    }
  });
}

if (projectNextBtn) {
  projectNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const activeFilterBtn = document.querySelector('button.category-pill.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const matchingCards = projectCards.filter(c => activeFilter === 'all' || c.classList.contains(`is-${activeFilter}`));
    if (currentMobileProjectIndex < matchingCards.length - 1) {
      currentMobileProjectIndex++;
      updateMobileProjectView();
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMobileProjectIndex = 0;
    updateMobileProjectView();
  });
});

window.addEventListener('resize', updateMobileProjectView);
updateMobileProjectView();

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
  } else if (hash === '#motto' || hash === '#quote' || hash === '#veni' || hash === '#philosophy') {
    goToSlide(4);
  } else if (hash === '#overview' || hash === '#hero') {
    goToSlide(0);
  }
}

window.addEventListener('load', checkInitialHash);
window.addEventListener('hashchange', checkInitialHash);

// Theme Toggle (Dark Default / Light Option)
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '☾';
    if (themeLabel) themeLabel.textContent = 'DARK';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) themeIcon.textContent = '☀';
    if (themeLabel) themeLabel.textContent = 'LIGHT';
  }
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

// Initial UI
updateSlideUI();
checkInitialHash();
