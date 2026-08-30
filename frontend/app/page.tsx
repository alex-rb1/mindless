import Link from "next/link";
import LandingHero from "@/components/LandingHero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHero />
      
      {/* How it works section */}
      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              From thought to task
            </h2>

            <p className="mt-3 text-muted-foreground">
              Capture now. Organize when you're ready.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <p className="text-sm font-medium text-muted-foreground">01</p>
              <h3 className="mt-3 font-semibold">Capture</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quickly save thoughts, reminders, and things you need to do.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <p className="text-sm font-medium text-muted-foreground">02</p>
              <h3 className="mt-3 font-semibold">Process</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Turn inbox items into organized tasks with the details that matter.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <p className="text-sm font-medium text-muted-foreground">03</p>
              <h3 className="mt-3 font-semibold">Complete</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Keep track of your work and complete tasks without the mental clutter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}