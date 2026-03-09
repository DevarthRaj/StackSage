import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">

            {/* Same ambient orb as landing page — visual continuity */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[128px]" />

            <SignIn
                forceRedirectUrl="/dashboard"
                appearance={{
                    variables: {
                        // Base colors — maps to your zinc-950 / emerald palette
                        colorBackground: "#09090b",        // zinc-950
                        colorInputBackground: "#18181b",   // zinc-900
                        colorInputText: "#f4f4f5",         // zinc-100
                        colorText: "#f4f4f5",
                        colorTextSecondary: "#a1a1aa",     // zinc-400
                        colorPrimary: "#10b981",           // emerald-500
                        colorDanger: "#f87171",            // red-400
                        borderRadius: "0.75rem",           // rounded-xl
                        fontFamily: "inherit",
                    },
                    elements: {
                        // Outer card
                        card: "border border-white/[0.08] shadow-2xl shadow-black/60 bg-zinc-950",
                        // Header text
                        headerTitle: "text-zinc-100 font-bold",
                        headerSubtitle: "text-zinc-400",
                        // Input fields
                        formFieldInput:
                            "border-white/10 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20",
                        formFieldLabel: "text-zinc-300 text-sm",
                        // Primary action button
                        formButtonPrimary:
                            "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors",
                        // Social OAuth buttons
                        socialButtonsBlockButton:
                            "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition-all",
                        socialButtonsBlockButtonText: "text-zinc-300",
                        // Divider
                        dividerLine: "bg-white/10",
                        dividerText: "text-zinc-500",
                        // Footer links
                        footerActionLink: "text-emerald-400 hover:text-emerald-300",
                        footerActionText: "text-zinc-500",
                        // Error messages
                        formFieldErrorText: "text-red-400",
                        alertText: "text-red-400",
                        // "Secured by Clerk" badge — subtle
                        footer: "opacity-40 hover:opacity-60 transition-opacity",
                    },
                }}
            />
        </main>
    );
}