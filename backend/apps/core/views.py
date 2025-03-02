from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Vista de la página principal del sistema
def start(request):
    return render(request, 'start.html')

# Vista de la cuenta de usuario
@login_required
def cuenta(request):
    user = request.user
    return render(request, 'account.html', {'user': user})

def opcion_carteras(request):
    return render(request, 'carteras.html')

def crear_cartera(request):
    return render(request, 'crearCartera.html')

def ver_carteras(request):
    return render(request, 'listaCarteras.html')