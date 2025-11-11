# Arquivo: Backend/favorites/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FavoriteMovieViewSet, 
    SharedListViewSet, 
    TMDbSearchAPIView, 
    PublicSharedListAPIView, 
    TMDbNowPlayingAPIView, 
    TMDbPopularAPIView,
    TMDbGenreListView,
    TMDbDiscoverAPIView,
    TMDbMovieDetailView,
    TMDbTopRatedAPIView,
    TMDbTrendingAPIView,
    TMDbUpcomingAPIView,
    TMDbMovieVideosView,
    )

# O Router cria as URLs de CRUD (GET, POST, PUT, DELETE) para nós
router = DefaultRouter()
router.register(r'favorites', FavoriteMovieViewSet, basename='favorite-movie')
router.register(r'shared-lists', SharedListViewSet, basename='shared-list')

urlpatterns = [
    # URLs do Router (ex: /api/favorites/ e /api/favorites/<id>/)
    path('', include(router.urls)),
    
    # URL da nossa view customizada de pesquisa
    path('search-tmdb/', TMDbSearchAPIView.as_view(), name='search-tmdb'),

    # URL para acessar listas compartilhadas publicamente
    path(
        'public-list/<uuid:pk>/', 
        PublicSharedListAPIView.as_view(), 
        name='public-shared-list'
    ),
    path('tmdb/popular/', TMDbPopularAPIView.as_view(), name='tmdb-popular'),
    path('tmdb/now-playing/', TMDbNowPlayingAPIView.as_view(), name='tmdb-now-playing'),
    path('tmdb/genres/', TMDbGenreListView.as_view(), name='tmdb-genres'),
    path('tmdb/discover/', TMDbDiscoverAPIView.as_view(), name='tmdb-discover'),
    path('tmdb/movie/<int:movie_id>/', TMDbMovieDetailView.as_view(), name='tmdb-movie-detail'),
    path('tmdb/top-rated/', TMDbTopRatedAPIView.as_view(), name='tmdb-top-rated'),
    path('tmdb/trending/<str:time_window>/', TMDbTrendingAPIView.as_view(), name='tmdb-trending'),
    path('tmdb/upcoming/', TMDbUpcomingAPIView.as_view(), name='tmdb-upcoming'),
    path('tmdb/movie/<int:movie_id>/videos/', TMDbMovieVideosView.as_view(), name='tmdb-movie-videos'),

]