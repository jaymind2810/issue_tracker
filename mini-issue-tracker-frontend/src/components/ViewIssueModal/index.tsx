import React from "react";
import { Dialog } from "@headlessui/react";
import { Issue } from "../../types";

interface ViewIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
}

const ViewIssueModal: React.FC<ViewIssueModalProps> = ({ isOpen, onClose, issue }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded bg-white p-6 shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">View Issue</Dialog.Title>

          {issue && (
            <div className="space-y-4">
              <div>
                <strong>Title:</strong>
                <p>{issue.title}</p>
              </div>
              <div className="">
                <strong>Description:</strong>
                <p className="whitespace-pre-line overflow-y-scroll max-h-[400px]">{issue.description}</p>
              </div>
              <div>
                <strong>Status:</strong>
                <p>{issue.status.replace("_", " ")}</p>
              </div>
              <div>
                <strong>Created By:</strong>
                <p>{issue.createdBy?.username || "N/A"}</p>
              </div>
            </div>
          )}

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ViewIssueModal;
