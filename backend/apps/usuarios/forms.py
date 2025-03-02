from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Usuario

# Formulario de registro personalizado
class CustomUserCreationForm(UserCreationForm):    
    nombre = forms.CharField(max_length=50, required=True)
    apellidos = forms.CharField(max_length=70, required=True)
    username = forms.CharField(label='Nombre de usuario', max_length=150, required=True)    
    email = forms.EmailField(required=True)
    password1 = forms.CharField(label='Contraseña', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirmar contraseña', widget=forms.PasswordInput)

    class Meta:
        model = Usuario
        fields = ['nombre', 'apellidos', 'username', 'email',  'password1', 'password2']
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if Usuario.objects.filter(username=username).exists():
            raise forms.ValidationError('El nombre de usuario ya está en uso.')
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if Usuario.objects.filter(email=email).exists():
            raise forms.ValidationError('El correo electrónico ya está registrado.')
        return email
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.nombre = self.cleaned_data['nombre']
        user.apellidos = self.cleaned_data['apellidos']
        if commit:
            user.save()
        return user

# Formulario de autenticación personalizado
class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(label='Email o nombre de usuario')
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput)

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username and password:
            try:
                user = Usuario.objects.get(email=username)
            except Usuario.DoesNotExist:
                try:
                    user = Usuario.objects.get(username=username)
                except Usuario.DoesNotExist:
                    raise forms.ValidationError('Usuario o contraseña incorrectos') 
            if not user.check_password(password):
                raise forms.ValidationError('Usuario o contraseña incorrectos')
            self.user_cache = user
        return self.cleaned_data
