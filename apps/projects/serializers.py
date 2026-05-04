from rest_framework import serializers

from apps.projects.models import ApplicationMessage, Project, TeamApplication


class UserSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    is_verified_talent = serializers.BooleanField(read_only=True)
    is_premium = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)


class TeamApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSummarySerializer(read_only=True)

    class Meta:
        model = TeamApplication
        fields = [
            "id",
            "project",
            "applicant",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "applicant", "status", "created_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        project = attrs.get("project")

        if request and request.user.is_authenticated and project.owner_id == request.user.id:
            raise serializers.ValidationError("Kullanici kendi projesine basvuru yapamaz.")

        return attrs


class TeamApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamApplication
        fields = ["status"]

    def validate_status(self, value):
        allowed_statuses = {"pending", "accepted", "rejected"}
        if value not in allowed_statuses:
            raise serializers.ValidationError("Gecersiz basvuru durumu.")
        return value


class ProjectListSerializer(serializers.ModelSerializer):
    owner = UserSummarySerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "title",
            "summary",
            "is_premium_highlighted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "is_premium_highlighted", "created_at", "updated_at"]


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSummarySerializer(read_only=True)
    applications = TeamApplicationSerializer(many=True, read_only=True)
    has_approved_access = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "title",
            "summary",
            "problem_statement",
            "tech_stack",
            "needed_roles",
            "is_premium_highlighted",
            "applications",
            "has_approved_access",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "is_premium_highlighted", "created_at", "updated_at"]

    def get_has_approved_access(self, obj):
        return self._can_view_restricted_project_details(obj)

    def _is_project_owner(self, obj):
        request = self.context.get("request")
        return bool(
            request
            and request.user.is_authenticated
            and obj.owner_id == request.user.id
        )

    def _can_view_restricted_project_details(self, obj):
        if self._is_project_owner(obj):
            return True

        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        user = request.user

        return obj.applications.filter(applicant_id=user.id, status="accepted").exists()

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if self._is_project_owner(instance):
            return data

        if self._can_view_restricted_project_details(instance):
            data.pop("applications", None)
            return data

        data.pop("applications", None)
        data.pop("problem_statement", None)
        data.pop("tech_stack", None)
        data.pop("needed_roles", None)
        return data


class DashboardSummarySerializer(serializers.Serializer):
    profile = UserSummarySerializer()
    metrics = serializers.DictField()
    recent_projects = ProjectListSerializer(many=True)
    recent_received_applications = TeamApplicationSerializer(many=True)
    recent_sent_applications = TeamApplicationSerializer(many=True)


class MatchCandidateSerializer(serializers.Serializer):
    user = UserSummarySerializer()
    score = serializers.IntegerField()
    match_label = serializers.CharField()
    recommended_role = serializers.CharField()
    ai_summary = serializers.CharField()
    ai_enabled = serializers.BooleanField()
    reasons = serializers.ListField(child=serializers.CharField())
    matched_skills = serializers.ListField(child=serializers.CharField())
    matched_interests = serializers.ListField(child=serializers.CharField())
    missing_skills = serializers.ListField(child=serializers.CharField())


class RecommendedProjectSerializer(serializers.Serializer):
    project = ProjectListSerializer()
    score = serializers.IntegerField()
    match_label = serializers.CharField()
    recommended_role = serializers.CharField()
    ai_summary = serializers.CharField()
    ai_enabled = serializers.BooleanField()
    reasons = serializers.ListField(child=serializers.CharField())
    matched_skills = serializers.ListField(child=serializers.CharField())
    matched_interests = serializers.ListField(child=serializers.CharField())
    missing_skills = serializers.ListField(child=serializers.CharField())


class ApplicationMessageSerializer(serializers.ModelSerializer):
    sender = UserSummarySerializer(read_only=True)

    class Meta:
        model = ApplicationMessage
        fields = ["id", "sender", "content", "created_at"]
        read_only_fields = ["id", "sender", "created_at"]


class MessageThreadSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
    project = ProjectListSerializer()
    counterpart = UserSummarySerializer()
    status = serializers.CharField()
    latest_message = ApplicationMessageSerializer(allow_null=True)
    unread_count = serializers.IntegerField()


class MessageThreadDetailSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
    project = ProjectListSerializer()
    counterpart = UserSummarySerializer()
    status = serializers.CharField()
    messages = ApplicationMessageSerializer(many=True)


class AdminProjectListSerializer(serializers.ModelSerializer):
    owner = UserSummarySerializer(read_only=True)
    applications_count = serializers.IntegerField(read_only=True)
    accepted_applications_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "title",
            "summary",
            "is_premium_highlighted",
            "applications_count",
            "accepted_applications_count",
            "created_at",
            "updated_at",
        ]


class AdminProjectDetailSerializer(serializers.ModelSerializer):
    owner = UserSummarySerializer(read_only=True)
    applications = TeamApplicationSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "title",
            "summary",
            "problem_statement",
            "tech_stack",
            "needed_roles",
            "is_premium_highlighted",
            "applications",
            "created_at",
            "updated_at",
        ]
