from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('model-response/', views.model_response, name='model_response'),
]