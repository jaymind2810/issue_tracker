import { gql } from '@apollo/client';

export const ISSUE_SUBSCRIPTION = gql`
  subscription OnIssueUpdated {
    issueSubscription {
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
        assignedTo {
          id
          username
        }
        createdAt
        # remove updatedAt if not available
      }
    }
  }
`;
