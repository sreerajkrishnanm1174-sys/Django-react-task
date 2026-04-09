from django.contrib import admin
from .models import User,Role,Profile
from django.contrib.auth.admin import UserAdmin
# Register your models here.
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    extra = 0

class CustomUserAdmin(UserAdmin):
    inlines = [ProfileInline]
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone', 'role')}),
    )

# admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Role)
admin.site.register(Profile)