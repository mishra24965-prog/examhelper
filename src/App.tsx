import React, { useState, useEffect } from 'react';
import { Course, Question, ExamPaperRecord } from './types';
import { INITIAL_COURSES } from './data/mockCourses';
import { Sidebar } from './components/Sidebar';
import { ConceptMindMapView } from './components/ConceptMindMapView';
import { WeightageAnalyticsView } from './components/WeightageAnalyticsView';
import { TeacherDemandsView } from './components/TeacherDemandsView';
import { SpacedRepetitionView } from './components/SpacedRepetitionView';
import { QuestionBankView } from './components/QuestionBankView';
import { VideoLecturesView } from './components/VideoLecturesView';
import { UploadPaperModal } from './components/UploadPaperModal';
import { AddCourseModal } from './components/AddCourseModal';
import { ExportPdfModal } from './components/ExportPdfModal';
import { CourseDictionaryModal } from './components/CourseDictionaryModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { loadSavedCourses, saveCourseState, loadStoredPapers, saveStoredPapers } from './utils/paperStorage';
import { loadStudentProfile, loadSubjectTracking } from './utils/studentProfile';
import { CheckCircle2, Menu, UploadCloud, FileDown, BookOpen, User, Clock, Sliders } from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(() => loadSavedCourses(INITIAL_COURSES));
  const [currentSemester, setCurrentSemester] = useState<1 | 2>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    const saved = loadSavedCourses(INITIAL_COURSES);
    return saved[0]?.id || INITIAL_COURSES[0].id;
  });
  const [activeTab, setActiveTab] = useState<string>('mindmap');
  const [targetTopicId, setTargetTopicId] = useState<string | undefined>(undefined);
  const [daysRemaining, setDaysRemaining] = useState<number>(14);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState<boolean>(false);
  const [isExportPdfOpen, setIsExportPdfOpen] = useState<boolean>(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const currentProfile = loadStudentProfile();
  const subjectTracking = loadSubjectTracking(selectedCourse);

  // Persist courses whenever updated
  useEffect(() => {
    saveCourseState(courses);
  }, [courses]);

  const handleSelectSemester = (sem: 1 | 2) => {
    setCurrentSemester(sem);
    const firstCourseInSem = courses.find((c) => (c.semesterNumber || 1) === sem);
    if (firstCourseInSem) {
      setSelectedCourseId(firstCourseInSem.id);
      setTargetTopicId(undefined);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    if (course.semesterNumber && course.semesterNumber !== currentSemester) {
      setCurrentSemester(course.semesterNumber);
    }
    setTargetTopicId(undefined);
  };

  const handleNavigateTab = (tab: string, topicId?: string) => {
    setActiveTab(tab);
    if (topicId) {
      setTargetTopicId(topicId);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQuestionsExtracted = (newQuestions: Question[], paperRecord?: ExamPaperRecord) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === selectedCourse.id) {
          const existingPapers = c.examPapers || loadStoredPapers(c.id);
          const updatedPapers = paperRecord
            ? [paperRecord, ...existingPapers.filter(p => p.id !== paperRecord.id)]
            : existingPapers;

          if (paperRecord) {
            saveStoredPapers(c.id, updatedPapers);
          }

          return {
            ...c,
            questions: [...newQuestions, ...c.questions],
            examPapers: updatedPapers
          };
        }
        return c;
      })
    );

    const title = paperRecord ? paperRecord.name : 'Past Exam Paper';
    showToast(`Stored ${title}: extracted & classified ${newQuestions.length} questions!`);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
    if (updatedCourse.examPapers) {
      saveStoredPapers(updatedCourse.id, updatedCourse.examPapers);
    }
    saveCourseState(
      courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setSelectedCourseId(newCourse.id);
    if (newCourse.semesterNumber) {
      setCurrentSemester(newCourse.semesterNumber);
    }
    showToast(`Created course workspace: ${newCourse.name}`);
  };

  const tabInfo: Record<string, { title: string; desc: string }> = {
    mindmap: {
      title: 'Visual Concept Mind Maps',
      desc: 'Master core mechanics with structured mental models.'
    },
    analytics: {
      title: 'Weightage Trends & PYQ Analytics',
      desc: 'Topic-wise weightage trends, question patterns, and confidence-ranked revision priorities.'
    },
    teacher: {
      title: 'Teacher Mindset & Evaluation Rubrics',
      desc: 'Professor expectations, step marks breakdowns, reference books, and deduction traps.'
    },
    revision: {
      title: 'Spaced Repetition & Revision Planner',
      desc: 'Scientifically scheduled review sessions before university MSTs and end-sems.'
    },
    pyqs: {
      title: 'Past Exam Question Bank',
      desc: 'Cleaned university questions mapped with semantic confidence and step solutions.'
    },
    videos: {
      title: 'Curated Video Lectures',
      desc: 'High-yield YouTube explanations aligned with course units and exam derivations.'
    }
  };

  const currentTabMeta = tabInfo[activeTab] || tabInfo.mindmap;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0b0b0d] text-[#e4e4e7] flex font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#151518] border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Variation 8: Left Sidebar Navigation */}
      <Sidebar
        courses={courses}
        selectedCourse={selectedCourse}
        onSelectCourse={handleSelectCourse}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAddCourse={() => setIsAddCourseOpen(true)}
        onOpenExportPdf={() => setIsExportPdfOpen(true)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        daysRemaining={daysRemaining}
        currentSemester={currentSemester}
        onSelectSemester={handleSelectSemester}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Variation 8: Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Variation 8: Clean Header without deadline/efficiency or ingest paper */}
        <header className="px-6 sm:px-10 py-5 border-b border-[rgba(228,228,231,0.1)] flex justify-between items-center bg-[#0b0b0d] shrink-0 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-[rgba(228,228,231,0.15)] text-[rgba(228,228,231,0.7)] hover:text-white lg:hidden shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#e4e4e7] truncate">
                {currentTabMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-[rgba(228,228,231,0.5)] truncate">
                {currentTabMeta.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Student Profile Quick Pill */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151518] hover:bg-white/5 border border-white/10 text-xs text-white transition cursor-pointer shadow-sm"
              title="Open Student Profile, Target Efficiency & Subject Task Tracker"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-[10px] border border-indigo-500/30">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-white truncate max-w-[110px] hidden sm:inline">
                Profile
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {subjectTracking.targetEfficiency}% Target
              </span>
            </button>

            {/* Course Formula Handbook */}
            <button
              onClick={() => setIsDictionaryOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs text-amber-300 font-medium transition cursor-pointer"
              title="View Course Formulas, Key Theorems & Concepts"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Formula Handbook</span>
            </button>

            {/* Export Complete Study Plan & Analytics as Formatted PDF */}
            <button
              onClick={() => setIsExportPdfOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366f1]/15 hover:bg-[#6366f1]/25 border border-[#6366f1]/30 text-xs text-[#e4e4e7] font-medium transition cursor-pointer"
              title="Export complete study plan and analytics as formatted PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="hidden xs:inline">Export PDF</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6">
          {activeTab === 'mindmap' && (
            <ConceptMindMapView
              course={selectedCourse}
              initialTopicId={targetTopicId}
              onNavigateTab={handleNavigateTab}
            />
          )}

          {activeTab === 'analytics' && (
            <WeightageAnalyticsView
              course={selectedCourse}
              courses={courses}
              currentSemester={currentSemester}
              onSelectSemester={handleSelectSemester}
              onSelectCourse={handleSelectCourse}
              onNavigateTab={handleNavigateTab}
              onUpdateCourse={handleUpdateCourse}
              showToast={showToast}
            />
          )}

          {activeTab === 'teacher' && (
            <TeacherDemandsView
              course={selectedCourse}
              initialTopicId={targetTopicId}
              onNavigateTab={handleNavigateTab}
            />
          )}

          {activeTab === 'revision' && (
            <SpacedRepetitionView
              course={selectedCourse}
              daysRemaining={daysRemaining}
              setDaysRemaining={setDaysRemaining}
            />
          )}

          {activeTab === 'pyqs' && (
            <QuestionBankView
              course={selectedCourse}
              initialTopicFilter={targetTopicId}
              onNavigateTab={handleNavigateTab}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenDictionary={() => setIsDictionaryOpen(true)}
              onUpdateCourse={handleUpdateCourse}
              showToast={showToast}
            />
          )}

          {activeTab === 'videos' && (
            <VideoLecturesView
              course={selectedCourse}
              onNavigateTab={handleNavigateTab}
            />
          )}
        </div>

        {/* Variation 8: Footer Meta */}
        <div className="px-6 sm:px-10 py-3.5 border-t border-[rgba(228,228,231,0.1)] text-[0.65rem] text-[rgba(228,228,231,0.5)] flex flex-col sm:flex-row justify-between items-center gap-1 bg-[#0b0b0d] shrink-0 font-mono">
          <div>ExamIntel • IET-DAVV 2024 Scheme</div>
          <div>Designed for B.Tech Semester University Examinations</div>
        </div>
      </main>

      {/* Modals */}
      {isUploadOpen && (
        <UploadPaperModal
          course={selectedCourse}
          onClose={() => setIsUploadOpen(false)}
          onQuestionsExtracted={handleQuestionsExtracted}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
        />
      )}

      {isAddCourseOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseOpen(false)}
          onAddCourse={handleAddCourse}
        />
      )}

      {isExportPdfOpen && (
        <ExportPdfModal
          course={selectedCourse}
          daysRemaining={daysRemaining}
          onClose={() => setIsExportPdfOpen(false)}
          onExportSuccess={(filename) => {
            showToast(`Downloaded formatted dossier: ${filename}`);
          }}
        />
      )}

      {isDictionaryOpen && (
        <CourseDictionaryModal
          course={selectedCourse}
          onClose={() => setIsDictionaryOpen(false)}
          onSelectTerm={() => {
            setActiveTab('pyqs');
          }}
        />
      )}

      {isProfileOpen && (
        <StudentProfileModal
          selectedCourse={selectedCourse}
          courses={courses}
          onSelectCourse={handleSelectCourse}
          onClose={() => setIsProfileOpen(false)}
          onUpdateDaysRemaining={(d) => setDaysRemaining(d)}
        />
      )}
    </div>
  );
}
