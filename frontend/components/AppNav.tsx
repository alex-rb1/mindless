"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-4xl items-center gap-6 p-4">
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
    </nav>
  );
}