export type Course = {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at: string;
};

export type ActivityDay = {
  date: string;
  value: number;
};

export type DashboardStats = {
  totalCourses: number;
  averageProgress: number;
  completedCourses: number;
  streak: number;
};