import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    return (
        <div className="relative min-h-screen bg-zinc-950">
            {/* Same ambient orb — visual continuity across pages */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[128px]" />

            <Navbar />

            <main className="relative z-10 mx-auto max-w-5xl px-6 py-16">
                <h1 className="text-3xl font-bold text-zinc-100">
                    Welcome back,{" "}
                    <span className="text-emerald-400">
                        {user.firstName ?? user.emailAddresses[0].emailAddress}
                    </span>
                </h1>
                <p className="mt-2 text-zinc-500">
                    Phase 2 complete. Your workspace is ready.
                </p>

                {/* Placeholder cards for the 3 features — Phase 4/5/6 will fill these */}
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {["Project Blueprint", "Agent Prompt", "Repo to Text"].map((title) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
                        >
                            <h3 className="font-semibold text-zinc-300">{title}</h3>
                            <p className="mt-2 text-sm text-zinc-600">Coming in Phase 4–6</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}