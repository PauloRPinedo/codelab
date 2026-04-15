/* ===================================================
   js/admin.js — Lógica do painel administrativo
   CRUD de projetos, usuários, upload de imagem
   =================================================== */
(function () {
  'use strict';

  // ── Estado ────────────────────────────────────────
  let allProjects = [];
  let pendingDeleteId = null;
  const tags = [];
  const concepts = [];

  // ── Navegação entre painéis ───────────────────────
  window.switchPanel = (name) => {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-nav-item[data-panel]').forEach(n => n.classList.remove('active'));
    const panel = document.getElementById(`panel-${name}`);
    const nav = document.querySelector(`.admin-nav-item[data-panel="${name}"]`);
    if (panel) panel.classList.add('active');
    if (nav) nav.classList.add('active');
    if (name === 'projects') loadProjectsTable();
    if (name === 'users') loadUsersTable();
    if (name === 'create') resetForm();
  };

  // ── Carregar estatísticas do dashboard ────────────
  async function loadStats() {
    const [projRes, userRes] = await Promise.all([
      API.getProjects({ limit: 100 }),
      API.getUsers(),
    ]);
    if (projRes.ok) {
      document.getElementById('stat-total-projects').textContent = projRes.data.total;
      document.getElementById('badge-projects').textContent = projRes.data.total;
      allProjects = projRes.data.projects;
    }
    if (userRes.ok) {
      const students = userRes.data.filter(u => u.role === 'student');
      document.getElementById('stat-total-users').textContent = students.length;
      document.getElementById('badge-users').textContent = userRes.data.length;
    }
  }

  // ── Tabela de Projetos ────────────────────────────
  async function loadProjectsTable(searchTerm = '', diffFilter = '') {
    const tbody = document.getElementById('projects-table-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">Carregando...</td></tr>`;

    const res = await API.getProjects({ limit: 100 });
    if (!res.ok) { showToast('Erro ao carregar projetos.', 'error'); return; }
    allProjects = res.data.projects;

    let filtered = allProjects;
    if (searchTerm) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (diffFilter) filtered = filtered.filter(p => p.difficulty === diffFilter);

    const info = document.getElementById('projects-table-info');
    if (info) info.textContent = `${filtered.length} projeto${filtered.length !== 1 ? 's' : ''}`;

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">Nenhum projeto encontrado.</td></tr>`;
      return;
    }

    const diffLabel = (d) => d === 'beginner' ? 'Iniciante' : d === 'intermediate' ? 'Intermediário' : 'Avançado';
    const catLabel  = (c) => ({ web: 'Apps Web', games: 'Jogos', algorithms: 'Algoritmos', 'data-structures': 'Estrut. Dados', 'ai-ml': 'IA & ML', cli: 'CLI' }[c] || c);

    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td>
          <div class="table-project-cell">
            <div class="table-project-icon">${p.icon}</div>
            <div class="table-project-info">
              <h5>${escHtml(p.title)}</h5>
              <p>${p.language} · ${p.time || '—'}</p>
            </div>
          </div>
        </td>
        <td><span class="badge badge-${p.difficulty}">${diffLabel(p.difficulty)}</span></td>
        <td>${p.language.charAt(0).toUpperCase() + p.language.slice(1)}</td>
        <td>${catLabel(p.category)}</td>
        <td>❤️ ${p.likes}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" title="Editar projeto" onclick="editProject(${p.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <a href="project-detail.html?id=${p.id}" target="_blank" class="action-btn" title="Ver projeto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
            <button class="action-btn delete" title="Excluir projeto" onclick="confirmDelete(${p.id}, '${escHtml(p.title)}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ── Tabela de Usuários ────────────────────────────
  async function loadUsersTable(searchTerm = '') {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">Carregando...</td></tr>`;
    const res = await API.getUsers();
    if (!res.ok) { showToast('Erro ao carregar usuários.', 'error'); return; }
    let users = res.data;
    if (searchTerm) users = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    tbody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar-sm">${u.initials}</div>
            <div class="user-info-cell">
              <h5>${escHtml(u.name)}</h5>
              <p>${u.id === API.getMe()?.id ? 'Você' : ''}</p>
            </div>
          </div>
        </td>
        <td style="font-size:.84rem;color:var(--text-secondary);">${escHtml(u.email)}</td>
        <td><span class="role-badge role-${u.role}">${u.role === 'admin' ? '👑 Admin' : '🎓 Estudante'}</span></td>
        <td>
          <span class="status-badge status-${u.status}">
            <span class="status-dot"></span>
            ${u.status === 'active' ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td>${u.projectsDone}</td>
        <td style="font-size:.82rem;color:var(--text-muted);">${new Date(u.joined).toLocaleDateString('pt-BR')}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn" title="Ver perfil" onclick="showToast('Funcionalidade disponível na Parte 2 (Backend).', 'info')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            ${u.role !== 'admin' ? `
            <button class="action-btn delete" title="Remover usuário" onclick="showToast('Requer autorização de backend. Disponível na Parte 2.', 'info')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ── Editar Projeto ────────────────────────────────
  window.editProject = (id) => {
    const p = allProjects.find(x => x.id === id);
    if (!p) return;
    switchPanel('create');
    document.getElementById('form-panel-title').textContent = 'Editar Projeto';
    document.getElementById('submit-label').textContent = 'Salvar Alterações';
    document.getElementById('edit-project-id').value = id;

    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
    set('proj-title', p.title);
    set('proj-desc', p.desc);
    set('proj-build', p.build);
    set('proj-icon', p.icon);
    set('proj-time', p.time);
    set('proj-difficulty', p.difficulty);
    set('proj-language', p.language);
    set('proj-category', p.category);
    set('proj-prereqs', p.prereqs);
    const featuredCb = document.getElementById('proj-featured');
    if (featuredCb) featuredCb.checked = !!p.featured;

    // Limpar e repopular tags
    clearTagTokens('tags-wrap', tags);
    (p.tags || []).forEach(t => addTagToken('tags-wrap', tags, t));
    document.getElementById('proj-tags').value = JSON.stringify(tags);

    clearTagTokens('concepts-wrap', concepts);
    (p.concepts || []).forEach(c => addTagToken('concepts-wrap', concepts, c));
    document.getElementById('proj-concepts').value = JSON.stringify(concepts);

    // Preview de imagem se existir
    if (p.image) {
      const preview = document.getElementById('cover-preview');
      preview.src = p.image;
      preview.classList.add('visible');
      document.getElementById('image-drop-zone').style.display = 'none';
    }
  };

  // ── Excluir Projeto ───────────────────────────────
  window.confirmDelete = (id, name) => {
    pendingDeleteId = id;
    document.getElementById('delete-project-name').textContent = name;
    document.getElementById('delete-modal').classList.add('active');
  };
  window.closeDeleteModal = () => {
    pendingDeleteId = null;
    document.getElementById('delete-modal').classList.remove('active');
  };

  // ── Tags helper ───────────────────────────────────
  function addTagToken(wrapId, arr, value) {
    const val = value.trim();
    if (!val || arr.includes(val)) return;
    arr.push(val);
    const wrap = document.getElementById(wrapId);
    const input = wrap.querySelector('.tags-input-field');
    const token = document.createElement('div');
    token.className = 'tag-item';
    token.innerHTML = `${escHtml(val)} <span class="tag-remove">×</span>`;
    token.querySelector('.tag-remove').addEventListener('click', () => {
      const idx = arr.indexOf(val);
      if (idx !== -1) arr.splice(idx, 1);
      token.remove();
    });
    wrap.insertBefore(token, input);
    input.value = '';
  }

  function clearTagTokens(wrapId, arr) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.querySelectorAll('.tag-item').forEach(t => t.remove());
    arr.length = 0;
  }

  function initTagsInput(inputId, wrapId, hiddenId, arr) {
    const input = document.getElementById(inputId);
    const hidden = document.getElementById(hiddenId);
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTagToken(wrapId, arr, input.value);
        if (hidden) hidden.value = JSON.stringify(arr);
      }
    });
  }

  function resetForm() {
    document.getElementById('form-panel-title').textContent = 'Novo Projeto';
    document.getElementById('submit-label').textContent = 'Publicar Projeto';
    document.getElementById('project-form').reset();
    document.getElementById('edit-project-id').value = '';
    clearTagTokens('tags-wrap', tags);
    clearTagTokens('concepts-wrap', concepts);
    const preview = document.getElementById('cover-preview');
    if (preview) { preview.src = ''; preview.classList.remove('visible'); }
    const dropZone = document.getElementById('image-drop-zone');
    if (dropZone) dropZone.style.display = 'block';
  }

  // ── Image Upload ───────────────────────────────────
  function initImageUpload() {
    const dropZone = document.getElementById('image-drop-zone');
    const fileInput = document.getElementById('cover-upload');
    const preview = document.getElementById('cover-preview');
    const infoEl = document.getElementById('cover-info');
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handleImageFile(e.target.files[0]);
    });

    async function handleImageFile(file) {
      showToast('Enviando imagem...', 'info');
      const res = await API.uploadImage(file);
      if (!res.ok) { showToast(res.error, 'error'); return; }
      preview.src = res.data.url;
      preview.classList.add('visible');
      dropZone.style.display = 'none';
      if (infoEl) { infoEl.style.display = 'block'; infoEl.textContent = `${file.name} · ${(file.size / 1024).toFixed(0)} KB`; }
      showToast('Imagem carregada! ✅', 'success');
    }
  }

  // ── Submit Formulário ─────────────────────────────
  async function handleProjectSubmit(e) {
    e.preventDefault();
    const get = (id) => document.getElementById(id)?.value?.trim();
    const title = get('proj-title');
    const desc = get('proj-desc');
    const difficulty = get('proj-difficulty');
    const language = get('proj-language');
    const category = get('proj-category');
    if (!title || !desc || !difficulty || !language || !category) {
      showToast('Preencha todos os campos obrigatórios (*).', 'error');
      return;
    }
    const editId = get('edit-project-id');
    const projectData = {
      title, desc,
      build: get('proj-build'),
      icon: get('proj-icon') || '📁',
      time: get('proj-time') || '—',
      difficulty, language, category,
      prereqs: get('proj-prereqs') || '—',
      tags: [...tags],
      concepts: [...concepts],
      featured: document.getElementById('proj-featured')?.checked || false,
      image: document.getElementById('cover-preview')?.src || null,
      guide: [], code: [], challenges: [],
    };

    const submitBtn = document.getElementById('submit-project-btn');
    const submitLabel = document.getElementById('submit-label');
    submitBtn.disabled = true;
    submitLabel.textContent = 'Salvando...';

    let res;
    if (editId) {
      res = await API.updateProject(parseInt(editId), projectData);
    } else {
      res = await API.createProject(projectData);
    }

    submitBtn.disabled = false;
    submitLabel.textContent = editId ? 'Salvar Alterações' : 'Publicar Projeto';

    if (!res.ok) { showToast(`Erro: ${res.error}`, 'error'); return; }
    showToast(editId ? 'Projeto atualizado! ✅' : 'Projeto publicado! 🚀', 'success');
    resetForm();
    switchPanel('projects');
  }

  // ── Init ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Verificação básica de admin (sem bloquear no modo demo)
    const user = API.getMe();
    if (user) {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('user-name-nav', user.name.split(' ')[0]);
      set('user-initials-nav', user.initials);
    }
    if (user && user.role !== 'admin') {
      showToast('⚠️ Modo demo: acesso admin restrito. Use admin@codelab.edu para full access.', 'warning', 5000);
    }

    // Carregar stats do dashboard
    loadStats();

    // Nav items
    document.querySelectorAll('.admin-nav-item[data-panel]').forEach(item => {
      item.addEventListener('click', () => switchPanel(item.dataset.panel));
    });

    // Search filtros
    document.getElementById('project-search')?.addEventListener('input', (e) => {
      loadProjectsTable(e.target.value, document.getElementById('diff-filter-admin')?.value);
    });
    document.getElementById('diff-filter-admin')?.addEventListener('change', (e) => {
      loadProjectsTable(document.getElementById('project-search')?.value, e.target.value);
    });
    document.getElementById('user-search')?.addEventListener('input', (e) => {
      loadUsersTable(e.target.value);
    });

    // Tags inputs
    initTagsInput('tags-input', 'tags-wrap', 'proj-tags', tags);
    initTagsInput('concepts-input', 'concepts-wrap', 'proj-concepts', concepts);

    // Image upload
    initImageUpload();

    // Form submit
    document.getElementById('project-form')?.addEventListener('submit', handleProjectSubmit);

    // Delete confirm
    document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      const res = await API.deleteProject(pendingDeleteId);
      closeDeleteModal();
      if (res.ok) {
        showToast('Projeto excluído.', 'success');
        loadProjectsTable();
        loadStats();
      } else {
        showToast(`Erro ao excluir: ${res.error}`, 'error');
      }
    });

    // Logout
    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
      API.logout();
      showToast('Sessão encerrada.', 'info');
      setTimeout(() => window.location.href = resolvePath('index.html'), 800);
    });

    // Close delete modal on backdrop click
    document.getElementById('delete-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('delete-modal')) closeDeleteModal();
    });
  });
})();
