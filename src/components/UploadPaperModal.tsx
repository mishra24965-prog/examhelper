import React, { useState } from 'react';
import { Course, Question, ExamType, ExamPaperRecord } from '../types';
import { inferQuestionMapping } from '../utils/analyticsEngine';
import { getPresetPapersForCourse } from '../utils/paperStorage';
import { checkTextAgainstDictionary, DEFAULT_MATH1_DICTIONARY } from '../utils/courseDictionary';
import { extractTextApi, cleanTextApi, analyzePaperApi } from '../utils/geminiClientService';
import {
  X,
  UploadCloud,
  FileText,
  Image,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Layers,
  Award,
  BookOpen,
  Wand2,
  FileCode,
  Check,
  Database,
  Search
} from 'lucide-react';

interface Props {
  course: Course;
  onClose: () => void;
  onQuestionsExtracted: (newQuestions: Question[], paperRecord?: ExamPaperRecord) => void;
  onOpenDictionary?: () => void;
}

export const UploadPaperModal: React.FC<Props> = ({
  course,
  onClose,
  onQuestionsExtracted,
  onOpenDictionary
}) => {
  const [step, setStep] = useState<'input' | 'text_review' | 'questions_review'>('input');
  const [activeMode, setActiveMode] = useState<'preset' | 'file' | 'text'>('file');
  const [paperYear, setPaperYear] = useState<number>(2024);
  const [examType, setExamType] = useState<ExamType>('MST-1');
  const [paperTitle, setPaperTitle] = useState<string>('MST-1 Examination 2024');

  // Text conversion states
  const [rawText, setRawText] = useState<string>('');
  const [cleanedText, setCleanedText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');
  const [extractionMethod, setExtractionMethod] = useState<string>('gemini-vision-ocr');

  // Text studio tab
  const [textStudioTab, setTextStudioTab] = useState<'cleaned' | 'raw' | 'dictionary'>('cleaned');

  // Processing & Dictionary states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [dictionaryMatches, setDictionaryMatches] = useState<any[]>([]);
  const [extractedQuestions, setExtractedQuestions] = useState<Question[]>([]);

  // 1. Quick select from preset MSC / Mid-Sem / End-Sem papers
  const coursePresets = getPresetPapersForCourse(course.id);

  const handleSelectPreset = (presetId: string) => {
    const preset = coursePresets.find(p => p.id === presetId);
    if (!preset) return;

    setPaperYear(preset.year);
    setExamType(preset.examType);
    setPaperTitle(preset.name);
    setRawText(preset.rawText || '');
    setCleanedText(preset.cleanedText || preset.rawText || '');
    setUploadedFile(null);
    setFileBase64(null);

    // Run dictionary scan
    const dictResult = checkTextAgainstDictionary(preset.cleanedText || preset.rawText || '');
    setDictionaryMatches(dictResult.matchedTerms);
    setExtractionMethod('preset-archive');
  };

  // 2. Handle file selection (PDF or image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
    setFileType(isPdf ? 'pdf' : 'image');
    setPaperTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 3. Step 1 -> Step 2: Convert Document / PDF to Text format
  const handleConvertToText = async () => {
    setError(null);
    setSuccessNote(null);

    // If using preset or direct text with existing content
    if (activeMode === 'preset') {
      if (!cleanedText && !rawText && coursePresets.length > 0) {
        handleSelectPreset(coursePresets[0].id);
      }
      setStep('text_review');
      return;
    }

    if (activeMode === 'text') {
      if (!rawText.trim()) {
        setError('Please paste exam paper text or select a preset paper.');
        return;
      }
      setCleanedText(rawText);
      const dict = checkTextAgainstDictionary(rawText);
      setDictionaryMatches(dict.matchedTerms);
      setExtractionMethod('direct-text');
      setStep('text_review');
      return;
    }

    if (activeMode === 'file') {
      if (!fileBase64) {
        setError('Please select a PDF document or scan image.');
        return;
      }

      setIsProcessing(true);
      try {
        const data = await extractTextApi({
          fileBase64,
          mimeType: uploadedFile?.type || (fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'),
          fileName: uploadedFile?.name,
          courseName: course.name
        });

        setRawText(data.rawExtractedText || '');
        setCleanedText(data.cleanedText || data.rawExtractedText || '');
        setExtractionMethod(data.method || 'gemini-vision-ocr');

        if (data.detectedInfo) {
          if (data.detectedInfo.year) setPaperYear(data.detectedInfo.year);
          if (data.detectedInfo.examType) setExamType(data.detectedInfo.examType);
        }

        if (data.dictionaryMatches && data.dictionaryMatches.length > 0) {
          setDictionaryMatches(data.dictionaryMatches);
        } else {
          const localDict = checkTextAgainstDictionary(data.cleanedText);
          setDictionaryMatches(localDict.matchedTerms);
        }

        setSuccessNote(`Successfully converted ${uploadedFile?.name || 'document'} to formatted text format!`);
        setStep('text_review');
      } catch (err: any) {
        setError(err.message || 'Error extracting text from document');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // 4. Clean messy text using AI or heuristic cleaner
  const handleCleanText = async () => {
    setIsCleaning(true);
    setError(null);
    try {
      const data = await cleanTextApi({
        rawText: cleanedText || rawText,
        courseName: course.name,
        syllabusUnits: course.syllabus
      });

      setCleanedText(data.cleanedText);
      if (data.dictionaryMatches) {
        setDictionaryMatches(data.dictionaryMatches);
      }
      setSuccessNote('Text cleaned: OCR artifacts removed, math equations formatted.');
    } catch (err: any) {
      setError(err.message || 'Failed to clean text');
    } finally {
      setIsCleaning(false);
    }
  };

  // 5. Check dictionary & scan for syllabus terms
  const handleScanDictionary = () => {
    const textToScan = cleanedText || rawText;
    const result = checkTextAgainstDictionary(textToScan);
    setDictionaryMatches(result.matchedTerms);
    setTextStudioTab('dictionary');
    setSuccessNote(`Found ${result.totalMatches} verified syllabus dictionary concepts.`);
  };

  // 6. Step 2 -> Step 3: Parse Questions & Map to Syllabus Topics
  const handleProceedToClassification = async () => {
    const textToAnalyze = cleanedText.trim() || rawText.trim();
    if (!textToAnalyze) {
      setError('Paper text format is empty. Please enter or extract text first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = await analyzePaperApi({
        rawText: rawText,
        cleanedText: cleanedText,
        courseName: course.name,
        syllabusUnits: course.syllabus,
        paperYear,
        examType
      });

      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: Question[] = data.questions.map((q: any, idx: number) => {
          const mapping = inferQuestionMapping(q.text || '', course.syllabus, course.id);
          const assignedTopicId = q.topicId && course.syllabus.some(s => s.id === q.topicId)
            ? q.topicId
            : mapping.topicId;
          const assignedTopicName = course.syllabus.find(s => s.id === assignedTopicId)?.title || mapping.topicName;

          return {
            id: `q-ext-${Date.now()}-${idx}`,
            paperYear,
            examType,
            questionNumber: q.questionNumber || `Q${idx + 1}`,
            text: q.text,
            marks: typeof q.marks === 'number' ? q.marks : 8,
            topicId: assignedTopicId,
            topicName: assignedTopicName,
            questionType: q.questionType || (q.text.toLowerCase().includes('derive') ? 'derivation' : 'numerical'),
            difficulty: q.difficulty || 'medium',
            mappingConfidence: mapping.confidence,
            semanticMatchReason: mapping.reason,
            tags: q.tags || ['PYQ', `${paperYear}`, examType]
          };
        });

        setExtractedQuestions(formatted);
        setStep('questions_review');
      } else {
        throw new Error('No questions could be classified from this paper.');
      }
    } catch (err: any) {
      setError(err.message || 'Error classifying questions.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Step 3: Confirm & Store into Exam Archive & Question Bank
  const handleConfirmStore = () => {
    const paperId = `paper-${Date.now()}`;
    const finalPaperName = paperTitle.trim() || `${examType} Examination ${paperYear}`;
    const totalMarks = extractedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
    const paperRecord: ExamPaperRecord = {
      id: paperId,
      name: finalPaperName,
      year: paperYear,
      examType,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      questionCount: extractedQuestions.length,
      totalMarks: totalMarks > 0 ? totalMarks : 20,
      rawText,
      cleanedText,
      sourceType: activeMode === 'file' ? (fileType === 'pdf' ? 'pdf' : 'image') : (activeMode === 'preset' ? 'sample' : 'text')
    };

    const linkedQuestions = extractedQuestions.map((q) => ({
      ...q,
      paperId,
      paperName: finalPaperName,
      paperYear,
      examType,
      tags: Array.from(new Set([...(q.tags || []), 'PYQ', `${paperYear}`, examType, finalPaperName]))
    }));

    onQuestionsExtracted(linkedQuestions, paperRecord);
    onClose();
  };

  const handleUpdateTopic = (idx: number, newTopicId: string) => {
    const updated = [...extractedQuestions];
    const targetTopic = course.syllabus.find(s => s.id === newTopicId);
    if (targetTopic) {
      updated[idx] = {
        ...updated[idx],
        topicId: targetTopic.id,
        topicName: targetTopic.title,
        mappingConfidence: 98,
        semanticMatchReason: `Verified and mapped to Unit ${targetTopic.unit}: ${targetTopic.title}`
      };
      setExtractedQuestions(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#151518] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl relative overflow-hidden text-[#e4e4e7]">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-[#0b0b0d]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  PDF & Document Ingestion Engine
                </span>
                <span className="text-xs text-white/50">
                  {step === 'input' && 'Step 1: Upload or Select Paper'}
                  {step === 'text_review' && 'Step 2: Inspect Converted Text & Clean'}
                  {step === 'questions_review' && 'Step 3: Verify Syllabus Classification'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {step === 'input' && `Ingest Past Paper: ${course.name}`}
                {step === 'text_review' && `Converted Text Format & Cleaning Studio`}
                {step === 'questions_review' && `Store ${extractedQuestions.length} Questions & Update Analytics`}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Pipeline Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                step === 'input'
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                  : 'bg-[#0b0b0d] border-white/5 text-white/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  step === 'input'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                1
              </div>
              <span className="font-medium truncate">1. Ingest PDF / Image</span>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                step === 'text_review'
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                  : 'bg-[#0b0b0d] border-white/5 text-white/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  step === 'text_review'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                2
              </div>
              <span className="font-medium truncate">2. Convert Text & Clean</span>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition ${
                step === 'questions_review'
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                  : 'bg-[#0b0b0d] border-white/5 text-white/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  step === 'questions_review'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                3
              </div>
              <span className="font-medium truncate">3. Classify & Store</span>
            </div>
          </div>

          {/* Success Note / Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successNote && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successNote}</span>
              </div>
              <button
                onClick={() => setSuccessNote(null)}
                className="text-emerald-400 hover:underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: INGEST / UPLOAD PAST PAPER                                        */}
          {/* ========================================================================= */}
          {step === 'input' && (
            <div className="space-y-4">
              {/* Paper Metadata Config */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">
                    Exam Horizon / Target
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as ExamType)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="MST-1">MST-1 (Mid-Sem Test 1)</option>
                    <option value="MST-2">MST-2 (Mid-Sem Test 2)</option>
                    <option value="End-Sem">End-Semester University Exam</option>
                    <option value="Quiz">Class Test / Sessional Quiz</option>
                    <option value="Re-Exam">Supplementary / Re-Exam</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">
                    Exam Year
                  </label>
                  <input
                    type="number"
                    min="2018"
                    max="2026"
                    value={paperYear}
                    onChange={(e) => setPaperYear(parseInt(e.target.value) || 2024)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">
                    Paper Label / Archive Name
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g. MST-1 2024 IET-DAVV"
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Ingestion Mode Selector */}
              <div className="flex bg-[#0b0b0d] p-1 rounded-2xl border border-white/10 text-xs">
                <button
                  onClick={() => setActiveMode('preset')}
                  className={`flex-1 py-2 rounded-xl font-medium transition flex items-center justify-center gap-1.5 ${
                    activeMode === 'preset'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>1-Click Preset MSC Papers</span>
                </button>
                <button
                  onClick={() => setActiveMode('file')}
                  className={`flex-1 py-2 rounded-xl font-medium transition flex items-center justify-center gap-1.5 ${
                    activeMode === 'file'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload PDF or Image Scan</span>
                </button>
                <button
                  onClick={() => setActiveMode('text')}
                  className={`flex-1 py-2 rounded-xl font-medium transition flex items-center justify-center gap-1.5 ${
                    activeMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paste Text / Raw OCR</span>
                </button>
              </div>

              {/* Mode A: Preset Papers */}
              {activeMode === 'preset' && (
                <div className="space-y-3">
                  <p className="text-xs text-white/60">
                    Select any authentic university exam paper from our repository to test PDF conversion, cleaning, and dictionary checks:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {coursePresets.length === 0 ? (
                      <div className="col-span-3 p-6 text-center text-xs text-white/50 bg-[#0b0b0d] rounded-2xl border border-dashed border-white/10">
                        No preset papers for this course yet. Use "Upload PDF or Image Scan" or "Paste Text" above to ingest past question papers!
                      </div>
                    ) : (
                      coursePresets.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                            paperTitle === preset.name
                              ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                              : 'bg-[#0b0b0d] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                                {preset.examType}
                              </span>
                              <span className="text-[11px] font-mono text-amber-400">
                                {preset.totalMarks} Marks
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">
                              {preset.name}
                            </h4>
                            <p className="text-[11px] text-white/50 line-clamp-2">
                              {preset.name} — Authenticated syllabus question paper
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                            <span>{preset.year} Session</span>
                            <span>Select Paper →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Mode B: Upload PDF or Image Scan */}
              {activeMode === 'file' && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-white/70 block">
                    Upload Past Paper Document (PDF, PNG, JPEG, WebP):
                  </label>
                  <div className="border-2 border-dashed border-white/15 hover:border-indigo-500 rounded-3xl p-8 text-center bg-[#0b0b0d] transition cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,application/pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="paper-document-file-input"
                    />
                    <label htmlFor="paper-document-file-input" className="cursor-pointer block">
                      {uploadedFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center mx-auto">
                            {fileType === 'pdf' ? (
                              <FileText className="w-6 h-6" />
                            ) : (
                              <Image className="w-6 h-6" />
                            )}
                          </div>
                          <p className="text-xs text-emerald-400 font-bold">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[11px] text-white/50">
                            {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || fileType.toUpperCase()}
                          </p>
                          <p className="text-[11px] text-indigo-400 hover:underline">Click to choose another file</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto" />
                          <p className="text-xs text-white font-semibold">
                            Click to browse or drop past paper PDF / image scan
                          </p>
                          <p className="text-[11px] text-white/50">
                            Supports multi-page university exam PDFs, smartphone camera photos, and messy scans
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-white/60 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      The engine converts your PDF/image to clean text format using Gemini Multimodal OCR and local PDF parsers, fixing scanner noise and math equations.
                    </span>
                  </div>
                </div>
              )}

              {/* Mode C: Paste Raw Text */}
              {activeMode === 'text' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-white/70">
                      Past Paper Text / Messy OCR:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const presetList = getPresetPapersForCourse(course.id);
                        const sample = presetList[presetList.length - 1] || presetList[0];
                        if (sample) {
                          setRawText(sample.rawText || '');
                          setCleanedText(sample.cleanedText || '');
                        }
                      }}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Fill Sample {course.name} OCR Text
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => {
                      setRawText(e.target.value);
                      setCleanedText(e.target.value);
                    }}
                    placeholder="Paste examination questions or OCR text here..."
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-2xl p-3.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              )}

              {/* Next CTA button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConvertToText}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Converting PDF / Running OCR...</span>
                    </>
                  ) : (
                    <>
                      <FileCode className="w-4 h-4" />
                      <span>Convert Document to Text Format →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: INSPECT CONVERTED TEXT & CLEANING STUDIO                          */}
          {/* ========================================================================= */}
          {step === 'text_review' && (
            <div className="space-y-4">
              {/* Top Status & Toolbar */}
              <div className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Text Format Conversion Complete</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                        {extractionMethod === 'gemini-vision-ocr' ? 'Gemini Multimodal OCR' : 'Native Document Parser'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">
                      {cleanedText.length} characters • {examType} ({paperYear}) • {dictionaryMatches.length} dictionary concepts found
                    </p>
                  </div>
                </div>

                {/* Cleaning & Dictionary Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isCleaning}
                    onClick={handleCleanText}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isCleaning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>AI Clean & Denoise</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleScanDictionary}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Check Dictionary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white font-medium text-xs transition cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Sub-tabs for Text Format */}
              <div className="flex border-b border-white/10 gap-2">
                <button
                  type="button"
                  onClick={() => setTextStudioTab('cleaned')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                    textStudioTab === 'cleaned'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Cleaned Text (Formatted for AI)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTextStudioTab('raw')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                    textStudioTab === 'raw'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Raw Document OCR Stream</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTextStudioTab('dictionary')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                    textStudioTab === 'dictionary'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dictionary Matches ({dictionaryMatches.length})</span>
                </button>
              </div>

              {/* Tab 1: Cleaned Text Area (Editable) */}
              {textStudioTab === 'cleaned' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-white/50">
                    <span>You can edit or touch up formulas before question classification:</span>
                    <span>Monospace • UTF-8 Mathematical Symbols</span>
                  </div>
                  <textarea
                    rows={11}
                    value={cleanedText}
                    onChange={(e) => setCleanedText(e.target.value)}
                    className="w-full bg-[#0b0b0d] border border-white/10 rounded-2xl p-4 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                  />
                </div>
              )}

              {/* Tab 2: Raw Document OCR */}
              {textStudioTab === 'raw' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-white/50">
                    Original uncleaned document OCR output before artifact removal:
                  </div>
                  <textarea
                    rows={11}
                    readOnly
                    value={rawText || '(Raw text identical to cleaned text)'}
                    className="w-full bg-[#0b0b0d]/70 border border-white/5 rounded-2xl p-4 text-xs text-white/70 font-mono leading-relaxed resize-y"
                  />
                </div>
              )}

              {/* Tab 3: Dictionary Matches */}
              {textStudioTab === 'dictionary' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">
                      Syllabus & Concept Terms Detected in Paper:
                    </span>
                    {onOpenDictionary && (
                      <button
                        type="button"
                        onClick={onOpenDictionary}
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Full Course Dictionary</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {dictionaryMatches.map((m: any, idx: number) => {
                      const termObj = m.term || m;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#0b0b0d] border border-white/10 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                Unit {termObj.unit || 1}
                              </span>
                              <span className="text-xs font-bold text-white">
                                {termObj.term || termObj.canonicalName}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 truncate max-w-[240px]">
                              {termObj.canonicalName || termObj.definition || 'Verified syllabus concept'}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Matched
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-xs text-white/50 hover:text-white"
                >
                  ← Back to Upload
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProceedToClassification}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Classifying Questions & Mapping Syllabus...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Syllabus Topic Mapping →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: REVIEW CLASSIFIED QUESTIONS & STORE IN ARCHIVE                   */}
          {/* ========================================================================= */}
          {step === 'questions_review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Classification & Semantic Mapping Completed
                    </h4>
                    <p className="text-[11px] text-white/60">
                      {extractedQuestions.length} questions mapped to {course.name} syllabus units. Ready to store in paper archive.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep('text_review')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Edit Text</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3 max-h-[46vh] overflow-y-auto pr-1">
                {extractedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-[#0b0b0d] border border-white/10 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
                          {q.questionNumber}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {q.marks} Marks
                        </span>
                        <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {q.questionType}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md ${
                            q.difficulty === 'hard'
                              ? 'bg-rose-500/20 text-rose-300'
                              : q.difficulty === 'easy'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Topic Mapping Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-white/50">Unit:</span>
                        <select
                          value={q.topicId}
                          onChange={(e) => handleUpdateTopic(idx, e.target.value)}
                          className="bg-[#151518] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {course.syllabus.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              Unit {unit.unit}: {unit.title.slice(0, 26)}...
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-xs text-white leading-relaxed font-sans">
                      {q.text}
                    </p>

                    {/* Match Reasoning & Confidence */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-white/50 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="italic">{q.semanticMatchReason}</span>
                      </div>
                      <span className="font-mono text-emerald-400">
                        {q.mappingConfidence || 95}% Confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('text_review')}
                  className="text-xs text-white/50 hover:text-white"
                >
                  ← Back to Text Format
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStore}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>Store Paper & Update Weightages ({extractedQuestions.length} Qs)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
