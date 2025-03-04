from decimal import Decimal, ROUND_HALF_UP

def convertir_tna_a_tea(tna, capitalizacion):
    """
    Convierte una TNA (Tasa Nominal Anual) a TEA (Tasa Efectiva Anual).
    """
    tna = Decimal(tna) / Decimal(100)  # Convertir a Decimal y fracción
    capitalizacion = Decimal(capitalizacion)
    
    tea = (Decimal(1) + (tna / capitalizacion)) ** capitalizacion - Decimal(1)
    return (tea * Decimal(100)).quantize(Decimal('0.00001'), rounding=ROUND_HALF_UP)  # Retorna porcentaje con 5 decimales


def calcular_descuento_y_vr(vf, tea, seguro_desgravamen=0, comision_activacion=0, gasto_administracion=0, portes=0):
    """
    Calcula el Descuento Financiero (DS) y el Valor Recibido (VR).
    """
    vf = Decimal(vf)
    tea = Decimal(tea) / Decimal(100)  # Convertir a fracción
    seguro_desgravamen = Decimal(seguro_desgravamen)
    comision_activacion = Decimal(comision_activacion)
    gasto_administracion = Decimal(gasto_administracion)
    portes = Decimal(portes)

    ds = vf * tea  # Aplicamos la TEA
    vr = vf - ds - seguro_desgravamen - comision_activacion - gasto_administracion - portes  # Restamos costos

    return ds.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP), vr.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)  # Retorno redondeado a 2 decimales


def calcular_tcea_individual(vf, vr, dias):
    """
    Calcula la TCEA de una factura o letra.
    """
    vf = Decimal(vf)
    vr = Decimal(vr)
    dias = Decimal(dias)

    if vr <= 0 or dias <= 0:
        return Decimal(0)  # Evita errores de división

    tcea = (vf / vr) ** (Decimal(360) / dias) - Decimal(1)
    return (tcea * Decimal(100)).quantize(Decimal('0.00001'), rounding=ROUND_HALF_UP)  # Retorna porcentaje con 5 decimales


def calcular_tcea_cartera(instrumentos):
    """
    Calcula la TCEA de toda la cartera consolidando múltiples facturas y letras.
    :param instrumentos: Lista de diccionarios con {'VF': valor_final, 'VR': valor_recibido, 'D': dias}
    :return: TCEA de la cartera en porcentaje (%)
    """
    if not instrumentos:
        return Decimal(0)  # No hay instrumentos, evitar división por cero

    sum_vf = sum(Decimal(f['VF']) for f in instrumentos)
    sum_vr = sum(Decimal(f['VR']) for f in instrumentos)
    sum_dias = sum(Decimal(f['D']) for f in instrumentos) / Decimal(len(instrumentos))  # Promedio de días

    if sum_vr == 0 or sum_dias == 0:
        return Decimal(0)  # Evita errores de división

    tcea_cartera = (sum_vf / sum_vr) ** (Decimal(360) / sum_dias) - Decimal(1)
    return (tcea_cartera * Decimal(100)).quantize(Decimal('0.00001'), rounding=ROUND_HALF_UP)  # Retorna porcentaje con 5 decimales
