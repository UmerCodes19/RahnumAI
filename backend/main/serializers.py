from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Course, Assignment, Submission, AIInteraction,
    LearningPath, GradePrediction, WellBeing, ExamPaper
)
from .models import CourseMaterial, AttendanceSession, AttendanceRecord

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
    enrolled = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    materials_count = serializers.SerializerMethodField()

    teacher = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def get_enrolled(self, obj):
        return obj.students.count()

    def get_is_enrolled(self, obj):
        request = self.context.get('request', None)
        if request and request.user and request.user.is_authenticated:
            return obj.students.filter(pk=request.user.pk).exists()
        return False

    def get_name(self, obj):
        # alias 'name' to 'title' for frontend compatibility
        return obj.title

    def get_materials_count(self, obj):
        try:
            return obj.materials.count()
        except Exception:
            return 0

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


class CourseMaterialSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = CourseMaterial
        fields = '__all__'


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ('id', 'session', 'student', 'status', 'remark', 'recorded_at')


class AttendanceSessionSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(read_only=True)
    created_by = UserSerializer(read_only=True)
    records = AttendanceRecordSerializer(many=True, read_only=True)

    class Meta:
        model = AttendanceSession
        fields = ('id', 'course', 'session_date', 'created_by', 'created_at', 'records')
