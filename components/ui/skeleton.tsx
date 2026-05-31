type SkeletonProps = {
  className?: string;
};

export function SidebarSkeleton() {
  return (
    <aside className="glass-panel hidden rounded-[2rem] p-4 md:block md:w-[92px] lg:w-[280px]">
      <div className="flex items-center justify-between gap-3">
        <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/8" />
        <div className="hidden h-10 flex-1 animate-pulse rounded-2xl bg-white/8 lg:block" />
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-2xl bg-white/8" />
        ))}
      </div>
      <div className="mt-8 h-28 animate-pulse rounded-3xl bg-white/8" />
    </aside>
  );
}

export function CardSkeleton({ className = '' }: SkeletonProps) {
  return (
    <article className={`glass-panel relative min-h-[160px] overflow-hidden rounded-[2rem] bg-white/[0.05] ${className}`}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      <div className="absolute inset-0 soft-grid opacity-[0.06]" />
    </article>
  );
}