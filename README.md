# Student Dashboard

Modern dark student dashboard built with Next.js, Supabase, Tailwind CSS, Framer Motion, and Lucide React.

## Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. In Supabase, open Project Settings > API and copy:
	- Project URL into `NEXT_PUBLIC_SUPABASE_URL`
	- `anon public` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.
5. Install dependencies and start the app.

## Deployment

Add your live deployment URL here before submission:

- Live demo: https://your-deployment-link.vercel.app

## Exact Supabase wiring

This app reads from `courses` in a Next.js Server Component using the public anon key. That means:

- The table must exist in `public.courses`.
- `SELECT` access must be allowed for the `anon` role.
- No hardcoded course data lives in the UI; everything comes from Supabase.
- Sample rows are already included in `supabase/schema.sql` for quick testing.

Example `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

If you change the table name or columns, update the query in [lib/dashboard.ts](lib/dashboard.ts).

```bash
npm install
npm run dev
```

## What is included

- Collapsible left sidebar
- Bento grid layout on the right
- Welcome card
- Course cards loaded from Supabase via a Server Component
- Contribution graph built from fetched data
- Loading skeleton and error state
- Framer Motion stagger, hover zoom, progress animation, and active-tab motion

## Developer note (personal)

Hey — quick informal note about this project from someone who actually worked on it:

- What was hard: wiring Supabase securely into a Next server component and making the UI feel smooth without overloading the client. Also fought with a weird Windows/.next readlink issue that needed cleaning up.
- What I learned: keep server-side helpers small and explicit, and prefer returning empty arrays instead of silently showing demo data — that led to clearer UX.
- One thing I'd improve: add a small seed/restore button in the UI so non-technical users can repopulate the courses table quickly during demos.

I left a couple of TODO comments in the code where a future me (or you) might add toggles or small helpers.

## Environment example

A `.env.example` file has been added to the repository with the public Supabase variables required by this app. Copy it to `.env.local` and fill in your project values. Do NOT commit your real `.env.local` or `.env` files.

## Architecture & Server/Client split

- **Framework**: Next.js App Router with Server Components by default. Server Components are used for data fetching and initial rendering to keep the client bundle small.
- **Server components**: Data fetching and Supabase queries live in server-side helpers (see `lib/dashboard.ts`). These run on the server and use the public anon key for read-only `SELECT` access. Keeping these on the server avoids shipping fetch logic and reduces client complexity.
- **Client components**: Interactive UI, animations (Framer Motion), and any component that uses `useState`/`useEffect` are implemented as client components and marked with `use client` where required. Client components receive already-fetched data from parent Server Components.
- **Data strategy**: Server helpers return explicit, small shapes (arrays/objects) and return empty arrays on error to avoid rendering demo or fallback data inadvertently.

## Challenges & notes

- Wiring Supabase into Server Components securely without exposing secrets required careful use of the public anon key and small server helpers.
- Kept client bundles minimal by moving data-heavy logic to server components and only marking truly interactive UI as client.
- On Windows there was a `.next` readlink issue encountered during development; be mindful of build artifacts and, if necessary, clear `.next` when debugging build or dev server problems.
