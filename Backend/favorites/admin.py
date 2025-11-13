from django.contrib import admin
from .models import User, UserMovieEntry, SharedList

admin.site.register(User)
admin.site.register(UserMovieEntry)
admin.site.register(SharedList)