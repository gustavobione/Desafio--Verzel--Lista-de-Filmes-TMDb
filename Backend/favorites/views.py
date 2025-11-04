# Arquivo: Backend/favorites/views.py

from rest_framework import viewsets, views, response, status
from .models import User, FavoriteMovie, SharedList
from .serializers import UserSerializer, FavoriteMovieSerializer, SharedListSerializer
import requests
from django.conf import settings  # Para pegar a chave da API
from rest_framework.permissions import IsAuthenticated
from .auth import FirebaseAuthentication


# --- API de CRUD para Filmes Favoritos ---
# ModelViewSet já nos dá GET, POST, PUT, DELETE de graça
class FavoriteMovieViewSet(viewsets.ModelViewSet):
    # queryset = FavoriteMovie.objects.all() # <- Linha antiga
    serializer_class = FavoriteMovieSerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]  # Só permite usuários logados

    def get_queryset(self):
        """Esta view só deve retornar os favoritos DO usuário logado."""
        user = self.request.user
        return FavoriteMovie.objects.filter(user=user)

    def perform_create(self, serializer):
        """Salva o novo favorito associando-o AO usuário logado."""
        serializer.save(user=self.request.user)


# --- API de CRUD para Links Compartilháveis ---
class SharedListViewSet(viewsets.ModelViewSet):
# queryset = SharedList.objects.all() # <- Linha antiga
    serializer_class = SharedListSerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Esta view só deve retornar os links DO usuário logado."""
        user = self.request.user
        return SharedList.objects.filter(user=user)

    def perform_create(self, serializer):
        """Salva o novo link associando-o AO usuário logado."""
        serializer.save(user=self.request.user)


# --- API para o Requisito 4 (Pesquisar no TMDb) ---
# Esta é uma view simples, não um ViewSet
class TMDbSearchAPIView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        query = request.query_params.get("query", None)
        if not query:
            return response.Response(
                {"error": "O parâmetro 'query' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1. Pegue sua chave da API do TMDb
        # (Vá para Etapa 4.5 para ver onde colocar isso)
        api_key = settings.TMDB_API_KEY

        url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={query}&language=pt-BR"

        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()  # Lança erro se a API falhar
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response(
                {"error": f"Falha ao contatar API do TMDb: {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
