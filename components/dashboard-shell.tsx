'use client';

import type { ActivityDay, Course, DashboardStats } from '@/lib/types';
import DashboardBento from '@/components/dashboard-bento';

type DashboardShellProps = {
  courses: Course[];
  activity: ActivityDay[];
  stats: DashboardStats;
  dataSource?: 'supabase' | 'demo';
  viewerName?: string;
  initialTab?: string;
};

export default function DashboardShell(props: DashboardShellProps) {
  return <DashboardBento {...props} />;
}
