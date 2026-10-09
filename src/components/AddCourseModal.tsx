import React, { useState } from 'react';
import { Course, SyllabusTopic } from '../types';
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onAddCourse: (newCourse: Course) => void;
}

export const AddCourseModal: React.FC<Props> = ({ onClose, onAddCourse }) => {
  const [courseName, setCourseName] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [semesterNumber, setSemesterNumber] = useState<1 | 2>(1);
  const [examTarget, setExamTarget] = useState<'MST-1' | 'MST-2' | 'End-Sem'>('End-Sem');
  const [referenceBookTitle, setReferenceBookTitle] = useState<string>('');
  const [referenceBookAuthor, setReferenceBookAuthor] = useState<string>('');
  const [units, setUnits] = useState<Array<{ title: string; subtopics: string; chapters: string }>>([
    { title: 'Fundamentals & Core Theory', subtopics: 'Definitions, standard assumptions, basic equations', chapters: 'Chapter 1 & 2' },
    { title: 'Analytical Working & Derivations', subtopics: 'Main theorems, mathematical proofs, derivations', chapters: 'Chapter 3 & 4' },
    { title: 'System Applications & Numericals', subtopics: 'University numericals, case examples', chapters: 'Chapter 5' }
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleAddUnit = () => {
    setUnits((prev) => [
      ...prev,
      {
        title: `Unit ${prev.length + 1} Topic`,
        subtopics: 'Key concepts and formulas',
        chapters: `Chapter ${prev.length + 1}`
      }
    ]);
  };

  const handleRemoveUnit = (idx: number) => {
    if (units.length <= 1) return;
    setUnits((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      setError('Please provide a course name');
      return;
    }

    const syllabus: SyllabusTopic[] = units.map((u, idx) => ({
      id: `custom-u${idx + 1}`,
      unit: idx + 1,
      title: u.title.trim() || `Unit ${idx + 1}`,
      description: u.subtopics.trim(),
      subtopics: u.subtopics.split(',').map((s) => s.trim()).filter(Boolean),
      referenceBookChapters: u.chapters.trim() || 'Prescribed Chapters',
      suggestedHours: 8,
      conceptSummary: `Foundational concepts and exam-oriented problem-solving in ${u.title.trim()}.`,
      keyFormulas: ['Standard Governing Equation: Y = f(X)'],
      mindMap: {
        centralTopic: u.title.trim(),
        branches: [
          { title: 'Core Principles', keyPoints: ['Fundamental definitions', 'Assumptions and notations'], icon: 'Sigma' },
          { title: 'Derivations', keyPoints: ['Step-by-step working', 'Boundary conditions'], icon: 'TrendingUp' },
          { title: 'Exam Applications', keyPoints: ['Standard repeated numericals', 'Units & SI verification'], icon: 'Box' }
        ]
      }
    }));

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: courseName.trim(),
      code: courseCode.trim() || (semesterNumber === 1 ? '1RAES9' : '2RAES9'),
      semester: `Semester-${semesterNumber === 1 ? 'I' : 'II'} (IET-DAVV Scheme)`,
      semesterNumber,
      credits: '4 (L:3, T:1, P:0)',
      examTarget,
      syllabus,
      referenceBooks: [
        {
          title: referenceBookTitle.trim() || 'University Prescribed Textbook',
          authors: referenceBookAuthor.trim() || 'Standard Author',
          role: 'Primary Teacher Reference',
          coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
        }
      ],
      questions: [],
      teacherInsights: syllabus.map((s) => ({
        topicId: s.id,
        topicName: s.title,
        gradingMindset: 'Evaluator checks for step-by-step reasoning, clear diagrams, and standard equations.',
        mustIncludeElements: ['Formula statement', 'Given data specification', 'Intermediate arithmetic', 'Final answer boxed'],
        frequentDeductionTraps: ['Skipping steps', 'Missing units', 'Unclear handwriting on diagrams'],
        teacherCopyPastePattern: 'Standard solved textbook problems.',
        bookSectionToPrioritize: `${s.referenceBookChapters}: Focus on end-of-chapter solved examples.`,
        bookSectionsToSkip: 'Historical context and optional appendices.'
      })),
      videoRecommendations: []
    };

    onAddCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Custom Course Workspace</h2>
              <p className="text-xs text-slate-400">Add course syllabus units and reference textbook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">Course Name *</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Applied Mathematics-I"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">Subject Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. 1RABS1 or 2RAES1"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Semester Selector */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Target Semester (1st Year Scheme)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSemesterNumber(1)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                  semesterNumber === 1
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🎓 Semester 1 (July–Dec)
              </button>
              <button
                type="button"
                onClick={() => setSemesterNumber(2)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                  semesterNumber === 2
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Semester 2 (Jan–June)
              </button>
            </div>
          </div>

          {/* Target Exam */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1.5">Exam Target</label>
            <div className="flex gap-2">
              {(['MST-1', 'MST-2', 'End-Sem'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setExamTarget(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    examTarget === t
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Reference Book */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <span className="font-bold text-slate-200 block">Primary Prescribed Reference Book</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Book Title</label>
                <input
                  type="text"
                  value={referenceBookTitle}
                  onChange={(e) => setReferenceBookTitle(e.target.value)}
                  placeholder="e.g. Higher Engineering Mathematics"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Author(s)</label>
                <input
                  type="text"
                  value={referenceBookAuthor}
                  onChange={(e) => setReferenceBookAuthor(e.target.value)}
                  placeholder="e.g. B. S. Grewal"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Syllabus Units */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Syllabus Units ({units.length})</span>
              <button
                type="button"
                onClick={handleAddUnit}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Unit</span>
              </button>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {units.map((u, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400 text-xs">Unit {idx + 1}</span>
                    {units.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUnit(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={u.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUnits((prev) => prev.map((item, i) => i === idx ? { ...item, title: val } : item));
                    }}
                    placeholder="Unit Title"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={u.subtopics}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUnits((prev) => prev.map((item, i) => i === idx ? { ...item, subtopics: val } : item));
                    }}
                    placeholder="Key topics (comma-separated)"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Save Course Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
