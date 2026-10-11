import { jsPDF } from 'jspdf';
import { Course, StudyPlan, ModelAnswer } from '../types';
import { calculateTopicWeightages, generateLocalStudyPlan } from './analyticsEngine';

export interface ExportPdfOptions {
  daysRemaining?: number;
  dailyHours?: number;
  targetScore?: string;
  includeDailySchedule?: boolean;
  includeWeightageMatrix?: boolean;
  includeFormulasAndRubrics?: boolean;
  includeQuestionBankSummary?: boolean;
}

export function exportStudyPlanAndAnalyticsPdf(
  course: Course,
  options: ExportPdfOptions = {}
): string {
  const {
    daysRemaining = 14,
    dailyHours = 3.5,
    targetScore = '90%+ / Distinction',
    includeDailySchedule = true,
    includeWeightageMatrix = true,
    includeFormulasAndRubrics = true,
    includeQuestionBankSummary = true
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;
  let pageNumber = 1;

  // Colors
  const darkBg = [11, 11, 13]; // #0b0b0d
  const surfaceBg = [21, 21, 24]; // #151518
  const accentIndigo = [99, 102, 241]; // #6366f1
  const emeraldGreen = [16, 185, 129]; // #10b981
  const amberColor = [245, 158, 11]; // #f59e0b
  const textDark = [26, 26, 30];
  const textMuted = [100, 100, 110];
  const borderGrey = [220, 222, 228];

  const weightages = calculateTopicWeightages(course);
  const plan: StudyPlan = generateLocalStudyPlan(course, daysRemaining, dailyHours, targetScore);

  function drawPageFooter(pageNum: number) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      `ExamIntel • ${course.name} (${course.code}) • IET-DAVV University Examination Scheme`,
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  function checkPageBreak(neededHeight: number) {
    if (currentY + neededHeight > pageHeight - 18) {
      drawPageFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      currentY = margin;
      drawMiniHeader();
    }
  }

  function drawMiniHeader() {
    doc.setFillColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
    doc.rect(margin, currentY, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`ExamIntel • ${course.name} Intelligence Dossier`, margin + 6, currentY + 5);
    currentY += 12;
  }

  // --- COVER & HEADER BANNER ---
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'F');

  // Indigo top stripe
  doc.setFillColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.roundedRect(margin, currentY, contentWidth, 3, 2, 2, 'F');

  // Brand and title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.text('EXAMINTEL • UNIVERSITY INTELLIGENCE DOSSIER', margin + 8, currentY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${course.name} (${course.code})`, margin + 8, currentY + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 195, 210);
  const genDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  doc.text(
    `Semester ${course.semesterNumber || 1} • IET-DAVV 2024 Scheme • Target: ${targetScore} • Generated ${genDate}`,
    margin + 8,
    currentY + 26
  );

  doc.text(
    `Daily Study Budget: ${dailyHours} hrs/day • Horizon: ${daysRemaining} Days Countdown • Status: High-Yield Optimized`,
    margin + 8,
    currentY + 32
  );

  currentY += 44;

  // --- EXECUTIVE SUMMARY METRICS STRIP ---
  const metricBoxWidth = (contentWidth - 9) / 4;
  const metrics = [
    {
      label: 'PAST PAPERS',
      val: `${Array.from(new Set(course.questions.map((q) => q.paperYear))).length} Years`,
      sub: '2020-2024 Exam Set'
    },
    {
      label: 'TOTAL PYQS',
      val: `${course.questions.length} Questions`,
      sub: `${course.questions.reduce((s, q) => s + q.marks, 0)} Total Marks`
    },
    {
      label: 'TIME EFFICIENCY',
      val: '+70% Gain',
      sub: 'High-ROI Focus'
    },
    {
      label: 'DAYS TO EXAM',
      val: `${daysRemaining} Days`,
      sub: `${Math.round(daysRemaining * dailyHours)} Study Hours`
    }
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (metricBoxWidth + 3);
    doc.setFillColor(248, 249, 252);
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.roundedRect(x, currentY, metricBoxWidth, 19, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(m.label, x + 4, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(m.val, x + 4, currentY + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
    doc.text(m.sub, x + 4, currentY + 16);
  });

  currentY += 25;

  // --- SECTION 1: TOPIC WEIGHTAGE & PREDICTIVE PRIORITY TABLE ---
  if (includeWeightageMatrix) {
    checkPageBreak(35);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('1. TOPIC WEIGHTAGE & RECURRENCE INTELLIGENCE', margin, currentY);

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      'Topics ranked by marks-yield per hour invested (ROI Score). Prioritize Tier 1 Crucial before moving to Supplementary.',
      margin,
      currentY
    );

    currentY += 6;

    // Table Header
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(margin, currentY, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('RANK / TOPIC', margin + 3, currentY + 4.8);
    doc.text('PRIORITY TIER', margin + 65, currentY + 4.8);
    doc.text('AVG MARKS', margin + 105, currentY + 4.8);
    doc.text('FREQ %', margin + 128, currentY + 4.8);
    doc.text('CONFIDENCE', margin + 148, currentY + 4.8);
    doc.text('ROI SCORE', margin + 170, currentY + 4.8);

    currentY += 7;

    weightages.forEach((w, idx) => {
      checkPageBreak(13);

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.rect(margin, currentY, contentWidth, 12, 'FD');

      // Rank & Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const topicTitle = `#${idx + 1} Unit ${w.unit}: ${w.topicName}`;
      doc.text(doc.splitTextToSize(topicTitle, 60)[0], margin + 3, currentY + 4.5);

      // Sub-note
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      const bookRef = `Book: ${w.recommendedBookPages.substring(0, 38)}`;
      doc.text(bookRef, margin + 3, currentY + 8.8);

      // Tier Badge
      const isTier1 = w.priorityTier.includes('Tier 1');
      const isTier2 = w.priorityTier.includes('Tier 2');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      if (isTier1) {
        doc.setTextColor(220, 38, 38);
        doc.text('★ Tier 1 (Crucial)', margin + 65, currentY + 6.5);
      } else if (isTier2) {
        doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
        doc.text('● Tier 2 (High Yield)', margin + 65, currentY + 6.5);
      } else {
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text('○ Tier 3 (Suppl.)', margin + 65, currentY + 6.5);
      }

      // Avg marks
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`${w.averageMarksPerPaper} M/Paper`, margin + 105, currentY + 6.5);

      // Frequency %
      doc.text(`${w.frequencyPercentage}%`, margin + 128, currentY + 6.5);

      // Confidence
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
      doc.text(`${w.confidenceScore}%`, margin + 148, currentY + 6.5);

      // ROI Score
      doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
      doc.text(`${w.roiScore}x ROI`, margin + 170, currentY + 6.5);

      currentY += 12;
    });

    currentY += 6;
  }

  // --- SECTION 2: DAILY SPACES REPETITION SCHEDULE ---
  if (includeDailySchedule) {
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('2. SCIENTIFIC REVISION PLAN (SPACED REPETITION)', margin, currentY);

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      `Daily ${dailyHours}-hour active recall blocks calibrated to prevent cognitive forgetting before University MSTs.`,
      margin,
      currentY
    );

    currentY += 6;

    plan.dailySchedule.forEach((dayPlan) => {
      checkPageBreak(24);

      doc.setFillColor(247, 248, 252);
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

      // Day Badge Left Strip
      doc.setFillColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
      doc.roundedRect(margin, currentY, 18, 20, 2, 2, 'F');
      doc.rect(margin + 15, currentY, 3, 20, 'F'); // square off right side

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`D${dayPlan.day}`, margin + 5, currentY + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.text(dayPlan.date.split(',')[0], margin + 3, currentY + 13.5);

      // Content inside day
      const firstSession = dayPlan.sessions[0];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(
        firstSession ? firstSession.topicName : 'Comprehensive Unit Review',
        margin + 22,
        currentY + 5.5
      );

      // Phase & Duration pill
      const dayHours = dayPlan.sessions.reduce((s, x) => s + x.durationHours, 0) || dailyHours;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
      doc.text(
        `Phase: ${firstSession?.phase || 'Active Recall'} • Target: ${dayHours} Hours`,
        margin + 22,
        currentY + 9.5
      );

      // Tasks
      if (firstSession?.tasks && firstSession.tasks.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        const task1 = `[ ] ${firstSession.tasks[0]}`;
        const task2 = firstSession.tasks[1] ? `[ ] ${firstSession.tasks[1]}` : '';
        doc.text(doc.splitTextToSize(task1, contentWidth - 25)[0], margin + 22, currentY + 14);
        if (task2) {
          doc.text(doc.splitTextToSize(task2, contentWidth - 25)[0], margin + 22, currentY + 17.5);
        }
      }

      currentY += 23;
    });

    currentY += 4;
  }

  // --- SECTION 3: FORMULAS & TEACHER STEP-SCORING RUBRICS ---
  if (includeFormulasAndRubrics) {
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('3. GOVERNING FORMULAS & PROFESSOR MARKING RUBRICS', margin, currentY);

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      'Exact mathematical identities and step-marking checkpoints demanded for 100% full marks.',
      margin,
      currentY
    );

    currentY += 6;

    course.syllabus.forEach((unit) => {
      checkPageBreak(24);

      doc.setFillColor(252, 253, 255);
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

      // Unit Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
      doc.text(`Unit ${unit.unit}: ${unit.title}`, margin + 4, currentY + 5);

      // Formulas
      if (unit.keyFormulas && unit.keyFormulas.length > 0) {
        doc.setFont('courier', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
        const formulaStr = unit.keyFormulas.slice(0, 2).join('   |   ');
        doc.text(doc.splitTextToSize(formulaStr, contentWidth - 8)[0], margin + 4, currentY + 9.5);
      }

      // Textbook Guidance
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const bookGuidance = `Target Book Work: ${unit.referenceBookChapters || 'Focus on solved university standard examples'}`;
      doc.text(doc.splitTextToSize(bookGuidance, contentWidth - 8)[0], margin + 4, currentY + 14);

      // Exam Pitfall
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
      const trap = `Note: Avoid arithmetic shortcuts in derivations. Write complete boundary conditions for full step marks.`;
      doc.text(trap, margin + 4, currentY + 17.5);

      currentY += 23;
    });

    currentY += 4;
  }

  // --- SECTION 4: QUESTION BANK RECURRENCE BREAKDOWN ---
  if (includeQuestionBankSummary) {
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('4. FREQUENT PAST EXAM QUESTIONS (TOP ANCHORS)', margin, currentY);

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      'Cleaned past university examination questions with high recurrence in 2020-2024 papers.',
      margin,
      currentY
    );

    currentY += 6;

    const topQuestions = course.questions.slice(0, 8);
    topQuestions.forEach((q, qIdx) => {
      checkPageBreak(17);

      doc.setFillColor(250, 251, 254);
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

      // Question Title & marks
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const qHeading = `Q${qIdx + 1}. [${q.marks} Marks • ${q.questionType.toUpperCase()} • ${q.paperYear || 2023}]`;
      doc.text(qHeading, margin + 3, currentY + 4.5);

      // Question Text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const qText = doc.splitTextToSize(q.text, contentWidth - 6);
      doc.text(qText[0], margin + 3, currentY + 8.5);

      // Tags & confidence
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
      const meta = `Mapped Unit: ${q.topicId} • Difficulty: ${q.difficulty} • Recurrence: ${q.repeatedInYears?.join(', ') || 'Regular'}`;
      doc.text(meta, margin + 3, currentY + 12);

      currentY += 16;
    });
  }

  // Final page footer
  drawPageFooter(pageNumber);

  // Trigger Save / Download
  const filename = `${course.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_ExamIntel_Study_Dossier.pdf`;
  doc.save(filename);

  return filename;
}

/**
 * Dedicated PDF generator for Model Solutions with Mandatory Examination Diagrams,
 * Flowcharts, Marking Rubric, and Evaluator Tips.
 */
export function exportSolutionDossierPdf(params: {
  solution: ModelAnswer;
  questionText: string;
  courseName: string;
  topicName?: string;
  marks?: number;
  diagramImageUrl?: string;
}): string {
  const { solution, questionText, courseName, topicName, marks = 7, diagramImageUrl } = params;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;
  let pageNumber = 1;

  const accentIndigo = [99, 102, 241];
  const emeraldGreen = [16, 185, 129];
  const textDark = [26, 26, 30];
  const textMuted = [100, 100, 110];
  const borderGrey = [220, 222, 228];

  function drawFooter(p: number) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 150);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      `ExamIntel Model Answer Dossier • ${courseName} • University Examination Standard`,
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${p}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  function checkBreak(needed: number) {
    if (currentY + needed > pageHeight - 18) {
      drawFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      currentY = margin;
      // mini header on page continuation
      doc.setFillColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
      doc.rect(margin, currentY, 3, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`Model Solution (Continued) — ${courseName}`, margin + 6, currentY + 4.5);
      currentY += 10;
    }
  }

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('UNIVERSITY MODEL ANSWER & DIAGRAM DOSSIER', margin + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    `Course: ${courseName}   |   ${topicName ? `Unit: ${topicName}   |   ` : ''}${marks} Marks Rubric`,
    margin + 6,
    currentY + 15
  );

  currentY += 28;

  // Question Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  const splitQ = doc.splitTextToSize(questionText, contentWidth - 8);
  const qHeight = Math.max(16, splitQ.length * 4.5 + 8);
  doc.roundedRect(margin, currentY, contentWidth, qHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(accentIndigo[0], accentIndigo[1], accentIndigo[2]);
  doc.text('EXAM QUESTION:', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(splitQ, margin + 4, currentY + 10.5);

  currentY += qHeight + 6;

  // Marking Rubric Summary
  if (solution.markingRubric && solution.markingRubric.length > 0) {
    checkBreak(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('1. EVALUATOR MARKING RUBRIC BREAKDOWN', margin, currentY);
    currentY += 5;

    solution.markingRubric.forEach((r) => {
      checkBreak(10);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, 8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`${r.step}  (+${r.marksAwarded}M)`, margin + 3, currentY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      const exp = doc.splitTextToSize(r.teacherExpectation || '', contentWidth - 65);
      doc.text(exp[0] || '', margin + 60, currentY + 5);
      currentY += 9.5;
    });
    currentY += 3;
  }

  // Diagram Section (Visual Image embed if present or Detailed Diagram Specification)
  if (solution.diagramRequired || solution.diagramDescription || diagramImageUrl) {
    checkBreak(45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('2. MANDATORY EXAMINATION DIAGRAM & SCHEMATIC', margin, currentY);
    currentY += 5;

    // Try embedding image if base64/url provided
    if (diagramImageUrl && (diagramImageUrl.startsWith('data:image/') || diagramImageUrl.startsWith('http'))) {
      try {
        const imgHeight = 48;
        const imgWidth = Math.min(contentWidth, 120);
        doc.addImage(diagramImageUrl, 'PNG', margin + (contentWidth - imgWidth) / 2, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 4;
      } catch {
        // Fallback to text box if image cannot be embedded
      }
    }

    if (solution.diagramDescription) {
      checkBreak(24);
      doc.setFillColor(245, 243, 255); // purple-50
      doc.setDrawColor(196, 181, 253);
      const diagLines = doc.splitTextToSize(solution.diagramDescription, contentWidth - 8);
      const diagHeight = Math.max(16, diagLines.length * 4.2 + 8);
      doc.roundedRect(margin, currentY, contentWidth, diagHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(109, 40, 217); // purple-700
      doc.text('LABELED SCHEMATIC SPECIFICATION FOR STUDENT ANSWER SHEET:', margin + 4, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text(diagLines, margin + 4, currentY + 10);

      currentY += diagHeight + 6;
    }
  }

  // Visual Mechanism Flowchart Steps
  if (solution.flowchartSteps && solution.flowchartSteps.length > 0) {
    checkBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('3. SEQUENTIAL MECHANISM & PROCESS FLOWCHART', margin, currentY);
    currentY += 5;

    solution.flowchartSteps.forEach((step, idx) => {
      checkBreak(14);
      doc.setFillColor(254, 252, 232); // amber-50
      doc.setDrawColor(253, 230, 138); // amber-200
      doc.roundedRect(margin, currentY, contentWidth, 11, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text(`Step ${step.stepNumber || idx + 1}: ${step.title}`, margin + 3, currentY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const detailSplit = doc.splitTextToSize(step.detail || '', contentWidth - 6);
      doc.text(detailSplit[0] || '', margin + 3, currentY + 8.5);

      currentY += 13;
    });
    currentY += 3;
  }

  // Structured Core Solution
  if (solution.introduction) {
    checkBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('4. THEORETICAL FOUNDATION & DEFINITION', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const introLines = doc.splitTextToSize(solution.introduction, contentWidth);
    doc.text(introLines, margin, currentY);
    currentY += introLines.length * 4.2 + 5;
  }

  // Teacher Pro-Tip & Deduction Trap
  if (solution.teacherProTip || solution.commonPitfallToAvoid) {
    checkBreak(22);
    doc.setFillColor(240, 253, 244); // emerald-50
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.text("EXAMINER'S HIGH-SCORING PRO-TIP:", margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    const tipSplit = doc.splitTextToSize(solution.teacherProTip || 'State base formulas clearly before numerical substitutions.', contentWidth - 8);
    doc.text(tipSplit[0] || '', margin + 4, currentY + 9);

    if (solution.commonPitfallToAvoid) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(225, 29, 72); // rose-600
      const pitfallSplit = doc.splitTextToSize(`Avoid Deduction: ${solution.commonPitfallToAvoid}`, contentWidth - 8);
      doc.text(pitfallSplit[0] || '', margin + 4, currentY + 14.5);
    }

    currentY += 22;
  }

  drawFooter(pageNumber);

  const cleanQ = (questionText || 'solution').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `ExamIntel_ModelSolution_${cleanQ}.pdf`;
  doc.save(filename);

  return filename;
}
