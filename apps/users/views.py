import json
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import generics, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import (
    CommunityEvent,
    CommunityEventRegistration,
    CommunityGuide,
    CommunityThread,
    MentorRequestMessage,
    VerificationRequest,
    User,
    MentorRequest,
    FriendRequest,
)
from apps.users.serializers import (
    AdminUserDetailSerializer,
    AdminUserModerationSerializer,
    AdminUserRoleSerializer,
    AdminVerificationRequestSerializer,
    CommunityEventSerializer,
    CommunityEventRegistrationSerializer,
    CommunityGuideSerializer,
    CommunityThreadSerializer,
    PublicUserReviewSerializer,
    PublicUserProfileSerializer,
    PremiumSubscribeSerializer,
    PremiumSubscriptionSerializer,
    RegisterSerializer,
    ShowcaseProjectSerializer,
    ShowcaseUserSerializer,
    UserSerializer,
    UserReviewCreateSerializer,
    VerificationRequestSerializer,
    VerificationReviewSerializer,
    MentorSerializer,
    MentorRequestSerializer,
    MentorRequestMentorActionSerializer,
    MentorRequestUserActionSerializer,
    MentorRequestMessageSerializer,
    FriendRequestSerializer,
)


def _get_accessible_mentor_request(user, request_id):
    mentor_request = get_object_or_404(
        MentorRequest.objects.select_related("user", "mentor").prefetch_related("messages__sender"),
        pk=request_id,
    )

    if user.id not in {mentor_request.user_id, mentor_request.mentor_id}:
        raise PermissionDenied("Bu mentorluk gorusmesine erisemezsiniz.")

    if mentor_request.status in {MentorRequest.STATUS_DECLINED, MentorRequest.STATUS_REFUNDED}:
        raise PermissionDenied("Bu talep icin mesajlasma kapatildi.")

    return mentor_request


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
            queryset = queryset.filter(
                Q(full_name__icontains=search) | Q(title__icontains=search)
            )

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


class ShowcaseDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.projects.models import Project
        from apps.users.models import UserReview
        from apps.users.serializers import PublicUserReviewSerializer

        projects = (
            Project.objects.select_related("owner")
            .filter(owner__is_active=True)
            .order_by("-is_premium_highlighted", "-created_at")[:12]
        )
        users = (
            User.objects.filter(is_active=True, is_staff=False, is_superuser=False)
            .exclude(title="")
            .filter(
                Q(projects__isnull=False)
                | Q(community_threads__isnull=False)
                | Q(applications__isnull=False)
                | Q(mentor_sessions__isnull=False)
                | Q(mentor_requests__isnull=False)
            )
            .distinct()
            .order_by("-is_verified_talent", "-is_premium", "-date_joined")[:12]
        )
        threads = (
            CommunityThread.objects.select_related("author")
            .filter(is_featured=True)[:8]
        )
        events = CommunityEvent.objects.filter(is_featured=True).prefetch_related("registrations")[:8]
        guides = CommunityGuide.objects.filter(is_published=True)[:8]
        reviews = UserReview.objects.select_related("reviewer", "reviewee", "application__project").order_by("-created_at")[:10]

        data = {
            "projects": ShowcaseProjectSerializer(projects, many=True).data,
            "users": ShowcaseUserSerializer(users, many=True).data,
            "threads": CommunityThreadSerializer(threads, many=True).data,
            "events": CommunityEventSerializer(events, many=True, context={"request": request}).data,
            "guides": CommunityGuideSerializer(guides, many=True).data,
            "reviews": PublicUserReviewSerializer(reviews, many=True).data,
        }
        return Response(data)


class CommunityEventRegistrationCreateView(generics.CreateAPIView):
    queryset = CommunityEventRegistration.objects.all()
    serializer_class = CommunityEventRegistrationSerializer
    permission_classes = [IsAuthenticated]


class MentorListView(generics.ListAPIView):
    queryset = User.objects.filter(is_mentor=True)
    serializer_class = MentorSerializer
    permission_classes = [IsAuthenticated]


class MentorRequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MentorRequestSerializer

    def get_queryset(self):
        return (
            MentorRequest.objects.filter(user=self.request.user)
            .select_related("user", "mentor")
            .prefetch_related("messages__sender")
        )


class FriendRequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class FriendRequestUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer
    queryset = FriendRequest.objects.all()

    def get_object(self):
        obj = super().get_object()
        if obj.receiver_id != self.request.user.id:
            raise PermissionDenied("Sadece alici istegi guncelleyebilir.")
        return obj


class MentorMyRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MentorRequestSerializer

    def get_queryset(self):
        if not self.request.user.is_mentor:
            raise PermissionDenied("Sadece mentorlar bu alana erisebilir.")
        return (
            MentorRequest.objects.filter(mentor=self.request.user)
            .select_related("user", "mentor")
            .prefetch_related("messages__sender")
        )


class MentorRequestStatusUpdateView(generics.UpdateAPIView):
    queryset = MentorRequest.objects.all()
    serializer_class = MentorRequestMentorActionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_object(self):
        obj = super().get_object()
        if obj.mentor_id != self.request.user.id:
            raise PermissionDenied("Sadece talebin atandigi mentor durum guncellemesi yapabilir.")
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            data=request.data,
            context={"request_instance": instance},
        )
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data["action"]
        now = timezone.now()

        if action == "offer":
            instance.status = MentorRequest.STATUS_OFFERED
            instance.offered_price = serializer.validated_data["offered_price"]
            instance.meeting_time = serializer.validated_data["meeting_time"]
            instance.save(update_fields=["status", "offered_price", "meeting_time"])
        elif action == "decline":
            instance.status = MentorRequest.STATUS_DECLINED
            instance.save(update_fields=["status"])
        elif action == "mark_completed":
            instance.status = MentorRequest.STATUS_MENTOR_COMPLETED
            instance.mentor_completed_at = now
            instance.save(update_fields=["status", "mentor_completed_at"])

        return Response(MentorRequestSerializer(instance).data)


class MentorRequestConfirmView(generics.UpdateAPIView):
    queryset = MentorRequest.objects.all()
    serializer_class = MentorRequestUserActionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_object(self):
        obj = super().get_object()
        if obj.user_id != self.request.user.id:
            raise PermissionDenied("Sadece talebi olusturan kullanici onay verebilir.")
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            data=request.data or {"action": "accept_offer"},
            context={"request_instance": instance},
        )
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data["action"]
        now = timezone.now()

        if action == "accept_offer":
            reserved_amount = instance.offered_price or instance.price_at_request or Decimal("0.00")
            instance.status = MentorRequest.STATUS_PAID_RESERVED
            instance.user_confirmed = True
            instance.user_confirmed_at = now
            instance.reserved_amount = reserved_amount
            instance.save(
                update_fields=["status", "user_confirmed", "user_confirmed_at", "reserved_amount"]
            )
        elif action == "confirm_completion":
            payout = instance.reserved_amount * (Decimal("1.00") - instance.commission_rate)
            mentor = instance.mentor
            mentor.mentor_balance += payout
            mentor.save(update_fields=["mentor_balance"])

            instance.status = MentorRequest.STATUS_RELEASED
            instance.released_at = now
            instance.save(update_fields=["status", "released_at"])
        elif action == "open_dispute":
            instance.status = MentorRequest.STATUS_DISPUTED
            instance.disputed_at = now
            instance.dispute_reason = serializer.validated_data["dispute_reason"]
            instance.save(update_fields=["status", "disputed_at", "dispute_reason"])

        return Response(MentorRequestSerializer(instance).data)


class MentorRequestMessageCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        mentor_request = _get_accessible_mentor_request(request.user, pk)
        content = request.data.get("content", "").strip()

        if not content:
            raise serializers.ValidationError({"content": ["Mesaj bos olamaz."]})

        message = MentorRequestMessage.objects.create(
            mentor_request=mentor_request,
            sender=request.user,
            content=content,
        )
        return Response(MentorRequestMessageSerializer(message).data, status=201)


class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfilePictureUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if "profile_picture" not in request.FILES:
            return Response({"detail": "Resim dosyasi bulunamadi."}, status=400)
        
        user = request.user
        user.profile_picture = request.FILES["profile_picture"]
        user.save()
        
        # We need to return the FULL URL for the frontend to show it immediately
        # Usually Django Serializer does this if Request context is provided
        return Response(UserSerializer(user, context={'request': request}).data)


class PublicUserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = PublicUserProfileSerializer
    permission_classes = [AllowAny]


class UserReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        profile_user = get_object_or_404(User, pk=self.kwargs["pk"])
        return profile_user.received_reviews.select_related(
            "reviewer",
            "application__project",
        ).all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserReviewCreateSerializer
        return PublicUserReviewSerializer

    def list(self, request, *args, **kwargs):
        reviews = self.get_queryset()[:20]

        serializer = PublicUserReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionDenied("Yorum birakmak icin giris yapman gerekiyor.")

        profile_user = get_object_or_404(User, pk=self.kwargs["pk"])
        serializer = UserReviewCreateSerializer(
            data=request.data,
            context={"request": request, "profile_user": profile_user},
        )
        serializer.is_valid(raise_exception=True)
        review = serializer.save()

        return Response(PublicUserReviewSerializer(review).data, status=201)


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

    def delete(self, request):
        subscription = getattr(request.user, "premium_subscription", None)
        if subscription:
            subscription.status = subscription.STATUS_CANCELED
            subscription.save(update_fields=["status"])

        request.user.is_premium = False
        request.user.mentor_credits = 0
        request.user.save(update_fields=["is_premium", "mentor_credits"])

        return Response(
            {
                "message": "Premium uyelik iptal edildi.",
                "is_premium": request.user.is_premium,
                "subscription": PremiumSubscriptionSerializer(subscription).data if subscription else None,
            }
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
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")

        queryset = super().get_queryset().filter(is_mentor=False)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) | Q(email__icontains=search)
            )
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


class AdminUserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Sadece adminler yeni kullanici/mentor olusturabilir.")
        user = serializer.save()
        is_mentor = str(self.request.data.get("is_mentor", "")).lower() in {
            "true",
            "1",
            "yes",
            "on",
        }
        if is_mentor:
            user.is_mentor = True
            user.is_premium = True
            mentor_price = self.request.data.get("mentor_price", 0)
            try:
                user.mentor_price = mentor_price
            except (TypeError, ValueError, ValidationError):
                user.mentor_price = 0
            user.title = self.request.data.get("title", "Resmi Mentör")
            user.is_verified_talent = True  # Manual mentors are automatically verified
            user.save(update_fields=["is_mentor", "is_premium", "mentor_price", "title", "is_verified_talent"])
        return user


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


class AdminEventListCreateView(generics.ListCreateAPIView):
    """Admin: etkinlikleri listele ve yeni etkinlik oluştur."""
    queryset = CommunityEvent.objects.all()
    serializer_class = CommunityEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        return super().get_queryset()

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        serializer.save()


class AdminEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: etkinlik detay, güncelle ve sil."""
    queryset = CommunityEvent.objects.all()
    serializer_class = CommunityEventSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        return super().get_object()


class AdminMentorListView(generics.ListAPIView):
    """Admin: tüm mentor durumundaki kullanıcıları listele."""
    queryset = User.objects.filter(is_mentor=True).order_by("full_name")
    serializer_class = AdminUserModerationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        return User.objects.filter(is_mentor=True).order_by("full_name")

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        from apps.users.serializers import AdminUserDetailSerializer
        data = []
        for user in qs:
            data.append({
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "title": user.title,
                "is_mentor": user.is_mentor,
                "mentor_price": str(user.mentor_price),
                "is_verified_talent": user.is_verified_talent,
                "is_premium": user.is_premium,
            })
        return Response(data)


class AdminGuideListCreateView(generics.ListCreateAPIView):
    queryset = CommunityGuide.objects.all()
    serializer_class = CommunityGuideSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        return super().get_queryset()

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        serializer.save()


class AdminGuideDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommunityGuide.objects.all()
    serializer_class = CommunityGuideSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Bu alan sadece admin kullanicilar icindir.")
        return super().get_object()
