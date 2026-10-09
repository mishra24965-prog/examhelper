import React, { useState, useRef, useEffect } from 'react';
import { Course } from '../types';
import {
  Brain,
  BarChart3,
  GraduationCap,
  Calendar,
  FileText,
  Video,
  ChevronDown,
  Plus,
  UploadCloud,
  FileDown,
  Check,
  X,
  Sparkles,
  BookOpen,
  Clock,
  User,
  Sliders
} from 'lucide-react';
import {
  loadStudentProfile,
  loadSubjectTracking,
  loadSubjectTasks
} from '../utils/studentProfile';

interface SidebarProps {
  courses: Course[];
  selectedCourse: Course;
  onSelectCourse: (course: Course) => void;
  onOpenUpload: () => void;
  onOpenAddCourse: () => void;
  onOpenExportPdf: () => void;
  onOpenDictionary?: () => void;
  onOpenProfile: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  daysRemaining: number;
  currentSemester: 1 | 2;
  onSelectSemester: (sem: 1 | 2) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
  onOpenUpload,
  onOpenAddCourse,
  onOpenExportPdf,
  onOpenDictionary,
  onOpenProfile,
  activeTab,
  setActiveTab,
  daysRemaining,
  currentSemester,
  onSelectSemester,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Student Profile & Active Subject Tracking
  const studentProfile = loadStudentProfile();
  const subjectTracking = loadSubjectTracking(selectedCourse);
  const subjectTasks = loadSubjectTasks(selectedCourse);
  const completedTaskCount = subjectTasks.filter(t => t.completed).length;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCourseDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    {
      id: 'mindmap',
      label: 'Concept Maps',
      icon: Brain,
    },
    {
      id: 'analytics',
      label: 'Weightage Trends',
      icon: BarChart3,
    },
    {
      id: 'teacher',
      label: 'Teacher Mindset',
      icon: GraduationCap,
    },
    {
      id: 'revision',
      label: 'Revision Planner',
      icon: Calendar,
      meta: `${daysRemaining}d`,
    },
    {
      id: 'pyqs',
      label: 'PYQ Question Bank',
      icon: FileText,
      count: selectedCourse.questions.length,
    },
    {
      id: 'videos',
      label: 'Video Lectures',
      icon: Video,
    },
  ];

  const semesterCourses = courses.filter((c) => (c.semesterNumber || 1) === currentSemester);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Variation 8 Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#151518] border-r border-[rgba(228,228,231,0.1)] flex flex-col p-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-xs shadow-lg shadow-indigo-600/30">
              EI
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">
                ExamIntel
              </span>
              <span className="text-[10px] font-mono text-indigo-400 mt-1 block">
                IET-DAVV 2024 Scheme
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Organized Semester Switcher (Top Segmented Toggle) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0b0b0d] rounded-xl border border-white/5 mb-4 shadow-inner">
          <button
            onClick={() => onSelectSemester(1)}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              currentSemester === 1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎓 Sem 1</span>
            <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${currentSemester === 1 ? 'bg-indigo-800 text-indigo-200' : 'bg-white/5 text-white/40'}`}>
              6 Subj
            </span>
          </button>
          <button
            onClick={() => onSelectSemester(2)}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              currentSemester === 2
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⚡ Sem 2</span>
            <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${currentSemester === 2 ? 'bg-purple-800 text-purple-200' : 'bg-white/5 text-white/40'}`}>
              6 Subj
            </span>
          </button>
        </div>

        {/* 2. Organized Active Subject Selector */}
        <div className="relative mb-5" ref={dropdownRef}>
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5 px-0.5">
            <span>Active Subject</span>
            <span className="text-indigo-400 font-bold">{selectedCourse.code}</span>
          </div>
          <button
            type="button"
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            className="w-full p-2.5 rounded-xl bg-[#0b0b0d] border border-white/10 hover:border-indigo-500/50 text-left transition flex items-center justify-between gap-2 cursor-pointer shadow-sm group"
          >
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate group-hover:text-indigo-300 transition">
                {selectedCourse.name}
              </span>
              <span className="text-[10px] text-white/40 font-mono block mt-0.5 truncate">
                {selectedCourse.examTarget} • {selectedCourse.syllabus?.length || 5} Units
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform shrink-0 ${courseDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Popover */}
          {courseDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#151518] border border-white/15 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 backdrop-blur-xl">
              <div className="text-[10px] font-mono text-white/40 px-2 py-1 uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
                <span>Semester {currentSemester} Subjects</span>
                <span>{semesterCourses.length} Available</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 my-1 pr-1">
                {semesterCourses.map((c) => {
                  const isCurrent = c.id === selectedCourse.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCourse(c);
                        setCourseDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/40 font-semibold'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-bold text-indigo-400 block mr-1">
                          {c.code}
                        </span>
                        <span className="truncate block">{c.name}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    setCourseDropdownOpen(false);
                    onOpenAddCourse();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Custom Subject Syllabus</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Organized Navigation Items - Clean & Spacious (No cramped scrolling) */}
        <nav className="flex-1 overflow-y-auto space-y-1.5 py-1 pr-1 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('mindmap');
              onCloseMobile();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'mindmap'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Brain className={`w-4 h-4 shrink-0 ${activeTab === 'mindmap' ? 'text-white' : 'text-indigo-400'}`} />
            <span className="truncate flex-1">Concept Mind Maps</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'mindmap' ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-500/10 text-indigo-300'}`}>
              Visual
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              onCloseMobile();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'analytics' ? 'text-white' : 'text-amber-400'}`} />
            <span className="truncate flex-1">Weightage Trends</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'analytics' ? 'bg-indigo-800 text-indigo-200' : 'bg-amber-500/10 text-amber-300'}`}>
              MST Filter
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pyqs');
              onCloseMobile();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'pyqs'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'pyqs' ? 'text-white' : 'text-blue-400'}`} />
            <span className="truncate flex-1">PYQ Question Bank</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${activeTab === 'pyqs' ? 'bg-indigo-800 text-indigo-200' : 'bg-white/10 text-white'}`}>
              {selectedCourse.questions.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('revision');
              onCloseMobile();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'revision'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'revision' ? 'text-white' : 'text-emerald-400'}`} />
            <span className="truncate flex-1">Revision Planner</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${activeTab === 'revision' ? 'bg-indigo-800 text-indigo-200' : 'bg-emerald-500/15 text-emerald-300'}`}>
              {daysRemaining}d Left
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('videos');
              onCloseMobile();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <Video className={`w-4 h-4 shrink-0 ${activeTab === 'videos' ? 'text-white' : 'text-rose-400'}`} />
            <span className="truncate flex-1">Video Lectures</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'videos' ? 'bg-indigo-800 text-indigo-200' : 'bg-rose-500/10 text-rose-300'}`}>
              YouTube
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('teacher');
              onCloseMobile();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <GraduationCap className={`w-4 h-4 shrink-0 ${activeTab === 'teacher' ? 'text-white' : 'text-purple-400'}`} />
            <span className="truncate flex-1">Teacher Mindset</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'teacher' ? 'bg-indigo-800 text-indigo-200' : 'bg-purple-500/10 text-purple-300'}`}>
              Rubrics
            </span>
          </button>

          {onOpenDictionary && (
            <button
              onClick={() => {
                onOpenDictionary();
                onCloseMobile();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition cursor-pointer text-white/70 hover:text-white hover:bg-white/5 font-medium"
              title="View Course Formulas, Key Theorems & Concepts"
            >
              <BookOpen className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate flex-1">Formula Handbook</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Formulas
              </span>
            </button>
          )}
        </nav>

        {/* 4. Bottom Dock: Organized Tools & Clean Profile Placed Neatly at the Bottom */}
        <div className="mt-auto pt-3 border-t border-white/10 space-y-2 shrink-0">
          {/* Compact Tools Row: Ingest Paper & Export PDF */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenUpload}
              className="py-2 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer active:scale-95"
              title="Upload question paper PDF, photo, or scan"
            >
              <UploadCloud className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span className="truncate">Ingest Paper</span>
            </button>

            <button
              onClick={onOpenExportPdf}
              className="py-2 px-2.5 rounded-xl bg-[#0b0b0d] hover:bg-white/5 border border-white/10 text-white/80 hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer active:scale-95"
              title="Export complete study plan and analytics as formatted PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Export PDF</span>
            </button>
          </div>

          {/* Clean Student Profile - Fixed at bottom without clutter */}
          <button
            onClick={onOpenProfile}
            className="w-full p-2.5 rounded-xl bg-[#0b0b0d] hover:bg-white/5 border border-white/10 hover:border-indigo-500/40 cursor-pointer transition flex items-center justify-between gap-2.5 text-left group"
            title="Open Student Profile, Target Efficiency & Subject Task Tracker"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                DM
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate leading-tight group-hover:text-indigo-300 transition">
                  {studentProfile.name || 'Devendra Mishra'}
                </span>
                <span className="text-[10px] text-white/40 block truncate font-mono">
                  Profile • {completedTaskCount}/{subjectTasks.length} Tasks
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
              {subjectTracking.targetEfficiency}% Target
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
