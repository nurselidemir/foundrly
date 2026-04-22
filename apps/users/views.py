from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import VerificationRequest, User
from apps.users.serializers import (
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
        skill = request.query_params.get("skill")
        interest = request.query_params.get("interest")
        verified_only = request.query_params.get("verified_only")

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
