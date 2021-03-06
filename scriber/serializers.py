from rest_framework import serializers
from django.contrib.auth.models import User
from scriber.models import Transcription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','email','pk','transcription_set')

class TranscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcription
        fields = ('audio_url', 'transcription', 'title', 'created_date','created_time', 'pk','description','usernames')

class TranscriptionIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcription
        fields = ('audio_url','title','created_time','created_date','description','usernames','pk')
