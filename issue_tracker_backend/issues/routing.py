# issues/routing.py
from django.urls import path
from .subscriptions import IssueSubscriptionConsumer

websocket_urlpatterns = [
    path("graphql/", IssueSubscriptionConsumer.as_asgi()),
]
