// src/pages/Dashboard/index.tsx

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ISSUES } from "../../graphql/queries";
import { DELETE_ISSUE } from "../../graphql/mutations";
import CreateIssueModal from "../../components/CreateIssueModal";
import IssueCard from "../../components/IssueCard";
import KanbanBoard from "../../components/KanbanBoard";
import { Issue } from "../../types";
import { errorToast, successToast } from "../../store/toast/actions-creation";

const Dashboard = () => {
  const { data, loading, error, refetch } = useQuery(GET_ISSUES);
  const [deleteIssue] = useMutation(DELETE_ISSUE, {
    refetchQueries: [{ query: GET_ISSUES }],
  });

  const [filter, setFilter] = React.useState<"ALL" | "OPEN" | "IN_PROGRESS" | "CLOSED">("ALL");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingIssue, setEditingIssue] = React.useState<Issue | null>(null);
  const [showKanban, setShowKanban] = React.useState(false); // 🔁 Toggle for Kanban

  const filteredIssues = React.useMemo(() => {
    if (filter === "ALL") return data?.allIssues || [];
    return (data?.allIssues || []).filter((issue: Issue) => issue.status === filter);
  }, [data, filter]);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteIssue({ variables: { id } });
      if (data?.deleteIssue?.ok) {
        successToast({
          toast: true,
          message: "Issue deleted successfully",
        });
      } else {
        errorToast({
          toast: true,
          message: "Failed to delete issue",
        });
      }
    } catch (err) {
      errorToast({
        toast: true,
        message: "Something went wrong",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-700 text-white p-6">
          <h2 className="text-xl font-bold mb-6">Issue Tracker</h2>
          <nav>
            <ul className="space-y-4">
              <li className="hover:text-blue-200 cursor-pointer">Dashboard</li>
              <li className="hover:text-blue-200 cursor-pointer">Team</li>
              <li className="hover:text-blue-200 cursor-pointer">Settings</li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="space-x-2">
              <button
                onClick={() => setShowKanban(!showKanban)}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                {showKanban ? "List View" : "Kanban View"}
              </button>
              <button
                onClick={() => {
                  setEditingIssue(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Create Issue
              </button>
            </div>
          </div>

          {/* Filters */}
          {!showKanban && (
            <div className="flex space-x-4 mb-6">
              {["ALL", "OPEN", "IN_PROGRESS", "CLOSED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          )}

          {/* View Toggle */}
          {showKanban ? (
            <KanbanBoard
              issues={data?.allIssues || []}
              onEdit={(i) => {
                setEditingIssue(i);
                setShowCreateModal(true);
              }}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue: Issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onEdit={(i) => {
                    setEditingIssue(i);
                    setShowCreateModal(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateIssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialData={editingIssue}
      />
    </>
  );
};

export default Dashboard;
