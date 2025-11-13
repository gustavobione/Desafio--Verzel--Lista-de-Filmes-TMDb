from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserMovieEntryListView,
    SetMovieStatusView,
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
    TMDbLanguagesView,
    TMDbWatchProvidersView, 
    )

router = DefaultRouter()
router.register(r'shared-lists', SharedListViewSet, basename='shared-list')

urlpatterns = [
    path('', include(router.urls)),
    path('search-tmdb/', TMDbSearchAPIView.as_view(), name='search-tmdb'),
    path('public-list/<uuid:pk>/', PublicSharedListAPIView.as_view(), name='public-shared-list'),
    path('tmdb/popular/', TMDbPopularAPIView.as_view(), name='tmdb-popular'),
    path('tmdb/now-playing/', TMDbNowPlayingAPIView.as_view(), name='tmdb-now-playing'),
    path('tmdb/genres/', TMDbGenreListView.as_view(), name='tmdb-genres'),
    path('tmdb/discover/', TMDbDiscoverAPIView.as_view(), name='tmdb-discover'),
    path('tmdb/movie/<int:movie_id>/', TMDbMovieDetailView.as_view(), name='tmdb-movie-detail'),
    path('tmdb/top-rated/', TMDbTopRatedAPIView.as_view(), name='tmdb-top-rated'),
    path('tmdb/trending/<str:time_window>/', TMDbTrendingAPIView.as_view(), name='tmdb-trending'),
    path('tmdb/upcoming/', TMDbUpcomingAPIView.as_view(), name='tmdb-upcoming'),
    path('tmdb/movie/<int:movie_id>/videos/', TMDbMovieVideosView.as_view(), name='tmdb-movie-videos'),
    path('movies/', UserMovieEntryListView.as_view(), name='user-movie-list'),
    path('movie-status/', SetMovieStatusView.as_view(), name='movie-status-set'),
    path('tmdb/languages/', TMDbLanguagesView.as_view(), name='tmdb-languages'),
    path('tmdb/watch-providers/', TMDbWatchProvidersView.as_view(), name='tmdb-watch-providers'),

]