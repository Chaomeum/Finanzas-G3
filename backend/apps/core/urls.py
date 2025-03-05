from django.urls import path
from . import views

urlpatterns = [
    # Rutas para la vista principal del sistema
    path('', views.start, name='start'),
    path('cuenta/', views.cuenta, name='cuenta'),
    
    # # Rutas para la gestión de carteras
    path('carteras/', views.opcion_carteras, name='opcion_carteras'), # Ruta para la opción de carteras
    path('carteras/crear/', views.crear_cartera, name='crear_cartera'), # Ruta para la creación de carteras
    path('carteras/ver/', views.ver_carteras, name='ver_carteras'), # Ruta para la visualización de carteras
    path('carteras/<int:id>/', views.detalle_cartera, name='detalle_cartera'), # Ruta para el detalle de una cartera
    path('carteras/editar/<int:id>/', views.editar_cartera, name='editar_cartera'), # Ruta para la edición de carteras
    path('carteras/eliminar/<int:id>/', views.eliminar_cartera, name='eliminar_cartera'), # Ruta para la eliminación de carteras    
    
    # # Rutas para la gestión de letras    
    path('letras/crear/', views.crear_letra, name='crear_letra'), # Ruta para la creación de letras
    path('letras/crear/<str:nombre_cartera>/', views.crear_letra, name='crear_letra_cartera'), # Ruta para la creación de letras
    # path('letras/<int:id>/', views.detalle_letra, name='detalle_letra'), # Ruta para el detalle de una letra
    # path('letras/editar/<int:id>/', views.editar_letra, name='editar_letra'), # Ruta para la edición de letras
    # path('letras/eliminar/<int:id>/', views.eliminar_letra, name='eliminar_letra'), # Ruta para la eliminación de letras
    
    # # Rutas para la gestión de facturas
    path('facturas/crear/', views.crear_factura, name='crear_factura'), # Ruta para la creación de facturas
    path('facturas/crear/<str:nombre_cartera>/', views.crear_factura, name='crear_factura_cartera'), # Ruta para la creación de facturas
    path('registros/', views.opcion_registros, name='opcion_registros'), # Ruta para la opción de registros
    path('registros/ver', views.opcion_ver_registros, name='opcion_ver_registros')
    # path('facturas/<int:id>/', views.detalle_factura, name='detalle_factura'), # Ruta para el detalle de una factura
    # path('facturas/editar/<int:id>/', views.editar_factura, name='editar_factura'), # Ruta para la edición de facturas
    # path('facturas/eliminar/<int:id>/', views.eliminar_factura, name='eliminar_factura'), # Ruta para la eliminación de facturas
]
