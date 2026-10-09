import React, { useState } from 'react';
import { Course, TopicWeightage } from '../types';
import { calculateTopicWeightages } from '../utils/analyticsEngine';
import {
  computeTopicExamImportance,
  computeCourseExamIntelligenceSummary,
  reMapCourseQuestionsWithEmbeddings
} from '../utils/examImportanceService';
import {
  TrendingUp,
  Award,
  Zap,
  Target,
  BarChart3,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Brain,
  Layers,
  ChevronRight,
  Clock,
  PieChart,
  Calendar,
  Sliders,
  FileText,
  Filter,
  FileDown,
  Check,
  Video,
  RefreshCw,
  SearchCheck
} from 'lucide-react';
import { exportStudyPlanAndAnalyticsPdf } from '../utils/pdfExport';

interface Props {
  course: Course;
  courses: Course[];
  currentSemester: 1 | 2;
  onSelectSemester: (sem: 1 | 2) => void;
  onSelectCourse: (course: Course) => void;
  onNavigateTab: (tab: string, topicId?: string) => void;
  onUpdateCourse?: (updatedCourse: Course) => void;
  showToast?: (message: string) => void;
}

export const WeightageAnalyticsView: React.FC<Props> = ({
  course,
  courses,
  currentSemester,
  onSelectSemester,
  onSelectCourse,
  onNavigateTab,
  onUpdateCourse,
  showToast
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'importance' | 'ranked' | 'trends' | 'distribution'>('importance');
  const [tierFilter, setTierFilter] = useState<'all' | 'Tier 1 (Crucial)' | 'Tier 2 (High Yield)' | 'Tier 3 (Supplementary)'>('all');
  const [examScopeFilter, setExamScopeFilter] = useState<'all' | 'MST-1' | 'MST-2' | 'End-Sem'>('all');
  const [isReVerifying, setIsReVerifying] = useState<boolean>(false);

  // Handle re-verifying and re-mapping all questions using semantic embeddings
  const handleReVerifyEmbeddings = () => {
    setIsReVerifying(true);
    try {
      const reMappedQuestions = reMapCourseQuestionsWithEmbeddings(course);
      const updatedCourse: Course = {
        ...course,
        questions: reMappedQuestions
      };
      if (onUpdateCourse) {
        onUpdateCourse(updatedCourse);
      }
      if (showToast) {
        showToast(`Re-verified & mapped all ${reMappedQuestions.length} questions with high-precision semantic embeddings!`);
      }
    } finally {
      setTimeout(() => setIsReVerifying(false), 500);
    }
  };

  const weightages = calculateTopicWeightages(course);
  const activeTopic = weightages.find((w) => w.topicId === selectedTopicId) || weightages[0];

  const importanceScores = computeTopicExamImportance(course, examScopeFilter);
  const intelligenceSummary = computeCourseExamIntelligenceSummary(course, examScopeFilter);

  const allSubtopicsAcrossUnits = React.useMemo(() => {
    const list: import('../types').SubtopicExamImportance[] = [];
    importanceScores.forEach((s) => {
      if (s.subtopicsAnalysis) {
        list.push(...s.subtopicsAnalysis);
      }
    });
    return list.sort((a, b) => b.appearanceFrequency - a.appearanceFrequency || b.reweightedScore - a.reweightedScore);
  }, [importanceScores]);
  const topSubtopic = allSubtopicsAcrossUnits[0];

  const totalQuestions = course.questions.length;
  const totalMarks = course.questions.reduce((sum, q) => sum + q.marks, 0);
  const allYears = Array.from(new Set(course.questions.map(q => q.paperYear))).sort();

  // Pattern totals
  const overallPatterns = course.questions.reduce((acc, q) => {
    acc[q.questionType] = (acc[q.questionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const overallDifficulty = course.questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredTopics = tierFilter === 'all'
    ? weightages
    : weightages.filter((w) => w.priorityTier === tierFilter);

  const topTopic = weightages[0];
  const semesterCourses = courses.filter((c) => (c.semesterNumber || 1) === currentSemester);

  // Questions mapped to the active topic
  const activeTopicQuestions = course.questions.filter(q => q.topicId === activeTopic.topicId);

  return (
    <div className="space-y-6">
      {/* 1. Semester & Subject Explorer Ribbon */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                IET-DAVV 2024 Scheme Syllabus Subjects
              </h2>
              <p className="text-xs text-slate-400">
                Switch semesters to inspect subject weightage trends, question patterns & revision plans
              </p>
            </div>
          </div>

          {/* Quick Semester Buttons */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => onSelectSemester(1)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentSemester === 1
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semester 1 (6 Subjects)
            </button>
            <button
              onClick={() => onSelectSemester(2)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentSemester === 2
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semester 2 (6 Subjects)
            </button>
          </div>
        </div>

        {/* Semester Subject Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {semesterCourses.map((c) => {
            const isSelected = c.id === course.id;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCourse(c)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                  isSelected
                    ? 'border-indigo-500/80 shadow-md ring-2 ring-indigo-500/30 bg-slate-900'
                    : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900/60'
                }`}
              >
                <div className="h-16 w-full relative overflow-hidden bg-slate-950">
                  {c.heroImageUrl && (
                    <img
                      src={c.heroImageUrl}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg bg-black/70 text-indigo-300 border border-indigo-500/30">
                      {c.code}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold text-white truncate" title={c.name}>
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {c.syllabus.length} Units • {c.questions.length} PYQs
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Hero Subject Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-xl bg-slate-950/80 backdrop-blur-xl">
        {course.heroImageUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={course.heroImageUrl}
              alt={course.name}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80" />
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {course.code} • {course.semester}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Credits: {course.credits}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {allYears.length > 0
                    ? `${allYears.length} Year${allYears.length > 1 ? 's' : ''} Analyzed (${allYears.join(', ')})`
                    : 'Awaiting Paper Uploads'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {course.name} Exam Intelligence
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {totalQuestions > 0
                  ? `Topic weightage computed from ${totalQuestions} past exam questions across ${allYears.length} year${allYears.length > 1 ? 's' : ''}. Prioritize high-yield units to maximize marks in minimal study time.`
                  : 'Upload your university MST or PYQ papers to compute topic weightages, question patterns, and recurrence probabilities.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => exportStudyPlanAndAnalyticsPdf(course)}
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#6366f1]/20 hover:bg-[#6366f1]/30 text-indigo-200 border border-[#6366f1]/40 transition shadow-sm"
                title="Download formatted offline PDF dossier"
              >
                <FileDown className="w-4 h-4 text-indigo-400" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => onNavigateTab('mindmap')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition shadow-md shadow-indigo-600/20"
              >
                <Brain className="w-4 h-4" />
                <span>Concept Mind Maps</span>
              </button>
              <button
                onClick={() => onNavigateTab('revision')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Prioritized Revision Plan</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium">Highest ROI Priority Topic</div>
              <div className="text-sm sm:text-base font-bold text-amber-400 mt-1 truncate" title={topTopic?.topicName}>
                Unit {topTopic?.unit}: {topTopic?.topicName}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Yield: <span className="text-emerald-400 font-semibold">{topTopic?.roiScore}x Marks/Hr</span> ({topTopic?.confidenceScore}% Conf.)
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium">Average Marks Pool / Paper</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                ~{Math.round(totalMarks / Math.max(1, allYears.length))} Marks Pool
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Across {course.syllabus.length} syllabus units
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium">Dominant Question Type</div>
              <div className="text-sm sm:text-base font-bold text-indigo-300 mt-1 capitalize">
                {Object.entries(overallPatterns).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Numerical'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {overallPatterns['derivation'] || 0} Derivations • {overallPatterns['numerical'] || 0} Numericals
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium">Question Difficulty Distribution</div>
              <div className="text-sm sm:text-base font-bold text-emerald-300 mt-1">
                {overallDifficulty['easy'] || 0}E • {overallDifficulty['medium'] || 0}M • {overallDifficulty['hard'] || 0}H
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {Math.round(((overallDifficulty['medium'] || 0) + (overallDifficulty['easy'] || 0)) / Math.max(1, totalQuestions) * 100)}% High-Score Scoring
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Tasks Engine View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setViewTab('importance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              viewTab === 'importance'
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>MST & PYQ Exam Importance</span>
            <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded-full text-white">
              {intelligenceSummary.totalPapersAnalyzed} Papers
            </span>
          </button>
          <button
            onClick={() => setViewTab('ranked')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              viewTab === 'ranked'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Study Priority & ROI</span>
          </button>
          <button
            onClick={() => setViewTab('trends')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              viewTab === 'trends'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Year Marks Trends</span>
          </button>
          <button
            onClick={() => setViewTab('distribution')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              viewTab === 'distribution'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Question-Type Distribution</span>
          </button>
        </div>

        <button
          onClick={() => onNavigateTab('pyqs')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-800/50 transition self-start sm:self-auto cursor-pointer"
        >
          <span>Explore All {totalQuestions} Questions</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Tab 0: Exam Importance & Multi-MST Cross-Referencing Matrix */}
      {viewTab === 'importance' && (
        <div className="space-y-6">
          {/* Executive Summary Metrics Banner */}
          <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cross-Reference Intelligence Service</span>
                  </span>
                  <span className="text-xs text-white/50 font-mono">
                    {intelligenceSummary.totalPapersAnalyzed} Exam Papers Analyzed
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  Topic Exam Frequency, Reweighting & Probability Analysis
                </h2>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed mt-0.5">
                  Cross-references all uploaded MST and End-Sem past papers against syllabus units and subtopics using semantic vector embeddings. Evaluates repeating question frequency, reweighted importance scores, and exact semester MST probabilities.
                </p>
              </div>

              {/* Re-Verify Embeddings & Scope Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleReVerifyEmbeddings}
                  disabled={isReVerifying || course.questions.length === 0}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
                  title="Run TF-IDF and character n-gram cosine vector embeddings to verify all questions against syllabus units"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReVerifying ? 'animate-spin' : ''}`} />
                  <span>{isReVerifying ? 'Vectorizing...' : 'Re-Map Embeddings'}</span>
                </button>

                {/* Target Scope Filter Tabs */}
                <div className="flex items-center gap-1.5 bg-[#0b0b0d] p-1.5 rounded-2xl border border-white/10 shrink-0">
                  {(['all', 'MST-1', 'MST-2', 'End-Sem'] as const).map((scope) => (
                    <button
                      key={scope}
                      onClick={() => setExamScopeFilter(scope)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        examScopeFilter === scope
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {scope === 'all' ? 'All Papers' : scope}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick 4-Metric Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10">
                <span className="text-xs text-white/50 block font-medium">Cross-Referenced Papers</span>
                <span className="text-lg sm:text-xl font-bold text-white mt-1 block">
                  {intelligenceSummary.totalPapersAnalyzed} Papers
                </span>
                <span className="text-[11px] text-indigo-400 font-mono mt-0.5 block">
                  {intelligenceSummary.mstPapersCount} MSTs • {intelligenceSummary.endSemPapersCount} End-Sem for {course.name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10">
                <span className="text-xs text-white/50 block font-medium">Highest Repeating Unit</span>
                <span className="text-lg sm:text-xl font-bold text-amber-300 mt-1 block">
                  {intelligenceSummary.topRankedTopics[0]?.unit ? `Unit ${intelligenceSummary.topRankedTopics[0].unit}` : 'Unit 1'}
                </span>
                <span className="text-[11px] text-amber-400/80 font-mono mt-0.5 block">
                  {intelligenceSummary.topRankedTopics[0]?.appearanceFrequency || 0} Repeated Questions
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10">
                <span className="text-xs text-white/50 block font-medium">Syllabus Coverage</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-1 block">
                  {intelligenceSummary.syllabusCoverageRate}% Tested
                </span>
                <span className="text-[11px] text-emerald-400/80 font-mono mt-0.5 block">
                  {course.syllabus.length} units mapped
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10">
                <span className="text-xs text-white/50 block font-medium">Top Repeating Subtopic</span>
                <span className="text-xs font-bold text-rose-300 mt-1 block truncate">
                  {topSubtopic?.subtopicName || 'Core Syllabus'}
                </span>
                <span className="text-[11px] text-rose-400 font-mono mt-0.5 block">
                  {topSubtopic ? `${topSubtopic.appearanceFrequency} Questions (${topSubtopic.questionNature} Basis)` : 'Highest Repeating'}
                </span>
              </div>
            </div>
          </div>

          {/* Topic Importance Cards List */}
          <div className="space-y-4">
            {importanceScores.map((item, index) => {
              const scorePercent = item.examImportanceScore;
              const isTier1 = item.importanceTier.includes('Tier 1');
              const isTier2 = item.importanceTier.includes('Tier 2');

              return (
                <div
                  key={item.topicId}
                  className="p-5 sm:p-6 rounded-3xl bg-[#151518] border border-white/10 hover:border-white/20 transition-all shadow-md space-y-4"
                >
                  {/* Header Row: Unit Tag, Topic Title, Score Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isTier1
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                            : isTier2
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        }`}
                      >
                        U{item.unit}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400">
                            Unit {item.unit}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                              isTier1
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                : isTier2
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {item.importanceTier}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 truncate">
                          {item.topicName}
                        </h3>
                      </div>
                    </div>

                    {/* Reweighted Score Gauge Badge */}
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                          Reweighted Score
                        </div>
                        <div className="text-xl font-black text-amber-300 leading-tight">
                          {item.reweightedScore}
                          <span className="text-xs text-white/40 font-normal">/100</span>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl bg-[#0b0b0d] border border-white/10 flex flex-col items-center justify-center font-mono shadow-inner">
                        <span className="font-black text-xs text-rose-400">{item.appearanceFrequency} Repeated</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{item.examProbability}% Prob</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Recurrence Frequency / Probability Alignment */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                      <span>Recurrence Frequency & Probability Alignment</span>
                      <span className="text-amber-300 font-bold">
                        {item.appearanceFrequency} Questions Repeated • {item.examProbability}% MST Likelihood
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[#0b0b0d] rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(10, item.reweightedScore))}%` }}
                      />
                    </div>
                  </div>

                  {/* 3 Analytics Pillars: Recurrence Frequency Repeating, Reweighted Score, Calculated Probability */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#0b0b0d] border border-white/10 text-xs space-y-1">
                      <span className="text-white/50 block font-semibold text-[11px] uppercase tracking-wider">
                        Recurrence Frequency (Repeating)
                      </span>
                      <span className="text-lg font-black text-rose-300 block font-mono">
                        {item.appearanceFrequency} Questions Repeated
                      </span>
                      <span className="text-[10px] text-white/40 font-mono block">
                        Repeated {item.appearanceFrequency} times across uploaded exam papers (Main priority factor)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0b0b0d] border border-white/10 text-xs space-y-1">
                      <span className="text-white/50 block font-semibold text-[11px] uppercase tracking-wider">
                        Reweighted Score
                      </span>
                      <span className="text-lg font-black text-amber-300 block font-mono">
                        {item.reweightedScore} / 100
                      </span>
                      <span className="text-[10px] text-white/40 font-mono block">
                        Reweighted from frequency (55%), marks weightage (35%), and probability (10%)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0b0b0d] border border-white/10 text-xs space-y-1">
                      <span className="text-white/50 block font-semibold text-[11px] uppercase tracking-wider">
                        Calculated MST Probability
                      </span>
                      <span className="text-lg font-black text-emerald-300 block font-mono">
                        {item.examProbability}% Probability
                      </span>
                      <span className="text-[10px] text-white/40 font-mono block">
                        Appeared in {item.mstPapersAppearedCount} of {item.totalMstPapersCount || Math.max(1, item.mstPapersAppearedCount)} uploaded MSTs for this course
                      </span>
                    </div>
                  </div>

                  {/* "Found in this MST" Evidence Panel */}
                  <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-indigo-500/20 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                          Found in this MST / Exam Archive:
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                          {item.appearedPaperTags.length > 0 ? `${item.appearedPaperTags.length} Confirmed Matches` : '0 Matches'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-indigo-300 font-semibold">
                        {item.mstPapersAppearedCount > 0
                          ? `Found in ${item.mstPapersAppearedCount} of ${item.totalMstPapersCount || item.mstPapersAppearedCount} Mid-Sem Tests (${item.examProbability}% Probability • ${item.appearanceFrequency} Questions Repeated)`
                          : 'Not yet detected in uploaded Mid-Sem papers'}
                      </span>
                    </div>

                    {item.appearedPaperTags.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {item.appearedPaperTags.map((tag, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 rounded-xl bg-[#151518] border border-white/10 hover:border-indigo-500/40 transition text-xs space-y-1.5 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono font-bold text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                <span>Found in {tag.examType} {tag.year}</span>
                              </span>
                              <span className="font-mono font-extrabold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 text-[10px]">
                                {tag.marks ? `${tag.marks} Marks` : '6 Marks'}
                              </span>
                            </div>
                            <div className="text-[11px] text-white/70 line-clamp-1 font-mono">
                              {tag.paperName}
                            </div>
                            {tag.matchedKeywords.length > 0 && (
                              <div className="text-[10px] text-indigo-300/80 font-mono flex items-center gap-1">
                                <SearchCheck className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="truncate">{tag.matchedKeywords.join(' • ')}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/10 text-xs text-white/50 text-center">
                        Upload your university MST question papers to see exact question numbers, marks, and appearance frequency for Unit {item.unit}.
                      </div>
                    )}
                  </div>

                  {/* Subtopics & Question Classification (Numerical / Derivation / Theory Basis) */}
                  {item.subtopicsAnalysis && item.subtopicsAnalysis.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#0e0e11] border border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            Subunit & Subtopic Breakdown ({item.subtopicsAnalysis.length} Subtopics)
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Classified on numerical, derivation & theory basis
                        </span>
                      </div>

                      <div className="space-y-2">
                        {item.subtopicsAnalysis.map((sub, sIdx) => {
                          const isNumerical = sub.questionNature === 'Numerical';
                          const isDerivation = sub.questionNature === 'Derivation';

                          return (
                            <div
                              key={sub.subtopicId || sIdx}
                              className="p-3 rounded-xl bg-[#151518] border border-white/5 hover:border-white/15 transition space-y-2 text-xs"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                  <span
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                                      isNumerical
                                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                        : isDerivation
                                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                    }`}
                                  >
                                    {sub.questionNature} Basis
                                  </span>
                                  <h4 className="font-semibold text-white truncate text-xs sm:text-sm">
                                    {sub.subtopicName}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                    {sub.appearanceFrequency} Repeated
                                  </span>
                                  <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    Reweighted {sub.reweightedScore}/100
                                  </span>
                                  <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                    {sub.examProbability}% Prob
                                  </span>
                                </div>
                              </div>

                              {/* Subtopic MST Appearances */}
                              {sub.foundInMsts && sub.foundInMsts.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-white/40 font-mono">Found in:</span>
                                  {sub.foundInMsts.map((mst, mIdx) => (
                                    <span
                                      key={mIdx}
                                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1"
                                      title={mst.snippet}
                                    >
                                      <span>{mst.examType} {mst.year}</span>
                                      <span className="text-white/40">({mst.questionNumber} • {mst.marks}M)</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actionable Strategy & Practice Links */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <p className="text-white/80 leading-relaxed">
                        <strong className="text-amber-200">Exam Strategy:</strong> {item.recommendedPrepStrategy}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onNavigateTab('pyqs', item.topicId)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 transition cursor-pointer active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Practice PYQs</span>
                      </button>
                      <button
                        onClick={() => onNavigateTab('videos')}
                        className="px-3 py-1.5 rounded-xl bg-[#0b0b0d] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-rose-400" />
                        <span>Videos</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Tab 1: Ranked Study Priority List (Task 4) */}
      {viewTab === 'ranked' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Ranked Priority List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Study Priority Hierarchy (Ranked by Marks/Hour ROI)
                </h2>
                <p className="text-xs text-slate-400">
                  Tells students exactly which topics deserve the most study time and why
                </p>
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
                {(['all', 'Tier 1 (Crucial)', 'Tier 2 (High Yield)', 'Tier 3 (Supplementary)'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      tierFilter === tier
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tier === 'all' ? 'All' : tier.replace('Tier ', 'T')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredTopics.map((topicWeight, index) => {
                const isSelected = activeTopic?.topicId === topicWeight.topicId;
                const isTier1 = topicWeight.priorityTier === 'Tier 1 (Crucial)';
                const isTier2 = topicWeight.priorityTier === 'Tier 2 (High Yield)';

                return (
                  <div
                    key={topicWeight.topicId}
                    onClick={() => setSelectedTopicId(topicWeight.topicId)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900/95 border-indigo-500 shadow-lg ring-1 ring-indigo-500/40'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                            isTier1
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                              : isTier2
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-400">
                              Unit {topicWeight.unit}
                            </span>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isTier1
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : isTier2
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {topicWeight.priorityTier}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              {topicWeight.confidenceScore}% Confidence
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                            {topicWeight.topicName}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                          {topicWeight.roiScore}x ROI Yield
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          ~{topicWeight.averageMarksPerPaper} Marks / paper
                        </div>
                      </div>
                    </div>

                    {/* Reasoning Box */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <span className="text-indigo-400 font-semibold mr-1">Predictive Reasoning:</span>
                      {topicWeight.predictiveReasoning}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                        <span>{topicWeight.questionCount} Questions Analyzed</span>
                        <span>•</span>
                        <span>{topicWeight.frequencyPercentage}% Exam Weightage</span>
                        <span>•</span>
                        <span>Recurrence: {Object.values(topicWeight.yearlyMarks).filter(m => m > 0).length}/{allYears.length} Years</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('mindmap', topicWeight.topicId);
                          }}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span>Mind Map</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Topic Deep-Dive Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {activeTopic && (
              <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      U{activeTopic.unit}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {activeTopic.topicName}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {activeTopic.priorityTier} • {activeTopic.confidenceScore}% Confidence Score
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {activeTopic.roiScore}x ROI
                  </span>
                </div>

                {/* 1. Year-by-Year Marks Trend (2020-2024) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Yearly Marks Trend</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Avg: ~{activeTopic.averageMarksPerPaper}M / exam
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs pt-1">
                    {allYears.map((yr) => {
                      const marks = activeTopic.yearlyMarks[yr] || 0;
                      const maxMarkInSet = Math.max(...Object.values(activeTopic.yearlyMarks), 18);
                      const heightPercent = Math.max(15, Math.round((marks / maxMarkInSet) * 100));

                      return (
                        <div key={yr} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                          <div className="text-[10px] text-slate-400 font-mono">{yr}</div>
                          <div className="w-full bg-slate-900 rounded-lg h-12 flex items-end justify-center p-1">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-md transition-all ${
                                marks >= 14
                                  ? 'bg-amber-400'
                                  : marks >= 8
                                  ? 'bg-indigo-500'
                                  : marks > 0
                                  ? 'bg-indigo-700'
                                  : 'bg-slate-800'
                              }`}
                            />
                          </div>
                          <div className="text-xs font-bold text-white">
                            {marks}M
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Question Type Breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Question Type Pattern</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Derivations</div>
                      <div className="text-sm font-bold text-purple-400 mt-0.5">
                        {activeTopic.questionTypeBreakdown.derivation}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Numericals</div>
                      <div className="text-sm font-bold text-blue-400 mt-0.5">
                        {activeTopic.questionTypeBreakdown.numerical}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Theory / Concepts</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">
                        {activeTopic.questionTypeBreakdown.theory}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Difficulty Distribution */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Difficulty Distribution</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-emerald-400 font-semibold">Easy (Scoring)</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {activeTopic.difficultyBreakdown.easy}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-amber-400 font-semibold">Medium</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {activeTopic.difficultyBreakdown.medium}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] text-rose-400 font-semibold">Hard (Deep)</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {activeTopic.difficultyBreakdown.hard}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Why This Deserves Study Time (Reasoning) */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Why This Deserves Study Time</span>
                  </div>
                  <p className="text-xs text-indigo-200/90 leading-relaxed">
                    {activeTopic.predictiveReasoning}
                  </p>
                </div>

                {/* 5. Prescribed Reference Book Strategy */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Prescribed Textbook Chapters To Master</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeTopic.recommendedBookPages}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onNavigateTab('mindmap', activeTopic.topicId)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Open Mind Map</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('pyqs', activeTopic.topicId)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                  >
                    <span>View {activeTopicQuestions.length} PYQs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Multi-Year Marks Trends Comparison Matrix (Task 3) */}
      {viewTab === 'trends' && (
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 backdrop-blur-xl shadow-lg space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Multi-Year Marks Trends & Recurrence Matrix across {allYears.join(', ')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis of marks awarded per syllabus unit across consecutive university examinations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Syllabus Topic</th>
                  <th className="py-3 px-3 text-center">Priority Tier</th>
                  {allYears.map(yr => (
                    <th key={yr} className="py-3 px-3 text-center">{yr} Exam</th>
                  ))}
                  <th className="py-3 px-3 text-center">Avg Marks</th>
                  <th className="py-3 px-3 text-center">Recurrence %</th>
                  <th className="py-3 px-3 text-right">ROI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {weightages.map((t, idx) => {
                  const yearsPresent = Object.values(t.yearlyMarks).filter(m => m > 0).length;
                  const recurrencePct = Math.round((yearsPresent / allYears.length) * 100);

                  return (
                    <tr
                      key={t.topicId}
                      onClick={() => {
                        setSelectedTopicId(t.topicId);
                        setViewTab('ranked');
                      }}
                      className="hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">
                          Unit {t.unit}: {t.topicName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {t.questionCount} Questions analyzed
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            t.priorityTier === 'Tier 1 (Crucial)'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : t.priorityTier === 'Tier 2 (High Yield)'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {t.priorityTier.split(' ')[0]} {t.priorityTier.split(' ')[1]}
                        </span>
                      </td>
                      {allYears.map(yr => {
                        const marks = t.yearlyMarks[yr] || 0;
                        return (
                          <td key={yr} className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-lg font-bold font-mono ${
                                marks >= 14
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : marks >= 7
                                  ? 'bg-indigo-500/15 text-indigo-300'
                                  : marks > 0
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              {marks > 0 ? `${marks}M` : '—'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-3 px-3 text-center font-bold text-white">
                        ~{t.averageMarksPerPaper}M
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-semibold ${recurrencePct === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {recurrencePct}% ({yearsPresent}/{allYears.length} yrs)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                          {t.roiScore}x
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Question-Type & Difficulty Distribution (Task 3 Pattern Breakdown) */}
      {viewTab === 'distribution' && (
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 backdrop-blur-xl shadow-lg space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Question-Type & Difficulty Distribution Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Understand the mathematical structure of exam questions: Derivations vs Numericals vs Theory, and difficulty tiering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Pattern Cards */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Question Format Distribution</span>
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Derivations (Proofs & Theorems)', count: overallPatterns['derivation'] || 0, color: 'bg-purple-500', text: 'text-purple-300' },
                  { label: 'Numericals (Calculations & Problem Solving)', count: overallPatterns['numerical'] || 0, color: 'bg-blue-500', text: 'text-blue-300' },
                  { label: 'Theory & Conceptual Explanations', count: overallPatterns['theory'] || 0, color: 'bg-emerald-500', text: 'text-emerald-300' },
                  { label: 'Diagrams & Schematic Design', count: overallPatterns['diagram_design'] || 0, color: 'bg-amber-500', text: 'text-amber-300' }
                ].map((item) => {
                  const pct = Math.round((item.count / Math.max(1, totalQuestions)) * 100);
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className={`font-bold ${item.text}`}>{item.count} Questions ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className={`h-full ${item.color} rounded-full`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overall Difficulty Cards */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Difficulty Level Distribution</span>
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Easy (Scoring & Direct Formulas)', count: overallDifficulty['easy'] || 0, color: 'bg-emerald-500', text: 'text-emerald-300' },
                  { label: 'Medium (Standard Step Problems)', count: overallDifficulty['medium'] || 0, color: 'bg-amber-500', text: 'text-amber-300' },
                  { label: 'Hard (Multi-Concept & Advanced Boundary Cases)', count: overallDifficulty['hard'] || 0, color: 'bg-rose-500', text: 'text-rose-300' }
                ].map((item) => {
                  const pct = Math.round((item.count / Math.max(1, totalQuestions)) * 100);
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className={`font-bold ${item.text}`}>{item.count} Questions ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className={`h-full ${item.color} rounded-full`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
