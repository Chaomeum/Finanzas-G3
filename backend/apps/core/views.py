from django.shortcuts import render, redirect, get_object_or_404
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
        fecha_descuento = request.POST.get('fecha_descuento')       
        try:
            valor_tasa = float(valor_tasa)
            capitalizacion = float(capitalizacion)
        except ValueError:            
            return render(request, "crearCartera.html")

        # Crear la cartera y guardarla en la base de datos
        cartera = CarteraDescuento(
            usuario=request.user,
            nombre=nombre,
            valor_tasa=valor_tasa,
            tipo_tasa=tipo_tasa,
            capitalizacion=capitalizacion,
            fecha_descuento=fecha_descuento
        )
        cartera.save()                
        return redirect('ver_carteras')  # Cambia esto por la vista deseada

    return render(request, "crearCartera.html")

@login_required
def ver_carteras(request):   
    carteras = CarteraDescuento.objects.filter(usuario=request.user)
    return render(request, 'listaCarteras.html', {'carteras': carteras})


@login_required
def detalle_cartera(request, id):    
    cartera = get_object_or_404(CarteraDescuento, id=id, usuario=request.user)
    # Obtener facturas y letras asociadas a la cartera
    facturas = Factura.objects.filter(cartera=cartera)
    letras = Letra.objects.filter(cartera=cartera)

    return render(request, 'verCartera.html', {
        'cartera': cartera,             
        'facturas': facturas,        
        'letras': letras
    })


@login_required
def editar_cartera(request, id):
    cartera = get_object_or_404(CarteraDescuento, id=id)
    if request.method == "POST":        
        cartera.nombre = request.POST.get('nombre')      
        cartera.valor_tasa = request.POST.get('tasa')
        cartera.tipo_tasa = request.POST.get('tipo_tasa')
        cartera.capitalizacion = request.POST.get('capitalizacion')        
        cartera.fecha_descuento = request.POST.get('fecha_descuento')
        cartera.save()
    return redirect("ver_carteras")
    

@login_required
def eliminar_cartera(request, id):
    cartera = get_object_or_404(CarteraDescuento, id=id)
    if request.method == "POST":
        cartera.delete()
    return redirect("ver_carteras")


# Vistas de facturas y letras
@login_required
def crear_factura(request, nombre_cartera=None):
    carteras = CarteraDescuento.objects.filter(usuario=request.user)
    cartera = None
    if nombre_cartera:
        cartera = get_object_or_404(CarteraDescuento, nombre=nombre_cartera, usuario=request.user)

    if request.method == 'POST':
        nombre_cartera = request.POST.get('nombre_cartera')        
        cartera = get_object_or_404(CarteraDescuento, nombre=nombre_cartera, usuario=request.user)
        monto_factura = request.POST.get('monto_factura')
        fecha_emision = request.POST.get('fecha_emision')
        fecha_pago = request.POST.get('fecha_pago')
        cliente = request.POST.get('cliente')
        unidad_monetaria = request.POST.get('unidad_monetaria')
        estado_pago = request.POST.get('estado_pago')
        seguro_desgravamen = request.POST.get('seguro_desgravamen')
        comision_activacion = request.POST.get('comision_activacion')
        gasto_administracion = request.POST.get('gasto_administrativo')
        portes = request.POST.get('portes')

        if not monto_factura or not fecha_emision or not fecha_pago or not cliente:            
            return render(request, 'registroFactura.html', {'nombre_cartera': nombre_cartera})

        factura = Factura(
            usuario=request.user,
            cartera=cartera,
            monto_factura=monto_factura,
            fecha_emision=fecha_emision,
            fecha_pago=fecha_pago,
            cliente=cliente,
            unidad_monetaria=unidad_monetaria,
            estado_pago=estado_pago,
            seguro_desgravamen=seguro_desgravamen,
            comision_activacion=comision_activacion,
            gasto_administracion=gasto_administracion,
            portes=portes
        )

        factura.save()        
        if cartera:
            return redirect('detalle_cartera', id=cartera.id)  # Pasar el ID correctamente
        return redirect('start')  # Si no hay cartera, redirigir a start

    return render(request, 'registroFactura.html', {'carteras': carteras,'nombre_cartera': nombre_cartera})


def crear_letra(request, nombre_cartera=None):
    carteras = CarteraDescuento.objects.filter(usuario=request.user)
    cartera = None
    if nombre_cartera:
        cartera = get_object_or_404(CarteraDescuento, nombre=nombre_cartera, usuario=request.user)

    if request.method == 'POST':
        nombre_cartera = request.POST.get('nombre_cartera')        
        cartera = get_object_or_404(CarteraDescuento, nombre=nombre_cartera, usuario=request.user)
        valor_nominal = request.POST.get('valor_nominal')
        fecha_firma = request.POST.get('fecha_firma')        
        fecha_vencimiento = request.POST.get('fecha_vencimiento')
        beneficiario = request.POST.get('beneficiario')
        unidad_monetaria = request.POST.get('moneda')
        estado_pago = request.POST.get('estado_pago')
        seguro_desgravamen = request.POST.get('seguro_desgravamen')
        comision_activacion = request.POST.get('comision_activacion')
        gasto_administracion = request.POST.get('gasto_administrativo')
        portes = request.POST.get('portes')

        if not valor_nominal or not fecha_firma or not fecha_vencimiento or not beneficiario:            
            return render(request, 'registroLetra.html', {'nombre_cartera': nombre_cartera})

        letra = Letra(
            usuario=request.user,
            cartera=cartera,
            valor_nominal=valor_nominal,
            fecha_firma=fecha_firma,            
            fecha_vencimiento=fecha_vencimiento,
            beneficiario=beneficiario,
            unidad_monetaria=unidad_monetaria,
            estado_pago=estado_pago,
            seguro_desgravamen=seguro_desgravamen,
            comision_activacion=comision_activacion,
            gasto_administracion=gasto_administracion,
            portes=portes
        )

        letra.save()        
        if cartera:
            return redirect('detalle_cartera', id=cartera.id)  # Pasar el ID correctamente
        return redirect('start')
    return render(request, 'registroLetra.html', {'carteras': carteras,'nombre_cartera': nombre_cartera})