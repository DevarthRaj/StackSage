import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Creates an authenticated fetch function that automatically
 * attaches the Clerk JWT to every request.
 *
 * Why a hook? Because useAuth() is a React hook and can only
 * be called inside React components or other hooks.
 */
export function useApi() {
    const { getToken } = useAuth();

    async function authFetch(endpoint: string, options: RequestInit = {}) {
        // Get the current session token from Clerk
        const token = await getToken();

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                // Attach the JWT — this is what FastAPI reads and verifies
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    return { authFetch };
}