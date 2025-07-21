// src/components/KanbanBoard/index.tsx

import React, { useEffect, useState } from "react";
import { Issue } from "../../types";
import { useMutation } from "@apollo/client";
import { UPDATE_ISSUE, UPDATE_ISSUE_STATUS } from "../../graphql/mutations";
import { GET_ISSUES } from "../../graphql/queries";
import { errorToast, successToast, warningToast } from "../../store/toast/actions-creation";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";

const STATUSES: ("OPEN" | "IN_PROGRESS" | "CLOSED")[] = [
  "OPEN",
  "IN_PROGRESS",
  "CLOSED",
];

interface KanbanBoardProps {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ issues: propIssues, onEdit, onDelete }) => {

  const { user: currentUser } = useAuth();

  const dispatch = useDispatch()

  const [localIssues, setLocalIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setLocalIssues(propIssues);
  }, [propIssues]);

  const [updateIssue] = useMutation(UPDATE_ISSUE_STATUS, {
    refetchQueries: [{ query: GET_ISSUES }],
  });

  const handleDragEnd = async (event: any) => {


    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const draggedIssue = localIssues.find((i) => i.id === active.id);
    
    const newStatus = over?.id;

    if (draggedIssue?.createdBy?.id !== currentUser?.id) {
      dispatch(warningToast({
        toast: true,
        message: "You have not allowed to move this ticket."
      }));
      return
    }

    if (!draggedIssue || !newStatus || draggedIssue.status === newStatus) return;

    setLocalIssues((prev) =>
      prev.map((issue) =>
        issue.id === draggedIssue.id ? { ...issue, status: newStatus } : issue
      )
    );

    

    // Server sync
    try {
      await updateIssue({
        variables: {
          id: draggedIssue.id,
          status: newStatus,
        },
      });
      dispatch(successToast({
        toast: true,
        message: "Updated issue status."
      }));
    } catch (err) {
      dispatch(errorToast({
        toast: true,
        message: "Failed to update issue status"
      }));
      // Optional: rollback local state if needed
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUSES.map((status) => (
          <SortableContext
            key={status}
            items={localIssues.filter((i) => i.status === status)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              key={status}
              status={status}
              issues={localIssues.filter((i) => i.status === status)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
