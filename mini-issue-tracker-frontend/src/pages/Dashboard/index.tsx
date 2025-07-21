// src/pages/Dashboard/index.tsx

import React, { useEffect } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_ISSUES } from "../../graphql/queries";
import { DELETE_ISSUE } from "../../graphql/mutations";
import CreateIssueModal from "../../components/CreateIssueModal";
import IssueCard from "../../components/IssueCard";
import KanbanBoard from "../../components/KanbanBoard";
import { Issue } from "../../types";
import { errorToast, successToast } from "../../store/toast/actions-creation";
import { useAuth } from "../../context/AuthContext";
import { GripVertical, Edit, Trash2, User2 } from "lucide-react";
import RealTimeIssueListener from "../../components/WebSocket";
import InviteTeamModal from "../../components/InviteTeamModal";
import { useDispatch } from "react-redux";
import ViewIssueModal from "../../components/ViewIssueModal";
import AssignUserModal from "../../components/AssignUserModal";
import { ISSUE_SUBSCRIPTION } from "../../graphql/subscriptions";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const { user: currentUser, logout } = useAuth();

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_ISSUES);
  const { data:socketData, loading:socketLoading } = useSubscription(ISSUE_SUBSCRIPTION);
  const [deleteIssue] = useMutation(DELETE_ISSUE, {
    refetchQueries: [{ query: GET_ISSUES }],
  });

  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [filter, setFilter] = React.useState<"ALL" | "OPEN" | "IN_PROGRESS" | "CLOSED" | "ASSIGNED_TO_ME">("ALL");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingIssue, setEditingIssue] = React.useState<Issue | null>(null);
  const [showKanban, setShowKanban] = React.useState(false); // 🔁 Toggle for Kanban
  const [showInviteModal, setShowInviteModal] = React.useState(false);

  const [viewingIssue, setViewingIssue] = React.useState<Issue | null>(null);
  const [showViewModal, setShowViewModal] = React.useState(false);

  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [assigningIssue, setAssigningIssue] = React.useState<Issue | null>(null);

  const filteredIssues = React.useMemo(() => {
    const source = issues;
  
    if (filter === "ALL") return source;
  
    if (filter === "ASSIGNED_TO_ME") {
      return source.filter((issue) => issue?.assignedTo?.id === currentUser?.id);
    }
  
    return source.filter((issue) => issue.status === filter);
  }, [issues, filter, currentUser]);

  useEffect(() => {
    if (socketData?.issueSubscription?.issue) {
      const updatedIssue = socketData.issueSubscription.issue;
  
      setIssues((prevIssues: Issue[]) => {
        const existing = prevIssues.find((i) => i.id === updatedIssue.id);
  
        // If issue already exists, update it
        if (existing) {
          return prevIssues.map((i) =>
            i.id === updatedIssue.id ? updatedIssue : i
          );
        }
  
        // Else, add the new issue to the top
        return [updatedIssue, ...prevIssues];
      });
    }
  }, [socketData]);

  React.useEffect(() => {
    if (data?.allIssues) {
      setIssues(data.allIssues);
    }
  }, [data]);

  React.useEffect(() => {
    if (data?.allIssues && issues.length === 0) {
      setIssues(data.allIssues);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteIssue({ variables: { id } });
      if (data?.deleteIssue?.ok) {
        dispatch(successToast({
          toast: true,
          message: "Issue deleted successfully",
        }));
      } else {
        dispatch(errorToast({
          toast: true,
          message: "Failed to delete issue",
        }));
      }
    } catch (err) {
      dispatch(errorToast({
        toast: true,
        message: "Something went wrong",
      }));
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center border-b-2 pb-6">
            <User2 className="w-7 h-7 rounded-lg p-1 mr-2 bg-blue-500" />
            {currentUser?.username}
          </h2>
          <h2 className="text-xl font-bold mb-6">Issue Tracker</h2>
          <nav>
            <ul className="space-y-4">
              <li 
                className="hover:text-blue-200 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >Dashboard</li>
              {/* <li className="hover:text-blue-200 cursor-pointer">Team</li> */}
              <li 
                className="hover:text-blue-200 cursor-pointer"
                onClick={() => setShowInviteModal(true)}
              >
                Invite Team Member
              </li>
              <li 
                className="hover:text-red-200 text-red-500 font-semibold cursor-pointer"
                onClick={() => logout()}
                >
                  Log out
              </li>
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
              {["ALL", "OPEN", "IN_PROGRESS", "CLOSED", "ASSIGNED_TO_ME"].map((status) => (
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
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="grid grid-cols-6 gap-4 px-6 py-4 font-bold border-b bg-gray-100 text-gray-700">
                <div>Title</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Assigned To</div>
                <div>Created By</div>
                <div>Actions</div>
              </div>

              {filteredIssues?.length === 0 && (
                <div className="py-4 font-semibold text-xl justify-center text-indigo-800 text-center">No data found.</div>
              )}

              {filteredIssues.map((issue: Issue) => (
                <div
                  key={issue.id}
                  className="grid grid-cols-6 gap-4 px-6 py-4 border-b hover:bg-gray-50 text-sm items-center"
                >
                  <div>{issue.title}</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        issue.status === "OPEN"
                          ? "bg-green-100 text-green-800"
                          : issue.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>
                  <div>{issue.priority}</div>
                  <div>{issue.assignedTo?.username || "Unassigned"}</div>
                  <div>{issue?.createdBy?.username}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setViewingIssue(issue);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    {(issue.createdBy.id === currentUser.id) && (
                      <>
                    <button
                      onClick={() => {
                        setEditingIssue(issue);
                        setShowCreateModal(true);
                      }}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setAssigningIssue(issue);
                        setAssignModalOpen(true);
                      }}
                      className="text-purple-600 hover:underline"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleDelete((issue?.id).toString())}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    </>
                    )}
                  </div>
                </div>
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

      <ViewIssueModal
        isOpen={showViewModal}
        onClose={() => {
          setViewingIssue(null);
          setShowViewModal(false);
        }}
        issue={viewingIssue}
      />

      {/* <RealTimeIssueListener
        onNewData={(updatedIssue: Issue) => {
          setIssues((prevIssues: Issue[]) => {
            const existing = prevIssues.find((i) => i.id === updatedIssue.id);
            const newIssues = existing
              ? prevIssues.map((i) => (i.id === updatedIssue.id ? updatedIssue : i))
              : [updatedIssue, ...prevIssues];

            // Optional sorting if needed
            return newIssues
          });
        }}
      /> */}

      <AssignUserModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        issue={assigningIssue}
      />

      <InviteTeamModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </>
  );
};

export default Dashboard;
