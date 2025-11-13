# Arquivo: Backend/favorites/views.py

from rest_framework import generics, viewsets, views, response, status
from .models import User, UserMovieEntry, SharedList
from .serializers import UserSerializer, UserMovieEntrySerializer, SharedListSerializer
import requests
from django.conf import settings  # Para pegar a chave da API
from rest_framework.permissions import IsAuthenticated
from .auth import FirebaseAuthentication
from django.db.models import Q


# --- API de CRUD para Filmes Favoritos ---
# ModelViewSet já nos dá GET, POST, PUT, DELETE de graça
class UserMovieEntryListView(generics.ListAPIView):
    """
    Retorna TODAS as entradas de filme (favoritos, vistos, etc.)
    para o usuário logado.
    """
    serializer_class = UserMovieEntrySerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        # Retorna todas as entradas que tenham PELO MENOS UMA marcação
        return UserMovieEntry.objects.filter(
            Q(is_favorite=True) | Q(is_watch_later=True) | Q(is_watched=True),
            user=user
        )
        


# --- 3. ADICIONE ESTA VIEW (PARA ATUALIZAR UM FILME) ---
# (POST /api/movie-status/)
class SetMovieStatusView(views.APIView):
    """
    Adiciona, atualiza ou remove um filme de uma lista.
    Cria a entrada do filme ('UserMovieEntry') se ela não existir.
    """
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        tmdb_id = request.data.get('tmdb_id')
        list_type = request.data.get('list_type') # ex: 'is_favorite'
        new_value = request.data.get('status') # true ou false
        
        # (Dados do filme, para criar se for a primeira vez)
        movie_data = request.data.get('movie_data', {})

        if not tmdb_id or not list_type:
            return response.Response(
                {"error": "tmdb_id e list_type são obrigatórios."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. A LÓGICA 'get_or_create'
        # Encontra a entrada (se existir) ou cria uma nova
        entry, created = UserMovieEntry.objects.get_or_create(
            user=request.user,
            tmdb_id=tmdb_id,
            # Se for 'created', preenche os dados do filme
            defaults={
                'title': movie_data.get('title', 'N/A'),
                'poster_path': movie_data.get('poster_path', ''),
                'rating': movie_data.get('rating', 0),
            }
        )

        # 5. A LÓGICA DE ATUALIZAÇÃO (O que você pediu)
        if list_type == 'is_favorite':
            entry.is_favorite = new_value
            
        elif list_type == 'is_watch_later':
            entry.is_watch_later = new_value
            if new_value: # Se está adicionando a "Assistir Depois"
                entry.is_watched = False # Remove de "Já Assistido"

        elif list_type == 'is_watched':
            entry.is_watched = new_value
            if new_value: # Se está adicionando a "Já Assistido"
                entry.is_watch_later = False # Remove de "Assistir Depois"
        
        else:
            return response.Response(
                {"error": "list_type inválido."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 6. Limpeza: Se todas as flags forem 'False', apaga a entrada
        if not entry.is_favorite and not entry.is_watch_later and not entry.is_watched:
            entry.delete()
            # Retorna um status '204 No Content' (mas com o ID, para o frontend)
            return response.Response(
                {"tmdb_id": tmdb_id, "status": "deleted"}, 
                status=status.HTTP_200_OK
            )
        else:
            entry.save()
            serializer = UserMovieEntrySerializer(entry)
            return response.Response(serializer.data, status=status.HTTP_200_OK)

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
                
                # 5. Busca TODOS os 'UserMovieEntry' daquele usuário
            favorites = UserMovieEntry.objects.filter(user=user_of_list)
                
                # 6. Serializa (converte para JSON) a lista de filmes
            serializer = UserMovieEntrySerializer(favorites, many=True)
                
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
    ESTA É A VERSÃO V2 (ATUALIZADA)
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        
        # Pega todos os filtros da URL (ex: ?page=1&with_genres=28)
        # Usamos .copy() para poder modificar (com .pop())
        query_params = request.query_params.copy()
        
        # 1. Pega o 'query' (texto de busca) se existir
        # Usamos .pop() para removê-lo da lista de filtros
        query = query_params.pop('query', None)
        
        try:
            if query:
                # Se o usuário digitou um nome, usamos a API de "search"
                endpoint = f"/search/movie?query={query[0]}"
            else:
                # Se o usuário está filtrando, usamos a API "discover"
                endpoint = f"/discover/movie?"
                
                # Adiciona o país (BR) para filtros de classificação e streaming
                endpoint += "&watch_region=BR&certification_country=BR"

            # 2. Adiciona TODOS os outros parâmetros (filtros) que sobraram
            # O frontend vai enviar os nomes exatos que o TMDb espera
            # ex: page=1, sort_by=... with_genres=28, release_date.gte=... etc.
            if query_params:
                endpoint += f"&{query_params.urlencode()}"

            url = f"{base_url}{endpoint}&api_key={api_key}&language=pt-BR"
            
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
            
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

# --- ADICIONE ESTAS DUAS NOVAS VIEWS NO FINAL (se já não o fez) ---

class TMDbLanguagesView(views.APIView):
    authentication_classes = []
    permission_classes = []
    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/configuration/languages?api_key={api_key}"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class TMDbWatchProvidersView(views.APIView):
    authentication_classes = []
    permission_classes = []
    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/watch/providers/movie?api_key={api_key}&language=pt-BR&watch_region=BR"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class TMDbMovieDetailView(views.APIView):
    """
    Busca os detalhes completos de UM filme, incluindo elenco e "onde assistir".
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, movie_id): # <-- Recebe o 'movie_id' da URL
        api_key = settings.TMDB_API_KEY
        
        # Usamos 'append_to_response' para pegar tudo de uma vez
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=pt-BR&append_to_response=credits,watch/providers,release_dates"

        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Filme não encontrado ou falha na API: {e}"}, status=status.HTTP_404_NOT_FOUND)
        
class TMDbTopRatedAPIView(views.APIView):
    """
    Busca os filmes com melhor nota (Top Rated) no TMDb.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={api_key}&language=pt-BR&page=1"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class TMDbTrendingAPIView(views.APIView):
    """
    Busca os filmes em tendência (Trending) do 'dia' ou 'semana'.
    """
    authentication_classes = []
    permission_classes = []

    # 'time_window' será 'day' (dia) ou 'week' (semana)
    def get(self, request, time_window): 
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/trending/movie/{time_window}?api_key={api_key}&language=pt-BR"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class TMDbUpcomingAPIView(views.APIView):
    """
    Busca os filmes que serão lançados em breve (Upcoming) no TMDb.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/upcoming?api_key={api_key}&language=pt-BR&page=1"
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class TMDbMovieVideosView(views.APIView):
    """
    Busca os vídeos (trailers) de um filme específico.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, movie_id):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}&language=pt-BR"
        
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            
            # Tenta encontrar o "Trailer Oficial"
            official_trailer = None
            for video in data.get('results', []):
                if video['type'] == 'Trailer' and video['official']:
                    official_trailer = video
                    break
            
            # Se não achar, pega o primeiro trailer qualquer
            if not official_trailer:
                for video in data.get('results', []):
                    if video['type'] == 'Trailer':
                        official_trailer = video
                        break

            return response.Response(official_trailer, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)