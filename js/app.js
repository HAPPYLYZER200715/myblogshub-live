(() => {
  'use strict';

  // === Smooth reveal with spring-like staggered timing ===
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay, 10) || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.dataset.revealDelay) {
      const base = Math.min(i * 90, 500);
      el.dataset.revealDelay = base;
    }
    revealObserver.observe(el);
  });

  // === Smooth parallax on hero images ===
  let parallaxTicking = false;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = rect.top * speed;
            el.style.transform = `translateY(${offset}px)`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  });

  // === Smooth image blur-up loading ===
  document.querySelectorAll('img.load-blur').forEach(img => {
    const fullSrc = img.dataset.src;
    if (!fullSrc) return;
    const temp = new Image();
    temp.onload = () => {
      img.src = fullSrc;
      img.style.filter = 'blur(0px)';
      img.style.opacity = '1';
    };
    temp.src = fullSrc;
  });

  // === Dropdown logic ===
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

  let scrollPos = 0;

  function closeMenu() {
    const n = document.getElementById('navLinks');
    if (!n) return;
    n.classList.remove('active');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (scrollPos) window.scrollTo(0, scrollPos);
    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) closeBtn.style.display = 'none';
  }

  window.closeMenu = closeMenu;

  window.toggleMenu = function() {
    const n = document.getElementById('navLinks');
    const c = document.getElementById('closeBtn');
    if (!n) return;
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
    if (c) c.style.display = isOpen ? 'block' : 'none';
  };

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
      const nl = document.getElementById('navLinks');
      if (nl && nl.classList.contains('active')) {
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

  // === Theme toggle ===
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('mbh-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    if (localStorage.getItem('mbh-theme') === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }

  // === Header scroll behavior (smooth) ===
  const header = document.getElementById('mainHeader');
  const navWrap = document.getElementById('navWrap');
  let lastScroll = 0;
  let scrollTicking = false;

  if (header && navWrap) {
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll > 60) navWrap.classList.add('scrolled');
          else navWrap.classList.remove('scrolled');
          if (currentScroll > 100) {
            header.classList.toggle('hidden', currentScroll > lastScroll);
          } else {
            header.classList.remove('hidden');
          }
          lastScroll = currentScroll;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // === Counter animation ===
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target || target === 0) return;
    const duration = 1500;
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

  // === Smooth scroll for all anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
