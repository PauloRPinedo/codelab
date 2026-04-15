/* ===================================================
   CodeLab Explorer — js/core.js
   Utilitários, tema, navbar, toast, auth helpers
   Deve ser carregado em TODAS as páginas.
   =================================================== */
(function () {
  'use strict';

  // ── DOM Helpers ───────────────────────────────────
  window.$ = (sel, ctx = document) => ctx.querySelector(sel);
  window.$$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Path Helper ───────────────────────────────────
  window.resolvePath = (page) => {
    const inPages = window.location.pathname.includes('/pages/');
    if (page === 'index.html') return inPages ? '../index.html' : 'index.html';
    return inPages ? page : `pages/${page}`;
  };

  // ── Toast ─────────────────────────────────────────
  window.showToast = (message, type = 'info', duration = 3500) => {
    let container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    const exit = () => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 350);
    };
    setTimeout(exit, duration);
    toast.addEventListener('click', exit);
  };

  // ── Tema (dark/light) ─────────────────────────────
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('cl-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  function initThemeToggle() {
    const btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('cl-theme', next);
    });
  }

  // ── Navbar scroll ─────────────────────────────────
  function initNavbar() {
    const navbar = $('#navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Hamburger / Mobile menu ───────────────────────
  function initHamburger() {
    const burger = $('#hamburger');
    const menu = $('#mobile-menu');
    if (!burger || !menu) return;
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('active');
    });
    $$('.mobile-link', menu).forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  // ── Navbar Auth State ─────────────────────────────
  function initNavAuth() {
    const loginBtn = $('#nav-login-btn');
    const userMenu = $('#user-menu');
    const userMenuBtn = $('#user-menu-btn');
    const userDropdown = $('#user-dropdown');
    const userNameEl = $('#user-name-nav');
    const userInitialsEl = $('#user-initials-nav');

    const user = API.getMe();
    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userNameEl) userNameEl.textContent = user.name.split(' ')[0];
      if (userInitialsEl) userInitialsEl.textContent = user.initials;
    } else {
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }

    // Dropdown toggle
    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
      });
      document.addEventListener('click', () => userDropdown.classList.remove('active'));
    }

    // Logout
    const logoutBtn = $('#nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        API.logout();
        showToast('Sessão encerrada.', 'info');
        setTimeout(() => window.location.href = resolvePath('index.html'), 800);
      });
    }
  }

  // ── Nav Active Link ───────────────────────────────
  function initActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link[data-page]').forEach(link => {
      if (link.dataset.page === current) link.classList.add('active');
    });
  }

  // ── Search (navbar global) ────────────────────────
  function initSearch() {
    const input = $('#search-input');
    const dropdown = $('#search-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (!q) { dropdown.classList.remove('active'); return; }
      const results = API.searchAll(q);
      if (!results.length) { dropdown.classList.remove('active'); return; }
      dropdown.innerHTML = results.map(r =>
        `<div class="search-dropdown-item" data-id="${r.id}">
          <span>${r.icon || ''} ${r.title}</span>
          <span class="search-item-type">${r.type}</span>
        </div>`
      ).join('');
      dropdown.classList.add('active');
      $$('.search-dropdown-item', dropdown).forEach(item => {
        item.addEventListener('click', () => {
          window.location.href = resolvePath(`project-detail.html?id=${item.dataset.id}`);
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search')) dropdown.classList.remove('active');
    });

    // ⌘K shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape') dropdown.classList.remove('active');
    });
  }

  // ── Scroll Animations (fade-up) ───────────────────
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    $$('.fade-up').forEach(el => observer.observe(el));
  }

  // ── Counter Animation ─────────────────────────────
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.target);
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = target >= 1000 ? Math.floor(current).toLocaleString('pt-BR') : Math.floor(current);
    }, 22);
  }

  function initCounters() {
    const counters = $$('[data-target]');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) animateCounter(entry.target); });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  // ── Protect Page (redirect if not logged in) ──────
  window.requireAuth = (redirectTo = 'login.html') => {
    if (!API.isLoggedIn()) {
      window.location.href = resolvePath(redirectTo);
      return false;
    }
    return true;
  };

  window.requireAdmin = (redirectTo = 'index.html') => {
    if (!API.isLoggedIn() || !API.isAdmin()) {
      showToast('Acesso restrito a administradores.', 'error');
      window.location.href = resolvePath(redirectTo);
      return false;
    }
    return true;
  };

  // ── Escape HTML ───────────────────────────────────
  window.escHtml = (str) =>
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // ── Init all ─────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initHamburger();
    initNavAuth();
    initActiveLink();
    initSearch();
    initScrollAnimations();
    initCounters();
  });

})();
