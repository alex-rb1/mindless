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

type InboxItemData = {
  id: number;
  title: string;
  priority: Priority | null;
};

type InboxItemProps = {
  item: InboxItemData;

  isEditing: boolean;
  editTitle: string;
  editPriority: Priority | "";

  onEditTitleChange: (value: string) => void;
  onEditPriorityChange: (value: Priority) => void;

  onStartProcessing: () => void;
  onStartEditing: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

// Displays one Inbox item and its edit/actions UI
export default function InboxItem({
  item,
  isEditing,
  editTitle,
  editPriority,
  onEditTitleChange,
  onEditPriorityChange,
  onStartProcessing,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: InboxItemProps) {
  return (
    <div className="rounded-lg border p-4">
      {isEditing ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
          />

          <Select
            value={editPriority}
            onValueChange={(value) =>
              onEditPriorityChange(value as Priority)
            }
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>

          <Button type="button" onClick={onSaveEdit} disabled={!editTitle.trim()}>
            Save
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <p className="font-medium">{item.title}</p>

          {item.priority && (
            <p className="text-sm text-muted-foreground">
              {item.priority}
            </p>
          )}

          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={onStartProcessing}>
              Process
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onStartEditing}
            >
              Edit
            </Button>

            <Button
              type="button"
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