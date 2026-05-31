'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import type { Course } from '@/lib/types';

type CourseCardProps = {
  course: Course;
  icon: LucideIcon;
  delay?: number;
  compact?: boolean;
  className?: string;
};

export function CourseCard({ course, icon: Icon, delay = 0, compact = false, className = '' }: CourseCardProps) {
  const createdDate = new Date(course.created_at).toISOString().slice(0, 10);
  const statusLabel = course.progress >= 100 ? 'Completed' : compact ? 'Active' : 'In progress';
  // small local rename to feel like a dev wrote this casually
  const pct = course.progress; // pct stands for percentage
  // tried using a helper here earlier: // const prettyProgress = formatPct(pct);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay }}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/55 shadow-glow backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:border-cyan-300/30 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_20px_60px_rgba(2,6,23,0.45)] ${compact ? 'p-4' : 'p-5'} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_40%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.06)_50%,transparent_80%)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`grid shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/15 transition duration-300 group-hover:scale-105 group-hover:bg-cyan-400/15 group-hover:ring-cyan-300/25 ${compact ? 'h-10 w-10' : 'h-11 w-11'}`}>
            <Icon className={compact ? 'h-[18px] w-[18px]' : 'h-5 w-5'} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Course</p>
            <h3 className={`mt-1 break-words font-semibold text-white ${compact ? 'text-base' : 'text-lg'}`}>{course.title}</h3>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-slate-500 transition duration-300 group-hover:text-cyan-300" />
      </div>

      <div className={compact ? 'mt-4' : 'mt-5'}>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400 sm:text-sm">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct / 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: delay + 0.1 }}
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-2 lg:hidden">
          <span>{compact ? `Updated ${createdDate}` : `Created ${createdDate}`}</span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300 ring-1 ring-white/[0.08]">{statusLabel}</span>
        </div>

        <div className="hidden items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tablet view</p>
            <p className="mt-1 text-sm text-slate-300">{course.title}</p>
          </div>
          <p className="text-right text-xs text-slate-400">Last updated {createdDate}</p>
        </div>

        <div className="hidden items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-3 py-2 lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Desktop detail</p>
            <p className="mt-1 text-sm text-slate-300">Structured for deeper tracking and wider screens.</p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300 ring-1 ring-white/[0.08]">{statusLabel}</span>
        </div>
      </div>
    </motion.article>
  );
}