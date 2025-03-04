# Generated by Django 5.1.6 on 2025-03-04 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CarteraDescuento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(blank=True, max_length=255)),
                ('valor_tasa', models.FloatField(null=True)),
                ('tipo_tasa', models.CharField(choices=[('Efectiva', 'Efectiva'), ('Nominal', 'Nominal')], default='Efectiva', max_length=10)),
                ('capitalizacion', models.FloatField(blank=True, null=True)),
                ('fecha_descuento', models.DateField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Cartera de Descuento',
                'verbose_name_plural': 'Carteras de Descuento',
            },
        ),
        migrations.CreateModel(
            name='Factura',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monto_factura', models.DecimalField(decimal_places=2, max_digits=10)),
                ('cliente', models.CharField(max_length=255)),
                ('fecha_emision', models.DateField()),
                ('fecha_pago', models.DateField()),
                ('unidad_monetaria', models.CharField(choices=[('USD', 'Dólares'), ('PEN', 'Soles')], default='PEN', max_length=3)),
                ('estado_pago', models.CharField(choices=[('Pendiente', 'Pendiente'), ('Pagado', 'Pagado'), ('Cancelado', 'Cancelado')], default='Pendiente', max_length=10)),
                ('seguro_desgravamen', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('comision_activacion', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('gasto_administracion', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('portes', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
            options={
                'verbose_name': 'Factura',
                'verbose_name_plural': 'Facturas',
            },
        ),
        migrations.CreateModel(
            name='Letra',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor_nominal', models.DecimalField(decimal_places=2, max_digits=10)),
                ('beneficiario', models.CharField(max_length=100)),
                ('fecha_firma', models.DateField()),
                ('fecha_vencimiento', models.DateField()),
                ('unidad_monetaria', models.CharField(choices=[('USD', 'Dólares'), ('PEN', 'Soles')], default='PEN', max_length=3)),
                ('estado_pago', models.CharField(choices=[('Pendiente', 'Pendiente'), ('Pagado', 'Pagado'), ('Cancelado', 'Cancelado')], default='Pendiente', max_length=10)),
                ('seguro_desgravamen', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('comision_activacion', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('gasto_administracion', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('portes', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
            options={
                'verbose_name': 'Letra',
                'verbose_name_plural': 'Letras',
            },
        ),
    ]
