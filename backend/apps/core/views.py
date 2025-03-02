from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import CarteraDescuento, Letra, Factura

# Vista de la página principal del sistema
def start(request):
    return render(request, 'start.html')

# Vista de la cuenta de usuario
@login_required
def cuenta(request):
    user = request.user
    return render(request, 'account.html', {'user': user})

# Vistas de carteras
@login_required
def opcion_carteras(request):
    return render(request, 'carteras.html')

@login_required
def crear_cartera(request):
    if request.method == 'POST':
        tipo_tasa = request.POST.get('tipo_tasa')
        valor_tasa = request.POST.get('tasa')
        capitalizacion = request.POST.get('capitalizacion')
        nombre = request.POST.get('nombre')        
        try:
            valor_tasa = float(valor_tasa)
            capitalizacion = float(capitalizacion)
        except ValueError:
            messages.error(request, "Tasa y capitalización deben ser valores numéricos.")
            return render(request, "crearCartera.html")

        # Crear la cartera y guardarla en la base de datos
        cartera = CarteraDescuento(
            usuario=request.user,
            nombre=nombre,
            valor_tasa=valor_tasa,
            tipo_tasa=tipo_tasa,
            capitalizacion=capitalizacion
        )
        cartera.save()
        print(cartera)
        messages.success(request, "Cartera registrada exitosamente.")
        return redirect('start')  # Cambia esto por la vista deseada

    return render(request, "crearCartera.html")

@login_required
def ver_carteras(request):   
    carteras = CarteraDescuento.objects.all()
    return render(request, 'listaCarteras.html', {'carteras': carteras})

@login_required
def editar_cartera(request):
    return render(request, 'editarCartera.html')

@login_required
def eliminar_cartera(request):
    return render(request, 'eliminarCartera.html')


# Vistas de facturas y letras
@login_required
def crear_factura(request):
    return render(request, 'registroFactura.html')


def crear_letra(request):
    return render(request, 'registroLetra.html')