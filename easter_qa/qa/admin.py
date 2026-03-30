from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'question_text', 'answer_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('question_text', 'answer', 'name')
    ordering = ('-created_at',)

    def answer_preview(self, obj):
        return obj.answer[:50] + "…" if obj.answer else "—"
    answer_preview.short_description = "Answer preview"