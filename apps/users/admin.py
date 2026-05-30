from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.users.models import (
    CommunityEvent,
    CommunityThread,
    MentorRequestMessage,
    PremiumSubscription,
    User,
    UserReview,
    VerificationRequest,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("-date_joined",)
    list_display = ("email", "full_name", "title", "is_premium", "is_verified_talent", "is_staff")
    search_fields = ("email", "full_name", "title")
    readonly_fields = ("date_joined", "last_login")

    fieldsets = (
        ("Kimlik", {"fields": ("email", "password")}),
        ("Profil", {"fields": ("full_name", "title", "bio", "skills", "interests")}),
        ("Uyelik", {"fields": ("is_premium", "is_verified_talent")}),
        ("Yetkiler", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Tarihce", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "title", "password1", "password2", "is_staff", "is_superuser"),
            },
        ),
    )


@admin.register(PremiumSubscription)
class PremiumSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "price_label", "status", "started_at")
    search_fields = ("user__email",)


@admin.register(VerificationRequest)
class VerificationRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "requested_title", "status", "created_at", "reviewed_at")
    list_filter = ("status",)
    search_fields = ("user__email", "requested_title")


@admin.register(UserReview)
class UserReviewAdmin(admin.ModelAdmin):
    list_display = ("reviewer", "reviewee", "application", "rating", "created_at")
    search_fields = ("reviewer__email", "reviewee__email", "application__project__title")


@admin.register(CommunityThread)
class CommunityThreadAdmin(admin.ModelAdmin):
    list_display = ("topic", "author", "signal_label", "is_featured", "created_at")
    list_filter = ("is_featured",)
    search_fields = ("topic", "author__full_name", "author__email")


@admin.register(CommunityEvent)
class CommunityEventAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "location", "event_date", "is_online", "is_featured")
    list_filter = ("is_online", "is_featured", "tag")
    search_fields = ("title", "location", "tag")


@admin.register(MentorRequestMessage)
class MentorRequestMessageAdmin(admin.ModelAdmin):
    list_display = ("mentor_request", "sender", "created_at")
    search_fields = ("mentor_request__user__email", "mentor_request__mentor__email", "sender__email", "content")
