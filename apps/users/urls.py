from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import (
    CurrentUserView,
    HealthCheckView,
    PremiumSubscriptionView,
    RegisterView,
    UserListView,
    VerificationRequestListCreateView,
    VerificationReviewView,
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/me/", CurrentUserView.as_view(), name="current-user"),
    path("premium/subscription/", PremiumSubscriptionView.as_view(), name="premium-subscription"),
    path("verification-requests/", VerificationRequestListCreateView.as_view(), name="verification-request-list-create"),
    path("verification-requests/<int:pk>/review/", VerificationReviewView.as_view(), name="verification-request-review"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
