import channels_graphql_ws

class MyGraphqlWsConsumer(channels_graphql_ws.GraphqlWsConsumer):
    async def on_connect(self, payload):
        # Optional: handle auth here
        pass

    schema = None  # Set dynamically to avoid early loading errors


def set_schema():
    from .schema import schema  # Adjust path as needed
    MyGraphqlWsConsumer.schema = schema