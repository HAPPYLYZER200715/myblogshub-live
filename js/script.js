let scrollPos = 0;

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
    if (e.target.closest('.dropdown-menu')) return;
    this.classList.remove('show');
    if (window.innerWidth > 768) return;
    e.preventDefault();
    e.stopPropagation();
    this.classList.toggle('open');
    const icon = this.querySelector('.dropdown-toggle i');
    if (icon) icon.classList.toggle('open');
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

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('mbh-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});
if (localStorage.getItem('mbh-theme') === 'dark') document.body.classList.add('dark-theme');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
