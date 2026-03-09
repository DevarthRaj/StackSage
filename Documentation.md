# Project Structure Documentation

## CI/CD Configuration

### `.github/workflows/ci.yml`
This is your GitHub Actions file. Every time you push code to GitHub, it automatically runs your linter and type checker to catch errors. Think of it as an automated code reviewer that runs in the cloud.

---

## Backend Structure

### `backend/app/models/__init__.py`
This is where your database table definitions live. In SQLAlchemy, you define Python classes that map to database tables. The `__init__.py` just makes the folder a Python package (importable module).

### `backend/app/routers/`
Think of routers as departments in a company. Each router handles a specific group of API endpoints. 

- **`health.py`** is a router that has one job: answer "is the server alive?" — used by Docker and monitoring tools to check if your app is running.

### `backend/app/schemas/`
Schemas are the "contract" for your API. They define exactly what shape data must be when it comes IN to your API and goes OUT. Built with Pydantic. 

- The `health.py` schema defines what a health check response looks like (e.g. `{"status": "ok"}`).

### `backend/app/services/`
Services contain the actual business logic. Routers receive requests and call services to do the real work. This separation keeps your code clean — routers just route, services actually think.

### `backend/app/services/config.py`
Loads all your environment variables (API keys etc.) from the `.env` file into a Python object your whole app can import. So instead of `os.environ.get("GROQ_API_KEY")` everywhere, you just do `config.GROQ_API_KEY`.

### `backend/app/main.py`
The entry point of your entire FastAPI app. This is where the app is created, routers are registered, CORS is configured, and the server starts. Every request flows through here first.

### `backend/tests/`
Where your automated tests live. `test_health.py` tests that your health endpoint actually returns the right response. You run these with pytest.

### `backend/venv/`
Your Python virtual environment. This is an isolated Python installation just for this project. It contains all your installed packages (FastAPI, LangChain, etc.) without polluting your global Python installation. **You never touch this folder manually.**

### `backend/celery_worker.py`
The entry point for your Celery worker process (explained below in the [What is Celery?](#what-is-celery) section).

### `backend/Dockerfile`
Instructions for building a Docker image of your backend. It tells Docker: "start with Python 3.11, copy these files, install these packages, run this command."

### `backend/pyproject.toml`
Modern Python project configuration. Defines your project name, Python version, and tool settings (Ruff linter rules, mypy type checker settings). Replaces the old `setup.py`.

### `backend/requirements.txt`
The list of every Python package your project needs. Running `pip install -r requirements.txt` installs all of them at once.

---

## Frontend Structure

### `frontend/src/app/`
In Next.js App Router, every folder inside `app/` becomes a URL route. A folder called `dashboard` becomes `/dashboard`, a folder called `sign-in` becomes `/sign-in`.

### `frontend/src/lib/`
Shared utility functions and helper code used across multiple components. Things like API call functions, date formatters, etc.

### `frontend/.next/`
Auto-generated build output from Next.js. **Never touch or commit this.** It's in `.gitignore`.

### `frontend/node_modules/`
All your JavaScript packages installed by npm. **Never touch or commit this either.**

### `frontend/next.config.ts`
Configuration for Next.js itself. You set things here like allowed image domains, environment variable exposure, redirects, etc.

### `frontend/components.json`
Configuration file for shadcn/ui. It tells the shadcn CLI where to put components, what styling system to use, etc.

---

## Root Configuration Files

### `.env.example`
A template showing all required environment variables **WITHOUT** the actual secret values. You commit this to GitHub. Developers clone the repo, copy this to `.env`, and fill in their own keys.

### `dev.bat` and `dev.sh`
These are startup scripts. Instead of opening 4 terminals and remembering which command to run in each, you run one script and it starts everything. 
- `.sh` is for Linux/Mac
- `.bat` is for Windows

Since you're on Windows, you'll use `dev.bat`. It starts FastAPI, Celery, Redis etc. all at once.

### `docker-compose.yml`
The master file that defines all your services (FastAPI, Redis, Qdrant, Celery) as containers and how they connect. For deployment only on your machine.

### `docker-compose.dev.yml`
A lighter version for local dev that only runs the services that are hard to install natively.

---

## Infrastructure Components

### What is Qdrant?
Qdrant is a **vector database**. Normal databases store text and numbers. Qdrant stores vectors — lists of floating point numbers (like `[0.23, -0.81, 0.44, ...]`) that represent the meaning of text mathematically.

When you embed a sentence like "how to build a chat app", it becomes a vector of 768 numbers. Qdrant stores millions of these. When you search, it finds vectors that are mathematically close — meaning semantically similar — incredibly fast. This is what makes RAG (Retrieval-Augmented Generation) work. Without it, you'd have to scan every document every time.

### What is Celery?
Celery is a **task queue** — a system for running jobs in the background without blocking your API.

**Example Scenario:**
Imagine a user clicks "Refresh Knowledge Base." That job takes 3 minutes (scraping 10 websites, embedding thousands of chunks, upserting into Qdrant). If you ran that inside FastAPI directly, the user's browser would hang for 3 minutes waiting for a response. That's terrible UX.

**Instead, the flow works like this:**
1. FastAPI receives the request
2. Instantly says "job queued, here's a job ID"
3. Hands the actual work to Celery
4. Celery runs it in a separate process
5. User can check back later

**Redis** is what Celery uses as its **"message broker"** — the middleman that holds the list of tasks waiting to be run. FastAPI puts tasks into Redis, Celery picks them up from Redis and runs them.

**`celery_worker.py`** is the process you run separately that actually executes those background tasks. It's always listening to Redis for new work.



# StackSage — Phase 2 Documentation
## Authentication with Clerk

**Project:** StackSage  
**Phase:** 2 of 7  
**Status:** ✅ Complete  
**Date Completed:** March 2026  
**Stack:** Next.js 17 · Clerk v7 · FastAPI · SQLite · SQLAlchemy

---

## Table of Contents

1. [What Was Built](#what-was-built)
2. [Concepts Learned](#concepts-learned)
3. [File-by-File Breakdown](#file-by-file-breakdown)
4. [Errors Encountered & Fixes](#errors-encountered--fixes)
5. [Key Decisions Made](#key-decisions-made)
6. [Environment Variables Reference](#environment-variables-reference)
7. [Manual Test Checklist](#manual-test-checklist)
8. [What Comes Next](#what-comes-next)

---

## What Was Built

Phase 2 added a complete authentication system to StackSage using Clerk v7. By the end of this phase:

- Users can **sign up and sign in** via a themed auth UI that matches the app's dark emerald design
- The **dashboard is protected** — unauthenticated users are automatically redirected to `/sign-in`
- Users who are already signed in and try to visit `/sign-in` are **redirected straight to `/dashboard`**
- After signing in, users are **routed to `/dashboard`** automatically
- The **FastAPI backend can verify** who is making requests using JWT tokens issued by Clerk
- A **SQLite database** is set up to store user project history in future phases
- The entire app — landing page, auth pages, dashboard — follows a **consistent dark zinc/emerald visual style**

---

## Concepts Learned

### 1. What is JWT (JSON Web Token)?

A JWT is a compact, self-contained token that proves a user's identity. When you sign in, Clerk creates a JWT signed with their **private key**. Your FastAPI backend fetches Clerk's **public key** (from a JWKS URL) and uses it to verify the token's signature mathematically. If it checks out, the token is genuine and you can trust the `user_id` inside it.

A JWT has three parts separated by dots:
```
header.payload.signature
eyJhbGc...  .  eyJzdWI...  .  SflKxwR...
```
- **Header** — algorithm used (RS256 in Clerk's case)
- **Payload** — the actual data (user_id, email, expiry time)
- **Signature** — cryptographic proof it hasn't been tampered with

### 2. What is JWKS?

JWKS stands for **JSON Web Key Set**. It is a public URL that Clerk exposes (e.g. `https://your-app.clerk.accounts.dev/.well-known/jwks.json`) containing their public keys. Your backend fetches these keys to verify JWT signatures without ever needing Clerk's private key. This is called **asymmetric cryptography** — Clerk signs with a private key, anyone can verify with the public key.

### 3. What is a FastAPI Dependency?

A FastAPI **Dependency** is a reusable function you inject into any endpoint using `Depends()`. FastAPI calls it automatically before your endpoint runs. If the dependency raises an exception (like HTTP 401), FastAPI returns that error without ever calling your endpoint function. This is how `verify_clerk_token` works — you write the JWT verification once and reuse it everywhere:

```python
@router.get("/me")
async def get_user(user: dict = Depends(verify_clerk_token)):
    # FastAPI called verify_clerk_token first
    # If token was invalid, we never reach this line
    return {"user_id": user["sub"]}
```

### 4. What is CORS?

CORS stands for **Cross-Origin Resource Sharing**. Browsers block JavaScript from calling APIs on a different domain/port by default — this is a security feature. Your frontend runs on `localhost:3000` and your backend on `localhost:8000`. These are different origins (different ports). Without CORS middleware, every API call from the frontend would be blocked by the browser. The `CORSMiddleware` in FastAPI tells the browser "yes, requests from `localhost:3000` are allowed."

### 5. What is Next.js Middleware?

Next.js middleware (`proxy.ts`) is a function that runs on **every request before any page loads**. You use it to check conditions (is the user logged in?) and redirect or block requests accordingly. It runs on Vercel's Edge Network — extremely fast, before any React code executes. This is why route protection with Clerk middleware is instant and reliable.

### 6. What are Next.js Server Components?

In Next.js App Router, page components are **Server Components** by default — they run on the server, not in the browser. This means:
- They can access server-only APIs like `currentUser()` from Clerk
- They cannot use React hooks like `useState` or `useAuth`
- They are more secure — sensitive logic never reaches the client

When you need browser interactivity (hooks, event handlers), you add `"use client"` at the top of the file, converting it to a **Client Component**.

### 7. What is SQLAlchemy ORM?

SQLAlchemy is a Python library that lets you define database tables as Python classes. ORM stands for **Object Relational Mapper** — it maps Python objects to database rows. Instead of writing raw SQL like:
```sql
INSERT INTO user_projects (user_id, project_name) VALUES ('user_123', 'My App');
```
You write Python:
```python
project = UserProject(user_id="user_123", project_name="My App")
db.add(project)
await db.commit()
```
SQLAlchemy translates this to SQL for you. The `async` variant (with `aiosqlite`) means database calls don't block your FastAPI server while waiting for disk I/O.

### 8. What is Clerk's `<Show>` component?

In Clerk v7, `<Show when="signed-in">` and `<Show when="signed-out">` are conditional rendering components. They check the current auth state and only render their children when the condition is true. This replaced the older `<SignedIn>` / `<SignedOut>` components from previous Clerk versions. They require the component to be a Client Component (`"use client"`) because auth state is read from the browser session.

### 9. What is the Clerk Appearance API?

Clerk's `appearance` prop lets you fully customize Clerk's pre-built UI components (SignIn, SignUp, UserButton) without rebuilding them. It has two layers:
- **`variables`** — CSS custom properties that cascade through all elements (background color, primary color, border radius, fonts)
- **`elements`** — class names applied to specific UI elements (buttons, inputs, cards, links)

This lets you make Clerk's auth UI look native to your app's design system.

---

## File-by-File Breakdown

### Frontend Files

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — wraps entire app in `<ClerkProvider>` so all pages have auth context |
| `src/proxy.ts` | Middleware — protects `/dashboard`, redirects auth pages if already signed in |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Sign-in page — Clerk `<SignIn>` component themed to match app style |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Sign-up page — Clerk `<SignUp>` component themed to match app style |
| `src/app/dashboard/page.tsx` | Protected dashboard — server component, reads user from Clerk session |
| `src/app/page.tsx` | Landing page — has its own nav, Sign In link, feature cards |
| `src/components/Navbar.tsx` | Reusable nav — used on inner pages (dashboard etc.), shows UserButton when signed in |
| `src/lib/api.ts` | Auth-aware fetch helper — attaches Clerk JWT to every backend API call |
| `.env.local` | Environment variables — Clerk keys and redirect URLs (never committed to git) |

### Backend Files

| File | Purpose |
|---|---|
| `app/main.py` | FastAPI entry point — registers routers, configures CORS |
| `app/services/auth.py` | JWT verification dependency — fetches JWKS, verifies token on every protected request |
| `app/models/database.py` | SQLAlchemy setup — creates async engine, session factory, `Base` class |
| `app/models/user_project.py` | `UserProject` table definition — stores user project history |
| `app/models/__init__.py` | Exposes all models from one import |
| `app/routers/user.py` | `/api/user/me` endpoint — returns current user info, protected by JWT dependency |
| `app/services/init_db.py` | One-time DB setup script — creates tables in `stacksage.db` |
| `.env` | Backend environment variables — `CLERK_JWKS_URL`, `DATABASE_URL` etc. |

---

## Errors Encountered & Fixes

### Error 1 — `<SignedIn>` and `<SignedOut>` not exported from `@clerk/nextjs`

**What happened:** The initial Navbar code used `<SignedIn>` and `<SignedOut>` from `@clerk/nextjs` which caused import errors in Clerk v7.

**Why it happened:** Clerk v7 replaced these components with the new `<Show when="...">` API. The components were removed from the package exports.

**Fix:** Replaced with Clerk v7's correct pattern:
```tsx
// Before (broken in v7)
<SignedIn> ... </SignedIn>
<SignedOut> ... </SignedOut>

// After (correct in v7)
<Show when="signed-in"> ... </Show>
<Show when="signed-out"> ... </Show>
```

---

### Error 2 — `afterSignOutUrl` prop deprecated on `<UserButton>`

**What happened:** TypeScript threw a type error for `<UserButton afterSignOutUrl="/" />`.

**Why it happened:** In Clerk v5+, redirect URLs after sign-out are controlled via environment variables, not component props.

**Fix:** Removed the prop entirely and added the env variable instead:
```bash
# .env.local
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

---

### Error 3 — Framer Motion TypeScript error on `ease: "easeOut"`

**What happened:** TypeScript compilation failed with a type error on the `ease` property inside the Framer Motion transition object.

**Why it happened:** Framer Motion 12 has strictly typed easing variants — plain strings are not accepted, the type must be narrowed.

**Fix:** Added `as const` to narrow the type:
```typescript
// Before (TypeScript error)
transition: { ease: "easeOut" }

// After (correct)
transition: { ease: "easeOut" as const }
```

---

### Error 4 — ESLint warning for `<a>` tags on internal links

**What happened:** `npm run lint` threw warnings for using HTML `<a>` tags for internal navigation.

**Why it happened:** Standard `<a>` tags cause full browser page reloads, breaking Next.js's client-side navigation and SPA behaviour.

**Fix:** Replaced all internal `<a>` tags with Next.js `<Link>` component. For the "Learn More" anchor scroll, replaced with a `<button>` using `scrollIntoView`:
```tsx
// Before
<a href="#features">Learn More</a>

// After
<button onClick={() =>
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
}>
  Learn More
</button>
```

---

### Error 5 — No redirect to dashboard after signing in

**What happened:** After successful sign-in, the user stayed on the `/sign-in` page instead of being routed to `/dashboard`.

**Why it happened:** Two root causes:
1. The `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` env variable wasn't being picked up because the dev server wasn't restarted after editing `.env.local`
2. Clerk v7's middleware using `auth.protect()` handed redirect control back to Clerk which was unreliable

**Fix 1:** Added `forceRedirectUrl="/dashboard"` directly to the `<SignIn>` component prop — explicit always beats implicit.

**Fix 2:** Rewrote `proxy.ts` middleware to use explicit `NextResponse.redirect()` instead of `auth.protect()`:
```typescript
// Before — unreliable
if (isProtectedRoute(req)) {
  await auth.protect();
}

// After — explicit and reliable
const { userId } = await auth();
if (userId && isAuthRoute(req)) {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
if (!userId && isProtectedRoute(req)) {
  return NextResponse.redirect(new URL("/sign-in", req.url));
}
```

**Fix 3:** Cleared browser cookies for `localhost` to remove stale Clerk session data.

---

### Error 6 — `<Show>` component not rendering (silent failure)

**What happened:** The Navbar's `<Show when="signed-in">` block rendered nothing even when signed in, so `<UserButton>` never appeared.

**Why it happened:** The Navbar component was a Server Component by default. `useAuth()` and Clerk's session hooks only work in Client Components. Without `"use client"`, Clerk had no browser session to read.

**Fix:** Added `"use client"` at the top of `Navbar.tsx` and added an `isLoaded` check to prevent rendering until Clerk's session is confirmed:
```tsx
"use client";

const { isLoaded } = useAuth();

{!isLoaded ? (
  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
) : (
  <Show when="signed-in"> ... </Show>
)}
```

---

### Note on `proxy.ts` vs `middleware.ts`

In this project, the middleware file is named `proxy.ts` instead of the conventional `middleware.ts`. This is because **Clerk v7 requires `proxy.ts`** when used with Next.js 15+. The file name difference is the only change — the code inside is identical. If you ever downgrade to Next.js 14, rename it back to `middleware.ts`.

---

## Key Decisions Made

**Why Clerk over Supabase Auth or custom JWT?**  
Clerk never freezes inactive projects, requires zero server maintenance, and its free tier supports 10,000 monthly active users permanently. Building custom JWT auth would have taken days and introduced security risks. Clerk's v7 `appearance` API makes it fully themeable so it doesn't look generic.

**Why SQLite over PostgreSQL?**  
On an 8GB RAM laptop with no cloud database budget, SQLite is the correct choice. It's a single file (`stacksage.db`), zero configuration, zero RAM overhead. SQLAlchemy abstracts the database layer so switching to PostgreSQL for production is a one-line connection string change.

**Why `proxy.ts` instead of `middleware.ts`?**  
Required by Clerk v7 + Next.js 15 compatibility. No functional difference.

**Why does the landing page have its own nav instead of using `<Navbar>`?**  
The landing page (`/`) is a public marketing page with a minimal nav (just a Sign In link). The `<Navbar>` component is for authenticated inner pages and shows the `<UserButton>` and Dashboard link. Mixing them would add unnecessary Clerk loading state to the public landing page.

---

## Environment Variables Reference

### `frontend/.env.local`

| Variable | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Identifies your Clerk app to the frontend |
| `CLERK_SECRET_KEY` | `sk_test_...` | Server-side Clerk API access (never expose to browser) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Where Clerk redirects unauthenticated users |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Where new users are sent to register |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` | Where to go after signing in |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` | Where to go after signing up |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL` | `/` | Where to go after signing out |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI backend base URL |

### `backend/.env`

| Variable | Value | Purpose |
|---|---|---|
| `CLERK_JWKS_URL` | `https://your-app.clerk.accounts.dev/.well-known/jwks.json` | Clerk's public keys for JWT verification |
| `DATABASE_URL` | `sqlite+aiosqlite:///./stacksage.db` | SQLite database file path |

---

## Manual Test Checklist

All of the following were verified working at the end of Phase 2:

- [x] `localhost:3000` loads with Sign In link and feature cards
- [x] Clicking Sign In navigates to `/sign-in` with dark themed Clerk UI
- [x] Signing up redirects to `/dashboard` automatically
- [x] Signing in redirects to `/dashboard` automatically
- [x] Visiting `localhost:3000/dashboard` while logged out redirects to `/sign-in`
- [x] Visiting `localhost:3000/sign-in` while logged in redirects to `/dashboard`
- [x] Dashboard shows `Welcome back, [name]`
- [x] `<UserButton>` avatar appears in navbar on dashboard
- [x] Clicking avatar shows profile and sign out options
- [x] Signing out redirects to `/`
- [x] `localhost:8000/docs` shows all API endpoints
- [x] `GET /api/user/me` without token returns `401 Unauthorized`
- [x] `stacksage.db` file exists in `backend/` folder
- [x] `npm run lint` passes with zero warnings
- [x] `npx tsc --noEmit` passes with zero type errors

---

## What Comes Next

**Phase 3 — RAG Pipeline** is where StackSage starts to actually think. It involves:

- Setting up **Qdrant Cloud** (free cluster) as the vector database
- Building the **embedding pipeline** using Google's free `text-embedding-004` model
- Implementing **scrapers** for Hugging Face Papers, OpenRouter model list, and Ollama library
- Building the **LangChain v0.3 LCEL retrieval chain**: query → embed → Qdrant search → Cohere rerank → Groq LLM
- Adding the **hardware compatibility filter** that annotates tool recommendations based on user specs
- Building the **manual RAG refresh endpoint** (`POST /api/admin/refresh-rag`) as a button in the dashboard

Phase 3 is the most technically complex phase of the project. Take it one step at a time.