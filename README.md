# Desafio Elite Dev - Lista de Filmes (Full-Stack)

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)

Este projeto é uma aplicação full-stack de "Lista de Filmes", criada como parte do "Desafio Elite Dev". A aplicação permite aos usuários pesquisar filmes, salvar seus favoritos e compartilhar suas listas, utilizando a API do The Movie Database (TMDb).

O deploy da aplicação está disponível em: **[Link do Vercel Aqui]**

## 💻 Stack Tecnológica

A arquitetura deste projeto foi escolhida para ser moderna, performática e otimizada para a plataforma de deploy (Vercel).

* **Front-End:** React, Vite, TypeScript, Tailwind CSS, Shadcn UI
* **Back-End:** Node.js (via Vercel Serverless Functions)
* **Banco de Dados:** Vercel Postgres
* **ORM:** Prisma
* **Autenticação:** Firebase Authentication (Login com Google)
* **Deploy:** Vercel

---

## 🎯 Funcionalidades

Lista de funcionalidades requisitadas pelo desafio e o status atual de cada uma.

### ✅ Concluídas
- [ ] Configuração inicial do projeto (Vite, TS, Tailwind, Prisma, Firebase).

### 🚧 Em Andamento / Pendentes
- [ ] Autenticação de usuário (Login com Google).
- [ ] Interface de pesquisa de filmes (consumindo API TMDb).
- [ ] Exibição de detalhes dos filmes (com nota em destaque).
- [ ] Funcionalidade de Adicionar/Remover filmes da lista de favoritos.
- [ ] Armazenamento dos favoritos no banco de dados (associado ao usuário).
- [ ] Geração de link compartilhável para a lista de favoritos.
- [ ] Página pública para exibir uma lista de favoritos a partir de um link.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### 1. Pré-requisitos

- Node.js (v18 ou superior)
- `npm` ou `yarn`
- Uma conta no [Google Firebase](https://console.firebase.google.com/) (para chaves de autenticação).
- Uma conta no [TMDb](https://www.themoviedb.org/signup) (para a chave de API).
- Vercel CLI (para rodar o ambiente completo): `npm install -g vercel`

### 2. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio

3. Instalar Dependências
Bash

npm install
4. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto, copiando o .env.example (se houver) ou adicionando as seguintes chaves:

Snippet de código

# URL do banco de dados (fornecida pelo Vercel Postgres)
POSTGRES_PRISMA_URL="sua_url_do_banco"

# Chave de serviço do Firebase Admin (em formato JSON, colada como string)
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'

# Chave da API do The Movie Database (TMDb)
TMDB_API_KEY="sua_chave_tmdb"

# Configuração do Firebase Client (para o Front-End)
VITE_FIREBASE_API_KEY="sua_chave_aqui"
VITE_FIREBASE_AUTH_DOMAIN="seu_dominio.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu_project_id"
VITE_FIREBASE_STORAGE_BUCKET="seu_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
VITE_FIREBASE_APP_ID="seu_app_id"
Importante: As chaves do Front-End (Firebase Client) precisam começar com o prefixo VITE_ para que o Vite as exponha para a aplicação.

5. Rodar as Migrations do Banco
Aplique o schema do Prisma no seu banco de dados Vercel Postgres:

Bash

npx prisma migrate dev
(Pode ser necessário rodar npx prisma generate após a migração).

6. Rodar o Projeto
Use o Vercel CLI para simular o ambiente de produção (Front-End + Back-End Serverless) localmente:

Bash

vercel dev
A aplicação estará disponível em http://localhost:3000.

📂 Estrutura do Projeto
Este projeto utiliza uma estrutura de "monorepo" otimizada para o Vercel:

/ (Raiz): Contém toda a configuração do Front-End (Vite, React, src/).

/api/: Contém todo o Back-End (Serverless Functions em Node.js).

/prisma/: Contém o schema e as migrations do banco de dados.

O Vercel automaticamente identifica o Front-End na raiz e as funções na pasta /api, fazendo o deploy de ambos de forma integrada.

📓 Diário de Bordo & Decisões de Arquitetura
Como solicitado no desafio, esta seção explica as decisões tomadas e o progresso diário.

Dia 1 (03/11/2025)
O que fiz: Criação da estrutura inicial do projeto com Vite + React + TS. Configuração do Tailwind CSS e inicialização do Shadcn UI.

Decisões: Escolhi o stack Vite/React/Tailwind pela alta produtividade. Para o back-end, optei por Vercel Serverless Functions com Prisma e Vercel Postgres, pois é a arquitetura nativa da plataforma de deploy e garante o bônus de 1 ponto. A autenticação será feita com Firebase (Google) apenas para obter a identidade do usuário, mantendo os dados da aplicação no Postgres.

Dificuldades: Nenhuma até o momento.

Dia 2 (A preencher)
O que fiz:

Decisões:

Dificuldades:

⚠️ Pontos de Atenção (Não Funciona)
Conforme a exigência do desafio, esta seção lista o que (ainda) não está funcionando como o esperado ou quais bugs são conhecidos.

(A ser preenchido conforme o desenvolvimento)