import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // currentUser() reads the session on the server side
    // Returns null if not authenticated
    const user = await currentUser();

    // Extra safety net — middleware should catch this first,
    // but this is a good fallback
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">
                Welcome back, {user.firstName ?? user.emailAddresses[0].emailAddress}
            </p>
            <div className="mt-8 p-6 border border-gray-800 rounded-xl">
                <p className="text-gray-500 text-sm">
                    Phase 2 complete — auth is working. Features coming soon.
                </p>
            </div>
        </main>
    );
}