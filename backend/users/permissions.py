from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    
    def has_permission(self, request, view):
        # Step 2.1: Check if user is logged in
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Step 2.2: Check if object belongs to user
        return obj == request.user