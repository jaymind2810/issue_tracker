from django.urls import re_path
import graphene
from graphene_django import DjangoObjectType
from .types import IssueType
from .models import Issue
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token, create_refresh_token
from graphql import GraphQLError
from .utils import enhance_description
from django.contrib.auth import authenticate
import graphql_jwt
# from graphql_auth import mutations
import google.generativeai as genai
from graphql import GraphQLError
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import os
from .subscriptions import IssueSubscription


User = get_user_model()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class CustomTokenAuth(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    refresh_token = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if user is None:
            raise GraphQLError("Invalid credentials")

        token = get_token(user)
        refresh_token_obj = create_refresh_token(user)

        return CustomTokenAuth(
            token=token,
            refresh_token=str(refresh_token_obj.token),
            user=user,
        )

class RegisterUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            raise GraphQLError("Username already exists")
        user = User.objects.create_user(username=username, email=email, password=password)
        return RegisterUser(user=user)
    
class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, email, password):
        user = get_user_model().objects.create_user(
            username=username, email=email, password=password
        )
        return CreateUser(user=user)


class IssueStatusEnum(graphene.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    CLOSED = "CLOSED"


class Query(graphene.ObjectType):
    all_issues = graphene.List(IssueType, status=IssueStatusEnum())
    my_issues = graphene.List(IssueType)
    issue_status_enum = graphene.List(IssueStatusEnum)
    users = graphene.List(UserType)

    @login_required
    def resolve_all_issues(self, info, status=None):
        qs = Issue.objects.all()
        if status:
            qs = qs.filter(status=status)
        return qs

    @login_required
    def resolve_my_issues(self, info):
        user = info.context.user
        return Issue.objects.filter(assigned_to=user)

    def resolve_issue_status_enum(self, info):
        return list(IssueStatusEnum)
    
    def resolve_users(self, info):
        return get_user_model().objects.all()

# =================== Issue Mutations =========================================
class CreateIssue(graphene.Mutation):
    issue = graphene.Field(IssueType)

    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        status = graphene.String()
        priority = graphene.String()

    @login_required
    def mutate(self, info, title, description, status=None, priority=None):
        user = info.context.user
        issue = Issue.objects.create(
            title=title,
            # description=enhance_description(description),
            description=description,
            status=status or "OPEN",
            priority=priority or "MEDIUM",
            created_by=user,
        )
        IssueSubscription.broadcast_issue(issue)

        return CreateIssue(issue=issue)


class UpdateIssue(graphene.Mutation):
    issue = graphene.Field(IssueType)

    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assigned_to_id = graphene.Int()

    @login_required
    def mutate(self, info, id, title=None, description=None, status=None, priority=None, assigned_to_id=None):
        user = info.context.user
        try:
            issue = Issue.objects.get(id=id)
        except Issue.DoesNotExist:
            raise GraphQLError("Issue not found")

        if issue.created_by != user:
            raise GraphQLError("Permission denied")

        if title:
            issue.title = title
        if description:
            # issue.description = enhance_description(description)
            issue.description = description
        if status:
            issue.status = status
        if priority:
            issue.priority = priority
        if assigned_to_id:
            issue.assigned_to = User.objects.get(id=assigned_to_id)

        issue.save()
        IssueSubscription.broadcast_issue(issue)

        return UpdateIssue(issue=issue)


class DeleteIssue(graphene.Mutation):
    ok = graphene.Boolean()
    message = graphene.String()
    deleted_id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):
        user = info.context.user
        try:
            issue = Issue.objects.get(id=id)
        except Issue.DoesNotExist:
            raise GraphQLError("Issue not found.")

        if issue.created_by != user:
            raise GraphQLError("Permission denied.")

        issue.delete()
        IssueSubscription.broadcast_issue(issue)

        return DeleteIssue(ok=True, message="Issue deleted", deleted_id=id)
    

class UpdateIssueStatus(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        status = graphene.String(required=True)

    ok = graphene.Boolean()
    issue = graphene.Field(IssueType)

    @login_required
    def mutate(self, info, id, status):
        try:
            issue = Issue.objects.get(id=id)
        except Issue.DoesNotExist:
            raise GraphQLError("Issue not found")

        if issue.created_by != info.context.user:
            raise GraphQLError("Permission denied")

        if status not in ["OPEN", "IN_PROGRESS", "CLOSED"]:
            raise GraphQLError("Invalid status")

        issue.status = status
        issue.save()
        IssueSubscription.broadcast_issue(issue)

        return UpdateIssueStatus(ok=True, issue=issue)

class AssignIssue(graphene.Mutation):
    class Arguments:
        issue_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    issue = graphene.Field(IssueType)

    @login_required
    def mutate(self, info, issue_id, user_id):
        user = get_user_model().objects.get(pk=user_id)
        issue = Issue.objects.get(pk=issue_id)
        issue.assigned_to = user
        issue.save()
        IssueSubscription.broadcast_issue(issue)

        return AssignIssue(ok=True, issue=issue)




class EnhanceDescription(graphene.Mutation):
    class Arguments:
        description = graphene.String(required=True)

    new_description = graphene.String()

    def mutate(self, info, description):
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_core.output_parsers import StrOutputParser

        prompt = """
            You are a helpful assistant designed to enhance rough, vague, or casually written issue ticket descriptions.

            When a user submits an unpolished or incomplete issue report, your role is to:

            Analyze the core problem and user intent.

            Clarify ambiguous statements or missing context.

            Identify key components such as:

            Problem summary

            Expected vs actual behavior

            Steps to reproduce (if available)

            Environment or system context

            Rewrite the issue in a clear, concise, and professional format, making it suitable for engineers, team members, or tracking systems.

            Preserve the original meaning and critical details, while improving clarity, structure, and tone.

        """

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt),
            ("human", "{description}")
        ])
        chain = prompt | llm | StrOutputParser()

        # Run the chain
        improved = chain.invoke({"description": description})

        return EnhanceDescription(new_description=improved.strip())


class InviteTeamMember(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        username = graphene.String(required=True)

    @login_required
    def mutate(self, info, username):
        try:
            user_to_invite = User.objects.get(username=username)
        except User.DoesNotExist:
            raise GraphQLError("User not found")

        # Here you could record the invitation logic
        return InviteTeamMember(ok=True)

class Mutation(graphene.ObjectType):
    create_issue = CreateIssue.Field()
    update_issue = UpdateIssue.Field()
    delete_issue = DeleteIssue.Field()
    update_issue_status = UpdateIssueStatus.Field()
    assign_issue = AssignIssue.Field()

    enhance_description = EnhanceDescription.Field()
    
    invite_team_member = InviteTeamMember.Field()

    # JWT Auth
    # token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    token_auth = CustomTokenAuth.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    verify_token = graphql_jwt.Verify.Field()
    register_user = RegisterUser.Field()
    create_user = CreateUser.Field()

class Subscription(graphene.ObjectType):
    issue_subscription = IssueSubscription.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)

# IssueSubscriptionConsumer.schema = schema
