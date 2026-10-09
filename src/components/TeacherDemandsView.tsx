import React, { useState } from 'react';
import { Course, TeacherDemandInsight, SyllabusTopic } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  FileText,
  HelpCircle,
  GraduationCap,
  Layers,
  ArrowRight,
  ShieldAlert,
  BookmarkCheck,
  Brain
} from 'lucide-react';

interface Props {
  course: Course;
  initialTopicId?: string;
  onNavigateTab: (tab: string, topicId?: string) => void;
}

export const TeacherDemandsView: React.FC<Props> = ({
  course,
  initialTopicId,
  onNavigateTab
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || course.syllabus[0]?.id || ''
  );
  const [customBookName, setCustomBookName] = useState<string>(
    course.referenceBooks[0]?.title || ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [dynamicInsights, setDynamicInsights] = useState<Record<string, TeacherDemandInsight>>({});
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const selectedTopic = course.syllabus.find((t) => t.id === selectedTopicId) || course.syllabus[0];

  const activeInsight: TeacherDemandInsight = dynamicInsights[selectedTopic?.id] ||
    course.teacherInsights.find((t) => t.topicId === selectedTopic?.id) || {
      topicId: selectedTopic?.id || '',
      topicName: selectedTopic?.title || '',
      gradingMindset: 'IET-DAVV evaluators prioritize structured mathematical derivation steps, standard notation, and explicitly written assumptions. Skipping intermediate calculations directly to the final answer causes up to 50% marks loss.',
      mustIncludeElements: [
        'State all given parameters and standard equations upfront',
        'Neat, labeled diagram with clear directional arrows and axes',
        'Show intermediate arithmetic and substitution steps without mental shortcuts',
        'Final numerical result boxed with proper SI or engineering units'
      ],
      frequentDeductionTraps: [
        'Skipping the base formula statement before substituting numerical values',
        'Missing units or drawing unlabeled coordinate curves',
        'Failing to mention boundary conditions or initial assumptions'
      ],
      teacherCopyPastePattern: `Questions are frequently adapted directly from end-of-chapter solved examples in ${course.referenceBooks[0]?.title || 'prescribed textbooks'}.`,
      bookSectionToPrioritize: `${selectedTopic?.referenceBookChapters || 'Prescribed chapters'}: Focus heavily on solved examples and summary theorem statements.`,
      bookSectionsToSkip: 'Dense theoretical proofs and optional appendices not highlighted in class lectures.'
    };

  const handleRunAiAnalysis = async () => {
    if (!selectedTopic) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const topicQuestions = course.questions.filter((q) => q.topicId === selectedTopic.id);
      const res = await fetch('/api/analyze-teacher-demands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: course.name,
          topicName: selectedTopic.title,
          referenceBooks: customBookName || course.referenceBooks.map((b) => b.title).join(', '),
          questionsSample: topicQuestions.map((q) => ({
            text: q.text,
            marks: q.marks,
            type: q.questionType
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error while analyzing teacher demands');
      }

      if (data.insight) {
        const newInsight: TeacherDemandInsight = {
          topicId: selectedTopic.id,
          topicName: selectedTopic.title,
          gradingMindset: data.insight.gradingMindset,
          mustIncludeElements: data.insight.mustIncludeElements || [],
          frequentDeductionTraps: data.insight.frequentDeductionTraps || [],
          teacherCopyPastePattern: data.insight.teacherCopyPastePattern || '',
          bookSectionToPrioritize: data.insight.bookSectionToPrioritize || '',
          bookSectionsToSkip: data.insight.bookSectionsToSkip || ''
        };

        setDynamicInsights((prev) => ({
          ...prev,
          [selectedTopic.id]: newInsight
        }));
      }
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Failed to contact AI teacher analysis engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Official Book Alignment & Teacher Expectations
              </span>
              <span className="text-xs text-slate-400">
                IET-DAVV 2024 Scheme
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Teacher Grading Mindset & High-Yield Textbook Chapters
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Studying hundreds of textbook pages before MSTs and End-sems is impossible. This view pinpoints the exact textbook chapters to master, what your university evaluator awards marks for, and common deduction traps.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 text-xs text-slate-300 max-w-xs shrink-0 shadow-inner">
            <div className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>The 80/20 Revision Rule</span>
            </div>
            Mastering step-by-step marking rubrics and solved textbook examples yields ~85% of exam marks in ~30% of study time.
          </div>
        </div>
      </div>

      {/* Official Prescribed Books Grid with Visual Covers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Official Prescribed Textbooks (From DAVV PDF Syllabus)</span>
          </h2>
          <span className="text-xs text-slate-400">
            {course.referenceBooks.length} Recommended Books
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.referenceBooks.map((book, idx) => {
            const cover = book.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';
            const isPrimary = book.role.includes('Primary');

            return (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:border-slate-700 transition flex flex-col justify-between backdrop-blur-md"
              >
                <div className="flex gap-3.5 p-4">
                  {/* Book Cover Thumbnail */}
                  <div className="w-16 h-22 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700/80 shadow-md">
                    <img
                      src={cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="space-y-1 min-w-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${
                        isPrimary
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isPrimary ? 'Primary Reference' : 'Problem Practice'}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight truncate" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {book.authors}
                    </p>
                    {book.edition && (
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {book.edition}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-950/70 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>DAVV Course Scheme</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    Prescribed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit Selector Pills */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-semibold text-slate-400">
          Select Syllabus Unit for Deep-Dive Analysis:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {course.syllabus.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800/80 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="opacity-80">Unit {topic.unit}:</span>
                <span>{topic.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Teacher Mindset & Traps (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Evaluator Mindset */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Examiner Mindset for Unit {selectedTopic?.unit} (How Marks Are Given)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              {activeInsight.gradingMindset}
            </p>
          </div>

          {/* Card 2: Must-Include Elements Checklist */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mandatory Step Checklist (Never Skip These)</span>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                Guarantees Full Step Marks
              </span>
            </div>

            <div className="space-y-2">
              {activeInsight.mustIncludeElements.map((elem, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-200"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div>{elem}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Frequent Deduction Traps */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Examiner Marks Deduction Traps</span>
              </div>
              <span className="text-[11px] bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/20 font-semibold">
                Common Mistakes to Avoid
              </span>
            </div>

            <div className="space-y-2">
              {activeInsight.frequentDeductionTraps.map((trap, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm text-rose-200"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    ✕
                  </div>
                  <div>{trap}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Book Strategy for this Unit & AI Custom Scanner (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Chapter Focus for this Unit */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 backdrop-blur-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Chapter Focus for Unit {selectedTopic?.unit}</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-emerald-400">
                High-Yield Sections to Study:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeInsight.bookSectionToPrioritize}
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-rose-400">
                Sections to Skip (Time Wasters):
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeInsight.bookSectionsToSkip}
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-indigo-400">
                Copy-Paste Exam Patterns:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeInsight.teacherCopyPastePattern}
              </p>
            </div>
          </div>

          {/* AI Custom Book Scanner */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Analyze Another Textbook with AI</span>
            </div>
            <p className="text-xs text-slate-400">
              Does your college professor follow a different local author or book for this unit?
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={customBookName}
                onChange={(e) => setCustomBookName(e.target.value)}
                placeholder="e.g. H.K. Das Chapter 5, or C.Ray Wylie"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Textbook Patterns...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze Teacher Demands for this Book</span>
                  </>
                )}
              </button>
            </div>

            {analysisError && (
              <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {analysisError}
              </div>
            )}
          </div>

          {/* Quick Action to view Questions & Mind map */}
          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('mindmap', selectedTopic?.id)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 text-xs font-bold text-slate-200 flex items-center justify-between transition shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Open Unit {selectedTopic?.unit} Concept Mind Map</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </button>

            <button
              onClick={() => onNavigateTab('pyqs', selectedTopic?.id)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 text-xs font-bold text-slate-200 flex items-center justify-between transition shadow-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Practice PYQs for Unit {selectedTopic?.unit}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
