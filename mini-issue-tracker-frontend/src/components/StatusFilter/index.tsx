// src/components/StatusFilter/index.tsx
import React from "react";

const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];

const StatusFilter = ({
  selected,
  onChange,
}: {
  selected: string | null;
  onChange: (status: any) => void;
}) => {
  return (
    <div className="flex gap-4">
      {statuses.map((status) => (
        <button
          key={status}
          className={`px-4 py-2 rounded ${
            selected === status ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onChange(selected === status ? null : status)}
        >
          {status.replace("_", " ")}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
