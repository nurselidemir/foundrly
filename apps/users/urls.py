from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import (
    AdminDashboardView,
    AdminUserDetailView,
    AdminUserListView,
    AdminUserModerationView,
    AdminUserRoleUpdateView,
    AdminVerificationRequestListView,
    CurrentUserView,
    HealthCheckView,
    PremiumSubscriptionView,
    PublicUserProfileView,
    RegisterView,
    UserListView,
    UserReviewListCreateView,
    VerificationRequestListCreateView,
    VerificationReviewView,
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/me/", CurrentUserView.as_view(), name="current-user"),
    path("users/<int:pk>/", PublicUserProfileView.as_view(), name="public-user-profile"),
    path("users/<int:pk>/reviews/", UserReviewListCreateView.as_view(), name="user-review-list-create"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/users/<int:pk>/role/", AdminUserRoleUpdateView.as_view(), name="admin-user-role-update"),
    path("admin/users/<int:pk>/moderation/", AdminUserModerationView.as_view(), name="admin-user-moderation"),
    path("admin/verification-requests/", AdminVerificationRequestListView.as_view(), name="admin-verification-request-list"),
    path("premium/subscription/", PremiumSubscriptionView.as_view(), name="premium-subscription"),
    path("verification-requests/", VerificationRequestListCreateView.as_view(), name="verification-request-list-create"),
    path("verification-requests/<int:pk>/review/", VerificationReviewView.as_view(), name="verification-request-review"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
