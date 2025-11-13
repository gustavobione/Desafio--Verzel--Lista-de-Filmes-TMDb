from rest_framework import serializers
from .models import User, UserMovieEntry, SharedList

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']

class UserMovieEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMovieEntry
        fields = '__all__'
        read_only_fields = ['user', 'id', 'added_at']

class SharedListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedList
        fields = '__all__'
        read_only_fields = ['user','id', 'created_at']