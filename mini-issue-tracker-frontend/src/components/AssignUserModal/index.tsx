// src/components/AssignUserModal/index.tsx

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Dialog } from "@headlessui/react";
import { GET_USERS } from "../../graphql/queries";
import { ASSIGN_ISSUE } from "../../graphql/mutations";
import { Issue } from "../../types";

type AssignUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
};

const AssignUserModal: React.FC<AssignUserModalProps> = ({ isOpen, onClose, issue }) => {
  const { data: usersData, loading } = useQuery(GET_USERS);
  const [assignIssue, { loading: assigning }] = useMutation(ASSIGN_ISSUE);

  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  React.useEffect(() => {
    if (issue?.assignedTo?.id) {
      setSelectedUserId((issue.assignedTo.id)?.toString());
    }
  }, [issue]);

  const handleAssign = async () => {
    try {
      await assignIssue({
        variables: {
          issueId: issue?.id,
          userId: selectedUserId,
        },
      });
      onClose();
    } catch (err) {
      console.error("Error assigning user:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">Assign User</Dialog.Title>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select a user</option>
              {usersData?.users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={!selectedUserId || assigning}
            >
              Assign
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AssignUserModal;
