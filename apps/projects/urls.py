from django.urls import path

from apps.projects.views import (
    DashboardSummaryView,
    ProjectMatchesView,
    ProjectDetailView,
    ProjectListCreateView,
    RecommendedProjectsView,
    TeamApplicationListCreateView,
    TeamApplicationStatusUpdateView,
)

urlpatterns = [
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("dashboard/recommended-projects/", RecommendedProjectsView.as_view(), name="recommended-projects"),
    path("projects/", ProjectListCreateView.as_view(), name="project-list-create"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("projects/<int:pk>/matches/", ProjectMatchesView.as_view(), name="project-matches"),
    path("applications/", TeamApplicationListCreateView.as_view(), name="application-list-create"),
    path("applications/<int:pk>/status/", TeamApplicationStatusUpdateView.as_view(), name="application-status-update"),
]
