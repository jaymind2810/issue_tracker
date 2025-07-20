import graphene
from graphene_django import DjangoObjectType
from .models import Issue
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphql import GraphQLError
from .utils import enhance_description
import graphql_jwt
# from graphql_auth import mutations
from graphql import GraphQLError
from django.contrib.auth.models import User

User = get_user_model()

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")


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

class IssueType(DjangoObjectType):
    class Meta:
        model = Issue
        fields = "__all__"

class Query(graphene.ObjectType):
    all_issues = graphene.List(IssueType, status=IssueStatusEnum())
    my_issues = graphene.List(IssueType)
    issue_status_enum = graphene.List(IssueStatusEnum)

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


class IssueInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    assigned_to_id = graphene.Int()
    priority = graphene.String()
    tags = graphene.String()

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

        if status not in ["TODO", "IN_PROGRESS", "DONE"]:
            raise GraphQLError("Invalid status")

        issue.status = status
        issue.save()
        return UpdateIssueStatus(ok=True, issue=issue)



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
    
    invite_team_member = InviteTeamMember.Field()

    # JWT Auth
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    register_user = RegisterUser.Field()
    create_user = CreateUser.Field()
