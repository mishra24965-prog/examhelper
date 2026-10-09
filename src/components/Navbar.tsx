import React from 'react';
import { Course } from '../types';
import {
  BookOpen,
  Calendar,
  Plus,
  UploadCloud,
  Flame,
  GraduationCap,
  Sparkles,
  BarChart3,
  Video,
  FileText,
  Brain,
  CheckCircle2,
  ChevronRight,
  Layers
} from 'lucide-react';

interface NavbarProps {
  courses: Course[];
  selectedCourse: Course;
  onSelectCourse: (course: Course) => void;
  onOpenUpload: () => void;
  onOpenAddCourse: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  daysRemaining: number;
  currentSemester: 1 | 2;
  onSelectSemester: (sem: 1 | 2) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
  onOpenUpload,
  onOpenAddCourse,
  activeTab,
  setActiveTab,
  daysRemaining,
  currentSemester,
  onSelectSemester,
}) => {
  const tabs = [
    {
      id: 'mindmap',
      label: 'Concept & Mind Maps',
      icon: Brain,
      badge: 'Study Platform',
      highlight: true
    },
    {
      id: 'analytics',
      label: 'Weightage & Trends',
      icon: BarChart3,
      badge: 'High Yield'
    },
    {
      id: 'teacher',
      label: 'Teacher Mindset & Books',
      icon: GraduationCap,
      badge: 'Mark Rubrics'
    },
    {
      id: 'revision',
      label: 'Spaced Revision Plan',
      icon: Calendar,
      badge: `${daysRemaining}d Left`
    },
    {
      id: 'pyqs',
      label: 'PYQ Question Bank',
      icon: FileText,
      count: selectedCourse.questions.length
    },
    {
      id: 'videos',
      label: 'Video Lectures',
      icon: Video,
      badge: 'YouTube'
    },
  ];

  // Filter courses by selected semester
  const semesterCourses = courses.filter((c) => (c.semesterNumber || 1) === currentSemester);

  return (
    <header className="bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-40 text-slate-100 backdrop-blur-xl transition-all shadow-sm">
      {/* 1. Main Header Row: Logo, Semester Switcher, Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & College Scheme info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-lg">
              EI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  ExamIntel
                </span>
                <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  IET-DAVV 2024 Scheme
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Past Paper Intelligence & Conceptual Study Platform
              </p>
            </div>
          </div>

          {/* Center: Prominent Semester 1 / Semester 2 Toggle (PW Style) */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => onSelectSemester(1)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentSemester === 1
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span>🎓 Semester 1</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                currentSemester === 1 ? 'bg-indigo-900/60 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}>
                6 Subj
              </span>
            </button>

            <button
              onClick={() => onSelectSemester(2)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentSemester === 2
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span>⚡ Semester 2</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                currentSemester === 2 ? 'bg-purple-900/60 text-purple-200' : 'bg-slate-800 text-slate-400'
              }`}>
                6 Subj
              </span>
            </button>
          </div>

          {/* Right: Quick Add action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddCourse}
              title="Add custom syllabus course"
              className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Semester Subjects Ribbon (PhysicsWallah / Modern EdTech Batch Dock) */}
      <div className="border-t border-slate-800/60 bg-slate-950/60 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sem {currentSemester} Subjects:</span>
            </div>

            {semesterCourses.map((c) => {
              const isSelected = c.id === selectedCourse.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCourse(c)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/60 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-400/30'
                      : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.code}
                  </span>
                  <span className="truncate max-w-[150px] sm:max-w-[210px]">{c.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs Row: Refined modern buttons */}
      <div className="border-t border-slate-800/60 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-900/60 text-indigo-200' : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-900/60 text-indigo-200' : 'bg-slate-800/80 text-indigo-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
