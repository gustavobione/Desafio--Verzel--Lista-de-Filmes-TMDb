# Desafio Elite Dev - Lista de Filmes (Full-Stack)

Este projeto é uma aplicação full-stack de "Lista de Filmes", criada como parte do "Desafio Elite Dev". A aplicação permite aos usuários pesquisar filmes na API do TMDb, salvar seus favoritos e compartilhar suas listas.

A arquitetura é dividida em duas pastas principais:
* `/Frontend`: Uma aplicação SPA (Single Page Application) feita com React e Vite.
* `/Backend`: Uma API RESTful feita com Python e Django.

---

## 💻 Stack Tecnológica

| Área | Tecnologia |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Shadcn UI, TanStack Router, `fetch` |
| **Backend** | Python, Django (4.2), Django REST Framework, `PyMySQL`, `django-cors-headers` |
| **Autenticação** | Firebase Authentication (Login com Google), Firebase Admin SDK |
| **Banco de Dados (Dev)**| MySQL (via XAMPP / MariaDB 10.4) |
| **Banco de Dados (Prod)**| **Docker (MySQL 8.0)** / **AWS RDS (MySQL)** |
| **Deploy (Planejado)** | **Docker Compose (Local)** / **AWS EC2 (com Docker) + RDS** |

---

## 🚀 Status Atual do Projeto (13/11/2025)

Esta seção resume o que foi feito até agora. **Todos os 6 requisitos funcionais** do desafio estão implementados. O Backend está 100% concluído. O Frontend está funcionalmente completo e 100% "dockerizado".

### ✅ Concluído
* **Setup do Ambiente:**
    * [X] Estrutura final do monorepo criada com pastas `Frontend/` e `Backend/`.
    * [X] Gerenciamento de segredos implementado via arquivos `.env` e `.env.example`.
* **Backend (`Backend/`):**
    * [X] **API V1-V4 (Lógica):** Todos os endpoints necessários para Home, Pesquisa, Detalhes, Listas Múltiplas e Compartilhamento foram criados e testados.
    * [X] **Segurança:** 100% concluída, segura com `FirebaseAuthentication`.
* **Frontend (`Frontend/`):**
    * [X] **Estrutura de Rotas:** Configurado o **TanStack Router** (file-based routing).
    * [X] **Lógica de Aplicação (Fluxos de Usuário):**
        * [X] **Estado Global (AuthContext V4):** Criado o "sistema nervoso" para gerenciar o usuário e as 3 listas (`favorites`, `watchLater`, `watched`).
        * [X] **Fluxo de Autenticação:** Página de Login/Registro 100% funcional.
        * [X] **Requisito #1 (Pesquisa):** Implementada a página `/pesquisa` (V8) com filtros avançados (`Accordion`), botão "Aplicar Filtros" e UI "LUMIÈRE".
        * [X] **Requisito #2 (Detalhes):** Implementada a página de detalhes (`/filme/$movieId`) com UI "LUMIÈRE", `HeroHeader` "smart", `CastCarousel` (V5) e `MetadataSidebar` (V6) polidos.
        * [X] **Requisito #3 & #5 (Favoritar):** Implementado o fluxo completo com 3 listas (`is_favorite`, `is_watch_later`, `is_watched`) e UI de 2 botões (Coração + Menu).
        * [X] **Requisito #4 (Gestão de API):** Todos os dados do TMDb são gerenciados e servidos pelo Backend.
        * [X] **Requisito #6 (Compartilhar):** Implementado o fluxo de gerar link (`/favoritos`) e a página pública `/share/$listId` (V4) com layout em grid.
    * [X] **UI Principal:**
        * [X] `Navbar`, `Footer`, `MovieCard` (V6), `HeroCarousel` (V6) e `index.tsx` (Home) 100% concluídos e polidos.
        * [X] **Tema:** Implementada a fundação do Dark/Light Mode (Provider + Botão `ThemeToggle`).
* **Deploy (Docker):**
    * [X] **Backend Dockerfile:** Criado com Gunicorn e `collectstatic`.
    * [X] **Frontend Dockerfile:** Criado com build multi-stage (Vite + NGINX).
    * [X] **NGINX Config:** `nginx.conf` criado para servir o React e tratar o roteamento SPA.
    * [X] **Docker Compose:** `docker-compose.yml` criado para orquestrar os 3 containers (backend, frontend, db) localmente, com `healthcheck` para o banco.

### 🚧 Próximos Passos
1.  **Frontend (Polimento Final):**
    * [ ] **Tema:** Concluir a auditoria de cores em todos os componentes para o Dark Mode.
    * [ ] **Feedback:** Adicionar `Toast` (Shadcn) para feedback (ex: "Filme salvo!", "Erro ao logar", "Link copiado!").
    * [ ] **Loading:** Substituir os `<div>Carregando...</div>` por `Spinners/Skeletons` (Shadcn).
2.  **Deploy (AWS):**
    * [X] **Etapa 1: RDS:** Banco de dados MySQL criado na AWS.
    * [X] **Etapa 2: EC2:** Servidor virtual (`t2.micro`) criado na AWS.
    * [X] **Etapa 3: Configurar EC2:** Conectar via SSH, instalar Docker/Git.
    * [X] **Etapa 4: Deploy:** Clonar o repositório, configurar o `.env` de produção (com o Host do RDS) e rodar `docker-compose up -d` no servidor EC2.

---

## 📓 Diário de Bordo & Decisões de Arquitetura

* **Desafio Recebido:** Sexta-feira, 31 de Outubro de 2025, às 16:00.
* **Pausa (Fim de Semana):** 01/11 - 02/11.

### Dia 1 (03/11/2025): Setup e Pivô Estratégico

* **O que fiz:** Iniciei o desafio com a stack sugerida (React, Node.js, Vercel Postgres), mas enfrentei diversos atritos de plataforma (erros de `npm` no Windows, complexidade do Prisma/Vercel).
* **Decisão (O Pivô):** Decidi **pivotar a stack** para uma arquitetura que domino, que é mais robusta e com a qual já tenho experiência de deploy (AWS): **React + Django + MySQL**.
* **Resultado do Dia 1:** Estrutura de monorepo (`Frontend/` e `Backend/`) criada. Ambiente do `Frontend/` (Vite, TS, Tailwind, Shadcn, Firebase) 100% configurado. Base do `Backend/` (Django, `venv`) instalada.

### Dia 2 (04/11/2025): Construção Full-Stack (Backend Seguro e Frontend Routing)

* **O que fiz:** Foco total em construir uma fundação sólida em ambas as pontas (Frontend e Backend).
* **Desafios Resolvidos (Backend):**
    1.  **`mysqlclient` (Problema):** A instalação falhou no Windows (exigindo C++ Build Tools).
    2.  **`mysqlclient` (Solução):** Substituí o driver por `PyMySQL`.
    3.  **Versão (Problema):** O Django 5.x não é compatível com o MariaDB 10.4 do XAMPP.
    4.  **Versão (Solução):** Fiz o downgrade para **Django 4.2 LTS**.
    5.  **Segredos (Problema):** Chaves de API e senhas estavam no código.
    6.  **Segredos (Solução):** Implementei `python-dotenv` e `.env.example` para carregar segredos (`.env`), e atualizei o `.gitignore`.
* **Progresso do Código (Backend V1 - Lógica):**
    * Conexão com o banco MySQL local (`migrate` OK).
    * Defini os `models.py`, `serializers.py`, e `views.py` (CRUD e Pesquisa TMDb).
    * Configurei todas as rotas da API em `urls.py`.
    * **Teste V1:** Todos os endpoints V1 foram **validados um a um no Postman**.
* **Progresso do Código (Backend V2 - Segurança):**
    * Criei a classe `FirebaseAuthentication` (`auth.py`) para validar tokens JWT do Firebase Admin.
    * Travei os endpoints de `favorites` e `shared_lists`.
    * Refatorei as `views.py` para usar `request.user` (filtrando `get_queryset` e salvando em `perform_create`).
    * **Teste V2:** Confirmei que o Postman (sem token) recebe a resposta `401 Unauthorized`.
* **Progresso do Código (Frontend - Routing):**
    1.  Instalei e configurei o **`@tanstack/router-vite-plugin`**.
    2.  Refatorei o `main.tsx` para usar o `RouterProvider`, removendo o `App.tsx` padrão.
    3.  Criei toda a **estrutura de rotas baseada em arquivos** (file-based routing) dentro de `src/routes/`.
    4.  Criei as rotas placeholder para o Layout Raiz (`__root.tsx`), Home (`index.tsx`), `login.tsx`, `favoritos.tsx` e a página dinâmica `share.$listId.tsx`.
    5.  Corrigi o `.gitignore` do frontend para ignorar o arquivo `routeTree.gen.ts` gerado.
* **Resultado do Dia 2:** O **Backend V2 está 100% funcional e seguro.** O **Frontend tem seu "esqueleto" de rotas 100% funcional.**

### Dia 3 (05/11/2025): Lógica do Frontend (Autenticação e Fluxo de Favoritos)

* **O que fiz:** Foco total em implementar a lógica de interação do usuário no `Frontend/`, conectando todos os sistemas.
* **Desafios Resolvidos (Frontend):**
    1.  **Axios (Problema):** A dependência `axios` foi removida por preocupações com vulnerabilidades de segurança.
    2.  **Axios (Solução):** Criei um *wrapper* de `fetch` (`api.ts`) que cumpre a mesma função (anexar tokens) sem dependências.
    3.  **Arquitetura (Problema):** A lógica de favoritar não podia ficar em uma única página, pois precisava ser reutilizada (`/` e `/favoritos`).
    4.  **Arquitetura (Solução):** Refatorei o `AuthContext` para ser o "cérebro" central, gerenciando o estado do `user` *e* dos `favorites` (buscados no login). As páginas (`index`, `favoritos`) se tornaram "smart" (consumindo o contexto) e o `MovieCard` se tornou "dumb" (recebendo props).
    5.  **TypeScript (Problema):** A proteção de rota (`beforeLoad`) no TanStack Router causava um erro de build (`TS2339`) pois o `context.auth` ainda não estava injetado.
    6.  **TypeScript (Solução):** Movi a lógica de proteção para dentro do componente (`useEffect`), que pode usar hooks (`useAuth`, `useNavigate`) e resolver o problema de build.
* **Progresso do Código (Frontend):**
    1.  **Estado Global:** `AuthContext` implementado com lógica de login/logout/favoritos.
    2.  **Fluxo de Login:** Página de Login (Smart/Dumb) 100% funcional (Google e Email/Senha).
    3.  **Fluxo de Pesquisa (Req #1):** `index.tsx` funcional, consumindo o `api.ts`.
    4.  **Fluxo de Favoritos (Req #3, #5):** Lógica de *toggle* (favoritar/desfavoritar) implementada, com feedback visual no `MovieCard` e estado global.
    5.  **Rotas Protegidas:** Rota `/favoritos` agora redireciona com sucesso.
* **Resultado do Dia 3:** O **Frontend V1 está 90% completo**. Todos os fluxos de usuário principais (Login, Pesquisa, Favoritos) estão implementados e funcionais.

### Pausa (06/11/2025)

* Dia focado em outros projetos acadêmicos e descanso.

### Dia 4 (07/11/2025): Conclusão das Features (Req. #2, #6) e Refinamento de UI

* **O que fiz:** Implementei os requisitos funcionais restantes e refinei a UI principal.
* **Progresso do Código (Backend):**
    1.  **Req #6 (Share):** Criei a `PublicSharedListAPIView` (e a URL `/api/public-list/<id>`) para permitir que listas sejam visualizadas publicamente, sem token.
    2.  **Req #2 (Detalhes):** Criei a `TMDbMovieDetailView` (e a URL `/api/tmdb/movie/<id>/`) usando `append_to_response=credits,watch/providers` para buscar todos os dados do filme de uma só vez.
    3.  **Req #1 (Pesquisa):** Criei a `TMDbDiscoverAPIView` (e URL) para permitir buscas filtradas (gênero, ano, nota).
* **Progresso do Código (Frontend):**
    1.  **Req #6 (Share):** Implementei o fluxo de "Compartilhar" na página `/favoritos` (chama `api.post`) e a página `/share/$listId` (chama `api.get` público).
    2.  **Req #1 (Pesquisa):** Criei a nova página `/pesquisa` com layout responsivo (Sidebar fixo no desktop, `Sheet` no mobile) e filtros (gênero, ano, nota, etc.) que consomem a API `discover`.
    3.  **Req #2 (Detalhes):** Criei a nova página `/filme/$movieId`, tornando o `MovieCard` um link. A página usa o `loader` do roteador para buscar os dados e os exibe em componentes "burros" (`HeroHeader`, `CastCarousel`, `MetadataSidebar`) inspirados no design do "LUMIÈRE".
    4.  **UI (Navbar):** Refinei o `Navbar.tsx` para o design "LUMIÈRE" final, com menu central arredondado (`NavigationMenu`), links para "Início" e "Pesquisa", e `activeProps` para destacar a rota ativa.
* **Resultado do Dia 4:** **Todos os 6 requisitos funcionais do desafio estão concluídos.**

### Pausa (08/11/2025 - 09/11/2025)
* Fim de semana (descanso e outros projetos acadêmicos).

### Dia 5 (10/11/2025): Refatoração da UI (Home Page e Cards)
* **O que fiz:** Foco total em refinar a interface do usuário (UI) para alinhá-la com a inspiração de design "LUMIÈRE" e "TMDb".
* **Desafios Resolvidos (Frontend):**
    1.  **UI (Home Page):** A Home Page (`index.tsx`) foi completamente reconstruída. O `loader` foi atualizado para buscar todos os endpoints de descoberta (Populares, Novos, Em Breve, etc.) de uma vez. O layout foi refeito com a hierarquia correta: 1) Hero Carousel, 2) Top 10 (como carrossel estilo Netflix), 3) CTAs (em grid de 3 colunas), 4) Abas (com `MovieCarousel` internos para cada categoria).
    2.  **UI (MovieCard):** O `MovieCard` foi refatorado para o design "TMDb", focado na imagem. O `<Card>` do Shadcn foi removido; o botão "Favoritar" tornou-se um ícone flutuante e a nota tornou-se um `RatingCircle` sobreposto. O título agora usa `Tooltip` para o "efeito de letreiro".
* **Progresso do Código (Frontend):**
    1.  `index.tsx` refatorado para o novo layout de descoberta.
    2.  `MovieCard.tsx` refatorado para o novo design focado em imagem.
    3.  `Top10List.tsx` criado para o carrossel "Top 10" (estilo Netflix).
    4.  `CallToAction.tsx` e `Footer.tsx` criados e adicionados ao `__root.tsx`.
* **Resultado do Dia 5:** A aplicação está com a UI/UX 90% completa, alinhada com a visão de design. O projeto está pronto para o polimento final (Toasts/Spinners) e as melhorias finais nas features.

### Dia 6 (11/11/2025): Polimento de UX (Trailer, "Ver Mais" e CTAs)
* **O que fiz:** Foco no polimento de componentes interativos para finalizar o fluxo de usuário.
* **Progresso do Código (Backend):**
    1.  Adicionado o endpoint `/api/tmdb/movie/<id>/videos/` para buscar dados de trailers.
* **Progresso do Código (Frontend):**
    1.  **Req #2 (Detalhes):** Implementado o botão "Assistir Trailer" no `HeroCarousel`. Criado o `TrailerDialog.tsx` (componente "smart") que busca o trailer (usando a nova API) e o exibe em um modal (`Dialog`) com layout responsivo (80vw/80vh).
    2.  **UI (Home):** Refatorado o `MovieGrid.tsx` (usado nas abas da Home) para ter a lógica de "Ver Mais" incremental (mostrando 5+5+... filmes), com um link final para a página `/pesquisa`.
    3.  **UI (CTAs):** Adicionado ícones (`lucide-react`) e textos de marketing refinados ao componente `CallToAction.tsx`.
* **Resultado do Dia 6:** A aplicação está funcionalmente completa e com um alto nível de polimento de UI, pronta para os toques finais (Toasts) e deploy.

### Dia 7 (12/11/2025): Polimento Final da UI (Rating, Filtros, Listas Múltiplas)
* **O que fiz:** Foco total em refatorar a lógica de listas e polir a página de pesquisa.
* **Desafios Resolvidos (Backend):**
    1.  **Lógica (V4):** O modelo `UserMovieEntry` foi refatorado para usar 3 campos `Boolean` (`is_favorite`, `is_watch_later`, `is_watched`) em vez de um `list_type` único.
    2.  **API (V4):** A API foi refatorada para `GET /api/movies/` (listar tudo) e `POST /api/movie-status/` (a view "smart" que gerencia a lógica de adicionar/remover/trocar de lista).
* **Desafios Resolvidos (Frontend):**
    1.  **AuthContext (V4):** O "cérebro" foi atualizado para consumir a nova API V4, expor as 3 listas (derivadas com `useMemo`) e a nova função `setMovieStatus`.
    2.  **UI (V6):** O `MovieCard`, `HeroCarousel` e `HeroHeader` foram atualizados para usar a nova UI de 2 botões (Coração + Menu de Listas) e chamar a função `setMovieStatus`.
    3.  **UI (Pesquisa V8):** O `SearchFilters.tsx` foi refatorado para usar `<Accordion>` (eliminando o scroll) e o botão "Aplicar Filtros". A página `pesquisa.tsx` (smart) foi atualizada para usar a lógica de "busca manual" (corrigindo bugs de `debounce`) e exibir o total de resultados "+10.000".
* **Resultado do Dia 7:** A lógica de listas múltiplas está 100% funcional. A página de pesquisa está polida e robusta.

### Dia 8 (13/11/2025): Dockerização e Deploy na AWS
* **O que fiz:** Foco em preparar a aplicação para o deploy, "dockerizando" todos os serviços e iniciando a configuração da AWS.
* **Progresso do Código (Docker):**
    1.  **Backend:** Criado o `Dockerfile` do backend (Python + Gunicorn) e instalado o `gunicorn` no `requirements.txt`.
    2.  **Frontend:** Criado o `Dockerfile` do frontend (Vite + NGINX) e o `nginx.conf` para o roteamento de SPA.
    3.  **Orquestração:** Criado o `docker-compose.yml` (V4) com 3 serviços (backend, frontend, db), configurado o `healthcheck` do MySQL e o `command` (para rodar `migrate` e `gunicorn`) no backend.
* **Progresso do Deploy (AWS):**
    1.  **Rede:** Configurado `CORS_ALLOWED_ORIGINS` no `settings.py` do Django.
    2.  **AWS (Etapa 1 - Banco):** Criado o banco de dados **RDS** (MySQL) com "Acesso Público" e o Security Group (firewall) configurado para a porta `3306`.
    3.  **AWS (Etapa 2 - Servidor):** Criada a instância **EC2** (`t2.micro`) e o Security Group (firewall) configurado para as portas `22`, `8080` e `8000`.
* **Resultado do Dia 8:** A aplicação está 100% "dockerizada" e pronta para ser implantada na AWS.

---

## ⚙️ Como Configurar e Rodar

### Pré-requisitos
* **Git**
* **Node.js** (v18 ou superior)
* **Python** (3.10 ou superior)
* **XAMPP** (ou outro servidor MySQL local).
* **Docker Desktop** (para rodar o `docker-compose`)

### 1. Configuração do Ambiente
1.  Clone o repositório:
    ```bash
    git clone [URL_DO_SEU_REPO]
    cd [NOME_DO_PROJETO]
    ```
2.  **PARE O XAMPP (MySQL)** (O Docker precisa da porta 3306).
3.  Crie seus arquivos `.env` locais a partir dos exemplos:
    ```bash
    # No Backend
    cp Backend/.env.example Backend/.env
    
    # No Frontend
    cp Frontend/.env.example Frontend/.env
    ```
4.  Preencha os arquivos `.env` com suas chaves secretas (Firebase, TMDb, Django Secret Key).
    * **IMPORTANTE:** No `Backend/.env`, as variáveis `DB_HOST`, `DB_NAME`, `DB_USER`, etc., serão **ignoradas** pelo `docker-compose` (ele usa as variáveis do `environment:`), mas é bom preenchê-las para testes manuais.

### 2. Rodando a Aplicação (Método Docker - Recomendado)
1.  Inicie o **Docker Desktop**.
2.  Na pasta raiz do projeto, construa as imagens:
    ```bash
    docker-compose build
    ```
3.  Inicie os 3 containers (em segundo plano):
    ```bash
    docker-compose up -d
    ```
4.  (Aguarde 10-15 segundos) Crie seu superusuário:
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```
5.  Acesse o Frontend em `http://localhost:8080` e o Admin em `http://localhost:8000/admin`.

### 3. Rodando a Aplicação (Método Manual - Dev)
* **Terminal 1 (Backend):**
    ```bash
    cd Backend
    source venv/Scripts/activate
    python manage.py runserver
    ```
* **Terminal 2 (Frontend):**
    ```bash
    cd Frontend
    npm run dev
    ```