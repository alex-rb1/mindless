"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    router.push("/login");
  }

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
        <Link
            href="/dashboard"
            className={
                pathname === "/dashboard"
                ? "font-semibold"
                : "text-muted-foreground"
            }
        >
            Dashboard
        </Link>

        <Link
          href="/inbox"
          className={
            pathname === "/inbox"
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          Inbox
        </Link>

        <Link
          href="/tasks"
          className={
            pathname === "/tasks"
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          Tasks
        </Link>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
        >
            Logout
        </Button>
      </div>
    </nav>
  );
}