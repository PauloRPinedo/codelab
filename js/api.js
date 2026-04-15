/* ===================================================
   CodeLab Explorer — js/api.js
   Camada de abstração de dados (mock → backend real)
   
   PARA INTEGRAÇÃO COM BACKEND (Parte 2):
   - Substituir mockFetch/mockPost/etc. por fetch() real
   - Definir API.baseUrl para a URL do servidor
   - Adicionar token JWT no header Authorization
   =================================================== */

const API = (() => {
  'use strict';

  // ── Configuração ─────────────────────────────────
  const BASE_URL = '/api'; // Trocar pela URL real do backend na Parte 2
  const DELAY = 300;       // Simula latência de rede

  // ── Mock Database ─────────────────────────────────
  const _db = {
    projects: [
      {
        id: 1, title: 'App de Tarefas com Local Storage',
        desc: 'Construa um gerenciador de tarefas completo com categorias, prioridades e armazenamento persistente.',
        difficulty: 'beginner', language: 'javascript', category: 'web', icon: '📝',
        tags: ['HTML', 'CSS', 'JavaScript'], image: null,
        concepts: ['Manipulação do DOM','Local Storage','Tratamento de Eventos','Operações CRUD'],
        time: '2-3 horas', prereqs: 'HTML, CSS básico',
        build: 'Um app completo de gerenciamento de tarefas com adicionar, editar, excluir, filtrar e categorias.',
        guide: [
          {t:'Montar estrutura HTML',d:'Crie o layout base com formulário de entrada e container de lista.'},
          {t:'Estilizar com CSS',d:'Aplique estilização moderna com variáveis CSS e grid responsivo.'},
          {t:'Adicionar lógica JavaScript',d:'Implemente addTask, deleteTask, toggleComplete e filter.'},
          {t:'Persistir com LocalStorage',d:'Salve e carregue tarefas do localStorage ao carregar a página.'}
        ],
        code: [{file:'app.js',lang:'javascript',code:'const addTask = (title, category) => {\n  const task = {\n    id: Date.now(),\n    title,\n    category,\n    completed: false,\n    createdAt: new Date()\n  };\n  tasks.push(task);\n  saveTasks();\n  renderTasks();\n};'}],
        challenges: [{t:'Adicionar datas de vencimento',d:'Implemente seletor de data e ordenação por prazo.'},{t:'Arrastar e soltar',d:'Permita reordenação com drag and drop.'}],
        likes: 142, saves: 89, featured: true, createdAt: '2025-03-01'
      },
      {
        id: 2, title: 'Painel do Clima', icon: '🌤️',
        desc: 'Crie um belo app de clima que exibe previsões usando uma API pública.',
        difficulty: 'beginner', language: 'javascript', category: 'web', image: null,
        tags: ['API', 'JavaScript', 'CSS Grid'],
        concepts: ['API Fetch','Parseamento JSON','Async/Await','Design Responsivo'],
        time: '3-4 horas', prereqs: 'JavaScript básico, conceitos de API',
        build: 'Um painel de clima com condições atuais e previsão de 5 dias para qualquer cidade.',
        guide: [
          {t:'Criar a interface',d:'Crie layout baseado em cards para clima atual e previsão.'},
          {t:'Configurar chamadas de API',d:'Registre-se na API OpenWeather e crie funções fetch.'},
          {t:'Exibir dados',d:'Parse a resposta JSON e atualize o DOM dinamicamente.'},
          {t:'Tratar erros',d:'Adicione estados de carregamento e erros para cidades inválidas.'}
        ],
        code: [{file:'weather.js',lang:'javascript',code:'async function getWeather(city) {\n  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;\n  const res = await fetch(url);\n  if (!res.ok) throw new Error("Cidade não encontrada");\n  return res.json();\n}'}],
        challenges: [{t:'Geolocalização',d:'Detectar localização do usuário automaticamente.'},{t:'Mapas meteorológicos',d:'Integrar mapas interativos.'}],
        likes: 98, saves: 62, featured: true, createdAt: '2025-03-15'
      },
      {
        id: 3, title: 'Aplicativo de Chat em Tempo Real', icon: '💬',
        desc: 'Construa um app de chat com salas, nomes de usuário e histórico de mensagens.',
        difficulty: 'intermediate', language: 'javascript', category: 'web', image: null,
        tags: ['WebSocket', 'Node.js', 'Express'],
        concepts: ['WebSockets','Comunicação em Tempo Real','Eventos','Modelo Cliente-Servidor'],
        time: '6-8 horas', prereqs: 'JavaScript, Node.js básico',
        build: 'Um app de chat com múltiplas salas, mensagens em tempo real e presença de usuários.',
        guide: [
          {t:'Configurar servidor',d:'Crie servidor Express com Socket.io.'},
          {t:'Construir interface',d:'Projete lista de mensagens e barra lateral de salas.'},
          {t:'Tratar eventos',d:'Implemente join, leave e message no cliente e servidor.'},
          {t:'Adicionar funcionalidades',d:'Indicadores de digitação, lista de usuários online.'}
        ],
        code: [{file:'server.js',lang:'javascript',code:'io.on("connection", (socket) => {\n  socket.on("join-room", (room) => {\n    socket.join(room);\n    socket.to(room).emit("user-joined", socket.id);\n  });\n  socket.on("message", (data) => {\n    io.to(data.room).emit("message", {\n      user: data.user,\n      text: data.text,\n      time: new Date()\n    });\n  });\n});'}],
        challenges: [{t:'Mensagens privadas',d:'Adicione DMs entre usuários.'},{t:'Reações',d:'Reações com emojis em mensagens.'}],
        likes: 215, saves: 134, featured: true, createdAt: '2025-04-01'
      },
      {
        id: 4, title: 'Jogo da Cobrinha', icon: '🐍',
        desc: 'Jogo clássico da cobrinha com pontuação, níveis e controles responsivos.',
        difficulty: 'beginner', language: 'python', category: 'games', image: null,
        tags: ['Pygame', 'Game Loop', 'POO'],
        concepts: ['Padrão Game Loop','Detecção de Colisão','Gerenciamento de Estado','POO'],
        time: '3-4 horas', prereqs: 'Python básico',
        build: 'Jogo completo com dificuldade crescente e rastreamento de pontuação.',
        guide: [
          {t:'Inicializar Pygame',d:'Configure a janela e relógio do jogo.'},
          {t:'Criar classe Snake',d:'Implemente movimento, crescimento e auto-colisão.'},
          {t:'Adicionar comida',d:'Posicionamento aleatório e incremento de pontuação.'},
          {t:'Polir jogabilidade',d:'Níveis, aumento de velocidade e game over.'}
        ],
        code: [{file:'snake.py',lang:'python',code:'class Snake:\n    def __init__(self):\n        self.body = [(5, 5), (4, 5), (3, 5)]\n        self.direction = (1, 0)\n    \n    def move(self):\n        head = self.body[0]\n        new_head = (head[0] + self.direction[0],\n                    head[1] + self.direction[1])\n        self.body.insert(0, new_head)\n        self.body.pop()'}],
        challenges: [{t:'Obstáculos',d:'Coloque paredes para evitar.'},{t:'Multiplayer',d:'Segunda cobra controlada por outro jogador.'}],
        likes: 178, saves: 110, featured: false, createdAt: '2025-04-10'
      },
      {
        id: 5, title: 'API REST com Spring Boot', icon: '☕',
        desc: 'Construa uma API CRUD completa com autenticação e integração com banco de dados.',
        difficulty: 'intermediate', language: 'java', category: 'web', image: null,
        tags: ['Java', 'Spring Boot', 'PostgreSQL'],
        concepts: ['Arquitetura REST','Injeção de Dependência','ORM (JPA)','JWT'],
        time: '8-10 horas', prereqs: 'Java intermediário, SQL básico',
        build: 'API REST pronta para produção com auth de usuários, CRUD e persistência.',
        guide: [
          {t:'Iniciar projeto',d:'Use Spring Initializr com as dependências certas.'},
          {t:'Definir modelos',d:'Crie entidades JPA e interfaces de repositório.'},
          {t:'Construir controllers',d:'Implemente endpoints REST para CRUD.'},
          {t:'Adicionar autenticação',d:'Integre Spring Security com JWT.'}
        ],
        code: [{file:'UserController.java',lang:'java',code:'@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    @Autowired\n    private UserService userService;\n\n    @GetMapping\n    public List<User> getAll() {\n        return userService.findAll();\n    }\n\n    @PostMapping\n    public User create(@RequestBody User user) {\n        return userService.save(user);\n    }\n}'}],
        challenges: [{t:'Paginação',d:'Parâmetros de consulta para paginação e busca.'},{t:'Rate limiting',d:'Middleware de limitação de taxa.'}],
        likes: 321, saves: 198, featured: true, createdAt: '2025-02-20'
      },
      {
        id: 6, title: 'Visualizador de Árvore Binária', icon: '🌳',
        desc: 'ABB interativa com operações de inserção, remoção e busca visualizadas.',
        difficulty: 'advanced', language: 'cpp', category: 'data-structures', image: null,
        tags: ['C++', 'Estruturas de Dados', 'Gráficos'],
        concepts: ['Árvores Binárias','Percurso','Recursão','Gerenciamento de Memória'],
        time: '8-10 horas', prereqs: 'C++ intermediário, Estruturas de Dados',
        build: 'Ferramenta gráfica de ABB com inserção, remoção, busca e animações.',
        guide: [
          {t:'Implementar ABB',d:'Crie struct Node e classe BST com operações.'},
          {t:'Percursos',d:'Implemente em-ordem, pré-ordem e pós-ordem.'},
          {t:'Visualização',d:'Use SFML ou similar para renderizar a árvore.'},
          {t:'Animações',d:'Destaque nós durante operações.'}
        ],
        code: [{file:'bst.cpp',lang:'cpp',code:'struct Node {\n    int value;\n    Node* left;\n    Node* right;\n    Node(int v) : value(v), left(nullptr), right(nullptr) {}\n};\n\nNode* insert(Node* root, int val) {\n    if (!root) return new Node(val);\n    if (val < root->value)\n        root->left = insert(root->left, val);\n    else\n        root->right = insert(root->right, val);\n    return root;\n}'}],
        challenges: [{t:'AVL',d:'Auto-balanceamento AVL.'},{t:'Rubro-Negra',d:'Suporte a árvore rubro-negra.'}],
        likes: 89, saves: 67, featured: false, createdAt: '2025-01-15'
      },
      {
        id: 7, title: 'Rede Neural do Zero', icon: '🧠',
        desc: 'Implemente uma rede neural com propagação direta e retro-propagação.',
        difficulty: 'advanced', language: 'python', category: 'ai-ml', image: null,
        tags: ['Python', 'NumPy', 'Machine Learning'],
        concepts: ['Redes Neurais','Gradiente Descendente','Retro-propagação','Álgebra Linear'],
        time: '10-12 horas', prereqs: 'Python, Álgebra Linear, Cálculo',
        build: 'Biblioteca de rede neural com camadas configuráveis e treinamento.',
        guide: [
          {t:'Operações matriciais',d:'Implemente multiplicações com NumPy.'},
          {t:'Propagação direta',d:'Construa a passagem feed-forward.'},
          {t:'Funções de perda',d:'Implemente MSE e entropia cruzada.'},
          {t:'Retro-propagação',d:'Calcule gradientes e atualize pesos.'}
        ],
        code: [{file:'nn.py',lang:'python',code:'class Layer:\n    def __init__(self, n_input, n_output):\n        self.weights = np.random.randn(n_input, n_output) * 0.1\n        self.bias = np.zeros((1, n_output))\n    \n    def forward(self, x):\n        self.input = x\n        return x @ self.weights + self.bias\n    \n    def backward(self, grad, lr=0.01):\n        dw = self.input.T @ grad\n        self.weights -= lr * dw\n        return grad @ self.weights.T'}],
        challenges: [{t:'Camada convolucional',d:'CNN para imagens.'},{t:'GPU',d:'CuPy para GPU.'}],
        likes: 264, saves: 187, featured: false, createdAt: '2025-02-01'
      },
      {
        id: 8, title: 'Gerenciador de Arquivos CLI', icon: '🗂️',
        desc: 'Gerenciador de arquivos via terminal com navegação, pré-visualização e operações.',
        difficulty: 'intermediate', language: 'rust', category: 'cli', image: null,
        tags: ['Rust', 'TUI', 'Sistemas'],
        concepts: ['APIs de Sistema de Arquivos','TUI','Tratamento de Erros','Ownership'],
        time: '6-8 horas', prereqs: 'Rust básico, conceitos de terminal',
        build: 'Gerenciador TUI com navegação, pré-visualização e operações de arquivo.',
        guide: [
          {t:'Framework TUI',d:'Use ratatui para renderização no terminal.'},
          {t:'Listagem de diretórios',d:'Leia e exiba o conteúdo com metadados.'},
          {t:'Operações de arquivo',d:'Copiar, mover, renomear e excluir.'},
          {t:'Pré-visualização',d:'Conteúdo de texto em painel lateral.'}
        ],
        code: [{file:'main.rs',lang:'rust',code:'use std::fs;\n\nfn list_dir(path: &str) -> Vec<FileEntry> {\n    fs::read_dir(path)\n        .expect("Falha ao ler diretório")\n        .filter_map(|entry| {\n            let entry = entry.ok()?;\n            Some(FileEntry {\n                name: entry.file_name().to_string_lossy().to_string(),\n                is_dir: entry.file_type().ok()?.is_dir(),\n                size: entry.metadata().ok()?.len(),\n            })\n        })\n        .collect()\n}'}],
        challenges: [{t:'Busca fuzzy',d:'Busca fuzzy de nomes de arquivo.'},{t:'Git',d:'Indicadores de status git.'}],
        likes: 143, saves: 88, featured: false, createdAt: '2025-03-20'
      },
    ],

    users: [
      { id: 1, name: 'Admin Silva', email: 'admin@codelab.edu', role: 'admin', status: 'active', initials: 'AS', joined: '2025-01-01', projectsDone: 0 },
      { id: 2, name: 'Ana Beatriz', email: 'ana@email.com', role: 'student', status: 'active', initials: 'AB', joined: '2025-02-10', projectsDone: 8 },
      { id: 3, name: 'Carlos Mendes', email: 'carlos@email.com', role: 'student', status: 'active', initials: 'CM', joined: '2025-02-18', projectsDone: 12 },
      { id: 4, name: 'Daniela Costa', email: 'daniela@email.com', role: 'student', status: 'active', initials: 'DC', joined: '2025-03-01', projectsDone: 5 },
      { id: 5, name: 'Eduardo Lima', email: 'edu@email.com', role: 'student', status: 'inactive', initials: 'EL', joined: '2025-03-15', projectsDone: 2 },
    ],

    ideaBank: [
      { title: 'Rastreador de Orçamento Pessoal', desc: 'Acompanhe receitas e despesas com gráficos e categorias.', features: ['Adicionar/editar transações','Gráficos de pizza por categoria','Relatórios mensais','Exportar para CSV'], objectives: ['Visualização de dados','Gerenciamento de estado','Validação de formulários','Entrada/Saída de arquivos'] },
      { title: 'App de Busca de Receitas', desc: 'Busque receitas pelos ingredientes e salve favoritas.', features: ['Busca por ingredientes','Visualização da receita','Lista de favoritos','Lista de compras'], objectives: ['Integração com API','Algoritmos de busca','Local Storage','UI/UX'] },
      { title: 'Timer Pomodoro', desc: 'Timer de produtividade com intervalos e estatísticas.', features: ['Intervalos configuráveis','Histórico','Sons de notificação','Estatísticas'], objectives: ['APIs de Timer','API de Áudio','Persistência','Notificações'] },
      { title: 'Editor de Notas Markdown', desc: 'Anotações com pré-visualização Markdown ao vivo.', features: ['Pré-visualização ao vivo','Pastas de notas','Busca','Exportar HTML/PDF'], objectives: ['Parse Markdown','Renderização','Arquivos','Atalhos'] },
      { title: 'Jogo da Memória', desc: 'Encontre pares com temas e níveis de dificuldade.', features: ['Múltiplos temas','Níveis','Pontuação','Timer'], objectives: ['Lógica de jogo','Animações CSS','Estado','Embaralhamento'] },
      { title: 'Encurtador de URL', desc: 'URLs curtas com rastreamento de cliques.', features: ['Encurtamento','Análise','QR code','Aliases'], objectives: ['Backend APIs','Banco de dados','Hash','Visualização'] },
    ],

    // Estado do usuário logado (mock)
    currentUser: null,
    savedProjects: [],
    completedProjects: [],
  };

  // ── Helpers internos ─────────────────────────────
  function _delay(ms = DELAY) { return new Promise(res => setTimeout(res, ms)); }
  function _ok(data) { return { ok: true, data }; }
  function _err(msg) { return { ok: false, error: msg }; }
  function _nextId(arr) { return Math.max(0, ...arr.map(x => x.id)) + 1; }

  // ══════════════════════════════════════════════════
  //   PROJECTS — CRUD
  // ══════════════════════════════════════════════════

  /**
   * GET /api/projects
   * @param {Object} filters - { difficulty[], language[], category[], search, page, limit }
   */
  async function getProjects(filters = {}) {
    await _delay();
    let data = [..._db.projects];
    // Filtros
    if (filters.difficulty?.length) data = data.filter(p => filters.difficulty.includes(p.difficulty));
    if (filters.language?.length)   data = data.filter(p => filters.language.includes(p.language));
    if (filters.category?.length)   data = data.filter(p => filters.category.includes(p.category));
    if (filters.search)             data = data.filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase()) || p.desc.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.featured)           data = data.filter(p => p.featured);
    // Ordenação
    if (filters.sort === 'popular') data.sort((a, b) => b.likes - a.likes);
    else if (filters.sort === 'newest') data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const total = data.length;
    const start = (page - 1) * limit;
    data = data.slice(start, start + limit);
    return _ok({ projects: data, total, page, totalPages: Math.ceil(total / limit) });
  }

  /**
   * GET /api/projects/:id
   */
  async function getProject(id) {
    await _delay();
    const project = _db.projects.find(p => p.id === Number(id));
    if (!project) return _err('Projeto não encontrado');
    return _ok(project);
  }

  /**
   * POST /api/projects  (admin)
   */
  async function createProject(data) {
    await _delay();
    const project = { ...data, id: _nextId(_db.projects), likes: 0, saves: 0, createdAt: new Date().toISOString().split('T')[0] };
    _db.projects.push(project);
    return _ok(project);
  }

  /**
   * PUT /api/projects/:id  (admin)
   */
  async function updateProject(id, data) {
    await _delay();
    const idx = _db.projects.findIndex(p => p.id === Number(id));
    if (idx === -1) return _err('Projeto não encontrado');
    _db.projects[idx] = { ..._db.projects[idx], ...data };
    return _ok(_db.projects[idx]);
  }

  /**
   * DELETE /api/projects/:id  (admin)
   */
  async function deleteProject(id) {
    await _delay();
    const idx = _db.projects.findIndex(p => p.id === Number(id));
    if (idx === -1) return _err('Projeto não encontrado');
    _db.projects.splice(idx, 1);
    return _ok({ deleted: true });
  }

  // ══════════════════════════════════════════════════
  //   AUTENTICAÇÃO
  // ══════════════════════════════════════════════════

  /**
   * POST /api/auth/login
   */
  async function login({ email, password }) {
    await _delay(400);
    // Mock: aceita qualquer senha com emails conhecidos
    const user = _db.users.find(u => u.email === email);
    if (!user) return _err('Email não encontrado');
    if (password.length < 4) return _err('Senha incorreta');
    // Simula token JWT
    const token = `mock_jwt_${user.id}_${Date.now()}`;
    localStorage.setItem('cl_token', token);
    localStorage.setItem('cl_user', JSON.stringify(user));
    _db.currentUser = user;
    return _ok({ user, token });
  }

  /**
   * POST /api/auth/register
   */
  async function register({ name, email, password }) {
    await _delay(400);
    if (_db.users.find(u => u.email === email)) return _err('Email já cadastrado');
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const user = {
      id: _nextId(_db.users), name, email, role: 'student', status: 'active',
      initials, joined: new Date().toISOString().split('T')[0], projectsDone: 0
    };
    _db.users.push(user);
    const token = `mock_jwt_${user.id}_${Date.now()}`;
    localStorage.setItem('cl_token', token);
    localStorage.setItem('cl_user', JSON.stringify(user));
    _db.currentUser = user;
    return _ok({ user, token });
  }

  /**
   * POST /api/auth/logout
   */
  function logout() {
    localStorage.removeItem('cl_token');
    localStorage.removeItem('cl_user');
    _db.currentUser = null;
    return _ok({ loggedOut: true });
  }

  /**
   * GET /api/auth/me  — Retorna usuário atual do localStorage
   */
  function getMe() {
    const raw = localStorage.getItem('cl_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function isLoggedIn() { return !!localStorage.getItem('cl_token'); }
  function isAdmin() { const u = getMe(); return u?.role === 'admin'; }

  // ══════════════════════════════════════════════════
  //   UPLOAD DE IMAGEM (mock)
  //   Na Parte 2: multipart/form-data para o backend
  // ══════════════════════════════════════════════════

  /**
   * POST /api/uploads/images
   * @param {File} file
   * @returns {Promise} URL da imagem no servidor (mock: object URL)
   */
  async function uploadImage(file) {
    await _delay(600);
    if (!file.type.startsWith('image/')) return _err('Arquivo deve ser uma imagem');
    if (file.size > 5 * 1024 * 1024) return _err('Imagem deve ter menos de 5MB');
    // Mock: retorna URL local do arquivo
    const url = URL.createObjectURL(file);
    return _ok({ url, filename: file.name });
  }

  // ══════════════════════════════════════════════════
  //   PROJETOS SALVOS DO USUÁRIO
  // ══════════════════════════════════════════════════

  function getSavedProjects() {
    const raw = localStorage.getItem('cl_saved') || '[]';
    try { return JSON.parse(raw); } catch { return []; }
  }

  function toggleSaveProject(projectId) {
    const saved = getSavedProjects();
    const idx = saved.indexOf(projectId);
    if (idx === -1) saved.push(projectId);
    else saved.splice(idx, 1);
    localStorage.setItem('cl_saved', JSON.stringify(saved));
    return idx === -1; // true = salvo, false = removido
  }

  function isProjectSaved(projectId) { return getSavedProjects().includes(projectId); }

  // ══════════════════════════════════════════════════
  //   USERS (admin)
  // ══════════════════════════════════════════════════

  async function getUsers() {
    await _delay();
    return _ok([..._db.users]);
  }

  // ══════════════════════════════════════════════════
  //   IDEIA GENERATOR
  // ══════════════════════════════════════════════════

  function getRandomIdea({ language, difficulty, categories } = {}) {
    const bank = [..._db.ideaBank];
    const idea = bank[Math.floor(Math.random() * bank.length)];
    return { ...idea, language, difficulty };
  }

  // ══════════════════════════════════════════════════
  //   SEARCH
  // ══════════════════════════════════════════════════

  function searchAll(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const projects = _db.projects
      .filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
      .slice(0, 5)
      .map(p => ({ id: p.id, title: p.title, type: 'Projeto', icon: p.icon }));
    return projects;
  }

  // ── Exportar API pública ──────────────────────────
  return {
    // Projects (CRUD para backend Parte 2)
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    // Auth
    login,
    register,
    logout,
    getMe,
    isLoggedIn,
    isAdmin,
    // Upload
    uploadImage,
    // User data
    getSavedProjects,
    toggleSaveProject,
    isProjectSaved,
    // Admin
    getUsers,
    // Generator
    getRandomIdea,
    // Search
    searchAll,
  };
})();
