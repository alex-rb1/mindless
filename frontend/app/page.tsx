import Link from "next/link";
import LandingHero from "@/components/LandingHero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHero />

      {/* How it works section */}
      <section className="border-t bg-muted/30">
  <div className="mx-auto max-w-5xl px-6 py-24">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-muted-foreground">
        How it works
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        From thought to task
      </h2>

      <p className="mt-4 text-muted-foreground">
        Capture things quickly, organize them when you have time, and keep moving.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold">
          1
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          Capture
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Quickly save thoughts, reminders, and tasks before they slip your mind.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold">
          2
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          Process
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Turn inbox items into structured tasks with priorities and due dates.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold">
          3
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          Complete
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Keep track of what matters and finish tasks without mental clutter.
        </p>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}