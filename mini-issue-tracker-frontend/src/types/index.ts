export interface User {
    id: number;
    username: string;
    email: string;
  }
  
  export interface Issue {
    id: number;
    title: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    priority: string;
    createdBy: User;
    assignedTo: User | null;
  }
  