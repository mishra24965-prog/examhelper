import React, { useState, useEffect } from 'react';
import { Question, ModelAnswer } from '../types';
import {
  X,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  Calculator,
  FileText,
  Layers,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  formatLatexToStandardMath,
  parseSolutionToDerivationSteps,
  ParsedDerivationStep,
  DerivationLine
} from '../utils/mathNotationFormatter';
import { solvePyqApi } from '../utils/geminiClientService';
import { getTeacherPreferenceForCourse } from '../utils/userTeacherSettingsService';
import { Workflow, GraduationCap as TeacherCap } from 'lucide-react';

interface Props {
  question: Question;
  courseName: string;
  courseId?: string;
  referenceBook?: string;
  onClose: () => void;
}

// Backward compatibility export
export const cleanMathNotation = formatLatexToStandardMath;

export const SolveQuestionModal: React.FC<Props> = ({
  question,
  courseName,
  courseId,
  referenceBook,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [solution, setSolution] = useState<ModelAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flowchart' | 'structured' | 'plain'>('structured');

  const teacherPref = courseId ? getTeacherPreferenceForCourse(courseId) : undefined;

  useEffect(() => {
    let isMounted = true;
    async function fetchSolution() {
      setLoading(true);
      setError(null);

      try {
        const data = await solvePyqApi({
          questionText: question.text,
          marks: question.marks,
          topicName: question.topicName,
          courseName,
          referenceBook: referenceBook || 'Standard University Textbook',
          teacherPreference: teacherPref
        });

        if (isMounted && data && data.solution) {
          const hasFlowchart = Array.isArray(data.solution.flowchartSteps) && data.solution.flowchartSteps.length > 0;
          if (hasFlowchart && (courseName.toLowerCase().includes('chem') || teacherPref?.preferredFormatting?.flowchart)) {
            setViewMode('flowchart');
          }

          setSolution({
            questionId: question.id,
            questionText: question.text,
            marksTotal: question.marks,
            markingRubric: data.solution.markingRubric || [
              { step: 'Step 1: Formula & Given Data', marksAwarded: 2, teacherExpectation: 'Explicit variable declaration & state values' },
              { step: 'Step 2: Core Working & Substitutions', marksAwarded: question.marks - 4, teacherExpectation: 'Step-by-step arithmetic without skipped lines' },
              { step: 'Step 3: Final Answer & Dimensional Units', marksAwarded: 2, teacherExpectation: 'Boxed scalar result with correct engineering units' }
            ],
            fullAnswerMarkdown: data.solution.fullAnswerMarkdown || 'Model solution generation complete.',
            flowchartSteps: data.solution.flowchartSteps || [],
            tailoredTeacherNotes: data.solution.tailoredTeacherNotes || (teacherPref?.customInstructions ? `Tailored to Professor: ${teacherPref.customInstructions}` : undefined),
            diagramDescription: data.solution.diagramDescription,
            teacherProTip: data.solution.teacherProTip || 'Always box your final numerical result with units.',
            commonPitfallToAvoid: data.solution.commonPitfallToAvoid || 'Skipping intermediate substitution steps.'
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error generating teacher solution');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSolution();
    return () => { isMounted = false; };
  }, [question, courseName, referenceBook]);

  // Convert raw solution text to standardized derivation steps
  const derivationSteps: ParsedDerivationStep[] = solution
    ? parseSolutionToDerivationSteps(solution.fullAnswerMarkdown)
    : [];

  const handleCopy = () => {
    if (!solution) return;
    const cleanBody = derivationSteps
      .map((s) => {
        const linesText = s.lines.map((l) => `  • ${l.formatted}`).join('\n');
        const resText = s.finalResult ? `\n  [Final Result: ${s.finalResult}]` : '';
        return `${s.title}\n${linesText}${resText}`;
      })
      .join('\n\n');

    const fullText = `Exam Question (${question.marks} Marks):\n${question.text}\n\nStep-by-Step Derivation Solution:\n${cleanBody}\n\nTeacher Pro-Tip:\n${solution.teacherProTip}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#151518] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-[#e4e4e7]">
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 bg-[#0b0b0d]/90 flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {question.paperYear} • {question.examType}
              </span>
              <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {question.marks} Marks
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Standard Math Notation</span>
              </span>
              <span className="text-xs text-white/50 font-medium truncate">
                {question.topicName}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {question.questionNumber}: {formatLatexToStandardMath(question.text)}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-white/90 flex-1">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold text-white">Synthesizing Clear Step-by-Step Model Answer...</h4>
                <p className="text-xs text-white/50 mt-1 max-w-md mx-auto">
                  Formatting natural mathematical notations, standard formula substitutions, and evaluator marking rubrics.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm">
              <p className="font-semibold">Unable to generate solution:</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          ) : solution ? (
            <>
              {/* Tailored Teacher Mindset Callout */}
              {(solution.tailoredTeacherNotes || teacherPref) && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200">
                  <div className="flex items-center gap-2.5">
                    <TeacherCap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Evaluator Mindset:</strong> {teacherPref?.teacherName || 'University Examiner'} • {teacherPref?.preferredFormatting?.flowchart ? 'Flowcharts & Equations Required' : 'Strict Point-Wise Rubric Applied'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold self-start sm:self-auto border border-amber-500/30">
                    Personalized to Teacher
                  </span>
                </div>
              )}

              {/* Step Marking Rubric Breakdown */}
              <div className="bg-[#0b0b0d] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    University Marking Rubric Breakdown ({solution.marksTotal} Marks Total)
                  </h4>
                  <span className="text-[11px] text-white/40 font-mono">Evaluator Criteria</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {solution.markingRubric.map((rubric, idx) => (
                    <div
                      key={idx}
                      className="bg-[#151518] p-3 rounded-xl border border-white/5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span className="truncate">{formatLatexToStandardMath(rubric.step)}</span>
                        <span className="text-emerald-400 shrink-0 font-mono">+{rubric.marksAwarded}M</span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-tight">
                        {formatLatexToStandardMath(rubric.teacherExpectation)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution View Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {solution.flowchartSteps && solution.flowchartSteps.length > 0 && (
                    <button
                      onClick={() => setViewMode('flowchart')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        viewMode === 'flowchart'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      <Workflow className="w-3.5 h-3.5 text-amber-300" />
                      <span>Visual Flowchart ({solution.flowchartSteps.length} Steps)</span>
                    </button>
                  )}
                  <button
                    onClick={() => setViewMode('structured')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'structured'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Structured Steps</span>
                  </button>
                  <button
                    onClick={() => setViewMode('plain')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'plain'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Simplified Text</span>
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Clean Solution'}</span>
                </button>
              </div>

              {/* View 1: Interactive Visual Flowchart */}
              {viewMode === 'flowchart' && solution.flowchartSteps && solution.flowchartSteps.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Workflow className="w-4 h-4 text-indigo-400" />
                        <span>Sequential Process Flowchart & Mechanism</span>
                      </h4>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        Structured step sequence formatted specifically to satisfy your university evaluator's marking criteria.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold shrink-0">
                      {solution.flowchartSteps.length} Connected Steps
                    </span>
                  </div>

                  <div className="space-y-3">
                    {solution.flowchartSteps.map((node, nIdx) => (
                      <div key={node.stepNumber} className="relative">
                        <div
                          className={`p-4 sm:p-5 rounded-2xl border transition ${
                            node.highlight
                              ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                              : 'bg-[#0b0b0d] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-sm ${
                                  node.highlight
                                    ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                                    : 'bg-indigo-600 text-white shadow-indigo-600/30'
                                }`}
                              >
                                {node.stepNumber}
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                  <span>{node.title}</span>
                                  {node.highlight && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                                      Key Outcome
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                                  {node.detail}
                                </p>
                              </div>
                            </div>
                            {node.arrowTo && (
                              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 shrink-0 hidden sm:inline">
                                Next: {node.arrowTo}
                              </span>
                            )}
                          </div>
                        </div>

                        {nIdx < (solution.flowchartSteps?.length || 0) - 1 && (
                          <div className="flex justify-center my-1.5">
                            <div className="w-0.5 h-4 bg-indigo-500/40 relative">
                              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-r-2 border-b-2 border-indigo-400 rotate-45" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : viewMode === 'structured' ? (
                <div className="space-y-4">
                  {derivationSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-[#0b0b0d] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3.5 transition hover:border-white/20"
                    >
                      {/* Step Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/5 gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                            {step.stepNumber}
                          </div>
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {step.title.replace(/^Step\s+\d+:\s*/i, '')}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider hidden sm:inline">
                          Step {step.stepNumber} of {derivationSteps.length}
                        </span>
                      </div>

                      {/* Derivation Lines with Clear Categorization */}
                      <div className="space-y-2">
                        {step.lines.map((line) => {
                          if (line.kind === 'equation') {
                            return (
                              <div
                                key={line.id}
                                className="p-3 rounded-xl bg-[#131317] border border-indigo-500/20 text-xs sm:text-sm font-mono text-emerald-300 my-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto shadow-inner"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                  <span className="font-semibold text-white/95 whitespace-pre-wrap">
                                    {line.formatted}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-md self-start sm:self-auto border border-indigo-500/25 shrink-0">
                                  {line.annotation || 'Derivation Step'}
                                </span>
                              </div>
                            );
                          }

                          if (line.kind === 'rule') {
                            return (
                              <div
                                key={line.id}
                                className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/25 text-blue-200 text-xs sm:text-sm flex items-start gap-2.5 my-1"
                              >
                                <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 shrink-0 mt-0.5 font-mono">
                                  Rule
                                </span>
                                <span className="flex-1 font-medium">{line.formatted}</span>
                              </div>
                            );
                          }

                          if (line.kind === 'substitution') {
                            return (
                              <div
                                key={line.id}
                                className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/25 text-amber-200 text-xs sm:text-sm flex items-start gap-2.5 my-1"
                              >
                                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 shrink-0 mt-0.5 font-mono">
                                  Substitute
                                </span>
                                <span className="flex-1 font-mono text-white/90">{line.formatted}</span>
                              </div>
                            );
                          }

                          if (line.kind === 'result') {
                            return (
                              <div
                                key={line.id}
                                className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-md my-1.5"
                              >
                                <div className="flex items-center gap-2 font-bold font-sans">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span>Evaluated Step Result:</span>
                                </div>
                                <span className="font-mono font-extrabold text-white bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/40 text-right">
                                  {line.formatted.replace(/^(?:final answer:?|result:?|therefore,?\s*|hence,?\s*)/i, '').trim() || line.formatted}
                                </span>
                              </div>
                            );
                          }

                          // Default textual explanation
                          return (
                            <div
                              key={line.id}
                              className="flex items-start gap-2 text-xs sm:text-sm text-white/80 leading-relaxed font-sans py-0.5"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-1 shrink-0" />
                              <span className="flex-1">{line.formatted}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Prominent Boxed Result Callout */}
                      {step.finalResult && (
                        <div className="pt-2">
                          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-emerald-300">
                            <span className="flex items-center gap-2 font-bold font-sans">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Step {step.stepNumber} Evaluated Result:</span>
                            </span>
                            <span className="font-mono font-extrabold text-white bg-emerald-500/25 px-3.5 py-1.5 rounded-lg border border-emerald-500/50">
                              {step.finalResult}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* View 2: Simplified Text Format (Clean plain text, ready for student notes) */
                <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-white/10 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-white/90 shadow-inner space-y-4">
                  {derivationSteps
                    .map((s) => {
                      const linesText = s.lines.map((l) => `  • ${l.formatted}`).join('\n');
                      const resText = s.finalResult ? `\n  [Result: ${s.finalResult}]` : '';
                      return `${s.title}\n${linesText}${resText}`;
                    })
                    .join('\n\n')}
                </div>
              )}

              {/* Diagram Description if required */}
              {solution.diagramDescription && (
                <div className="bg-indigo-950/20 border border-indigo-500/25 p-4 rounded-2xl space-y-1.5">
                  <h5 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono">
                    <BookOpen className="w-3.5 h-3.5" />
                    Mandatory Examination Diagram & Labels
                  </h5>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {formatLatexToStandardMath(solution.diagramDescription)}
                  </p>
                </div>
              )}

              {/* Teacher Pro-Tip & Deduction Pitfall */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Teacher's Full-Marks Pro-Tip:</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {formatLatexToStandardMath(solution.teacherProTip)}
                  </p>
                </div>

                <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>#1 Deduction Trap to Avoid:</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {formatLatexToStandardMath(solution.commonPitfallToAvoid)}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0b0b0d]/90 flex items-center justify-between text-xs text-white/50">
          <span>Formatted according to IET-DAVV university grading standards (LaTeX-free standard notation).</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            Close Solution
          </button>
        </div>
      </div>
    </div>
  );
};
