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
| **Banco de Dados (Prod)**| AWS RDS (MySQL) |
| **Deploy (Planejado)** | AWS (Frontend no S3/CloudFront, Backend no EC2/Elastic Beanstalk) |

---

## 🚀 Status Atual do Projeto (10/11/2025)

Esta seção resume o que foi feito até agora. **Todos os 6 requisitos funcionais** do desafio estão implementados. O Backend está 100% concluído, e o Frontend está 95% concluído (faltando apenas polimento de UI).

### ✅ Concluído
* **Setup do Ambiente:**
    * [X] Estrutura final do monorepo criada com pastas `Frontend/` e `Backend/`.
    * [X] Gerenciamento de segredos implementado via arquivos `.env` e `.env.example`.
* **Backend (`Backend/`):**
    * [X] **API V1 (Lógica):** Testada e funcional via Postman.
    * [X] **API V2 (Segurança):** 100% concluída, segura e testada.
    * [X] **API V3 (Features):** Todos os endpoints necessários para Home, Pesquisa, Detalhes e Compartilhamento foram criados e testados.
* **Frontend (`Frontend/`):**
    * [X] Projeto criado com Vite + React + TS.
    * [X] Configuração completa do Tailwind, Shadcn e Firebase (`firebase.ts`).
    * [X] **Estrutura de Rotas:**
        * [X] Configurado o **TanStack Router** (file-based routing).
        * [X] Criado o "esqueleto" de todas as páginas necessárias.
    * [X] **Lógica de Aplicação (Fluxos de Usuário):**
        * [X] **Cliente de API (fetch):** Criado o `api.ts` (wrapper de `fetch`) que anexa tokens de autenticação automaticamente (substituindo o `axios`).
        * [X] **Estado Global (AuthContext):** Criado o "sistema nervoso" para gerenciar o estado do usuário e dos favoritos.
        * [X] **Fluxo de Autenticação:** Página de Login/Registro 100% funcional (com design "LUMIÈRE").
        * [X] **Requisito #1 (Pesquisa):** Implementada uma página `/pesquisa` dedicada com filtros responsivos (Sidebar/Sheet) e busca "em tempo real" (debounce).
        * [X] **Requisito #2 (Detalhes):** Implementada a página de detalhes do filme (`/filme/$movieId`) com Hero, Elenco e Metadados (design "LUMIÈRE").
        * [X] **Requisito #3 & #5 (Favoritar):** Implementado o fluxo completo de favoritar/desfavoritar, com estado centralizado e feedback visual imediato.
        * [X] **Requisito #4 (Gestão de API):** Todos os dados do TMDb são gerenciados e servidos pelo Backend.
        * [X] **Requisito #6 (Compartilhar):** Implementado o fluxo de gerar link (`/favoritos`) e a página pública (`/share/$listId`).
        * [X] **Rotas Protegidas:** Rota `/favoritos` redireciona usuários não logados com sucesso.
    * [X] **UI Principal:**
        * [X] `Navbar` implementada com design "LUMIÈRE" (3 colunas) e lógica de autenticação.
        * [X] `Footer` criado e implementado no layout raiz.
        * [X] `MovieCard` refatorado para o design "TMDb" (foco na imagem, nota e favorito flutuantes).
        * [X] `index.tsx` (Home Page) refatorada para o design "LUMIÈRE" (Hero, Top 10, CTAs, Abas com Carrosséis).

### 🚧 Próximos Passos
1.  **Frontend (Refinamento/Polimento):**
    * [ ] Adicionar `Toast` (Shadcn) para feedback (ex: "Filme salvo!", "Erro ao logar", "Link copiado!").
    * [ ] Adicionar `Spinners/Skeletons` (Shadcn) para os estados de `isLoading` (no `AuthContext`, `pesquisa.tsx`, etc.).
    * [ ] **Melhoria (Pesquisa):** Refinar o feedback de "Nenhum resultado encontrado" e o estado de `isLoading` (Skeleton).
    * [ ] **Melhoria (Favoritos):** Adicionar botões de ação na página (ex: "Gerar Link de Partilha" que agora está no CTA).
    * [ ] **Melhoria (Detalhes):** Adicionar links/botões para "Trailer" (se disponível) e "Homepage" do filme.
2.  **Deploy (AWS):**
    * [ ] Iniciar a configuração do RDS, S3 e Elastic Beanstalk.

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
    1.  **Req #6 (Share):** Implementei o fluxo de "Compartilhar" na página `/favoritos` (chama `api.post`) e a página `/share/$listId` (chama `api.get` público), reutilizando o `MovieCard` em modo "read-only".
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

---

## ⚙️ Como Configurar e Rodar

(Esta seção permanece a mesma)

### Pré-requisitos
* **Git**
* **Node.js** (v18 ou superior)
* **Python** (3.10 ou superior)
* **XAMPP** (ou outro servidor MySQL local).

### 1. Configuração do Ambiente
1.  Clone o repositório:
    ```bash
    git clone [URL_DO_SEU_REPO]
    cd [NOME_DO_PROJETO]
    ```
2.  Inicie o **MySQL** pelo painel do XAMPP.
3.  Acesse o **MySQL Workbench** e crie o banco de dados (o nome deve bater com o `Backend/.env.example`):
    ```sql
    CREATE DATABASE verzel_db;
    ```
4.  Crie seus arquivos `.env` locais a partir dos exemplos:
    ```bash
    # No Backend
    cp Backend/.env.example Backend/.env
    
    # No Frontend
    cp Frontend/.env.example Frontend/.env
    ```
5.  Preencha os arquivos `.env` com suas chaves secretas (Firebase, TMDb, Django Secret Key).

### 2. Configuração do Backend
1.  Abra um terminal e navegue até a pasta `Backend/`:
    ```bash
    cd Backend
    ```
2.  Crie e ative o ambiente virtual:
    ```bash
    python -m venv venv
    source venv/Scripts/activate
    ```
3.  Instale todas as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4.  Rode as migrações:
    ```bash
    python manage.py migrate
    ```
5.  Crie seu usuário administrador:
    ```bash
    python manage.py createsuperuser
    ```

### 3. Configuração do Frontend
1.  Abra um **segundo terminal** e navegue até a pasta `Frontend/`:
    ```bash
    cd Frontend
    ```
2.  Instale todas as dependências do Node:
    ```bash
    npm install
    ```

### 4. Rodando a Aplicação
* **Terminal 1 (Backend):**
    ```bash
    cd Backend
    source venv/Scripts/activate
    python manage.py runserver
    ```
    *(Rodando em `http://127.0.0.1:8000`)*

* **Terminal 2 (Frontend):**
    ```bash
    cd Frontend
    npm run dev
    ```
    *(Rodando em `http://localhost:5173`)*