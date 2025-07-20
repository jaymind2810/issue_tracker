import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_ISSUE } from "../../graphql/mutations";
// import { UPDATE_ISSUE } from "../graphql/mutations";

interface EditIssueModalProps {
  issue: any;
  isOpen: boolean;
  onClose: () => void;
}

const EditIssueModal: React.FC<EditIssueModalProps> = ({ issue, isOpen, onClose }) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  const [updateIssue] = useMutation(UPDATE_ISSUE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateIssue({
      variables: {
        id: issue.id,
        title,
        description,
        status,
        priority,
      },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 w-[500px]"
      >
        <h2 className="text-xl font-bold mb-4">Edit Issue</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 mb-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2 mb-2"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border p-2 mb-2">
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border p-2 mb-4">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditIssueModal;
