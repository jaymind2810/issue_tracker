from django.urls import path
from .subscriptions import MyGraphqlWsConsumer

websocket_urlpatterns = [
    path("graphql/", MyGraphqlWsConsumer.as_asgi()),
]
