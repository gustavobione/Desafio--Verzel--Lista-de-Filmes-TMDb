# Desafio Elite Dev - Lista de Filmes (Full-Stack)

Este projeto é uma aplicação full-stack de "Lista de Filmes", criada como parte do "Desafio Elite Dev". A aplicação permite aos usuários pesquisar filmes na API do TMDb, salvar seus favoritos e compartilhar suas listas.

A arquitetura é dividida em duas pastas principais:
* `/Frontend`: Uma aplicação SPA (Single Page Application) feita com React e Vite.
* `/Backend`: Uma API RESTful feita com Python e Django.

---

## 💻 Stack Tecnológica

| Área | Tecnologia |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Shadcn UI, TanStack Router, Axios |
| **Backend** | Python, Django (4.2), Django REST Framework, `PyMySQL`, `django-cors-headers` |
| **Autenticação** | Firebase Authentication (Login com Google), Firebase Admin SDK |
| **Banco de Dados (Dev)**| MySQL (via XAMPP / MariaDB 10.4) |
| **Banco de Dados (Prod)**| AWS RDS (MySQL) |
| **Deploy (Planejado)** | AWS (Frontend no S3/CloudFront, Backend no EC2/Elastic Beanstalk) |

---

## 🚀 Status Atual do Projeto (04/11/2025)

Esta seção resume o que foi feito até agora. O **Backend está 100% concluído (V1 e V2)** e pronto para o desenvolvimento do Frontend.

### ✅ Concluído
* **Setup do Ambiente:**
    * [X] Estrutura final do monorepo criada com pastas `Frontend/` e `Backend/`.
    * [X] Gerenciamento de segredos implementado via arquivos `.env` e `.env.example`.
* **Frontend (`Frontend/`):**
    * [X] Projeto criado com Vite + React + TS.
    * [X] Dependências instaladas (Tailwind, Shadcn, Router, Axios, Firebase Client).
    * [X] Configuração completa do Tailwind, Shadcn e Firebase (`firebase.ts`).
* **Backend (`Backend/`):**
    * [X] Ambiente virtual (`venv`) e `requirements.txt` finalizados.
    * [X] Django 4.2 LTS e todas as dependências (DRF, PyMySQL, CORS, Firebase Admin) instalados.
    * [X] Conexão com banco MySQL (XAMPP/MariaDB) **100% funcional**.
    * [X] Painel de Admin (`/admin/`) acessível.
    * [X] **API V1 (Lógica):**
        * [X] Modelos (`User`, `FavoriteMovie`, `SharedList`) criados e migrados.
        * [X] Endpoints V1 (CRUD de Favoritos, Links, Pesquisa TMDb) criados.
        * [X] **TESTES (V1):** Todos os endpoints V1 validados com sucesso via Postman.
    * [X] **API V2 (Segurança):**
        * [X] Lógica de autenticação com Firebase Admin (`auth.py`) implementada.
        * [X] Endpoints de `favorites` e `shared_lists` **travados** (requerem token `IsAuthenticated`).
        * [X] Lógica das Views (`get_queryset`, `perform_create`) atualizada para filtrar dados por `request.user`.
        * [X] **TESTES (V2):** Endpoints seguros testados no Postman, retornando `401 Unauthorized` (como esperado) quando o token não é fornecido.

### 🚧 Próximos Passos
1.  **Frontend (Desenvolvimento):**
    * [ ] Criar a estrutura de rotas (páginas) com o TanStack Router.
    * [ ] Criar um Contexto/Estado Global (Zustand/Jotai) para gerenciar o estado do usuário e o token.
    * [ ] Implementar o fluxo de login com Google (componente de Login/Logout).
    * [ ] Criar o `apiService` (com `axios`) para encapsular as chamadas de API (enviando o token).
    * [ ] Desenvolver os componentes da UI (SearchBar, MovieCard, Layout).
    * [ ] Conectar a UI com os endpoints do backend.
2.  **Deploy (AWS):**
    * [ ] Iniciar a configuração do RDS, S3 e Elastic Beanstalk.

---

## 📓 Diário de Bordo & Decisões de Arquitetura

Esta seção detalha o processo de pensamento e as decisões tomadas durante o desenvolvimento, demonstrando a resolução de problemas no dia a dia.

### Dia 1 (03/11/2025): Setup e Pivô Estratégico

* **O que fiz:** Iniciei o desafio com a stack sugerida (React, Node.js, Vercel Postgres), mas enfrentei diversos atritos de plataforma (erros de `npm` no Windows, complexidade do Prisma/Vercel).
* **Decisão (O Pivô):** Decidi **pivotar a stack** para uma arquitetura que domino, que é mais robusta e com a qual já tenho experiência de deploy (AWS): **React + Django + MySQL**.
* **Resultado do Dia 1:** Estrutura de monorepo (`Frontend/` e `Backend/`) criada. Ambiente do `Frontend/` (Vite, TS, Tailwind, Shadcn, Firebase) 100% configurado. Base do `Backend/` (Django, `venv`) instalada.

### Dia 2 (04/11/2025): Construção e Segurança da API Backend (V1 e V2)

* **O que fiz:** Foco total em construir e proteger a API do `Backend/`.
* **Desafios Resolvidos:**
    1.  **`mysqlclient` (Problema):** A instalação falhou no Windows (exigindo C++ Build Tools).
    2.  **`mysqlclient` (Solução):** Substituí o driver por `PyMySQL` e configurei o `__init__.py` do Django.
    3.  **Versão (Problema):** O Django 5.x não é compatível com o MariaDB 10.4 do XAMPP.
    4.  **Versão (Solução):** Fiz o downgrade para **Django 4.2 LTS**, garantindo compatibilidade e estabilidade.
    5.  **Segredos (Problema):** Chaves de API e senhas estavam no código.
    6.  **Segredos (Solução):** Implementei `python-dotenv` para carregar segredos (`.env`), criei arquivos `.env.example` para documentação e atualizei o `.gitignore` para proteger chaves.
* **Progresso do Código (V1 - Lógica):**
    * Conexão com o banco MySQL local (`migrate` OK).
    * Defini os `models.py`, `serializers.py`, e `views.py` (CRUD e Pesquisa TMDb).
    * Configurei todas as rotas da API em `urls.py`.
    * **Teste V1:** Todos os endpoints V1 foram **validados um a um no Postman** (GET, POST, DELETE) e operaram como esperado.
* **Progresso do Código (V2 - Segurança):**
    * Criei a classe `FirebaseAuthentication` (`auth.py`) para validar tokens JWT do Firebase Admin.
    * Travei os endpoints de `favorites` e `shared_lists` (requerem `IsAuthenticated`).
    * Refatorei as `views.py` para usar `request.user` (filtrando `get_queryset` e salvando em `perform_create`), garantindo que um usuário só acesse seus próprios dados.
    * **Teste V2:** Confirmei que o servidor inicia corretamente e que o Postman (sem token) recebe a resposta `401 Unauthorized` esperada.
* **Resultado do Dia 2:** O **Backend V2 está 100% funcional e seguro.** O desenvolvimento do servidor está concluído e pronto para o Frontend.

---

## ⚙️ Como Configurar e Rodar

(Esta seção permanece a mesma, mas agora os `.env.example` estão no repositório, tornando-a mais fácil)

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