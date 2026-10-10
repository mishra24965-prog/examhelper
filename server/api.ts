import express from 'express';
import { GoogleGenAI } from '@google/genai';

const asyncHandler = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('Unhandled API error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error', message: err?.message || 'Unknown error' });
      }
    });
  };

export function createApiApp() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Route normalizer for Netlify functions routing
  app.use((req, res, next) => {
    if (req.url.startsWith('/.netlify/functions/api')) {
      req.url = req.url.replace('/.netlify/functions/api', '/api');
    }
    next();
  });

  // Dynamic Server-side Gemini API client initialization
  function getAiClient(): GoogleGenAI | null {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.REACT_APP_GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  // Candidate models prioritizing fast, reliable flash tiers
  const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  async function generateContentSafely(buildOptions: (model: string) => any): Promise<any> {
    const ai = getAiClient();
    if (!ai) {
      throw new Error('Gemini API key is not configured in server environment variables (GEMINI_API_KEY)');
    }

    let lastErr: any = null;
    for (const model of CANDIDATE_MODELS) {
      try {
        const options = buildOptions(model);
        return await ai.models.generateContent(options);
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${model} call failed:`, err?.message || err);
        continue;
      }
    }
    throw new Error(`Gemini API calls failed on candidate models. Last error: ${lastErr?.message || 'Unknown error'}`);
  }

  // -------------------------------------------------------------
  // Course Dictionary & Terminology Database
  // -------------------------------------------------------------
  const CANONICAL_DICTIONARY = [
    { term: "Leibnitz Theorem", unit: 1, aliases: ["leibnitz", "leibniz", "le!bn!tz", "nth derivative of product"], canonicalName: "Leibnitz's Theorem" },
    { term: "Taylor's Theorem", unit: 1, aliases: ["taylor", "tayl0r", "taylors series", "lagrange remainder"], canonicalName: "Taylor's Theorem" },
    { term: "Maclaurin's Series", unit: 1, aliases: ["maclaurin", "maclaur!n", "macl@urin", "expansion at x=0"], canonicalName: "Maclaurin's Series" },
    { term: "Asymptotes", unit: 1, aliases: ["asymptote", "parallel asymptote", "oblique asymptote"], canonicalName: "Asymptotes" },
    { term: "Radius of Curvature", unit: 1, aliases: ["curvature", "radius of curvature", "rho", "pedal equation"], canonicalName: "Radius of Curvature" },
    { term: "Euler's Theorem", unit: 2, aliases: ["euler", "eul3r", "homogeneous function", "x du/dx + y du/dy"], canonicalName: "Euler's Theorem on Homogeneous Functions" },
    { term: "Jacobian", unit: 2, aliases: ["jacobian", "jac0b!an", "jac0bian", "functional determinant", "d(u,v)/d(x,y)"], canonicalName: "Jacobian Matrix & Transformations" },
    { term: "Maxima and Minima", unit: 2, aliases: ["maxima", "minima", "saddle point", "ac - b^2", "stationary points"], canonicalName: "Multivariable Extrema & Saddle Points" },
    { term: "Lagrange Multipliers", unit: 2, aliases: ["lagrange multiplier", "undetermined multipliers", "constrained extrema"], canonicalName: "Lagrange's Undetermined Multipliers" },
    { term: "Partial Differentiation", unit: 2, aliases: ["partial derivative", "du/dx", "du/dy", "higher partials"], canonicalName: "Partial Differentiation" },
    { term: "Change of Order of Integration", unit: 3, aliases: ["change order", "order of integration", "double integral"], canonicalName: "Change of Order of Integration" },
    { term: "Beta and Gamma Functions", unit: 3, aliases: ["beta function", "gamma function", "dirichlet integral", "legendre duplication"], canonicalName: "Beta and Gamma Functions" },
    { term: "Multiple Integrals", unit: 3, aliases: ["double integral", "triple integral", "volume integral", "surface area integral"], canonicalName: "Multiple Integrals (Area & Volume)" },
    { term: "Vector Differentiation", unit: 4, aliases: ["gradient", "grad", "divergence", "div", "curl", "solenoidal", "irrotational"], canonicalName: "Gradient, Divergence & Curl" },
    { term: "Gauss Divergence Theorem", unit: 5, aliases: ["gauss", "g@uss", "divergence theorem", "volume to surface flux"], canonicalName: "Gauss Divergence Theorem" },
    { term: "Green's Theorem", unit: 5, aliases: ["green theorem", "greens theorem", "gr3en", "plane line integral"], canonicalName: "Green's Theorem in a Plane" },
    { term: "Stokes' Theorem", unit: 5, aliases: ["stokes theorem", "st0kes", "curl over surface"], canonicalName: "Stokes' Curl Theorem" }
  ];

  function cleanExamPaperText(raw: string, courseName?: string): string {
    if (!raw) return '';

    let cleaned = raw
      // Remove scan watermarks and camera artifact labels
      .replace(/\[OCR SCAN[^\n\]]*\]/gi, '')
      .replace(/={3,}[^=\n]*={3,}/gi, '')
      .replace(/\|{3,}[^|\n]*\|{3,}/gi, '')
      .replace(/CAMERA ARTIFACTS DETECTED/gi, '')
      // Fix institution names and headers
      .replace(/!ET-D@VV/gi, 'IET-DAVV')
      .replace(/!ET-DAVV/gi, 'IET-DAVV')
      .replace(/EXAM!NAT!0N/gi, 'EXAMINATION')
      .replace(/D3C/gi, 'DEC')
      // Fix mathematician / theorem names
      .replace(/Le!bn!tzs?/gi, "Leibnitz's")
      .replace(/Le!bnitz/gi, "Leibnitz")
      .replace(/Leibnitzs/gi, "Leibnitz's")
      .replace(/Eul3r'?s?/gi, "Euler's")
      .replace(/Tayl0r'?s?/gi, "Taylor's")
      .replace(/Lagr4nge/gi, 'Lagrange')
      .replace(/Macl@urin/gi, 'Maclaurin')
      .replace(/Maclaur!n/gi, 'Maclaurin')
      .replace(/Jac0b!an/gi, 'Jacobian')
      .replace(/Jac0bian/gi, 'Jacobian')
      .replace(/G@uss/gi, 'Gauss')
      .replace(/D!vergence/gi, 'Divergence')
      .replace(/St0kes/gi, 'Stokes')
      .replace(/Gr3en/gi, 'Green')
      // Fix common OCR typos in math keywords
      .replace(/St4te/gi, 'State')
      .replace(/pr0ve/gi, 'prove')
      .replace(/sh0w/gi, 'show')
      .replace(/th4t/gi, 'that')
      .replace(/tw0/gi, 'two')
      .replace(/functi0ns?/gi, 'functions')
      .replace(/der!vat!ve/gi, 'derivative')
      .replace(/rem@inder/gi, 'remainder')
      .replace(/f0rm/gi, 'form')
      .replace(/exp@nd/gi, 'expand')
      .replace(/f0rmula/gi, 'formula')
      .replace(/h0m0geneous/gi, 'homogeneous')
      .replace(/C4lculate/gi, 'Calculate')
      .replace(/Ev@luate/gi, 'Evaluate')
      .replace(/spher!cal/gi, 'spherical')
      .replace(/reg!on/gi, 'region')
      .replace(/tr@nsf0rming/gi, 'transforming')
      .replace(/sph3rical/gi, 'spherical')
      .replace(/p0lar/gi, 'polar')
      .replace(/c00rdinates/gi, 'coordinates')
      .replace(/Ver!fy/gi, 'Verify')
      .replace(/f0r/gi, 'for')
      .replace(/acr0ss/gi, 'across')
      .replace(/un!t/gi, 'unit')
      // Standardize marks representations: [8 Mks], [8 M], [8Marks] -> [8 Marks]
      .replace(/\[\s*(\d+)\s*(?:Mks?|M|Marks?)\s*\]/gi, '[$1 Marks]')
      // Normalize question indicators on fresh lines
      .replace(/\n\s*(Q\.?\s*\d+[\.\s]*\([a-z]\))/gi, '\n\n$1')
      .replace(/\n\s*(\([a-z]\))/gi, '\n   $1')
      .trim();

    return cleaned;
  }

  function detectExamMetadata(text: string) {
    let examType: 'MST-1' | 'MST-2' | 'End-Sem' | 'Quiz' = 'End-Sem';
    if (/MST[-\s]*1|Mid[-\s]*Sem(?:ester)?[-\s]*1/i.test(text)) {
      examType = 'MST-1';
    } else if (/MST[-\s]*2|Mid[-\s]*Sem(?:ester)?[-\s]*2/i.test(text)) {
      examType = 'MST-2';
    } else if (/Quiz|Class\s*Test/i.test(text)) {
      examType = 'Quiz';
    }

    const yearMatch = text.match(/\b(201[8-9]|202[0-6])\b/);
    const year = yearMatch ? parseInt(yearMatch[1]) : 2024;

    const marksMatch = text.match(/(?:Max(?:imum)?\s*Marks|Marks)[:\s]*(\d+)/i);
    const totalMarks = marksMatch ? parseInt(marksMatch[1]) : (examType === 'End-Sem' ? 50 : 20);

    return { examType, year, totalMarks };
  }

  function detectDictionaryTerms(text: string) {
    const textLower = text.toLowerCase();
    const matched = [];

    for (const item of CANONICAL_DICTIONARY) {
      let count = 0;
      for (const alias of item.aliases) {
        const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          count += matches.length;
        }
      }
      if (count > 0 || textLower.includes(item.term.toLowerCase())) {
        matched.push({
          term: item.term,
          canonicalName: item.canonicalName,
          unit: item.unit,
          occurrences: Math.max(1, count)
        });
      }
    }

    return matched;
  }

  // -------------------------------------------------------------
  // Endpoint 1: Extract Text from Uploaded PDF / Image / Document
  // -------------------------------------------------------------
  app.post('/api/extract-text', asyncHandler(async (req, res) => {
    const { fileBase64, mimeType, fileName, courseName } = req.body || {};

    if (!fileBase64) {
      return res.status(400).json({ error: 'No file data received' });
    }

    try {
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      let resolvedMime = (mimeType || '').toLowerCase().trim();
      const mimeMatch = fileBase64.match(/^data:([^;]+);base64,/i);
      if (mimeMatch && mimeMatch[1]) {
        resolvedMime = mimeMatch[1].toLowerCase().trim();
      }

      const lowerName = (fileName || '').toLowerCase().trim();
      if (!resolvedMime || resolvedMime === 'application/octet-stream') {
        if (lowerName.endsWith('.pdf')) resolvedMime = 'application/pdf';
        else if (lowerName.endsWith('.png')) resolvedMime = 'image/png';
        else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) resolvedMime = 'image/jpeg';
        else if (lowerName.endsWith('.webp')) resolvedMime = 'image/webp';
        else if (lowerName.endsWith('.txt')) resolvedMime = 'text/plain';
      }

      if (resolvedMime === 'image/jpg' || resolvedMime === 'image/pjpeg') {
        resolvedMime = 'image/jpeg';
      }

      const isPdf = resolvedMime.includes('pdf') || lowerName.endsWith('.pdf');
      const isTextFile = resolvedMime.includes('text') || lowerName.endsWith('.txt');

      let rawExtractedText = '';
      let method: 'gemini-vision-ocr' | 'pdf-native' | 'direct-text' = 'gemini-vision-ocr';
      let pagesCount = 1;

      // 0. If it's a plain text document, decode directly
      if (isTextFile) {
        rawExtractedText = buffer.toString('utf-8');
        method = 'direct-text';
      }

      // 1. If it's a PDF, first attempt instant native text extraction using PDFParse
      if (isPdf && !rawExtractedText) {
        try {
          const pdfModule: any = await import('pdf-parse');
          // Handle function-style export (v1)
          if (typeof pdfModule === 'function') {
            const data = await pdfModule(buffer);
            if (data && typeof data.text === 'string' && data.text.trim().length > 0) {
              const cleaned = data.text.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
              if (cleaned.length > 0) {
                rawExtractedText = cleaned;
                pagesCount = data.numpages || 1;
                method = 'pdf-native';
              }
            }
          } else {
            // Handle class-style export (v2)
            const PDFParseClass = pdfModule.PDFParse || pdfModule.default?.PDFParse || pdfModule.default;
            if (typeof PDFParseClass === 'function') {
              const parser = new PDFParseClass({ data: buffer });
              if (parser && typeof parser.getText === 'function') {
                const textResult = await parser.getText();
                if (textResult && typeof textResult.text === 'string') {
                  const cleaned = textResult.text.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
                  if (cleaned.length > 0) {
                    rawExtractedText = cleaned;
                    pagesCount = textResult.total || 1;
                    method = 'pdf-native';
                  }
                }
              }
            }
          }
        } catch (pdfErr: any) {
          console.warn('PDF native parse note; falling back to Gemini Vision OCR:', pdfErr?.message || pdfErr);
        }
      }

      // 2. If text is empty/sparse (e.g. scanned image PDF or smartphone photo), use Gemini Vision OCR
      const ai = getAiClient();
      if (!rawExtractedText && ai) {
        try {
          const targetMime = isPdf ? 'application/pdf' : (resolvedMime || 'image/jpeg');
          const ocrPrompt = `You are a high-accuracy document transcription and exam paper OCR expert.
Transcribe ALL text from this examination question paper document verbatim into clean text format.
CRITICAL REQUIREMENTS:
1. Preserve every question number cleanly (e.g., Q1. (a), Q1. (b), Q2. (a), Q3.).
2. Preserve marks indications in square brackets (e.g., [8 Marks], [6 Marks]).
3. Accurately transcribe mathematical formulas, Greek letters, equations, and expressions (e.g., y = (sin^-1 x)^2, ∂u/∂x, Leibnitz theorem, Euler's formula, integrals ∬, Jacobians).
4. Remove camera glare, shadows, skew lines, scanner artifacts, and stray paper borders.
5. Return ONLY the transcribed text content in clean text format.`;

          const response = await generateContentSafely((model) => ({
            model,
            contents: {
              parts: [
                { inlineData: { mimeType: targetMime, data: cleanBase64 } },
                { text: ocrPrompt }
              ]
            }
          }));

          if (response && response.text && response.text.trim().length > 0) {
            rawExtractedText = response.text.trim();
            method = 'gemini-vision-ocr';
          }
        } catch (ocrErr: any) {
          console.error('Gemini Vision OCR error in /api/extract-text:', ocrErr?.message || ocrErr);
        }
      }

      // If document yielded no text after both PDF-native parse and Gemini OCR
      if (!rawExtractedText || rawExtractedText.trim().length === 0) {
        return res.status(422).json({
          success: false,
          error: 'No readable text could be extracted from this document. Please ensure the document contains legible questions, or paste your questions in the "Paste Text" tab.'
        });
      }

      // 3. Clean and normalize the text format
      const cleanedText = cleanExamPaperText(rawExtractedText, courseName);

      // 4. Extract metadata & dictionary matches
      const detectedInfo = detectExamMetadata(cleanedText);
      const dictionaryMatches = detectDictionaryTerms(cleanedText);

      return res.json({
        success: true,
        rawExtractedText,
        cleanedText,
        method,
        pagesCount,
        detectedInfo,
        dictionaryMatches,
        charCount: cleanedText.length
      });
    } catch (err: any) {
      console.error('Document text extraction failed:', err);
      return res.status(500).json({ error: 'Failed to extract text from document: ' + (err?.message || 'Server error') });
    }
  }));

  // -------------------------------------------------------------
  // Endpoint 2: Clean Messy OCR Text & Normalize Equations
  // -------------------------------------------------------------
  app.post('/api/clean-text', asyncHandler(async (req, res) => {
    const { rawText, courseName, syllabusUnits } = req.body || {};
    if (!rawText) {
      return res.status(400).json({ error: 'No raw text provided' });
    }

    try {
      let cleanedText = cleanExamPaperText(rawText, courseName);

      // If Gemini is available, run an intelligent equation and question structuring pass
      const ai = getAiClient();
      if (ai) {
        try {
          const cleanPrompt = `You are a mathematical typography and exam question formatting specialist.
  Given this raw, noisy exam paper text, clean it completely:
  - Fix OCR noise, broken lines, garbled mathematical expressions (e.g. Leibnitz, Euler, Jacobians, derivatives, integrals).
  - Ensure each question begins on a clean line with its question number (e.g. Q1. (a)).
  - Ensure marks allocations are formatted like [8 Marks] at the end of each question.
  - Do not add conversational text or code backticks. Return ONLY the cleaned text.

  Raw Text:
  ${rawText}`;

          const response = await generateContentSafely((model) => ({
            model,
            contents: cleanPrompt
          }));

          if (response && response.text) {
            cleanedText = response.text.trim();
          }
        } catch (aiErr: any) {
          console.log('AI clean pass unavailable; using heuristic cleaner.');
        }
      }

      const detectedInfo = detectExamMetadata(cleanedText);
      const dictionaryMatches = detectDictionaryTerms(cleanedText);

      return res.json({
        success: true,
        cleanedText,
        detectedInfo,
        dictionaryMatches
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to clean text' });
    }
  }));

  // -------------------------------------------------------------
  // Endpoint 3: Check Paper Text Against Course Dictionary
  // -------------------------------------------------------------
  app.post('/api/check-dictionary', asyncHandler(async (req, res) => {
    const { text, syllabusUnits } = req.body || {};
    const matches = detectDictionaryTerms(text || '');
    return res.json({
      success: true,
      matches,
      totalTermsChecked: CANONICAL_DICTIONARY.length,
      canonicalDictionary: CANONICAL_DICTIONARY
    });
  }));

  // -------------------------------------------------------------
  // Endpoint 4: Analyze Paper & Extract Questions (Messy OCR / PDF / Image / Text past papers)
  // -------------------------------------------------------------
  app.post('/api/analyze-paper', asyncHandler(async (req, res) => {
    const { rawText, cleanedText, imageBase64, imageMimeType, courseName, syllabusUnits, paperYear, examType } = req.body || {};
    const paperTextToUse = cleanedText || rawText || '';

    try {
      const syllabusPrompt = syllabusUnits && Array.isArray(syllabusUnits)
        ? syllabusUnits.map((u: any) => `Unit ${u.unit}: ${u.title} (ID: ${u.id}). Topics: ${u.subtopics?.join(', ')}`).join('\n')
        : 'General engineering syllabus units';

      const systemInstruction = `You are an expert university professor and exam paper analysis specialist.
  Your task is to analyze past university exam question papers (which may come from messy OCR text, scans, or handwritten notes), extract every question cleanly, remove OCR noise, and categorize each question.
  Map each question to the most relevant syllabus unit ID provided.
  Categorize questionType as one of: 'theory', 'numerical', 'derivation', 'diagram_design', 'code'.
  Categorize difficulty as: 'easy', 'medium', 'hard'.
  Estimate or extract the marks (default to 6-10 if not explicitly indicated).`;

      const promptText = `Analyze this past question paper for course: "${courseName || 'Applied Course'}".
  Exam Type: ${examType || 'End-Sem'}, Year: ${paperYear || new Date().getFullYear()}.

  Available Syllabus Units:
  ${syllabusPrompt}

  ${paperTextToUse ? `Extracted Paper Text:\n${paperTextToUse}` : 'Please extract all questions from the attached document.'}

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
  IMPORTANT: Return ONLY the JSON array without any markdown fences, backticks, or extra commentary.`;

      const ai = getAiClient();
      if (ai) {
        const response = await generateContentSafely((model) => {
          if (imageBase64 && imageMimeType && !paperTextToUse) {
            const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
            return {
              model,
              contents: {
                parts: [
                  { inlineData: { mimeType: imageMimeType, data: cleanBase64 } },
                  { text: promptText }
                ]
              },
              config: {
                systemInstruction,
                responseMimeType: 'application/json'
              }
            };
          } else {
            return {
              model,
              contents: promptText,
              config: {
                systemInstruction,
                responseMimeType: 'application/json'
              }
            };
          }
        });

        const textOutput = response.text || '[]';
        let parsedQuestions = [];
        try {
          parsedQuestions = JSON.parse(textOutput);
        } catch {
          const jsonMatch = textOutput.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            parsedQuestions = JSON.parse(jsonMatch[0]);
          }
        }

        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          return res.json({ success: true, questions: parsedQuestions, method: 'gemini-ai' });
        }
      }
      throw new Error('AI parsing fallback needed');
    } catch {
      // Robust Heuristic Fallback Parser from paper text or syllabus units
      const fallbackQuestions: any[] = [];
      const textToParse = paperTextToUse || cleanExamPaperText(rawText || '', courseName);

      if (textToParse) {
        const lines = textToParse.split('\n').filter((l: string) => l.trim().length > 0);
        let currentQ: any = null;

        lines.forEach((line: string) => {
          const qMatch = line.match(/^(?:Q|Question|\(?\d+\)?)\s*(\d+[a-z\(\)]*|\([a-z]\))/i);
          const marksMatch = line.match(/\[\s*(\d+)\s*(?:Marks?|M)\s*\]/i);

          if (qMatch || (line.length > 25 && !currentQ)) {
            if (currentQ) fallbackQuestions.push(currentQ);
            const marks = marksMatch ? parseInt(marksMatch[1]) : 8;
            const cleanText = line.replace(/\[\s*\d+\s*(?:Marks?|M)\s*\]/i, '').trim();

            const unit = syllabusUnits?.[fallbackQuestions.length % (syllabusUnits?.length || 1)] || {
              id: 'u1',
              title: 'Core Syllabus Topic'
            };

            currentQ = {
              questionNumber: qMatch ? `Q${qMatch[1]}` : `Q${fallbackQuestions.length + 1}`,
              text: cleanText,
              marks,
              topicId: unit.id,
              topicName: unit.title,
              questionType: line.toLowerCase().includes('derive') ? 'derivation' :
                            line.toLowerCase().includes('calculate') || line.toLowerCase().includes('find') || line.toLowerCase().includes('evaluate') ? 'numerical' :
                            line.toLowerCase().includes('draw') || line.toLowerCase().includes('plot') ? 'diagram_design' : 'theory',
              difficulty: marks >= 10 ? 'hard' : marks <= 5 ? 'easy' : 'medium',
              tags: ['PYQ', courseName?.split(' ')?.[0] || 'Core']
            };
          } else if (currentQ) {
            currentQ.text += ' ' + line.trim();
          }
        });
        if (currentQ) fallbackQuestions.push(currentQ);
      }

      // If still empty or no text provided, generate structured questions from syllabus units
      if (fallbackQuestions.length === 0) {
        const units = Array.isArray(syllabusUnits) && syllabusUnits.length > 0
          ? syllabusUnits
          : [{ id: 'u1', title: 'Core Concepts', subtopics: ['Fundamental Theorem & Principles'] }];

        units.forEach((u: any, idx: number) => {
          const primarySubtopic = u.subtopics?.[0] || u.title;
          fallbackQuestions.push({
            questionNumber: `Q${idx + 1}(a)`,
            text: `Derive the fundamental governing relation for ${primarySubtopic}. State all assumptions clearly and demonstrate the step-by-step mathematical formulation.`,
            marks: 8,
            topicId: u.id,
            topicName: u.title,
            questionType: 'derivation',
            difficulty: 'medium',
            tags: ['PYQ', examType || 'End-Sem', String(paperYear || 2024)]
          });
          if (u.subtopics && u.subtopics.length > 1) {
            fallbackQuestions.push({
              questionNumber: `Q${idx + 1}(b)`,
              text: `Solve a numerical problem evaluating ${u.subtopics[1]} under standard boundary conditions. Include dimensional units and final calculated values.`,
              marks: 8,
              topicId: u.id,
              topicName: u.title,
              questionType: 'numerical',
              difficulty: 'hard',
              tags: ['PYQ', examType || 'End-Sem', String(paperYear || 2024)]
            });
          }
        });
      }

      return res.json({ success: true, questions: fallbackQuestions, fallback: true });
    }
  }));

  // 2. Teacher Demands & Reference Book Analysis
  app.post('/api/analyze-teacher-demands', asyncHandler(async (req, res) => {
    const { courseName, topicName, referenceBooks, questionsSample } = req.body || {};
    try {
      const ai = getAiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured.');
      }

      const prompt = `Analyze what a university professor/evaluator strictly demands when grading the topic "${topicName}" in course "${courseName}".
  Student's Prescribed Reference Books: ${referenceBooks || 'Standard University Textbook'}
  Sample Past Exam Questions on this topic:
  ${JSON.stringify(questionsSample || [], null, 2)}

  Provide a rigorous analysis covering:
  1. "gradingMindset": Evaluator psychology, what gets full marks (e.g. step derivation vs final answer).
  2. "mustIncludeElements": Array of 3-5 mandatory things students must draw or write (e.g., timing diagrams, stating assumptions, units).
  3. "frequentDeductionTraps": Array of 2-4 subtle mistakes where students lose 30-50% marks.
  4. "teacherCopyPastePattern": Where teachers usually lift numericals or theory from (e.g. textbook end-of-chapter problems).
  5. "bookSectionToPrioritize": Specific chapters, theorems, or solved examples to master from the reference book to save 70% study time.
  6. "bookSectionsToSkip": Dense, low-yield theoretical sections in the reference book to completely avoid before MSTs/End-Sem.

  Return ONLY a JSON object:
  {
    "gradingMindset": "...",
    "mustIncludeElements": ["..."],
    "frequentDeductionTraps": ["..."],
    "teacherCopyPastePattern": "...",
    "bookSectionToPrioritize": "...",
    "bookSectionsToSkip": "..."
  }`;

      const response = await generateContentSafely((model) => {
        return {
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        };
      });

      const result = JSON.parse(response.text || '{}');
      res.json({ success: true, insight: result });
    } catch {
      console.log('Using structured fallback insight for /api/analyze-teacher-demands');
      res.json({
        success: true,
        insight: {
          gradingMindset: `In ${topicName}, professors strictly grade step-by-step mathematical reasoning, explicitly stated assumptions, and standard diagrams. Skipping straight to the final numerical result leads to severe marks penalties.`,
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
          teacherCopyPastePattern: `Examiners routinely copy exercise numericals and standard derivations directly from ${referenceBooks || 'prescribed textbook'} chapter summaries.`,
          bookSectionToPrioritize: `${referenceBooks || 'Prescribed textbook'}: Master all solved examples at the end of the chapter. They carry over 75% repetition probability.`,
          bookSectionsToSkip: 'Historical context, proof of secondary lemmas, and non-core appendices.'
        },
        fallback: true
      });
    }
  }));

  // 3. Solve PYQ with Teacher-Graded Model Answer
  app.post('/api/solve-pyq', asyncHandler(async (req, res) => {
    const { questionText, marks, topicName, courseName, referenceBook } = req.body || {};
    try {
      const ai = getAiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured.');
      }

      const prompt = `You are a university chief examiner preparing a student model answer for this exam question:
  Course: ${courseName}
  Topic: ${topicName}
  Prescribed Textbook: ${referenceBook || 'Standard University Textbook'}
  Total Marks: ${marks || 10}

  Question:
  "${questionText}"

  CRITICAL MATHEMATICAL FORMATTING RULES:
  1. REPLACE ALL COMPLEX LATEX WITH READABLE, STANDARD MATHEMATICAL NOTATION.
     - DO NOT use LaTeX commands (NO \\frac{}{}, NO \\partial, \\sum_{}, \\int_{}, \\boxed{}, \\text{}, \\binom{}{}, NO $ delimiters).
     - Use standard Unicode math symbols: ², ³, ⁿ, ₁, ₂, ·, ×, ÷, √, ∫, ∂, ∇, Δ, →, ⇒, ⇔, ≤, ≥, ≠, ±, ∞, π, θ, λ, μ, σ.
     - Format fractions as readable textual expressions: (numerator) / (denominator). E.g.: (1 - x²) y₂ - x y₁ = 2.
     - Format derivatives clearly: dy/dx, d²y/dx², dⁿy/dxⁿ, ∂u/∂x, y₁, y₂, yₙ, yₙ₊₂.
     - Format binomial coefficients as C(n, k) or ⁿCₖ.
     - Format integrals as ∫[a to b] f(x) dx.
     - Format matrices as clean bracket rows: [ a   b ] / [ c   d ].
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

      const response = await generateContentSafely((model) => {
        return {
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        };
      });

      const solution = JSON.parse(response.text || '{}');
      res.json({ success: true, solution });
    } catch {
      console.log('Generating tailored standard math derivation for /api/solve-pyq');
      const totalMarks = marks || 8;
      const qLower = (questionText || '').toLowerCase();
      const tLower = (topicName || '').toLowerCase();

      let fullAnswerMarkdown = '';
      let diagramDesc = 'Draw a neat schematic / curve with arrows showing input flow, labeled threshold lines, and marked inflection points.';
      let proTip = 'Chief examiners grade the formula statement even if a calculation slip occurs later. Never skip writing the base formula!';
      let pitfall = 'Writing only the final numerical answer without showing intermediate step substitutions loses up to 60% of marks.';

      if (qLower.includes('leibnitz') || qLower.includes('sin^-1') || qLower.includes('nth derivative') || tLower.includes('differentiation')) {
        fullAnswerMarkdown = `Step 1: Given Function & Domain Declaration
  • Given: y = (sin⁻¹ x)²
  • Differentiating both sides with respect to x:
  • y₁ = 2 (sin⁻¹ x) · [1 / √(1 - x²)]
  • Cross-multiplying: √(1 - x²) · y₁ = 2 (sin⁻¹ x)

  Step 2: Squaring & Differentiating to Form Base Differential Equation
  • Squaring both sides:
  • (1 - x²) · (y₁)² = 4 (sin⁻¹ x)² = 4 y
  • Differentiating both sides with respect to x:
  • (1 - x²) · [2 y₁ y₂] + (-2x) · (y₁)² = 4 y₁
  • Dividing throughout by 2 y₁ (since y₁ ≠ 0):
  • (1 - x²) y₂ - x y₁ = 2   [Equation 1]

  Step 3: Differentiating n Times Using Leibnitz Theorem
  • Leibnitz Formula: dⁿ/dxⁿ (u · v) = uₙ · v + ⁿC₁ uₙ₋₁ · v' + ⁿC₂ uₙ₋₂ · v'' + ···
  • Applying Leibnitz theorem to each term of Equation 1:
  • For term (1 - x²) y₂:
    • u = y₂, v = (1 - x²)
    • = yₙ₊₂ · (1 - x²) + n · yₙ₊₁ · (-2x) + [n(n - 1) / 2] · yₙ · (-2)
    • = (1 - x²) yₙ₊₂ - 2n x yₙ₊₁ - n(n - 1) yₙ
  • For term x y₁:
    • = yₙ₊₁ · x + n · yₙ · (1) = x yₙ₊₁ + n yₙ
  • For constant 2: dⁿ/dxⁿ (2) = 0

  Step 4: Combining and Simplifying Terms
  • [(1 - x²) yₙ₊₂ - 2n x yₙ₊₁ - n(n - 1) yₙ] - [x yₙ₊₁ + n yₙ] = 0
  • Grouping coefficients of yₙ₊₁ and yₙ:
  • (1 - x²) yₙ₊₂ - (2n + 1) x yₙ₊₁ - [n(n - 1) + n] yₙ = 0
  • (1 - x²) yₙ₊₂ - (2n + 1) x yₙ₊₁ - n² yₙ = 0   [Equation 2]

  Step 5: Evaluating at x = 0 (Successive Value at Origin)
  • Substituting x = 0 into Equation 2:
  • yₙ₊₂(0) - n² yₙ(0) = 0
  • yₙ₊₂(0) = n² yₙ(0)   [Recurrence Relation]
  • From initial conditions at x = 0:
    • y(0) = 0, y₁(0) = 0, y₂(0) = 2
  • Since y₁(0) = 0, all odd derivatives at origin are zero:
    • (yₙ)₀ = 0 for all odd values of n.
  • For even values of n:
    • y₄(0) = 2² · y₂(0) = 2² · 2
    • y₆(0) = 4² · y₄(0) = 4² · 2² · 2
    • In general: (yₙ)₀ = (n - 2)² · (n - 4)² ··· 4² · 2² · 2
  • Final Answer: (1 - x²) yₙ₊₂ - (2n + 1) x yₙ₊₁ - n² yₙ = 0 and (yₙ)₀ = (n - 2)² ··· 2² · 2 for even n.`;
        diagramDesc = 'Sketch the curve y = (sin⁻¹ x)² showing symmetry about the y-axis, minimum at origin (0, 0), and vertical tangents at x = ±1.';
        proTip = 'Examiners award 2 marks exclusively for stating Equation 1 without errors. Always verify (1 - x²) y₂ - x y₁ = 2 before applying Leibnitz theorem!';
        pitfall = 'Forgetting to divide by 2 y₁ after the second differentiation is the most common student error, causing an extra y₁ factor in all subsequent steps.';
      } else if (qLower.includes('cayley') || qLower.includes('eigen') || qLower.includes('rank') || tLower.includes('matri')) {
        fullAnswerMarkdown = `Step 1: Declaration of Matrix and Characteristic Equation
  • Given square matrix A of order n × n.
  • Characteristic Equation: det(A - λI) = 0
  • Expanding the determinant polynomial:
  • λⁿ - c₁ λⁿ⁻¹ + c₂ λⁿ⁻² - ··· + (-1)ⁿ det(A) = 0
  • where:
    • c₁ = trace(A) = sum of principal diagonal elements
    • c₂ = sum of principal minors of order 2
    • det(A) = determinant of matrix A

  Step 2: Statement of Cayley-Hamilton Theorem
  • "Every square matrix satisfies its own characteristic equation."
  • Replacing scalar eigenvalue λ with square matrix A and constant term with scalar times Identity matrix I:
  • Aⁿ - c₁ Aⁿ⁻¹ + c₂ Aⁿ⁻² - ··· + (-1)ⁿ det(A) · I = O (Null Matrix)

  Step 3: Verification of Theorem
  • Compute matrix powers A², A³ by explicit matrix multiplication.
  • Substitute matrix powers into the characteristic polynomial equation.
  • Verify that each corresponding element sums to zero, confirming the LHS reduces identically to the zero matrix [O].

  Step 4: Computing Matrix Inverse A⁻¹ via Cayley-Hamilton
  • Multiply the verified matrix equation throughout by A⁻¹:
  • A⁻¹ · [Aⁿ - c₁ Aⁿ⁻¹ + c₂ Aⁿ⁻² - ··· + (-1)ⁿ det(A) · I] = [O]
  • Aⁿ⁻¹ - c₁ Aⁿ⁻² + c₂ Aⁿ⁻³ - ··· + (-1)ⁿ det(A) · A⁻¹ = [O]
  • Rearranging for A⁻¹:
  • (-1)ⁿ⁺¹ det(A) · A⁻¹ = - [Aⁿ⁻¹ - c₁ Aⁿ⁻² + c₂ Aⁿ⁻³ - ···]
  • A⁻¹ = [1 / det(A)] · [c₁ Aⁿ⁻² - Aⁿ⁻¹ - c₂ Aⁿ⁻³ + ···]

  Step 5: Final Result & Dimensional Verification
  • Final Answer: Verified A satisfies characteristic equation, and A⁻¹ = [1 / det(A)] · [c₁ I - A] (for 2×2) or [1 / det(A)] · [A² - c₁ A + c₂ I] (for 3×3).`;
        diagramDesc = 'Provide the step-by-step 3×3 matrix arithmetic array clearly showing diagonal elements and minor determinants.';
        proTip = 'Always write the constant term with Identity matrix I. Writing "- 6 = 0" instead of "- 6 I = O" loses 1 mark in DAVV evaluations.';
        pitfall = 'Directly finding the inverse using adjoint/det instead of the Cayley-Hamilton polynomial relation when the question specifically demands Cayley-Hamilton.';
      } else if (qLower.includes('thermo') || qLower.includes('carnot') || qLower.includes('entropy') || tLower.includes('thermodynamics')) {
        fullAnswerMarkdown = `Step 1: Given Data & State Parameters
  • State initial and final boundary conditions with standard SI units:
  • P₁ = Given Initial Pressure (kPa or bar)
  • V₁ = Given Initial Volume (m³)
  • T₁ = Given Initial Temperature (K = °C + 273.15)
  • Working Fluid Properties: Air (R = 0.287 kJ/kg·K, Cp = 1.005 kJ/kg·K, Cv = 0.718 kJ/kg·K, γ = 1.4)

  Step 2: Governing Thermodynamic Formulation
  • First Law of Thermodynamics for a closed system:
  • Q - W = ΔU = m · Cv · (T₂ - T₁)
  • For Ideal Gas Equation of State:
  • P · V = m · R · T  ⇒  m = (P₁ · V₁) / (R · T₁)

  Step 3: Process Work Done & Heat Transfer Calculation
  • Depending on the thermodynamic process:
  • Isobaric (P = C): W = P · (V₂ - V₁)
  • Isothermal (T = C): W = P₁ · V₁ · ln(V₂ / V₁) = m · R · T₁ · ln(P₁ / P₂)
  • Polytropic (P · Vⁿ = C): W = (P₁ · V₁ - P₂ · V₂) / (n - 1) = m · R · (T₁ - T₂) / (n - 1)
  • Adiabatic (P · V^γ = C): W = (P₁ · V₁ - P₂ · V₂) / (γ - 1)

  Step 4: Thermal Efficiency & Entropy Calculation
  • Thermal Efficiency: η = W_net / Q_in = 1 - (Q_out / Q_in)
  • For Carnot Cycle: η_carnot = 1 - (T_L / T_H)
  • Entropy Change: ΔS = m · Cp · ln(T₂ / T₁) - m · R · ln(P₂ / P₁)

  Step 5: Final Result with Engineering Units
  • Final Answer: Work Done W = Computed Value kJ; Thermal Efficiency η = Computed Value %; Entropy Change ΔS = Computed Value kJ/K.`;
        diagramDesc = 'Neat p-v and T-s indicator diagrams showing clockwise cycle direction, process curve curvatures, and state points 1, 2, 3, 4.';
        proTip = 'Always convert temperatures from Celsius to Kelvin (°C + 273.15) immediately in Step 1. Using Celsius in gas laws is an instant zero.';
        pitfall = 'Confusing internal energy change ΔU (which uses Cv for all ideal gas processes) with enthalpy change ΔH (which uses Cp).';
      } else if (qLower.includes('kirchhoff') || qLower.includes('thevenin') || qLower.includes('norton') || tLower.includes('network') || tLower.includes('electrical')) {
        fullAnswerMarkdown = `Step 1: Circuit Inspection & Parameter Declaration
  • Identify all independent voltage sources, current sources, and resistor values across branches.
  • Identify the load resistor R_L and label terminal nodes A and B across which the equivalent circuit is to be determined.

  Step 2: Determining Thevenin Open-Circuit Voltage V_th
  • Remove the load resistor R_L from terminals A and B (open circuit).
  • Apply Kirchhoff's Voltage Law (KVL) around independent loops:
    • Σ V = 0 around closed loop
  • Apply Kirchhoff's Current Law (KCL) at principal nodes:
    • Σ I_in = Σ I_out
  • Solve loop/node equations to find the potential difference V_AB:
  • V_th = V_AB (Open circuit voltage across terminals A and B)

  Step 3: Determining Thevenin Equivalent Resistance R_th
  • Deactivate all independent sources in the circuit:
    • Replace independent ideal voltage sources with short circuits (0 Ω).
    • Replace independent ideal current sources with open circuits (∞ Ω).
  • Calculate equivalent resistance between terminals A and B looking back into the network:
  • Combine series and parallel resistor combinations:
    • R_parallel = (R₁ · R₂) / (R₁ + R₂)
    • R_series = R₁ + R₂
  • R_th = R_AB (Thevenin resistance)

  Step 4: Reconnecting Load & Calculating Load Current I_L
  • Draw the simplified Thevenin equivalent circuit: V_th in series with R_th connected to R_L.
  • Load Current:
  • I_L = V_th / (R_th + R_L)
  • Load Voltage:
  • V_L = I_L · R_L = V_th · [R_L / (R_th + R_L)]
  • Power Delivered to Load:
  • P_L = (I_L)² · R_L

  Step 5: Final Result with Electrical Units
  • Final Answer: V_th = Evaluated V; R_th = Evaluated Ω; Load Current I_L = Evaluated A (or mA); Power P_L = Evaluated W (or mW).`;
        diagramDesc = 'Draw the original schematic with loop currents marked, followed by the deactivated source network for R_th, and the final single-loop Thevenin equivalent.';
        proTip = 'Always write the units (V, Ω, mA) next to intermediate results. Evaluators dock 0.5 marks per missing unit.';
        pitfall = 'Forgetting to deactivate dependent sources properly (dependent sources must NOT be shorted or opened; they require a 1V test source).';
      } else {
        fullAnswerMarkdown = `Step 1: Given Data & Problem Formulation
  • State all given numerical parameters, dimensional units, and boundary conditions:
  • Variable 1 = Given value with standard SI units
  • Variable 2 = Given value with standard SI units
  • Target Requirement = Parameter to be computed / Theorem to be established

  Step 2: Governing Engineering Law & Base Formulation
  • State the fundamental standard equation or physical theorem:
  • Governing Relation: Output = f(Input₁, Input₂, ···)
  • Define all symbols explicitly to secure standard rubric step marks.

  Step 3: Step-by-Step Algebraic Derivation & Substitution
  • Substitute the declared numerical parameters directly into the governing formulation:
  • Intermediate working line 1: Substitute parameters maintaining arithmetic integrity.
  • Intermediate working line 2: Simplify algebraic fractions without skipping intermediate steps.
  • Intermediate working line 3: Check dimensional consistency across LHS and RHS.

  Step 4: Evaluation & Simplification
  • Compute intermediate values step by step.
  • Final step arithmetic: Combine scalars and evaluate the primary quantity.

  Step 5: Final Result with Dimensional Units
  • Final Answer: Evaluated Parameter = Result Value with standard engineering units.
  • State the physical conclusion / engineering significance in one clear concluding sentence.`;
      }

      res.json({
        success: true,
        solution: {
          markingRubric: [
            { step: 'Step 1: Formula Declaration & Given Parameters', marksAwarded: 2, teacherExpectation: 'Explicitly state all variables, symbols, and standard governing formula.' },
            { step: 'Step 2: Step-by-Step Derivation & Intermediate Computation', marksAwarded: totalMarks - 4, teacherExpectation: 'Show step-by-step arithmetic without skipping intermediate lines.' },
            { step: 'Step 3: Final Evaluated Result & Units', marksAwarded: 2, teacherExpectation: 'Box the final scalar value with correct engineering units.' }
          ],
          fullAnswerMarkdown,
          diagramDescription: diagramDesc,
          teacherProTip: proTip,
          commonPitfallToAvoid: pitfall
        },
        fallback: true
      });
    }
  }));

  // 4. Video Recommendations via Gemini AI
  function generateServerTopicThumbnail(params: {
    title: string;
    subtopicName?: string;
    courseName: string;
    channel?: string;
    level?: string;
    queryType?: string;
  }): string {
    const { title, subtopicName, courseName, channel = 'University Lecture', level = 'Exam-Cram', queryType = 'derivation' } = params;
    const effectiveTopic = subtopicName || title;
    const lower = (courseName + ' ' + effectiveTopic).toLowerCase();

    let domain = 'ENGINEERING LECTURE';
    let bgStart = '#0f172a';
    let bgEnd = '#1e293b';
    let accent = '#38bdf8';
    let formula = 'ΔE = Q - W';

    if (lower.includes('mech') || lower.includes('thermo') || lower.includes('sfee') || lower.includes('otto') || lower.includes('diesel') || lower.includes('steam')) {
      domain = 'MECHANICAL ENGINEERING';
      bgStart = '#180d07';
      bgEnd = '#3c1808';
      accent = '#fb923c';
      formula = lower.includes('sfee') ? 'h₁ + V₁²/2 + gz₁ + q = h₂ + V₂²/2 + gz₂ + w' : lower.includes('otto') ? 'η = 1 - 1/r^(γ-1)' : 'dQ = dU + dW';
    } else if (lower.includes('math') || lower.includes('calculus') || lower.includes('leibnitz') || lower.includes('euler') || lower.includes('integral')) {
      domain = 'APPLIED MATHEMATICS';
      bgStart = '#0b0f19';
      bgEnd = '#2e1065';
      accent = '#c084fc';
      formula = lower.includes('leibnitz') ? 'yₙ = Σ ⁿCᵣ · uₙ₋ᵣ · vᵣ' : '∫∫ f(x,y) dx dy';
    } else if (lower.includes('electr') || lower.includes('circuit') || lower.includes('diode') || lower.includes('ac')) {
      domain = 'ELECTRONICS & ELECTRICAL';
      bgStart = '#022c22';
      bgEnd = '#064e3b';
      accent = '#34d399';
      formula = 'V = I · Z , f₀ = 1/(2π√LC)';
    }

    const cleanTitle = (title || effectiveTopic).replace(/[&<>"']/g, ' ').slice(0, 50);
    const cleanSub = (effectiveTopic).replace(/[&<>"']/g, ' ').slice(0, 40);
    const cleanChannel = channel.replace(/[&<>"']/g, ' ').slice(0, 30);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}"/>
          <stop offset="100%" stop-color="${bgEnd}"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#bg)"/>
      <rect x="32" y="32" width="220" height="26" rx="13" fill="rgba(255,255,255,0.08)" stroke="${accent}" stroke-width="1"/>
      <text x="44" y="49" fill="${accent}" font-family="system-ui,sans-serif" font-size="11" font-weight="800">${domain}</text>
      <rect x="470" y="32" width="138" height="26" rx="6" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.4)" stroke-width="1"/>
      <text x="539" y="49" text-anchor="middle" fill="#fda4af" font-family="monospace" font-size="10" font-weight="800">+${queryType.toUpperCase()}</text>
      <text x="32" y="98" fill="rgba(255,255,255,0.6)" font-family="system-ui,sans-serif" font-size="12" font-weight="600">SYLLABUS SUB-UNIT:</text>
      <text x="165" y="98" fill="${accent}" font-family="system-ui,sans-serif" font-size="12" font-weight="700">${cleanSub}</text>
      <text x="32" y="140" fill="#ffffff" font-family="system-ui,sans-serif" font-size="22" font-weight="800">${cleanTitle.slice(0, 35)}</text>
      ${cleanTitle.length > 35 ? `<text x="32" y="170" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="19" font-weight="700">${cleanTitle.slice(35)}</text>` : ''}
      <rect x="32" y="215" width="576" height="46" rx="10" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <text x="48" y="243" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="11" font-weight="700">CORE FORMULA:</text>
      <text x="165" y="243" fill="#fde047" font-family="monospace" font-size="12" font-weight="700">${formula}</text>
      <text x="32" y="318" fill="#ffffff" font-family="system-ui,sans-serif" font-size="13" font-weight="700">🎓 ${cleanChannel}</text>
      <rect x="460" y="300" width="148" height="26" rx="8" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" stroke-width="1"/>
      <text x="472" y="317" fill="#6ee7b7" font-family="system-ui,sans-serif" font-size="11" font-weight="700">✓ GEMINI AI CURATED</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  app.post('/api/suggest-videos', asyncHandler(async (req, res) => {
    const { topicName, courseName, subtopics, unitNumber, subtopicName, queryType } = req.body || {};
    const activeSubtopic = subtopicName || (subtopics && subtopics.length > 0 ? subtopics[0] : topicName);
    const isDerivationIntent =
      queryType === 'derivation' ||
      (queryType !== 'lecture' &&
        /(derivation|derive|theorem|proof|formula|equation|sfee|efficiency|leibnitz|euler|otto|diesel|gauss|stokes|laplace|bernoulli|cycle|refrigeration)/i.test(
          `${topicName} ${activeSubtopic}`
        ));
    const querySuffix = isDerivationIntent ? 'derivation' : 'university lecture';

    try {
      const ai = getAiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured.');
      }

      const prompt = `You are an expert engineering academic advisor powered by Gemini AI. Recommend 3 high-relevance YouTube video lectures for the syllabus unit/topic "${topicName}" in the course "${courseName}" (Unit ${unitNumber || 1}).
  Target Syllabus Sub-Unit: "${activeSubtopic}".
  All Subtopics for context: ${subtopics?.join(', ') || 'N/A'}.
  Required Query Suffix: "${querySuffix}".

  CRITICAL INSTRUCTION FOR YOUTUBE SEARCH:
  Each video object's "youtubeSearchQuery" MUST append "${querySuffix}" (e.g. "${activeSubtopic} ${querySuffix}" or "${courseName} ${activeSubtopic} ${querySuffix}").
  Educators to prefer: Dr. Gajendra Purohit, Gate Smashers, Neso Academy, All About Electronics, Gate Academy, NPTEL, Abdul Bari, Bhagwan Singh Vishwakarma.

  Categorize each video by difficulty and complexity:
  1. "Beginner" (Conceptual Foundation & Intuitive introduction - typically university lecture)
  2. "Exam-Cram" (Standard University PYQs & Core Derivations - derivation or university lecture)
  3. "Deep Dive" (Advanced Numerical Mastery & Multi-step Problems)

  Return a JSON array of 3 objects:
  [
    {
      "title": "Exact title of educational lecture",
      "channel": "Channel name (e.g. Dr. Gajendra Purohit / NPTEL / Gate Smashers / Neso Academy)",
      "durationMinutes": 20,
      "conceptFocus": "Clear explanation of what concept is taught",
      "youtubeSearchQuery": "${activeSubtopic} ${querySuffix}",
      "subtopicName": "${activeSubtopic}",
      "level": "Beginner" | "Exam-Cram" | "Deep Dive",
      "complexityCategory": "Foundation" | "Standard Exam" | "Advanced Numerical",
      "queryType": "${querySuffix}",
      "keyTimestamps": [
        { "time": "02:00", "topic": "Concept introduction" },
        { "time": "10:30", "topic": "Solved example" }
      ]
    }
  ]`;

      const response = await generateContentSafely((model) => {
        return {
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        };
      });

      const videos = JSON.parse(response.text || '[]');
      const formatted = videos.map((v: any, idx: number) => {
        const cleanSubtopic = v.subtopicName || activeSubtopic;
        const robustQuery =
          v.youtubeSearchQuery && v.youtubeSearchQuery.toLowerCase().includes(querySuffix)
            ? v.youtubeSearchQuery
            : `${courseName || ''} ${cleanSubtopic} ${querySuffix}`.trim();

        const topicThumbnail = generateServerTopicThumbnail({
          title: v.title,
          subtopicName: cleanSubtopic,
          courseName,
          channel: v.channel,
          level: v.level || (idx === 0 ? 'Beginner' : idx === 1 ? 'Exam-Cram' : 'Deep Dive'),
          queryType: querySuffix
        });

        return {
          ...v,
          id: `gemini-rec-${Date.now()}-${idx}`,
          unitNumber: unitNumber || 1,
          topicName,
          subtopicName: cleanSubtopic,
          youtubeSearchQuery: robustQuery,
          queryType: querySuffix,
          youtubeVideoId: v.youtubeVideoId || undefined,
          youtubeUrl: v.youtubeVideoId
            ? `https://www.youtube.com/watch?v=${v.youtubeVideoId}`
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(robustQuery)}`,
          thumbnailUrl: topicThumbnail,
          verified: true,
          source: 'gemini-ai'
        };
      });

      res.json({ success: true, videos: formatted, aiPowered: true });
    } catch {
      console.log('Using curated recommendations for /api/suggest-videos');
      const fallbackList = [
        {
          id: `vid-fb-1-${Date.now()}`,
          topicName,
          subtopicName: activeSubtopic,
          unitNumber: unitNumber || 1,
          title: `${activeSubtopic}: Comprehensive University Lecture & Foundation`,
          channel: courseName.toLowerCase().includes('mech') ? 'Gate Smashers' : 'NPTEL',
          durationMinutes: 18,
          conceptFocus: `Foundational overview of ${activeSubtopic} explaining definitions, mental models, and governing principles.`,
          youtubeSearchQuery: `${courseName || ''} ${activeSubtopic} university lecture`.trim(),
          queryType: 'university lecture',
          youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${courseName || ''} ${activeSubtopic} university lecture`)}`,
          thumbnailUrl: generateServerTopicThumbnail({
            title: `${activeSubtopic}: Comprehensive University Lecture & Foundation`,
            subtopicName: activeSubtopic,
            courseName,
            channel: 'Gate Smashers / NPTEL',
            level: 'Beginner',
            queryType: 'university lecture'
          }),
          level: 'Beginner',
          complexityCategory: 'Foundation',
          verified: true,
          keyTimestamps: [
            { time: '01:30', topic: 'Concept Fundamentals' },
            { time: '07:45', topic: 'Basic Formula & Terminology' }
          ]
        },
        {
          id: `vid-fb-2-${Date.now()}`,
          topicName,
          subtopicName: activeSubtopic,
          unitNumber: unitNumber || 1,
          title: `${activeSubtopic}: Step-by-Step Derivation & University PYQs`,
          channel: courseName.toLowerCase().includes('math') ? 'Dr. Gajendra Purohit' : 'Gate Academy',
          durationMinutes: 24,
          conceptFocus: `High-yield exam coverage of repeated semester proofs, equations, and scoring derivation steps.`,
          youtubeSearchQuery: `${courseName || ''} ${activeSubtopic} derivation`.trim(),
          queryType: 'derivation',
          youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${courseName || ''} ${activeSubtopic} derivation`)}`,
          thumbnailUrl: generateServerTopicThumbnail({
            title: `${activeSubtopic}: Step-by-Step Derivation & University PYQs`,
            subtopicName: activeSubtopic,
            courseName,
            channel: 'Gate Academy / NPTEL',
            level: 'Exam-Cram',
            queryType: 'derivation'
          }),
          level: 'Exam-Cram',
          complexityCategory: 'Standard Exam',
          verified: true,
          keyTimestamps: [
            { time: '02:00', topic: 'Exam Question Pattern' },
            { time: '11:15', topic: 'Core Derivation Steps' },
            { time: '18:40', topic: 'Boxed Final Result' }
          ]
        },
        {
          id: `vid-fb-3-${Date.now()}`,
          topicName,
          subtopicName: activeSubtopic,
          unitNumber: unitNumber || 1,
          title: `${activeSubtopic}: Advanced University Numericals & Complex Derivations`,
          channel: 'Knowledge Gate / NPTEL',
          durationMinutes: 30,
          conceptFocus: `Solving tough multi-step numericals, boundary conditions, and avoiding deduction traps under exam pressure.`,
          youtubeSearchQuery: `${courseName || ''} ${activeSubtopic} ${querySuffix}`.trim(),
          queryType: querySuffix,
          youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${courseName || ''} ${activeSubtopic} ${querySuffix}`)}`,
          thumbnailUrl: generateServerTopicThumbnail({
            title: `${activeSubtopic}: Advanced University Numericals & Complex Derivations`,
            subtopicName: activeSubtopic,
            courseName,
            channel: 'Knowledge Gate / NPTEL',
            level: 'Deep Dive',
            queryType: querySuffix
          }),
          level: 'Deep Dive',
          complexityCategory: 'Advanced Numerical',
          verified: true,
          keyTimestamps: [
            { time: '02:30', topic: 'Complex Problem Formulation' },
            { time: '14:20', topic: 'Boundary Condition Substitutions' },
            { time: '23:10', topic: 'Verification of Units' }
          ]
        }
      ];
      res.json({ success: true, videos: fallbackList, fallback: true });
    }
  }));

  // Endpoint alias for explicit Gemini Video Suggest
  app.post('/api/gemini-suggest-videos', asyncHandler(async (req, res) => {
    // Delegate directly to the suggest-videos handler
    req.url = '/api/suggest-videos';
    app._router.handle(req, res, () => {});
  }));

  // Dedicated Gemini AI Video Lecture Breakdown & Concept Intel
  app.post('/api/gemini-video-breakdown', asyncHandler(async (req, res) => {
    const { topicName, subtopicName, courseName, videoTitle, conceptFocus, level } = req.body || {};
    const effectiveSubtopic = subtopicName || topicName;

    try {
      const ai = getAiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured');
      }

      const prompt = `You are a distinguished engineering professor and examiner for university semester examinations. Provide an in-depth academic concept breakdown and exam scoring guide for the video lecture on:
  Course: "${courseName}"
  Syllabus Sub-Unit: "${effectiveSubtopic}"
  Video Title: "${videoTitle || effectiveSubtopic}"
  Difficulty Level: "${level || 'Exam-Cram'}"
  Core Focus: "${conceptFocus || 'University exam syllabus'}"

  Return a JSON object with this exact structure:
  {
    "summary": "2-3 concise sentences explaining the physical or mathematical concept clearly",
    "coreFormulas": [
      "Key equation 1 with variable definitions",
      "Key equation 2 with units"
    ],
    "derivationSteps": [
      {
        "step": 1,
        "title": "Initial Assumption & Governing Law",
        "explanation": "What to state first in the exam paper",
        "mathSnippet": "Base equation"
      },
      {
        "step": 2,
        "title": "Mathematical Transformation",
        "explanation": "Substitution and integration/simplification steps",
        "mathSnippet": "Working equation"
      },
      {
        "step": 3,
        "title": "Final Form & Unit Box",
        "explanation": "The boxed final expression that earns the full 7-10 marks",
        "mathSnippet": "Final derived formula"
      }
    ],
    "examDeductionTraps": [
      "Common student mistake 1 that results in deduction by university checkers",
      "Common student mistake 2 (e.g. forgetting boundary conditions or unit conversion)"
    ],
    "mustIncludeForFullMarks": [
      "Diagram or P-v/T-s curve required",
      "Stating all fundamental assumptions explicitly"
    ],
    "sampleExamQuestion": {
      "question": "A typical 7-10 mark university question from past papers on this subtopic",
      "marks": 7,
      "solutionOutline": "High-level step sequence for the solution"
    }
  }`;

      const response = await generateContentSafely((model) => {
        return {
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        };
      });

      const breakdown = JSON.parse(response.text || '{}');
      res.json({ success: true, breakdown, source: 'gemini-ai' });
    } catch (err: any) {
      console.warn('Gemini video breakdown fallback activated:', err?.message);
      // Intelligent academic fallback based on domain
      const isMech = (courseName + ' ' + effectiveSubtopic).toLowerCase().includes('mech') || (courseName + ' ' + effectiveSubtopic).toLowerCase().includes('thermo');
      const isMath = (courseName + ' ' + effectiveSubtopic).toLowerCase().includes('math') || (courseName + ' ' + effectiveSubtopic).toLowerCase().includes('calc');

      res.json({
        success: true,
        breakdown: {
          summary: `Targeted academic module for ${effectiveSubtopic} covering governing principles, mathematical formulation, and university semester PYQ patterns.`,
          coreFormulas: isMech
            ? [
                'Steady Flow Energy Equation: h₁ + V₁²/2 + gz₁ + q = h₂ + V₂²/2 + gz₂ + w',
                'First Law for Closed System: δQ = dU + δW'
              ]
            : isMath
            ? [
                "Leibnitz's Theorem: (uv)ₙ = uₙv + nC₁ uₙ₋₁v₁ + nC₂ uₙ₋₂v₂ + ... + uvₙ",
                "Taylor Series: f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ..."
              ]
            : [
                'Governing Differential / Circuit Balance: V(t) = L(di/dt) + Ri(t) + (1/C)∫i dt',
                'Resonance Condition: XL = XC => f₀ = 1/(2π√LC)'
              ],
          derivationSteps: [
            {
              step: 1,
              title: 'Define System Boundaries & Assumptions',
              explanation: 'Always state whether the system is open, closed, or isolated with steady-state criteria.',
              mathSnippet: 'm_dot_in = m_dot_out (Continuity)'
            },
            {
              step: 2,
              title: 'Apply Conservation of Energy',
              explanation: 'Balance heat transfer, work transfer, and flow enthalpy across the control surface.',
              mathSnippet: 'Ein + Q_in = Eout + W_out'
            },
            {
              step: 3,
              title: 'Evaluate Specific Enthalpy & Box Final Formula',
              explanation: 'Express in specific units (kJ/kg) and box the result prominently for the examiner.',
              mathSnippet: 'h + V²/2000 + gz/1000 + q = const'
            }
          ],
          examDeductionTraps: [
            'Confusing kinetic energy units: V²/2 is in J/kg, must divide by 1000 to convert to kJ/kg when adding to enthalpy h.',
            'Missing the negative sign for work done ON the system (compression) vs BY the system (expansion).'
          ],
          mustIncludeForFullMarks: [
            'Labeled schematic diagram with control surface arrows for mass and energy flows.',
            'Summary table of assumed constants and thermodynamic states.'
          ],
          sampleExamQuestion: {
            question: `Derive the governing expression for ${effectiveSubtopic} and apply it to a university exam problem. (7 Marks)`,
            marks: 7,
            solutionOutline: 'State 4 assumptions -> Write First Law balance -> Substitute enthalpy -> Box final equation with units.'
          }
        },
        source: 'curated-academic-engine'
      });
    }
  }));

  // 4b. Interactive Gemini Video Lecture Tutor (Ask questions about the video lecture / derivation)
  app.post('/api/gemini-video-ask', asyncHandler(async (req, res) => {
    const { courseName, unitNumber, topicName, subtopicName, videoTitle, question } = req.body || {};
    const effectiveSubtopic = subtopicName || topicName;

    try {
      const ai = getAiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured');
      }

      const prompt = `You are an elite university engineering tutor and professor assisting an engineering student who is watching a video lecture.
  Course: "${courseName}" (Unit ${unitNumber || 1})
  Syllabus Sub-Unit: "${effectiveSubtopic}"
  Video Lecture Title: "${videoTitle}"
  Student's Question / Doubt: "${question}"

  Provide a crystal-clear, academically rigorous, and helpful answer for the university exam student.
  Structure your answer clearly:
  1. Core Answer (plain English, intuitive explanation of the concept or step)
  2. Mathematical Formula / Equation (if relevant to the concept or derivation)
  3. University Exam Note / Scoring Tip (how examiners grade this, common trap to avoid).

  Keep your response concise (under 250 words), formatting formulas clearly.`;

      const response = await generateContentSafely((model) => {
        return {
          model,
          contents: prompt
        };
      });

      res.json({ success: true, answer: response.text, source: 'gemini-ai' });
    } catch (err: any) {
      console.warn('Gemini video ask fallback activated:', err?.message);
      res.json({
        success: true,
        answer: `Academic Guidance for "${effectiveSubtopic}" in ${courseName}:\n\n` +
          `• Core Principle: Focus on the governing energy and physical balance equations for this syllabus unit.\n` +
          `• Step Verification: Review the boundary conditions and steady-state assumptions.\n` +
          `• University Marking Tip: Draw the corresponding schematic diagram and box the final result with proper units to guarantee maximum marks.`,
        source: 'curated-tutor-fallback'
      });
    }
  }));

  // 5. Fast Concept Explainer ("Low Time Investment, High Output")
  app.post('/api/explain-concept', asyncHandler(async (req, res) => {
    const { courseName, unitNumber, topicTitle, subtopics, referenceBook } = req.body || {};
    try {
      const ai = getAiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured.');
      }

      const prompt = `You are a legendary university professor specializing in high-yield exam preparation.
  Course: ${courseName}
  Unit: ${unitNumber || 1} - ${topicTitle}
  Subtopics: ${subtopics?.join(', ') || ''}
  Reference Book: ${referenceBook || 'Standard Textbook'}

  A student has very limited time before exams and needs low time investment with maximum conceptual understanding and output marks.
  Provide a high-yield conceptual breakdown in JSON:
  1. "intuitiveSummary": A concise 2-3 sentence intuitive explanation that gives instant crystal-clear understanding.
  2. "coreDerivationOrFormula": The most critical governing equation or derivation step to remember.
  3. "examTrap": The #1 mistake students make that causes marks deductions.
  4. "fastTrackCramTip": What to focus on if they only have 2 hours before the exam.
  5. "bookPagesToFocus": The exact type of solved problems or pages from ${referenceBook || 'the reference book'} to practice.
  6. "mindMapNodes": Array of 3-4 key concept branches, each with "title", "subPoints" (array of 2 strings), and "formula".

  Return ONLY JSON:
  {
    "intuitiveSummary": "...",
    "coreDerivationOrFormula": "...",
    "examTrap": "...",
    "fastTrackCramTip": "...",
    "bookPagesToFocus": "...",
    "mindMapNodes": [
      { "title": "...", "subPoints": ["...", "..."], "formula": "..." }
    ]
  }`;

      const response = await generateContentSafely((model) => {
        return {
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        };
      });

      const breakdown = JSON.parse(response.text || '{}');
      res.json({ success: true, breakdown });
    } catch {
      console.log('Using high-yield conceptual breakdown for /api/explain-concept');
      res.json({
        success: true,
        breakdown: {
          intuitiveSummary: `${topicTitle} revolves around applying core foundational relations to predict system behavior. Think of it as mapping physical inputs to output states using conservative boundary conditions.`,
          coreDerivationOrFormula: 'Governing Equation: State the base relation, identify boundary constraints, and solve for required eigenvalues or outputs.',
          examTrap: 'Students often memorize the final equation without stating the initial assumptions (like steady-state, homogeneity, or ideal behavior), costing 30% marks.',
          fastTrackCramTip: 'Master 2 standard solved examples from the textbook. 80% of university questions are slight numerical variations of those two.',
          bookPagesToFocus: `Read only the chapter summary and 3 solved numericals in ${referenceBook || 'prescribed textbook'}; skip the long introductory proofs.`,
          mindMapNodes: [
            { title: 'Core Governing Relations', subPoints: ['Standard definitions and constants', 'Boundary conditions & assumptions'], formula: 'F(x,y,z) = C' },
            { title: 'Analytical Working', subPoints: ['Step-by-step substitution', 'Dimensional consistency check'], formula: 'Step 1 -> Step 2' },
            { title: 'University Exam Focus', subPoints: ['Standard repeated derivations', 'Boxed answer with SI units'], formula: 'Final Boxed Result' }
          ]
        },
        fallback: true
      });
    }
  }));

  // 6. Health Check
  app.get('/api/health', (req, res) => {
    const ai = getAiClient();
    res.json({
      status: 'ok',
      hasApiKey: !!ai,
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  app.use((error: { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = error.status && error.status >= 400 && error.status < 500 ? error.status : 500;
    res.status(status).json({ error: status === 500 ? 'API request failed' : 'Invalid request body' });
  });

  return app;
}
