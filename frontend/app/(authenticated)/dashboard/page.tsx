"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type InboxItem = {
    id: number;
    title: string;
};

type Task = {
    id: number;
    title: string;
    dueDate: string | null;
    status: "TODO" | "IN_PROGRESS" | "COMPLETED";
};

export default function DashboardPage() {
    const router = useRouter();
    
    const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        setError("");

        try {
            const [inboxResponse, tasksResponse] = await Promise.all([
                fetch("http://localhost:4000/inbox", {
                    credentials: "include",
                }),
                fetch("http://localhost:4000/tasks", {
                    credentials: "include",
                }),
            ]);

            if (
                inboxResponse.status === 401 ||
                tasksResponse.status === 401
            ) {
                router.replace("/login");
                return;
            }

            const [inboxData, tasksData] = await Promise.all([
                inboxResponse.json(),
                tasksResponse.json(),
            ]);

            if (!inboxResponse.ok || !tasksResponse.ok) {
                setError("Failed to load dashboard.");
                return;
            }

            setInboxItems(inboxData.items);
            setTasks(tasksData.tasks);
        } catch {
            setError("Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    const inboxCount = inboxItems.length;

    const activeTaskCount = tasks.filter(
        (task) => task.status !== "COMPLETED"
    ).length;

    const completedTaskCount = tasks.filter(
        (task) => task.status === "COMPLETED"
    ).length;

    const upcomingTasks = tasks
        .filter(
            (task) =>
                task.status !== "COMPLETED" &&
                task.dueDate !== null
        )
        .sort(
            (a, b) =>
                new Date(a.dueDate!).getTime() -
                new Date(b.dueDate!).getTime()
        )
        .slice(0, 5);
    
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <h1 className="text-2xl font-semibold">
                Dashboard
            </h1>

            <p className="mt-1 text-muted-foreground">
                An overview of your work.
            </p>

            <div className="mt-4 flex gap-2">
                <Link 
                    href="/inbox"
                    className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
                >
                    Go to Inbox
                </Link>

                <Link 
                    href="/tasks"
                    className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
                >
                    Go to Tasks
                </Link>
            </div>


            {error && (
                <p className="mt-4 text-sm text-red-500">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="mt-6 text-muted-foreground">
                    Loading dashboard...
                </p>
            ) : (
            <>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Inbox
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                            {inboxCount}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Active Tasks
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                            {activeTaskCount}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Completed Tasks
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                            {completedTaskCount}
                        </p>
                    </div>
                </div>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">
                        Upcoming Tasks
                    </h2>

                    {upcomingTasks.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            No upcoming tasks.
                        </p>
                    ) : (
                        <div className="mt-3 space-y-3">
                            {upcomingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-lg border p-4"
                                >
                                    <p className="font-medium">{task.title}</p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Due{" "}
                                        {new Date(task.dueDate!).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </>
            )}
        </main>
    );
}