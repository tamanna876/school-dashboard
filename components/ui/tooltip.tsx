import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

type Placement = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: Placement;
  delay?: number;
};

export default function Tooltip({ content, children, placement = 'top', delay = 120 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<number | null>(null);

  const show = useCallback(() => {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setOpen(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setOpen(false), 80);
  }, []);

  const posClass =
    placement === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : placement === 'bottom'
      ? 'top-full left-1/2 -translate-x-1/2 mt-2'
      : placement === 'left'
      ? 'right-full top-1/2 -translate-y-1/2 mr-2'
      : 'left-full top-1/2 -translate-y-1/2 ml-2';

  return (
    <span className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}

      {open && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className={`pointer-events-none z-50 ${posClass}`}
        >
          <span className="whitespace-nowrap rounded-md bg-slate-900/95 px-3 py-1 text-xs text-slate-200 shadow-lg ring-1 ring-white/6">
            {content}
          </span>
        </motion.span>
      )}
    </span>
  );
}
