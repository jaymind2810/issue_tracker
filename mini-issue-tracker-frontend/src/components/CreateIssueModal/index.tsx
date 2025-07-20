import React from "react";
import { Issue } from "../../types";
import { useMutation } from "@apollo/client";
import { CREATE_ISSUE, ENHANCE_DESCRIPTION, UPDATE_ISSUE } from "../../graphql/mutations";

const CreateIssueModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    initialData?: Issue | null;
  }> = ({ isOpen, onClose, initialData }) => {
    const [title, setTitle] = React.useState(initialData?.title || "");
    const [description, setDescription] = React.useState(initialData?.description || "");
    const [status, setStatus] = React.useState<any>(initialData?.status || "OPEN");
    const [priority, setPriority] = React.useState(initialData?.priority || "LOW");
    const [enhanceDescription] = useMutation(ENHANCE_DESCRIPTION);
    const [loadingAI, setLoadingAI] = React.useState(false);
  
    React.useEffect(() => {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setStatus(initialData.status);
        setPriority(initialData.priority);
      }
    }, [initialData]);
  
    const [createIssue] = useMutation(CREATE_ISSUE, {
      refetchQueries: ["GetAllIssues"], // replace with your actual query name
    });

    const [updateIssue] = useMutation(UPDATE_ISSUE, {
      refetchQueries: ["GetAllIssues"], // same here
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (initialData) {
        // Edit Mode
        await updateIssue({
          variables: {
            id: initialData.id,
            title,
            description,
            status,
            priority,
          },
        });
        onClose();
      } else {
        // Create Mode
        await createIssue({
          variables: {
            title,
            description,
            status,
            priority,
          },
        });
        onClose();
      }
  
      onClose();
    };

    const handleEnhance = async () => {
      setLoadingAI(true);
      try {
        const { data } = await enhanceDescription({ variables: { description } });
        if (data?.enhanceDescription?.newDescription) {
          setDescription(data.enhanceDescription.newDescription);
        }
      } catch (error) {
        console.error("AI enhancement failed:", error);
      }
      setLoadingAI(false);
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4"
        >
          <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Issue" : "Create Issue"}</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={10}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="button"
            onClick={handleEnhance}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loadingAI}
          >
            {loadingAI ? "Enhancing..." : "Enhance with AI"}
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {initialData ? "Update Issue" : "Create Issue"}
          </button>
          <button onClick={() => onClose()} className="bg-red-600 text-white px-4 py-2 mx-2 rounded">
            Cancel
          </button>
        </form>
      </div>
    );
  };
  
export default CreateIssueModal