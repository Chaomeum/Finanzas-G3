from django.urls import path
from .views import home_view,signup_view, login_view, logout_view, lista_carteras

urlpatterns = [
    path('', home_view, name='home'), # Redirige a la URL de la landing page
    path('registro/', signup_view, name='registro'), # Redirige a la URL de la página de registro
    path('login/', login_view, name='login'), # Redirige a la URL de la página de inicio de sesión
    path('logout/', logout_view, name='logout'), # Redirige a la URL de la página de cierre de sesión
    path('carteras/', lista_carteras, name='listCarteras'), # Redirige a la URL de la página de carteras
]
