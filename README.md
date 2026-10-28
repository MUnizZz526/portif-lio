# 🚀 CyberDev // Portfólio de Ciência da Computação & Engenharia de Software

> **Portfólio interativo de alta conversão para estudantes de Ciência da Computação conquistarem vagas de Estágio e Desenvolvedor Júnior em Múltiplas Áreas da Tecnologia.**

Este projeto foi construído com foco em **versatilidade profissional** (Full Stack, Backend/APIs, Estruturas de Dados/Algoritmos e DevOps/Sistemas) e identidade visual **Cyberpunk moderna** (efeitos neon, HUDs, terminal de linha de comando interativo, simulador de algoritmos em tempo real e suporte bilíngue PT-BR/EN).

---

## ⚡ Como Visualizar o Portfólio Localmente

Você pode abrir o portfólio de duas formas simples:

### Opção 1: Abrir diretamente no navegador
Dê um duplo clique no arquivo [`index.html`](file:///c:/Users/mf445/Downloads/portifolio/index.html).

### Opção 2: Servidor local (Recomendado)
Se tiver Python ou Node instalado:
```bash
# Com Python:
python -m http.server 8080

# Ou com Node (npx):
npx serve
```
Em seguida, acesse no seu navegador: `http://localhost:8080`

---

## 🛠️ Personalização Rápida (Coloque Seus Dados em 5 Minutos)

Abra o arquivo [`index.html`](file:///c:/Users/mf445/Downloads/portifolio/index.html) e ajuste os seguintes campos:

1. **Seu Nome e Título**:
   - Procure por `SEU NOME AQUI` e substitua pelo seu nome.
2. **Sua Foto / Avatar**:
   - O arquivo atual é [`assets/avatar.jpg`](file:///c:/Users/mf445/Downloads/portifolio/assets/avatar.jpg). Você pode colar sua própria foto quadrada na pasta `assets` mantendo esse nome ou alterando a tag `src` no HTML.
3. **Links de Contato**:
   - `github.com/seuperfil` -> Insira a URL do seu GitHub real.
   - `linkedin.com/in/seuperfil` -> Insira seu perfil do LinkedIn.
   - `seuemail@exemplo.com` -> Insira seu email de contato profissional.
   - `wa.me/5511999999999` -> Insira seu número de WhatsApp se desejar contato ágil.
4. **Universidade**:
   - Altere `[Sua Instituição Aqui]` pelo nome da sua faculdade e ano previsto de formatura.

---

## 🧠 Guia Estratégico: Como Criar Projetos que Realmente Contratam

Como estudante de Ciência da Computação, o mercado não espera que você tenha 10 anos de experiência comercial, mas espera **fundamentos sólidos, capacidade analítica e autonomia técnica**.

### ❌ O Que Não Fazer (Erros mais comuns de estudantes)
- Fazer apenas clones idênticos de tutoriais do YouTube (ex: To-Do List simples, Pokédex ou calculadora estática).
- Não colocar README no repositório ou deixar apenas o README padrão do framework (`# Create React App`).
- Projetos sem deploy online ou com instruções de execução quebradas.
- Repositório com 1 único commit ("first commit" com 50 arquivos).

---

### ✅ Os 4 Pilares de um Projeto que Tech Leads Contratam

#### 1. Resolução de um Problema Real com Concorrência / Estado
Tech Leads buscam candidatos que entendam:
- Autenticação e segurança (senhas com hash bcrypt/argon2, tokens JWT e cookies seguros).
- Relacionamentos reais em banco de dados (ex: Usuário tem Pedidos, Pedido tem Itens, Estoque atualizado transacionalmente).
- Tratamento de concorrência ou atualização em tempo real (ex: WebSockets para chat/quadro colaborativo).

#### 2. Arquitetura em Camadas & Testes
Mostre que você estuda Engenharia de Software:
- Separe seu código em **Controllers / Handlers**, **Services / Use Cases** e **Repositories / Data Access**.
- Aplique princípios **SOLID** e tipagem estática (TypeScript ou Python com type hints).
- Crie pelo menos **5 a 10 testes automatizados** com Jest ou PyTest. No currículo, isso destaca você de 90% dos candidatos a estágio!

#### 3. Repositório com Docker & README Impecável
- Crie um arquivo `docker-compose.yml` para que qualquer avaliador consiga rodar seu banco de dados e backend com um único comando: `docker compose up`.
- O README deve conter:
  1. Título e Badge de Status.
  2. Demonstração em GIF curto ou link de Demo online.
  3. Diagrama simples de arquitetura.
  4. Tecnologias utilizadas e por que foram escolhidas.
  5. Decisões de design, desafios superados e lições aprendidas.

#### 4. Deploy Gratuito em Nuvem
- **Frontend**: Gratuito na [Vercel](https://vercel.com) ou [GitHub Pages](https://pages.github.com).
- **Backend**: Gratuito/Freemium no [Render](https://render.com), [Railway](https://railway.app) ou [Fly.io](https://fly.io).
- **Banco de Dados Gerenciado**: Gratuito no [Supabase](https://supabase.com) (PostgreSQL) ou [Neon.tech](https://neon.tech).

---

## 📋 4 Ideias de Projetos Prontos para Implementar no seu Portfólio

| Projeto | Área de Destaque | Tech Stack Recomendada | O que Recrutadores Avaliam |
| :--- | :--- | :--- | :--- |
| **1. API de E-commerce / Delivery com Cache** | Backend & Engenharia | Node.js (Nest/Express) ou FastAPI, PostgreSQL, Redis, Docker | Cache inteligente, migrações de banco, documentação Swagger, rate limiting e TDD. |
| **2. Painel Colaborativo em Tempo Real** | Full Stack Web | React (Next.js/Vite), TypeScript, Node.js, Socket.io, Tailwind | Gestão de estado, sincronização bidirecional WebSockets, UX refinada e responsividade. |
| **3. Simulador de Algoritmos / Mini Compilador** | Ciência da Computação | JavaScript/Canvas, Python ou C++ | Domínio de grafos, árvores binárias, análise Big-O e estruturas de dados sem atalhos. |
| **4. CLI de Automação de Infraestrutura & CI/CD** | DevOps & Sistemas | Python, Go ou Bash, Docker API, GitHub Actions | Pipelines automatizados, containers enxutos e familiaridade com ambiente Linux. |

---

## 🌐 Como Publicar Seu Portfólio Grátis no GitHub Pages (Passo a Passo)

1. Crie um repositório no seu GitHub com o nome: `seu-usuario.github.io` ou `portfolio`.
2. No seu terminal dentro desta pasta:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of cyberpunk portfolio"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```
3. No GitHub:
   - Vá em **Settings** > **Pages**.
   - Em **Branch**, selecione `main` e pasta `/(root)`.
   - Clique em **Save**.
4. Em cerca de 1 minuto, seu portfólio estará online em: `https://SEU_USUARIO.github.io/SEU_REPOSITORIO`!

---

*Desenvolvido sob medida para alavancar carreiras em Ciência da Computação & Engenharia de Software.*
