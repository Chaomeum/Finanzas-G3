# Generated by Django 5.1.6 on 2025-03-02 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_carteradescuento_valor_tasa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='carteradescuento',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
