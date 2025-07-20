import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Issue } from "../../../types";
import IssueCard from "../../IssueCard";
import IssueCardNew from "../IssueCardNew";
// import { Issue } from "../../types";
// import IssueCard from "../IssueCard";

type KanbanColumnProps = {
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
};

const statusTitleMap: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  issues,
  onEdit,
  onDelete,
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-md shadow min-h-[400px] flex-1"
    >
      <h2 className="text-lg font-semibold mb-4">{statusTitleMap[status]}</h2>
      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueCardNew
            key={issue.id}
            issue={issue}
            onEdit={onEdit}
            onDelete={onDelete}
            draggable
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
