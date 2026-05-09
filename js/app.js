(() => {
  'use strict';

  // === Smooth reveal observer ===
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

  document.querySelectorAll('.reveal, .reveal-scale').forEach((el, i) => {
    if (!el.dataset.revealDelay) {
      const base = Math.min(i * 90, 500);
      el.dataset.revealDelay = base;
    }
    revealObserver.observe(el);
  });

  // === 3D Tilt on cards ===
  let tiltTicking = false;
  document.querySelectorAll('.tilt-card').forEach(card => {
    const inner = card.querySelector('.tilt-card-inner') || card;
    card.addEventListener('mousemove', e => {
      if (tiltTicking) return;
      tiltTicking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        inner.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        tiltTicking = false;
      });
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    });
  });

  // === Ripple effect on all buttons ===
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  // === Magnetic nav links ===
  document.querySelectorAll('.nav-links a:not(.join-hub-btn), .logo').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // === Smooth parallax on elements ===
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

  // === Header scroll behavior ===
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
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
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

  // === Smooth scroll for anchor links ===
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

  // === Page transition on internal links ===
  document.querySelectorAll('a:not([href^="#"]):not([href^="http"]):not([href^="https"]):not([target="_blank"])').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('https') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      const dest = href;
      document.body.style.opacity = '0';
      document.body.style.transform = 'translateY(10px) scale(0.98)';
      document.body.style.transition = 'opacity 0.35s var(--smooth), transform 0.35s var(--smooth)';
      setTimeout(() => { window.location.href = dest; }, 350);
    });
  });

})();
