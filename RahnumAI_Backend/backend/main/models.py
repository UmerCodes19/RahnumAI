from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    USER_ROLES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=USER_ROLES)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.user.username

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_courses')
    students = models.ManyToManyField(User, through='Enrollment', related_name='enrolled_courses')

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_enrolled = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f'{self.user.username} enrolled in {self.course.title}'

class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)
    content = models.FileField(upload_to='submissions/')
    grade = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f'Submission by {self.student.username} for {self.assignment.title}'

class AIInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'AI Interaction with {self.user.username} at {self.timestamp}'

class LearningPath(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    path_data = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Learning Path for {self.user.username}'

class GradePrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prediction_data = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Grade Prediction for {self.user.username}'

class WellBeing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis_data = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Well Being Analysis for {self.user.username}'

class ExamPaper(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    paper_data = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Exam Paper for {self.course.title}'