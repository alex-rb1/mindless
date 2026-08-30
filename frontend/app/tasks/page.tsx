"use client";

import CreateTaskForm from "./components/CreateTaskForm";
import TaskItem from "./components/TaskItem";

import { useEffect, useState } from "react";
import type { Priority, Task, TaskStatus } from "./types";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState<Priority | "">("");

    // Task editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDueDate, setEditDueDate] = useState("");
    const [editPriority, setEditPriority] = useState<Priority | "">("");
    const [editStatus, setEditStatus] = useState<TaskStatus>("TODO");

    function startEditing(task: Task) {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description ?? "");
        setEditDueDate(
            task.dueDate ? task.dueDate.split("T")[0] : ""
        );
        setEditPriority(task.priority ?? "");
        setEditStatus(task.status);
    }

    async function saveEdit(id: number) {
        setError("");

        try {
            const response = await fetch(
                `http://localhost:4000/tasks/${id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: editTitle,
                        description: editDescription,
                        dueDate: editDueDate || null,
                        priority: editPriority || null,
                        status: editStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to update task.");
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === id ? data.task : task
                )
            );

            setEditingId(null);
        } catch {
            setError("Failed to update task.");
        }
    }

    async function loadTasks() {
    try {
        const response = await fetch("http://localhost:4000/tasks", {
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error || "Failed to load tasks.");
            return;
        }

        setTasks(data.tasks);
        } catch {
            setError("Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateTask() {
        setError("");

        try {
            const response = await fetch("http://localhost:4000/tasks", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    ...(dueDate && { dueDate }),
                    ...(priority && { priority }),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create task.");
                return;
            }

            setTasks((currentTasks) => [
                data.task,
                ...currentTasks,
            ]);

            setTitle("");
            setDescription("");
            setDueDate("");
            setPriority("");
        } catch {
            setError("Failed to create task.");
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);
  
    return (
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="text-2xl font-semibold">Tasks</h1>

            <CreateTaskForm
                title={title}
                description={description}
                dueDate={dueDate}
                priority={priority}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onDueDateChange={setDueDate}
                onPriorityChange={setPriority}
                onCreate={handleCreateTask}
            />

        {error && (
            <p className="mt-4 text-sm text-red-500">
                {error}
            </p>
        )}

        {loading ? (
            <p className="mt-4 text-muted-foreground">
                Loading tasks...
            </p>
        ) : tasks.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
                No tasks yet.
            </p>
        ) : (
            <div className="mt-6 space-y-3">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}

                        isEditing={editingId === task.id}
                        editTitle={editTitle}
                        editDescription={editDescription}
                        editDueDate={editDueDate}
                        editPriority={editPriority}
                        editStatus={editStatus}

                        onEditTitleChange={setEditTitle}
                        onEditDescriptionChange={setEditDescription}
                        onEditDueDateChange={setEditDueDate}
                        onEditPriorityChange={setEditPriority}
                        onEditStatusChange={setEditStatus}

                        onStartEditing={() => startEditing(task)}
                        onSaveEdit={() => saveEdit(task.id)}
                        onCancelEdit={() => setEditingId(null)}
                    />
                ))}
            </div>
            )}
        </main>
    );
}