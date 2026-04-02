from django.db import models
from django.contrib.auth.models import AbstractUser

class Role(models.Model):
    role_name=models.CharField( max_length=50 ,blank=True,null=True)

    def __str__(self):
        return self.role_name
    
class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.username
    
