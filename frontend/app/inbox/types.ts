export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type InboxItem = {
  id: number;
  title: string;
  priority: Priority | null;
  createdAt: string;
  userId: number;
};