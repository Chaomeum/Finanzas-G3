from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

TIPO_TASA = [
    ('Efectiva', 'Efectiva'),
    ('Nominal', 'Nominal'),
]

MONEDA_CHOICES = [
    ('USD', 'Dólares'),
    ('PEN', 'Soles'),
]

ESTADO_PAGO = [
    ('Pendiente', 'Pendiente'),
    ('Pagado', 'Pagado'),
    ('Cancelado', 'Cancelado'),
]


class CarteraDescuento(models.Model):    
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)  # Relación con el usuario
    nombre = models.CharField(max_length=255, blank=True)  # Nombre de la cartera
    valor_tasa = models.FloatField(null=True)  # Tasa de descuento
    tipo_tasa = models.CharField(max_length=10, choices=TIPO_TASA, default='Efectiva')    
    capitalizacion = models.FloatField(null=True, blank=True)  
    fecha_descuento = models.DateField(null=True, blank=True)  # Fecha de descuento      
        
    def calcular_tcea(self):
        """Cálculo de TCEA en tiempo real."""
        if not self.pk or (not self.letra_set.exists() and not self.factura_set.exists()):
            return 0.0  # Evitar cálculos si no hay elementos en la cartera
        
        # Implementar cálculo real aquí
        return 10.5 

    def __str__(self):
        return f"Cartera {self.id}  (TCEA: {self.calcular_tcea()}%)"

    class Meta:
        verbose_name = "Cartera de Descuento"
        verbose_name_plural = "Carteras de Descuento"


class Letra(models.Model):
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    cartera = models.ForeignKey(CarteraDescuento, on_delete=models.SET_NULL, null=True, blank=True)  # Relación con la cartera
    valor_nominal = models.DecimalField(max_digits=10, decimal_places=2)
    beneficiario = models.CharField(max_length=100)
    fecha_firma = models.DateField()
    fecha_vencimiento = models.DateField()    
    unidad_monetaria = models.CharField(max_length=3, choices=MONEDA_CHOICES, default='PEN')
    estado_pago = models.CharField(max_length=10, choices=ESTADO_PAGO, default='Pendiente')
    seguro_desgravamen = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # % sobre el VN
    comision_activacion = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    gasto_administracion = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    portes = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def clean(self):        
        if self.fecha_firma >= self.fecha_vencimiento:
            raise ValidationError('La fecha de giro debe ser anterior a la fecha de vencimiento.')

    def __str__(self):
        return f"Letra {self.id} - {self.beneficiario} ({self.valor_nominal} {self.unidad_monetaria}) - {self.estado_pago}"

    class Meta:
        verbose_name = 'Letra'
        verbose_name_plural = 'Letras'


class Factura(models.Model):
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    cartera = models.ForeignKey(CarteraDescuento, on_delete=models.SET_NULL, null=True, blank=True)  # Relación con la cartera
    monto_factura = models.DecimalField(max_digits=10, decimal_places=2)
    cliente = models.CharField(max_length=255)
    fecha_emision = models.DateField()
    fecha_pago = models.DateField()
    unidad_monetaria = models.CharField(max_length=3, choices=MONEDA_CHOICES, default='PEN')
    estado_pago = models.CharField(max_length=10, choices=ESTADO_PAGO, default='Pendiente')
    seguro_desgravamen = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # % sobre el VN
    comision_activacion = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    gasto_administracion = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    portes = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def clean(self):        
        if self.fecha_emision >= self.fecha_pago:
            raise ValidationError("La fecha de pago debe ser posterior a la fecha de emisión.")

    def __str__(self):
        return f"Factura {self.id} - {self.cliente} ({self.monto_factura} {self.unidad_monetaria}) - {self.estado_pago}"

    class Meta:
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"
        