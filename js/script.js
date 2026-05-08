document.querySelectorAll('.dropdown-parent').forEach(dropdown => {
  let timeout;
  dropdown.addEventListener('mouseenter', () => { clearTimeout(timeout); dropdown.classList.add('show'); });
  dropdown.addEventListener('mouseleave', () => { timeout = setTimeout(() => dropdown.classList.remove('show'), 200); });
  dropdown.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (e.target.closest('.dropdown-menu')) { return; }
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('open');
    }
  });
});

function toggleMenu() {
  const n = document.getElementById('navLinks');
  const c = document.getElementById('closeBtn');
  n.classList.toggle('active');
  const isOpen = n.classList.contains('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  c.style.display = isOpen ? 'block' : 'none';
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.getElementById('navLinks').classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.dropdown-parent').forEach(dp => dp.classList.remove('open'));
    document.getElementById('closeBtn').style.display = 'none';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('navLinks').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('closeBtn').style.display = 'none';
  }
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
