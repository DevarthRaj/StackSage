import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { Background } from "@/components/Background";

function getDisplayName(user: { firstName?: string | null; emailAddresses: { emailAddress: string }[] }): string {
    const firstName = user.firstName;
    const email = user.emailAddresses[0]?.emailAddress;
    
    if (firstName && firstName.trim().length > 0) {
        return firstName;
    }
    
    if (email) {
        return email.split('@')[0];
    }
    
    return "User";
}

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const displayName = getDisplayName(user);

    return (
        <div className="relative min-h-screen bg-zinc-950">
            <Background variant="minimal" />

            <Navbar />

            <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14 lg:py-16">
                <h1 className="text-2xl font-bold text-zinc-100 md:text-3xl lg:text-4xl">
                    Welcome back,{" "}
                    <span className="text-emerald-400 truncate max-w-[150px] md:max-w-[200px] lg:max-w-[250px] inline-block align-bottom">
                        {displayName}
                    </span>
                </h1>
                <p className="mt-2 text-base text-zinc-500 md:text-lg">
                    Your workspace is ready. Choose a tool to get started.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3">
                    {[
                        { 
                            title: "Project Blueprint", 
                            description: "Generate hardware-aware architecture plans with interactive tech stack graphs.",
                            coming: "Coming soon"
                        },
                        { 
                            title: "Agent Prompt", 
                            description: "Create comprehensive prompts for autonomous coding agents like Claude Code.",
                            coming: "Coming soon"
                        },
                        { 
                            title: "Repo to Text", 
                            description: "Convert repositories into structured text optimized for LLM context.",
                            coming: "Coming soon"
                        },
                    ].map((item) => (
                        <Card key={item.title} className="min-h-[160px]">
                            <h3 className="font-semibold text-zinc-300 truncate">{item.title}</h3>
                            <p className="mt-2 flex-1 text-sm text-zinc-500 line-clamp-3">{item.description}</p>
                            <p className="mt-4 text-xs font-medium text-zinc-600">{item.coming}</p>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}