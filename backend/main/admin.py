from django.contrib import admin
from .models import (
    UserProfile,
    Course,
    Enrollment,
    Assignment,
    Submission,
    AIInteraction,
    LearningPath,
    GradePrediction,
    WellBeing,
    ExamPaper
    , CourseMaterial, AttendanceSession, AttendanceRecord
)

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(AIInteraction)
admin.site.register(LearningPath)
admin.site.register(GradePrediction)
admin.site.register(WellBeing)
admin.site.register(ExamPaper)
admin.site.register(CourseMaterial)
admin.site.register(AttendanceSession)
admin.site.register(AttendanceRecord)
from .models import StudentPerformance
admin.site.register(StudentPerformance)