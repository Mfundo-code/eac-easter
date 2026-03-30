import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token

from .models import Question

# ----- Public endpoints -----
@csrf_exempt
@require_http_methods(["POST"])
def api_questions(request):
    """Public endpoint for submitting a new question."""
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        question_text = data.get('question_text', '').strip()
        if not question_text:
            return JsonResponse({'error': 'Question text is required'}, status=400)
        question = Question.objects.create(
            name=name,
            question_text=question_text
        )
        return JsonResponse({'id': question.id, 'success': True}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# ----- CSRF token endpoint -----
@ensure_csrf_cookie
@require_http_methods(["GET"])
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

# ----- Admin endpoints -----
@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_staff:
            login(request, user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid credentials or not admin'}, status=401)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["POST"])
def admin_logout(request):
    logout(request)
    return JsonResponse({'success': True})

@login_required
@require_http_methods(["GET"])
def admin_questions(request):
    if not request.user.is_staff:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    questions = Question.objects.all().order_by('-created_at')
    data = [{
        'id': q.id,
        'name': q.name,
        'question_text': q.question_text,
        'answer': q.answer,
        'created_at': q.created_at.isoformat(),
    } for q in questions]
    return JsonResponse(data, safe=False)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def admin_answer(request, question_id):
    if not request.user.is_staff:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    try:
        question = Question.objects.get(id=question_id)
        data = json.loads(request.body)
        answer = data.get('answer', '').strip()
        question.answer = answer
        question.save()
        return JsonResponse({'success': True})
    except Question.DoesNotExist:
        return JsonResponse({'error': 'Question not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)