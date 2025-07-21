from graphene_django import DjangoObjectType
from .models import Issue


class IssueType(DjangoObjectType):
    class Meta:
        model = Issue
        fields = "__all__" 