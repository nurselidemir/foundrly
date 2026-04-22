from rest_framework.permissions import BasePermission


class IsProjectOwnerForApplicationStatusUpdate(BasePermission):
    message = "Basvuru durumunu sadece proje sahibi guncelleyebilir."

    def has_object_permission(self, request, view, obj):
        return obj.project.owner_id == request.user.id


class IsProjectOwnerOrReadOnly(BasePermission):
    message = "Bu projeyi sadece proje sahibi guncelleyebilir veya silebilir."

    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return obj.owner_id == request.user.id
