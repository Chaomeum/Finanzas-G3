from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .forms import CustomUserCreationForm, CustomAuthenticationForm

# Vista de la página principal
def home_view(request):
    return render(request, 'landing.html')

# Vista de registro de usuario
def signup_view(request):
    # Si el método de la peticiwón es POST, se procesa el formulario de registro
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            try:
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password1'])
                user.save()            
                login(request, user)
                return redirect('login') # Se redirige a la URL de la página de inicio de sesión 'login'
            except IntegrityError:
                return render(request, 'signup.html', 
                                {'form': CustomUserCreationForm(), 
                                'error': 'Error al crear el usuario'})
    # Si el método de la petición es GET, se muestra el formulario de registro
    return render(request, 'signup.html', {'form': CustomUserCreationForm()})

# Vista de inicio de sesión
def login_view(request):
    # Si el método de la petición es POST, se procesa el formulario de inicio de sesión
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('start') # Se redirige a la URL de la página principal 'start'
        return render(request, 'login.html', {'form': form})
    # Si el método de la petición es GET, se muestra el formulario de inicio de sesión
    return render(request, 'login.html', {'form': CustomAuthenticationForm()})

# Vista de cierre de sesión
def logout_view(request):
    logout(request)
    return redirect('login')
