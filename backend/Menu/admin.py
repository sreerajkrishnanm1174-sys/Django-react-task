from django.contrib import admin,messages
from .models import*
from unfold.admin import ModelAdmin
# Register your models here.
class CustomAdminClass(ModelAdmin):
    pass
class MenucateInline(admin.TabularInline):
    model=MenuCategory
    extra=1

class MenuitemInline(admin.TabularInline):
    model=MenuItem
    extra=1
    
class MenuCategoryAdmin(admin.ModelAdmin):
    inlines = [MenuitemInline]




class MenuItemsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'is_available', 'is_veg']
    list_filter = ['is_available', 'is_veg', 'category']
    ordering = ['-id']

    actions = ['mark_as_available', 'mark_as_unavailable','mark_as_nonveg','mark_as_veg']

    def mark_as_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(
            request,
            f'{updated} items marked as available.',
            messages.SUCCESS
        )

    mark_as_available.short_description = "Mark selected items as available"
    
    def mark_as_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(
            request,
            f'{updated} items marked as unavailable.',
            messages.WARNING
        )

    mark_as_unavailable.short_description = "Mark selected items as unavailable"

    def mark_as_veg(self, request, queryset):
        updated = queryset.update(is_veg=True)
        self.message_user(
            request,
            f'{updated} items marked as veg.',
            messages.WARNING
        )

    mark_as_veg.short_description = "Mark selected items as veg"

    def mark_as_nonveg(self, request, queryset):
        updated = queryset.update(is_veg=False)
        self.message_user(
            request,
            f'{updated} items marked as nonveg.',
            messages.WARNING
        )

    mark_as_nonveg.short_description = "Mark selected items as nonveg"


class MenuAdmin(admin.ModelAdmin):
    # to change the order of the  fields
    fields=["version","date","name"]
    # add search field
    search_fields=["version","date","name"]
    # add filter field
    list_filter=["date","name"]
   
    #list the view 
    # list view (add more columns to be useful)
    list_display = ['id', 'name', 'date', 'version']
    # inline Method view
    inlines = [MenucateInline]                         
    



admin.site.register(Menu,CustomAdminClass)
admin.site.register(MenuCategory,MenuCategoryAdmin)
admin.site.register(MenuItem,MenuItemsAdmin)

