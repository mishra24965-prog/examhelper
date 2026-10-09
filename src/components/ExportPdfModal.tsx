import React, { useState } from 'react';
import { Course } from '../types';
import { exportStudyPlanAndAnalyticsPdf, ExportPdfOptions } from '../utils/pdfExport';
import {
  FileDown,
  X,
  CheckCircle2,
  Calendar,
  BarChart3,
  BookOpen,
  FileText,
  Sparkles,
  ShieldCheck,
  Clock,
  Printer
} from 'lucide-react';

interface Props {
  course: Course;
  daysRemaining: number;
  onClose: () => void;
  onExportSuccess?: (filename: string) => void;
}

export const ExportPdfModal: React.FC<Props> = ({
  course,
  daysRemaining: initialDays,
  onClose,
  onExportSuccess
}) => {
  const [daysRemaining, setDaysRemaining] = useState<number>(initialDays);
  const [dailyHours, setDailyHours] = useState<number>(3.5);
  const [targetScore, setTargetScore] = useState<string>('90%+ (Distinction)');
  const [includeWeightage, setIncludeWeightage] = useState<boolean>(true);
  const [includeSchedule, setIncludeSchedule] = useState<boolean>(true);
  const [includeFormulas, setIncludeFormulas] = useState<boolean>(true);
  const [includeQuestions, setIncludeQuestions] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      setTimeout(() => {
        const options: ExportPdfOptions = {
          daysRemaining,
          dailyHours,
          targetScore,
          includeWeightageMatrix: includeWeightage,
          includeDailySchedule: includeSchedule,
          includeFormulasAndRubrics: includeFormulas,
          includeQuestionBankSummary: includeQuestions
        };

        const filename = exportStudyPlanAndAnalyticsPdf(course, options);
        setIsExporting(false);
        if (onExportSuccess) {
          onExportSuccess(filename);
        }
        onClose();
      }, 400);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-[#151518] border border-[rgba(228,228,231,0.15)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[rgba(228,228,231,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6366f1]/15 text-[#6366f1] flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#e4e4e7]">
                Export Offline Study Dossier (PDF)
              </h2>
              <span className="label !mb-0 text-[0.65rem]">
                {course.name} ({course.code}) • Semester {course.semesterNumber || 1}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[rgba(228,228,231,0.5)] hover:text-white hover:bg-[rgba(228,228,231,0.08)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Document Summary Card */}
          <div className="p-4 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#e4e4e7]">
                Print-Ready Vector Document
              </div>
              <p className="text-[11px] text-[rgba(228,228,231,0.6)] leading-relaxed">
                Generates a clean, high-contrast, multi-page PDF formatted for both digital tablet reading and physical monochrome printing. Includes syllabus weights, daily spaced review sessions, formulas, and verified anchor PYQs.
              </p>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="space-y-4">
            <span className="label">Study Horizon & Budget</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[rgba(228,228,231,0.7)] block mb-1.5">
                  Exam Horizon (Days)
                </label>
                <div className="flex items-center gap-2">
                  {[7, 14, 21, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysRemaining(days)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                        daysRemaining === days
                          ? 'bg-[#6366f1] text-white'
                          : 'bg-[#0b0b0d] text-[rgba(228,228,231,0.6)] border border-[rgba(228,228,231,0.1)] hover:text-white'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[rgba(228,228,231,0.7)] block mb-1.5">
                  Daily Study Hours: <span className="font-mono text-[#fbbf24]">{dailyHours}h</span>
                </label>
                <input
                  type="range"
                  min="1.5"
                  max="6"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  className="w-full accent-[#6366f1] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Content Inclusions */}
          <div className="space-y-3">
            <span className="label">Select Dossier Sections</span>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)] cursor-pointer hover:border-[rgba(228,228,231,0.2)] transition">
              <input
                type="checkbox"
                checked={includeWeightage}
                onChange={(e) => setIncludeWeightage(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6366f1] cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e4e4e7] flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span>Topic Weightage & Recurrence Intelligence</span>
                </div>
                <div className="text-[11px] text-[rgba(228,228,231,0.5)]">
                  Tier 1-3 ranking, marks-per-paper yield, and confidence scores
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)] cursor-pointer hover:border-[rgba(228,228,231,0.2)] transition">
              <input
                type="checkbox"
                checked={includeSchedule}
                onChange={(e) => setIncludeSchedule(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6366f1] cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e4e4e7] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Day-by-Day Spaced Repetition Revision Plan</span>
                </div>
                <div className="text-[11px] text-[rgba(228,228,231,0.5)]">
                  Daily active recall blocks, printable task checkboxes, and rest schedules
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)] cursor-pointer hover:border-[rgba(228,228,231,0.2)] transition">
              <input
                type="checkbox"
                checked={includeFormulas}
                onChange={(e) => setIncludeFormulas(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6366f1] cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e4e4e7] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Governing Formulas & Professor Marking Rubrics</span>
                </div>
                <div className="text-[11px] text-[rgba(228,228,231,0.5)]">
                  Unit equations cheat sheet, step marks traps, and textbook chapters
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)] cursor-pointer hover:border-[rgba(228,228,231,0.2)] transition">
              <input
                type="checkbox"
                checked={includeQuestions}
                onChange={(e) => setIncludeQuestions(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6366f1] cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#e4e4e7] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Frequent Past Examination Anchor Questions</span>
                </div>
                <div className="text-[11px] text-[rgba(228,228,231,0.5)]">
                  Key university PYQs with marks, question types, and recurring years
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-4 border-t border-[rgba(228,228,231,0.08)] bg-[#111114] flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[rgba(228,228,231,0.45)] hidden sm:block">
            Estimated PDF: ~3-5 Pages (Vector A4)
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium text-[rgba(228,228,231,0.6)] hover:text-white hover:bg-[rgba(228,228,231,0.06)] transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 sm:flex-initial btn-primary !mt-0 flex items-center justify-center gap-2"
            >
              <FileDown className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Generating PDF...' : 'Download Formatted PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
