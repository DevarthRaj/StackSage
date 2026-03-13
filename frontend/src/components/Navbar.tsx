"use client";

import { useState } from "react";
import { Show, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { isLoaded } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-12">
                {/* Logo */}
                <Link 
                    href="/" 
                    className="text-xl font-bold tracking-tight text-zinc-100 focus-ring rounded-md -ml-2 px-2 py-1"
                    onClick={closeMenu}
                >
                    Stack<span className="text-emerald-400">Sage</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {!isLoaded ? (
                        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                    ) : (
                        <>
                            <Show when="signed-in">
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors focus-ring rounded-md px-2 py-1"
                                >
                                    Dashboard
                                </Link>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 ring-2 ring-emerald-500/30 hover:ring-emerald-500/60 transition-all focus-ring",
                                        },
                                    }}
                                />
                            </Show>

                            <Show when="signed-out">
                                <Link
                                    href="/sign-in"
                                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-400 focus-ring touch-target flex items-center"
                                >
                                    Sign In
                                </Link>
                            </Show>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="focus-ring touch-target flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-white/5 md:hidden"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/[0.06] bg-zinc-950 md:hidden"
                    >
                        <div className="mx-auto space-y-2 px-4 py-4">
                            {!isLoaded ? (
                                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                            ) : (
                                <>
                                    <Show when="signed-in">
                                        <Link
                                            href="/dashboard"
                                            onClick={closeMenu}
                                            className="block rounded-lg px-4 py-3 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-emerald-400"
                                        >
                                            Dashboard
                                        </Link>
                                        <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-4">
                                            <span className="text-sm text-zinc-500">Account</span>
                                        </div>
                                    </Show>

                                    <Show when="signed-out">
                                        <Link
                                            href="/sign-in"
                                            onClick={closeMenu}
                                            className="block rounded-lg border border-white/10 px-4 py-3 text-center text-base font-medium text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            onClick={closeMenu}
                                            className="mt-2 block rounded-lg bg-emerald-500 px-4 py-3 text-center text-base font-semibold text-black hover:bg-emerald-400"
                                        >
                                            Get Started
                                        </Link>
                                    </Show>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
