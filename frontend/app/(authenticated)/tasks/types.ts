export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: Priority | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
};