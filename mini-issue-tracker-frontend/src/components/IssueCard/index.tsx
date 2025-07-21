// src/components/IssueCard/index.tsx

import React from "react";
import { Issue } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { GripVertical, Edit, Trash2, User2 } from "lucide-react";


const statusColors: Record<Issue["status"], string> = {
  OPEN: "bg-yellow-500",
  IN_PROGRESS: "bg-blue-500",
  CLOSED: "bg-green-500",
};

const IssueCard: React.FC<{
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
  onClick?: any
}> = ({ issue, onEdit, onDelete, onClick }) => {

  const { user: currentUser } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-4 relative max-h-[400px]">
      <div 
        className="flex justify-between items-start"
        onClick={onClick}
      >
        <div >
          <h2 className="text-lg font-semibold text-gray-800">{issue.title}</h2>
          <div className="overflow-y-hidden h-[250px]" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{issue.description}</div>
          {/* <p className="text-gray-600 text-sm mt-1">{issue.description}</p> */}
        </div>
        {/* <span className={`text-sm font-medium px-2 py-1 mt-8 rounded ${statusColors[issue.status]}`}>
          {issue.status.replace("_", " ")}
        </span> */}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Assigned to: {issue.assignedTo?.username || "N/A"}
      </div>

      <div className="flex justify-between items-center mt-2">
        <span
          className={`text-xs text-white px-2 py-1 rounded ${statusColors[issue.status]}`}
        >
          {issue.status.replace("_", " ")}
        </span>
        {issue.createdBy.id === currentUser.id && (
          <>
            <div className="gap-2">
              <button
                onClick={() => onEdit(issue)}
                className="text-blue-600 hover:text-blue-800 mx-1"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete((issue.id).toString())}
                className="text-red-600 hover:text-red-800 mx-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      
      
    </div>
  );
};

export default IssueCard;
