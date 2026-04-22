from django.contrib import admin, messages
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import action, display
from .models import Menu, MenuCategory, MenuItem, MenuItemPrice


# ── MenuItemPrice inline ────────────────────────────────────────
class MenuItemPriceInline(TabularInline):
    model = MenuItemPrice
    extra = 1
    min_num = 1
    fields = ["quantity","price"]
    verbose_name = "Price variant"
    verbose_name_plural = "Price variants"


# ── MenuItem inline (inside MenuCategory) ──────────────────────
class MenuItemInline(TabularInline):
    model = MenuItem
    extra = 1
    fields = ["name","image", "is_veg", "is_available", "veg_badge"]
    readonly_fields = ["veg_badge"]
    show_change_link = True

    @display(description="Type")
    def veg_badge(self, obj):
        if obj.pk is None:
            return "—"
        color = "#16a34a" if obj.is_veg else "#dc2626"
        label = "🟢 Veg" if obj.is_veg else "🔴 Non-veg"
        return format_html(
            '<span style="color:{}; font-weight:600; font-size:12px">{}</span>',
            color, label
        )


# ── MenuCategory inline (inside Menu) ──────────────────────────
class MenuCategoryInline(TabularInline):
    model = MenuCategory
    extra = 1
    fields = ["name"]
    show_change_link = True
    verbose_name = "Category"
    verbose_name_plural = "Categories"


# ── MenuItemPrice admin ─────────────────────────────────────────
@admin.register(MenuItemPrice)
class MenuItemPriceAdmin(ModelAdmin):
    list_display = ["id", "item", "quantity", "price"]
    list_filter = ["item__category"]
    search_fields = ["item__name", "quantity"]
    ordering = ["item__name", "quantity"]

    compressed_fields = True
    warn_unsaved_change = True


# ── MenuItem admin ──────────────────────────────────────────────
@admin.register(MenuItem)
class MenuItemAdmin(ModelAdmin):
    list_display = ["id", "name","image", "category", "veg_badge", "availability_badge"]
    list_filter = ["is_available", "is_veg", "category"]
    search_fields = ["name"]
    ordering = ["-id"]
    inlines = [MenuItemPriceInline]

    compressed_fields = True
    warn_unsaved_change = True

    fieldsets = (
        (
            "Item details",
            {
                "fields": ("name","image", "category"),
                "classes": ["tab"],
            },
        ),
        (
            "Status",
            {
                "fields": ("is_veg", "is_available"),
                "classes": ["tab"],
            },
        ),
    )

    actions_list = ["mark_available", "mark_unavailable", "mark_veg", "mark_nonveg"]

    # ── Display helpers ──
    @display(description="Type", ordering="is_veg")
    def veg_badge(self, obj):
        color, label = ("#16a34a", "Veg") if obj.is_veg else ("#dc2626", "Non-veg")
        return format_html(
            '<span style="'
            'background:{}20; color:{}; border:1px solid {}40;'
            'padding:2px 8px; border-radius:99px; font-size:11px; font-weight:600'
            '">{}</span>',
            color, color, color, label,
        )

    @display(description="Available", ordering="is_available", boolean=True)
    def availability_badge(self, obj):
        return obj.is_available

    # ── Bulk actions ──
    @action(description="Mark selected as available")
    def mark_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f"{updated} item(s) marked as available.", messages.SUCCESS)

    @action(description="Mark selected as unavailable")
    def mark_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f"{updated} item(s) marked as unavailable.", messages.WARNING)

    @action(description="Mark selected as Veg")
    def mark_veg(self, request, queryset):
        updated = queryset.update(is_veg=True)
        self.message_user(request, f"{updated} item(s) marked as veg.", messages.SUCCESS)

    @action(description="Mark selected as Non-veg")
    def mark_nonveg(self, request, queryset):
        updated = queryset.update(is_veg=False)
        self.message_user(request, f"{updated} item(s) marked as non-veg.", messages.WARNING)


# ── MenuCategory admin ──────────────────────────────────────────
@admin.register(MenuCategory)
class MenuCategoryAdmin(ModelAdmin):
    list_display = ["id", "name", "menu", "item_count"]
    search_fields = ["name", "menu__name"]
    ordering = ["menu"]
    inlines = [MenuItemInline]

    compressed_fields = True
    warn_unsaved_change = True

    @display(description="Items")
    def item_count(self, obj):
        count = obj.items.count()
        return format_html(
            '<span style="'
            'background:#f3f4f6; color:#374151; border-radius:99px;'
            'padding:2px 8px; font-size:11px; font-weight:600'
            '">{} item{}</span>',
            count, "s" if count != 1 else "",
        )


# ── Menu admin ──────────────────────────────────────────────────
@admin.register(Menu)
class MenuAdmin(ModelAdmin):
    list_display = ["id", "name", "date", "version", "active_badge", "category_count", "updated_by"]
    search_fields = ["name", "version"]
    list_filter = ["date", "is_active"]
    ordering = ["-date", "-version"]
    inlines = [MenuCategoryInline]

    compressed_fields = True
    warn_unsaved_change = True

    fieldsets = (
        (
            "Menu details",
            {
                "fields": ("name", "date", "version", "updated_by"),
                "classes": ["tab"],
            },
        ),
        (
            "Settings",
            {
                "fields": ("is_active",),
                "classes": ["tab"],
            },
        ),
    )

    actions_list = ["activate_menus", "deactivate_menus"]

    @display(description="Active", ordering="is_active", boolean=True)
    def active_badge(self, obj):
        return obj.is_active

    @display(description="Categories")
    def category_count(self, obj):
        count = obj.categories.count()
        return format_html(
            '<span style="'
            'background:#eff6ff; color:#1d4ed8; border-radius:99px;'
            'padding:2px 8px; font-size:11px; font-weight:600'
            '">{} cat{}</span>',
            count, "s" if count != 1 else "",
        )

    @action(description="Activate selected menus")
    def activate_menus(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} menu(s) activated.", messages.SUCCESS)

    @action(description="Deactivate selected menus")
    def deactivate_menus(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} menu(s) deactivated.", messages.WARNING)