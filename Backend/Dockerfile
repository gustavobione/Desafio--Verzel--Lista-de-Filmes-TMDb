# 1. Imagem base do Python
FROM python:3.10-slim

# 2. Define variáveis de ambiente
# Evita que o Python armazene arquivos .pyc
ENV PYTHONDONTWRITEBYTECODE 1
# Garante que os logs saiam direto para o console (necessário para o Docker)
ENV PYTHONUNBUFFERED 1

# 3. Define o diretório de trabalho
WORKDIR /app

# 4. Instala dependências
# Copia apenas o requirements.txt primeiro para aproveitar o cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia todo o código do backend
COPY . .

RUN python manage.py collectstatic --noinput

# 6. Expõe a porta (o Gunicorn rodará na 8000)
EXPOSE 8000

# 7. Comando para iniciar o servidor
# Usamos Gunicorn como um servidor de produção WSGI
# ATENÇÃO: Troque "meuprojeto" pelo nome da pasta que contém seu arquivo wsgi.py
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]