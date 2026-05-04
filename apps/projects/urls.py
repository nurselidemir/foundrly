from django.urls import path

from apps.projects.views import (
    AdminProjectDetailView,
    AdminProjectListView,
    DashboardSummaryView,
    MessageCreateView,
    MessageThreadDetailView,
    MessageThreadListView,
    ProjectMatchesView,
    ProjectDetailView,
    ProjectListCreateView,
    RecommendedProjectsView,
    TeamApplicationListCreateView,
    TeamApplicationStatusUpdateView,
)

urlpatterns = [
    path("admin/projects/", AdminProjectListView.as_view(), name="admin-project-list"),
    path("admin/projects/<int:pk>/", AdminProjectDetailView.as_view(), name="admin-project-detail"),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("dashboard/recommended-projects/", RecommendedProjectsView.as_view(), name="recommended-projects"),
    path("messages/threads/", MessageThreadListView.as_view(), name="message-thread-list"),
    path("messages/threads/<int:pk>/", MessageThreadDetailView.as_view(), name="message-thread-detail"),
    path("messages/threads/<int:pk>/messages/", MessageCreateView.as_view(), name="message-create"),
    path("projects/", ProjectListCreateView.as_view(), name="project-list-create"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("projects/<int:pk>/matches/", ProjectMatchesView.as_view(), name="project-matches"),
    path("applications/", TeamApplicationListCreateView.as_view(), name="application-list-create"),
    path("applications/<int:pk>/status/", TeamApplicationStatusUpdateView.as_view(), name="application-status-update"),
]
