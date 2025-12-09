from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    UserProfile, Course, Assignment, Submission, AIInteraction,
    LearningPath, GradePrediction, WellBeing, ExamPaper
)
from .serializers import (
    UserSerializer, UserProfileSerializer, CourseSerializer, AssignmentSerializer,
    SubmissionSerializer, AIInteractionSerializer, LearningPathSerializer,
    GradePredictionSerializer, WellBeingSerializer, ExamPaperSerializer
)

# User Management
@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def signUp(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        UserProfile.objects.create(
            user=user, 
            role=request.data.get('role', 'student'),
            profile_pic=request.data.get('profile_pic')
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user_profile = UserProfile.objects.get(user=request.user)
    serializer = UserProfileSerializer(user_profile)
    return Response(serializer.data)

# Course Management
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def courses(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Assignment Management
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAssignments(request, course_id):
    assignments = Assignment.objects.filter(course_id=course_id)
    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def submitAssignment(request):
    serializer = SubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(student=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Dashboard
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDashboardStats(request):
    # Dummy data - replace with actual logic
    stats = {
        'courses_enrolled': request.user.enrolled_courses.count(),
        'assignments_due': Submission.objects.filter(student=request.user, grade__isnull=True).count(),
        'overall_grade': 'A', # Dummy
    }
    return Response(stats)

# AI Features
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatWithAI(request):
    # Dummy response - replace with actual AI logic
    prompt = request.data.get('prompt')
    response_text = f"This is a dummy response to your prompt: '{prompt}'"
    interaction = AIInteraction.objects.create(user=request.user, prompt=prompt, response=response_text)
    serializer = AIInteractionSerializer(interaction)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generateLearningPath(request):
    # Dummy response - replace with actual AI logic
    path_data = {'steps': ['Learn A', 'Practice B', 'Master C']}
    learning_path = LearningPath.objects.create(user=request.user, path_data=path_data)
    serializer = LearningPathSerializer(learning_path)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predictGrades(request):
    # Dummy response - replace with actual AI logic
    prediction_data = {'Math': 'A', 'Science': 'B+'}
    grade_prediction = GradePrediction.objects.create(user=request.user, prediction_data=prediction_data)
    serializer = GradePredictionSerializer(grade_prediction)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyzeWellBeing(request):
    # Dummy response - replace with actual AI logic
    analysis_data = {'status': 'positive', 'recommendations': ['Take a break', 'Connect with friends']}
    well_being = WellBeing.objects.create(user=request.user, analysis_data=analysis_data)
    serializer = WellBeingSerializer(well_being)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generateExamPaper(request, course_id):
    # Dummy response - replace with actual AI logic
    course = Course.objects.get(pk=course_id)
    paper_data = {'questions': ['Question 1', 'Question 2']}
    exam_paper = ExamPaper.objects.create(course=course, paper_data=paper_data)
    serializer = ExamPaperSerializer(exam_paper)
    return Response(serializer.data)