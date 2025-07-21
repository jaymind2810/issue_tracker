import graphene
import channels_graphql_ws
from .types import IssueType
from channels_graphql_ws import GraphqlWsConsumer

from .models import Issue
from asgiref.sync import sync_to_async


class IssueSubscription(channels_graphql_ws.Subscription):
    """GraphQL subscription for real-time issue updates."""

    issue = graphene.Field(IssueType)

    class Arguments:
        pass

    def subscribe(self, info):
        return ["issue_updates"]

    async def publish(self, info):
        issue_id = self["id"]  # ✅ self is the payload dict
        issue = await sync_to_async(
            lambda: Issue.objects.select_related("created_by", "assigned_to").get(id=issue_id)
        )()
        return IssueSubscription(issue=issue)

    @classmethod
    def broadcast_issue(cls, issue):
        cls.broadcast(
            group="issue_updates",
            payload={"id": issue.id}  # ✅ Keep payload small and simple
        )


class MyGraphqlWsConsumer(GraphqlWsConsumer):
    from issues.schema import schema 
    schema = schema

    async def on_connect(self, payload):
        print("🔌 WebSocket connected!")
