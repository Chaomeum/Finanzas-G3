from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.
class Usuario(AbstractUser):
    nombre = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=70)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    groups = models.ManyToManyField(Group, related_name="usuario_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="usuario_permissions", blank=True)

    def __str__(self):
        return self.username