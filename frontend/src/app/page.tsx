"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cpu, FileCode2, GitBranch } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.06]"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </motion.div>
  );
}

export default function Home() {
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[128px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[96px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <span className="text-xl font-bold tracking-tight text-zinc-100">
          Stack<span className="text-emerald-400">Sage</span>
        </span>
        <a
          href="/sign-in"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
        >
          Sign In
        </a>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-400">
            RAG-Powered Project Planning
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-zinc-50 md:text-6xl md:leading-[1.1]">
            Plan any project with
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI intelligence
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Input your idea and hardware specs. Get a full architecture
            blueprint, an agent-ready implementation prompt, and tools to
            maximize your AI workflow — all for free.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="/sign-up"
            id="cta-get-started"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-zinc-100"
          >
            Learn More
          </a>
        </motion.div>
      </main>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 mx-auto mt-32 max-w-5xl px-6 pb-24"
      >
        <h2 className="mb-12 text-center text-2xl font-bold text-zinc-100 md:text-3xl">
          Three tools, one platform
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
