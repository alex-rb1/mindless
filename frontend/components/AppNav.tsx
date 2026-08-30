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
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <div className="flex items-center gap-6">
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
            onClick={handleLogout}
        >
            Logout
        </Button>
      </div>
    </nav>
  );
}