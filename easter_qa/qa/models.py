from django.db import models

class Question(models.Model):
    name = models.CharField(max_length=100, blank=True, verbose_name="Name (optional)")
    question_text = models.TextField(verbose_name="Question")
    answer = models.TextField(blank=True, verbose_name="Answer")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.question_text[:50]}"