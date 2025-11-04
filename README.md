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
| **Autenticação** | Firebase Authentication (Login com Google) |
| **Banco de Dados (Dev)**| MySQL (via XAMPP / MariaDB 10.4) |
| **Banco de Dados (Prod)**| AWS RDS (MySQL) |
| **Deploy (Planejado)** | AWS (Frontend no S3/CloudFront, Backend no EC2/Elastic Beanstalk) |

---

## 🚀 Status Atual do Projeto (04/11/2025)

Esta seção resume o que foi feito até agora.

### ✅ Concluído
* **Setup do Ambiente:**
    * [X] Setup inicial (Vercel, Node.js, Postgres) **descartado** em favor de uma stack mais robusta e familiar.
    * [X] Estrutura final do monorepo criada com pastas `Frontend/` e `Backend/`.
* **Frontend (`Frontend/`):**
    * [X] Projeto criado com Vite + React + TS.
    * [X] Dependências instaladas (Tailwind, Shadcn, Router, Axios, Firebase).
    * [X] Configuração do Tailwind (plugin do Vite) e `tailwind.config.js` manual finalizada.
    * [X] Configuração do Shadcn UI (`npx init`) finalizada.
    * [X] Configuração do Firebase (`src/lib/firebase.ts` + `.env`) concluída.
* **Backend (`Backend/`):**
    * [X] Ambiente virtual (`venv`) criado e `requirements.txt` gerado.
    * [X] Django 4.2 LTS instalado (para compatibilidade com MariaDB 10.4).
    * [X] Dependências (DRF, PyMySQL, CORS, Firebase Admin) instaladas.
    * [X] Configuração do `settings.py` (CORS, `INSTALLED_APPS`, `DATABASES`) finalizada.
    * [X] Conexão com banco MySQL (XAMPP/MariaDB) **100% funcional**.
    * [X] Migrações (`migrate`) iniciais aplicadas.
    * [X] Superusuário criado e painel `/admin/` **acessível**.
    * [X] **Models:** Modelos `User`, `FavoriteMovie`, e `SharedList` criados em `models.py`.
    * [X] **Migrações:** Novas migrações dos modelos aplicadas com sucesso.
    * [X] **API (Views/Serializers):** Endpoints da API V1 criados (CRUD de Favoritos, CRUD de Links, Pesquisa TMDb).
    * [X] **Rotas:** URLs da API configuradas em `config/urls.py` e `favorites/urls.py`.
    * [X] **TESTES:** Todos os endpoints da API V1 foram **testados e validados com sucesso via Postman.**

### 🚧 Próximos Passos
1.  **Backend (Segurança):**
    * [ ] Implementar a lógica de autenticação.
    * [ ] Criar um "helper" ou "middleware" para validar o Token JWT do Firebase em cada requisição.
    * [ ] Travar os endpoints de `favorites` e `shared-lists` para que um usuário só possa ver e editar os *seus próprios* dados.
2.  **Frontend (Desenvolvimento):**
    * [ ] Criar a estrutura de rotas (páginas) com o TanStack Router.
    * [ ] Criar um Contexto/Estado Global (Zustand/Jotai) para gerenciar o estado do usuário e o token.
    * [ ] Implementar o fluxo de login com Google (componente de Login/Logout).
    * [ ] Criar o `apiService` (com `axios`) para encapsular as chamadas de API (enviando o token).
    * [ ] Desenvolver os componentes da UI (SearchBar, MovieCard, Layout).
    * [ ] Conectar a UI com os endpoints do backend.
3.  **Deploy (AWS):**
    * [ ] Iniciar a configuração do RDS, S3 e Elastic Beanstalk.

---

## 📓 Diário de Bordo & Decisões de Arquitetura

Esta seção detalha o processo de pensamento e as decisões tomadas durante o desenvolvimento, demonstrando a resolução de problemas no dia a dia.

### Dia 1 (03/11/2025): Setup e Pivô Estratégico

* **O que fiz:** Iniciei o desafio com a stack sugerida (React, Node.js, Vercel Postgres). Gastei um tempo considerável configurando o ambiente, mas enfrentei diversos atritos de plataforma:
    1.  Erros persistentes no `npm` (loops de `audit`, falhas no `npx`).
    2.  Erros de `EBUSY` no Windows ao instalar o Prisma.
    3.  Incompatibilidade entre a arquitetura Serverless do Vercel e um `npx` quebrado.
    4.  Atrito de aprendizado com o Vercel Postgres/Neon, que eu não dominava.
* **Decisão (O Pivô):** Percebi que gastar mais tempo lutando contra a configuração de ferramentas que não domino seria um risco para o prazo de 4-7 dias. Decidi **pivotar a stack** para uma arquitetura que domino, que é mais robusta e com a qual já tenho experiência de deploy (AWS): **React + Django + MySQL**.
* **Resultado do Dia 1:** A stack foi redefinida. Criei a nova estrutura de monorepo (`Frontend/` e `Backend/`). Configurei todo o ambiente do `Frontend/` (Vite, TS, Tailwind, Shadcn, Firebase, Rotas). Configurei a base do `Backend/` (Django, `venv`, `pip install`).

### Dia 2 (04/11/2025): Construção e Validação da API Backend

* **O que fiz:** Foco total em construir a API do `Backend/`.
* **Desafios Resolvidos:**
    1.  **Conexão com BD:** Configurei o XAMPP (MySQL/MariaDB).
    2.  **`mysqlclient` (Problema):** A instalação do `mysqlclient` falhou no Windows (exigindo C++ Build Tools).
    3.  **`mysqlclient` (Solução):** Substituí o driver por `PyMySQL` e configurei o `__init__.py` do Django para usá-lo, resolvendo a instalação sem precisar compilar.
    4.  **Versão (Problema):** O Django 5.x (mais novo) não é compatível com o MariaDB 10.4 do XAMPP.
    5.  **Versão (Solução):** Fiz o downgrade do projeto para **Django 4.2 LTS** (Long-Term Support), que é 100% compatível, mais estável e uma escolha profissional.
* **Progresso do Código:**
    1.  A conexão com o banco MySQL local foi estabelecida com sucesso (`migrate` OK).
    2.  Defini os `models.py` (`User`, `FavoriteMovie`, `SharedList`).
    3.  Criei os `serializers.py` para traduzir os modelos para JSON.
    4.  Implementei as `views.py` (usando `ModelViewSet` para CRUD) e a view customizada `TMDbSearchAPIView` para o Requisito 4 (Pesquisa).
    5.  Configurei todas as rotas da API em `urls.py`.
* **Resultado do Dia 2:** O **Backend V1 está 100% funcional.** Todos os endpoints (Listar, Criar, Deletar Favoritos; Criar Link; Pesquisar no TMDb) foram validados um a um no Postman e estão operando como esperado. O projeto está pronto para a implementação da camada de segurança (autenticação).

---

## ⚙️ Como Configurar e Rodar

(Esta seção permanece a mesma, pois as instruções de setup que você aprovou estão perfeitas)

### Pré-requisitos
* **Git**
* **Node.js** (v18 ou superior)
* **Python** (3.10 ou superior)
* **XAMPP** (ou outro servidor MySQL local). *Nota: O projeto foi configurado para MariaDB 10.4 (que vem no XAMPP) usando Django 4.2.*

### 1. Configuração do Ambiente
1.  Clone o repositório:
    ```bash
    git clone [URL_DO_SEU_REPO]
    cd [NOME_DO_PROJETO]
    ```
2.  Inicie o **MySQL** pelo painel do XAMPP.
3.  Acesse o **MySQL Workbench** (ou phpMyAdmin) e crie o banco de dados:
    ```sql
    CREATE DATABASE verzel_db;
    ```

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
3.  Instale todas as dependências (do `requirements.txt`):
    ```bash
    pip install -r requirements.txt
    ```
4.  Rode as migrações para criar as tabelas:
    ```bash
    python manage.py migrate
    ```
5.  Crie seu usuário administrador local:
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
3.  Crie o arquivo de ambiente para o Firebase. Crie um arquivo chamado `.env` na raiz do `Frontend/` e adicione suas chaves:
    ```env
    # Arquivo: Frontend/.env
    VITE_FIREBASE_API_KEY="SUA_CHAVE_AQUI"
    VITE_FIREBASE_AUTH_DOMAIN="SEU_DOMINIO_AQUI"
    VITE_FIREBASE_PROJECT_ID="SEU_ID_AQUI"
    # ... (etc.)
    ```

### 4. Rodando a Aplicação
* **Terminal 1 (Backend):**
    ```bash
    cd Backend
    source venv/Scripts/activate
    python manage.py runserver
    ```
    *(Seu Back-end estará rodando em `http://127.0.0.1:8000`)*

* **Terminal 2 (Frontend):**
    ```bash
    cd Frontend
    npm run dev
    ```
    *(Seu Front-end estará rodando em `http://localhost:5173`)*