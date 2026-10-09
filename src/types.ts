export type QuestionType = 'theory' | 'numerical' | 'derivation' | 'diagram_design' | 'code';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExamType = 'MST-1' | 'MST-2' | 'End-Sem' | 'Quiz' | 'Re-Exam';
export type PriorityTier = 'Tier 1 (Crucial)' | 'Tier 2 (High Yield)' | 'Tier 3 (Supplementary)';

export interface Question {
  id: string;
  paperYear: number;
  examType: ExamType;
  questionNumber: string;
  text: string;
  marks: number;
  topicId: string;
  topicName: string;
  subtopicName?: string;
  questionNature?: 'Numerical' | 'Derivation' | 'Theory';
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  frequencyCount?: number;
  repeatedInYears?: number[];
  mappingConfidence?: number; // e.g. 92% semantic confidence
  semanticMatchReason?: string; // Reason or matching syllabus keywords
  tags: string[];
  paperId?: string;
  paperName?: string;
}

export interface MindMapBranch {
  title: string;
  keyPoints: string[];
  icon?: string;
}

export interface SyllabusTopic {
  id: string;
  unit: number;
  title: string;
  description: string;
  subtopics: string[];
  referenceBookChapters: string;
  suggestedHours: number;
  conceptSummary?: string;
  keyFormulas?: string[];
  mindMap?: {
    centralTopic: string;
    branches: MindMapBranch[];
  };
}

export interface TopicWeightage {
  topicId: string;
  topicName: string;
  unit: number;
  totalMarksAppeared: number;
  averageMarksPerPaper: number;
  frequencyPercentage: number;
  questionCount: number;
  questionTypeBreakdown: {
    theory: number;
    numerical: number;
    derivation: number;
    diagram_design: number;
    code: number;
  };
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  yearlyMarks: { [year: number]: number };
  roiScore: number; // Marks yield per hour invested
  priorityTier: PriorityTier;
  confidenceScore: number; // 0 - 100%
  predictiveReasoning: string;
  recommendedBookPages: string;
  teacherFocusNotes: string;
  appearanceProbability?: number; // 0 - 100% repetition probability in selected exam scope
  papersAppearedCount?: number;   // e.g. appeared in 4 of 4 MST papers
  totalExamPapersAnalyzed?: number;
  targetExamScope?: ExamType | 'all';
}

export interface StudentProfile {
  name: string;
  college: string;
  branch?: string;
  rollNumber?: string;
}

export interface SubjectTaskItem {
  id: string;
  text: string;
  unit: number;
  completed: boolean;
  examTag: 'MST-1' | 'MST-2' | 'End-Sem' | 'All';
}

export interface SubjectTrackingData {
  courseId: string;
  deadlineDays: number;
  targetEfficiency: number; // e.g. 85%
  targetExam: ExamType;
  completedTaskIds: string[];
}

export interface TeacherDemandInsight {
  topicId: string;
  topicName: string;
  gradingMindset: string;
  mustIncludeElements: string[];
  frequentDeductionTraps: string[];
  teacherCopyPastePattern: string;
  bookSectionToPrioritize: string;
  bookSectionsToSkip: string;
}

export interface VideoRecommendation {
  id: string;
  topicId: string;
  topicName: string;
  subtopicName?: string;
  subtopicId?: string;
  unitNumber?: number;
  title: string;
  channel: string;
  durationMinutes: number;
  conceptFocus: string;
  youtubeSearchQuery: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  youtubeVideoId?: string;
  level: 'Beginner' | 'Exam-Cram' | 'Deep Dive' | 'High Yield';
  complexityCategory?: 'Foundation' | 'Standard Exam' | 'Advanced Numerical';
  verified?: boolean;
  queryType?: 'university lecture' | 'derivation';
  keyTimestamps?: { time: string; topic: string }[];
}

export interface SpacedRepetitionSession {
  dayIndex: number;
  dateStr: string;
  topicId: string;
  topicName: string;
  phase: 'Learn & Derive' | 'Review & Formulate' | 'Active Recall Drill' | 'Mock Timed Solving' | 'Final Polish';
  intervalName: 'Day 1' | 'Day 3' | 'Day 7' | 'Day 14' | 'Final Polish';
  durationHours: number;
  tasks: string[];
  completed: boolean;
  userMastery?: 'easy' | 'good' | 'hard' | 'again';
}

export interface StudyPlan {
  examName: string;
  daysRemaining: number;
  dailyHours: number;
  totalStudyHours: number;
  targetScore: string;
  dailySchedule: {
    day: number;
    date: string;
    focusUnits: string[];
    sessions: SpacedRepetitionSession[];
    summary: string;
  }[];
  strategicAdvice: string[];
}

export interface ModelAnswer {
  questionId: string;
  questionText: string;
  marksTotal: number;
  markingRubric: {
    step: string;
    marksAwarded: number;
    teacherExpectation: string;
  }[];
  fullAnswerMarkdown: string;
  diagramDescription?: string;
  teacherProTip: string;
  commonPitfallToAvoid: string;
}

export interface ExamPaperRecord {
  id: string;
  name: string;
  year: number;
  examType: ExamType;
  uploadedAt: string;
  questionCount: number;
  totalMarks: number;
  rawText?: string;
  cleanedText?: string;
  sourceType: 'pdf' | 'image' | 'text' | 'sample';
}

export interface DictionaryTerm {
  id: string;
  term: string;
  canonicalName: string;
  unit: number;
  topicId: string;
  aliases: string[];
  definition: string;
  formula?: string;
  frequencyAppeared: number;
}

export interface PaperAppearanceTag {
  paperId: string;
  paperName: string;
  year: number;
  examType: string;
  matchedKeywords: string[];
  marks?: number;
}

export interface SubtopicExamImportance {
  subtopicId: string;
  subtopicName: string;
  unitNumber: number;
  unitTitle: string;
  unitId: string;
  questionNature: 'Numerical' | 'Derivation' | 'Theory';
  appearanceFrequency: number; // total count of questions appearing on this subtopic in uploaded papers
  totalMarks: number;
  examProbability: number; // (MSTs with this subtopic / total uploaded MSTs for this course) * 100%
  reweightedScore: number; // 0 - 100 reweighting based on frequency + marks weightage
  importanceTier: 'High Importance (Crucial)' | 'Medium Importance' | 'Low / Optional';
  mstsFoundCount: number;
  totalMstsUploaded: number;
  foundInMsts: {
    paperId?: string;
    paperName: string;
    examType: string;
    year: number;
    questionNumber: string;
    marks: number;
    basis: 'Numerical' | 'Derivation' | 'Theory';
    snippet: string;
  }[];
}

export interface TopicExamImportance {
  topicId: string;
  topicName: string;
  unit: number;
  examImportanceScore: number; // 0 - 100
  appearanceFrequency: number; // total questions in uploaded papers
  totalMarks: number;
  examProbability: number; // (MSTs with this topic / total uploaded MSTs) * 100%
  reweightedScore: number; // 0 - 100 reweighting based on frequency + marks weightage
  mstRecurrenceProbability: number; // legacy backwards compat
  endSemRecurrenceProbability: number; // legacy backwards compat
  overallProbability: number; // legacy backwards compat
  importanceTier: 'Tier 1 (Crucial Must-Do)' | 'Tier 2 (High Probability)' | 'Tier 3 (Moderate Yield)' | 'Tier 4 (Low / Optional)';
  mstPapersAppearedCount: number;
  totalMstPapersCount: number;
  endSemPapersAppearedCount: number;
  totalEndSemPapersCount: number;
  totalPapersCrossReferenced: number;
  appearedPaperTags: PaperAppearanceTag[];
  averageMarksYield?: number;
  recommendedPrepStrategy: string;
  isPrimaryScopeForTarget: boolean;
  subtopicsAnalysis: SubtopicExamImportance[];
}

export interface CourseExamIntelligenceSummary {
  totalPapersAnalyzed: number;
  mstPapersCount: number;
  endSemPapersCount: number;
  averageImportanceScore: number;
  topRankedTopics: TopicExamImportance[];
  syllabusCoverageRate: number;
  activeExamScope: string;
}

export interface TextExtractionResult {
  rawText: string;
  cleanedText: string;
  method: 'gemini-vision-ocr' | 'pdf-native' | 'text-normalized';
  pagesCount?: number;
  detectedExamType?: ExamType;
  detectedYear?: number;
  noiseItemsRemoved?: string[];
  dictionaryMatches?: { term: string; count: number; canonicalName: string }[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  semesterNumber: 1 | 2;
  credits: string;
  examTarget: 'MST-1' | 'MST-2' | 'End-Sem';
  heroImageUrl?: string;
  badgeColor?: string;
  syllabus: SyllabusTopic[];
  referenceBooks: {
    title: string;
    authors: string;
    edition?: string;
    role: 'Primary Teacher Reference' | 'Supplementary Numerical Practice';
    coverImageUrl?: string;
  }[];
  questions: Question[];
  teacherInsights: TeacherDemandInsight[];
  videoRecommendations: VideoRecommendation[];
  examPapers?: ExamPaperRecord[];
  dictionary?: DictionaryTerm[];
}
