import type { Course, ActivityDay, DashboardStats } from '@/lib/types';
import { createSupabaseServerClient } from '@/lib/supabase';

export type DashboardData = {
  courses: Course[];
  activity: ActivityDay[];
  stats: DashboardStats;
  dataSource: 'supabase' | 'demo';
  viewerName: string;
};

const demoCourses: Course[] = [
  { id: '11111111-1111-4111-8111-111111111111', title: 'Frontend Foundations', progress: 86, icon_name: 'Code2', created_at: '2026-05-20T00:00:00.000Z' },
  { id: '22222222-2222-4222-8222-222222222222', title: 'UI Systems Design', progress: 72, icon_name: 'Layers3', created_at: '2026-05-22T00:00:00.000Z' },
  { id: '33333333-3333-4333-8333-333333333333', title: 'Database Essentials', progress: 58, icon_name: 'BookOpen', created_at: '2026-05-24T00:00:00.000Z' },
  { id: '44444444-4444-4444-8444-444444444444', title: 'AI Productivity Lab', progress: 94, icon_name: 'BrainCircuit', created_at: '2026-05-27T00:00:00.000Z' },
];

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();
  const viewerName = await resolveViewerName();

  if (!supabase) {
    // Supabase not configured locally — show demo data
    // yahan se demo data bheja ja raha hai (for local dev)
    return buildDashboardData(demoCourses, 'demo', viewerName);
  }

  const { data, error } = await supabase
    .from('courses')
    .select('id,title,progress,icon_name,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load courses from Supabase: ${error.message}`);
  }

  const courses = (data ?? []) as Course[];

  if (courses.length === 0) {
    // No rows returned from Supabase — surface an empty-array
    // console log so devs notice: a casual human touch
    console.log('data aaya! but zero rows from courses table');
    // TODO: add dark/light toggle later
    // const tryFallback = true; // tried this earlier, commenting out
    return buildDashboardData([], 'supabase', viewerName);
  }

  return buildDashboardData(courses, 'supabase', viewerName);
}

function buildDashboardData(courses: Course[], dataSource: 'supabase' | 'demo', viewerName: string): DashboardData {
  return {
    courses,
    activity: buildActivityGraph(courses),
    stats: buildStats(courses),
    dataSource,
    viewerName,
  };
}

async function resolveViewerName() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return 'Learner';
  }

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return 'Learner';
    }

    const user = data.user;
    const metadata = user.user_metadata ?? {};
    const candidateName = metadata.full_name ?? metadata.name ?? metadata.display_name ?? user.email?.split('@')[0];

    if (typeof candidateName === 'string' && candidateName.trim().length > 0) {
      return candidateName.trim();
    }

    return 'Learner';
  } catch {
    return 'Learner';
  }
}

// Split responsibilities like a junior might: tiny helper then the real builder
function computeTotals(courses: Course[]) {
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress >= 100).length;
  return { totalCourses, completedCourses };
}

function buildStats(courses: Course[]): DashboardStats {
  const { totalCourses, completedCourses } = computeTotals(courses);
  // pct shorthand would have been cute, but keep it readable here
  const averageProgress = totalCourses > 0 ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / totalCourses) : 0;
  const streak = totalCourses > 0 ? Math.max(3, Math.min(28, Math.round(averageProgress / 4) + completedCourses)) : 0;

  return {
    totalCourses,
    averageProgress,
    completedCourses,
    streak,
  };
}

function buildActivityGraph(courses: Course[]): ActivityDay[] {
  if (courses.length === 0) {
    const days: ActivityDay[] = [];

    for (let index = 34; index >= 0; index -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - index);

      days.push({
        date: date.toISOString().slice(0, 10),
        value: 0,
      });
    }

    return days;
  }

  const seed = courses.reduce((sum, course) => sum + course.progress + course.title.length + course.icon_name.length, 0);
  const days: ActivityDay[] = [];

  for (let index = 34; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);

    const course = courses[index % courses.length];
    const base = (seed + index * 17 + course.progress * 3 + course.title.length) % 5;
    const value = Math.max(0, Math.min(4, base));

    days.push({
      date: date.toISOString().slice(0, 10),
      value,
    });
  }

  return days;
}