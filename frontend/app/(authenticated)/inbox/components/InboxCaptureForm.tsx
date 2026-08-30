import type { FormEvent } from "react";

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

type InboxCaptureFormProps = {
  title: string;
  priority: Priority | "";

  onTitleChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

// Quick-capture form for adding new Inbox items
export default function InboxCaptureForm({
  title,
  priority,
  onTitleChange,
  onPriorityChange,
  onSubmit,
}: InboxCaptureFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-2 sm:flex-row"
    >
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="What's on your mind?"
      />

      <Select
        value={priority}
        onValueChange={(value) =>
          onPriorityChange(value as Priority)
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

      <Button 
        type="submit" 
        disabled={!title.trim()}
      >
        Add
      </Button>
    </form>
  );
}