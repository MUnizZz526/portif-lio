/* ==========================================================================
   CYBERDEV // JAVASCRIPT ENGINE
   Features:
   1. Interactive Matrix/Grid Particle Canvas
   2. Terminal CLI Emulator with interactive commands & Easter eggs
   3. Real Graph Search Algorithm Runner (Dijkstra, A*, BFS) on HTML5 Canvas
   4. Project Filter & Architecture Modal Viewer
   5. Web Audio API Cyber Synthesizer (SFX)
   6. Bilingual System (PT-BR / EN)
   7. Typing Effect & Toast Notifications
   ========================================================================== */

(function () {
  'use strict';

  /* --- 1. WEB AUDIO API CYBER SYNTHESIZER --- */
  class CyberAudio {
    constructor() {
      this.enabled = false;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.init();
        this.playBeep(880, 0.08, 'sine');
      }
      return this.enabled;
    }

    playBeep(freq = 600, duration = 0.06, type = 'sine', volume = 0.05) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error fallback
      }
    }

    playKeyClick() {
      if (!this.enabled) return;
      this.playBeep(1200 + Math.random() * 400, 0.03, 'triangle', 0.03);
    }

    playSuccess() {
      if (!this.enabled) return;
      setTimeout(() => this.playBeep(523.25, 0.08, 'sine', 0.06), 0);
      setTimeout(() => this.playBeep(659.25, 0.08, 'sine', 0.06), 90);
      setTimeout(() => this.playBeep(783.99, 0.15, 'sine', 0.06), 180);
    }
  }

  const sfx = new CyberAudio();

  // Audio Toggle Button
  const sfxBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxText = document.getElementById('sfx-text');

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      const active = sfx.toggle();
      if (active) {
        sfxIcon.className = 'fa-solid fa-volume-high';
        sfxText.textContent = 'SFX: ON';
        showToast('Áudio Cyberpunk Ativado [Bleeps Ligados]');
      } else {
        sfxIcon.className = 'fa-solid fa-volume-xmark';
        sfxText.textContent = 'SFX: OFF';
        showToast('Áudio Silenciado');
      }
    });
  }

  /* --- 2. CYBER CANVAS: PARTICLES + MATRIX MODE --- */
  const canvas = document.getElementById('cyber-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let matrixMode = false;
  let matrixDrops = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    initMatrix();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.3 ? '#00f0ff' : '#ff0055'
      });
    }
  }

  function initMatrix() {
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    matrixDrops = [];
    for (let i = 0; i < columns; i++) {
      matrixDrops[i] = Math.floor(Math.random() * -50);
    }
  }

  const matrixChars = '01ABCDEFΩΨλπ∑√∂∆<>/{}=+*~#@!010101';

  function renderCanvas() {
    if (!ctx || !canvas) return;

    if (matrixMode) {
      ctx.fillStyle = 'rgba(5, 7, 12, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = '13px "JetBrains Mono", monospace';

      for (let i = 0; i < matrixDrops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * 14;
        const y = matrixDrops[i] * 14;

        if (Math.random() > 0.85) {
          ctx.fillStyle = '#00f0ff';
        } else {
          ctx.fillStyle = '#00ff66';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
    }

    requestAnimationFrame(renderCanvas);
  }

  if (canvas) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    renderCanvas();
  }

  /* --- 3. HERO TYPING ROTATOR --- */
  const roles = [
    'Estudante de Ciência da Computação',
    'Desenvolvedor Full Stack Web',
    'Engenharia de Backend & APIs',
    'Algoritmos & Estruturas de Dados',
    'DevOps, Linux & Docker'
  ];

  const typingTarget = document.getElementById('typing-role');
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeRole() {
    if (!typingTarget) return;

    const currentRole = roles[roleIdx];
    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 1800; // Pause at full string
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeRole, typeSpeed);
  }
  typeRole();

  /* --- 4. TOAST NOTIFICATION SYSTEM --- */
  const toastEl = document.getElementById('cyber-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    clearTimeout(toastTimer);
    toastEl.textContent = `> ${message}`;
    toastEl.classList.add('show');
    sfx.playKeyClick();
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  /* --- 5. INTERACTIVE TERMINAL CLI --- */
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalScreen = document.getElementById('terminal-screen');
  const clearTermBtn = document.getElementById('clear-term-btn');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  const termCommands = {
    help: () => `
<span class="term-cyan">COMANDOS DISPONÍVEIS:</span>
  <span class="term-yellow">help</span>        - Exibe esta lista de instruções
  <span class="term-yellow">skills</span>      - Matriz de habilidades técnicas detalhadas
  <span class="term-yellow">projects</span>    - Lista de projetos de alto impacto com repositórios
  <span class="term-yellow">about</span>       - Resumo sobre minha formação em Ciência da Computação
  <span class="term-yellow">education</span>   - Disciplinas acadêmicas e tópicos teóricos dominados
  <span class="term-yellow">hire</span>        - Por que me contratar para sua vaga (Estágio / Júnior)
  <span class="term-yellow">cat resume.txt</span> - Exibe resumo curricular em texto plano
  <span class="term-yellow">matrix</span>      - Alterna o fundo digital Matrix Rain (Easter egg!)
  <span class="term-yellow">whoami</span>      - Identifica o usuário da sessão
  <span class="term-yellow">date</span>        - Horário do sistema de telemetria
  <span class="term-yellow">contact</span>     - Canais diretos de comunicação e redes
  <span class="term-yellow">clear</span>       - Limpa o histórico de tela do console
`,

    skills: () => `
<span class="term-cyan">=== MATRIZ DE COMPETÊNCIAS TÉCNICAS ===</span>
<span class="term-green">[1] Linguagens:</span>   JavaScript (ES6+), TypeScript, Python 3, Java, C++, SQL, Bash
<span class="term-green">[2] Backend:</span>      Node.js, Express, FastAPI, REST APIs, WebSockets, JWT, CORS
<span class="term-green">[3] Bancos:</span>       PostgreSQL, MySQL, Redis (Cache/Broker), MongoDB
<span class="term-green">[4] Frontend:</span>     HTML5 Semântico, CSS3 Moderno, React, Responsividade Mobile
<span class="term-green">[5] CS Core:</span>      Estruturas de Dados, Algoritmos (Big-O), Redes TCP/IP, Linux POSIX
<span class="term-green">[6] DevOps:</span>       Docker, Docker Compose, Git &amp; GitHub Actions, Linux SysAdmin
`,

    projects: () => `
<span class="term-cyan">=== ARSENAL DE PROJETOS EM DESTAQUE ===</span>
1. <span class="term-pink">Nexus Core</span>: Plataforma Full Stack em Tempo Real (React, Node, Prisma, WebSockets)
2. <span class="term-pink">Aegis Gateway</span>: API de Alto Throughput &amp; Mensageria (FastAPI, Redis, Docker)
3. <span class="term-pink">NeuralPath</span>: Visualizador Interativo de Grafos &amp; A* (Canvas, Estruturas de Dados)
4. <span class="term-pink">CyberWatch</span>: Monitor CLI de Containers &amp; Pipeline CI/CD (Linux, GitHub Actions)
<span class="term-dim">Dica: Use a seção de projetos na página para ver diagramas de arquitetura completos!</span>
`,

    about: () => `
<span class="term-cyan">=== IDENTIFICAÇÃO DO SISTEMA ===</span>
Estudante do Bacharelado em <span class="term-green">Ciência da Computação</span>.
Apaixonado pela engenharia de software ponta a ponta: desde os fundamentos de baixo nível
e complexidade de algoritmos até o desenvolvimento de sistemas distribuídos e interfaces intuitivas.
Mentalidade focada em <span class="term-yellow">resolução de problemas reais</span>, leitura de documentação e Clean Code.
`,

    education: () => `
<span class="term-cyan">=== FORMAÇÃO UNIVERSITÁRIA // CIÊNCIA DA COMPUTAÇÃO ===</span>
- Análise e Complexidade de Algoritmos (Notação Big-O, Grafos, Árvores balanceadas)
- Sistemas Operacionais (Gerenciamento de memória, processos, threads, Linux)
- Redes de Computadores (Modelo OSI, TCP/IP, protocolos de aplicação HTTP/DNS)
- Bancos de Dados (Modelagem relacional, Álgebra Relacional, Normalização, ACID)
- Engenharia de Software (SOLID, Padrões de Projeto GoF, Testes TDD, Scrum)
`,

    hire: () => `
<span class="term-green">=== POR QUE CONTRATAR ESTE ESTUDANTE? ===</span>
✔ <span class="term-cyan">Base Teórica Sólida:</span> Compreensão de arquitetura, memória e complexidade.
✔ <span class="term-cyan">Prática de Mercado:</span> Experiência com Docker, Git Flow, APIs REST e Banco de Dados.
✔ <span class="term-cyan">Capacidade de Resolução:</span> Não depende de receitas prontas; sabe debugar e investigar.
✔ <span class="term-cyan">Proatividade &amp; Curva Rápida:</span> Aprende qualquer biblioteca ou linguagem em dias.
✔ <span class="term-cyan">Disponibilidade:</span> Estágio (6h) ou Júnior CLT/PJ com início imediato.
`,

    'cat resume.txt': () => `
============================================================
CURRÍCULO // ESTUDANTE DE CIÊNCIA DA COMPUTAÇÃO
============================================================
FOCO: Estágio / Desenvolvedor Júnior (Full Stack, Backend)
LOCALIZAÇÃO: Brasil (Disponível para Remoto / Presencial)
FORMAÇÃO: Bacharelado em Ciência da Computação
SKILLS: JavaScript, Python, Node, React, SQL, Docker, Git
CONTATO: Ver comando 'contact'
============================================================
`,

    matrix: () => {
      matrixMode = !matrixMode;
      if (matrixMode) {
        showToast('Modo Matrix Rain Iniciado!');
        return `<span class="term-green">>>> PROTOCOLO MATRIX INICIADO. Efeito visual ativado no canvas de fundo. Digite 'matrix' novamente para desativar.</span>`;
      } else {
        showToast('Modo Matrix Desativado');
        return `<span class="term-dim">>>> Retornando ao modo de partículas estelares.</span>`;
      }
    },

    whoami: () => `<span class="term-cyan">visitor@cs-core [potential_recruiter / tech_lead]</span>`,

    date: () => `<span class="term-yellow">${new Date().toLocaleString('pt-BR')} (BRT)</span>`,

    contact: () => `
<span class="term-cyan">=== CANAIS DE COMUNICAÇÃO ===</span>
Email:    <span class="term-green">seuemail@exemplo.com</span>
LinkedIn: <span class="term-green">linkedin.com/in/seuperfil</span>
GitHub:   <span class="term-green">github.com/MUnizZz526</span>
WhatsApp: <span class="term-green">+55 (11) 99999-9999</span>
`,

    sudo: () => `<span class="term-pink">sudo: usuário não está no arquivo sudoers. Este incidente foi reportado ao Tech Lead. :)</span>`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    sfx.playKeyClick();

    // Print command entered
    const inputLine = document.createElement('div');
    inputLine.className = 'term-line';
    inputLine.innerHTML = `<span class="term-prompt-user">visitor@cs-core:~$</span> <span class="term-cyan">${escapeHtml(rawCmd)}</span>`;
    terminalScreen.appendChild(inputLine);

    if (cmd === 'clear') {
      terminalScreen.innerHTML = '';
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'term-line';

    if (cmd === '') {
      // Empty enter
    } else if (termCommands[cmd]) {
      outputLine.innerHTML = termCommands[cmd]();
    } else {
      outputLine.innerHTML = `<span class="term-pink">Comando não reconhecido: '${escapeHtml(cmd)}'. Digite <span class="term-cyan">help</span> para ver as opções.</span>`;
    }

    terminalScreen.appendChild(outputLine);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      if (val.trim()) {
        executeCommand(val);
        terminalInput.value = '';
      }
    });

    // Handle chips
    cmdChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        terminalInput.value = cmd;
        executeCommand(cmd);
      });
    });

    if (clearTermBtn) {
      clearTermBtn.addEventListener('click', () => {
        terminalScreen.innerHTML = '';
        sfx.playKeyClick();
        showToast('Terminal limpo');
      });
    }
  }

  /* --- 6. PROJECT FILTERING --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playKeyClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 200);
        }
      });
    });
  });

  /* --- 7. PROJECT ARCHITECTURE MODAL DATA & HANDLER --- */
  const projectData = {
    nexus: {
      title: 'Nexus Core // Plataforma Full Stack Colaborativa',
      tag: 'FULL STACK & SISTEMAS DISTRIBUÍDOS',
      problem: 'Necessidade de centralizar métricas e eventos de múltiplos nós em tempo real com garantia de entrega, consistência de dados e latência inferior a 50ms.',
      arch: `
+--------------------+       WebSockets (WSS)       +-------------------------+
|   React SPA Client | <==========================> |  Node.js Event Gateway  |
|  (State / Context) |                              |  (Express + Socket.io)  |
+--------------------+                              +-------------------------+
          |                                                      |
          | HTTP REST (CRUD & Auth)                              | Pub/Sub
          v                                                      v
+--------------------+        Prisma ORM            +-------------------------+
|  REST Controllers  | ---------------------------> |  PostgreSQL (Relational)|
|  JWT & Validation  |                              |  Redis Cache Layer      |
+--------------------+                              +-------------------------+
      `,
      highlights: [
        'Modelagem relacional normalizada com migrações gerenciadas pelo Prisma ORM.',
        'Gerenciamento de conexões persistentes WebSockets com salas (rooms) isoladas por tenant.',
        'Implementação de rate limiting e políticas de sanitização de dados no backend.',
        'Isolamento total com Docker e Docker Compose para execução imediata em qualquer máquina.'
      ],
      recruiterValue: 'Demonstra capacidade de estruturar uma solução web moderna completa, com frontend reativo, backend orientado a eventos e banco de dados relacional robusto.',
      links: {
        repo: 'https://github.com/MUnizZz526/portif-lio',
        demo: '#hero'
      }
    },

    aegis: {
      title: 'Aegis Gateway // API de Alta Performance & Microsserviços',
      tag: 'BACKEND, APIS & MENSAGERIA',
      problem: 'Construção de uma porta de entrada única para microsserviços com controle estrito de concorrência, autenticação centralizada e desacoplamento assíncrono de tarefas pesadas.',
      arch: `
[ Client Request ] 
       |
       v
+-------------------------------------------------------+
|  API Gateway (FastAPI / Asynchronous Workers)        |
|  - Rate Limiting Token Bucket via Redis               |
|  - Validação de Esquema Pydantic                      |
|  - Assinatura & Decodificação JWT                     |
+-------------------------------------------------------+
       |                                    |
 (Tarefas Síncronas)               (Tarefas Pesadas/Fila)
       |                                    |
       v                                    v
+------------------+             +----------------------+
| PostgreSQL Pool  |             | RabbitMQ Message Bus |
| Repositories SQL |             | Background Workers   |
+------------------+             +----------------------+
      `,
      highlights: [
        'FastAPI com endpoints 100% assíncronos (async/await) garantindo alta concorrência.',
        'Algoritmo Token Bucket em Redis para proteção contra ataques DDoS e saturação de requisições.',
        'Filas assíncronas RabbitMQ desacoplando processamento de relatórios e notificações.',
        'Cobertura de testes automatizados unitários e de integração superior a 90% com PyTest.'
      ],
      recruiterValue: 'Evidencia domínio das melhores práticas de arquitetura de software, design de microsserviços, cache distribuído e testes automatizados.',
      links: {
        repo: 'https://github.com/MUnizZz526/portif-lio',
        demo: '#hero'
      }
    },

    algo: {
      title: 'NeuralPath // Visualizador de Grafos & A* Search',
      tag: 'ESTRUTURAS DE DADOS & ALGORITMOS CS',
      problem: 'Demonstrar visual e analiticamente a diferença de custo computacional entre algoritmos de busca cega (BFS) e buscas informadas (Dijkstra e A* Search com heurística).',
      arch: `
+------------------------------------------------------------+
|  Matriz de Adjacência / Grid 2D (Vértices & Arestas)       |
+------------------------------------------------------------+
            |
            v
+------------------------------------------------------------+
|  Estrutura de Fila de Prioridade (Min-Heap Binário)        |
|  - Inserção: O(log V)                                       |
|  - Extração de Mínimo: O(log V)                            |
+------------------------------------------------------------+
            |
            v
+------------------------------------------------------------+
|  Loop de Exploração: Dijkstra vs A* (Heurística Manhattan) |
|  Cálculo Dinâmico: f(n) = g(n) + h(n)                      |
+------------------------------------------------------------+
            |
            v
+------------------------------------------------------------+
|  Renderizador Gráfico HTML5 Canvas (60 FPS RequestFrame)   |
+------------------------------------------------------------+
      `,
      highlights: [
        'Implementação própria de Min-Heap para fila de prioridade sem uso de bibliotecas prontas.',
        'Medição precisa de complexidade temporal e espacial Big-O de cada algoritmo testado.',
        'Renderização gráfica eficiente a 60 FPS com HTML5 Canvas.',
        'Algoritmo de reconstrução do menor caminho através de ponteiros de nós predecessores.'
      ],
      recruiterValue: 'Prova irrefutável de que o estudante possui a base matemática e computacional de Ciência da Computação, essencial para resolver problemas de lógica complexa.',
      links: {
        repo: 'https://github.com/MUnizZz526/portif-lio',
        demo: '#algo-modal'
      }
    },

    devops: {
      title: 'CyberWatch // Monitor de Infraestrutura & Pipeline CI/CD',
      tag: 'DEVOPS, LINUX & AUTOMAÇÃO',
      problem: 'Monitoramento contínuo de métricas vitais de servidores Linux e containers Docker sem sobrecarregar a máquina hospedeira com agentes pesados.',
      arch: `
+-------------------------------------------------------------+
|  Linux Kernel /proc & Docker Unix Socket (/var/run/docker) |
+-------------------------------------------------------------+
            |
            v
+-------------------------------------------------------------+
|  CyberWatch Daemon (Coletor Leve em Python / Bash)         |
|  - CPU, Memória, I/O de Disco, Status de Containers         |
+-------------------------------------------------------------+
            |
            +--------------------+
            |                    |
            v                    v
+-----------------------+ +-----------------------------------+
| Terminal CLI Dashboard| | GitHub Actions CI/CD              |
| Atualizações no Prompt| | - Linting & Testes                |
+-----------------------+ | - Build de Imagem Docker Multi-   |
                          |   Stage automatizado a cada Push  |
                          +-----------------------------------+
      `,
      highlights: [
        'Leitura direta do sistema de arquivos `/proc` do Linux (arquitetura POSIX).',
        'Comunicação direta com o socket IPC do daemon Docker Engine.',
        'Workflow automatizado no GitHub Actions com testes e publicação de containers.',
        'Builds otimizados com Docker multi-stage reduzindo imagens em até 70%.'
      ],
      recruiterValue: 'Demonstra familiaridade com ferramentas essenciais do dia a dia de engenharia de software (Linux, Docker, CI/CD), eliminando o gap de infraestrutura de muitos juniores.',
      links: {
        repo: 'https://github.com/MUnizZz526/portif-lio',
        demo: '#terminal'
      }
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('modal-project-content');
  const closeProjectModalBtn = document.getElementById('close-project-modal');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModalContent) return;

    sfx.playKeyClick();
    document.getElementById('modal-project-title').textContent = data.title;

    projectModalContent.innerHTML = `
      <div class="modal-badge-row">
        <span class="project-tag-badge">${data.tag}</span>
      </div>

      <h4 class="modal-section-title">// PROBLEMA &amp; CONTEXTO DO PROJETO</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${data.problem}</p>

      <h4 class="modal-section-title">// DIAGRAMA DE ARQUITETURA &amp; FLUXO DE DADOS</h4>
      <pre class="modal-arch-diagram"><code>${escapeHtml(data.arch)}</code></pre>

      <h4 class="modal-section-title">// DIFERENCIAIS DE ENGENHARIA IMPLEMENTADOS</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
        ${data.highlights.map(h => `<li style="font-size: 0.9rem; color: #d8e2f0;"><i class="fa-solid fa-angle-right" style="color: var(--neon-cyan); margin-right: 8px;"></i>${h}</li>`).join('')}
      </ul>

      <h4 class="modal-section-title">// O QUE TECH LEADS &amp; RECRUTADORES AVALIAM</h4>
      <div style="background: rgba(0, 240, 255, 0.05); border-left: 3px solid var(--neon-cyan); padding: 12px; font-size: 0.9rem; color: #f0f4fc;">
        ${data.recruiterValue}
      </div>

      <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="${data.links.repo}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-primary">
          <i class="fa-brands fa-github"></i> Ver Código no GitHub
        </a>
        <button class="cyber-btn cyber-btn-secondary" onclick="document.getElementById('close-project-modal').click();">
          Fechar Janela
        </button>
      </div>
    `;

    projectModal.classList.add('active');
  }

  // Attach event listeners for project modal triggers
  document.querySelectorAll('.open-modal-btn, .quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project-id');
      if (pId === 'algo' && btn.classList.contains('quick-view-btn')) {
        openAlgoModal();
      } else if (pId) {
        openProjectModal(pId);
      }
    });
  });

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
  }

  /* --- 8. PLAYABLE ALGORITHM VISUALIZER (DIJKSTRA / A* / BFS) --- */
  const algoModal = document.getElementById('algo-modal');
  const closeAlgoModalBtn = document.getElementById('close-algo-modal');
  const launchAlgoBtn = document.getElementById('launch-algo-demo-btn');
  const runAlgoBtn = document.getElementById('run-algo-btn');
  const resetAlgoBtn = document.getElementById('reset-algo-btn');
  const randomWallsBtn = document.getElementById('random-walls-btn');
  const algoSelect = document.getElementById('algo-select');
  const algoBigO = document.getElementById('algo-big-o');
  const nodesVisitedVal = document.getElementById('nodes-visited-val');
  const pathCostVal = document.getElementById('path-cost-val');

  const algoCanvas = document.getElementById('algo-canvas');
  const aCtx = algoCanvas ? algoCanvas.getContext('2d') : null;

  const COLS = 25;
  const ROWS = 13;
  let CELL_SIZE = 24;
  let grid = [];
  let isRunningAlgo = false;
  let isMouseDown = false;

  const START_NODE = { r: 6, c: 2 };
  const END_NODE = { r: 6, c: 22 };

  function initAlgoGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = {
          r,
          c,
          isWall: false,
          visited: false,
          isPath: false,
          distance: Infinity,
          fScore: Infinity,
          parent: null
        };
      }
    }
    if (nodesVisitedVal) nodesVisitedVal.textContent = '0';
    if (pathCostVal) pathCostVal.textContent = '0';
    drawAlgoGrid();
  }

  function drawAlgoGrid() {
    if (!aCtx || !algoCanvas) return;
    aCtx.clearRect(0, 0, algoCanvas.width, algoCanvas.height);

    CELL_SIZE = Math.floor(algoCanvas.width / COLS);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;

        // Base cell
        aCtx.fillStyle = '#060a12';

        if (cell.isWall) {
          aCtx.fillStyle = '#1c283f';
        } else if (cell.isPath) {
          aCtx.fillStyle = '#ffe600'; // Neon gold path
        } else if (cell.visited) {
          aCtx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        }

        if (r === START_NODE.r && c === START_NODE.c) {
          aCtx.fillStyle = '#00f0ff'; // Start: Neon Cyan
        } else if (r === END_NODE.r && c === END_NODE.c) {
          aCtx.fillStyle = '#ff0055'; // End: Neon Pink
        }

        aCtx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Border
        aCtx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        aCtx.lineWidth = 1;
        aCtx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  function openAlgoModal() {
    if (!algoModal) return;
    sfx.playKeyClick();
    algoModal.classList.add('active');
    initAlgoGrid();
  }

  if (launchAlgoBtn) {
    launchAlgoBtn.addEventListener('click', openAlgoModal);
  }

  if (closeAlgoModalBtn) {
    closeAlgoModalBtn.addEventListener('click', () => {
      algoModal.classList.remove('active');
      isRunningAlgo = false;
    });
  }

  // Handle cell drawing walls with mouse
  if (algoCanvas) {
    algoCanvas.addEventListener('mousedown', (e) => {
      if (isRunningAlgo) return;
      isMouseDown = true;
      toggleWallAt(e);
    });

    algoCanvas.addEventListener('mousemove', (e) => {
      if (isRunningAlgo || !isMouseDown) return;
      toggleWallAt(e);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
  }

  function toggleWallAt(e) {
    const rect = algoCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const c = Math.floor(x / CELL_SIZE);
    const r = Math.floor(y / CELL_SIZE);

    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      if ((r === START_NODE.r && c === START_NODE.c) || (r === END_NODE.r && c === END_NODE.c)) return;
      grid[r][c].isWall = true;
      sfx.playKeyClick();
      drawAlgoGrid();
    }
  }

  if (resetAlgoBtn) {
    resetAlgoBtn.addEventListener('click', () => {
      isRunningAlgo = false;
      initAlgoGrid();
      sfx.playKeyClick();
    });
  }

  if (randomWallsBtn) {
    randomWallsBtn.addEventListener('click', () => {
      initAlgoGrid();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if ((r === START_NODE.r && c === START_NODE.c) || (r === END_NODE.r && c === END_NODE.c)) continue;
          if (Math.random() < 0.28) {
            grid[r][c].isWall = true;
          }
        }
      }
      sfx.playKeyClick();
      drawAlgoGrid();
    });
  }

  if (algoSelect) {
    algoSelect.addEventListener('change', () => {
      const type = algoSelect.value;
      if (type === 'dijkstra') {
        algoBigO.textContent = 'O((V + E) log V)';
      } else if (type === 'astar') {
        algoBigO.textContent = 'O(E) no melhor caso com heurística';
      } else {
        algoBigO.textContent = 'O(V + E) (Largura)';
      }
    });
  }

  // Algorithm Execution Engine
  if (runAlgoBtn) {
    runAlgoBtn.addEventListener('click', () => {
      if (isRunningAlgo) return;
      isRunningAlgo = true;

      // Reset visited states
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          grid[r][c].visited = false;
          grid[r][c].isPath = false;
          grid[r][c].distance = Infinity;
          grid[r][c].fScore = Infinity;
          grid[r][c].parent = null;
        }
      }

      const type = algoSelect ? algoSelect.value : 'dijkstra';
      runGraphSearch(type);
    });
  }

  function getNeighbors(node) {
    const { r, c } = node;
    const neighbors = [];
    if (r > 0) neighbors.push(grid[r - 1][c]);
    if (r < ROWS - 1) neighbors.push(grid[r + 1][c]);
    if (c > 0) neighbors.push(grid[r][c - 1]);
    if (c < COLS - 1) neighbors.push(grid[r][c + 1]);
    return neighbors.filter(n => !n.isWall);
  }

  function manhattan(n1, n2) {
    return Math.abs(n1.r - n2.r) + Math.abs(n1.c - n2.c);
  }

  function runGraphSearch(algorithm) {
    const start = grid[START_NODE.r][START_NODE.c];
    const end = grid[END_NODE.r][END_NODE.c];

    start.distance = 0;
    start.fScore = manhattan(start, end);

    const openSet = [start];
    const visitedOrder = [];
    let found = false;

    while (openSet.length > 0) {
      if (algorithm === 'astar') {
        openSet.sort((a, b) => a.fScore - b.fScore);
      } else if (algorithm === 'dijkstra') {
        openSet.sort((a, b) => a.distance - b.distance);
      } // BFS just acts like FIFO

      const current = openSet.shift();

      if (current.visited) continue;
      current.visited = true;
      visitedOrder.push(current);

      if (current.r === end.r && current.c === end.c) {
        found = true;
        break;
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!neighbor.visited) {
          const tentDist = current.distance + 1;
          if (tentDist < neighbor.distance) {
            neighbor.distance = tentDist;
            neighbor.parent = current;
            neighbor.fScore = tentDist + manhattan(neighbor, end);
            openSet.push(neighbor);
          }
        }
      }
    }

    animateAlgorithm(visitedOrder, found ? end : null);
  }

  function animateAlgorithm(visitedNodes, endNode) {
    let i = 0;
    const interval = setInterval(() => {
      if (!isRunningAlgo) {
        clearInterval(interval);
        return;
      }

      if (i < visitedNodes.length) {
        const node = visitedNodes[i];
        node.visited = true;
        nodesVisitedVal.textContent = i + 1;
        drawAlgoGrid();
        if (i % 3 === 0) sfx.playKeyClick();
        i++;
      } else {
        clearInterval(interval);
        if (endNode) {
          animatePath(endNode);
        } else {
          isRunningAlgo = false;
          showToast('Nenhum caminho encontrado (Caminho Bloqueado)');
        }
      }
    }, 25);
  }

  function animatePath(endNode) {
    const path = [];
    let curr = endNode;
    while (curr) {
      path.unshift(curr);
      curr = curr.parent;
    }

    pathCostVal.textContent = path.length - 1;
    let i = 0;
    const pathInterval = setInterval(() => {
      if (!isRunningAlgo) {
        clearInterval(pathInterval);
        return;
      }

      if (i < path.length) {
        path[i].isPath = true;
        drawAlgoGrid();
        sfx.playKeyClick();
        i++;
      } else {
        clearInterval(pathInterval);
        isRunningAlgo = false;
        sfx.playSuccess();
        showToast(`Caminho ótimo encontrado! Custo: ${path.length - 1} passos.`);
      }
    }, 35);
  }

  /* --- 9. RESUME / CV MODAL & PRINT HANDLER --- */
  const resumeBtn = document.getElementById('resume-download-btn');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeModalBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const contactFromResume = document.getElementById('contact-from-resume');

  if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', () => {
      sfx.playKeyClick();
      resumeModal.classList.add('active');
    });
  }

  if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  if (contactFromResume) {
    contactFromResume.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      sfx.playKeyClick();
      window.print();
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      document.querySelectorAll('.cyber-modal').forEach(m => m.classList.remove('active'));
    }
  });

  /* --- 10. COPY EMAIL & CONTACT FORM SUBMIT --- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailVal = document.getElementById('email-address');

  if (copyEmailBtn && emailVal) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailVal.textContent.trim()).then(() => {
        sfx.playSuccess();
        showToast('Email copiado para a área de transferência!');
      }).catch(() => {
        showToast('Email pronto para envio!');
      });
    });
  }

  const contactForm = document.getElementById('cyber-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sfx.playKeyClick();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITINDO PACOTES...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-bracket">[</span><i class="fa-solid fa-check"></i> TRANSMITIDO COM SUCESSO<span class="btn-bracket">]</span>';
        }
        if (formFeedback) {
          formFeedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
          formFeedback.className = 'form-feedback success';
        }
        sfx.playSuccess();
        showToast('Mensagem enviada com sucesso!');
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = '<span class="btn-bracket">[</span><i class="fa-solid fa-satellite-dish"></i> TRANSMITIR MENSAGEM<span class="btn-bracket">]</span>';
          }
          if (formFeedback) formFeedback.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }

  /* --- 11. MOBILE MENU TOGGLE --- */
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      sfx.playKeyClick();
      mobileMenu.classList.add('active');
    });

    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* --- 12. BILINGUAL SWITCHER (PT-BR / EN) --- */
  const langToggle = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  let currentLang = 'pt';

  const translations = {
    en: {
      statusAvailable: 'SYSTEM ACTIVE // OPEN FOR HIRE',
      navAbout: '// 01.ABOUT',
      navSkills: '// 02.SKILLS',
      navProjects: '// 03.PROJECTS',
      navTerminal: '// 04.TERMINAL',
      navRoadmap: '// 05.HIRING_GUIDE',
      navContact: '// 06.CONTACT',
      heroBadge: 'PROTOCOL: COMPUTER_SCIENCE // ACTIVE',
      heroGreeting: 'Hello recruiters & engineers, I am',
      heroBio: 'Computer Science student passionate about building scalable, high-performance software. Versatile across multiple technical fronts: Full Stack Web, Backend APIs & Microservices, Data Structures & Algorithms, and Cloud/DevOps.',
      metricDomains: 'Technical Domains',
      metricEfficiency: 'Algorithmic Thinking',
      metricCommitment: 'Real-world Focus',
      btnExploreProjects: 'EXPLORE PROJECTS',
      btnOpenTerminal: 'TERMINAL CLI',
      btnResume: 'RESUME (CV)',
      uplinksLabel: '// QUICK UPLINKS:',
      hudEducationLabel: 'DEGREE:',
      hudFocusLabel: 'TARGET:',
      hudFocusVal: 'Internship & Junior (Multi-Stack)',
      hudLocationLabel: 'LOCATION:',
      aboutTitle: 'WHO I AM & VALUE I DELIVER',
      aboutP1: 'I am a Computer Science student with a genuine curiosity for how computer systems work under the hood, from mathematical theory to production web applications.',
      aboutP2: 'My degree gives me a deep foundation in Data Structures, Asymptotic Analysis, Operating Systems, and Distributed Computing. In parallel, I master current industry tech: Full Stack React/Node, FastAPI, SQL/NoSQL, and Docker containers.',
      aboutP3: 'Why hire me? I am not a developer who only follows tutorials. I know how to debug real issues, read official specs, optimize Big-O complexity, and collaborate with Git and Clean Architecture.',
      aboutHL1Title: 'Solid CS Fundamentals',
      aboutHL1Desc: 'Data Structures, Algorithms, Networks and OS without shortcuts.',
      aboutHL2Title: 'Git & Version Control',
      aboutHL2Desc: 'Semantic commits, clean branching, and reviewed PRs.',
      aboutHL3Title: 'Fast Learner',
      aboutHL3Desc: 'Rapid adaptation to any new stack or tooling.',
      aboutHL4Title: 'Collaborative Mindset',
      aboutHL4Desc: 'Clear communication, high initiative, and receptive to feedback.',
      acadDesc: 'Rigorous coursework in Theory of Computation, Software Engineering, Relational Databases, Compilers, and Distributed Systems.',
      courseworkTitle: '// KEY COMPLETED CS COURSES:',
      availHeadline: 'Immediate Availability:',
      availText: 'Internship or Junior Developer roles (Remote, Hybrid, or On-site).',
      skillsTitle: 'MULTIDISCIPLINARY TECH STACK',
      skillsSubtitle: 'Equipped to solve problems across all layers of modern software engineering.',
      skillCat1: 'CORE LANGUAGES',
      skillCat2: 'BACKEND & DATABASES',
      skillCat3: 'FRONTEND & INTERFACES',
      skillCat4: 'CS FUNDAMENTALS & DEVOPS',
      projectsTitle: 'FEATURED PROJECTS & REAL ARCHITECTURE',
      projectsSubtitle: 'Engineered to demonstrate practical competency for technical hiring managers.',
      filterAll: '[ ALL PROJECTS ]',
      filterFullstack: '[ FULL STACK ]',
      filterBackend: '[ BACKEND & APIS ]',
      filterAlgo: '[ ALGORITHMS & CS ]',
      filterDevops: '[ DEVOPS & SYSTEMS ]',
      btnViewArch: 'View Architecture',
      whyRecruitersLove: 'Why Recruiters Care:',
      p1Desc: 'High-concurrency distributed web application with real-time WebSocket dashboard, transactional persistence, and multitenant isolation.',
      p1Why: 'Real-time WebSocket synchronization, race condition handling, and relational DB with automated migrations.',
      p2Desc: 'High-throughput API gateway with asymmetric JWT authentication, distributed Redis rate limiting, async message queues, and 90%+ test coverage.',
      p2Why: 'Event-driven architecture, caching with invalidation, and comprehensive PyTest test suites.',
      p3Desc: 'Interactive HTML5 Canvas simulator for graph search algorithms (Dijkstra, A*, BFS/DFS) with live Big-O space and time metrics.',
      p3Why: 'Tangible proof of data structures mastery (priority queues, min-heaps) and algorithmic optimization.',
      p4Desc: 'CLI tool and infrastructure telemetry monitor tracking Docker container health, Linux resource usage, and continuous delivery pipelines.',
      p4Why: 'End-to-end automation with GitHub Actions, Linux syscalls, and lean multi-stage Docker builds.',
      terminalTitle: 'DEVELOPER COMMAND LINE INTERFACE',
      terminalSubtitle: 'Type commands to explore skills, projects, resume, or trigger Matrix mode.',
      quickCmdsLabel: 'Quick Commands:',
      roadmapTitle: 'HOW TO BUILD PROJECTS THAT GET YOU HIRED',
      roadmapSubtitle: 'What technical recruiters and Tech Leads actually look for in Computer Science students.',
      road1Title: 'Escape Generic Tutorial Clones',
      road1Desc: 'Simple to-do lists and static copies do not stand out. Instead, tackle real challenges: secure JWT authentication, persistent database modeling, and pagination.',
      road1Tip: 'Golden Rule: Always build CRUDs with 1:N or N:N relations and clean data validation.',
      road2Title: 'Engineering, Tests & Clean Architecture',
      road2Desc: 'As a CS student, your edge is knowing how software works under the hood. Structure code into layers (Controllers, Services, Repositories) and add automated tests.',
      road2Tip: 'Golden Rule: Writing 5 to 10 automated tests puts you ahead of 90% of applicants.',
      road3Title: 'The Champion README Tech Leads Love',
      road3Desc: 'Recruiters rarely clone repositories with broken setups. Include a working demo GIF, architecture diagram, design trade-offs, and a one-command Docker launch.',
      road3Tip: 'Golden Rule: Include a "Key Challenges Solved" section to show problem-solving skills.',
      road4Title: 'Live Deployments & Cloud Environments',
      road4Desc: 'A functioning live deployment multiplies interview callbacks. Deploy frontend to Vercel/GitHub Pages, backend to Render/Railway, and databases to Supabase/Neon.',
      road4Tip: 'Golden Rule: Add GitHub Actions CI/CD to run tests on every push.',
      blueprintsTitle: '4 HIGH-IMPACT PROJECT BLUEPRINTS FOR YOUR RESUME:',
      contactTitle: 'LET’S DISCUSS YOUR ROLES & CHALLENGES',
      contactSubtitle: 'Available for technical interviews, internships, and junior engineering positions.',
      availTag: 'CURRENT AVAILABILITY:',
      availLong: 'Seeking Internship or Junior Software Engineer roles across Full Stack, Backend, Frontend, or related Tech areas.',
      btnSendMsg: 'TRANSMIT MESSAGE',
      backToTop: 'TOP'
    },
    pt: {
      statusAvailable: 'SISTEMA ATIVO // BUSCANDO VAGAS',
      navAbout: '// 01.SOBRE',
      navSkills: '// 02.HABILIDADES',
      navProjects: '// 03.PROJETOS',
      navTerminal: '// 04.TERMINAL',
      navRoadmap: '// 05.GUIA_CONTRATAÇÃO',
      navContact: '// 06.CONTATO',
      heroBadge: 'PROTOCOLO: CIÊNCIA_DA_COMPUTAÇÃO // ATIVO',
      heroGreeting: 'Olá, recrutadores e engenheiros, sou',
      heroBio: 'Estudante de Ciência da Computação focado em construir software escalável, performático e elegante. Preparado para atuar em múltiplas frentes técnicas: Full Stack Web, arquitetura de APIs & Microsserviços, Algoritmos & Estruturas de Dados e DevOps/Sistemas.',
      metricDomains: 'Domínios Tecnológicos',
      metricEfficiency: 'Pensamento Algorítmico',
      metricCommitment: 'Foco em Solução Real',
      btnExploreProjects: 'EXPLORAR PROJETOS',
      btnOpenTerminal: 'TERMINAL CLI',
      btnResume: 'CURRÍCULO (CV)',
      uplinksLabel: '// CONEXÕES RÁPIDAS:',
      hudEducationLabel: 'CURSO:',
      hudFocusLabel: 'OBJETIVO:',
      hudFocusVal: 'Estágio & Júnior (Multi-Áreas)',
      hudLocationLabel: 'LOCAL:',
      aboutTitle: 'QUEM SOU EU & COMO POSSO GERAR VALOR',
      aboutP1: 'Sou estudante de Ciência da Computação com paixão genuína por entender o funcionamento dos sistemas desde a teoria mais profunda até a entrega de aplicações práticas em produção.',
      aboutP2: 'Minha formação universitária me fornece sólida base em Estruturas de Dados, Análise Assintótica de Algoritmos, Sistemas Operacionais e Arquitetura de Computadores. Paralelamente, dedico meu tempo a dominar tecnologias modernas do mercado — construindo soluções Full Stack, APIs RESTful/GraphQL, bancos relacionais e não-relacionais, e ambientes conteinerizados com Docker.',
      aboutP3: 'Por que me contratar para seu time? Não sou um desenvolvedor que apenas copia tutoriais. Sei como depurar problemas reais, ler documentações oficiais, pensar na escalabilidade do código e trabalhar de forma colaborativa com Git e boas práticas de engenharia de software (SOLID, Clean Architecture, testes).',
      aboutHL1Title: 'Fundamentos Fortes',
      aboutHL1Desc: 'Estruturas de Dados, Algoritmos, Redes e SO sem atalhos.',
      aboutHL2Title: 'Versionamento & Git',
      aboutHL2Desc: 'Commits semânticos, branchs organizadas e PRs revisados.',
      aboutHL3Title: 'Rápido Aprendizado',
      aboutHL3Desc: 'Adaptabilidade rápida a qualquer stack e ferramentas novas.',
      aboutHL4Title: 'Espírito Colaborativo',
      aboutHL4Desc: 'Comunicação clara, proatividade e receptividade a feedbacks.',
      acadDesc: 'Foco em Teoria da Computação, Engenharia de Software, Bancos de Dados, Compiladores, Inteligência Artificial e Sistemas Distribuídos.',
      courseworkTitle: '// DISCIPLINAS CHAVE CONCLUÍDAS & PRATICADAS:',
      availHeadline: 'Disponibilidade Imediata:',
      availText: 'Estágio (6h/dia) ou Contratação Júnior CLT/PJ em regime Remoto, Híbrido ou Presencial.',
      skillsTitle: 'MATRIZ MULTIDISCIPLINAR DE TECNOLOGIAS',
      skillsSubtitle: 'Preparado para resolver problemas em diferentes camadas da engenharia de software.',
      skillCat1: 'LINGUAGENS PRINCIPAIS',
      skillCat2: 'BACKEND & BANCO DE DADOS',
      skillCat3: 'FRONTEND & INTERFACES',
      skillCat4: 'FUNDAMENTOS CS & DEVOPS',
      projectsTitle: 'PROJETOS EM DESTAQUE COM ARQUITETURA REAL',
      projectsSubtitle: 'Projetos desenvolvidos para demonstrar competência em cenários reais de contratação técnica.',
      filterAll: '[ TODOS OS PROJETOS ]',
      filterFullstack: '[ FULL STACK ]',
      filterBackend: '[ BACKEND & APIS ]',
      filterAlgo: '[ ALGORITMOS & CS ]',
      filterDevops: '[ DEVOPS & SISTEMAS ]',
      btnViewArch: 'Ver Arquitetura',
      whyRecruitersLove: 'Destaque para Contratação:',
      p1Desc: 'Aplicação Web distribuída de alta concorrência com dashboard em tempo real via WebSockets, persistência transacional e isolamento multitenant.',
      p1Why: 'Sincronização em tempo real com pub/sub, tratamento de race conditions e banco relacional com migrações automatizadas.',
      p2Desc: 'API de alto throughput com autenticação JWT assimétrica, rate limiting distribuído com Redis, mensageria assíncrona e suíte completa de testes.',
      p2Why: 'Arquitetura orientada a eventos (EDA), cache inteligente com invalidação e cobertura de testes acima de 90%.',
      p3Desc: 'Simulador interativo em Canvas de algoritmos de busca em grafos (Dijkstra, A* Search, BFS/DFS) com medição de complexidade de tempo e memória.',
      p3Why: 'Prova viva de domínio de estruturas de dados (filas de prioridade, heaps binários) e análise Big-O aplicada na prática.',
      p4Desc: 'Ferramenta CLI e telemetria de infraestrutura para monitoramento de saúde de containers Docker, uso de recursos Linux e pipeline de entrega contínua.',
      p4Why: 'Automação de ponta a ponta com GitHub Actions, métricas de sistema e empacotamento em imagens Docker multi-stage enxutas.',
      terminalTitle: 'TERMINAL DE COMANDOS DE DESENVOLVEDOR',
      terminalSubtitle: 'Digite comandos para explorar habilidades, projetos, currículo ou acionar o modo Matrix.',
      quickCmdsLabel: 'Comandos Rápidos:',
      roadmapTitle: 'COMO CRIAR PROJETOS QUE REALMENTE CONTRATAM',
      roadmapSubtitle: 'O que recrutadores técnicos e Tech Leads buscam em estudantes de Ciência da Computação.',
      road1Title: 'Fuja dos Projetos "Clichê" e Genéricos',
      road1Desc: 'To-do lists simples, clones de tela estáticos e calculadoras não chamam a atenção de recrutadores. Em vez disso, construa aplicações com problemas reais: autenticação robusta (JWT/Cookies HttpOnly), persistência em banco relacional, paginação eficiente e tratamento de erros com logs.',
      road1Tip: 'Dica de Ouro: Implemente sempre um CRUD com pelo menos uma relação 1:N ou N:N e regras de validação consistentes.',
      road2Title: 'Engenharia, Testes & Arquitetura',
      road2Desc: 'Como estudante de Ciência da Computação, seu grande diferencial é saber como o código funciona por trás dos panos. Organize seu backend em camadas (Controllers, Services, Repositories), aplique princípios SOLID e adicione testes automatizados (unitários e de integração).',
      road2Tip: 'Dica de Ouro: Adicionar 5 a 10 testes com Jest ou PyTest no seu projeto já coloca você à frente de 90% dos concorrentes a estágio.',
      road3Title: 'O README Campeão que Tech Leads Leem',
      road3Desc: 'Recrutadores e líderes técnicos raramente rodam seu código localmente se for complicado. Seu repositório no GitHub precisa ter um README profissional com: GIF animado da aplicação funcionando, diagrama de arquitetura, decisões técnicas justificadas e comando `docker compose up`.',
      road3Tip: 'Dica de Ouro: Escreva um parágrafo "Principais Desafios & O Que Aprendi". Tech Leads amam ver capacidade de resolução de problemas!',
      road4Title: 'Deploy Funcional & Ambientes Cloud',
      road4Desc: 'Um projeto com link de demonstração rodando online multiplica suas chances de ser chamado para entrevista. Use plataformas gratuitas ou freemium para hospedar seu frontend (Vercel, GitHub Pages), backend (Render, Railway, Fly.io) e banco de dados gerenciado (Supabase, Neon).',
      road4Tip: 'Dica de Ouro: Crie um pipeline no GitHub Actions para testar seu código a cada commit automaticamente.',
      blueprintsTitle: '4 SUGESTÕES DE PROJETOS DE ALTO IMPACTO PARA SEU CURRÍCULO:',
      contactTitle: 'VAMOS CONVERSAR SOBRE SUA VAGA OU PROJETO',
      contactSubtitle: 'Estou disponível para entrevistas técnicas e oportunidades imediatas.',
      availTag: 'DISPONIBILIDADE ATUAL:',
      availLong: 'Buscando vagas de Estágio ou Desenvolvedor Júnior em desenvolvimento Full Stack, Backend, Frontend ou áreas correlatas de Tecnologia.',
      btnSendMsg: 'TRANSMITIR MENSAGEM',
      backToTop: 'TOPO'
    }
  };

  if (langToggle && langLabel) {
    langToggle.addEventListener('click', () => {
      sfx.playKeyClick();
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      langLabel.textContent = currentLang === 'pt' ? 'PT-BR' : 'EN-US';

      const dict = translations[currentLang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      showToast(`Idioma alternado para: ${currentLang.toUpperCase()}`);
    });
  }

})();
