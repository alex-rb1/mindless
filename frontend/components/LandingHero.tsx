"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LandingHero() {
    const phrases = ["Capture now.", "Think later."];

    const [phraseIndex, setPhraseIndex] = useState(0);
    const [text, setText] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const phrase = phrases[phraseIndex];
    
        const timeout = setTimeout(
            () => {
                if (!deleting) {
                    const nextText = phrase.slice(0, text.length + 1);
                    setText(nextText);

                    if (nextText === phrase) {
                        setTimeout(() => setDeleting(true), 1200);
                    }
                } else {
                  const nextText = phrase.slice(0, text.length - 1);
                  setText(nextText);

                    if (nextText === "") {
                        setDeleting(false);
                        setPhraseIndex((current) => (current + 1) % phrases.length);
                    }
                }
            },
            deleting ? 50 : 90
        );

        return () => clearTimeout(timeout);
    }, [text, deleting, phraseIndex]);
  
    return (
    <section className="relative min-h-[700px] overflow-hidden">
    <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted/60 blur-3xl" />
    </div>

    <div className="mx-auto max-w-7xl px-6">

      <div className="grid min-h-[700px] items-center gap-12 lg:grid-cols-2">
        
        {/* Hero content */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-5 text-sm font-medium"
        >
          <p className="mb-5 text-sm font-medium">
            Simple task capture. Less mental clutter.
          </p>
        
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Mindless
            <br />

            <span className="text-muted-foreground">
                {text}
                <span className="animate-pulse">|</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
          >
            Mindless helps you capture thoughts instantly and turn them into
            organized tasks when you're ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex gap-3"
          >
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium"
            >
              Log In
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block [perspective:1200px]"
        >
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="overflow-hidden rounded-xl border bg-background shadow-2xl"
            >
                <Image
                    src="/dashboard.png"
                    alt="Mindless dashboard"
                    width={1400}
                    height={900}
                    priority
                    className="w-full"
                />
            </motion.div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}