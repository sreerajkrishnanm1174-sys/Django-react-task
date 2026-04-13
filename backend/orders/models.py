from django.db import models
from django.conf import settings
import uuid
from django.core.exceptions import ValidationError
from django.db.models import Sum
from Menu.models import Menu, MenuItemPrice

# Create your models here.

class DiningTable(models.Model):
    name = models.CharField(max_length=100)
    seats=models.PositiveIntegerField()
    is_available=models.BooleanField(default=False)
    table_number = models.PositiveIntegerField(unique=True)
    location = models.CharField(max_length=100, blank=True, null=True)  # e.g. "Window", "Outdoor"
    status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('occupied', 'Occupied'),
            ('reserved', 'Reserved'),
            ('maintenance', 'Maintenance'),
        ],
        default='available'
        )
    



    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    

    def __str__(self):
        return self.name
    
class Order(models.Model):
    table = models.ForeignKey('DiningTable', on_delete=models.PROTECT)

    menu = models.ForeignKey(   # 🔥 IMPORTANT
       Menu,
        on_delete=models.PROTECT,
        related_name='orders',
        null=True, blank=True  # Temporary: allow null for migration
    )

    order_id = models.CharField(max_length=20, unique=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(
        'Order',
        on_delete=models.CASCADE,
        related_name='items'
    )

    menu_item_price = models.ForeignKey(
        MenuItemPrice,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField(default=1)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        editable=False
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        editable=False
    )

    class Meta:
        unique_together = ('order', 'menu_item_price')

    # ✅ Proper validation (works in admin + API)
    def clean(self):
        menu_of_item = self.menu_item_price.item.category.menu

        if menu_of_item != self.order.menu:
            raise ValidationError("Selected item does not belong to this order's menu.")

        if not self.menu_item_price.item.is_available:
            raise ValidationError("This item is currently not available.")

    def save(self, *args, **kwargs):
        self.clean()  # 🔥 ensure validation always runs

        # 🔁 Merge duplicate items (better UX)
        existing = OrderItem.objects.filter(
            order=self.order,
            menu_item_price=self.menu_item_price
        ).exclude(pk=self.pk).first()

        if existing:
            existing.quantity += self.quantity
            existing.save()
            return

        # ✅ Set price snapshot
        self.price = self.menu_item_price.price

        # ✅ Calculate subtotal
        self.subtotal = self.quantity * self.price

        super().save(*args, **kwargs)

        # ✅ Efficient total update (DB aggregation)
        total = self.order.items.aggregate(
            total=Sum('subtotal')
        )['total'] or 0

        self.order.total_amount = total
        self.order.save(update_fields=['total_amount'])

    def __str__(self):
        return f"{self.quantity} x {self.menu_item_price}"