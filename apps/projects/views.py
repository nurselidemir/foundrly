from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView

from apps.projects.models import Project, TeamApplication
from apps.projects.permissions import (
    IsPremiumUser,
    IsProjectOwnerForApplicationStatusUpdate,
    IsProjectOwnerOrReadOnly,
)
from apps.projects.serializers import (
    DashboardSummarySerializer,
    MatchCandidateSerializer,
    ProjectListSerializer,
    ProjectSerializer,
    RecommendedProjectSerializer,
    TeamApplicationSerializer,
    TeamApplicationStatusSerializer,
    UserSummarySerializer,
)
from apps.projects.services.ai_matching import enrich_match_with_ai
from apps.projects.services.matching import score_project_for_user, score_user_for_project
from apps.users.models import User


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.select_related("owner").prefetch_related("applications__applicant").all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        user = request.user

        mine = request.query_params.get("mine")
        joined = request.query_params.get("joined")
        premium_only = request.query_params.get("premium_only")
        search = request.query_params.get("search")

        if mine == "true":
            if not user.is_authenticated:
                return queryset.none()
            queryset = queryset.filter(owner=user)

        if joined == "true":
            if not user.is_authenticated:
                return queryset.none()
            queryset = queryset.filter(applications__applicant=user, applications__status="accepted")

        if premium_only == "true":
            queryset = queryset.filter(is_premium_highlighted=True)

        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            is_premium_highlighted=self.request.user.is_premium,
        )


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.select_related("owner").prefetch_related("applications__applicant").all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsProjectOwnerOrReadOnly]


class TeamApplicationListCreateView(generics.ListCreateAPIView):
    queryset = TeamApplication.objects.select_related("project", "applicant").all()
    serializer_class = TeamApplicationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        user = request.user

        mine = request.query_params.get("mine")
        received = request.query_params.get("received")
        status = request.query_params.get("status")
        project_id = request.query_params.get("project")

        if mine == "true":
            if not user.is_authenticated:
                return queryset.none()
            queryset = queryset.filter(applicant=user)

        if received == "true":
            if not user.is_authenticated:
                return queryset.none()
            queryset = queryset.filter(project__owner=user)

        if status in {"pending", "accepted", "rejected"}:
            queryset = queryset.filter(status=status)

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        if mine != "true" and received != "true":
            if user.is_authenticated:
                queryset = queryset.filter(project__owner=user)
            else:
                return queryset.none()

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)


class TeamApplicationStatusUpdateView(generics.UpdateAPIView):
    queryset = TeamApplication.objects.select_related("project__owner", "applicant").all()
    serializer_class = TeamApplicationStatusSerializer
    permission_classes = [IsAuthenticated, IsProjectOwnerForApplicationStatusUpdate]
    http_method_names = ["patch"]


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        owned_projects = Project.objects.filter(owner=user)
        sent_applications = TeamApplication.objects.filter(applicant=user)
        received_applications = TeamApplication.objects.filter(project__owner=user)
        accepted_memberships = sent_applications.filter(status="accepted")

        recent_projects = owned_projects.select_related("owner").order_by("-created_at")[:5]
        recent_received_applications = received_applications.select_related("project", "applicant").order_by("-created_at")[:5]
        recent_sent_applications = sent_applications.select_related("project", "applicant").order_by("-created_at")[:5]

        data = {
            "profile": UserSummarySerializer(user).data,
            "metrics": {
                "owned_projects_count": owned_projects.count(),
                "received_applications_count": received_applications.count(),
                "pending_received_applications_count": received_applications.filter(status="pending").count(),
                "accepted_received_applications_count": received_applications.filter(status="accepted").count(),
                "sent_applications_count": sent_applications.count(),
                "accepted_memberships_count": accepted_memberships.count(),
            },
            "recent_projects": ProjectListSerializer(recent_projects, many=True).data,
            "recent_received_applications": TeamApplicationSerializer(
                recent_received_applications,
                many=True,
                context={"request": request},
            ).data,
            "recent_sent_applications": TeamApplicationSerializer(
                recent_sent_applications,
                many=True,
                context={"request": request},
            ).data,
        }

        serializer = DashboardSummarySerializer(data)
        return Response(serializer.data)


class ProjectMatchesView(APIView):
    permission_classes = [IsAuthenticated, IsPremiumUser]

    def get(self, request, pk):
        project = Project.objects.get(pk=pk)

        if project.owner_id != request.user.id:
            raise PermissionDenied("Aday eslesmelerini sadece proje sahibi gorebilir.")

        candidates = User.objects.exclude(id=project.owner_id)
        results = []

        for candidate in candidates:
            match = score_user_for_project(candidate, project)
            if match.score == 0:
                continue
            ai_result = enrich_match_with_ai(
                base_result=match,
                subject_payload={
                    "full_name": candidate.full_name,
                    "title": candidate.title,
                    "skills": candidate.skills,
                    "interests": candidate.interests,
                    "is_verified_talent": candidate.is_verified_talent,
                    "is_premium": candidate.is_premium,
                },
                target_payload={
                    "project_title": project.title,
                    "tech_stack": project.tech_stack,
                    "needed_roles": project.needed_roles,
                    "summary": project.summary,
                },
                target_name=candidate.title,
            )
            results.append(
                {
                    "user": UserSummarySerializer(candidate).data,
                    "score": match.score,
                    "match_label": ai_result["match_label"],
                    "recommended_role": ai_result["recommended_role"],
                    "ai_summary": ai_result["ai_summary"],
                    "ai_enabled": ai_result["ai_enabled"],
                    "reasons": match.reasons,
                    "matched_skills": match.matched_skills,
                    "matched_interests": match.matched_interests,
                    "missing_skills": match.missing_skills,
                }
            )

        results.sort(key=lambda item: item["score"], reverse=True)
        serializer = MatchCandidateSerializer(results[:10], many=True)
        return Response(serializer.data)


class RecommendedProjectsView(APIView):
    permission_classes = [IsAuthenticated, IsPremiumUser]

    def get(self, request):
        user = request.user
        projects = Project.objects.select_related("owner").exclude(owner=user)
        results = []

        for project in projects:
            match = score_project_for_user(project, user)
            if match.score == 0:
                continue
            ai_result = enrich_match_with_ai(
                base_result=match,
                subject_payload={
                    "full_name": user.full_name,
                    "title": user.title,
                    "skills": user.skills,
                    "interests": user.interests,
                    "is_verified_talent": user.is_verified_talent,
                    "is_premium": user.is_premium,
                },
                target_payload={
                    "project_title": project.title,
                    "tech_stack": project.tech_stack,
                    "needed_roles": project.needed_roles,
                    "summary": project.summary,
                },
                target_name=user.title,
            )
            results.append(
                {
                    "project": ProjectListSerializer(project).data,
                    "score": match.score,
                    "match_label": ai_result["match_label"],
                    "recommended_role": ai_result["recommended_role"],
                    "ai_summary": ai_result["ai_summary"],
                    "ai_enabled": ai_result["ai_enabled"],
                    "reasons": match.reasons,
                    "matched_skills": match.matched_skills,
                    "matched_interests": match.matched_interests,
                    "missing_skills": match.missing_skills,
                }
            )

        results.sort(key=lambda item: item["score"], reverse=True)
        serializer = RecommendedProjectSerializer(results[:10], many=True)
        return Response(serializer.data)
