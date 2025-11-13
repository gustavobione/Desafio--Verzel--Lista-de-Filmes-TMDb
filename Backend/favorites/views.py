from rest_framework import generics, viewsets, views, response, status
from .models import User, UserMovieEntry, SharedList
from .serializers import UserSerializer, UserMovieEntrySerializer, SharedListSerializer
import requests
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .auth import FirebaseAuthentication
from django.db.models import Q


# --- API para o Requisito 1 (Listar Filmes Favoritos, Assistir Depois, Já Assistidos) ---
class UserMovieEntryListView(generics.ListAPIView):
    serializer_class = UserMovieEntrySerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return UserMovieEntry.objects.filter(
            Q(is_favorite=True) | Q(is_watch_later=True) | Q(is_watched=True),
            user=user
        )
        


# --- API para o Requisito 2 (Marcar/Desmarcar Filmes) ---
class SetMovieStatusView(views.APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        tmdb_id = request.data.get('tmdb_id')
        list_type = request.data.get('list_type') 
        new_value = request.data.get('status') 
        movie_data = request.data.get('movie_data', {})

        if not tmdb_id or not list_type:
            return response.Response(
                {"error": "tmdb_id e list_type são obrigatórios."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        entry, created = UserMovieEntry.objects.get_or_create(
            user=request.user,
            tmdb_id=tmdb_id,
            defaults={
                'title': movie_data.get('title', 'N/A'),
                'poster_path': movie_data.get('poster_path', ''),
                'rating': movie_data.get('rating', 0),
            }
        )
        if list_type == 'is_favorite':
            entry.is_favorite = new_value
            
        elif list_type == 'is_watch_later':
            entry.is_watch_later = new_value
            if new_value: 
                entry.is_watched = False

        elif list_type == 'is_watched':
            entry.is_watched = new_value
            if new_value: 
                entry.is_watch_later = False
        
        else:
            return response.Response(
                {"error": "list_type inválido."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if not entry.is_favorite and not entry.is_watch_later and not entry.is_watched:
            entry.delete()
            return response.Response(
                {"tmdb_id": tmdb_id, "status": "deleted"}, 
                status=status.HTTP_200_OK
            )
        else:
            entry.save()
            serializer = UserMovieEntrySerializer(entry)
            return response.Response(serializer.data, status=status.HTTP_200_OK)

# -- API para o Requisito 2 (Listas Compartilhadas) ---
class SharedListViewSet(viewsets.ModelViewSet):
    serializer_class = SharedListSerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SharedList.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# --- APIs para o Requisito 3 (Integração com a API do TMDb) ---
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
        api_key = settings.TMDB_API_KEY

        url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={query}&language=pt-BR"

        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status() 
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response(
                {"error": f"Falha ao contatar API do TMDb: {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        
# --- API para o Requisito 2 (Acessar Lista Compartilhada Publicamente) ---
class PublicSharedListAPIView(generics.RetrieveAPIView):
    authentication_classes = []
    permission_classes = []
        
    queryset = SharedList.objects.all()
    serializer_class = SharedListSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            shared_list_instance = self.get_object()

            user_of_list = shared_list_instance.user
                
            favorites = UserMovieEntry.objects.filter(user=user_of_list)
                
            serializer = UserMovieEntrySerializer(favorites, many=True)
                
            return response.Response(serializer.data, status=status.HTTP_200_OK)
                
        except Exception:
            return response.Response(
                {"error": "Lista não encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )

#-- API para obter filmes "Popular" ---
class TMDbPopularAPIView(views.APIView):

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

#-- API para obter filmes "Top Rated" ---
class TMDbNowPlayingAPIView(views.APIView):

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
        
#-- API para obter a lista de gêneros de filmes ---
class TMDbGenreListView(views.APIView):
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

#-- API para descobrir filmes com filtros ---
class TMDbDiscoverAPIView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        query_params = request.query_params.copy()
        query = query_params.pop('query', None)
        
        try:
            if query:
                endpoint = f"/search/movie?query={query[0]}"
            else:
                endpoint = f"/discover/movie?"
                endpoint += "&watch_region=BR&certification_country=BR"
            if query_params:
                endpoint += f"&{query_params.urlencode()}"

            url = f"{base_url}{endpoint}&api_key={api_key}&language=pt-BR"
            
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
            
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

#-- API para obter a lista de idiomas suportados pelo TMDb ---
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
        
#-- API para obter detalhes de um filme específico ---
class TMDbMovieDetailView(views.APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request, movie_id):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=pt-BR&append_to_response=credits,watch/providers,release_dates"

        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            return response.Response(data, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Filme não encontrado ou falha na API: {e}"}, status=status.HTTP_404_NOT_FOUND)
        
#-- API para obter filmes "Top Rated" ---
class TMDbTopRatedAPIView(views.APIView):
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

#-- API para obter filmes "Trending" ---
class TMDbTrendingAPIView(views.APIView):
    authentication_classes = []
    permission_classes = []

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
        
#-- API para obter filmes "Upcoming" ---
class TMDbUpcomingAPIView(views.APIView):
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

#-- API para obter vídeos (trailers) de um filme específico ---
class TMDbMovieVideosView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, movie_id):
        api_key = settings.TMDB_API_KEY
        url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={api_key}&language=pt-BR"
        
        try:
            tmdb_response = requests.get(url)
            tmdb_response.raise_for_status()
            data = tmdb_response.json()
            official_trailer = None
            for video in data.get('results', []):
                if video['type'] == 'Trailer' and video['official']:
                    official_trailer = video
                    break
            if not official_trailer:
                for video in data.get('results', []):
                    if video['type'] == 'Trailer':
                        official_trailer = video
                        break

            return response.Response(official_trailer, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return response.Response({"error": f"Falha na API do TMDb: {e}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)