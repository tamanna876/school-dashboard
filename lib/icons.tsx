import { BookOpen, BrainCircuit, Code2, GraduationCap, Layers3, LibraryBig, LucideIcon, Sparkles, Target, Telescope } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  graduationcap: GraduationCap,
  bookopen: BookOpen,
  code2: Code2,
  braincircuit: BrainCircuit,
  filecode: Code2,
  sparkles: Sparkles,
  layers3: Layers3,
  layers: Layers3,
  paintbrush: Sparkles,
  target: Target,
  telescope: Telescope,
};

export function resolveCourseIcon(name: string): LucideIcon {
  const normalized = name.trim().toLowerCase();

  return iconMap[normalized] ?? LibraryBig;
}