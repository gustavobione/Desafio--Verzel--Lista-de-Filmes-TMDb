# Arquivo: Backend/favorites/views.py

from rest_framework import viewsets, views, response, status
from .models import User, FavoriteMovie, SharedList
from .serializers import UserSerializer, FavoriteMovieSerializer, SharedListSerializer
import requests
from django.conf import settings # Para pegar a chave da API

# --- API de CRUD para Filmes Favoritos ---
# ModelViewSet já nos dá GET, POST, PUT, DELETE de graça
class FavoriteMovieViewSet(viewsets.ModelViewSet):
    queryset = FavoriteMovie.objects.all()
    serializer_class = FavoriteMovieSerializer

    # NOTA DE SEGURANÇA:
    # Por enquanto, isso lista TODOS os filmes.
    # Na próxima etapa (Autenticação), vamos filtrar isso
    # para mostrar apenas os filmes do usuário logado.
    
    # Também vamos sobreescrever a lógica de "create"
    # para associar o filme ao usuário logado.


# --- API de CRUD para Links Compartilháveis ---
class SharedListViewSet(viewsets.ModelViewSet):
    queryset = SharedList.objects.all()
    serializer_class = SharedListSerializer
    # (Também precisa de segurança)


# --- API para o Requisito 4 (Pesquisar no TMDb) ---
# Esta é uma view simples, não um ViewSet
class TMDbSearchAPIView(views.APIView):
    # Por enquanto, permita qualquer um (sem autenticação)
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        query = request.query_params.get('query', None)
        if not query:
            return response.Response(
                {"error": "O parâmetro 'query' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Pegue sua chave da API do TMDb
        # (Vá para Etapa 4.5 para ver onde colocar isso)
        api_key = settings.TMDB_API_KEY
        
        url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={query}&language=pt-BR"

        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status() # Lança erro se a API falhar
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response(
                {"error": f"Falha ao contatar API do TMDb: {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )