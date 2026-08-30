"use client";

import CreateTaskForm from "./components/CreateTaskForm";
import TaskItem from "./components/TaskItem";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Priority, Task, TaskStatus } from "./types";

export default function TasksPage() {
    const router = useRouter();
    
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

    async function completeTask(id: number) {
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
                        status: "COMPLETED",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to complete task.");
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === id ? data.task : task
                )
            );
        } catch {
            setError("Failed to complete task.");
        }
    }

    async function deleteTask(id: number) {
        setError("");

        try {
            const response = await fetch(
                 `http://localhost:4000/tasks/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to delete task.");
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== id)
            );
        } catch {
            setError("Failed to delete task.")
        }
    }

    async function loadTasks() {
    try {
        const response = await fetch("http://localhost:4000/tasks", {
            credentials: "include",
        });

        if (response.status === 401) {
            router.replace("/login");
            return;
        }

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
  
    const activeTasks = tasks.filter(
        (task) => task.status !== "COMPLETED"
    );

    const completedTasks = tasks.filter(
        (task) => task.status === "COMPLETED"
    );

    function renderTask(task: Task) {
        return (
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
                onComplete={() => completeTask(task.id)}
                onDelete={() => deleteTask(task.id)}
            />
        );
    }

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
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
            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Loading tasks...
                </p>
            </div>
        ) : tasks.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No tasks yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Create a task above or process an item from your inbox.
                </p>
            </div>
        ) : (
            <div className="mt-6 space-y-8">
                <section>
                    <h2 className="mb-3 text-lg font-semibold">
                        Active Tasks
                    </h2>

                    <div className="space-y-3">
                        {activeTasks.map(renderTask)}
                     </div>
                </section>

                {/* Completed Tasks Section*/}
                {completedTasks.length > 0 && (
                    <section>
                        <h2 className="mb-3 text-lg font-semibold">
                            Completed Tasks
                        </h2>

                        <div className="space-y-3">
                            {completedTasks.map(renderTask)}
                        </div>
                    </section>
                )}
            </div>
            )}
        </main>
    );
}