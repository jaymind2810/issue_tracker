import { gql } from "@apollo/client";

export const GET_ISSUES = gql`
  query GetAllIssues {
    allIssues {
      id
      title
      description
      status
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
