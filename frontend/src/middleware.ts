import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",   // Everything under /dashboard
    "/api/user(.*)",    // Any user-specific API routes
]);

export default clerkMiddleware(async (auth, req) => {
    // If the route is protected and user is not signed in,
    // Clerk automatically redirects to the sign-in page
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Run middleware on all routes except static files and Next.js internals
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};