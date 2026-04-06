from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


class Menu(models.Model):
    name = models.CharField(max_length=100)  # e.g. "Today's Menu"
    
    # Track which day this menu belongs to
    date = models.DateField()

    # Optional: for multiple updates in a day
    version = models.PositiveIntegerField(default=1)

    is_active = models.BooleanField(default=True)

    # Who updated it (chef/admin)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-version']
        unique_together = ['date', 'version']

    def __str__(self):
        return f"{self.date} (v{self.version})"
    

class MenuCategory(models.Model):
    menu = models.ForeignKey(
        Menu,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']
        unique_together = ['menu', 'name']

    def __str__(self):
        return self.name
    
class MenuItem(models.Model):
    category = models.ForeignKey(
        MenuCategory,
        on_delete=models.CASCADE,
        related_name='items'
    )

    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    is_available = models.BooleanField(default=True)
    is_veg = models.BooleanField(default=False)

    def __str__(self):
        return self.name