// Dialog Component JSX

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Priority } from "../types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProcessTaskDialogProps = {
  open: boolean;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority | "";

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;

  onCancel: () => void;
  onCreate: () => void;
};

export default function ProcessTaskDialog({
  open,
  title,
  description,
  dueDate,
  priority,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onPriorityChange,
  onCancel,
  onCreate,
}: ProcessTaskDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process into Task</DialogTitle>
          <DialogDescription>
            Add any details before converting this inbox item into a task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onCreate}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}