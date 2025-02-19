from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError

# Creación de vistas
# La vista de inicio es la página de inicio de la aplicación
def home_view(request):
    return render(request, 'landing.html')

# La vista registro es la encargada de registrar un nuevo usuario
def signup_view(request):
    # Si el método es GET, se muestra el formulario de registro
    if request.method == 'GET':
        form = UserCreationForm()
        return render(request, 'signup.html', {'form': form})
    # Si el método es POST, se procesa la información del formulario
    # y se crea el usuario
    else:
        username = request.POST.get('username', '').strip()
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')

        if password1 != password2:
            return render(request, 'signup.html', 
                          {'form': UserCreationForm(), 
                           'error': 'Las contraseñas no coinciden'})

        if User.objects.filter(username=username).exists():
            return render(request, 'signup.html', 
                          {'form': UserCreationForm(), 
                           'error': 'El usuario ya existe'})

        try:
            user = User.objects.create_user(username=username, password=password1)
            user.save()
            login(request, user)
            return redirect('login')  # Verifica que el nombre de la URL en urls.py sea 'login'

        except IntegrityError:
            return render(request, 'signup.html', 
                          {'form': UserCreationForm(), 
                           'error': 'Error al crear el usuario'})        
        
# La vista login_view es la encargada de autenticar a un usuario
def login_view(request):
    form = AuthenticationForm()
    # Si el método es POST, se procesa la información del formulario
    # y se autentica al usuario
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home') # Se debe reemplazar el home (landing page) 
                                    # por la página principal de la aplicación (main)
        else:
            return render(request, 'login.html', 
                          {'form': form, 
                           'error': 'Usuario o contraseña incorrectos'})
    # Si el método es GET, se muestra el formulario de login
    return render(request, 'login.html', {'form': form})

# La vista logout_view es la encargada de cerrar la sesión de un usuario
def logout_view(request):
    logout(request)
    return redirect('login')
