from django.contrib import admin
from .models import User, FavoriteMovie, SharedList

admin.site.register(User)
admin.site.register(FavoriteMovie)
admin.site.register(SharedList)