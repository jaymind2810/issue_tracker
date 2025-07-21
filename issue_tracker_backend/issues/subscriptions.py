# issues/subscriptions.py

import graphene
from graphene_django import DjangoObjectType
from .models import Issue
import channels_graphql_ws


class NewIssueType(DjangoObjectType):
    class Meta:
        model = Issue
        fields = "__all__"


class IssueSubscription(channels_graphql_ws.Subscription):
    """Subscription for issue updates."""
    issue = graphene.Field(NewIssueType)

    class Arguments:
        id = graphene.ID(required=False)

    def subscribe(self, info, id=None):
        # Subscribe to group(s) based on presence of `id`
        return [f"issue_updates:{id}" if id else "issue_updates"]

    def publish(self, info, id=None):
        return IssueSubscription(issue=self["issue"])

    @classmethod
    def broadcast_issue(cls, issue):
        cls.broadcast(
            group="issue_updates",
            payload={"issue": issue},
        )
        cls.broadcast(
            group=f"issue_updates:{issue.id}",
            payload={"issue": issue},
        )


class IssueSubscriptionConsumer(channels_graphql_ws.GraphqlWsConsumer):
    """WebSocket consumer for handling GraphQL subscriptions."""

    async def on_connect(self, payload):
        # Optional: authentication logic here
        pass

    # Schema will be assigned in schema.py
    schema = None
