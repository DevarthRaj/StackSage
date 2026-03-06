"use client";

import { Show, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
    const { isLoaded } = useAuth();

    return (
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-md">
            {/* Logo — matches page.tsx style exactly */}
            <Link href="/" className="text-xl font-bold tracking-tight text-zinc-100">
                Stack<span className="text-emerald-400">Sage</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {!isLoaded ? (
                    // Skeleton placeholder while Clerk loads — prevents layout shift
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                ) : (
                    <>
                        <Show when="signed-in">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8 ring-2 ring-emerald-500/30 hover:ring-emerald-500/60 transition-all",
                                    },
                                }}
                            />
                        </Show>

                        <Show when="signed-out">
                            <Link
                                href="/sign-in"
                                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                            >
                                Sign In
                            </Link>
                        </Show>
                    </>
                )}
            </div>
        </nav>
    );
}