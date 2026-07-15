from django.urls import path
from . import views

urlpatterns = [
    path('',                     views.hello,              name='hello'),
    path('health/',              views.health_check,       name='health'),
    path('hello/',               views.hello,              name='hello-named'),
    path('items/',               views.ItemView.as_view(), name='items-list'),
    path('items/<int:item_id>/', views.ItemView.as_view(), name='items-detail'),
]
