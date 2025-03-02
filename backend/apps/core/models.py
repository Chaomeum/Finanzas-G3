from django.db import models
from django.contrib.auth import get_user_model

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


class Tasa(models.Model):
    valor_tasa = models.FloatField()
    tipo_tasa = models.CharField(max_length=10, choices=TIPO_TASA)    
    capitalizacion = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.valor_tasa} - {self.tipo_tasa} - {self.capitalizacion}"
    
    class Meta:
        verbose_name = 'Tasa'
        verbose_name_plural = 'Tasas'


class Letra(models.Model):
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    tasa = models.ForeignKey(Tasa, on_delete=models.CASCADE)
    valor_nominal = models.FloatField()
    beneficiario = models.CharField(max_length=100)
    fecha_giro = models.DateField()
    fecha_vencimiento = models.DateField()
    unidad_monetaria = models.CharField(max_length=3, choices=MONEDA_CHOICES)

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.fecha_giro <= self.fecha_vencimiento:
            raise ValidationError('La fecha de giro no puede ser menor a la fecha de vencimiento')
    
    def __str__(self):
        return f"{self.usuario} - {self.valor_nominal} - {self.beneficiario} - {self.fecha_giro} - {self.fecha_vencimiento} - {self.unidad_monetaria}"
    
    class Meta:
        verbose_name = 'Letra'
        verbose_name_plural = 'Letras'


class Factura(models.Model):
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    tasa = models.ForeignKey(Tasa, on_delete=models.CASCADE)
    monto_factura = models.FloatField()
    cliente = models.CharField(max_length=255)
    fecha_emision = models.DateField()
    fecha_pago = models.DateField()
    unidad_monetaria = models.CharField(max_length=10, choices=MONEDA_CHOICES)

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.fecha_pago <= self.fecha_emision:
            raise ValidationError("La fecha de pago debe ser posterior a la fecha de emisión.")

    def __str__(self):
        return f"Factura {self.id} - {self.cliente} ({self.monto_factura} {self.unidad_monetaria})"

    class Meta:
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"
        

class CarteraDescuento(models.Model):
    tasa = models.ForeignKey(Tasa, on_delete=models.CASCADE)
    fecha_descuento = models.DateField()
    tcea_calculada = models.FloatField(null=True, blank=True)  # Puede calcularse dinámicamente
    unidad_monetaria = models.CharField(max_length=10, choices=MONEDA_CHOICES)
    letras = models.ManyToManyField(Letra, blank=True)
    facturas = models.ManyToManyField(Factura, blank=True)

    def calcular_tcea(self):
        """Lógica para calcular la TCEA con base en las letras y facturas."""
        # Aquí se deberá implementar la fórmula financiera real
        if not self.letras.exists() and not self.facturas.exists():
            return 0.0  # Evitar cálculos si no hay elementos en la cartera

        # Implementar cálculo de TCEA aquí (como placeholder, retornamos un valor arbitrario)
        return 10.5  # Ejemplo, en la práctica se calcularía dinámicamente

    def save(self, *args, **kwargs):
        """Antes de guardar, recalcular la TCEA si es necesario."""
        self.tcea_calculada = self.calcular_tcea()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Cartera {self.id} - {self.unidad_monetaria} (TCEA: {self.tcea_calculada}%)"

    class Meta:
        verbose_name = "Cartera de Descuento"
        verbose_name_plural = "Carteras de Descuento"