from django.db import models
import uuid

# Este modelo representa um usuário do sistema.
class User(models.Model):
    id = models.CharField(primary_key=True, max_length=128, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_authenticated(self):
        return True
    
    def __str__(self):
        return self.email

# Este modelo representa uma entrada de filme associada a um usuário.
class UserMovieEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_entries')
    tmdb_id = models.IntegerField()
    is_favorite = models.BooleanField(default=False)
    is_watch_later = models.BooleanField(default=False)
    is_watched = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'tmdb_id') 

    def __str__(self):
        return f"{self.title} (para {self.user.email})"

# Este modelo representa uma lista compartilhada de filmes criada por um usuário.
class SharedList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_lists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lista de {self.user.email} (ID: {self.id})"