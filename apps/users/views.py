import json

from django.conf import settings
from django.db.models import Q
from django.utils import timezone

from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import VerificationRequest, User
from apps.users.serializers import (
    AdminUserDetailSerializer,
    AdminUserModerationSerializer,
    AdminUserRoleSerializer,
    AdminVerificationRequestSerializer,
    PremiumSubscribeSerializer,
    PremiumSubscriptionSerializer,
    RegisterSerializer,
    UserSerializer,
    VerificationRequestSerializer,
    VerificationReviewSerializer,
)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "name": "Foundrly API",
                "status": "ok",
                "stack": {
                    "backend": "Django",
                    "database": "PostgreSQL",
                    "auth": "JWT",
                    "api": "REST",
                },
            }
        )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        search = request.query_params.get("search")
        skill = request.query_params.get("skill")
        interest = request.query_params.get("interest")
        verified_only = request.query_params.get("verified_only")

        if search:
            queryset = queryset.filter(full_name__icontains=search)

        used_premium_filter = any([skill, interest, verified_only == "true"])
        if used_premium_filter:
            if not request.user.is_authenticated or not request.user.is_premium:
                raise PermissionDenied("Gelişmis ekip filtreleri sadece premium kullanicilar icindir.")

        if skill:
            queryset = queryset.filter(skills__contains=[skill])

        if interest:
            queryset = queryset.filter(interests__contains=[interest])

        if verified_only == "true":
            queryset = queryset.filter(is_verified_talent=True)

        return queryset


class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PremiumSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription = getattr(request.user, "premium_subscription", None)
        if not subscription:
            return Response(
                {
                    "is_premium": request.user.is_premium,
                    "subscription": None,
                }
            )

        return Response(
            {
                "is_premium": request.user.is_premium,
                "subscription": PremiumSubscriptionSerializer(subscription).data,
            }
        )

    def post(self, request):
        serializer = PremiumSubscribeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        subscription = serializer.save()
        return Response(
            {
                "message": "Premium uyelik aktif edildi.",
                "is_premium": request.user.is_premium,
                "subscription": PremiumSubscriptionSerializer(subscription).data,
            },
            status=201,
        )



class VerificationRequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VerificationRequestSerializer

    def get_queryset(self):
        return VerificationRequest.objects.filter(user=self.request.user)


class VerificationReviewView(generics.UpdateAPIView):
    queryset = VerificationRequest.objects.select_related("user").all()
    serializer_class = VerificationReviewSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_object(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Verification inceleme islemi sadece admin kullanicilar icindir.")
        return super().get_object()


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")

        from apps.projects.models import ApplicationMessage, Project, TeamApplication

        today = timezone.localdate()
        active_user_ids = set(
            User.objects.filter(date_joined__date=today).values_list("id", flat=True)
        )
        active_user_ids.update(Project.objects.filter(created_at__date=today).values_list("owner_id", flat=True))
        active_user_ids.update(TeamApplication.objects.filter(created_at__date=today).values_list("applicant_id", flat=True))
        active_user_ids.update(
            TeamApplication.objects.filter(created_at__date=today).values_list("project__owner_id", flat=True)
        )
        active_user_ids.update(ApplicationMessage.objects.filter(created_at__date=today).values_list("sender_id", flat=True))

        data = {
            "totals": {
                "users_count": User.objects.count(),
                "daily_active_users": len(active_user_ids),
                "new_registrations": User.objects.filter(date_joined__date=today).count(),
                "projects_count": Project.objects.count(),
                "matches_count": TeamApplication.objects.filter(status="accepted").count(),
                "premium_users_count": User.objects.filter(is_premium=True).count(),
            },
            "queues": {
                "pending_verification_requests": VerificationRequest.objects.filter(
                    status=VerificationRequest.STATUS_PENDING
                ).count(),
                "pending_applications": TeamApplication.objects.filter(status="pending").count(),
            },
        }
        return Response(data)


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserRoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied("Bu alan sadece superuser kullanicilar icindir.")

        queryset = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(full_name__icontains=search)
        return queryset


class AdminUserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        return super().get_object()


class AdminUserRoleUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserRoleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_object(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied("Admin atama islemi sadece superuser kullanicilar icindir.")
        return super().get_object()


class AdminUserModerationView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserModerationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch", "delete"]

    def get_object(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied("Kullanici moderasyonu sadece superuser kullanicilar icindir.")
        return super().get_object()

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        if user.id == request.user.id:
            raise PermissionDenied("Kendi hesabinizi silemezsiniz.")
        user.delete()
        return Response(status=204)


class AdminVerificationRequestListView(generics.ListAPIView):
    queryset = VerificationRequest.objects.select_related("user").all()
    serializer_class = AdminVerificationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")

        queryset = super().get_queryset()
        status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if status in {
            VerificationRequest.STATUS_PENDING,
            VerificationRequest.STATUS_APPROVED,
            VerificationRequest.STATUS_REJECTED,
        }:
            queryset = queryset.filter(status=status)

        if search:
            queryset = queryset.filter(
                Q(user__full_name__icontains=search) | Q(user__email__icontains=search)
            )

        return queryset
