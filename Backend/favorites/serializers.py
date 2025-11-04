# Arquivo: Backend/favorites/serializers.py

from rest_framework import serializers
from .models import User, FavoriteMovie, SharedList

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']

class FavoriteMovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteMovie
        # Vamos expor todos os campos
        fields = '__all__'
        # Vamos fazer o 'user' ser "apenas leitura".
        # A lógica da view (Etapa 4) irá preenchê-lo
        read_only_fields = ['user', 'id', 'added_at']

class SharedListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedList
        fields = '__all__'
        read_only_fields = ['user','id', 'created_at']