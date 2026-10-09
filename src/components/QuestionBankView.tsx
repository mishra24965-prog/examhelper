import React, { useState, useMemo } from 'react';
import { Course, Question, QuestionType, DifficultyLevel, ExamType, ExamPaperRecord } from '../types';
import { SolveQuestionModal } from './SolveQuestionModal';
import { inferQuestionMapping } from '../utils/analyticsEngine';
import {
  computeTopicExamImportance,
  getQuestionExamImportance,
  reMapCourseQuestionsWithEmbeddings
} from '../utils/examImportanceService';
import { formatLatexToStandardMath } from '../utils/mathNotationFormatter';
import {
  Search,
  Filter,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  Brain,
  ShieldCheck,
  Tag,
  Shuffle,
  UploadCloud,
  FileCheck,
  ArrowUpDown,
  Zap,
  Pencil,
  Trash2,
  X,
  Check,
  RotateCcw,
  Plus,
  FileText,
  RefreshCw
} from 'lucide-react';
import { loadStoredPapers, saveStoredPapers, isDemoPaper, isDemoQuestion } from '../utils/paperStorage';

interface Props {
  course: Course;
  initialTopicFilter?: string;
  onNavigateTab: (tab: string, topicId?: string) => void;
  onOpenUpload?: () => void;
  onOpenDictionary?: () => void;
  onUpdateCourse?: (updatedCourse: Course) => void;
  showToast?: (message: string) => void;
}

export const QuestionBankView: React.FC<Props> = ({
  course,
  initialTopicFilter,
  onNavigateTab,
  onOpenUpload,
  onOpenDictionary,
  onUpdateCourse,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topicFilter, setTopicFilter] = useState<string>(initialTopicFilter || 'all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [paperFilter, setPaperFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'importance' | 'marks' | 'year'>('importance');
  const [onlyHighProbability, setOnlyHighProbability] = useState<boolean>(false);
  const [selectedQuestionForSolving, setSelectedQuestionForSolving] = useState<Question | null>(null);

  // Keep ONLY what user uploaded - filter out any demo questions
  const [localQuestions, setLocalQuestions] = useState<Question[]>(() =>
    course.questions.filter((q) => !isDemoQuestion(q))
  );

  // Stored papers: keep ONLY what user uploaded - purge demo papers
  const storedPapers = useMemo<ExamPaperRecord[]>(() => {
    const papers = course.examPapers || loadStoredPapers(course.id);
    return papers.filter((p) => !isDemoPaper(p));
  }, [course.examPapers, course.id]);

  // Paper Editing State
  const [editingPaper, setEditingPaper] = useState<ExamPaperRecord | null>(null);
  const [editPaperName, setEditPaperName] = useState<string>('');
  const [editPaperYear, setEditPaperYear] = useState<number>(2024);
  const [editPaperExamType, setEditPaperExamType] = useState<ExamType>('MST-1');

  // Paper Deletion State
  const [paperToDelete, setPaperToDelete] = useState<ExamPaperRecord | null>(null);

  // Individual Question Editing State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editQNumber, setEditQNumber] = useState<string>('');
  const [editQText, setEditQText] = useState<string>('');
  const [editQYear, setEditQYear] = useState<number>(2024);
  const [editQExamType, setEditQExamType] = useState<ExamType>('MST-1');
  const [editQMarks, setEditQMarks] = useState<number>(7);
  const [editQTopicId, setEditQTopicId] = useState<string>('');
  const [editQType, setEditQType] = useState<QuestionType>('numerical');
  const [editQDifficulty, setEditQDifficulty] = useState<DifficultyLevel>('medium');

  // Question Deletion State
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isReVerifying, setIsReVerifying] = useState<boolean>(false);

  const handleReVerifyEmbeddings = () => {
    setIsReVerifying(true);
    try {
      const reMapped = reMapCourseQuestionsWithEmbeddings(course);
      setLocalQuestions(reMapped);
      const updatedCourse: Course = {
        ...course,
        questions: reMapped
      };
      if (onUpdateCourse) {
        onUpdateCourse(updatedCourse);
      }
      if (showToast) {
        showToast(`Re-mapped all ${reMapped.length} questions using semantic vector embeddings!`);
      }
    } finally {
      setTimeout(() => setIsReVerifying(false), 500);
    }
  };

  // Compute live cross-referenced exam importance scores strictly from user uploaded papers
  const topicImportanceScores = useMemo(() => {
    return computeTopicExamImportance(
      course,
      paperFilter === 'all' ? 'all' : (paperFilter as any),
      storedPapers
    );
  }, [course, paperFilter, storedPapers]);

  // Sync if course questions change
  React.useEffect(() => {
    setLocalQuestions(course.questions.filter((q) => !isDemoQuestion(q)));
  }, [course.questions]);

  // Handle Paper Edit Open
  const handleStartEditPaper = (paper: ExamPaperRecord) => {
    setEditingPaper(paper);
    setEditPaperName(paper.name);
    setEditPaperYear(paper.year);
    setEditPaperExamType(paper.examType);
  };

  // Save Paper Name & Year Update
  const handleSaveEditPaper = () => {
    if (!editingPaper) return;

    const oldYear = editingPaper.year;
    const oldExamType = editingPaper.examType;
    const oldName = editingPaper.name;
    const newName = editPaperName.trim() || `${editPaperExamType} Examination ${editPaperYear}`;

    // Update paper in storedPapers
    const updatedPapers = storedPapers.map((p) => {
      if (p.id === editingPaper.id) {
        return {
          ...p,
          name: newName,
          year: editPaperYear,
          examType: editPaperExamType
        };
      }
      return p;
    });

    // Synchronize all questions associated with this paper
    let syncedQuestionsCount = 0;
    const updatedQuestions = localQuestions.map((q) => {
      const isAssociated =
        (q.paperId && q.paperId === editingPaper.id) ||
        (!q.paperId && q.paperYear === oldYear && q.examType === oldExamType);

      if (isAssociated) {
        syncedQuestionsCount++;
        const cleanedTags = (q.tags || []).filter(
          (t) => t !== String(oldYear) && t !== oldExamType && t !== oldName
        );
        return {
          ...q,
          paperId: editingPaper.id,
          paperName: newName,
          paperYear: editPaperYear,
          examType: editPaperExamType,
          tags: Array.from(new Set([...cleanedTags, String(editPaperYear), editPaperExamType, newName, 'PYQ']))
        };
      }
      return q;
    });

    setLocalQuestions(updatedQuestions);
    saveStoredPapers(course.id, updatedPapers);

    const updatedCourse: Course = {
      ...course,
      examPapers: updatedPapers,
      questions: updatedQuestions
    };

    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }

    if (showToast) {
      showToast(`Updated paper "${newName}" (Year ${editPaperYear}) & synced ${syncedQuestionsCount} questions!`);
    }

    setEditingPaper(null);
  };

  // Handle Delete Paper
  const handleConfirmDeletePaper = () => {
    if (!paperToDelete) return;

    const paperId = paperToDelete.id;
    const paperYear = paperToDelete.year;
    const paperExamType = paperToDelete.examType;

    const updatedPapers = storedPapers.filter((p) => p.id !== paperId);
    const updatedQuestions = localQuestions.filter((q) => {
      if (q.paperId && q.paperId === paperId) return false;
      if (!q.paperId && q.paperYear === paperYear && q.examType === paperExamType) return false;
      return true;
    });

    setLocalQuestions(updatedQuestions);
    saveStoredPapers(course.id, updatedPapers);

    const updatedCourse: Course = {
      ...course,
      examPapers: updatedPapers,
      questions: updatedQuestions
    };

    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }

    if (showToast) {
      showToast(`Removed paper "${paperToDelete.name}" and its extracted questions.`);
    }

    if (paperFilter === paperExamType) {
      setPaperFilter('all');
    }

    setPaperToDelete(null);
  };

  // Handle Question Edit Open
  const handleStartEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setEditQNumber(q.questionNumber || 'Q1');
    setEditQText(q.text || '');
    setEditQYear(q.paperYear || 2024);
    setEditQExamType(q.examType || 'MST-1');
    setEditQMarks(q.marks || 7);
    setEditQTopicId(q.topicId || (course.syllabus[0]?.id || ''));
    setEditQType(q.questionType || 'numerical');
    setEditQDifficulty(q.difficulty || 'medium');
  };

  // Save Individual Question Update
  const handleSaveEditQuestion = () => {
    if (!editingQuestion) return;

    const targetTopic = course.syllabus.find((s) => s.id === editQTopicId) || course.syllabus[0];
    const newTopicName = targetTopic ? targetTopic.title : editingQuestion.topicName;

    const updatedQuestions = localQuestions.map((q) => {
      if (q.id === editingQuestion.id) {
        const cleanedTags = (q.tags || []).filter(
          (t) => t !== String(q.paperYear) && t !== q.examType
        );
        return {
          ...q,
          questionNumber: editQNumber.trim() || 'Q1',
          text: editQText.trim(),
          paperYear: editQYear,
          examType: editQExamType,
          marks: editQMarks,
          topicId: editQTopicId,
          topicName: newTopicName,
          questionType: editQType,
          difficulty: editQDifficulty,
          tags: Array.from(new Set([...cleanedTags, String(editQYear), editQExamType, 'PYQ']))
        };
      }
      return q;
    });

    setLocalQuestions(updatedQuestions);

    const updatedCourse: Course = {
      ...course,
      questions: updatedQuestions
    };

    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }

    if (showToast) {
      showToast(`Updated ${editQNumber} (Year ${editQYear}) successfully.`);
    }

    setEditingQuestion(null);
  };

  // Delete Individual Question
  const handleConfirmDeleteQuestion = () => {
    if (!questionToDelete) return;

    const updatedQuestions = localQuestions.filter((q) => q.id !== questionToDelete.id);
    setLocalQuestions(updatedQuestions);

    const updatedCourse: Course = {
      ...course,
      questions: updatedQuestions
    };

    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }

    if (showToast) {
      showToast(`Deleted question from bank.`);
    }

    setQuestionToDelete(null);
  };

  // Remap Question Topic
  const handleRemapQuestion = (qId: string, newTopicId: string) => {
    const targetTopic = course.syllabus.find((s) => s.id === newTopicId);
    if (!targetTopic) return;

    const updatedQuestions = localQuestions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          topicId: targetTopic.id,
          topicName: targetTopic.title,
          mappingConfidence: 98,
          semanticMatchReason: `Verified and mapped to Unit ${targetTopic.unit}: ${targetTopic.title}`
        };
      }
      return q;
    });

    setLocalQuestions(updatedQuestions);

    const updatedCourse: Course = {
      ...course,
      questions: updatedQuestions
    };

    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }
  };

  const filteredAndSortedQuestions = useMemo(() => {
    let list = localQuestions.filter((q) => {
      if (topicFilter !== 'all' && q.topicId !== topicFilter) return false;
      if (typeFilter !== 'all' && q.questionType !== typeFilter) return false;
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
      if (paperFilter !== 'all' && q.examType !== paperFilter && String(q.paperYear) !== paperFilter) return false;

      if (onlyHighProbability) {
        const info = getQuestionExamImportance(q, topicImportanceScores);
        if (info.importanceScore < 75) return false;
      }

      if (searchQuery.trim()) {
        const qLower = searchQuery.toLowerCase();
        const matchText = q.text.toLowerCase().includes(qLower);
        const matchTopic = q.topicName.toLowerCase().includes(qLower);
        const matchTags = q.tags?.some((t) => t.toLowerCase().includes(qLower));
        if (!matchText && !matchTopic && !matchTags) return false;
      }
      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'importance') {
        const scoreA = getQuestionExamImportance(a, topicImportanceScores).importanceScore;
        const scoreB = getQuestionExamImportance(b, topicImportanceScores).importanceScore;
        return scoreB - scoreA;
      } else if (sortBy === 'marks') {
        return (b.marks || 0) - (a.marks || 0);
      } else {
        return (b.paperYear || 0) - (a.paperYear || 0);
      }
    });

    return list;
  }, [localQuestions, topicFilter, typeFilter, difficultyFilter, paperFilter, onlyHighProbability, searchQuery, sortBy, topicImportanceScores]);

  const filteredQuestions = filteredAndSortedQuestions;

  // Multi-MST Repetition & Syllabus Cross-Reference Probabilities per Unit
  const unitProbabilities = useMemo(() => {
    return course.syllabus.map((unit) => {
      const importanceItem = topicImportanceScores.find((t) => t.topicId === unit.id);
      const prob = importanceItem ? importanceItem.examImportanceScore : (storedPapers.length > 0 ? 50 : 0);
      const qCount = localQuestions.filter((q) => q.topicId === unit.id).length;
      const appearedCount = importanceItem?.appearedPaperTags?.length || importanceItem?.totalPapersCrossReferenced || 0;
      return {
        unitId: unit.id,
        unitNumber: unit.unit,
        unitTitle: unit.title,
        probability: prob,
        questionCount: qCount,
        papersAppeared: appearedCount
      };
    });
  }, [course.syllabus, topicImportanceScores, localQuestions, storedPapers.length]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Exam Intelligence Repository
            </span>
            <span className="text-xs text-white/50 font-mono">
              {storedPapers.length > 0
                ? `${localQuestions.length} Questions Indexed across ${storedPapers.length} Uploaded Past Paper${storedPapers.length > 1 ? 's' : ''}`
                : 'Awaiting Paper Uploads • Only your uploaded papers will appear'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Past Papers Archive & Question Bank
          </h1>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            Every question cleanly ingested from your university PDFs, scans, and past papers. Rename papers, update years, map questions to syllabus units, and generate step-by-step model answers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenDictionary && (
            <button
              onClick={onOpenDictionary}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Dictionary</span>
            </button>
          )}

          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Past Exam Paper</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-MST Cross-Paper Probability Analysis Banner ("Probability of the Game") */}
      <div className="bg-[#151518] border border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              ⚡
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>
                  {storedPapers.length > 0
                    ? `Cross-MST Probability Engine (${storedPapers.length} Uploaded Paper${storedPapers.length > 1 ? 's' : ''} Analyzed)`
                    : 'Cross-MST Probability Engine (Awaiting Paper Uploads)'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Syllabus Mapped
                </span>
              </h3>
              <p className="text-xs text-white/50">
                {storedPapers.length > 0
                  ? `Synthesis across all ${storedPapers.length} uploaded MST and End-Sem papers mapping questions to syllabus categories to compute appearance probability.`
                  : 'Upload your past MST-1, MST-2, or End-Sem question papers to cross-reference with Units 1–5 and calculate recurrence probabilities.'}
              </p>
            </div>
          </div>

          {/* Exam Filter Chips */}
          {storedPapers.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Papers' },
                { id: 'MST-1', label: 'MST-1' },
                { id: 'MST-2', label: 'MST-2' },
                { id: 'End-Sem', label: 'End-Sem' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPaperFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    paperFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unit Repetition Probability Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unitProbabilities.map((up) => (
            <div
              key={up.unitId}
              onClick={() => setTopicFilter(topicFilter === up.unitId ? 'all' : up.unitId)}
              className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                topicFilter === up.unitId
                  ? 'bg-indigo-950/40 border-indigo-500 text-white'
                  : 'bg-[#0b0b0d] border-white/5 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-indigo-400 font-bold block">
                  Unit {up.unitNumber} Category
                </span>
                <h5 className="font-semibold text-white truncate max-w-[170px]">
                  {up.unitTitle}
                </h5>
                <span className="text-[10px] text-white/40 font-mono">
                  {storedPapers.length > 0
                    ? `${up.questionCount} questions in ${up.papersAppeared} papers`
                    : 'Upload papers to cross-reference'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-xs font-mono font-extrabold px-2 py-1 rounded-lg ${
                    up.probability >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : up.probability >= 50
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {up.probability > 0 ? `${up.probability}%` : '—'}
                </span>
                <span className="block text-[9px] text-white/40 font-mono mt-0.5">Probability</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stored Past Papers Archive Strip with Rename & Update Year Controls */}
      <div className="p-5 rounded-3xl bg-[#151518] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-sm">
              Stored Past Papers Archive ({storedPapers.length})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Only Your Uploads
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReVerifyEmbeddings}
              disabled={isReVerifying || localQuestions.length === 0}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 font-bold transition text-xs disabled:opacity-50 cursor-pointer shadow-sm"
              title="Re-run TF-IDF & subword n-gram vector embeddings to map all questions to syllabus units"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReVerifying ? 'animate-spin' : ''}`} />
              <span>{isReVerifying ? 'Vectorizing...' : 'Re-Map Embeddings'}</span>
            </button>
            {onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 font-bold transition text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Paper</span>
              </button>
            )}
          </div>
        </div>

        {storedPapers.length === 0 ? (
          /* Clean Empty Archive State */
          <div className="p-8 rounded-2xl bg-[#0b0b0d] border border-dashed border-white/15 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-sm font-bold text-white">
                No Past Exam Papers Uploaded Yet
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Demo placeholder papers have been removed. Your question bank will strictly hold only what you upload. Ingest your university MST or PYQ papers (PDF, image scans, or pasted text) to get started!
              </p>
            </div>
            {onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Your First Exam Paper (PDF / Image / Text)</span>
              </button>
            )}
          </div>
        ) : (
          /* Grid of Uploaded Papers with Rename & Change Year Action */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {storedPapers.map((paper) => {
              const isSelected = paperFilter === paper.examType;
              return (
                <div
                  key={paper.id}
                  onClick={() => setPaperFilter(isSelected ? 'all' : paper.examType)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-3 relative group ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                      : 'bg-[#0b0b0d] border-white/5 hover:border-white/20 text-white/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          {paper.examType}
                        </span>
                        <span className="text-xs font-mono text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          Year {paper.year}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          {paper.sourceType || 'PDF'}
                        </span>
                      </div>

                      {/* Action buttons: Edit (Rename / Change Year) & Delete */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleStartEditPaper(paper)}
                          title="Rename paper title & update exam year"
                          className="p-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1 text-[11px] font-medium"
                        >
                          <Pencil className="w-3 h-3" />
                          <span className="hidden group-hover:inline">Rename / Year</span>
                        </button>
                        <button
                          onClick={() => setPaperToDelete(paper)}
                          title="Remove paper and its questions"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <h5 className="text-sm font-bold text-white line-clamp-1" title={paper.name}>
                      {paper.name}
                    </h5>

                    <p className="text-[11px] text-white/40 mt-1 font-mono">
                      {paper.questionCount} Questions • {paper.totalMarks} Marks • {paper.uploadedAt || 'Uploaded'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                    <span className="text-white/40">
                      {isSelected ? 'Currently Filtering' : 'Click to filter questions'}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg font-bold ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-white/50 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Active Filter' : 'Filter'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#151518] border border-white/10 p-5 rounded-3xl space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, formula, or tag (e.g. Leibnitz, Taylor, Curvature, Jacobian, Carnot)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Unit / Topic Filter */}
          <div className="w-full md:w-64">
            <select
              aria-label="Filter by Topic"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="all">All Syllabus Units ({course.syllabus.length})</option>
              {course.syllabus.map((s) => (
                <option key={s.id} value={s.id}>
                  Unit {s.unit}: {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Filter */}
          <div className="w-full md:w-44">
            <select
              aria-label="Filter by Question Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="theory">Theory / Concept</option>
              <option value="numerical">Numerical Practice</option>
              <option value="derivation">Derivation / Proof</option>
              <option value="diagram_design">Design & Diagrams</option>
              <option value="code">Code / Algo</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="w-full md:w-36">
            <select
              aria-label="Filter by Difficulty"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (Pass Shield)</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard (Top Scorer)</option>
            </select>
          </div>
        </div>

        {/* Secondary Bar: Sorting, high probability toggle, and active counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </div>
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setSortBy('importance')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  sortBy === 'importance' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exam Importance
              </button>
              <button
                onClick={() => setSortBy('marks')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  sortBy === 'marks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Highest Marks
              </button>
              <button
                onClick={() => setSortBy('year')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  sortBy === 'year' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Latest Year
              </button>
            </div>

            <button
              onClick={() => setOnlyHighProbability(!onlyHighProbability)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition cursor-pointer ${
                onlyHighProbability
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Only High Probability (≥75%)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-mono">
              Showing <span className="text-white font-bold">{filteredQuestions.length}</span> of {localQuestions.length} questions
            </span>
            {(searchQuery || topicFilter !== 'all' || typeFilter !== 'all' || difficultyFilter !== 'all' || paperFilter !== 'all' || onlyHighProbability) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTopicFilter('all');
                  setTypeFilter('all');
                  setDifficultyFilter('all');
                  setPaperFilter('all');
                  setOnlyHighProbability(false);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-[#151518] border border-white/10 rounded-3xl p-10 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-white">
                {localQuestions.length === 0
                  ? 'Question Bank is Empty'
                  : 'No Questions Found Matching Filters'}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {localQuestions.length === 0
                  ? 'All demo items have been removed. Ingest an exam question paper (PDF or photo) to extract and categorize questions into this workspace.'
                  : 'Try clearing your search query or switching your syllabus unit and difficulty filters.'}
              </p>
            </div>
            {localQuestions.length === 0 && onOpenUpload ? (
              <button
                onClick={onOpenUpload}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Past Exam Paper</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTopicFilter('all');
                  setTypeFilter('all');
                  setDifficultyFilter('all');
                  setPaperFilter('all');
                  setOnlyHighProbability(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition hover:bg-indigo-600/30"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isHard = q.difficulty === 'hard';
            const isMedium = q.difficulty === 'medium';
            const confidence = q.mappingConfidence || 88;
            const importanceInfo = getQuestionExamImportance(q, topicImportanceScores);

            return (
              <div
                key={q.id}
                className="bg-[#151518] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-md hover:border-indigo-500/40 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                      {q.questionNumber || 'Q1'}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {q.marks} Marks
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-amber-300 border border-white/10">
                      Year {q.paperYear}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10">
                      {q.examType}
                    </span>

                    {/* Found In Paper Badge */}
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-200 border border-indigo-500/30 flex items-center gap-1 font-semibold">
                      <span className="text-white/40 text-[10px]">Found in:</span>
                      <strong className="text-white truncate max-w-[200px]" title={q.paperName || `${q.examType} ${q.paperYear}`}>
                        {q.paperName || `${q.examType} ${q.paperYear}`}
                      </strong>
                    </span>

                    {/* Live Exam Importance Badge */}
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${importanceInfo.colorClass}`}>
                        {importanceInfo.badgeLabel}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">
                        {importanceInfo.recurrenceProbability}% Probability
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        isHard
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isMedium
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {q.questionType}
                    </span>

                    {/* Edit question and Delete question buttons */}
                    <button
                      onClick={() => handleStartEditQuestion(q)}
                      title="Edit question text, year, marks, or number"
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setQuestionToDelete(q)}
                      title="Delete question from bank"
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Formatted Question Text without raw LaTeX */}
                <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans">
                  {formatLatexToStandardMath(q.text)}
                </p>

                {/* Semantic Classification & Re-Mapping Toolbar */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-400 font-medium">Mapped Topic:</span>
                    <span className="text-indigo-300 font-bold bg-indigo-500/15 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                      {q.topicName}
                    </span>
                    {q.subtopicName && (
                      <span className="text-amber-200/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 text-[11px] truncate max-w-[280px]" title={q.subtopicName}>
                        Subunit: {q.subtopicName}
                      </span>
                    )}
                    {q.questionNature && (
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                        q.questionNature === 'Numerical'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : q.questionNature === 'Derivation'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {q.questionNature} Basis
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {confidence}% Semantic Match
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      • {importanceInfo.mstRatioLabel} ({importanceInfo.importanceTier})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] text-slate-400">Change Unit:</span>
                    <select
                      value={q.topicId}
                      onChange={(e) => handleRemapQuestion(q.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {course.syllabus.map((s) => (
                        <option key={s.id} value={s.id}>
                          Unit {s.unit}: {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Footer / Tags & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {q.tags?.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="text-[11px] bg-slate-950/80 text-slate-400 px-2.5 py-0.5 rounded-lg border border-slate-800/80 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigateTab('mindmap', q.topicId)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Brain className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mind Map</span>
                    </button>

                    <button
                      onClick={() => setSelectedQuestionForSolving(q)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Generate Model Answer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Model Answer Solver Modal */}
      {selectedQuestionForSolving && (
        <SolveQuestionModal
          question={selectedQuestionForSolving}
          courseName={course.name}
          referenceBook={course.referenceBooks[0]?.title}
          onClose={() => setSelectedQuestionForSolving(null)}
        />
      )}

      {/* Modal 1: Rename & Update Year of Uploaded Paper */}
      {editingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151518] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-[#e4e4e7]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Rename & Update Year of Uploaded Paper
                  </h3>
                  <p className="text-xs text-white/50">
                    Update the paper title, examination year, or category.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingPaper(null)}
                className="p-1.5 text-white/50 hover:text-white rounded-xl hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Paper Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Paper Title / Name
                </label>
                <input
                  type="text"
                  value={editPaperName}
                  onChange={(e) => setEditPaperName(e.target.value)}
                  placeholder="e.g. MST-1 Examination 2025"
                  className="w-full bg-[#0b0b0d] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Examination Year Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Examination Year
                  </label>
                  <span className="text-[11px] text-white/40 font-mono">
                    Quick Select:
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {[2026, 2025, 2024, 2023, 2022, 2021].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setEditPaperYear(yr)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition ${
                        editPaperYear === yr
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#0b0b0d] text-white/60 hover:text-white border border-white/10'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="1990"
                  max="2035"
                  value={editPaperYear}
                  onChange={(e) => setEditPaperYear(parseInt(e.target.value) || 2024)}
                  className="w-full bg-[#0b0b0d] border border-white/10 rounded-2xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Exam Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Exam Type / Session
                </label>
                <select
                  value={editPaperExamType}
                  onChange={(e) => setEditPaperExamType(e.target.value as ExamType)}
                  className="w-full bg-[#0b0b0d] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="MST-1">MST-1 (Mid-Sem Test 1)</option>
                  <option value="MST-2">MST-2 (Mid-Sem Test 2)</option>
                  <option value="End-Sem">End-Sem (Final University Exam)</option>
                  <option value="Quiz">Quiz / Class Test</option>
                  <option value="Re-Exam">Re-Exam / ATKT</option>
                </select>
              </div>

              {/* Sync Info Callout */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5 leading-relaxed">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Automatic Question Sync:</span>
                  Saving will update this paper and automatically update the year badge, exam type, and tags across all questions extracted from this paper. Live recurrence probabilities will refresh immediately.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingPaper(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditPaper}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save & Sync Questions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Delete Paper Confirmation */}
      {paperToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151518] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#e4e4e7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Uploaded Paper?</h3>
                <p className="text-xs text-white/50">{paperToDelete.name}</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-white">"{paperToDelete.name}" (Year {paperToDelete.year})</span>?
              This will remove the paper and all questions extracted from it from your Question Bank and update topic weightage analytics.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPaperToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePaper}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                Delete Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Individual Question */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#151518] border border-white/10 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-[#e4e4e7] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Question Details</h3>
                  <p className="text-xs text-white/50">Modify question text, year, marks, or syllabus mapping</p>
                </div>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1.5 text-white/50 hover:text-white rounded-xl hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Question No.
                  </label>
                  <input
                    type="text"
                    value={editQNumber}
                    onChange={(e) => setEditQNumber(e.target.value)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="Q1 (a)"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editQYear}
                    onChange={(e) => setEditQYear(parseInt(e.target.value) || 2024)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={editQExamType}
                    onChange={(e) => setEditQExamType(e.target.value as ExamType)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-2 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="MST-1">MST-1</option>
                    <option value="MST-2">MST-2</option>
                    <option value="End-Sem">End-Sem</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    value={editQMarks}
                    onChange={(e) => setEditQMarks(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Question Text
                </label>
                <textarea
                  rows={4}
                  value={editQText}
                  onChange={(e) => setEditQText(e.target.value)}
                  className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Syllabus Unit Assignment
                </label>
                <select
                  value={editQTopicId}
                  onChange={(e) => setEditQTopicId(e.target.value)}
                  className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer"
                >
                  {course.syllabus.map((s) => (
                    <option key={s.id} value={s.id}>
                      Unit {s.unit}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Question Type
                  </label>
                  <select
                    value={editQType}
                    onChange={(e) => setEditQType(e.target.value as QuestionType)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="theory">Theory</option>
                    <option value="numerical">Numerical</option>
                    <option value="derivation">Derivation</option>
                    <option value="diagram_design">Design & Diagrams</option>
                    <option value="code">Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={editQDifficulty}
                    onChange={(e) => setEditQDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditQuestion}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Question Confirmation */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151518] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#e4e4e7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Question?</h3>
                <p className="text-xs text-white/50">{questionToDelete.questionNumber || 'Question'}</p>
              </div>
            </div>

            <p className="text-xs text-white/70 line-clamp-3">
              "{questionToDelete.text}"
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
