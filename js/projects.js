/* ===================================================
   js/projects.js — Lógica de listagem de projetos
   =================================================== */
(function () {
  'use strict';

  // Estado dos filtros
  const filters = {
    difficulty: ['beginner', 'intermediate', 'advanced'],
    language: ['python', 'javascript', 'java', 'cpp', 'typescript', 'rust'],
    category: ['web', 'games', 'algorithms', 'data-structures', 'ai-ml', 'cli'],
    sort: '',
    page: 1,
    limit: 9,
  };

  const grid = document.getElementById('projects-grid');
  const countEl = document.getElementById('projects-count');
  const paginationEl = document.getElementById('pagination');

  // ── Renderizar cards ──────────────────────────────
  function renderProjects(projects) {
    if (!projects.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">📭</div>
        <h3>Nenhum projeto encontrado</h3>
        <p>Tente ajustar os filtros ou limpe-os para ver todos os projetos.</p>
        <button class="btn btn-secondary" onclick="clearFilters()">Limpar Filtros</button>
      </div>`;
      return;
    }
    grid.innerHTML = projects.map(p => `
      <a href="project-detail.html?id=${p.id}" class="project-card card-hover" id="pcard-${p.id}">
        <div class="card-thumb" style="background:linear-gradient(135deg,${
          p.difficulty === 'beginner'
            ? 'rgba(16,185,129,.15),rgba(6,182,212,.15)'
            : p.difficulty === 'intermediate'
            ? 'rgba(245,158,11,.15),rgba(124,58,237,.15)'
            : 'rgba(239,68,68,.15),rgba(124,58,237,.15)'
        })">
          <span>${p.icon}</span>
          <div class="card-thumb-overlay"></div>
        </div>
        <div class="card-body">
          <h3>${escHtml(p.title)}</h3>
          <p class="card-desc">${escHtml(p.desc)}</p>
          <div class="card-tags">
            ${p.tags.map(t => `<span class="card-tag">${escHtml(t)}</span>`).join('')}
          </div>
          <div class="card-footer">
            <span class="badge badge-${p.difficulty}">
              ${p.difficulty === 'beginner' ? 'Iniciante' : p.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </span>
            <button class="card-bookmark ${API.isProjectSaved(p.id) ? 'saved' : ''}" data-id="${p.id}" aria-label="Salvar projeto" onclick="event.preventDefault(); toggleSave(${p.id}, this)">
              <svg viewBox="0 0 24 24" fill="${API.isProjectSaved(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>
      </a>
    `).join('');
  }

  // ── Save toggle ───────────────────────────────────
  window.toggleSave = (id, btn) => {
    if (!API.isLoggedIn()) {
      showToast('Faça login para salvar projetos.', 'info');
      return;
    }
    const saved = API.toggleSaveProject(id);
    btn.classList.toggle('saved', saved);
    btn.querySelector('svg').setAttribute('fill', saved ? 'currentColor' : 'none');
    showToast(saved ? 'Projeto salvo! 🔖' : 'Projeto removido dos salvos.', saved ? 'success' : 'info');
  };

  // ── Paginação ─────────────────────────────────────
  function renderPagination(total, page, totalPages) {
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
    let html = '';
    if (page > 1) html += `<button class="page-btn" onclick="goPage(${page - 1})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    if (page < totalPages) html += `<button class="page-btn" onclick="goPage(${page + 1})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>`;
    paginationEl.innerHTML = html;
  }

  window.goPage = (p) => { filters.page = p; loadProjects(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ── Carregar dados ────────────────────────────────
  async function loadProjects() {
    if (!grid) return;
    grid.innerHTML = Array.from({ length: 6 }, () =>
      `<div class="skeleton" style="height:280px;border-radius:var(--radius);"></div>`
    ).join('');

    const res = await API.getProjects({ ...filters });
    if (!res.ok) { showToast('Erro ao carregar projetos.', 'error'); return; }
    const { projects, total, page, totalPages } = res.data;
    renderProjects(projects);
    if (countEl) countEl.textContent = `${total} projeto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    renderPagination(total, page, totalPages);
  }

  // ── Filtros ───────────────────────────────────────
  function applyFilters() {
    filters.page = 1;
    const filterChips = document.querySelectorAll('.filter-chip');
    filters.difficulty = [];
    filters.language = [];
    filters.category = [];
    filterChips.forEach(chip => {
      if (chip.classList.contains('active')) {
        filters[chip.dataset.filter].push(chip.dataset.value);
      }
    });
    loadProjects();
  }

  window.clearFilters = () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.add('active'));
    applyFilters();
  };

  // ── Init ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Filter chip toggle
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => { chip.classList.toggle('active'); applyFilters(); });
    });

    // Clear all
    document.getElementById('filter-clear-btn')?.addEventListener('click', window.clearFilters);

    // Sort
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      filters.sort = e.target.value; filters.page = 1; loadProjects();
    });

    // Mobile filter sidebar
    const sidebar = document.getElementById('filter-sidebar');
    document.getElementById('filter-open-btn')?.addEventListener('click', () => {
      sidebar?.classList.add('open');
      document.getElementById('filter-close-mobile').style.display = 'block';
    });
    document.getElementById('filter-close-mobile')?.addEventListener('click', () => {
      sidebar?.classList.remove('open');
    });

    loadProjects();

    // Admin link
    if (API.isAdmin()) {
      const al = document.getElementById('admin-link');
      if (al) al.style.display = 'flex';
    }
    // User dropdown
    const u = API.getMe();
    if (u) {
      const dn = document.getElementById('dropdown-name');
      const de = document.getElementById('dropdown-email');
      if (dn) dn.textContent = u.name;
      if (de) de.textContent = u.email;
    }
  });
})();
