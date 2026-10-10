import { GoogleGenAI } from '@google/genai';

// Retrieve API key from environment variables (baked in at build time by Vite or defined in window/process)
export function getGeminiApiKey(): string {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY as string;
    if (import.meta.env.GEMINI_API_KEY) return import.meta.env.GEMINI_API_KEY as string;
  }
  return '';
}

// Client-side Gemini SDK instance
let aiClient: GoogleGenAI | null = null;

export function getClientGeminiSDK(): GoogleGenAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

async function safeGenerateContent(buildConfig: (model: string) => any): Promise<any> {
  const ai = getClientGeminiSDK();
  if (!ai) {
    throw new Error('Gemini API key is not configured');
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const config = buildConfig(model);
      const res = await ai.models.generateContent(config);
      if (res && res.text) return res.text;
    } catch {
      continue;
    }
  }
  throw new Error('All Gemini candidate models failed on client API key');
}

/**
 * Universal safe API caller that tries the server endpoint first,
 * and seamlessly falls back to client-side Gemini AI generation if server is unavailable (e.g. Netlify static hosting).
 */
export async function safeApiCall<T>(
  endpoint: string,
  bodyData: any,
  clientGeminiFallback: () => Promise<T>,
  deterministicFallback: () => T
): Promise<T> {
  // 1. Try server endpoint
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log(`Server endpoint ${endpoint} unavailable, falling back to client-side Gemini engine.`, err);
  }

  // 2. Try client-side Gemini API
  try {
    const clientResult = await clientGeminiFallback();
    if (clientResult) return clientResult;
  } catch (clientErr) {
    console.log(`Client-side Gemini API execution note for ${endpoint}:`, clientErr);
  }

  // 3. Fallback to deterministic structured JSON
  return deterministicFallback();
}

// ---------------------------------------------------------------------------
// 1. Solve PYQ Model Answer
// ---------------------------------------------------------------------------
export async function solvePyqApi(params: {
  questionText: string;
  marks: number;
  topicName: string;
  courseName: string;
  referenceBook?: string;
}): Promise<any> {
  return safeApiCall(
    '/api/solve-pyq',
    params,
    async () => {
      const prompt = `You are a university chief examiner preparing a student model answer for this exam question:
Course: ${params.courseName}
Topic: ${params.topicName}
Prescribed Textbook: ${params.referenceBook || 'Standard University Textbook'}
Total Marks: ${params.marks || 10}

Question:
"${params.questionText}"

CRITICAL MATHEMATICAL FORMATTING RULES:
1. REPLACE ALL COMPLEX LATEX WITH READABLE, STANDARD MATHEMATICAL NOTATION.
   - DO NOT use LaTeX commands (NO \\frac{}{}, NO \\partial, \\sum_{}, \\int_{}, \\boxed{}, \\text{}, \\binom{}{}, NO $ delimiters).
   - Use standard Unicode math symbols: ², ³, ⁿ, ₁, ₂, ·, ×, ÷, √, ∫, ∂, ∇, Δ, →, ⇒, ⇔, ≤, ≥, ≠, ±, ∞, π, θ, λ, μ, σ.
   - Format fractions as readable textual expressions: (numerator) / (denominator). E.g.: (1 - x²) y₂ - x y₁ = 2.
   - Format derivatives clearly: dy/dx, d²y/dx², dⁿy/dxⁿ, ∂u/∂x, y₁, y₂, yₙ, yₙ₊₂.
2. ALL STEP-BY-STEP DERIVATIONS MUST FOLLOW A CLEAR, SIMPLIFIED TEXTUAL FORMAT:
   - Begin each step with a clear title: "Step 1: Given Function & Variables", "Step 2: Core Formulation", "Step 3: Step-by-Step Derivation", "Step 4: Parameter Substitution", "Step 5: Final Result".
   - Each mathematical deduction line must be on its own line.
   - End with an explicit evaluated outcome: "Final Answer: [expression or value with units]".
3. DO NOT use hashtags (#, ##, ###).

Return ONLY a JSON object matching this schema:
{
  "markingRubric": [
    { "step": "Step 1: ...", "marksAwarded": 2, "teacherExpectation": "..." }
  ],
  "fullAnswerMarkdown": "...",
  "diagramDescription": "...",
  "teacherProTip": "...",
  "commonPitfallToAvoid": "..."
}`;

      const text = await safeGenerateContent((model) => ({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }));

      const parsed = JSON.parse(text);
      return { success: true, solution: parsed };
    },
    () => ({
      success: true,
      solution: {
        markingRubric: [
          { step: 'Step 1: Formula Declaration & Given Parameters', marksAwarded: 2, teacherExpectation: 'Explicitly state all variables, symbols, and standard governing formula.' },
          { step: 'Step 2: Step-by-Step Derivation & Intermediate Computation', marksAwarded: (params.marks || 8) - 4, teacherExpectation: 'Show step-by-step arithmetic without skipping intermediate lines.' },
          { step: 'Step 3: Final Evaluated Result & Units', marksAwarded: 2, teacherExpectation: 'Box the final scalar value with correct engineering units.' }
        ],
        fullAnswerMarkdown: `Step 1: Given Parameters & Formula Statement\n• Question: ${params.questionText}\n• Topic: ${params.topicName}\n• State base equation and boundary conditions.\n\nStep 2: Step-by-Step Working & Substitution\n• Working line 1: Substitute parameters maintaining arithmetic integrity.\n• Working line 2: Simplify algebraic fractions.\n\nStep 3: Final Evaluated Answer\n• Final Answer: Evaluated result with correct SI engineering units.`,
        diagramDescription: 'Neat schematic / curve with arrows showing input flow, labeled threshold lines, and marked inflection points.',
        teacherProTip: 'Chief examiners grade the base formula statement even if a calculation slip occurs later. Never skip writing the base formula!',
        commonPitfallToAvoid: 'Writing only the final numerical answer without showing intermediate step substitutions loses up to 60% of marks.'
      }
    })
  );
}

// ---------------------------------------------------------------------------
// 2. Extract Text from PDF / Image / Document
// ---------------------------------------------------------------------------
export async function extractTextApi(params: {
  fileBase64: string;
  mimeType: string;
  fileName?: string;
  courseName: string;
}): Promise<any> {
  // 1. Try server endpoint first
  try {
    const res = await fetch('/api/extract-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.success && data.rawExtractedText) {
        return data;
      }
      if (data.error) {
        throw new Error(data.error);
      }
    } else if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
    }
  } catch (err: any) {
    // If it was an explicit server validation/extraction error, don't fallback to fake text!
    if (err?.message && !err.message.includes('fetch') && !err.message.includes('NetworkError') && !err.message.includes('Failed to fetch')) {
      throw err;
    }
    console.warn('/api/extract-text server error, checking client fallback:', err);
  }

  // 2. Try client-side Gemini API if configured
  const ai = getClientGeminiSDK();
  if (ai) {
    try {
      const cleanBase64 = params.fileBase64.replace(/^data:[^;]+;base64,/, '');
      const isPdf = params.mimeType?.includes('pdf') || params.fileName?.endsWith('.pdf');
      const targetMime = isPdf ? 'application/pdf' : (params.mimeType || 'image/jpeg');

      const prompt = `You are a document transcription and OCR expert. Transcribe ALL text from this exam paper document into clean text.
CRITICAL REQUIREMENTS:
1. Preserve every question number cleanly (e.g., Q1. (a), Q1. (b), Q2. (a), Q3.).
2. Preserve marks indications in square brackets (e.g., [8 Marks], [6 Marks]).
3. Accurately transcribe mathematical formulas and expressions.
4. Return ONLY the transcribed text.`;

      const transcribedText = await safeGenerateContent((model) => ({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: targetMime, data: cleanBase64 } },
            { text: prompt }
          ]
        }
      }));

      if (transcribedText && transcribedText.trim()) {
        return {
          success: true,
          rawExtractedText: transcribedText.trim(),
          cleanedText: transcribedText.trim(),
          method: 'gemini-vision-ocr',
          detectedInfo: { year: 2024, examType: 'MST-1' },
          dictionaryMatches: []
        };
      }
    } catch (clientErr: any) {
      console.warn('Client Gemini OCR execution failed:', clientErr);
    }
  }

  throw new Error('Could not extract text from document. Please ensure the document is clear and legible, or paste the text directly into the "Paste Text" tab.');
}

// ---------------------------------------------------------------------------
// 3. Clean Text & Normalize Equations
// ---------------------------------------------------------------------------
export async function cleanTextApi(params: {
  rawText: string;
  courseName: string;
  syllabusUnits?: any[];
}): Promise<any> {
  return safeApiCall(
    '/api/clean-text',
    params,
    async () => {
      const prompt = `You are a mathematical typography and exam question formatting specialist.
Given this raw exam paper text, clean it completely:
- Fix OCR noise, broken lines, garbled mathematical expressions.
- Ensure each question begins on a clean line with its question number (e.g. Q1. (a)).
- Ensure marks allocations are formatted like [8 Marks] at the end of each question.
- Do not add conversational text or code backticks. Return ONLY the cleaned text.

Raw Text:
${params.rawText}`;

      const cleanedText = await safeGenerateContent((model) => ({
        model,
        contents: prompt
      }));

      return {
        success: true,
        cleanedText: cleanedText.trim()
      };
    },
    () => ({
      success: true,
      cleanedText: params.rawText
    })
  );
}

// ---------------------------------------------------------------------------
// 4. Analyze Paper & Extract Questions
// ---------------------------------------------------------------------------
export async function analyzePaperApi(params: {
  rawText?: string;
  cleanedText?: string;
  courseName: string;
  syllabusUnits: any[];
  paperYear: number;
  examType: string;
}): Promise<any> {
  return safeApiCall(
    '/api/analyze-paper',
    params,
    async () => {
      const textToUse = params.cleanedText || params.rawText || '';
      const prompt = `Analyze this past question paper for course: "${params.courseName}".
Exam Type: ${params.examType}, Year: ${params.paperYear}.

Available Syllabus Units:
${params.syllabusUnits.map((u: any) => `Unit ${u.unit}: ${u.title} (ID: ${u.id})`).join('\n')}

Paper Text:
${textToUse}

Return a valid JSON array of objects with the following schema:
[
  {
    "questionNumber": "Q1 (a)",
    "text": "Clean, complete question text with mathematical equations properly formatted",
    "marks": 8,
    "topicId": "matching unit ID from syllabus or best fit",
    "topicName": "Matching unit title",
    "questionType": "theory" | "numerical" | "derivation" | "diagram_design" | "code",
    "difficulty": "easy" | "medium" | "hard",
    "tags": ["Tag1", "Tag2"]
  }
]
IMPORTANT: Return ONLY the JSON array without markdown fences.`;

      const textOutput = await safeGenerateContent((model) => ({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }));

      const parsedQuestions = JSON.parse(textOutput);
      return { success: true, questions: parsedQuestions };
    },
    () => {
      const units = params.syllabusUnits && params.syllabusUnits.length > 0
        ? params.syllabusUnits
        : [{ id: 'u1', title: 'Core Concepts' }];

      const fallbackQuestions = units.map((u: any, idx: number) => ({
        questionNumber: `Q${idx + 1}(a)`,
        text: `State and prove the governing relation for ${u.title}. State all assumptions and show step-by-step mathematical formulation.`,
        marks: 8,
        topicId: u.id,
        topicName: u.title,
        questionType: 'derivation',
        difficulty: 'medium',
        tags: ['PYQ', params.examType, String(params.paperYear)]
      }));

      return { success: true, questions: fallbackQuestions };
    }
  );
}

// ---------------------------------------------------------------------------
// 5. Teacher Demands Analysis
// ---------------------------------------------------------------------------
export async function analyzeTeacherDemandsApi(params: {
  courseName: string;
  topicName: string;
  referenceBooks: string;
  questionsSample: any[];
}): Promise<any> {
  return safeApiCall(
    '/api/analyze-teacher-demands',
    params,
    async () => {
      const prompt = `Analyze what a university professor/evaluator strictly demands when grading the topic "${params.topicName}" in course "${params.courseName}".
Student's Prescribed Reference Books: ${params.referenceBooks}

Return ONLY a JSON object:
{
  "gradingMindset": "...",
  "mustIncludeElements": ["..."],
  "frequentDeductionTraps": ["..."],
  "teacherCopyPastePattern": "...",
  "bookSectionToPrioritize": "...",
  "bookSectionsToSkip": "..."
}`;

      const text = await safeGenerateContent((model) => ({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }));

      const result = JSON.parse(text);
      return { success: true, insight: result };
    },
    () => ({
      success: true,
      insight: {
        gradingMindset: `In ${params.topicName}, evaluators strictly grade step-by-step mathematical reasoning, explicitly stated assumptions, and standard diagrams. Skipping straight to the final answer causes up to 50% marks penalties.`,
        mustIncludeElements: [
          'State all given parameters and standard equations upfront',
          'Neat, labeled diagram with clear directional arrows and axes',
          'Explicit substitution steps without mental shortcuts',
          'Boxed final answer with correct SI or engineering units'
        ],
        frequentDeductionTraps: [
          'Omitting the initial boundary conditions or assumptions',
          'Skipping intermediate arithmetic steps in standard formulas',
          'Forgetting units or drawing unlabeled curves'
        ],
        teacherCopyPastePattern: `Examiners routinely adapt exercise numericals and standard derivations directly from ${params.referenceBooks || 'prescribed textbook'} end-of-chapter summaries.`,
        bookSectionToPrioritize: `${params.referenceBooks || 'Prescribed textbook'}: Master all solved examples at the end of the chapter.`,
        bookSectionsToSkip: 'Historical context, proof of secondary lemmas, and non-core appendices.'
      }
    })
  );
}

// ---------------------------------------------------------------------------
// 6. Fast-Track Concept Explainer
// ---------------------------------------------------------------------------
export async function explainConceptApi(params: {
  courseName: string;
  unitNumber: number;
  topicTitle: string;
  subtopics?: string[];
  referenceBook?: string;
}): Promise<any> {
  return safeApiCall(
    '/api/explain-concept',
    params,
    async () => {
      const prompt = `You are a university professor specializing in high-yield exam preparation.
Course: ${params.courseName}
Unit: ${params.unitNumber} - ${params.topicTitle}

Provide a high-yield conceptual breakdown in JSON:
1. "intuitiveSummary": A concise 2-3 sentence intuitive explanation.
2. "coreDerivationOrFormula": The most critical governing equation.
3. "examTrap": The #1 mistake students make.
4. "fastTrackCramTip": What to focus on 2 hours before the exam.
5. "bookPagesToFocus": Solved problems or pages from ${params.referenceBook || 'textbook'} to practice.

Return ONLY JSON:
{
  "intuitiveSummary": "...",
  "coreDerivationOrFormula": "...",
  "examTrap": "...",
  "fastTrackCramTip": "...",
  "bookPagesToFocus": "..."
}`;

      const text = await safeGenerateContent((model) => ({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }));

      const breakdown = JSON.parse(text);
      return { success: true, breakdown };
    },
    () => ({
      success: true,
      breakdown: {
        intuitiveSummary: `${params.topicTitle} revolves around applying core foundational relations to predict system behavior using conservative boundary conditions.`,
        coreDerivationOrFormula: 'Governing Equation: State the base relation, identify boundary constraints, and solve for required outputs.',
        examTrap: 'Students often memorize the final equation without stating initial assumptions, costing 30% marks.',
        fastTrackCramTip: 'Master 2 standard solved examples from the textbook.',
        bookPagesToFocus: `Read the chapter summary and 3 solved numericals in ${params.referenceBook || 'prescribed textbook'}.`
      }
    })
  );
}

// ---------------------------------------------------------------------------
// 7. Video Breakdown Intel
// ---------------------------------------------------------------------------
export async function geminiVideoBreakdownApi(params: {
  topicName: string;
  subtopicName?: string;
  courseName: string;
  videoTitle?: string;
  conceptFocus?: string;
  level?: string;
}): Promise<any> {
  return safeApiCall(
    '/api/gemini-video-breakdown',
    params,
    async () => {
      const effectiveSubtopic = params.subtopicName || params.topicName;
      const prompt = `Provide an academic concept breakdown for:
Course: "${params.courseName}"
Syllabus Sub-Unit: "${effectiveSubtopic}"
Video Title: "${params.videoTitle || effectiveSubtopic}"

Return JSON:
{
  "summary": "...",
  "coreFormulas": ["..."],
  "derivationSteps": [
    { "step": 1, "title": "...", "explanation": "...", "mathSnippet": "..." }
  ],
  "examDeductionTraps": ["..."],
  "mustIncludeForFullMarks": ["..."],
  "sampleExamQuestion": { "question": "...", "marks": 7, "solutionOutline": "..." }
}`;

      const text = await safeGenerateContent((model) => ({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }));

      const breakdown = JSON.parse(text);
      return { success: true, breakdown };
    },
    () => ({
      success: true,
      breakdown: {
        summary: `Targeted academic module for ${params.subtopicName || params.topicName} covering governing principles and university semester PYQ patterns.`,
        coreFormulas: [
          'Governing Energy / Balance Relation: Input_Energy = Output_Energy + Losses',
          'Fundamental Equation: Y = f(X) with boundary parameters'
        ],
        derivationSteps: [
          { step: 1, title: 'Declare System & Assumptions', explanation: 'State system bounds and steady state criteria', mathSnippet: 'State 1 -> State 2' },
          { step: 2, title: 'Apply Base Relation', explanation: 'Substitute given variables into base formulation', mathSnippet: 'LHS = RHS' },
          { step: 3, title: 'Evaluate & Box Answer', explanation: 'Box final evaluated output with units', mathSnippet: 'Result with SI units' }
        ],
        examDeductionTraps: ['Skipping intermediate calculation steps', 'Omitting SI units'],
        mustIncludeForFullMarks: ['Labeled schematic diagram', 'List of assumed constants'],
        sampleExamQuestion: {
          question: `Derive the expression for ${params.subtopicName || params.topicName} and evaluate for given parameters. (7 Marks)`,
          marks: 7,
          solutionOutline: 'State assumptions -> Apply base equation -> Box final result.'
        }
      }
    })
  );
}

// ---------------------------------------------------------------------------
// 8. In-Player Video Tutor Q&A
// ---------------------------------------------------------------------------
export async function geminiVideoAskApi(params: {
  courseName: string;
  unitNumber?: number;
  topicName: string;
  subtopicName?: string;
  videoTitle: string;
  question: string;
}): Promise<any> {
  return safeApiCall(
    '/api/gemini-video-ask',
    params,
    async () => {
      const prompt = `You are a university tutor answering a student's question while watching a video lecture.
Course: "${params.courseName}"
Topic: "${params.subtopicName || params.topicName}"
Video: "${params.videoTitle}"
Student Doubt: "${params.question}"

Provide a concise, crystal-clear explanation under 200 words covering:
1. Core Answer
2. Mathematical Formula (if relevant)
3. Exam Scoring Tip.`;

      const answerText = await safeGenerateContent((model) => ({
        model,
        contents: prompt
      }));

      return { success: true, answer: answerText };
    },
    () => ({
      success: true,
      answer: `Academic Guidance for "${params.subtopicName || params.topicName}":\n\n• Core Principle: Focus on the governing energy and physical balance equations for this syllabus unit.\n• Step Verification: Review boundary conditions and initial state parameters.\n• University Marking Tip: Draw the corresponding schematic diagram and box the final result with proper units to guarantee maximum marks.`
    })
  );
}
