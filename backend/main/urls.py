from django.urls import path
from . import views
from .views import LoginView

urlpatterns = [
    # User Management
    path('signup/', views.signUp, name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', views.getProfile, name='get-profile'),

    # Course Management
    path('courses/', views.courses, name='courses'),

    # Assignment Management
    path('courses/<int:course_id>/assignments/', views.getAssignments, name='get-assignments'),
    path('assignments/submit/', views.submitAssignment, name='submit-assignment'),

    # Dashboard
    path('dashboard/stats/', views.getDashboardStats, name='get-dashboard-stats'),

    # AI Features
    path('ai/chat/', views.chatWithAI, name='chat-with-ai'),
    path('ai/generate-learning-path/', views.generateLearningPath, name='generate-learning-path'),
    path('ai/predict-grades/', views.predictGrades, name='predict-grades'),
    path('ai/analyze-well-being/', views.analyzeWellBeing, name='analyze-well-being'),
    path('ai/generate-exam-paper/<int:course_id>/', views.generateExamPaper, name='generate-exam-paper'),
]
