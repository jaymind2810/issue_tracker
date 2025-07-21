import React, { useState } from "react";
import { useMutation } from "@apollo/client";
// import { INVITE_TEAM_MEMBER } from "../../graphql/mutations";
import { successToast, errorToast } from "../../store/toast/actions-creation";
import { INVITE_TEAM_MEMBER } from "../../graphql/mutations";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteTeamModal: React.FC<InviteTeamModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [inviteMember, { loading }] = useMutation(INVITE_TEAM_MEMBER);

  const handleInvite = async () => {
    try {
      const { data } = await inviteMember({ variables: { username } });

      if (data?.inviteTeamMember?.ok) {
        successToast({ toast: true, message: "Team member invited successfully!" });
        onClose();
        setUsername("");
      } else {
        errorToast({ toast: true, message: "Failed to invite user." });
      }
    } catch (error: any) {
      errorToast({ toast: true, message: error.message || "Something went wrong." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;
