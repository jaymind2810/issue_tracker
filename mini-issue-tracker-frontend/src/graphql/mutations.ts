import { gql } from "@apollo/client";

export const CREATE_ISSUE = gql`
  mutation CreateIssue(
    $title: String!
    $description: String!
    $status: String
    $priority: String
  ) {
    createIssue(
      title: $title
      description: $description
      status: $status
      priority: $priority
    ) {
      issue {
        id
        title
        description
        status
        priority
        createdBy {
          id
          username
        }
      }
    }
  }
`;

export const UPDATE_ISSUE = gql`
  mutation UpdateIssue($id: ID!, $title: String, $description: String, $status: String, $priority: String) {
    updateIssue(id: $id, title: $title, description: $description, status: $status, priority: $priority) {
      issue {
        id
        title
        description
        status
        priority
        assignedTo {
          id
          username
        }
      }
    }
  }
`;

export const DELETE_ISSUE = gql`
  mutation DeleteIssue($id: ID!) {
    deleteIssue(id: $id) {
        ok
        message
        deletedId
    }
  }
`;


export const UPDATE_ISSUE_STATUS = gql`
  mutation UpdateIssueStatus($id: ID!, $status: String!) {
    updateIssueStatus(id: $id, status: $status) {
      ok
      issue {
        id
        status
      }
    }
  }
`;

export const ENHANCE_DESCRIPTION = gql`
  mutation EnhanceDescription($description: String!) {
    enhanceDescription(description: $description) {
      newDescription
    }
  }
`;


export const INVITE_TEAM_MEMBER = gql`
  mutation InviteTeamMember($username: String!) {
    inviteTeamMember(username: $username) {
      ok
    }
  }
`;

export const ASSIGN_ISSUE = gql`
  mutation AssignIssue($issueId: ID!, $userId: ID!) {
    assignIssue(issueId: $issueId, userId: $userId) {
      ok
      issue {
        id
        assignedTo {
          id
          username
        }
      }
    }
  }
`;