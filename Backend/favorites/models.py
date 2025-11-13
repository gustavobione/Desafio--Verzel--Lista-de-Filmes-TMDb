# Arquivo: Backend/favorites/models.py

from django.db import models
import uuid

# Este modelo irá espelhar o usuário que vem do Firebase.
# Vamos usar o ID (UID) do Firebase como nossa chave primária.
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

# Este modelo armazena os filmes favoritos de um usuário.
class UserMovieEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_entries')
    tmdb_id = models.IntegerField()
    
    # --- A MUDANÇA (CAMPOS BOOLEANOS) ---
    # Agora um filme pode estar em múltiplas listas
    is_favorite = models.BooleanField(default=False)
    is_watch_later = models.BooleanField(default=False)
    is_watched = models.BooleanField(default=False)
    # --- FIM DA MUDANÇA ---

    # (Podemos manter os dados do filme aqui para facilitar as buscas)
    title = models.CharField(max_length=255)
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Esta regra agora é MAIS IMPORTANTE.
        # Garante que só existe UMA entrada por usuário/filme.
        unique_together = ('user', 'tmdb_id') 

    def __str__(self):
        return f"{self.title} (para {self.user.email})"

# Este modelo armazena os links compartilháveis
class SharedList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_lists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lista de {self.user.email} (ID: {self.id})"