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

const slideIds = ['slide-overview', 'slide-about', 'slide-projects', 'slide-links', 'slide-quote'];

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;

  if (window.innerWidth <= 768) {
    // Mobile: Smooth Native Scroll to Section
    const targetEl = document.getElementById(slideIds[index]);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    currentSlide = index;
    if (mobileCurrentSlideEl && slideLabels[currentSlide]) {
      mobileCurrentSlideEl.textContent = slideLabels[currentSlide];
    }
    return;
  }

  // Desktop: Fullpage Slider Transform
  if (isAnimating) return;
  isAnimating = true;
  currentSlide = index;
  updateSlideUI();
  setTimeout(() => {
    isAnimating = false;
  }, animDuration);
}

window.goToSlide = goToSlide;

function nextSlide() {
  if (window.innerWidth <= 768) return;
  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (window.innerWidth <= 768) return;
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

// Wheel / Trackpad listener (Desktop Only)
window.addEventListener('wheel', (e) => {
  if (window.innerWidth <= 768) return; // Native scroll on mobile
  if (isAnimating) return;

  const activeSlide = document.querySelectorAll('.fp-slide')[currentSlide];
  if (activeSlide) {
    const isAtTop = activeSlide.scrollTop <= 5;
    const isAtBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 5;
    if (e.deltaY > 0 && !isAtBottom) return;
    if (e.deltaY < 0 && !isAtTop) return;
  }

  if (Math.abs(e.deltaY) > 25) {
    if (e.deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}, { passive: true });

// Keyboard navigation (Desktop Only)
window.addEventListener('keydown', (e) => {
  if (window.innerWidth <= 768) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    prevSlide();
  }
});

// Mobile Scroll Observer for Header Active Badge
if ('IntersectionObserver' in window) {
  const slideObserver = new IntersectionObserver((entries) => {
    if (window.innerWidth > 768) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const slideIdx = slideIds.indexOf(entry.target.id);
        if (slideIdx !== -1) {
          currentSlide = slideIdx;
          if (mobileCurrentSlideEl && slideLabels[slideIdx]) {
            mobileCurrentSlideEl.textContent = slideLabels[slideIdx];
          }
        }
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: "-10% 0px -40% 0px"
  });

  slideIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) slideObserver.observe(el);
  });
}

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

// Theme Toggle (White Default on Mobile, Dark Default on Desktop)
const themeToggleBtn = document.getElementById('themeToggleBtn');
const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

function applyTheme(theme) {
  const mobileThemeIcon = document.querySelector('.mobile-theme-icon');
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '☾';
    if (themeLabel) themeLabel.textContent = 'DARK';
    if (mobileThemeIcon) mobileThemeIcon.textContent = '☾';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) themeIcon.textContent = '☀';
    if (themeLabel) themeLabel.textContent = 'LIGHT';
    if (mobileThemeIcon) mobileThemeIcon.textContent = '☀';
  }
}

let initialTheme = localStorage.getItem('portfolio-theme');
if (!initialTheme) {
  initialTheme = window.innerWidth <= 768 ? 'light' : 'dark';
}
applyTheme(initialTheme);

function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
}

if (mobileThemeToggleBtn) {
  mobileThemeToggleBtn.addEventListener('click', toggleTheme);
}

// Initial UI
updateSlideUI();
checkInitialHash();
