import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'issue_tracker_backend.settings')

# Initialize Django before any model imports
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import issues.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(issues.routing.websocket_urlpatterns)
    ),
})
