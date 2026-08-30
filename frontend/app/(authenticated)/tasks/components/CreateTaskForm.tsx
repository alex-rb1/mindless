import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Priority } from "../types";

type CreateTaskFormProps = {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority | "";

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;

  onCreate: () => void;
};

// Form for creating a task directly from the Tasks page
export default function CreateTaskForm({
  title,
  description,
  dueDate,
  priority,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onPriorityChange,
  onCreate,
}: CreateTaskFormProps) {
  return (
    <div className="mt-6 space-y-3 rounded-lg border p-4">
      <h2 className="font-medium">Create Task</h2>

      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Task title"
      />

      <Input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />

        <Select
          value={priority}
          onValueChange={(value) =>
            onPriorityChange(value as Priority)
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

        <Button onClick={onCreate}>
          Create Task
        </Button>
      </div>
    </div>
  );
}