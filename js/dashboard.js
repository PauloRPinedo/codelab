/* ===================================================
   js/dashboard.js — Lógica do painel do estudante
   =================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {
    // Verificação de auth — redireciona se não logado
    // Para demo, permite acesso sem login com dados mock
    const user = API.getMe() || { name: 'Visitante Demo', initials: 'VD', role: 'student', email: '' };

    // Preencher dados do usuário
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('dash-avatar', user.initials || 'VD');
    set('dash-name', user.name);
    set('dash-role-label', user.role === 'admin' ? '👑 Administrador' : '🎓 Estudante');
    set('welcome-name', user.name.split(' ')[0]);
    set('dropdown-name', user.name);
    set('dropdown-email', user.email);

    // Admin link
    if (API.isAdmin()) {
      const al = document.getElementById('admin-link');
      if (al) al.style.display = 'flex';
    }

    // ── Projetos recomendados ──────────────────────
    const recRes = await API.getProjects({ sort: 'popular', limit: 3 });
    const recList = document.getElementById('recommended-list');
    if (recList && recRes.ok) {
      const projects = recRes.data.projects;
      recList.innerHTML = projects.map(p => `
        <a href="project-detail.html?id=${p.id}" class="recommended-item">
          <span class="recommended-icon">${p.icon}</span>
          <div class="recommended-info">
            <h5>${escHtml(p.title)}</h5>
            <p>${p.difficulty === 'beginner' ? 'Iniciante' : p.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'} · ${p.time}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:var(--text-muted);flex-shrink:0;margin-left:auto;"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      `).join('');
    }

    // ── Projetos salvos ───────────────────────────
    const savedIds = API.getSavedProjects();
    const savedGrid = document.getElementById('saved-grid');
    if (savedGrid) {
      if (!savedIds.length) {
        savedGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:32px; color:var(--text-muted);">
          <div style="font-size:2rem;margin-bottom:8px;">🔖</div>
          <p style="font-size:.88rem;">Você ainda não salvou nenhum projeto. <a href="projects.html" style="color:var(--primary);">Explorar projetos</a></p>
        </div>`;
      } else {
        // Buscar os projetos salvos
        const allRes = await API.getProjects({ limit: 100 });
        if (allRes.ok) {
          const all = allRes.data.projects;
          const saved = all.filter(p => savedIds.includes(p.id)).slice(0, 6);
          savedGrid.innerHTML = saved.map(p => `
            <a href="project-detail.html?id=${p.id}" class="saved-item-dash">
              <h5>${p.icon} ${escHtml(p.title)}</h5>
              <p>${p.difficulty === 'beginner' ? 'Iniciante' : p.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'} · ${p.tags.slice(0,2).join(', ')}</p>
            </a>
          `).join('');
        }
      }
    }

    // ── Navegação do sidebar ───────────────────────
    const navItems = document.querySelectorAll('.dash-nav-item[data-section]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        // Scroll para a seção (por ora tudo é "overview" - expandível na Parte 2)
        showToast(`Seção: ${item.textContent.trim()}`, 'info');
      });
    });
  });
})();
