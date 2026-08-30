"use client";

import ProcessTaskDialog from "./components/ProcessTaskDialog";
import InboxCaptureForm from "./components/InboxCaptureForm";
import InboxItemCard from "./components/InboxItem"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
import type { InboxItem, Priority } from "./types";

export default function InboxPage() {
  const router = useRouter();
  // Page state
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

  const [processingItem, setProcessingItem] =
    useState<InboxItem | null>(null);

  const [processTitle, setProcessTitle] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [processDueDate, setProcessDueDate] = useState("");
  const [processPriority, setProcessPriority] =
    useState<Priority | "">("");

  // Editing / processing setup
  function startEditing(item: InboxItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditPriority(item.priority ?? "");
  }

  function startProcessing(item: InboxItem) {
    setProcessingItem(item);

    setProcessTitle(item.title);
    setProcessDescription("");
    setProcessDueDate("");
    setProcessPriority(item.priority ?? "");
  }

  // Inbox API handlers
  async function loadItems() {
    try {
    const response = await fetch(`${API_URL}/inbox`, {
        credentials: "include",
    });

    if (response.status === 401) {
      router.replace("/login");
      return;
    }

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

    const response = await fetch(`${API_URL}/inbox/${id}`, {
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

    const response = await fetch(`${API_URL}/inbox`, {
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
  
  // Initial data load
  useEffect(() => {
    loadItems();
  }, []);

  async function deleteItem(id: number) {
    const response = await fetch(`${API_URL}/inbox/${id}`, {
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

 async function handleProcessItem() {
  if (!processingItem) return;

  setError("");

  try {
    const response = await fetch(
      `${API_URL}/tasks/process/${processingItem.id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: processTitle,
          description: processDescription,
          ...(processDueDate && { dueDate: processDueDate }),
          ...(processPriority && { priority: processPriority }),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to process inbox item.");
      return;
    }

    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== processingItem.id
      )
    );

    setProcessingItem(null);
  } catch {
    setError("Failed to process inbox item.");
  }
}

// Render
return (
  <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Capture it now. Organize it later.
        </p>
      </div>

      <InboxCaptureForm
        title={title}
        priority={priority}
        onTitleChange={setTitle}
        onPriorityChange={setPriority}
        onSubmit={handleSubmit}
      />

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading inbox...
          </p>
        </div>
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
            <InboxItemCard
              key={item.id}
              item={item}

              isEditing={editingId === item.id}
              editTitle={editTitle}
              editPriority={editPriority}

              onEditTitleChange={setEditTitle}
              onEditPriorityChange={setEditPriority}

              onStartProcessing={() => startProcessing(item)}
              onStartEditing={() => startEditing(item)}
              onSaveEdit={() => saveEdit(item.id)}

              onCancelEdit={() => {
                setEditingId(null);
                setEditTitle("");
                setEditPriority("");
              }}

              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
    <ProcessTaskDialog
      open={processingItem !== null}
      title={processTitle}
      description={processDescription}
      dueDate={processDueDate}
      priority={processPriority}
      onTitleChange={setProcessTitle}
      onDescriptionChange={setProcessDescription}
      onDueDateChange={setProcessDueDate}
      onPriorityChange={setProcessPriority}
      onCancel={() => setProcessingItem(null)}
      onCreate={handleProcessItem}
    />
  </main>
)};