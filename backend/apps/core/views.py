import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import CarteraDescuento, Letra, Factura
from .utils import convertir_tna_a_tea, calcular_descuento_y_vr, calcular_tcea_individual, calcular_tcea_cartera

# Vista de la página principal del sistema
@login_required
def start(request):
    # Obtener las carteras del usuario actual
    carteras = CarteraDescuento.objects.filter(usuario=request.user)
    
    # Crear listas para nombres y TCEAs
    # Combinar nombre y tipo de tasa para el eje X
    nombres_carteras = [f"{cartera.nombre} ({cartera.tipo_tasa})" for cartera in carteras]
    tceas_carteras = [float(cartera.valor_tasa) for cartera in carteras]  # Asumiendo que valor_tasa es la TCEA
    
    # Limitar a 5 carteras para la visualización
    if len(nombres_carteras) > 5:
        nombres_carteras = nombres_carteras[:5]
        tceas_carteras = tceas_carteras[:5]
    
    context = {
        'nombres_carteras': json.dumps(nombres_carteras),
        'tceas_carteras': json.dumps(tceas_carteras),
    }

    return render(request, 'start.html', context)


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
def opcion_registros(request):
    return render(request, 'registros.html')

@login_required
def opcion_ver_registros(request):
    return render(request, 'verRegistros.html')

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

    # facturas = Factura.objects.filter(cartera=cartera)
    # letras = Letra.objects.filter(cartera=cartera)
    # Obtener facturas y letras asociadas a la cartera con estado pendiente
    facturas_calculo = Factura.objects.filter(cartera=cartera, estado_pago='Pendiente')
    letras_calculo = Letra.objects.filter(cartera=cartera, estado_pago='Pendiente')
    # Determinar la TEA de la cartera
    if cartera.tipo_tasa == 'TNA':
        tea = convertir_tna_a_tea(cartera.valor_tasa, cartera.capitalizacion)
    else:
        tea = cartera.valor_tasa

    # Preparar los datos para el calculo de TCEA
    instrumentos = []

    # Facturas
    for factura in facturas_calculo:        
        ds, vr = calcular_descuento_y_vr(
            factura.monto_factura, tea,
            factura.seguro_desgravamen, factura.comision_activacion,
            factura.gasto_administracion, factura.portes
        )        
        dias = (factura.fecha_pago - factura.fecha_emision).days
        tcea_factura = calcular_tcea_individual(factura.monto_factura, vr, dias)
        factura.tcea = tcea_factura
        instrumentos.append({"VF": factura.monto_factura, "VR": vr, "D": dias})        
        

    for letra in letras_calculo:
        ds, vr = calcular_descuento_y_vr(letra.valor_nominal, tea, letra.seguro_desgravamen, letra.comision_activacion, letra.gasto_administracion, letra.portes)        
        dias = (letra.fecha_vencimiento - letra.fecha_firma).days 
        tcea_letra = calcular_tcea_individual(letra.valor_nominal, vr, dias)
        letra.tcea = tcea_letra
        instrumentos.append({"VF": letra.valor_nominal, "VR": vr, "D": dias})
        

    # Calcular la TCEA total de la cartera
    tcea_cartera = calcular_tcea_cartera(instrumentos)   
    
    return render(request, 'verCartera.html', {
        'cartera': cartera,             
        'facturas': facturas_calculo,        
        'letras': letras_calculo,
        'tcea_cartera': tcea_cartera
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