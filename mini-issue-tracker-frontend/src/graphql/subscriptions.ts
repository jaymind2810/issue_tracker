import { gql } from '@apollo/client';

export const ISSUE_SUBSCRIPTION = gql`
  subscription {
    issueSubscribe {
      id
      title
      description
      status
      createdBy {
        id
        username
      }
      assignedTo {
        id
        username
      }
    }
  }
`;
