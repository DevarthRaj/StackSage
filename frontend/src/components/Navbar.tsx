import {
    SignInButton,
    SignUpButton,
    Show,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white">
                StackSage
            </Link>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
                {/* Show when="signed-out": only renders when user is NOT logged in */}
                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                            Sign in
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                            Get started
                        </button>
                    </SignUpButton>
                </Show>

                {/* Show when="signed-in": only renders when user IS logged in */}
                <Show when="signed-in">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        Dashboard
                    </Link>
                    {/* UserButton shows avatar, clicking it opens profile/sign-out menu */}
                    <UserButton />
                </Show>
            </div>
        </nav>
    );
}