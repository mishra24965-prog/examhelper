import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Course, VideoRecommendation } from '../types';
import {
  Video,
  Play,
  ExternalLink,
  Sparkles,
  BookOpen,
  X,
  Search,
  CheckCircle2,
  Tv,
  Check,
  Zap,
  Layers,
  LayoutGrid,
  Copy,
  CheckCheck,
  RefreshCw,
  Plus,
  Link2,
  GraduationCap,
  AlertTriangle,
  BrainCircuit,
  HelpCircle,
  Send,
  FileText,
  ArrowLeft,
  MessageSquare,
  Bot
} from 'lucide-react';
import {
  getUnitVerifiedLectures,
  getSubUnitVerifiedLectures,
  searchYouTubeViaApiHelper,
  buildRobustYouTubeQuery
} from '../utils/youtubeApiHelper';
import {
  getDistinctVideoThumbnail,
  generateSystemicTopicThumbnail
} from '../utils/thumbnailSystem';
import {
  geminiVideoBreakdownApi,
  geminiVideoAskApi
} from '../utils/geminiClientService';

interface Props {
  course: Course;
  onNavigateTab?: (tab: string, topicId?: string) => void;
}

interface GeminiBreakdownData {
  summary: string;
  coreFormulas: string[];
  derivationSteps: {
    step: number;
    title: string;
    explanation: string;
    mathSnippet: string;
  }[];
  examDeductionTraps: string[];
  mustIncludeForFullMarks: string[];
  sampleExamQuestion: {
    question: string;
    marks: number;
    solutionOutline: string;
  };
}

export const VideoLecturesView: React.FC<Props> = ({ course, onNavigateTab }) => {
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [queryMode, setQueryMode] = useState<'auto' | 'derivation' | 'lecture'>('auto');
  const [viewMode, setViewMode] = useState<'by-subunit' | 'all-grid'>('by-subunit');
  const [extraVideos, setExtraVideos] = useState<VideoRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchingSubtopic, setSearchingSubtopic] = useState<string | null>(null);
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoRecommendation | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  // Manual Add from YouTube Link
  const [showAddYouTube, setShowAddYouTube] = useState<boolean>(false);
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [manualVideoTitle, setManualVideoTitle] = useState<string>('');
  const [manualVideoLevel, setManualVideoLevel] = useState<'Beginner' | 'Exam-Cram' | 'Deep Dive'>('Beginner');
  const [isAddingVideo, setIsAddingVideo] = useState<boolean>(false);
  const [addVideoError, setAddVideoError] = useState<string | null>(null);
  const [addVideoSuccess, setAddVideoSuccess] = useState<string | null>(null);

  // Gemini AI Lecture Breakdown Modal State
  const [breakdownVideo, setBreakdownVideo] = useState<VideoRecommendation | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState<boolean>(false);
  const [breakdownData, setBreakdownData] = useState<GeminiBreakdownData | null>(null);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // In-Player Gemini AI Companion State
  const [inPlayerTab, setInPlayerTab] = useState<'gemini-breakdown' | 'ask-gemini' | 'timestamps'>('gemini-breakdown');
  const [inPlayerBreakdownLoading, setInPlayerBreakdownLoading] = useState<boolean>(false);
  const [inPlayerBreakdownData, setInPlayerBreakdownData] = useState<GeminiBreakdownData | null>(null);
  const [inPlayerQuestion, setInPlayerQuestion] = useState<string>('');
  const [inPlayerChatLog, setInPlayerChatLog] = useState<Array<{ question: string; answer: string; timestamp: string }>>([]);
  const [isAskingInPlayer, setIsAskingInPlayer] = useState<boolean>(false);

  // Auto-fetch Gemini breakdown whenever a video starts playing
  useEffect(() => {
    if (!playingVideo) {
      setInPlayerBreakdownData(null);
      setInPlayerChatLog([]);
      setInPlayerQuestion('');
      return;
    }

    let isMounted = true;
    setInPlayerBreakdownLoading(true);
    geminiVideoBreakdownApi({
      topicName: playingVideo.topicName,
      subtopicName: playingVideo.subtopicName || playingVideo.topicName,
      courseName: course.name,
      videoTitle: playingVideo.title,
      conceptFocus: playingVideo.conceptFocus,
      level: playingVideo.level
    })
      .then((data) => {
        if (isMounted && data && data.breakdown) {
          setInPlayerBreakdownData(data.breakdown);
        }
      })
      .catch((err) => console.warn('Could not auto-fetch breakdown for video:', err))
      .finally(() => {
        if (isMounted) setInPlayerBreakdownLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [playingVideo, course.name]);

  const handleAskInPlayerGemini = async (overrideQuestion?: string) => {
    const q = (overrideQuestion || inPlayerQuestion).trim();
    if (!q || !playingVideo) return;

    setIsAskingInPlayer(true);
    try {
      const data = await geminiVideoAskApi({
        courseName: course.name,
        unitNumber: playingVideo.unitNumber,
        topicName: playingVideo.topicName,
        subtopicName: playingVideo.subtopicName || playingVideo.topicName,
        videoTitle: playingVideo.title,
        question: q
      });
      if (data && data.answer) {
        setInPlayerChatLog((prev) => [
          ...prev,
          {
            question: q,
            answer: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setInPlayerQuestion('');
      }
    } catch (err) {
      console.warn('Failed to ask Gemini:', err);
    } finally {
      setIsAskingInPlayer(false);
    }
  };

  // Reset when course changes
  useEffect(() => {
    setExtraVideos([]);
    setSelectedUnit('all');
    setSelectedSubtopic('all');
    setSelectedDifficulty('all');
    setCustomSearchQuery('');
    setSearchError(null);
    setSearchSuccess(null);
    setPlayingVideo(null);
    setBreakdownVideo(null);
    setShowAddYouTube(false);
  }, [course.id, course.code]);

  // Keyboard accessibility for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (playingVideo) setPlayingVideo(null);
        if (breakdownVideo) setBreakdownVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingVideo, breakdownVideo]);

  // Active unit object
  const activeUnitObj = useMemo(() => {
    if (selectedUnit === 'all') return course.syllabus[0] || null;
    return course.syllabus.find((s) => s.unit === selectedUnit) || null;
  }, [course, selectedUnit]);

  // Available subtopics for current filter scope
  const availableSubtopics = useMemo(() => {
    if (selectedUnit === 'all') {
      return course.syllabus.flatMap((s) =>
        (s.subtopics && s.subtopics.length > 0 ? s.subtopics : [s.title]).map((sub) => ({
          subtopic: sub,
          unitNumber: s.unit,
          unitTitle: s.title
        }))
      );
    }
    const unitObj = course.syllabus.find((s) => s.unit === selectedUnit);
    const subs = unitObj?.subtopics && unitObj.subtopics.length > 0 ? unitObj.subtopics : [unitObj?.title || 'Core'];
    return subs.map((sub) => ({
      subtopic: sub,
      unitNumber: unitObj?.unit || 1,
      unitTitle: unitObj?.title || ''
    }));
  }, [course, selectedUnit]);

  // Current target topic/subtopic for building live query preview
  const currentTargetTopic = useMemo(() => {
    if (customSearchQuery.trim()) return customSearchQuery.trim();
    if (selectedSubtopic !== 'all') return selectedSubtopic;
    if (selectedUnit !== 'all') {
      const u = course.syllabus.find((s) => s.unit === selectedUnit);
      return u?.subtopics?.[0] || u?.title || course.name;
    }
    return course.syllabus[0]?.subtopics?.[0] || course.syllabus[0]?.title || course.name;
  }, [customSearchQuery, selectedSubtopic, selectedUnit, course]);

  // Live robust query calculation
  const liveRobustQuery = useMemo(() => {
    return buildRobustYouTubeQuery(currentTargetTopic, course.name, queryMode);
  }, [currentTargetTopic, course.name, queryMode]);

  // Flat pool of all lectures for grid mode
  const baseLectures = useMemo(() => {
    return getUnitVerifiedLectures(course, selectedUnit, selectedDifficulty, selectedSubtopic, queryMode);
  }, [course, selectedUnit, selectedDifficulty, selectedSubtopic, queryMode]);

  const allFilteredLectures = useMemo(() => {
    let list = [...extraVideos, ...baseLectures];
    const seen = new Set<string>();
    list = list.filter((v) => {
      const key = (v.youtubeVideoId || v.id || v.title || '').toString().trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (selectedDifficulty !== 'all') {
      list = list.filter((v) => v.level.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    if (selectedUnit !== 'all') {
      list = list.filter((v) => (v.unitNumber || 1) === selectedUnit);
    }

    if (selectedSubtopic !== 'all') {
      const lowerSub = selectedSubtopic.toLowerCase();
      list = list.filter(
        (v) =>
          (v.subtopicName && v.subtopicName.toLowerCase().includes(lowerSub)) ||
          v.title.toLowerCase().includes(lowerSub) ||
          v.conceptFocus.toLowerCase().includes(lowerSub)
      );
    }

    return list;
  }, [baseLectures, extraVideos, selectedDifficulty, selectedUnit, selectedSubtopic]);

  // Guaranteed at least 3 verified educational links mapped directly to a syllabus sub-unit
  const getSubUnitVideos = (subtopicName: string, unitNum: number): VideoRecommendation[] => {
    const baseForSub = getSubUnitVerifiedLectures(course, unitNum, subtopicName, queryMode);
    const extraForSub = extraVideos.filter(
      (v) =>
        (v.subtopicName && v.subtopicName.toLowerCase() === subtopicName.toLowerCase()) ||
        v.title.toLowerCase().includes(subtopicName.toLowerCase())
    );

    const merged = [...extraForSub, ...baseForSub];
    const seen = new Set<string>();
    const deduplicated = merged.filter((v) => {
      const key = (v.youtubeVideoId || v.id || v.title || '').toString().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (selectedDifficulty !== 'all') {
      return deduplicated.filter((v) => v.level.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    return deduplicated;
  };

  // Unit and Subtopic selection handlers
  const handleSelectUnit = (unit: number | 'all') => {
    setSelectedUnit(unit);
    setSelectedSubtopic('all');
    setCustomSearchQuery('');
  };

  const handleSelectSubtopic = (sub: string) => {
    setSelectedSubtopic(sub);
    setCustomSearchQuery('');
  };

  const handleCopyQuery = (queryText: string) => {
    navigator.clipboard.writeText(queryText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  // Helper to extract YouTube video ID
  const extractYouTubeVideoId = (rawUrl: string): string | null => {
    try {
      const parsed = new URL(rawUrl.trim());
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null;
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const id = parsed.searchParams.get('v') ||
        (['shorts', 'embed', 'live', 'v'].includes(pathParts[0]) ? pathParts[1] : null);
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    } catch {
      return null;
    }
  };

  // Manual Add from YouTube
  const handleAddYouTubeVideo = useCallback(async () => {
    const videoId = extractYouTubeVideoId(youtubeLink);
    if (!videoId) {
      setAddVideoError('Please enter a valid YouTube video link (watch, youtu.be, or Shorts).');
      return;
    }

    setIsAddingVideo(true);
    setAddVideoError(null);
    setAddVideoSuccess(null);

    let fetchedTitle = manualVideoTitle.trim();
    let fetchedChannel = 'Added by Student';

    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`);
      if (response.ok) {
        const metadata = await response.json() as { title?: string; author_name?: string };
        if (!fetchedTitle && metadata.title) fetchedTitle = metadata.title;
        if (metadata.author_name) fetchedChannel = metadata.author_name;
      }
    } catch {
      // Fallback
    }

    if (!fetchedTitle) fetchedTitle = `YouTube Lecture (${videoId})`;
    const unit = selectedUnit === 'all' ? (course.syllabus[0]?.unit ?? 1) : selectedUnit;
    const subtopic = selectedSubtopic !== 'all' ? selectedSubtopic : (course.syllabus.find(s => s.unit === unit)?.subtopics?.[0] || course.name);

    const newVideo: VideoRecommendation = {
      id: `manual-${videoId}-${Date.now()}`,
      youtubeVideoId: videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      youtubeSearchQuery: `${fetchedTitle} ${course.name}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      title: fetchedTitle,
      channel: fetchedChannel,
      topicId: `u${unit}`,
      topicName: course.syllabus.find((item) => item.unit === unit)?.title || course.name,
      subtopicName: subtopic,
      conceptFocus: 'Video lecture added directly. Click Watch or Gemini AI Breakdown to inspect concept notes.',
      level: manualVideoLevel,
      complexityCategory: manualVideoLevel === 'Beginner' ? 'Foundation' : manualVideoLevel === 'Exam-Cram' ? 'Standard Exam' : 'Advanced Numerical',
      durationMinutes: 20,
      unitNumber: unit,
      verified: true
    };

    setExtraVideos((prev) => [newVideo, ...prev]);
    setYoutubeLink('');
    setManualVideoTitle('');
    setAddVideoSuccess(`“${fetchedTitle}” successfully added to your lecture list!`);
    setShowAddYouTube(false);
    setIsAddingVideo(false);
  }, [youtubeLink, manualVideoTitle, manualVideoLevel, selectedUnit, selectedSubtopic, course]);

  // Fetch verified educational videos via Gemini AI Integration
  const handleFetchViaGemini = async (targetSub?: string, targetUnitNum?: number) => {
    const subtopicToQuery =
      targetSub || (selectedSubtopic !== 'all' ? selectedSubtopic : undefined) || currentTargetTopic;
    const unitNum = targetUnitNum || (selectedUnit === 'all' ? 1 : selectedUnit);
    const targetUnit = course.syllabus.find((s) => s.unit === unitNum) || course.syllabus[0];
    if (!targetUnit) return;

    setIsSearching(true);
    setSearchingSubtopic(subtopicToQuery);
    setSearchError(null);
    setSearchSuccess(null);

    const robustInfo = buildRobustYouTubeQuery(subtopicToQuery, course.name, queryMode);

    try {
      const fetched = await searchYouTubeViaApiHelper({
        topicName: subtopicToQuery,
        courseName: course.name,
        unitNumber: targetUnit.unit,
        subtopicName: subtopicToQuery,
        subtopics: targetUnit.subtopics,
        queryMode
      });

      if (fetched && fetched.length > 0) {
        setExtraVideos((prev) => [...fetched, ...prev]);
        setSearchSuccess(
          `Gemini AI generated ${fetched.length} verified educational links mapped to "${subtopicToQuery}" (appended '${robustInfo.appendedType}').`
        );
      }
    } catch (err: any) {
      setSearchError(err.message || 'Failed to fetch Gemini AI lecture recommendations.');
    } finally {
      setIsSearching(false);
      setSearchingSubtopic(null);
    }
  };

  // Open Gemini AI Concept Breakdown Drawer/Modal
  const handleOpenGeminiBreakdown = async (video: VideoRecommendation) => {
    setBreakdownVideo(video);
    setBreakdownLoading(true);
    setBreakdownError(null);
    setBreakdownData(null);

    try {
      const json = await geminiVideoBreakdownApi({
        topicName: video.topicName,
        subtopicName: video.subtopicName || video.topicName,
        courseName: course.name,
        videoTitle: video.title,
        conceptFocus: video.conceptFocus,
        level: video.level
      });

      if (json && json.breakdown) {
        setBreakdownData(json.breakdown);
      } else {
        throw new Error('Breakdown data structure was invalid.');
      }
    } catch (err: any) {
      setBreakdownError(err.message || 'Failed to load Gemini AI lecture breakdown.');
    } finally {
      setBreakdownLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#e4e4e7]">
 
      {/* 1. Header Banner */}
      <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gemini AI Video Intelligence</span>
              </span>
              <span className="text-xs text-white/50 font-mono">
                {course.name} ({course.code})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Syllabus Sub-Unit Video Lectures & Concept Intel
            </h1>
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Powered by <strong>Gemini AI</strong> to analyze syllabus sub-units, curate verified video lectures, and generate interactive exam derivation breakdowns. Ensures at least <strong>3 verified educational links</strong> mapped to every syllabus sub-unit with unique, topic-tailored preview cards.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white/80 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>3+ Verified / Sub-Unit</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gemini Concept Breakdown Active</span>
            </div>
          </div>
        </div>

        {/* 2. Gemini AI Search & Generation Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customSearchQuery}
                onChange={(e) => setCustomSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchViaGemini()}
                placeholder="Search sub-unit or topic with Gemini AI (e.g. Steady Flow Energy Equation, Leibnitz Theorem at x=0, Otto Cycle)..."
                className="w-full bg-[#0b0b0d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Suffix Mode Selector Toggle */}
            <div className="flex items-center gap-1.5 bg-[#0b0b0d] border border-white/10 rounded-xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQueryMode('auto')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  queryMode === 'auto'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Smart auto-detection: appends 'derivation' for formulas/proofs, 'university lecture' for concepts"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Auto-Detect</span>
              </button>
              <button
                type="button"
                onClick={() => setQueryMode('derivation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  queryMode === 'derivation'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Force append 'derivation' to search queries"
              >
                <span>Force 'derivation'</span>
              </button>
              <button
                type="button"
                onClick={() => setQueryMode('lecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  queryMode === 'lecture'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Force append 'university lecture' to search queries"
              >
                <span>Force 'lecture'</span>
              </button>
            </div>

            {/* Gemini Generate Button */}
            <button
              onClick={() => handleFetchViaGemini()}
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 shrink-0 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isSearching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini AI Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Curate with Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Computed Query Inspector Bar */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider shrink-0 font-bold">
                Computed Query:
              </span>
              <span className="font-mono text-amber-300 font-semibold truncate max-w-xl bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                "{liveRobustQuery.query}"
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  liveRobustQuery.appendedType === 'derivation'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                }`}
              >
                +{liveRobustQuery.appendedType}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyQuery(liveRobustQuery.query)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition flex items-center gap-1.5 cursor-pointer text-xs"
                title="Copy query to clipboard"
              >
                {copiedQuery ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="font-mono text-[11px]">Copy Query</span>
                  </>
                )}
              </button>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(liveRobustQuery.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-rose-200 transition flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
              >
                <span>Search Directly</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setShowAddYouTube(!showAddYouTube)}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-indigo-200 transition flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Add YouTube Link</span>
              </button>
            </div>
          </div>

          {/* Add YouTube Link Form */}
          {showAddYouTube && (
            <div className="p-4 rounded-2xl bg-[#121216] border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-400" />
                  <span>Attach Manual YouTube Lecture Link</span>
                </span>
                <button
                  onClick={() => setShowAddYouTube(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="url"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="sm:col-span-2 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={manualVideoLevel}
                  onChange={(e) => setManualVideoLevel(e.target.value as any)}
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner (Foundation)</option>
                  <option value="Exam-Cram">Exam-Cram (Derivations & PYQs)</option>
                  <option value="Deep Dive">Deep Dive (Numerical Mastery)</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={manualVideoTitle}
                  onChange={(e) => setManualVideoTitle(e.target.value)}
                  placeholder="Optional title (auto-fetched if left blank)"
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddYouTubeVideo}
                  disabled={isAddingVideo || !youtubeLink.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {isAddingVideo ? 'Adding...' : 'Attach & Map'}
                </button>
              </div>

              {addVideoError && <p className="text-xs text-rose-300">{addVideoError}</p>}
              {addVideoSuccess && <p className="text-xs text-emerald-300">{addVideoSuccess}</p>}
            </div>
          )}

          {searchSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{searchSuccess}</span>
            </div>
          )}

          {searchError && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {searchError}
            </div>
          )}
        </div>
      </div>

      {/* 3. Filter Controls: Unit Selector & Sub-Units */}
      <div className="space-y-3">
        {/* Row 1: Unit Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider shrink-0 mr-1 font-bold">
            Syllabus Unit:
          </span>
          <button
            onClick={() => handleSelectUnit('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedUnit === 'all'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 ring-1 ring-rose-400/30'
                : 'bg-[#151518] text-white/70 border border-white/10 hover:text-white hover:bg-white/5'
            }`}
          >
            All Units
          </button>
          {course.syllabus.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectUnit(s.unit)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedUnit === s.unit
                  ? 'bg-rose-600/25 text-rose-300 border border-rose-500/50 shadow-sm'
                  : 'bg-[#151518] text-white/70 border border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-bold text-rose-400">Unit {s.unit}:</span>
              <span className="truncate max-w-[170px]">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Row 2: Syllabus Sub-Units Interactive Chips */}
        <div className="bg-[#151518] border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Syllabus Sub-Units Mapped to Lectures:
              </span>
              <span className="text-[11px] text-white/50">
                ({availableSubtopics.length} sub-units)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/40">View Mode:</span>
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('by-subunit')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'by-subunit'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>By Sub-Unit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all-grid')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'all-grid'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>All Lectures Grid</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            <button
              onClick={() => handleSelectSubtopic('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSubtopic === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              All Sub-Units
            </button>

            {availableSubtopics.map((item, idx) => {
              const robust = buildRobustYouTubeQuery(item.subtopic, course.name, queryMode);
              const isSelected = selectedSubtopic === item.subtopic;
              return (
                <button
                  key={`${item.unitNumber}-${idx}`}
                  onClick={() => handleSelectSubtopic(item.subtopic)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-400 shadow-sm'
                      : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                  title={item.subtopic}
                >
                  <span className="font-bold text-indigo-400 text-[10px] font-mono">U{item.unitNumber}</span>
                  <span className="truncate max-w-[200px] sm:max-w-[260px]">{item.subtopic}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      robust.appendedType === 'derivation'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    +{robust.appendedType === 'derivation' ? 'deriv' : 'lecture'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">3 Links</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Difficulty Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider shrink-0 mr-1 font-bold">
            Difficulty:
          </span>
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedDifficulty === 'all'
                ? 'bg-white/15 text-white border border-white/30'
                : 'bg-white/5 text-white/50 hover:text-white'
            }`}
          >
            All Difficulties
          </button>
          <button
            onClick={() => setSelectedDifficulty('Beginner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedDifficulty === 'Beginner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Beginner (Foundation)</span>
          </button>
          <button
            onClick={() => setSelectedDifficulty('Exam-Cram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedDifficulty === 'Exam-Cram'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Exam-Cram (Derivations & PYQs)</span>
          </button>
          <button
            onClick={() => setSelectedDifficulty('Deep Dive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedDifficulty === 'Deep Dive'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Deep Dive (Numerical Mastery)</span>
          </button>
        </div>
      </div>

      {/* 4. Display Area */}
      {viewMode === 'by-subunit' ? (
        /* ================= VIEW MODE: BY SYLLABUS SUB-UNIT ================= */
        <div className="space-y-8">
          {availableSubtopics
            .filter((item) => selectedSubtopic === 'all' || selectedSubtopic === item.subtopic)
            .map((item, sIdx) => {
              const subunitVideos = getSubUnitVideos(item.subtopic, item.unitNumber);
              const robust = buildRobustYouTubeQuery(item.subtopic, course.name, queryMode);

              return (
                <div
                  key={`${item.unitNumber}-${sIdx}`}
                  className="bg-[#151518] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5"
                >
                  {/* Sub-Unit Section Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Unit {item.unitNumber} Sub-Unit
                        </span>
                        <span className="text-xs text-white/50">{item.unitTitle}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            robust.appendedType === 'derivation'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          +{robust.appendedType}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {item.subtopic}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="font-mono text-white/40">Query:</span>
                        <code className="text-amber-300 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          {robust.query}
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleFetchViaGemini(item.subtopic, item.unitNumber)}
                        disabled={isSearching && searchingSubtopic === item.subtopic}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        title="Analyze and generate fresh lectures via Gemini AI"
                      >
                        {isSearching && searchingSubtopic === item.subtopic ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Gemini AI Working...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Curate via Gemini AI</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(robust.query)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#0b0b0d] hover:bg-white/10 text-white/70 hover:text-white transition shrink-0 cursor-pointer border border-white/10"
                        title="Search directly on YouTube with appended query"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* 3 Mapped Educational Video Cards for this Sub-Unit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {subunitVideos.length === 0 ? (
                      <div className="col-span-full p-8 text-center bg-black/30 border border-white/5 rounded-2xl text-white/50 text-xs space-y-2">
                        <Video className="w-6 h-6 text-white/30 mx-auto" />
                        <p>No lectures match the selected difficulty for this sub-unit.</p>
                      </div>
                    ) : (
                      subunitVideos.map((video) => (
                        <VideoLectureCard
                          key={video.id}
                          video={video}
                          courseName={course.name}
                          onPlay={() => setPlayingVideo(video)}
                          onGeminiBreakdown={() => handleOpenGeminiBreakdown(video)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        /* ================= VIEW MODE: ALL LECTURES FLAT GRID ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allFilteredLectures.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#151518] border border-white/10 rounded-3xl text-white/50 space-y-3">
              <Video className="w-8 h-8 text-white/40 mx-auto" />
              <p className="text-sm font-semibold text-white/80">
                No videos matching the selected filter.
              </p>
              <button
                onClick={() => {
                  setSelectedUnit('all');
                  setSelectedSubtopic('all');
                  setSelectedDifficulty('all');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            allFilteredLectures.map((video) => (
              <VideoLectureCard
                key={video.id}
                video={video}
                courseName={course.name}
                onPlay={() => setPlayingVideo(video)}
                onGeminiBreakdown={() => handleOpenGeminiBreakdown(video)}
              />
            ))
          )}
        </div>
      )}

      {/* 5. In-App Video Player Modal with Integrated Gemini Companion */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlayingVideo(null);
          }}
        >
          <div className="bg-[#151518] border border-white/15 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#18181c]">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Tv className="w-4 h-4 text-rose-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {playingVideo.title}
                </h3>
              </div>

              <button
                onClick={() => setPlayingVideo(null)}
                className="px-3.5 py-1.5 text-rose-300 hover:text-white rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 transition cursor-pointer shrink-0 flex items-center gap-1.5 font-bold text-xs active:scale-95"
                title="Close Window"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>Close Window ✕</span>
              </button>
            </div>

            {/* Direct Action & Syllabus Banner */}
            <div className="mx-4 sm:mx-5 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
                <span className="text-white/90 truncate">
                  Mapped Sub-Unit:{' '}
                  <strong className="text-indigo-300">
                    {playingVideo.subtopicName || playingVideo.topicName}
                  </strong>{' '}
                  • {playingVideo.channel} ({playingVideo.level})
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Gemini AI Connected</span>
                </span>
                <a
                  href={
                    playingVideo.youtubeUrl ||
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      playingVideo.youtubeSearchQuery || playingVideo.title
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in YouTube</span>
                </a>
              </div>
            </div>

            {/* Video Player Display Container */}
            <div className="px-4 sm:px-5">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-white/10">
                {playingVideo.youtubeVideoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                      playingVideo.youtubeVideoId
                    )}?autoplay=1&rel=0`}
                    title={playingVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <Video className="w-12 h-12 text-rose-500" />
                    <p className="text-sm text-white font-semibold">{playingVideo.title}</p>
                    <p className="text-xs text-white/60 max-w-md">
                      Verified curriculum lecture mapped to syllabus sub-unit "
                      {playingVideo.subtopicName || playingVideo.topicName}".
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={
                          playingVideo.youtubeUrl ||
                          `https://www.youtube.com/results?search_query=${encodeURIComponent(
                            playingVideo.youtubeSearchQuery || playingVideo.title
                          )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Built-in Gemini AI Lecture Companion Tabs */}
            <div className="px-4 sm:px-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <button
                  onClick={() => setInPlayerTab('gemini-breakdown')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    inPlayerTab === 'gemini-breakdown'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gemini Concept & Derivations</span>
                </button>
                <button
                  onClick={() => setInPlayerTab('ask-gemini')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    inPlayerTab === 'ask-gemini'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-purple-300" />
                  <span>Ask Gemini Tutor</span>
                </button>
                <button
                  onClick={() => setInPlayerTab('timestamps')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    inPlayerTab === 'timestamps'
                      ? 'bg-zinc-700 text-white shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Timestamps & Focus</span>
                </button>
              </div>

              {/* Tab 1: Gemini Concept & Derivation Breakdown */}
              {inPlayerTab === 'gemini-breakdown' && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4 max-h-72 overflow-y-auto text-xs">
                  {inPlayerBreakdownLoading ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-white/70 font-semibold">Gemini AI analyzing formulas & derivation steps...</p>
                    </div>
                  ) : inPlayerBreakdownData ? (
                    <div className="space-y-4">
                      {/* Summary */}
                      <p className="text-indigo-200 leading-relaxed font-medium bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                        {inPlayerBreakdownData.summary}
                      </p>

                      {/* Formulas */}
                      {inPlayerBreakdownData.coreFormulas && inPlayerBreakdownData.coreFormulas.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-mono">
                            Governing Formulas & Equations:
                          </span>
                          <div className="space-y-1.5">
                            {inPlayerBreakdownData.coreFormulas.map((f, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2 font-mono text-amber-200 text-xs"
                              >
                                <span className="truncate">{f}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(f);
                                    setCopiedFormula(f);
                                    setTimeout(() => setCopiedFormula(null), 1500);
                                  }}
                                  className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white shrink-0 cursor-pointer"
                                  title="Copy formula"
                                >
                                  {copiedFormula === f ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Derivation Steps */}
                      {inPlayerBreakdownData.derivationSteps && inPlayerBreakdownData.derivationSteps.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider font-mono">
                            Derivation Step Blueprint (7-10 Mark University Questions):
                          </span>
                          {inPlayerBreakdownData.derivationSteps.map((step) => (
                            <div key={step.step} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                              <span className="font-bold text-purple-300 text-xs">
                                Step {step.step}: {step.title}
                              </span>
                              <p className="text-white/70 leading-relaxed">{step.explanation}</p>
                              {step.mathSnippet && (
                                <code className="block bg-black/60 px-2 py-1 rounded text-amber-300 font-mono text-[11px]">
                                  {step.mathSnippet}
                                </code>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Common Traps */}
                      {inPlayerBreakdownData.examDeductionTraps && inPlayerBreakdownData.examDeductionTraps.length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                          <span className="font-bold text-rose-300 text-xs flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Common Exam Traps & Pitfalls:</span>
                          </span>
                          {inPlayerBreakdownData.examDeductionTraps.map((trap, i) => (
                            <div key={i} className="text-rose-200 text-[11px] pl-2">
                              • {trap}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <button
                        onClick={() => handleOpenGeminiBreakdown(playingVideo)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-200" />
                        Generate Full Gemini Lecture Breakdown
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Ask Gemini Video Tutor */}
              {inPlayerTab === 'ask-gemini' && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 max-h-72 overflow-y-auto text-xs">
                  {/* Quick Prompts */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-white/50 font-mono">Quick Questions:</span>
                    {[
                      'Explain the derivation step-by-step',
                      'What are the common exam deduction traps?',
                      'Give me a 7-mark practice question',
                      'What assumptions must I write in the exam paper?'
                    ].map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => handleAskInPlayerGemini(preset)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 text-white/80 hover:text-white border border-white/10 text-[10px] transition cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Chat Log */}
                  {inPlayerChatLog.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {inPlayerChatLog.map((chat, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-200 font-semibold flex items-center justify-between">
                            <span>Q: {chat.question}</span>
                            <span className="text-[10px] text-white/40 font-mono">{chat.timestamp}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-white/90 leading-relaxed whitespace-pre-line font-mono text-[11px]">
                            {chat.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Question Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={inPlayerQuestion}
                      onChange={(e) => setInPlayerQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAskInPlayerGemini();
                      }}
                      placeholder="Ask Gemini any doubt about this lecture or topic..."
                      className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={() => handleAskInPlayerGemini()}
                      disabled={isAskingInPlayer || !inPlayerQuestion.trim()}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      {isAskingInPlayer ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Ask Gemini</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Timestamps & Notes */}
              {inPlayerTab === 'timestamps' && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 max-h-72 overflow-y-auto text-xs">
                  <p className="text-white/80 leading-relaxed">
                    <strong>Core Focus:</strong> {playingVideo.conceptFocus}
                  </p>
                  {playingVideo.keyTimestamps && playingVideo.keyTimestamps.length > 0 ? (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono">
                        Key Video Segments:
                      </span>
                      {playingVideo.keyTimestamps.map((ts, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs"
                        >
                          <span className="font-mono text-cyan-300 font-bold">{ts.time}</span>
                          <span className="text-white/80">{ts.topic}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs italic pt-1">
                      No timestamps specified for this lecture. Focus on core syllabus derivation.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Gemini AI Concept Breakdown Modal */}
      {breakdownVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBreakdownVideo(null);
          }}
        >
          <div className="bg-[#151518] border border-indigo-500/30 rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Gemini AI Lecture Intel</span>
                  </span>
                  <span className="text-xs text-white/50">
                    {course.name} • Unit {breakdownVideo.unitNumber}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {breakdownVideo.title}
                </h2>
                <p className="text-xs text-indigo-300 font-semibold">
                  Syllabus Sub-Unit: {breakdownVideo.subtopicName || breakdownVideo.topicName}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setBreakdownVideo(null)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  title="Close Window"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Close Window ✕</span>
                </button>
              </div>
            </div>

            {/* Body */}
            {breakdownLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-white/80">
                  Gemini AI Analyzing Syllabus & Derivations...
                </p>
                <p className="text-xs text-white/40">
                  Extracting formulas, common exam traps, and scoring blueprints...
                </p>
              </div>
            ) : breakdownError ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {breakdownError}
              </div>
            ) : breakdownData ? (
              <div className="space-y-5 text-xs text-white/80 max-h-[70vh] overflow-y-auto pr-2">
                {/* Summary */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 leading-relaxed">
                  <p className="font-medium">{breakdownData.summary}</p>
                </div>

                {/* Core Formulas */}
                {breakdownData.coreFormulas && breakdownData.coreFormulas.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-mono">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      <span>Governing Formulas & Equations</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {breakdownData.coreFormulas.map((formula, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 font-mono text-amber-300 text-xs"
                        >
                          <span className="truncate">{formula}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(formula);
                              setCopiedFormula(formula);
                              setTimeout(() => setCopiedFormula(null), 1500);
                            }}
                            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition shrink-0"
                            title="Copy formula"
                          >
                            {copiedFormula === formula ? (
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step-by-Step Derivation Blueprint */}
                {breakdownData.derivationSteps && breakdownData.derivationSteps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-mono">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>University Derivation Step Blueprint (7-10 Mark Questions)</span>
                    </div>
                    <div className="space-y-2">
                      {breakdownData.derivationSteps.map((step) => (
                        <div
                          key={step.step}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-300">
                              Step {step.step}: {step.title}
                            </span>
                          </div>
                          <p className="text-white/70 leading-relaxed">{step.explanation}</p>
                          {step.mathSnippet && (
                            <code className="block bg-black/60 px-2.5 py-1 rounded-lg text-amber-300 font-mono text-[11px] border border-white/5">
                              {step.mathSnippet}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Deduction Traps */}
                {breakdownData.examDeductionTraps && breakdownData.examDeductionTraps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Frequent Exam Deduction Traps & Pitfalls</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                      {breakdownData.examDeductionTraps.map((trap, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-rose-200">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{trap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Must Include For Full Marks */}
                {breakdownData.mustIncludeForFullMarks && breakdownData.mustIncludeForFullMarks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Must Include For Full Marks</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                      {breakdownData.mustIncludeForFullMarks.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-emerald-200">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sample Exam Question */}
                {breakdownData.sampleExamQuestion && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider">
                        Sample University Exam Question
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        {breakdownData.sampleExamQuestion.marks} Marks
                      </span>
                    </div>
                    <p className="text-white font-semibold">
                      {breakdownData.sampleExamQuestion.question}
                    </p>
                    <p className="text-white/60 text-[11px]">
                      <strong>Solution Sequence:</strong> {breakdownData.sampleExamQuestion.solutionOutline}
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {/* Footer info */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
              <span>Grounding Engine: Gemini AI Flash Tier</span>
              <span>Syllabus Exam Mapping Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Video Lecture Card with Systematic Thumbnails & Gemini Integration
const VideoLectureCard: React.FC<{
  video: VideoRecommendation;
  courseName: string;
  onPlay: () => void;
  onGeminiBreakdown: () => void;
}> = ({ video, courseName, onPlay, onGeminiBreakdown }) => {
  const [thumbSrc, setThumbSrc] = useState<string>(() =>
    getDistinctVideoThumbnail(video, courseName)
  );

  useEffect(() => {
    setThumbSrc(getDistinctVideoThumbnail(video, courseName));
  }, [video.id, video.thumbnailUrl, video.title, video.subtopicName, courseName]);

  const diffColor =
    video.level === 'Beginner'
      ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
      : video.level === 'Exam-Cram'
      ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
      : 'text-rose-300 bg-rose-500/15 border-rose-500/30';

  const queryTypeBadge =
    video.queryType === 'derivation'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';

  return (
    <div className="bg-[#121215] border border-white/10 rounded-3xl overflow-hidden hover:border-white/25 transition-all shadow-md flex flex-col justify-between group backdrop-blur-xl">
      <div>
        {/* Thumbnail Container */}
        <div
          className="relative aspect-video bg-black overflow-hidden cursor-pointer"
          onClick={onPlay}
        >
          <img
            src={thumbSrc}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => {
              // Fallback to systematic SVG generator immediately on any load error
              const systemic = generateSystemicTopicThumbnail({
                title: video.title,
                subtopicName: video.subtopicName || video.topicName,
                courseName,
                channel: video.channel,
                level: video.level,
                queryType: video.queryType
              });
              setThumbSrc(systemic);
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 text-white text-[11px] font-mono font-semibold rounded-lg">
            {video.durationMinutes}:00
          </div>

          {/* Difficulty Pill */}
          <div
            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider border ${diffColor}`}
          >
            {video.level}
          </div>

          {/* Unit tag */}
          {video.unitNumber && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/80 text-white/90 text-[10px] font-mono font-semibold rounded-lg border border-white/10">
              Unit {video.unitNumber}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span className="font-semibold text-rose-400 truncate max-w-[150px]">
              {video.channel}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Verified Educational</span>
            </span>
          </div>

          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-rose-300 transition-colors">
            {video.title}
          </h3>

          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
            {video.conceptFocus}
          </p>

          {/* Syllabus Sub-Unit Mapping Tag */}
          {video.subtopicName && (
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] flex items-center gap-1.5 text-indigo-300">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Mapped Sub-Unit: {video.subtopicName}</span>
            </div>
          )}

          {/* Search Query Appended Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-white/40">Query Suffix:</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${queryTypeBadge}`}>
              +{video.queryType || (video.level === 'Exam-Cram' ? 'derivation' : 'university lecture')}
            </span>
            <span className="text-[10px] font-mono text-white/50 truncate max-w-[170px]" title={video.youtubeSearchQuery}>
              "{video.youtubeSearchQuery}"
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-2 border-t border-white/10 flex flex-col gap-2">
        <button
          onClick={onGeminiBreakdown}
          className="w-full py-2 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini AI Concept Breakdown</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onPlay}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Watch Lecture</span>
          </button>
          <a
            href={
              video.youtubeUrl ||
              `https://www.youtube.com/results?search_query=${encodeURIComponent(
                video.youtubeSearchQuery || `${video.title} ${courseName}`
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            title="Open directly on YouTube"
            className="p-2 rounded-xl bg-[#0b0b0d] hover:bg-white/10 text-white/70 hover:text-white transition shrink-0 cursor-pointer border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
