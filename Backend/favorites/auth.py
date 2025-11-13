import firebase_admin
from firebase_admin import credentials, auth
from rest_framework import authentication
from rest_framework import exceptions
from django.conf import settings
from .models import User
import os
import json

key_filename = os.environ.get('FIREBASE_SERVICE_ACCOUNT_PATH')
key_path = os.path.join(settings.BASE_DIR, key_filename)

try:
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
except FileNotFoundError:
    print(f"ERRO: Arquivo de chave do Firebase não encontrado em {key_path}")
except ValueError as e:
    pass

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # 1. Pega o token do header "Authorization"
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        # 2. Verifica se o header está no formato "Bearer <token>"
        id_token = auth_header.split(' ').pop()
        if not id_token:
            return None

        try:
            # 3. Valida o token com o Firebase Admin
            decoded_token = auth.verify_id_token(id_token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Token inválido: {e}')

        if not decoded_token:
            return None
        
        # 4. Pega o UID (ID do Firebase)
        uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        
        try:
            # 5. Tenta encontrar o usuário no banco de dados
            user = User.objects.get(id=uid)
            return (user, None)
        
        except User.DoesNotExist:
            # 6. Se for o primeiro login, cria o usuário no banco de dados
            user = User.objects.create(id=uid, email=email)
            return (user, None)