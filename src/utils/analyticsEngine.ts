import { Course, Question, TopicWeightage, StudyPlan, SpacedRepetitionSession, PriorityTier, SyllabusTopic } from '../types';
import { mapQuestionToSyllabus } from './semanticEmbeddingService';

/**
 * Semantic Similarity & Classification Engine
 * Maps questions to syllabus topics and computes confidence score + matched keywords
 * using TF-IDF and character n-gram cosine vector embeddings.
 */
export function inferQuestionMapping(
  questionText: string,
  syllabus: SyllabusTopic[],
  courseId?: string
): {
  topicId: string;
  topicName: string;
  confidence: number;
  matchedKeywords: string[];
  reason: string;
} {
  const result = mapQuestionToSyllabus(questionText, syllabus, courseId);
  return {
    topicId: result.topicId,
    topicName: result.topicName,
    confidence: result.confidence,
    matchedKeywords: result.matchedKeywords,
    reason: result.semanticMatchReason
  };
}

export function calculateTopicWeightages(
  course: Course,
  targetScope: 'all' | 'MST-1' | 'MST-2' | 'End-Sem' = 'all'
): TopicWeightage[] {
  // Filter questions based on selected target scope (MST-1, MST-2, End-Sem, or All)
  const scopedQuestions = targetScope === 'all'
    ? course.questions
    : course.questions.filter(q => q.examType === targetScope);

  // Group papers by year/examType
  const paperKeys = Array.from(new Set(scopedQuestions.map(q => `${q.paperYear}-${q.examType}`)));
  const totalPapers = Math.max(1, paperKeys.length);
  const totalMarksAllPapers = scopedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return course.syllabus.map(topic => {
    // Check if topic is within standard scope for this exam
    const isTopicInScope = targetScope === 'all'
      ? true
      : targetScope === 'MST-1'
      ? topic.unit <= 2
      : targetScope === 'MST-2'
      ? topic.unit >= 3 && topic.unit <= 4
      : true; // End-Sem covers all units

    const topicQuestions = scopedQuestions.filter(q => q.topicId === topic.id);
    const questionCount = topicQuestions.length;
    const totalMarksAppeared = topicQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
    const averageMarksPerPaper = totalPapers > 0 ? Math.round((totalMarksAppeared / totalPapers) * 10) / 10 : 0;
    const frequencyPercentage = totalMarksAllPapers > 0 ? Math.round((totalMarksAppeared / totalMarksAllPapers) * 100) : 0;

    // Breakdown by question type
    const questionTypeBreakdown = {
      theory: 0,
      numerical: 0,
      derivation: 0,
      diagram_design: 0,
      code: 0
    };

    // Breakdown by difficulty
    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    // Breakdown by paper key
    const paperAppearances = new Set<string>();
    const yearlyMarks: { [year: number]: number } = {};

    topicQuestions.forEach(q => {
      if (q.questionType in questionTypeBreakdown) {
        questionTypeBreakdown[q.questionType]++;
      }
      if (q.difficulty in difficultyBreakdown) {
        difficultyBreakdown[q.difficulty]++;
      }
      if (q.paperYear) {
        yearlyMarks[q.paperYear] = (yearlyMarks[q.paperYear] || 0) + (q.marks || 0);
      }
      paperAppearances.add(`${q.paperYear}-${q.examType}`);
    });

    const papersAppearedCount = paperAppearances.size;
    const appearanceRate = totalPapers > 0 ? papersAppearedCount / totalPapers : 0.5;

    // Repetition Probability in the targeted exam scope (0 - 98%)
    let appearanceProbability = 0;
    if (isTopicInScope) {
      if (papersAppearedCount > 0) {
        appearanceProbability = Math.min(98, Math.max(50, Math.round(appearanceRate * 100)));
      } else {
        // Topic in syllabus but not in filtered sample yet
        appearanceProbability = targetScope === 'MST-1' ? 75 : 65;
      }
    } else {
      appearanceProbability = 0;
    }

    // Suggested study hours
    const hours = Math.max(2, topic.suggestedHours || 6);

    // ROI Score: marks yield per study hour
    const rawRoi = isTopicInScope
      ? (Math.max(averageMarksPerPaper, 6) * 1.5 * (0.5 + appearanceRate)) / hours
      : 0.2;
    const roiScore = Math.round(rawRoi * 10) / 10;

    // Priority Tier
    let priorityTier: PriorityTier = 'Tier 2 (High Yield)';
    if (!isTopicInScope) {
      priorityTier = 'Tier 3 (Supplementary)';
    } else if (roiScore >= 1.8 || appearanceProbability >= 85 || averageMarksPerPaper >= 10) {
      priorityTier = 'Tier 1 (Crucial)';
    } else if (roiScore < 1.0) {
      priorityTier = 'Tier 3 (Supplementary)';
    }

    // Confidence Score (50-98%)
    const confidenceScore = Math.min(
      98,
      Math.max(55, Math.round(65 + appearanceRate * 25 + Math.min(10, questionCount * 2)))
    );

    // Predictive reasoning
    let predictiveReasoning = '';
    if (!isTopicInScope) {
      predictiveReasoning = `Unit ${topic.unit} is outside the standard ${targetScope} exam syllabus. Focus on Units for this test first.`;
    } else if (papersAppearedCount > 0) {
      predictiveReasoning = `Appeared in ${papersAppearedCount} of ${totalPapers} analyzed ${targetScope} past papers (${appearanceProbability}% probability). Avg yield: ~${averageMarksPerPaper} marks.`;
    } else {
      predictiveReasoning = `Core Unit ${topic.unit} curriculum concept. Essential for complete ${targetScope} syllabus coverage.`;
    }

    const teacherFocusNotes = topicQuestions.length > 0
      ? `Primary format: ${Object.entries(questionTypeBreakdown).sort((a,b) => b[1] - a[1])[0]?.[0] || 'derivation'}. Frequent recurring 6-8 mark question.`
      : 'Review fundamental definitions and standard textbook formulas.';

    return {
      topicId: topic.id,
      topicName: topic.title,
      unit: topic.unit,
      totalMarksAppeared,
      averageMarksPerPaper,
      frequencyPercentage,
      questionCount,
      questionTypeBreakdown,
      difficultyBreakdown,
      yearlyMarks,
      roiScore,
      priorityTier,
      confidenceScore,
      predictiveReasoning,
      recommendedBookPages: topic.referenceBookChapters,
      teacherFocusNotes,
      appearanceProbability,
      papersAppearedCount,
      totalExamPapersAnalyzed: totalPapers,
      targetExamScope: targetScope
    };
  }).sort((a, b) => b.roiScore - a.roiScore);
}

export function generateLocalStudyPlan(
  course: Course,
  daysRemaining: number = 14,
  dailyHours: number = 3.5,
  targetScore: string = '90%+ / Distinction'
): StudyPlan {
  const weightages = calculateTopicWeightages(course);
  const totalStudyHours = daysRemaining * dailyHours;

  // Sort topics by priority
  const tier1 = weightages.filter(w => w.priorityTier === 'Tier 1 (Crucial)');
  const tier2 = weightages.filter(w => w.priorityTier === 'Tier 2 (High Yield)');
  const tier3 = weightages.filter(w => w.priorityTier === 'Tier 3 (Supplementary)');
  const prioritized = [...tier1, ...tier2, ...tier3];

  const dailySchedule: StudyPlan['dailySchedule'] = [];
  const today = new Date();

  // Spaced repetition schedule distribution
  for (let day = 1; day <= daysRemaining; day++) {
    const curDate = new Date(today);
    curDate.setDate(today.getDate() + (day - 1));
    const dateFormatted = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

    const sessions: SpacedRepetitionSession[] = [];
    const focusUnits: string[] = [];

    if (day === daysRemaining) {
      // Final day before exam: rapid formula dump & calm review
      const t = prioritized[0] || weightages[0];
      focusUnits.push('All Units - Comprehensive Revision');
      sessions.push({
        dayIndex: day,
        dateStr: dateFormatted,
        topicId: t?.topicId || 'all',
        topicName: 'Rapid Formula Sheet & Diagram Mental Walkthrough',
        phase: 'Final Polish',
        intervalName: 'Final Polish',
        durationHours: Math.min(dailyHours, 2.5),
        tasks: [
          'Review 1-page condensed formula sheet without looking at solutions',
          'Practice drawing high-weightage diagrams in under 2 minutes each',
          'Mental rehearsal of Teacher Pitfall traps and deduction checkpoints',
          'Sleep at least 7.5 hours before the exam morning'
        ],
        completed: false
      });
    } else if (day === daysRemaining - 1) {
      // Mock Exam Day
      focusUnits.push('Simulated Timed Mock Exam');
      sessions.push({
        dayIndex: day,
        dateStr: dateFormatted,
        topicId: 'mock-all',
        topicName: 'Full-Length 3-Hour Timed Mock Paper Drill',
        phase: 'Mock Timed Solving',
        intervalName: 'Day 14',
        durationHours: dailyHours,
        tasks: [
          'Solve past year question paper in strict exam conditions (no phone/notes)',
          'Self-evaluate using Teacher Model Marking Scheme',
          'Flag questions where steps or time were wasted for evening review'
        ],
        completed: false
      });
    } else {
      // Rotate high-priority topics with spaced repetition intervals
      const primaryTopicIdx = (day - 1) % prioritized.length;
      const primaryTopic = prioritized[primaryTopicIdx];

      // Review topic from 2-3 days ago (Spaced recall)
      const reviewTopicIdx = (day - 3 >= 0) ? (day - 3) % prioritized.length : -1;
      const reviewTopic = reviewTopicIdx >= 0 ? prioritized[reviewTopicIdx] : null;

      focusUnits.push(`Unit ${primaryTopic.unit}: ${primaryTopic.topicName}`);

      // Main session: Learn & Deep Solve (70% of time)
      const mainHours = reviewTopic ? Math.round((dailyHours * 0.65) * 10) / 10 : dailyHours;
      sessions.push({
        dayIndex: day,
        dateStr: dateFormatted,
        topicId: primaryTopic.topicId,
        topicName: primaryTopic.topicName,
        phase: 'Learn & Derive',
        intervalName: 'Day 1',
        durationHours: mainHours,
        tasks: [
          `Read core concepts & formulas from prescribed book (${primaryTopic.recommendedBookPages})`,
          `Hand-derive the core derivations on paper from memory`,
          `Solve 3 representative PYQ numericals / past exam questions without peeking at answers`,
          `Cross-verify against teacher expectations & required step notation`
        ],
        completed: false
      });

      // Spaced Review session (30% of time)
      if (reviewTopic && reviewTopic.topicId !== primaryTopic.topicId) {
        focusUnits.push(`Review: Unit ${reviewTopic.unit}`);
        const revHours = Math.round((dailyHours - mainHours) * 10) / 10;
        sessions.push({
          dayIndex: day,
          dateStr: dateFormatted,
          topicId: reviewTopic.topicId,
          topicName: reviewTopic.topicName,
          phase: 'Active Recall Drill',
          intervalName: 'Day 3',
          durationHours: revHours,
          tasks: [
            `Active Recall: Blank paper test - write down all formulas & theorems for ${reviewTopic.topicName}`,
            `Rapid-fire solve 1 hard question from past 2 years under 12 minutes`,
            `Review common deduction traps identified by the examiner`
          ],
          completed: false
        });
      }
    }

    dailySchedule.push({
      day,
      date: dateFormatted,
      focusUnits,
      sessions,
      summary: `Day ${day} (${dateFormatted}): Focused deep session on ${focusUnits.join(', ')}`
    });
  }

  const strategicAdvice = [
    `Front-load Tier 1 Topics (${tier1.map(t => t.topicName).slice(0, 2).join(', ')}): Master them first as they account for ~${tier1.reduce((s, t) => s + t.averageMarksPerPaper, 0).toFixed(0)} marks in every exam paper.`,
    `Do not skip intermediate derivation steps: Examiners strictly grade the step formula substitution even if final decimal is slightly off.`,
    `Respect Spaced Repetition intervals: Reviewing a topic on Day 3 and Day 7 converts short-term cramming into permanent procedural memory.`,
    `Allocate the final 48 hours purely to full-paper speed solving and formula sheet retention, never learning new heavy topics from scratch.`
  ];

  return {
    examName: `${course.name} (${course.code}) - ${course.examTarget}`,
    daysRemaining,
    dailyHours,
    totalStudyHours,
    targetScore,
    dailySchedule,
    strategicAdvice
  };
}
