"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cpu, FileCode2, GitBranch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Background } from "@/components/Background";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  const colors = [
    "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
    "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20", 
    "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20",
  ];
  
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-24px" }}
      className="group"
    >
      <Card variant="glass" className="h-full transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.06] hover:-translate-y-1">
        <div className={`mb-4 flex h-12 w-12 min-w-[48px] items-center justify-center rounded-xl transition-colors ${colors[index % colors.length]}`}>
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-zinc-100 truncate">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">{description}</p>
      </Card>
    </motion.div>
  );
}

const features = [
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Project Blueprint",
    description:
      "Get a complete, hardware-aware architecture plan with an interactive tech stack graph. Every tool is checked against your specs.",
  },
  {
    icon: <FileCode2 className="h-6 w-6" />,
    title: "Agent Prompt Generator",
    description:
      "Generate a comprehensive, copy-paste-ready prompt for Claude Code, Cursor, or any coding agent to build your project autonomously.",
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: "Repo-to-Text",
    description:
      "Convert any GitHub repo or local project into a single structured text blob, optimized for LLM context injection with token counting.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">

      <Background />

      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-16 text-center md:pt-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="mb-4 md:mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-400 md:px-4">
            RAG-Powered Project Planning
          </span>
          <h1 className="mt-4 font-bold leading-tight tracking-tight text-zinc-50 
            text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem]] 
            md:leading-[1.1] lg:leading-[1.05]">
            Plan any project with
            <br />
            <span className="text-amber-400">
              AI intelligence
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Input your idea and hardware specs. Get a full architecture
            blueprint, an agent-ready implementation prompt, and tools to
            maximize your AI workflow — all for free.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 md:mt-10 flex flex-col items-center gap-3 md:gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/sign-up">
            <Button size="lg">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="accent"
            size="lg"
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Learn more about StackSage features"
          >
            Learn More
          </Button>
        </motion.div>
      </main>

      {/* ── Features ──────────────────────────────────────────── */}
      <section
        id="features"
        className="relative z-10 mx-auto mt-20 px-6 pb-16 md:mt-28 md:max-w-5xl md:pb-24 lg:mt-32"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="mb-8 text-center text-2xl font-bold text-zinc-100 md:mb-12 md:text-3xl lg:text-4xl">
          Three tools, one platform
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-6 text-center">
        <p className="text-xs text-zinc-600">
          Built with Next.js · FastAPI · LangChain · Qdrant
        </p>
      </footer>

    </div>
  );
}