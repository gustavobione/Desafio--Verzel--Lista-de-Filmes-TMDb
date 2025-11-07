# Arquivo: Backend/favorites/views.py

from rest_framework import viewsets, views, response, status
from .models import User, FavoriteMovie, SharedList
from .serializers import UserSerializer, FavoriteMovieSerializer, SharedListSerializer
import requests
from django.conf import settings  # Para pegar a chave da API
from rest_framework.permissions import IsAuthenticated
from .auth import FirebaseAuthentication
from rest_framework import generics


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
        
class PublicSharedListAPIView(generics.RetrieveAPIView):
        # 1. Não requer autenticação
    authentication_classes = []
    permission_classes = []
        
    queryset = SharedList.objects.all()
    serializer_class = SharedListSerializer  # (Usado apenas para pegar o ID da lista)
    
        # 2. Esta é a lógica principal
    def retrieve(self, request, *args, **kwargs):
        try:
                # 3. Pega a 'SharedList' pelo ID (pk) da URL
            shared_list_instance = self.get_object()
                
                # 4. Encontra o usuário que é o "dono" dessa lista
            user_of_list = shared_list_instance.user
                
                # 5. Busca TODOS os 'FavoriteMovie' daquele usuário
            favorites = FavoriteMovie.objects.filter(user=user_of_list)
                
                # 6. Serializa (converte para JSON) a lista de filmes
            serializer = FavoriteMovieSerializer(favorites, many=True)
                
                # 7. Retorna a lista de filmes para o frontend
            return response.Response(serializer.data, status=status.HTTP_200_OK)
                
        except Exception:
            return response.Response(
                {"error": "Lista não encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )

class TMDbPopularAPIView(views.APIView):
    """
    Busca os filmes populares no TMDb.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=pt-BR&page=1"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class TMDbNowPlayingAPIView(views.APIView):
    """
    Busca os filmes "em cartaz agora" (Novos) no TMDb.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/now_playing?api_key={api_key}&language=pt-BR&page=1"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class TMDbGenreListView(views.APIView):
    """
    Busca a lista oficial de gêneros do TMDb.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}&language=pt-BR"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class TMDbDiscoverAPIView(views.APIView):
    """
    Busca filmes baseada em filtros (gênero, ano, nota, etc.)
    ou pesquisa por 'query' (nome).
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        
        # Pega todos os filtros da URL (ex: ?page=1&with_genres=28)
        query = request.query_params.get('query', None)
        page = request.query_params.get('page', '1')
        sort_by = request.query_params.get('sort_by', 'popularity.desc')
        with_genres = request.query_params.get('with_genres', None)
        primary_release_year = request.query_params.get('primary_release_year', None)
        vote_average_gte = request.query_params.get('vote_average.gte', None) # Maior ou igual

        try:
            if query:
                # Se o usuário digitou um nome, usamos a API de "search"
                endpoint = f"/search/movie?query={query}&page={page}"
            else:
                # Se o usuário está filtrando, usamos a API "discover"
                endpoint = f"/discover/movie?page={page}&sort_by={sort_by}"
                if with_genres:
                    endpoint += f"&with_genres={with_genres}"
                if primary_release_year:
                    endpoint += f"&primary_release_year={primary_release_year}"
                if vote_average_gte:
                    endpoint += f"&vote_average.gte={vote_average_gte}"

            url = f"{base_url}{endpoint}&api_key={api_key}&language=pt-BR"
            
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
            
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)