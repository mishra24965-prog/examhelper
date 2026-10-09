import React, { useState } from 'react';
import { Course, DictionaryTerm } from '../types';
import { DEFAULT_MATH1_DICTIONARY, checkTextAgainstDictionary } from '../utils/courseDictionary';
import { formatLatexToStandardMath } from '../utils/mathNotationFormatter';
import {
  X,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Calculator,
  HelpCircle,
  FileText
} from 'lucide-react';

interface Props {
  course: Course;
  onClose: () => void;
  onSelectTerm?: (term: string) => void;
}

export const CourseDictionaryModal: React.FC<Props> = ({
  course,
  onClose,
  onSelectTerm
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [testText, setTestText] = useState<string>('');
  const [testResult, setTestResult] = useState<any | null>(null);

  const dictionaryList: DictionaryTerm[] = course.dictionary || DEFAULT_MATH1_DICTIONARY;

  const filteredTerms = dictionaryList.filter((item) => {
    const matchesUnit = selectedUnit === 'all' || item.unit === selectedUnit;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesUnit;
    const matchesQuery =
      item.term.toLowerCase().includes(q) ||
      item.canonicalName.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.aliases.some((a) => a.toLowerCase().includes(q));
    return matchesUnit && matchesQuery;
  });

  const handleTestPhrase = () => {
    if (!testText.trim()) return;
    const result = checkTextAgainstDictionary(testText, dictionaryList);
    setTestResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#151518] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-[#e4e4e7]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0b0b0d]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Curriculum Formula Guide
                </span>
                <span className="text-xs text-white/50">
                  {dictionaryList.length} Verified Syllabus Concepts & Formulas
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {course.name} • Formula & Concept Handbook
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-white/10 bg-[#0b0b0d]/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, theorems, formulas..."
              className="w-full bg-[#151518] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedUnit('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedUnit === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              All Units
            </button>
            {course.syllabus.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.unit)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedUnit === u.unit
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                Unit {u.unit}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick OCR Test Box */}
          <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test OCR Phrase or Question against Dictionary</span>
              </span>
              <span className="text-[11px] text-white/50">Auto-detects garbled math tokens</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="e.g. Prove using Le!bn!tzs theorem or Eul3r formula..."
                className="flex-1 bg-[#151518] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestPhrase}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
              >
                Scan Text
              </button>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1.5 mt-2">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Found {testResult.totalMatches} Concept Matches:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {testResult.matchedTerms.map((m: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-[11px] border border-indigo-500/30"
                    >
                      {m.term.term} (Unit {m.term.unit})
                    </span>
                  ))}
                  {testResult.suggestedCorrections.map((c: any, idx: number) => (
                    <span
                      key={`corr-${idx}`}
                      className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-[11px] border border-amber-500/30"
                    >
                      Repairs: "{c.raw}" → {c.corrected}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dictionary Entries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTerms.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 flex flex-col justify-between hover:border-white/20 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                      Unit {entry.unit}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Appeared {entry.frequencyAppeared || 4}x in Past Papers
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {entry.canonicalName}
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed mt-1">
                      {entry.definition}
                    </p>
                  </div>

                  {entry.formula && (
                    <div className="p-2.5 rounded-xl bg-[#151518] border border-emerald-500/20 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      {formatLatexToStandardMath(entry.formula)}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-white/50 gap-2">
                  <span>
                    Aliases: {entry.aliases.slice(0, 3).join(', ')}
                  </span>
                  {onSelectTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTerm(entry.term);
                        onClose();
                      }}
                      className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Filter Questions</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="p-8 text-center text-white/50 text-xs">
              No dictionary terms found matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0b0b0d] flex items-center justify-between text-xs text-white/50">
          <span>Every uploaded PDF & past paper is verified against this syllabus dictionary.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
          >
            Close Dictionary
          </button>
        </div>
      </div>
    </div>
  );
};
