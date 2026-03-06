import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",   // Everything under /dashboard
    "/api/user(.*)",    // Any user-specific API routes
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    // If the route is protected and user is not signed in,
    // Clerk automatically redirects to the sign-in page
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
    // If user is signed in and tries to visit sign-in/sign-up,
    // redirect them straight to dashboard — no reason to see auth pages again
    if (userId && isAuthRoute(req)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If route is protected and user is NOT signed in, redirect to sign-in
    if (!userId && isProtectedRoute(req)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
});

export const config = {
    matcher: [
        // Run middleware on all routes except static files and Next.js internals
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};