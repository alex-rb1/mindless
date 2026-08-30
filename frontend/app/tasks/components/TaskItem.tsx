import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Priority, Task, TaskStatus } from "../types";

type TaskItemProps = {
  task: Task;

  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editDueDate: string;
  editPriority: Priority | "";
  editStatus: TaskStatus;

  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditDueDateChange: (value: string) => void;
  onEditPriorityChange: (value: Priority) => void;
  onEditStatusChange: (value: TaskStatus) => void;

  onStartEditing: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

// Displays a task and its editing UI
export default function TaskItem({
  task,
  isEditing,
  editTitle,
  editDescription,
  editDueDate,
  editPriority,
  editStatus,
  onEditTitleChange,
  onEditDescriptionChange,
  onEditDueDateChange,
  onEditPriorityChange,
  onEditStatusChange,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onComplete,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="rounded-lg border p-4">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            placeholder="Task title"
          />

          <Input
            value={editDescription}
            onChange={(e) => onEditDescriptionChange(e.target.value)}
            placeholder="Description"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="date"
              value={editDueDate}
              onChange={(e) => onEditDueDateChange(e.target.value)}
            />

            <Select
              value={editPriority}
              onValueChange={(value) =>
                onEditPriorityChange(value as Priority)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={editStatus}
              onValueChange={(value) =>
                onEditStatusChange(value as TaskStatus)
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">
                  In Progress
                </SelectItem>
                <SelectItem value="COMPLETED">
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSaveEdit}>Save</Button>

            <Button
              variant="outline"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-medium">{task.title}</h2>

          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{task.status}</span>

            {task.priority && (
              <span>{task.priority}</span>
            )}

            {task.dueDate && (
              <span>
                Due{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            {task.status !== "COMPLETED" && (
                <Button onClick={onComplete}>
                    Complete
                </Button>
            )}

            <Button
              variant="outline"
              onClick={onStartEditing}
            >
              Edit
            </Button>

            <Button
                variant="destructive"
                onClick={onDelete}
            >
                Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}