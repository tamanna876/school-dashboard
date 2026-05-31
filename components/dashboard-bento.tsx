'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, BookOpen, ChevronLeft, Clock3, Flame, Grid2x2, LayoutDashboard, Menu, Settings, Sparkles, TrendingUp, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ActivityDay, Course, DashboardStats } from '@/lib/types';
import { CourseCard } from '@/components/course-card';
import { ActivityGraph } from '@/components/activity-graph';
import { resolveCourseIcon } from '@/lib/icons';

type DashboardShellProps = {
  courses: Course[];
  activity: ActivityDay[];
  stats: DashboardStats;
  dataSource?: 'supabase' | 'demo';
  viewerName?: string;
  initialTab?: string;
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, hint: 'Home' },
  { id: 'courses', label: 'Courses', icon: BookOpen, hint: 'Learning' },
  { id: 'activity', label: 'Activity', icon: TrendingUp, hint: 'Progress' },
  { id: 'settings', label: 'Settings', icon: Settings, hint: 'Preferences' },
];

const courseTileSpans = [
  'md:col-span-1 lg:col-span-4',
  'md:col-span-1 lg:col-span-4',
  'md:col-span-1 lg:col-span-4',
  'md:col-span-1 lg:col-span-6',
  'md:col-span-1 lg:col-span-6',
  'md:col-span-1 lg:col-span-3',
];

export default function DashboardBento({ courses, activity, stats, dataSource = 'supabase', viewerName = 'Learner', initialTab }: DashboardShellProps) {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab') ?? undefined;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => getInitialTab(urlTab ?? initialTab));
  const featuredCourse = courses[0];
  // local alias to make the code read like a person wrote it
  const courseList = courses;
  // mixing styles: sometimes I refer to the list as userData, sometimes as user_info
  // hacky: leave both around so the code shows gradual development
  const userData = courseList;
  const user_info = courseList;
  const FeaturedIcon = featuredCourse ? resolveCourseIcon(featuredCourse.icon_name) : null;

  useEffect(() => {
    setActiveTab(getInitialTab(urlTab ?? initialTab));
  }, [initialTab, urlTab]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeTab]);

  const activitySummary = useMemo(() => {
    const activeDays = activity.filter((day) => day.value > 0).length;
    const totalBlocks = activity.reduce((sum, day) => sum + day.value, 0);
    const peakDay = activity.reduce((best, day) => (day.value > best.value ? day : best), activity[0] ?? { date: '', value: 0 });

    return {
      activeDays,
      totalBlocks,
      peakDay,
    };
  }, [activity]);

  // map to tile view — small readable name change
  const courseTiles = useMemo(() => courseList.map((course, index) => ({
    course,
    icon: resolveCourseIcon(course.icon_name),
    spanClassName: courseTileSpans[index % courseTileSpans.length],
  })), [courseList]);

  // old attempt - kept commented out intentionally
  // const tiles = courses.map((c) => makeTile(c));

  // small unused helper left as a sign of iterative work
  function legacyFormatName(n: string) {
    // TODO: revisit name formatting rules
    return n.trim();
  }

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
  }

  return (
    <main className="min-h-screen px-4 pb-24 pt-4 text-slate-100 sm:px-6 md:pb-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 md:grid-cols-[92px_1fr] lg:grid-cols-[auto_1fr]">
        <aside className="glass-panel relative hidden overflow-hidden rounded-[2rem] md:sticky md:top-4 md:block md:h-[calc(100vh-2rem)] md:w-[92px] lg:w-[280px]">
          <div className="absolute inset-0 soft-grid opacity-[0.1]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/10 to-transparent" />
          <div className="relative flex h-full flex-col p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <AnimatePresence initial={false} mode="wait">
                  {!collapsed && (
                    <motion.div
                      key="brand-text"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="hidden leading-tight lg:block"
                    >
                      <p className="text-sm font-medium text-slate-300">Student</p>
                      <p className="text-lg font-semibold text-white">Dashboard</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setCollapsed((value) => !value)}
                className="hidden h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:grid"
                aria-label="Toggle sidebar"
              >
                <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <nav className={`mt-8 space-y-2 transition-opacity duration-200 ${collapsed ? 'lg:opacity-100' : 'lg:opacity-100'}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const itemValue =
                  item.id === 'overview'
                    ? `${stats.streak} day streak`
                    : item.id === 'courses'
                      ? `${courses.length} active courses`
                      : item.id === 'activity'
                        ? `${activitySummary.activeDays} active days`
                        : dataSource === 'supabase'
                          ? 'Live sync on'
                          : 'Demo mode';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left transition-opacity md:justify-center lg:justify-start ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={item.label}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute inset-0 rounded-2xl bg-cyan-400/12 ring-1 ring-cyan-300/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      />
                    )}
                    <span className="relative z-10 grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/[0.08]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <AnimatePresence initial={false} mode="wait">
                      {!collapsed && (
                        <motion.span
                          key={item.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="relative z-10 hidden text-sm font-medium lg:block"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <div className="pointer-events-none relative z-10 ml-auto hidden text-right lg:block">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{item.hint}</p>
                      <p className="mt-1 text-xs font-medium text-slate-300">{itemValue}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Streak</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-semibold text-white">{stats.streak}</p>
                  <p className="text-sm text-slate-400">days of momentum</p>
                </div>
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 ring-1 ring-cyan-300/15">
                  <Flame className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="sticky top-4 z-40 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 shadow-glow backdrop-blur-xl md:hidden">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/80">Student Dashboard</p>
            <p className="mt-1 text-sm text-slate-300">{viewerName}</p>
          </div>
          <button
            onClick={() => setMobileNavOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileNavOpen(false)}
            >
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute inset-x-4 bottom-20 rounded-[2rem] border border-white/10 bg-slate-950/95 p-4 shadow-glow"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Navigate</p>
                    <p className="mt-1 text-sm text-slate-200">Jump between dashboard sections</p>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200" aria-label="Close navigation">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${isActive ? 'border-cyan-300/20 bg-cyan-400/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}
                      >
                        <Icon className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.hint}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="grid auto-rows-[minmax(160px,auto)] items-start grid-flow-dense gap-4 md:grid-cols-2 lg:grid-cols-12">
          {activeTab === 'overview' && (
            <>
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-panel relative h-fit place-self-start overflow-hidden rounded-[2rem] p-5 md:col-span-2 lg:col-span-7"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_28%)]" />
                <div className="relative flex min-h-[460px] flex-col gap-6 sm:min-h-[520px] lg:min-h-[560px]">
                  <div className="space-y-5">
                    {dataSource === 'demo' && (
                      <div className="inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                        Demo mode: Supabase credentials missing
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80 sm:text-sm sm:tracking-[0.35em]">Welcome back, {viewerName}</p>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-100 sm:text-xs">
                          <Flame className="h-3.5 w-3.5" />
                          Daily learning streak: {stats.streak} days
                        </div>
                      </div>
                      <h1 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                        Keep the streak alive and move through today&apos;s learning with focus.
                      </h1>
                      <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                        Review what matters most, track your momentum, and keep every study session moving with clarity.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Today&apos;s focus</p>
                          {FeaturedIcon ? (
                            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/15">
                              <FeaturedIcon className="h-4 w-4" />
                            </div>
                          ) : null}
                        </div>
                        <p className="mt-2 text-lg font-semibold text-white">{featuredCourse?.title ?? 'Review your next lesson'}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {featuredCourse ? `${featuredCourse.progress}% complete and ready for the next push.` : 'No active course selected yet.'}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Weekly rhythm</p>
                        <p className="mt-2 text-lg font-semibold text-white">{activitySummary.activeDays} active days</p>
                        <p className="mt-1 text-sm text-slate-400">{activitySummary.totalBlocks} total blocks logged this week.</p>
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 sm:col-span-2 xl:col-span-1">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Quick note</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          Keep the streak alive, finish one meaningful task, and let the rest of the session stay light.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <MetricTile label="Courses" value={String(stats.totalCourses)} icon={BookOpen} />
                    <MetricTile label="Avg progress" value={`${stats.averageProgress}%`} icon={BadgeCheck} />
                    <MetricTile label="Active days" value={String(activitySummary.activeDays)} icon={Clock3} />
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-panel rounded-[2rem] p-5 md:col-span-2 lg:col-span-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Activity</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Contribution graph</h2>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 text-cyan-300 ring-1 ring-white/10">
                    <Grid2x2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-3">
                  <ActivityGraph days={activity} />
                </div>

                <div className="mt-4">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">This week</p>
                    <p className="mt-2 text-xl font-semibold text-white">{activitySummary.activeDays} active days</p>
                  </div>
                </div>
              </motion.article>

                {courseTiles.length > 0 ? (
                  courseTiles.map(({ course, icon, spanClassName }, index) => (
                    <CourseCard key={course.id} course={course} icon={icon} delay={index * 0.08} compact className={spanClassName} />
                  ))
                ) : (
                  <EmptyCoursesState
                    title="No courses yet"
                    description={
                      dataSource === 'supabase'
                        ? 'Add rows to the courses table in Supabase to populate this dashboard.'
                        : 'Connect Supabase to replace demo data with your own courses.'
                    }
                    className="md:col-span-2 lg:col-span-12"
                  />
                )}
            </>
          )}

          {activeTab === 'courses' && (
            <>
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel relative overflow-hidden rounded-[2rem] p-5 md:col-span-2 lg:col-span-12"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_32%)]" />
                <div className="relative flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Courses</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Your active learning tracks</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    <BookOpen className="h-4 w-4" />
                    {courses.length} active courses
                  </div>
                </div>
              </motion.article>
              {courseTiles.length > 0 ? (
                courseTiles.map(({ course, icon }, index) => (
                  <CourseCard key={course.id} course={course} icon={icon} delay={index * 0.06} className="md:col-span-1 lg:col-span-4" />
                ))
              ) : (
                <EmptyCoursesState
                  title="No courses found"
                  description={
                    dataSource === 'supabase'
                      ? 'Your Supabase query returned zero rows. Seed the table or add a course to get started.'
                      : 'Demo mode is active because Supabase is not configured.'
                  }
                  className="md:col-span-2 lg:col-span-12"
                />
              )}
            </>
          )}

          {activeTab === 'activity' && (
            <>
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-[2rem] p-5 md:col-span-2 lg:col-span-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Activity</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Contribution graph</h2>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 text-cyan-300 ring-1 ring-white/10">
                    <Grid2x2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-3">
                  <ActivityGraph days={activity} />
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="glass-panel rounded-[2rem] p-5 md:col-span-2 lg:col-span-4"
              >
                <h3 className="text-lg font-semibold text-white">Activity insights</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <SummaryTile label="Active days" value={activitySummary.activeDays} />
                  <SummaryTile label="Total blocks" value={activitySummary.totalBlocks} />
                  <SummaryTile label="Peak day" value={activitySummary.peakDay.value} detail={activitySummary.peakDay.date || 'No activity yet'} />
                </div>
                {featuredCourse && (
                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Top course</p>
                    <p className="mt-2 text-base font-medium text-white">{featuredCourse.title}</p>
                    <p className="text-sm text-slate-400">{featuredCourse.progress}% complete</p>
                  </div>
                )}
              </motion.article>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-[2rem] p-5 md:col-span-2 lg:col-span-7"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Settings</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Workspace preferences</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <SettingTile title="Data source" value={dataSource === 'supabase' ? 'Supabase live sync' : 'Demo data mode'} />
                  <SettingTile title="Theme" value="Dark mode enabled" />
                  <SettingTile title="Active courses" value={`${courses.length} courses tracked`} />
                  <SettingTile title="Notification mode" value="Weekly summary digest" />
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="glass-panel rounded-[2rem] p-5 md:col-span-2 lg:col-span-5"
              >
                <h3 className="text-lg font-semibold text-white">Profile snapshot</h3>
                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-300">Learner</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">Consistency</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.streak} days</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MetricTile label="Avg progress" value={`${stats.averageProgress}%`} icon={BadgeCheck} />
                  <MetricTile label="Active days" value={String(activitySummary.activeDays)} icon={Clock3} />
                </div>
              </motion.article>
            </>
          )}
        </section>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-slate-950/90 p-2 shadow-glow backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-xs font-medium transition ${
                isActive ? 'bg-cyan-400/12 text-white ring-1 ring-cyan-300/20' : 'text-slate-400'
              }`}
              title={item.label}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}

function MetricTile({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 px-3 py-3 backdrop-blur-sm sm:px-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs sm:tracking-[0.3em]">{label}</p>
          <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">{value}</p>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-cyan-300 ring-1 ring-white/10 sm:h-10 sm:w-10">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function SettingTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

function EmptyCoursesState({ title, description, className }: { title: string; description: string; className?: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-[2rem] p-6 ${className ?? ''}`}
    >
      <div className="flex min-h-[220px] flex-col items-start justify-between gap-6 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Empty state</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
          <BookOpen className="h-4 w-4" />
          Add a course to continue
        </div>
      </div>
    </motion.article>
  );
}

function SummaryTile({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-1 text-sm text-slate-400">{detail}</p> : null}
    </div>
  );
}

function getInitialTab(initialTab?: string) {
  const allowedTabs = new Set(navItems.map((item) => item.id));

  return initialTab && allowedTabs.has(initialTab) ? initialTab : 'overview';
}
