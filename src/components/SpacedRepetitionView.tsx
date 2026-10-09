import React, { useState, useEffect } from 'react';
import { Course, StudyPlan, SpacedRepetitionSession } from '../types';
import { generateLocalStudyPlan } from '../utils/analyticsEngine';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Sparkles,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertCircle,
  FileDown,
  Video,
  ExternalLink,
  Play
} from 'lucide-react';
import { exportStudyPlanAndAnalyticsPdf } from '../utils/pdfExport';

interface Props {
  course: Course;
  daysRemaining: number;
  setDaysRemaining: (days: number) => void;
}

export const SpacedRepetitionView: React.FC<Props> = ({
  course,
  daysRemaining,
  setDaysRemaining,
}) => {
  const [dailyHours, setDailyHours] = useState<number>(3.5);
  const [targetScore, setTargetScore] = useState<string>('90%+ (Distinction / 9+ CGPA)');
  const [examScope, setExamScope] = useState<'all' | 'MST-1' | 'MST-2'>('all');
  const [plan, setPlan] = useState<StudyPlan>(() =>
    generateLocalStudyPlan(course, daysRemaining, dailyHours, targetScore)
  );
  const [completedTaskKeys, setCompletedTaskKeys] = useState<Set<string>>(new Set());
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [topicMastery, setTopicMastery] = useState<Record<string, 'again' | 'hard' | 'good' | 'easy'>>({});

  useEffect(() => {
    // If MST-1 is chosen, create course with only units 1 and 2
    const filteredCourse = examScope === 'all'
      ? course
      : {
          ...course,
          syllabus: course.syllabus.filter(u =>
            examScope === 'MST-1' ? u.unit <= 2 : u.unit >= 3 && u.unit <= 4
          )
        };
    setPlan(generateLocalStudyPlan(filteredCourse, daysRemaining, dailyHours, targetScore));
  }, [course, daysRemaining, dailyHours, targetScore, examScope]);

  const toggleTask = (day: number, sIndex: number, tIndex: number) => {
    const key = `${day}-${sIndex}-${tIndex}`;
    setCompletedTaskKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  let totalTasks = 0;
  plan.dailySchedule.forEach((d) => {
    d.sessions.forEach((s) => {
      totalTasks += s.tasks.length;
    });
  });
  const completedCount = completedTaskKeys.size;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Plan Config */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Spaced Repetition & Daily Revision
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Adaptive Leitner Curve
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Personalized {course.examTarget} Revision Schedule
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Prevents the forgetting curve before your exams. Interleaves Day 1 Deep Study with Day 3 Active Recall and Day 7 Speed Problem Solving.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 shrink-0 shadow-inner">
            <div>
              <div className="text-[11px] text-slate-400">Exam Readiness</div>
              <div className="text-2xl font-extrabold text-indigo-400">{progressPercent}%</div>
              <div className="text-[10px] text-slate-400">{completedCount} of {totalTasks} tasks done</div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Adjust Parameters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Days Until Exam
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="3"
                max="30"
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-xl min-w-[3.5rem] text-center border border-slate-700/80">
                {daysRemaining} d
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Daily Study Time
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-xl min-w-[3.5rem] text-center border border-slate-700/80">
                {dailyHours} h
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Exam Focus Scope
            </label>
            <select
              value={examScope}
              onChange={(e) => setExamScope(e.target.value as any)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="all">End-Semester (All Units)</option>
              <option value="MST-1">MST-1 Focus (Units 1 & 2)</option>
              <option value="MST-2">MST-2 Focus (Units 3 & 4)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Target Grade Goal
            </label>
            <select
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="90%+ (Distinction / 9+ CGPA)">90%+ (Distinction)</option>
              <option value="80%+ (First Class with Distinction)">80%+ (First Class)</option>
              <option value="70%+ (Safe First Class)">70%+ (Safe Class)</option>
              <option value="Passing Threshold (60%+ Guaranteed)">Passing (60%+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Strategic Exam Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plan.strategicAdvice.map((advice, i) => (
          <div key={i} className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-3 backdrop-blur-md">
            <div className="w-6 h-6 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              {i + 1}
            </div>
            <p className="leading-relaxed">{advice}</p>
          </div>
        ))}
      </div>

      {/* Spaced Repetition Days Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span>Day-by-Day Spaced Repetition Roadmap</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Budget: <strong className="text-white">{plan.totalStudyHours}h</strong>
            </span>
          </div>

          <button
            onClick={() => exportStudyPlanAndAnalyticsPdf(course, { daysRemaining, dailyHours, targetScore })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-xs font-semibold shadow-md shadow-[#6366f1]/25 transition active:scale-95"
            title="Download formatted offline PDF dossier"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Plan as PDF</span>
          </button>
        </div>

        <div className="space-y-3">
          {plan.dailySchedule.map((dayPlan) => {
            const isExpanded = expandedDay === dayPlan.day;
            const dayTasks = dayPlan.sessions.flatMap((s) => s.tasks);
            const completedInDay = dayPlan.sessions.reduce((acc, s, sIdx) => {
              return acc + s.tasks.filter((_, tIdx) => completedTaskKeys.has(`${dayPlan.day}-${sIdx}-${tIdx}`)).length;
            }, 0);
            const isDayFinished = dayTasks.length > 0 && completedInDay === dayTasks.length;

            return (
              <div
                key={dayPlan.day}
                className={`border rounded-3xl transition-all overflow-hidden ${
                  isDayFinished
                    ? 'bg-slate-900/60 border-emerald-500/40 shadow-sm'
                    : isExpanded
                    ? 'bg-slate-900/95 border-indigo-500/60 shadow-xl ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? 0 : dayPlan.day)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-bold text-xs ${
                        isDayFinished
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : dayPlan.day === 1
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px]">Day</span>
                      <span className="text-sm">{dayPlan.day}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">{dayPlan.date}</span>
                        {isDayFinished && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                            Completed ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {dayPlan.focusUnits.join(' + ')}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs hidden sm:block">
                      <span className="text-slate-400 font-medium">
                        {completedInDay}/{dayTasks.length} tasks
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Session Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
                    {dayPlan.sessions.map((session, sIdx) => {
                      return (
                        <div
                          key={sIdx}
                          className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                                  session.phase === 'Learn & Derive' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                                  session.phase === 'Active Recall Drill' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                  {session.phase} ({session.intervalName})
                                </span>
                                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  {session.durationHours} Hours Allocated
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-200 mt-1">
                                {session.topicName}
                              </h4>
                            </div>

                            {/* Leitner Topic Mastery Rating */}
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="text-slate-400 mr-1 text-[10px]">Mastery:</span>
                              {(['again', 'hard', 'good', 'easy'] as const).map((m) => (
                                <button
                                  key={m}
                                  onClick={() =>
                                    setTopicMastery((prev) => ({
                                      ...prev,
                                      [session.topicId]: m,
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition ${
                                    topicMastery[session.topicId] === m
                                      ? m === 'again' ? 'bg-rose-600 text-white' :
                                        m === 'hard' ? 'bg-amber-600 text-white' :
                                        m === 'good' ? 'bg-emerald-600 text-white' :
                                        'bg-cyan-600 text-white'
                                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>

                            {/* Curated Working Video Lecture for this Topic */}
                            {(() => {
                              const matchedVid = course.videoRecommendations.find(v => v.topicId === session.topicId) || course.videoRecommendations[0];
                              const youtubeTarget = matchedVid?.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${session.topicName} ${course.name} lecture`)}`;
                              return (
                                <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-6 h-6 rounded-lg bg-rose-600/30 text-rose-300 flex items-center justify-center shrink-0">
                                      <Play className="w-3 h-3 fill-rose-300" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-[10px] text-rose-300 font-bold block truncate">
                                        Curated Video Lecture {matchedVid ? `• ${matchedVid.channel} (${matchedVid.durationMinutes}m)` : ''}
                                      </span>
                                      <span className="text-white/80 font-medium truncate block">
                                        {matchedVid?.title || `Master ${session.topicName}`}
                                      </span>
                                    </div>
                                  </div>
                                  <a
                                    href={youtubeTarget}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition"
                                  >
                                    <span>Watch</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              );
                            })()}

                            {/* Actionable Tasks Checklist */}
                          <div className="space-y-2">
                            {session.tasks.map((task, tIdx) => {
                              const key = `${dayPlan.day}-${sIdx}-${tIdx}`;
                              const isChecked = completedTaskKeys.has(key);

                              return (
                                <div
                                  key={tIdx}
                                  onClick={() => toggleTask(dayPlan.day, sIdx, tIdx)}
                                  className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none text-xs sm:text-sm ${
                                    isChecked
                                      ? 'bg-slate-900/40 border-emerald-500/30 text-slate-400 line-through'
                                      : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition ${
                                      isChecked
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-600 bg-slate-950'
                                    }`}
                                  >
                                    {isChecked && '✓'}
                                  </div>
                                  <span className="leading-snug">{task}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
