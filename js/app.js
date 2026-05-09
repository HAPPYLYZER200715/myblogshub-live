let scrollPos = 0;

// Dropdown logic
document.querySelectorAll('.dropdown-parent').forEach(dropdown => {
  let timeout;
  dropdown.addEventListener('mouseenter', () => {
    if (window.innerWidth <= 768) return;
    clearTimeout(timeout);
    dropdown.classList.remove('open');
    dropdown.classList.add('show');
  });
  dropdown.addEventListener('mouseleave', () => {
    if (window.innerWidth <= 768) return;
    timeout = setTimeout(() => dropdown.classList.remove('show'), 200);
  });
  dropdown.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    if (e.target.closest('.dropdown-menu')) return;
    e.preventDefault();
    e.stopPropagation();
    this.classList.toggle('open');
    const icon = this.querySelector('.dropdown-toggle i');
    if (icon) icon.classList.toggle('open');
    this.classList.remove('show');
  });
});

function closeMenu() {
  const n = document.getElementById('navLinks');
  n.classList.remove('active');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  if (scrollPos) window.scrollTo(0, scrollPos);
  document.getElementById('closeBtn').style.display = 'none';
}

function toggleMenu() {
  const n = document.getElementById('navLinks');
  const c = document.getElementById('closeBtn');
  const isOpen = !n.classList.contains('active');
  n.classList.toggle('active');
  if (isOpen) {
    scrollPos = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPos}px`;
    document.body.style.width = '100%';
  } else {
    closeMenu();
    return;
  }
  c.style.display = isOpen ? 'block' : 'none';
}

function resetDropdowns() {
  document.querySelectorAll('.dropdown-parent').forEach(dp => {
    dp.classList.remove('open');
    dp.classList.remove('show');
    const icon = dp.querySelector('.dropdown-toggle i');
    if (icon) icon.classList.remove('open');
  });
}

resetDropdowns();

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMenu();
    resetDropdowns();
  } else {
    resetDropdowns();
    if (document.getElementById('navLinks').classList.contains('active')) {
      scrollPos = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPos}px`;
      document.body.style.width = '100%';
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    resetDropdowns();
  }
});

document.addEventListener('click', (e) => {
  if (window.innerWidth > 768) return;
  if (e.target.closest('.nav-links') || e.target.closest('#closeBtn') || e.target.closest('.hamburger-icon')) return;
  resetDropdowns();
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('mbh-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});
if (localStorage.getItem('mbh-theme') === 'dark') document.body.classList.add('dark-theme');

// Enhanced reveal observer with staggered delays
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.revealDelay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.dataset.revealDelay) {
    const baseDelay = Math.min(i * 80, 400);
    el.dataset.revealDelay = baseDelay;
  }
  revealObserver.observe(el);
});

// Header scroll handling
const header = document.getElementById('mainHeader');
const navWrap = document.getElementById('navWrap');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentScroll = window.scrollY;
      if (currentScroll > 60) navWrap.classList.add('scrolled');
      else navWrap.classList.remove('scrolled');
      if (currentScroll > 100) {
        if (currentScroll > lastScroll) header.classList.add('hidden');
        else header.classList.remove('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScroll = currentScroll;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Counter animation for stats
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (!target || target === 0) return;
  const duration = 1200;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + (el.dataset.suffix || '');
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        const suffix = el.dataset.suffix || '';
        const original = el.textContent;
        if (!el.dataset.target) el.dataset.target = original.replace(/[^0-9]/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-row, .stat-item').forEach(el => counterObserver.observe(el));

// Very light blue blur spot following cursor (desktop only)
if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; top: 0; left: 0; width: 250px; height: 250px;
    border-radius: 50%; pointer-events: none; z-index: 9999;
    background: radial-gradient(circle, rgba(160,200,255,0.06) 0%, transparent 65%);
    transform: translate(-50%, -50%);
    opacity: 0; will-change: transform;
    transition: opacity 0.5s ease;
  `;
  document.body.appendChild(glow);

  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX - 125}px, ${e.clientY - 125}px)`;
        glow.style.opacity = '1';
        ticking = false;
      });
      ticking = true;
    }
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('click', (e) => {
    glow.style.transform = `translate(${e.clientX - 125}px, ${e.clientY - 125}px)`;
    glow.style.opacity = '1';
  });
}
