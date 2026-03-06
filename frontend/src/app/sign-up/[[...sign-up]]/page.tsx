import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">

            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[128px]" />

            <SignUp
                forceRedirectUrl="/dashboard"
                appearance={{
                    variables: {
                        colorBackground: "#09090b",
                        colorInputBackground: "#18181b",
                        colorInputText: "#f4f4f5",
                        colorText: "#f4f4f5",
                        colorTextSecondary: "#a1a1aa",
                        colorPrimary: "#10b981",
                        colorDanger: "#f87171",
                        borderRadius: "0.75rem",
                        fontFamily: "inherit",
                    },
                    elements: {
                        card: "border border-white/[0.08] shadow-2xl shadow-black/60 bg-zinc-950",
                        headerTitle: "text-zinc-100 font-bold",
                        headerSubtitle: "text-zinc-400",
                        formFieldInput:
                            "border-white/10 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20",
                        formFieldLabel: "text-zinc-300 text-sm",
                        formButtonPrimary:
                            "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors",
                        socialButtonsBlockButton:
                            "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition-all",
                        socialButtonsBlockButtonText: "text-zinc-300",
                        dividerLine: "bg-white/10",
                        dividerText: "text-zinc-500",
                        footerActionLink: "text-emerald-400 hover:text-emerald-300",
                        footerActionText: "text-zinc-500",
                        formFieldErrorText: "text-red-400",
                        alertText: "text-red-400",
                        footer: "opacity-40 hover:opacity-60 transition-opacity",
                    },
                }}
            />
        </main>
    );
}