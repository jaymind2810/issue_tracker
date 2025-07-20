import React from "react";
import { useDraggable } from "@dnd-kit/core";
// import { Issue } from "../../types";
import { GripVertical, Edit, Trash2 } from "lucide-react";
import { Issue } from "../../../types";

type IssueCardNewProps = {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
};

const statusColorMap: Record<Issue["status"], string> = {
  OPEN: "bg-yellow-500",
  IN_PROGRESS: "bg-blue-500",
  CLOSED: "bg-green-500",
};

const IssueCardNew: React.FC<IssueCardNewProps> = ({
  issue,
  onEdit,
  onDelete,
  draggable = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    data: { issue },
    disabled: !draggable,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: draggable ? "grab" : "default",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-md shadow-md flex flex-col gap-2 border border-gray-200 relative"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-gray-800">{issue.title}</h3>
        {draggable && <GripVertical className="w-4 h-4 text-gray-400" />}
      </div>

      <p className="text-gray-600 text-sm">{issue.description}</p>

      <div className="flex justify-between items-center mt-2">
        <span
          className={`text-xs text-white px-2 py-1 rounded ${statusColorMap[issue.status]}`}
        >
          {issue.status.replace("_", " ")}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(issue)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete((issue.id).toString())}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCardNew;
