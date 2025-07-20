// src/components/IssueCard/index.tsx

import React from "react";
import { Issue } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { GripVertical, Edit, Trash2 } from "lucide-react";


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

  const { user: currentUser } = useAuth();

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

      {issue.createdBy.id === currentUser.id && (
        <>
          <div className="gap-2 mt-2">
            <button
              onClick={() => onEdit(issue)}
              className="text-blue-600 hover:text-blue-800 mx-2"
            >
              <Edit className="w-6 h-6" />
            </button>
            <button
              onClick={() => onDelete((issue.id).toString())}
              className="text-red-600 hover:text-red-800 mx-2"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
      
    </div>
  );
};

export default IssueCard;
