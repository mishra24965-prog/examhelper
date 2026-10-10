import React, { useState } from 'react';
import { Course, SyllabusTopic, MindMapBranch } from '../types';
import {
  Brain,
  Sparkles,
  BookOpen,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookmarkCheck,
  Clock,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';
import { explainConceptApi } from '../utils/geminiClientService';

interface Props {
  course: Course;
  initialTopicId?: string;
  onNavigateTab: (tab: string, topicId?: string) => void;
}

export const ConceptMindMapView: React.FC<Props> = ({
  course,
  initialTopicId,
  onNavigateTab
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    initialTopicId || course.syllabus[0]?.id || ''
  );
  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number>(0);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiBreakdown, setAiBreakdown] = useState<any>(null);

  const currentTopic = course.syllabus.find((s) => s.id === selectedUnitId) || course.syllabus[0];

  // Default branches fallback if none specified in course mock
  const fallbackBranches: MindMapBranch[] = currentTopic?.subtopics.slice(0, 4).map((sub, idx) => ({
    title: sub.split('(')[0].trim(),
    keyPoints: [
      `Key definition and foundational principles`,
      `Standard mathematical formulation and boundary conditions`,
      `Typical university numerical / derivation application`
    ],
    icon: 'Layers'
  })) || [];

  const branches = currentTopic?.mindMap?.branches && currentTopic.mindMap.branches.length > 0
    ? currentTopic.mindMap.branches
    : fallbackBranches;

  const activeBranch = branches[selectedBranchIndex] || branches[0];

  const handleFetchAiBreakdown = async () => {
    if (!currentTopic) return;
    setIsAiGenerating(true);
    setAiBreakdown(null);

    try {
      const data = await explainConceptApi({
        courseName: course.name,
        unitNumber: currentTopic.unit,
        topicTitle: currentTopic.title,
        subtopics: currentTopic.subtopics,
        referenceBook: course.referenceBooks[0]?.title
      });

      if (data && data.breakdown) {
        setAiBreakdown(data.breakdown);
      }
    } catch (err) {
      console.error('Failed to explain concept:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Unit Selector Strip */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-[#151518] border border-[rgba(228,228,231,0.1)] rounded-2xl p-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="label mr-2 hidden sm:inline-block">Units:</span>
          {course.syllabus.map((unit) => {
            const isSelected = unit.id === currentTopic?.id;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnitId(unit.id);
                  setSelectedBranchIndex(0);
                  setAiBreakdown(null);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#6366f1] text-white font-semibold shadow-md shadow-[#6366f1]/25'
                    : 'text-[rgba(228,228,231,0.6)] hover:text-white hover:bg-[rgba(228,228,231,0.06)]'
                }`}
              >
                <span className="font-mono font-bold text-[11px]">U{unit.unit}</span>
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{unit.title}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleFetchAiBreakdown}
          disabled={isAiGenerating}
          className="btn-primary flex items-center gap-2 !py-1.5 !px-3 !mt-0 shrink-0 text-xs"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
          <span>{isAiGenerating ? 'Synthesizing...' : 'Fast-Track AI Explainer'}</span>
        </button>
      </div>

      {/* AI Fast-Track Breakdown Card (if generated) */}
      {aiBreakdown && (
        <div className="pane border-[#6366f1]/30 bg-[#151518] relative">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(228,228,231,0.08)] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6366f1]/15 text-[#6366f1] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#e4e4e7]">
                  Unit {currentTopic?.unit} Fast-Track Summary
                </h3>
                <span className="label text-[0.65rem] !mb-0">Synthesized for rapid university exam recall</span>
              </div>
            </div>
            <button
              onClick={() => setAiBreakdown(null)}
              className="text-xs text-[rgba(228,228,231,0.5)] hover:text-white px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)]">
              <span className="label text-indigo-400 mb-1.5">Intuitive Essence</span>
              <p className="text-xs text-[rgba(228,228,231,0.8)] leading-relaxed">
                {aiBreakdown.intuitiveSummary}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)]">
              <span className="label text-emerald-400 mb-1.5">Governing Equation</span>
              <div className="formula-box !my-1 text-xs">
                {aiBreakdown.coreDerivationOrFormula}
              </div>
              <p className="text-[11px] text-[rgba(228,228,231,0.6)] mt-2">
                {aiBreakdown.fastTrackCramTip}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)]">
              <span className="label text-amber-400 mb-1.5">#1 Deduction Trap</span>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {aiBreakdown.examTrap}
              </p>
              <div className="text-[11px] font-mono text-[rgba(228,228,231,0.5)] mt-2 pt-2 border-t border-[rgba(228,228,231,0.08)]">
                Target: {aiBreakdown.bookPagesToFocus}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variation 8 Content Scroll Grid (1fr 340px) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left Column: Variation 8 Mind Map Container */}
        <section className="space-y-4">
          <div className="bg-[#151518] border border-[rgba(228,228,231,0.1)] rounded-[24px] p-6 sm:p-10 relative">
            {/* Variation 8: Node Main */}
            <div className="bg-[#6366f1] text-white py-3.5 px-6 rounded-xl text-center mx-auto mb-8 w-fit font-semibold shadow-[0_10px_30px_rgba(99,102,241,0.3)]">
              <span className="label text-white/70 block mb-1">
                Unit {currentTopic?.unit}
              </span>
              <div className="text-sm sm:text-base tracking-tight font-semibold">
                {currentTopic?.title}
              </div>
            </div>

            {/* Connecting subtle SVG lines */}
            <div className="w-full max-w-sm h-8 mx-auto -mt-4 mb-4">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
                <path
                  d="M 50 0 L 50 10 M 50 10 L 15 30 M 50 10 L 85 30"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>

            {/* Variation 8: Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches.slice(0, 3).map((branch, idx) => {
                const isSelected = selectedBranchIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedBranchIndex(idx)}
                    className={`bg-[#0b0b0d] border p-5 rounded-[16px] cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#6366f1] ring-1 ring-[#6366f1]/40'
                        : 'border-[rgba(228,228,231,0.1)] hover:border-[rgba(228,228,231,0.25)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[0.9rem] font-semibold text-[#e4e4e7]">
                        {branch.title}
                      </h4>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                      )}
                    </div>
                    <ul className="list-none text-[0.75rem] text-[rgba(228,228,231,0.55)] space-y-1.5">
                      {branch.keyPoints.slice(0, 2).map((pt, pIdx) => (
                        <li key={pIdx} className="leading-snug">
                          • {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* Node Item 4: Variation 8 Exam Essence item */}
              <div
                className="bg-[#0b0b0d] p-5 rounded-[16px] border border-dashed border-[#6366f1] flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-[0.9rem] font-semibold text-[#e4e4e7] mb-1">
                    Exam Essence
                  </h4>
                  <p className="text-[0.75rem] text-[rgba(228,228,231,0.55)] mt-2 leading-relaxed">
                    {currentTopic?.conceptSummary || 'Focus on higher-order rates of change and polynomial approximations.'}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[rgba(228,228,231,0.06)] flex items-center justify-between text-[11px] font-mono text-[rgba(228,228,231,0.45)]">
                  <span>Target: {currentTopic?.suggestedHours}h Study</span>
                  <span className="text-[#6366f1]">High Output</span>
                </div>
              </div>
            </div>

            {/* Additional branch items if > 3 */}
            {branches.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {branches.slice(3).map((branch, idx) => {
                  const actualIdx = idx + 3;
                  const isSelected = selectedBranchIndex === actualIdx;
                  return (
                    <div
                      key={actualIdx}
                      onClick={() => setSelectedBranchIndex(actualIdx)}
                      className={`bg-[#0b0b0d] border p-5 rounded-[16px] cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#6366f1] ring-1 ring-[#6366f1]/40'
                          : 'border-[rgba(228,228,231,0.1)] hover:border-[rgba(228,228,231,0.25)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[0.9rem] font-semibold text-[#e4e4e7]">
                          {branch.title}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                        )}
                      </div>
                      <ul className="list-none text-[0.75rem] text-[rgba(228,228,231,0.55)] space-y-1.5">
                        {branch.keyPoints.slice(0, 2).map((pt, pIdx) => (
                          <li key={pIdx} className="leading-snug">
                            • {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Variation 8 Sidebar Panes */}
        <aside className="space-y-5">
          {/* Pane 1: Governing Formula */}
          <div className="pane">
            <span className="label">Governing Formula</span>
            
            {currentTopic?.keyFormulas && currentTopic.keyFormulas.length > 0 ? (
              <div className="space-y-2.5 mt-2">
                {currentTopic.keyFormulas.slice(0, 3).map((formula, fIdx) => (
                  <div key={fIdx} className="formula-box">
                    {formula}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 mt-2">
                <div className="formula-box">
                  (u v)_n = Σ (nCr * u_(n-r) * v_r)
                </div>
                <div className="formula-box">
                  ρ = [1 + (y')²]^(3/2) / |y''|
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigateTab('teacher', currentTopic?.id)}
              className="btn-primary w-full mt-4"
            >
              View Rubrics
            </button>
          </div>

          {/* Pane 2: Textbook Focus */}
          <div className="pane">
            <span className="label">Textbook Focus</span>
            <h4 className="text-[0.85rem] font-semibold text-[#e4e4e7] mb-2">
              {course.referenceBooks[0]?.title || 'B.S. Grewal'}
            </h4>
            <p className="text-[0.75rem] text-[rgba(228,228,231,0.55)] leading-relaxed">
              {currentTopic?.referenceBookChapters || 'Chapter 4 & 5 (pp. 75-135); Skip historical proofs.'}
            </p>

            <div className="mt-3 pt-3 border-t border-[rgba(228,228,231,0.08)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400">
                Skip unassigned proofs
              </span>
              <button
                onClick={() => onNavigateTab('pyqs', currentTopic?.id)}
                className="text-[11px] text-[#6366f1] hover:underline font-medium"
              >
                Check PYQs →
              </button>
            </div>
          </div>

          {/* Pane 3: Selected Branch Details */}
          <div className="pane">
            <span className="label">Active Node Focus</span>
            <h4 className="text-[0.85rem] font-semibold text-[#e4e4e7] mb-2">
              {activeBranch.title}
            </h4>
            <div className="space-y-2 mt-2">
              {activeBranch.keyPoints.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  className="p-2.5 rounded-lg bg-[#0b0b0d] border border-[rgba(228,228,231,0.08)] text-[0.75rem] text-[rgba(228,228,231,0.7)] leading-relaxed"
                >
                  {pt}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
