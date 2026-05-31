import { SidebarSkeleton, CardSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen px-4 pb-24 pt-4 text-slate-100 sm:px-6 md:pb-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_24%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.34),transparent_28%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 md:grid-cols-[92px_1fr] lg:grid-cols-[auto_1fr]">
        <SidebarSkeleton />
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(160px,auto)]">
          <CardSkeleton className="min-h-[420px] md:col-span-2 lg:col-span-7 lg:row-span-2" />
          <CardSkeleton className="min-h-[420px] md:col-span-2 lg:col-span-5 lg:row-span-2" />
          <CardSkeleton className="min-h-[180px] md:col-span-1 lg:col-span-4" />
          <CardSkeleton className="min-h-[180px] md:col-span-1 lg:col-span-4" />
          <CardSkeleton className="min-h-[180px] md:col-span-1 lg:col-span-4" />
          <CardSkeleton className="min-h-[180px] md:col-span-1 lg:col-span-6" />
        </section>
      </div>
    </main>
  );
}