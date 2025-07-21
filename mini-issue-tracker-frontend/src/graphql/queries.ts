import { gql } from "@apollo/client";

export const GET_ISSUES = gql`
  query GetAllIssues {
    allIssues {
      id
      title
      description
      status
      priority
      assignedTo {
        id
        username
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
    }
  }
`;