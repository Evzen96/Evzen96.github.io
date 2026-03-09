// main.js — Interactive CV Website
// Vanilla JavaScript with IntersectionObserver, Canvas, and Modern APIs
// ========================================================================

// ===== CONFIGURATION =====
const CONFIG = {
  PARTICLE_COUNT: 60,
  PARTICLE_SIZE: 2,
  PARTICLE_SPEED: 0.5,
  PARTICLE_DISTANCE: 150,
  INTRO_DURATION: 1500,
  TYPEWRITER_SPEED: 50,
  TYPEWRITER_PAUSE: 2000,
  REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// ===== STATE MANAGEMENT =====
const state = {
  currentSection: null,
  particleCanvas: null,
  particleCtx: null,
  particles: [],
  mouseX: 0,
  mouseY: 0,
  isDarkMode: null,
  radarAnimated: false,
};

// ===== DOM ELEMENTS =====
const elements = {
  navbar: document.querySelector('.navbar'),
  navLinks: document.querySelectorAll('.nav-link'),
  introSplash: document.getElementById('introSplash'),
  progressBar: document.querySelector('.progress-bar'),
  themeToggle: document.querySelector('.theme-toggle'),
  downloadPdfBtn: document.getElementById('downloadPdf'),
  copyBtns: document.querySelectorAll('.copy-btn'),
  timelineItems: document.querySelectorAll('.timeline-item'),
  skillFills: document.querySelectorAll('.skill-fill'),
  radarChart: document.querySelector('.radar-chart'),
  toast: document.getElementById('toast'),
  sections: document.querySelectorAll('section'),
};

// ===== INITIALIZATION =====
function init() {
  try {
    hideIntroSplash();

    if (!CONFIG.REDUCED_MOTION) {
      initParticleBackground();
    }

    initThemeToggle();
    initNavigation();
    initTimelineExpandCollapse();
    initSkillsAnimation();
    initCopyToClipboard();
    initScrollProgressBar();
    initPdfDownload();
    initSectionScrollAnimation();
  } catch (error) {
    console.error('Error during CV initialization:', error);
  }
}

// ===== INTRO SPLASH SCREEN =====
function hideIntroSplash() {
  if (elements.introSplash) {
    elements.introSplash.classList.add('hidden');
  }
}

// ===== PARTICLE BACKGROUND =====
function initParticleBackground() {
  state.particleCanvas = document.getElementById('particleCanvas');
  if (!state.particleCanvas) return;

  state.particleCtx = state.particleCanvas.getContext('2d', { alpha: true });
  resizeCanvas();
  createParticles();
  animateParticles();

  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('mousemove', updateMousePosition);
}

function resizeCanvas() {
  const rect = state.particleCanvas.getBoundingClientRect();
  state.particleCanvas.width = rect.width;
  state.particleCanvas.height = rect.height;
}

function createParticles() {
  state.particles = [];
  for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
    state.particles.push({
      x: Math.random() * state.particleCanvas.width,
      y: Math.random() * state.particleCanvas.height,
      vx: (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
      vy: (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
      radius: Math.random() * CONFIG.PARTICLE_SIZE,
    });
  }
}

function updateMousePosition(e) {
  state.mouseX = e.clientX;
  state.mouseY = e.clientY;
}

function animateParticles() {
  const ctx = state.particleCtx;
  const canvas = state.particleCanvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

    particle.x = (particle.x + canvas.width) % canvas.width;
    particle.y = (particle.y + canvas.height) % canvas.height;

    ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();

    state.particles.forEach((other) => {
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONFIG.PARTICLE_DISTANCE) {
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * (1 - distance / CONFIG.PARTICLE_DISTANCE)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animateParticles);
}

// ===== DARK/LIGHT MODE TOGGLE =====
function initThemeToggle() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  elements.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// ===== STICKY NAVIGATION WITH ACTIVE TRACKING =====
function initNavigation() {
  setTimeout(() => {
    elements.navbar.classList.add('active');
  }, 500);

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveNavLink(entry.target.id);
      }
    });
  }, observerOptions);

  elements.sections.forEach((section) => {
    observer.observe(section);
  });

  elements.navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        updateActiveNavLink(targetId);
      }
    });
  });
}

function updateActiveNavLink(sectionId) {
  elements.navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${sectionId}`) {
      link.classList.add('active');
    }
  });
  state.currentSection = sectionId;
}

// ===== TIMELINE EXPAND/COLLAPSE =====
function initTimelineExpandCollapse() {
  elements.timelineItems.forEach((item) => {
    const header = item.querySelector('.timeline-header');

    header.addEventListener('click', () => {
      toggleTimelineItem(item);
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTimelineItem(item);
      }
    });
  });
}

function toggleTimelineItem(item) {
  const isExpanded = item.getAttribute('data-expanded') === 'true';

  elements.timelineItems.forEach((other) => {
    if (other !== item) {
      other.setAttribute('data-expanded', 'false');
    }
  });

  item.setAttribute('data-expanded', !isExpanded);
}

// ===== SKILLS ANIMATION =====
function initSkillsAnimation() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars();
        animateRadarChart();
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

function animateSkillBars() {
  elements.skillFills.forEach((fill) => {
    const value = fill.getAttribute('data-value');
    fill.style.width = `${value}%`;
  });
}

function animateRadarChart() {
  if (state.radarAnimated || !elements.radarChart) return;

  state.radarAnimated = true;
  const polygon = elements.radarChart.querySelector('.radar-polygon');

  if (polygon && !CONFIG.REDUCED_MOTION) {
    polygon.style.animation = 'radarPop 0.6s ease-out forwards';
  } else if (polygon) {
    polygon.style.opacity = '1';
  }
}

// ===== TYPEWRITER EFFECT =====
function initTypewriterEffect() {
  const typewriterEl = document.querySelector('.typewriter');
  if (!typewriterEl || CONFIG.REDUCED_MOTION) return;

  const roles = [
    'Service & Project Manager',
    'IT Analyst',
    'Delivery Specialist',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typewrite() {
    const currentRole = roles[roleIndex];
initAccessibility
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typewriterEl.textContent = currentRole.substring(0, charIndex);

    let speed = CONFIG.TYPEWRITER_SPEED;

    if (isDeleting) {
      speed /= 2;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      speed = CONFIG.TYPEWRITER_PAUSE;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = CONFIG.TYPEWRITER_SPEED;
    }

    setTimeout(typewrite, speed);
  }

  typewrite();
}

// ===== COPY TO CLIPBOARD =====
function initCopyToClipboard() {
  elements.copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied: ${textToCopy}`);
      }).catch(() => {
        showToast('Failed to copy');
      });
    });
  });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');

  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2000);
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgressBar() {
  window.addEventListener('scroll', updateProgressBar);
  updateProgressBar();
}

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / docHeight) * 100;

  elements.progressBar.style.width = `${scrolled}%`;
}

// ===== SECTION SCROLL ANIMATION =====
function initSectionScrollAnimation() {
  const options = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        entry.target.style.opacity = '1';
        entry.target.style.transition = 'opacity 0.6s ease-out';
      }
    });
  }, options);

  document.querySelectorAll('.section').forEach((section) => {
    observer.observe(section);
  });
}

// ===== PDF DOWNLOAD =====
function initPdfDownload() {
  if (elements.downloadPdfBtn) {
    elements.downloadPdfBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'LGajdos_CV_2026.pdf';
      link.download = 'LGajdos_CV_2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

// ===== KEYBOARD ACCESSIBILITY =====
function initAccessibility() {
  elements.timelineItems.forEach((item) => {
    const header = item.querySelector('.timeline-header');
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
  });
}

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', () => {
  init();
  initTypewriterEffect();
  initAccessibility();
});

// Handle theme switch on page load
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
});
