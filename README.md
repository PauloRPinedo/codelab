# CodeLab Explorer

## Descrição do Projeto

O **CodeLab Explorer** é uma plataforma educacional inovadora focada em ajudar estudantes de programação a aprenderem através da prática. A plataforma permite que professores sugiram e detalhem projetos reais, enquanto os estudantes obtêm guias passo a passo, desafios progressivos e uma trilha de aprendizado personalizada. O sistema conta com recursos modernos, animações suaves e um design dinâmico.

## Funcionalidades Principais

- **Exploração de Projetos**: Os estudantes podem filtrar e explorar uma vasta biblioteca de projetos por linguagem, nível de dificuldade e categoria.
- **Gerador de Ideias**: Uma ferramenta interativa que sugere projetos de programação baseados em preferências (linguagem de programação, nível de dificuldade), fornecendo além disso objetivos e funcionalidades esperadas.
- **Painel do Estudante (Dashboard)**: Acompanhamento de progresso, gestão de projetos e controle de atividades.
- **Painel de Administração**: Espaço dedicado para gerenciamento de usuários e projetos na plataforma.
- **Perfil do Usuário**: Gerenciamento das informações pessoais, dados da conta e estado de login.
- **Modo Claro/Escuro**: Suporte a alternância de temas (Dark Theme / Light Theme) para maior conforto visual.
- **Responsividade**: Layout que se adapta perfeitamente em dispositivos móveis, tablets e desktops (Mobile Menu).

## Estrutura do Projeto

O repositório é moldado em uma arquitetura modular "multi-page" (Múltiplas páginas) e está organizado da seguinte maneira:

```text
/
├── index.html              # Landing page principal
├── js/                     # Códigos e Lógicas JavaScript
│   ├── api.js              # Serviços e simulação de banco de dados/API
│   ├── core.js             # Funções centrais da UI, gerenciamento de estado e utilidades
│   ├── admin.js            # Lógica pertinente ao Painel de Administração
│   ├── dashboard.js        # Lógica pertinente ao Painel de Estudante (Dashboard)
│   └── projects.js         # Lógica da seção de listagem e de filtragem
├── pages/                  # Telas da Aplicação
│   ├── admin.html          # Painel Admin (Dashboard Administrativo)
│   ├── dashboard.html      # Meu Painel (Visão do Estudante)
│   ├── login.html          # Autenticação (Entrar/Criar Conta)
│   ├── profile.html        # Perfil Visualização/Edição
│   ├── project-detail.html # Detalhes da trilha de um projeto específico
│   └── projects.html       # Explorador da biblioteca de projetos
└── styles/                 # Estilização
    ├── admin.css           # Estilos exclusivos do Admin
    ├── main.css            # Estilos base globais, variáveis e Design System
    └── pages.css           # Estilos estruturais de suporte às telas individuais
```

## Tecnologias Utilizadas

A concepção da aplicação tem como foco a alta performance, independência de frameworks e um design rico ("Premium"):

- **HTML5**: Semântica, Acessibilidade e estruturação modular (Múltiplos arquivos isolados por finalidade).
- **CSS3 Vanilla**: Moderno, flexível e utilizando o conceito de variáveis nativas CSS. Foi implementado usando *Flexbox*, *CSS Grid*, transições e keyframes responsivos.
- **JavaScript Funcional (Vanilla JS)**: Código modular que gerencia o estado da aplicação e consumo dinâmico das informações mockadas (`api.js`), dispensando de dependências terceiras complexas.

## Autores / Desenvolvedores

Este projeto é desenvolvido e mantido por:

- **Gabriel Demba** (15618344)
- **Wiltord N M** (15595392)
- **Paulo R Pinedo** (17819748)
- **José T Pereda** (17819651)
