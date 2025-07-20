// src/components/IssueCard/index.tsx

import React from "react";
import { Issue } from "../../types";

const statusColors = {
  OPEN: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-red-100 text-red-800",
};

const IssueCard: React.FC<{
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
}> = ({ issue, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{issue.title}</h2>
          <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
        </div>
        <span className={`text-sm font-medium px-2 py-1 mt-8 rounded ${statusColors[issue.status]}`}>
          {issue.status.replace("_", " ")}
        </span>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Assigned to: {issue.assignedTo?.username || "N/A"}
      </div>

      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => onEdit(issue)}
          className="text-sm text-blue-500 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(issue.id.toString())}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default IssueCard;
