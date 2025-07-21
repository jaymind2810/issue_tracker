import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from issues.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "issue_tracker_backend.settings")
django.setup()

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
