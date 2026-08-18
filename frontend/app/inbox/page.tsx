"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function startEditing(item: InboxItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
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