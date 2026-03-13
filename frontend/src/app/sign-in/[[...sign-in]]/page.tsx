import { SignIn } from "@clerk/nextjs";
import { Background } from "@/components/Background";

export default function SignInPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
            <Background variant="minimal" />

            <SignIn
                forceRedirectUrl="/dashboard"
                appearance={{
                    variables: {
                        colorBackground: "oklch(0.145 0 0)",
                        colorInputBackground: "oklch(0.205 0 0)",
                        colorInputText: "oklch(0.985 0 0)",
                        colorText: "oklch(0.985 0 0)",
                        colorTextSecondary: "oklch(0.708 0 0)",
                        colorPrimary: "oklch(0.723 0.219 149.214)",
                        colorDanger: "oklch(0.704 0.191 22.216)",
                        borderRadius: "0.75rem",
                        fontFamily: "inherit",
                    },
                    elements: {
                        card: "border border-white/[0.08] shadow-2xl shadow-black/60 bg-zinc-950",
                        headerTitle: "text-zinc-100 font-bold",
                        headerSubtitle: "text-zinc-400",
                        formFieldInput:
                            "border-white/10 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20",
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