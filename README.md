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

## 🚀 Status Atual do Projeto (03/11/2025)

Esta seção resume o que foi feito até agora.

### ✅ Concluído
* **Setup do Ambiente:** Projeto dividido em pastas `Frontend/` e `Backend/`.
* **Backend (`Backend/`):**
    * Ambiente virtual (`venv`) criado.
    * Django 4.2 e todas as dependências (DRF, PyMySQL, CORS, Firebase Admin) instalados.
    * Projeto Django e app `favorites` criados.
    * Configuração do `settings.py` (CORS, `INSTALLED_APPS`) finalizada.
    * Configuração do `__init__.py` para usar `PyMySQL`.
    * **Conexão com o banco de dados MySQL (XAMPP) local está 100% funcional.**
    * Migrações (`migrate`) iniciais aplicadas com sucesso.
    * Superusuário (`createsuperuser`) criado.
    * Servidor (`runserver`) está rodando.
    * **Painel de Admin (`/admin/`) está acessível.**
* **Frontend (`Frontend/`):**
    * Projeto criado com Vite + React + TS.
    * Todas as dependências (Tailwind, Shadcn, Router, Axios, Firebase) instaladas.
    * Configuração do Tailwind (via plugin do Vite) finalizada.
    * Configuração do Shadcn UI (`npx init`) finalizada.
    * Arquivo de configuração do Firebase (`src/lib/firebase.ts`) criado.

### 🚧 Próximos Passos (O Escopo Atual)
1.  **Backend:**
    * Definir os Modelos de dados em `favorites/models.py` (ex: `FavoriteMovie`).
    * Criar e aplicar as novas migrações.
    * Criar os `serializers.py` e `views.py` (API Endpoints) para a lista de favoritos.
    * Criar o endpoint de validação do token do Firebase.
2.  **Frontend:**
    * Criar a estrutura de rotas (páginas) com o TanStack Router.
    * Desenvolver os componentes da UI (Home, Pesquisa, Card de Filme).
    * Implementar o fluxo de login com Google.
    * Conectar o Front (Axios) com a API do Back (Django).

---

## ⚙️ Como Configurar e Rodar (Em Casa)

Siga estes passos para recriar o ambiente de desenvolvimento em uma nova máquina.

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
3.  Instale todas as dependências (que você "congelou" no `requirements.txt`):
    ```bash
    pip install -r requirements.txt
    ```
4.  Verifique a configuração do banco em `config/settings.py` (deve apontar para `127.0.0.1` e `verzel_db`, como já está).
5.  Rode as migrações para criar as tabelas no seu novo banco:
    ```bash
    python manage.py migrate
    ```
6.  Crie seu usuário administrador local:
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
    # ... (etc., copie do seu arquivo src/lib/firebase.ts)
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