import { useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";
import { Issue } from "../../types";

const ISSUE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    issueUpdated {
      id
      title
      description
      status
      createdBy {
        id
        username
      }
    }
  }
`;

const RealTimeIssueListener = ({
  onNewData,
}: {
  onNewData: (issue: Issue) => void;
}) => {
  const { data, error } = useSubscription(ISSUE_UPDATED_SUBSCRIPTION);

  useEffect(() => {
    if (data?.issueUpdated) {
      onNewData(data.issueUpdated);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Subscription error:", error);
    }
  }, [error]);

  return null;
};

export default RealTimeIssueListener;