from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.users.models import PremiumSubscription, User, UserReview, VerificationRequest


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
