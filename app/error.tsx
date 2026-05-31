'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8 text-slate-100 sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]" />
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Dashboard error</p>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Course data could not load</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          {error.message || 'Supabase fetch failed. Check your environment variables and SQL setup.'}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
          >
            Try again
          </button>
          <p className="text-sm leading-6 text-slate-400">The dashboard will keep your selected tab in the URL once it reloads successfully.</p>
        </div>
      </div>
    </main>
  );
}