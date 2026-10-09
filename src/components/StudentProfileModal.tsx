import React, { useState, useEffect } from 'react';
import { Course, StudentProfile, SubjectTaskItem, SubjectTrackingData, ExamType } from '../types';
import {
  loadStudentProfile,
  saveStudentProfile,
  loadSubjectTracking,
  saveSubjectTracking,
  loadSubjectTasks,
  saveSubjectTasks
} from '../utils/studentProfile';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Sliders,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  BarChart2,
  CheckSquare,
  Square
} from 'lucide-react';

interface Props {
  selectedCourse: Course;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onClose: () => void;
  onUpdateDaysRemaining?: (days: number) => void;
}

export const StudentProfileModal: React.FC<Props> = ({
  selectedCourse,
  courses,
  onSelectCourse,
  onClose,
  onUpdateDaysRemaining,
}) => {
  // 1. Fixed Student Details (same across all subjects)
  const [profile, setProfile] = useState<StudentProfile>(() => loadStudentProfile());
  const [activeTab, setActiveTab] = useState<'subject_tracking' | 'student_profile'>('subject_tracking');

  // 2. Subject-wise Tracking Data
  const [tracking, setTracking] = useState<SubjectTrackingData>(() =>
    loadSubjectTracking(selectedCourse)
  );

  // 3. Subject-wise Tasks
  const [tasks, setTasks] = useState<SubjectTaskItem[]>(() =>
    loadSubjectTasks(selectedCourse)
  );

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskExamTag, setNewTaskExamTag] = useState<'MST-1' | 'MST-2' | 'End-Sem'>('MST-1');
  const [taskFilter, setTaskFilter] = useState<'All' | 'MST-1' | 'MST-2' | 'End-Sem'>('All');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reload subject data when course changes
  useEffect(() => {
    setTracking(loadSubjectTracking(selectedCourse));
    setTasks(loadSubjectTasks(selectedCourse));
  }, [selectedCourse.id]);

  const handleSaveProfile = () => {
    saveStudentProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleUpdateTracking = (partial: Partial<SubjectTrackingData>) => {
    const updated = { ...tracking, ...partial };
    setTracking(updated);
    saveSubjectTracking(selectedCourse.id, updated);
    if (partial.deadlineDays !== undefined && onUpdateDaysRemaining) {
      onUpdateDaysRemaining(partial.deadlineDays);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    saveSubjectTasks(selectedCourse.id, updatedTasks);

    const completedIds = updatedTasks.filter(t => t.completed).map(t => t.id);
    handleUpdateTracking({ completedTaskIds: completedIds });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: SubjectTaskItem = {
      id: `${selectedCourse.id}-custom-${Date.now()}`,
      text: newTaskText.trim(),
      unit: 1,
      completed: false,
      examTag: newTaskExamTag
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    saveSubjectTasks(selectedCourse.id, updated);
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    saveSubjectTasks(selectedCourse.id, updated);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'All') return true;
    return t.examTag === taskFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#151518] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-[#e4e4e7]">
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 bg-[#0b0b0d]/90 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Student Profile & Subject Tracker
              </span>
              <span className="text-xs text-white/50 font-mono">
                {profile.name} • {selectedCourse.code}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Target Efficiency & Subject Task Tracker
            </h2>
            <p className="text-xs text-white/60">
              Your student profile remains fixed while deadline, efficiency, and task tracking are customized per subject.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-white/10 flex gap-4 bg-[#0b0b0d]/50 shrink-0">
          <button
            onClick={() => setActiveTab('subject_tracking')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'subject_tracking'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>Subject Tracking ({selectedCourse.code})</span>
          </button>

          <button
            onClick={() => setActiveTab('student_profile')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'student_profile'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            <User className="w-4 h-4 text-indigo-400" />
            <span>Student Identity & Details</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'subject_tracking' ? (
            <div className="space-y-6">
              {/* Subject Selector Bar */}
              <div className="p-3 rounded-2xl bg-[#0b0b0d] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 font-mono font-bold flex items-center justify-center text-xs border border-indigo-500/30">
                    {selectedCourse.code}
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block uppercase tracking-wider font-mono">Current Subject</span>
                    <h4 className="text-sm font-bold text-white truncate max-w-xs">{selectedCourse.name}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedCourse.id}
                    onChange={(e) => {
                      const c = courses.find(item => item.id === e.target.value);
                      if (c) onSelectCourse(c);
                    }}
                    className="w-full sm:w-auto bg-[#151518] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Parameters: Target Efficiency & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Efficiency Card */}
                <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      Target Efficiency
                    </span>
                    <span className="text-base font-mono font-extrabold text-emerald-400">
                      {tracking.targetEfficiency}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    value={tracking.targetEfficiency}
                    onChange={(e) => handleUpdateTracking({ targetEfficiency: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>60% (Pass Safe)</span>
                    <span>85% (Distinction)</span>
                    <span>99% (Topper)</span>
                  </div>
                </div>

                {/* Deadline Card */}
                <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Subject Exam Deadline
                    </span>
                    <span className="text-base font-mono font-extrabold text-amber-400">
                      {tracking.deadlineDays} Days Left
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="45"
                      value={tracking.deadlineDays}
                      onChange={(e) => handleUpdateTracking({ deadlineDays: parseInt(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {[7, 14, 21, 30].map(days => (
                      <button
                        key={days}
                        onClick={() => handleUpdateTracking({ deadlineDays: days })}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition ${
                          tracking.deadlineDays === days
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-white/5 text-white/50 border-white/5 hover:text-white'
                        }`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Completion Progress Bar */}
              <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Subject Task Completion</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {completedCount} of {tasks.length} Done ({completionPercent}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Subject Tasks Tracker */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Actionable Tasks for {selectedCourse.code}</span>
                  </h3>

                  {/* Task Filter */}
                  <div className="flex items-center gap-1 bg-[#0b0b0d] p-1 rounded-xl border border-white/10">
                    {(['All', 'MST-1', 'MST-2', 'End-Sem'] as const).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setTaskFilter(tag)}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition ${
                          taskFilter === tag
                            ? 'bg-indigo-600 text-white'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Add Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add specific task (e.g., Solve 2024 MST-1 numericals, revise Carnot derivation)..."
                    className="flex-1 bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newTaskExamTag}
                    onChange={(e) => setNewTaskExamTag(e.target.value as any)}
                    className="bg-[#0b0b0d] border border-white/10 rounded-xl px-2 py-2 text-xs text-white/80 focus:outline-none"
                  >
                    <option value="MST-1">MST-1</option>
                    <option value="MST-2">MST-2</option>
                    <option value="End-Sem">End-Sem</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </form>

                {/* Tasks List */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-2xl">
                      No tasks found for this filter. Add one above!
                    </div>
                  ) : (
                    filteredTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                          task.completed
                            ? 'bg-[#0b0b0d]/50 border-emerald-500/30 text-white/40'
                            : 'bg-[#0b0b0d] border-white/10 text-white/90 hover:border-white/20'
                        }`}
                      >
                        <div
                          onClick={() => handleToggleTask(task.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer select-none min-w-0"
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white text-[10px]'
                              : 'border-white/30 bg-white/5'
                          }`}>
                            {task.completed && '✓'}
                          </div>
                          <span className={`text-xs truncate ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                            {task.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/5">
                            {task.examTag}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 rounded text-white/30 hover:text-rose-400 transition"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Student Identity Form */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                💡 These identity details are global for all subjects in your ExamIntel workspace.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Roll / Enrollment Number</label>
                  <input
                    type="text"
                    value={profile.rollNumber || ''}
                    onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                    placeholder="e.g. 0801CS241042"
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">University / Institute</label>
                  <input
                    type="text"
                    value={profile.college}
                    onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Degree & Branch</label>
                  <input
                    type="text"
                    value={profile.branch || ''}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                    placeholder="e.g. B.Tech Computer Engineering / M.Sc. Applied Maths"
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Profile Details Saved!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition cursor-pointer"
                >
                  Save Global Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0b0b0d] flex items-center justify-between text-xs text-white/50 shrink-0">
          <span>Tracking for: <strong className="text-white">{selectedCourse.name}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
