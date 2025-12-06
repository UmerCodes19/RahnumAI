from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Course, Assignment, Submission, AIInteraction,
    LearningPath, GradePrediction, WellBeing, ExamPaper
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ('user', 'role', 'profile_pic')

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ('id', 'assignment', 'student', 'submitted_at', 'content', 'grade')

class AIInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteraction
        fields = '__all__'

class LearningPathSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningPath
        fields = '__all__'

class GradePredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradePrediction
        fields = '__all__'

class WellBeingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WellBeing
        fields = '__all__'

class ExamPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamPaper
        fields = '__all__'
