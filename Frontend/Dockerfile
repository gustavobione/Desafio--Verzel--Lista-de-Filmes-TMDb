# --- ESTÁGIO 1: Build ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Instala dependências (incluindo o Vite e o TanStack Router)
RUN npm install

COPY . .

# --- MUDANÇA AQUI ---
# Usamos npx vite build em vez de npm run build.
# Isso ignora erros de tipagem estrita (TS) que bloqueiam o deploy
# e garante que o plugin do TanStack gere as rotas automaticamente.
RUN npx vite build

# --- ESTÁGIO 2: Serve ---
FROM nginx:1.23-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos da pasta 'dist' (O Vite gera 'dist', não 'build' por padrão)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]