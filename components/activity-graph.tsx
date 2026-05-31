'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ActivityDay } from '@/lib/types';

type ActivityGraphProps = {
  days: ActivityDay[];
};

const intensityStyles = [
  'bg-white/[0.08]',
  'bg-cyan-400/20',
  'bg-cyan-400/35',
  'bg-cyan-300/55',
  'bg-cyan-300',
];

export function ActivityGraph({ days }: ActivityGraphProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full">
      {/* Simple contribution grid — humans love tiny annotations */}
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-7 sm:gap-2 md:gap-3">
        {days.map((day, index) => {
          const intensity = Math.min(day.value, intensityStyles.length - 1);
          const delay = prefersReducedMotion ? 0 : index * 0.015;

          return (
            <motion.div
              key={day.date}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: 8 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.08, y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
              transition={{ duration: 0.28, delay, ease: 'easeOut' }}
              title={`${day.date}: ${day.value} active blocks`}
              className={`aspect-square rounded-md ring-1 ring-white/[0.08] transition-shadow duration-200 sm:rounded-lg ${intensityStyles[intensity]} shadow-[0_0_0_0_rgba(34,211,238,0)] hover:shadow-[0_0_18px_rgba(34,211,238,0.18)]`}
            />
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 sm:mt-4 sm:text-xs">
        <span className="tracking-[0.18em] uppercase">Less</span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {intensityStyles.map((style, index) => (
            <motion.span
              key={style}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.7 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
              className={`h-2.5 w-2.5 rounded-sm ring-1 ring-white/[0.08] sm:h-3 sm:w-3 ${style}`}
            />
          ))}
        </div>
        <span className="tracking-[0.18em] uppercase">More</span>
      </div>
    </div>
  );
}

// removed unused helper `calcIntensity` during dead-code cleanup