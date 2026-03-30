from django.urls import path
from . import views

urlpatterns = [
    # Public endpoint for submitting questions
    path('questions/', views.api_questions, name='api_questions'),

    # Admin endpoints
    path('admin/csrf/', views.get_csrf_token, name='csrf_token'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/logout/', views.admin_logout, name='admin_logout'),
    path('admin/questions/', views.admin_questions, name='admin_questions'),
    path('admin/questions/<int:question_id>/answer/', views.admin_answer, name='admin_answer'),
]