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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function startEditing(item: InboxItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditPriority(item.priority ?? "");
  }

  async function loadItems() {
    try {
    const response = await fetch("http://localhost:4000/inbox", {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data.error);
        setError(data.error);
        return;
    }

    setError("");
    setItems(data.items);
  } catch (error) {
    setError("Unable to load inbox items.");
  } finally {
    setLoading(false);
  }
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
        setError(data.error);
        return;
    }

    setError("");

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

    setError("");

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

  async function deleteItem(id: number) {
    const response = await fetch(`http://localhost:4000/inbox/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        setError(data.error);
        return;
    }

    setError("");

    setItems((currentItems) =>
        currentItems.filter((item) => item.id !== id)
    );
 }

return (
  <main className="mx-auto min-h-screen max-w-3xl p-6">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Capture it now. Organize it later.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="flex w-full flex-col gap-2 sm:flex-row"
      >
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
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Priority" />
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

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading inbox...
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="font-medium">Your inbox is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
                Capture something above to get started.
            </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border p-4"
            >
              {editingId === item.id ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <Select
                    value={editPriority}
                    onValueChange={(value) =>
                      setEditPriority(
                        value as "LOW" | "MEDIUM" | "HIGH"
                      )
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
                      setEditPriority("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <p className="font-medium">
                    {item.title}
                  </p>

                  {item.priority && (
                    <p className="text-sm text-muted-foreground">
                      {item.priority}
                    </p>
                  )}
                </>
              )}

              {editingId !== item.id && (
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEditing(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </main>
)};