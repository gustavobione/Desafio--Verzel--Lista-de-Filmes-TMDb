# Arquivo: Backend/favorites/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FavoriteMovieViewSet, SharedListViewSet, TMDbSearchAPIView, PublicSharedListAPIView

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
]