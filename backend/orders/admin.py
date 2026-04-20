from django.contrib import admin

# Register your models here.

from .models import DiningTable, Order, OrderItem
@admin.register(DiningTable)
class DiningTableAdmin(admin.ModelAdmin):
    list_display = ('name', 'seats', 'is_available', 'table_number', 'location', 'status')
    list_filter = ('is_available', 'status')
    search_fields = ('name', 'table_number')

class InlineOrderItem(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [InlineOrderItem]
    list_display = ('order_id', 'table', 'menu')
    list_filter = ('menu',)
    search_fields = ('order_id', 'table__name')             

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'menu_item_price', 'quantity')
    search_fields = ('order__order_id', 'menu_item_price__item__name')  

admin.site.register(OrderItem, OrderItemAdmin)

