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
                    <p className="font-medium">{item.title}</p>

                    {item.priority && (
                        <p className="text-sm text-muted-foreground">
                            {item.priority}
                        </p>
                    )}
                </div>
            ))}
        </div>
      </div>
    </main>
  );
}