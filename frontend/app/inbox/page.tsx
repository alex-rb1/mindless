"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InboxItem = {
  id: number;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | null;
  createdAt: string;
  userId: number;
};

export default function InboxPage() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<InboxItem[]>([]);
  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | ""
  >("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | ""
  >("");

  function startEditing(item: InboxItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditPriority(item.priority ?? "");
  }

  async function loadItems() {
    const response = await fetch("http://localhost:4000/inbox", {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data.error);
        return;
    }

    setItems(data.items);
  }

  async function saveEdit(id:number) {
    if (!editTitle.trim()) {
        return;
    }

    const response = await fetch (`http://localhost:4000/inbox/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            title: editTitle,
            priority: editPriority || null,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data.error);
        return;
    }

    setItems((currentItems) =>
        currentItems.map((item) =>
            item.id === id ? data.item : item
        )
    );

    setEditingId(null);
    setEditTitle("");
    setEditPriority("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
        return;
    }

    const response = await fetch("http://localhost:4000/inbox", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            title,
            ...(priority && { priority }),
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data.error);
        return;
    }

    setItems((currentItems) => [
        data.item,
        ...currentItems,
    ]);

    setTitle("");
    setPriority("");
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Capture it now. Organize it later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
          />

          <Select
            value={priority}
            onValueChange={(value) =>
                setPriority(value as "LOW" | "MEDIUM" | "HIGH")
            }
          >
            <SelectTrigger className="w-36">
                <SelectValue placeholder="Prioity" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit">
            Add
          </Button>
        </form>
        <div className="space-y-3">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="rounded-lg border p-4"
                >
                    {editingId === item.id ? (
                        <div className="flex gap-2">
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />

                            <Select
                                value={editPriority}
                                onValueChange={(value) =>
                                    setEditPriority(value as "LOW" | "MEDIUM" | "HIGH")
                                }
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                type="button"
                                onClick={() => saveEdit(item.id)}
                            >
                                Save
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditingId(null);
                                    setEditTitle("");
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                    <p className="font-medium">{item.title}</p>
                    )}

                    {item.priority && (
                        <p className="text-sm text-muted-foreground">
                            {item.priority}
                        </p>
                    )}

                    {editingId !== item.id && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => startEditing(item)}
                        >
                            Edit
                        </Button>
                    )}
                </div>
            ))}
        </div>
      </div>
    </main>
  );
}