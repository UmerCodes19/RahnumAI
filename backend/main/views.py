from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.db.models import Q

from .models import (
    UserProfile, Course, Enrollment, Assignment, Submission, AIInteraction,
    LearningPath, GradePrediction, WellBeing, ExamPaper
)
from .models import CourseMaterial, AttendanceSession, AttendanceRecord
from .serializers import (
    UserSerializer, UserProfileSerializer, CourseSerializer, AssignmentSerializer,
    SubmissionSerializer, AIInteractionSerializer, LearningPathSerializer,
    GradePredictionSerializer, WellBeingSerializer, ExamPaperSerializer
)
from .serializers import CourseMaterialSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer

import joblib
import json
import numpy as np
from pathlib import Path
try:
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    HAS_TRANSFORMERS = True
except Exception:
    HAS_TRANSFORMERS = False

# Load ML models if available
MODELS_DIR = Path(__file__).resolve().parents[2] / 'train_ML_Model' / 'models'
KNN_MODEL = None
LEARNING_PATHS = {}
RF_MODEL = None
NB_VECT = None
NB_MODEL = None
T5_TOKENIZER = None
T5_MODEL = None

def _load_models():
    global KNN_MODEL, LEARNING_PATHS, RF_MODEL, NB_VECT, NB_MODEL, T5_TOKENIZER, T5_MODEL
    try:
        knn_path = MODELS_DIR / 'knn_recommender.pkl'
        if knn_path.exists():
            KNN_MODEL = joblib.load(knn_path)
        lp_path = MODELS_DIR / 'learning_paths.json'
        if lp_path.exists():
            with open(lp_path, 'r') as f:
                LEARNING_PATHS = json.load(f)
            # Convert string keys to ints if necessary
            if isinstance(LEARNING_PATHS, dict):
                try:
                    LEARNING_PATHS = {int(k): v for k, v in LEARNING_PATHS.items()}
                except Exception:
                    pass
        rf_path = MODELS_DIR / 'rf_grade_predictor.pkl'
        if rf_path.exists():
            RF_MODEL = joblib.load(rf_path)
        nb_vec_path = MODELS_DIR / 'nb_tfidf_vectorizer.pkl'
        nb_model_path = MODELS_DIR / 'nb_wellbeing_classifier.pkl'
        if nb_vec_path.exists():
            NB_VECT = joblib.load(nb_vec_path)
        if nb_model_path.exists():
            NB_MODEL = joblib.load(nb_model_path)
        if HAS_TRANSFORMERS:
            bert_dir = MODELS_DIR / 'bert_model'
            if bert_dir.exists():
                T5_TOKENIZER = AutoTokenizer.from_pretrained(str(bert_dir))
                T5_MODEL = AutoModelForSeq2SeqLM.from_pretrained(str(bert_dir))
    except Exception as e:
        # Log error loading models but do not crash the server
        print('Error loading ML models:', e)

_load_models()

# User Management
@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def signUp(request):
    # Extract and validate required fields
    username = request.data.get('username') or (request.data.get('email') and request.data.get('email').split('@')[0])
    email = request.data.get('email')
    password = request.data.get('password') or request.data.get('pass')
    first_name = request.data.get('first_name') or request.data.get('name')
    last_name = request.data.get('last_name', '')

    if not username or not email or not password:
        return Response({'detail': 'username, email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'username': ['A user with that username already exists.']}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize role values coming from frontend to match UserProfile choices
    role = request.data.get('role', 'student')
    if role == 'faculty' or role == 'admin':
        role_db = 'teacher'
    else:
        role_db = role

    profile_pic = None
    # File uploads come in request.FILES when multipart/form-data
    if request.FILES and 'profile_pic' in request.FILES:
        profile_pic = request.FILES.get('profile_pic')

    try:
        with transaction.atomic():
            user = User(username=username, email=email, first_name=first_name or '', last_name=last_name or '')
            user.set_password(password)
            user.save()

            UserProfile.objects.create(
                user=user,
                role=role_db,
                profile_pic=profile_pic
            )

            # Issue JWT tokens so frontend can authenticate immediately
            refresh = RefreshToken.for_user(user)
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            return Response({
                'user': user_data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserProfileSerializer(user_profile)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def aiModelsStatus(request):
    """Return a simple status of which ML models are loaded on the backend."""
    status_info = {
        'knn': bool(KNN_MODEL),
        'learning_paths': bool(LEARNING_PATHS),
        'random_forest': bool(RF_MODEL),
        'nb_vectorizer': bool(NB_VECT),
        'nb_model': bool(NB_MODEL),
        'transformers': bool(T5_MODEL and T5_TOKENIZER),
    }
    return Response(status_info)


# Helper check - whether the current user is the teacher of the course
def _is_course_teacher(user, course):
    try:
        profile = user.userprofile
    except Exception:
        profile = None
    # Admin and staff privileges bypass
    if user.is_superuser or user.is_staff:
        return True
    # If the course has a teacher assigned to this user, allow
    if course.teacher == user:
        return True
    # If the user has a teacher profile and they created the course, allow
    if profile and profile.role == 'teacher' and course.created_by == user:
        return True
    return False


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def courseMaterials(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Only allow students enrolled in the course or teachers to view materials
        if not (course.students.filter(pk=request.user.pk).exists() or _is_course_teacher(request.user, course)):
            return Response({'detail': 'Not allowed to view materials for this course.'}, status=status.HTTP_403_FORBIDDEN)
        materials = course.materials.all()
        serializer = CourseMaterialSerializer(materials, many=True)
        return Response(serializer.data)

    # POST: only course teacher or creator can upload
    if not _is_course_teacher(request.user, course):
        return Response({'detail': 'Not allowed to upload materials for this course.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = CourseMaterialSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(course=course, uploaded_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def courseStudents(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
    students = course.students.all()
    serializer = UserSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def courseAttendance(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Optionally support ?session_id=<id> to return records for a session
        session_id = request.query_params.get('session_id')
        if session_id:
            try:
                session = AttendanceSession.objects.get(pk=int(session_id), course=course)
            except AttendanceSession.DoesNotExist:
                return Response({'detail': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = AttendanceSessionSerializer(session)
            # compute simple attendance summary
            records = session.records.all()
            present = records.filter(status='present').count()
            absent = records.filter(status='absent').count()
            total = records.count()
            summary = {'session': serializer.data, 'present': present, 'absent': absent, 'total': total}
            return Response(summary)

        # Otherwise, return sessions list with aggregated stats and overall summary
        sessions = AttendanceSession.objects.filter(course=course).order_by('-session_date')
        serializer = AttendanceSessionSerializer(sessions, many=True)
        # compute attendance summary across all sessions
        records = AttendanceRecord.objects.filter(session__course=course)
        total_sessions = sessions.count()
        total_records = records.count()
        total_present = records.filter(status='present').count()
        overall_percent = (total_present / total_records * 100) if total_records > 0 else 0
        return Response({'sessions': serializer.data, 'overall': {'present': total_present, 'records': total_records, 'percent': overall_percent}, 'session_count': total_sessions})

    # POST: create a session + records. only teacher allowed
    if not _is_course_teacher(request.user, course):
        return Response({'detail': 'Not allowed to record attendance for this course.'}, status=status.HTTP_403_FORBIDDEN)

    session_date = request.data.get('session_date')
    records = request.data.get('records', [])
    if not session_date or not isinstance(records, list):
        return Response({'detail': 'session_date and records are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create session and records in transaction
        with transaction.atomic():
            s = AttendanceSession.objects.create(course=course, session_date=session_date, created_by=request.user)
            created_records = []
            for r in records:
                sid = r.get('student_id')
                status_val = r.get('status') or 'absent'
                remark = r.get('remark')
                try:
                    user = User.objects.get(pk=int(sid))
                except Exception:
                    continue
                # only allow if user is enrolled in course
                if not course.students.filter(pk=user.pk).exists():
                    continue
                ar = AttendanceRecord.objects.create(session=s, student=user, status=status_val, remark=remark)
                created_records.append(ar)
        serializer = AttendanceSessionSerializer(s)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Course Management
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def courses(request):
    if request.method == 'GET':
        # Support filtering by ?enrolled=true|false to show only enrolled or non-enrolled courses
        enrolled_param = request.query_params.get('enrolled')
        taught_param = request.query_params.get('taught')
        if taught_param is not None:
            val = taught_param.lower()
            if val in ('true', '1', 'yes'):
                # Return courses where the current user is the assigned teacher
                # Also include courses created by them (useful if admin created course without teacher attribution)
                try:
                    profile = request.user.userprofile
                except Exception:
                    profile = None
                if request.user.is_staff or profile and profile.role == 'teacher':
                    # Include both teacher-assigned and creator-owned courses for better UX
                    courses = Course.objects.filter(Q(teacher=request.user) | Q(created_by=request.user)).distinct()
                else:
                    courses = Course.objects.filter(teacher=request.user)
            elif val in ('false', '0', 'no'):
                courses = Course.objects.exclude(teacher=request.user)
            else:
                courses = Course.objects.all()
        elif enrolled_param is not None:
            val = enrolled_param.lower()
            if val in ('true', '1', 'yes'):
                courses = Course.objects.filter(students=request.user)
            elif val in ('false', '0', 'no'):
                courses = Course.objects.exclude(students=request.user)
            else:
                courses = Course.objects.all()
        else:
            courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            # automatically set teacher if the creator is a teacher role
            profile = getattr(request.user, 'userprofile', None)
            teacher_user = None
            if profile and profile.role == 'teacher':
                teacher_user = request.user
            serializer.save(created_by=request.user, teacher=teacher_user)
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enrollCourses(request):
    """Enroll current user in a list of course IDs provided in 'course_ids'"""
    course_ids = request.data.get('course_ids', [])
    if not isinstance(course_ids, list):
        return Response({'detail': 'course_ids must be a list of course IDs.'}, status=status.HTTP_400_BAD_REQUEST)
    enrolled_courses = []
    for cid in course_ids:
        try:
            course = Course.objects.get(pk=cid)
        except Course.DoesNotExist:
            continue
        # Create enrollment if not already enrolled
        Enrollment.objects.get_or_create(user=request.user, course=course)
        enrolled_courses.append(course)

    serializer = CourseSerializer(enrolled_courses, many=True, context={'request': request})
    return Response({'enrolled': serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enrollCourse(request, course_id):
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
    Enrollment.objects.get_or_create(user=request.user, course=course)
    serializer = CourseSerializer(course, context={'request': request})
    return Response(serializer.data)

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

import os
import google.generativeai as genai
from django.conf import settings

# Configure the Gemini API key
# Make sure to set the GOOGLE_API_KEY environment variable in your deployment
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# AI Features
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatWithAI(request):
    prompt = request.data.get('prompt')
    if not prompt:
        return Response({"error": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # For simplicity, using the 'gemini-pro' model.
        # You can explore other models and generation configs.
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # Sanitize response if necessary, here we just use the text part
        response_text = response.text

        # Save the interaction
        interaction = AIInteraction.objects.create(user=request.user, prompt=prompt, response=response_text)
        serializer = AIInteractionSerializer(interaction)
        
        return Response(serializer.data)

    except Exception as e:
        # Log the exception e
        return Response({"error": "Failed to get response from AI model."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generateLearningPath(request):
    # Preferred payload: { topic: str, level: 'beginner'|'intermediate'|'advanced' }
    topic = request.data.get('topic', '').strip()
    level = request.data.get('level', 'beginner')

    # Default/fallback path
    path_data = {'steps': ['Learn A', 'Practice B', 'Master C']}

    try:
        if KNN_MODEL is not None and LEARNING_PATHS:
            # Build a lightweight numeric feature for the knn model inference
            # NOTE: We use a simple hashing function for text -> numeric feature to match a typical training flow.
            topic_hash = sum(ord(c) for c in topic) % 100 if topic else 0
            level_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
            level_val = level_map.get(level, 0)
            feat = np.array([[topic_hash, level_val]])
            # KNN returns neighbor indices; we map index to learning path if available
            try:
                neighbors = KNN_MODEL.kneighbors(feat, n_neighbors=1, return_distance=False)
                idx = int(neighbors[0][0])
                # Map using learning paths list/dict keyed by ints
                if isinstance(LEARNING_PATHS, dict):
                    path_data = LEARNING_PATHS.get(idx, None)
                elif isinstance(LEARNING_PATHS, list):
                    path_data = LEARNING_PATHS[idx % len(LEARNING_PATHS)]
            except Exception:
                # fallback to a default
                path_data = {'steps': ['Learn basics', 'Do practice', 'Do project']}

        learning_path = LearningPath.objects.create(user=request.user, path_data=path_data)
        serializer = LearningPathSerializer(learning_path)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'Failed to generate learning path', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predictGrades(request):
    # Expected query/body payload: { features: { 'attendance': float, 'avg_score': float, ... } }
    input_features = request.query_params.dict() if request.method == 'GET' else request.data.get('features', {})
    # If data was sent in request.data as dict
    if isinstance(input_features, str):
        try:
            input_features = json.loads(input_features)
        except Exception:
            input_features = {}

    # Default features order that the RF model expects (if trained accordingly)
    feature_order = ['attendance', 'avg_score', 'assignments_completed', 'participation', 'homework_completion']
    feature_vec = []
    for f in feature_order:
        v = input_features.get(f)
        if v is None:
            # set defaults
            v = 0.0
        try:
            feature_vec.append(float(v))
        except Exception:
            feature_vec.append(0.0)

    prediction_data = {'predictions': {}}
    try:
        if RF_MODEL is not None:
            pred = RF_MODEL.predict([feature_vec])[0]
            # If model returns a single numeric score, map to letter grade
            def score_to_letter(score):
                try:
                    s = float(score)
                except Exception:
                    s = 0.0
                if s >= 90:
                    return 'A+'
                if s >= 80:
                    return 'A'
                if s >= 70:
                    return 'B'
                if s >= 60:
                    return 'C'
                return 'D'

            # Single prediction mapped to a sample subject
            prediction_data['predictions'] = {'PredictedScore': pred, 'letter': score_to_letter(pred)}
        else:
            # Fallback
            prediction_data['predictions'] = {'Math': 'A', 'Science': 'B+'}

        grade_prediction = GradePrediction.objects.create(user=request.user, prediction_data=prediction_data)
        serializer = GradePredictionSerializer(grade_prediction)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'Failed to predict grades', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyzeWellBeing(request):
    # Accept text input in body or query
    text = request.data.get('text') or request.query_params.get('text')
    # If no text provided, return a default analysis (backwards compatibility)
    if not text:
        analysis_data = {
            'status': 'neutral',
            'score': 6.5,
            'factors': ['Sleep patterns', 'Study workload', 'Social interaction'],
            'recommendations': ['Keep track of sleep, exercise and study breaks']
        }
        well_being = WellBeing.objects.create(user=request.user, analysis_data=analysis_data)
        serializer = WellBeingSerializer(well_being)
        return Response(serializer.data)

    try:
        if NB_VECT is not None and NB_MODEL is not None:
            X = NB_VECT.transform([text])
            pred = NB_MODEL.predict(X)[0]
            proba = None
            try:
                proba = NB_MODEL.predict_proba(X).tolist()[0]
            except Exception:
                proba = None

            # Map labels to more human-friendly recommendations
            recs_map = {
                'positive': ['Keep up the good work', 'Maintain routines'],
                'neutral': ['Monitor mood', 'Stay engaged with peers'],
                'negative': ['Consider counseling', 'Check-in with mentor']
            }
            recs = recs_map.get(pred, ['If you feel overwhelmed, seek support'])
            # Provide a simple score mapping and example factors to match UI expectations
            score_map = {'positive': 8.5, 'neutral': 6.0, 'negative': 3.5}
            factors_map = {
                'positive': ['Good sleep', 'Active engagement', 'Balanced schedule'],
                'neutral': ['Sporadic breaks', 'Mild stress', 'Average engagement'],
                'negative': ['Overwhelmed', 'Poor sleep', 'High stress']
            }
            analysis_data = {
                'status': pred,
                'score': score_map.get(pred, 6.0),
                'factors': factors_map.get(pred, []),
                'recommendations': recs,
                'probabilities': proba
            }
        else:
            analysis_data = {'status': 'unknown', 'score': 5.0, 'factors': [], 'recommendations': ['If you feel overwhelmed, seek support']}

        well_being = WellBeing.objects.create(user=request.user, analysis_data=analysis_data)
        serializer = WellBeingSerializer(well_being)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'Failed to analyze wellbeing', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generateExamPaper(request, course_id):
    # Dummy response - replace with actual AI logic
    try:
        course = Course.objects.get(pk=course_id)
    except Course.DoesNotExist:
        return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Accept prompt customization
    topic = request.data.get('topic') or request.query_params.get('topic') or course.name
    num_questions = int(request.data.get('num_questions', request.query_params.get('num_questions') or 5))
    difficulty = request.data.get('difficulty') or request.query_params.get('difficulty') or 'medium'

    try:
        questions = []
        if T5_MODEL is not None and T5_TOKENIZER is not None:
            prompt = f"Generate {num_questions} exam questions about {topic} at {difficulty} difficulty. Format each question on a new line."
            input_ids = T5_TOKENIZER(prompt, return_tensors='pt').input_ids
            generated = T5_MODEL.generate(input_ids, max_length=512, num_beams=5, early_stopping=True)
            out = T5_TOKENIZER.decode(generated[0], skip_special_tokens=True)
            # split by lines/numbered bullets
            lines = [l.strip() for l in out.split('\n') if l.strip()]
            # Limit to num_questions
            questions = lines[:num_questions] if lines else [f'Q{i+1}: Explain {topic}']
        else:
            # Fallback: use a simple templating method to create questions
            for i in range(num_questions):
                questions.append(f"Question {i+1}: Describe an important concept about {topic} and provide an example.")

        paper_data = {'questions': questions, 'topic': topic, 'num_questions': num_questions}
        exam_paper = ExamPaper.objects.create(course=course, paper_data=paper_data)
        serializer = ExamPaperSerializer(exam_paper)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'Failed to generate exam paper', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)