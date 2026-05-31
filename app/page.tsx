import DashboardShell from '@/components/dashboard-shell';
import { getDashboardData } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Server-side: fetch dashboard data (simple, straightforward)
  // yahan se server se data aata hai
  const data = await getDashboardData();

  return (
    <DashboardShell
      courses={data.courses}
      activity={data.activity}
      stats={data.stats}
      dataSource={data.dataSource}
      viewerName={data.viewerName}
    />
  );
}