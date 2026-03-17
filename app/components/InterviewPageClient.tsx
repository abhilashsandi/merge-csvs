'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Lightbulb, Terminal, BookOpen,
  Search, Star, Moon, Sun, Printer, ChevronDown, ChevronRight,
  RotateCcw, Filter, X, Trophy, Shuffle, Download, Timer,
  BarChart3, Keyboard, Share2, Clock, FlipHorizontal,
  ArrowRight, ChevronLeft, AlertTriangle, Zap, Brain
} from 'lucide-react';
import { Quiz, ConsoleOutput, Diagram, SyntaxCode } from './InterviewWidgets';

/* ─── Types ─── */
export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Question = {
  q: string;
  a: string;
  code?: string;
  hint?: string;
  list?: string[];
  console?: string[];
  diagram?: { title: string; svg: string };
  difficulty?: 'easy' | 'medium' | 'hard';
};

type Section = {
  title: string;
  color: string;
  intro?: string;
  questions: Question[];
  quiz?: QuizQuestion[];
  diagram?: { title: string; svg: string };
};

type ConsoleExample = {
  sectionTitle: string;
  title: string;
  code: string;
  output: string[];
};

export type InterviewPageProps = {
  pageId: string;
  title: string;
  subtitle: string;
  accentFrom: string;
  accentTo: string;
  accentHoverBg: string;
  accentHoverText: string;
  checkColor: string;
  sections: Section[];
  sectionQuizzes: Record<string, QuizQuestion[]>;
  consoleExamples: ConsoleExample[];
  sectionDiagrams: Record<string, { title: string; svg: string }>;
};

const colorMap: Record<string, string> = {
  blue: 'border-t-blue-500', indigo: 'border-t-indigo-500', purple: 'border-t-purple-500',
  cyan: 'border-t-cyan-500', emerald: 'border-t-emerald-500', red: 'border-t-red-500',
  orange: 'border-t-orange-500', pink: 'border-t-pink-500', slate: 'border-t-slate-500',
  rose: 'border-t-rose-500', yellow: 'border-t-yellow-500', teal: 'border-t-teal-500',
  green: 'border-t-green-500', amber: 'border-t-amber-500', violet: 'border-t-violet-500',
  sky: 'border-t-sky-500',
};

const DIFF_COLORS = {
  easy: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  medium: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
  hard: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
};

function getDifficulty(q: Question, qi: number, total: number): 'easy' | 'medium' | 'hard' {
  if (q.difficulty) return q.difficulty;
  const ratio = total <= 1 ? 0.5 : qi / (total - 1);
  if (ratio < 0.33) return 'easy';
  if (ratio < 0.66) return 'medium';
  return 'hard';
}

function DiffBadge({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const c = DIFF_COLORS[level];
  return (
    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${c.bg} ${c.text} border ${c.border}`}>
      {level}
    </span>
  );
}

function estimateReadTime(section: Section): number {
  let words = 0;
  if (section.intro) words += section.intro.split(/\s+/).length;
  section.questions.forEach(q => {
    words += q.q.split(/\s+/).length + q.a.split(/\s+/).length;
    if (q.code) words += q.code.split(/\s+/).length * 0.3;
    if (q.list) q.list.forEach(l => { words += l.split(/\s+/).length; });
  });
  return Math.max(1, Math.ceil(words / 200));
}

/* ─── Component ─── */
export default function InterviewPageClient(props: InterviewPageProps) {
  const {
    pageId, title, subtitle, accentFrom, accentTo,
    accentHoverBg, accentHoverText, checkColor,
    sections, sectionQuizzes, consoleExamples, sectionDiagrams,
  } = props;

  // ─── State ───
  const [search, setSearch] = useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [sectionQuizScores, setSectionQuizScores] = useState<Record<string, { correct: number; total: number }>>({});
  const [focusedQuestion, setFocusedQuestion] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── localStorage keys ───
  const reviewedKey = `interview-${pageId}-reviewed`;
  const bookmarksKey = `interview-${pageId}-bookmarks`;
  const scoreKey = `interview-${pageId}-score`;
  const sectionScoreKey = `interview-${pageId}-section-scores`;

  // ─── Hydrate from localStorage ───
  useEffect(() => {
    try {
      const r = localStorage.getItem(reviewedKey);
      if (r) setReviewed(new Set(JSON.parse(r)));
      const b = localStorage.getItem(bookmarksKey);
      if (b) setBookmarks(new Set(JSON.parse(b)));
      const s = localStorage.getItem(scoreKey);
      if (s) setQuizScore(JSON.parse(s));
      const ss = localStorage.getItem(sectionScoreKey);
      if (ss) setSectionQuizScores(JSON.parse(ss));
    } catch { /* ignore */ }
    if (typeof window !== 'undefined') {
      setDarkMode(document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    // Deep link: check URL hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.slice(1);
      const match = hash.match(/^q-(\d+)-(\d+)$/);
      if (match) {
        const key = `${match[1]}-${match[2]}`;
        setExpandedAnswers(new Set([key]));
        setFocusedQuestion(key);
        setTimeout(() => {
          document.getElementById(`question-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [reviewedKey, bookmarksKey, scoreKey, sectionScoreKey]);

  // ─── Persist to localStorage ───
  useEffect(() => { localStorage.setItem(reviewedKey, JSON.stringify([...reviewed])); }, [reviewed, reviewedKey]);
  useEffect(() => { localStorage.setItem(bookmarksKey, JSON.stringify([...bookmarks])); }, [bookmarks, bookmarksKey]);
  useEffect(() => { localStorage.setItem(scoreKey, JSON.stringify(quizScore)); }, [quizScore, scoreKey]);
  useEffect(() => { localStorage.setItem(sectionScoreKey, JSON.stringify(sectionQuizScores)); }, [sectionQuizScores, sectionScoreKey]);

  // ─── Dark mode ───
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  // ─── Timer ───
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // ─── Total question count ───
  const totalQuestions = useMemo(() => sections.reduce((sum, s) => sum + s.questions.length, 0), [sections]);

  // ─── All questions flat list (for flashcard) ───
  const allQuestions = useMemo(() => {
    return sections.flatMap((s, si) =>
      s.questions.map((q, qi) => ({ ...q, sectionIndex: si, questionIndex: qi, sectionTitle: s.title, key: `${si}-${qi}` }))
    );
  }, [sections]);

  const qKey = (si: number, qi: number) => `${si}-${qi}`;

  // ─── Toggles ───
  const toggleReviewed = useCallback((key: string) => {
    setReviewed(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  }, []);

  const toggleBookmark = useCallback((key: string) => {
    setBookmarks(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  }, []);

  const toggleExpanded = useCallback((key: string) => {
    setExpandedAnswers(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  }, []);

  const expandAll = useCallback(() => {
    const all = new Set<string>();
    sections.forEach((s, si) => s.questions.forEach((_, qi) => all.add(qKey(si, qi))));
    setExpandedAnswers(all);
  }, [sections]);

  const collapseAll = useCallback(() => { setExpandedAnswers(new Set()); }, []);

  // ─── Quiz score handler ───
  const handleQuizAnswer = useCallback((isCorrect: boolean, sectionTitle?: string) => {
    setQuizScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    if (sectionTitle) {
      setSectionQuizScores(prev => {
        const cur = prev[sectionTitle] || { correct: 0, total: 0 };
        return { ...prev, [sectionTitle]: { correct: cur.correct + (isCorrect ? 1 : 0), total: cur.total + 1 } };
      });
    }
  }, []);

  // ─── Search + difficulty filter ───
  const filteredSections = useMemo(() => {
    const term = search.toLowerCase().trim();
    return sections.map((section, si) => {
      const filteredQuestions = section.questions
        .map((q, qi) => ({ ...q, _origQi: qi }))
        .filter((q) => {
          const key = qKey(si, q._origQi);
          if (showBookmarkedOnly && !bookmarks.has(key)) return false;
          if (difficultyFilter !== 'all') {
            const d = getDifficulty(q, q._origQi, section.questions.length);
            if (d !== difficultyFilter) return false;
          }
          if (!term) return true;
          return (
            q.q.toLowerCase().includes(term) ||
            q.a.toLowerCase().includes(term) ||
            (q.code && q.code.toLowerCase().includes(term)) ||
            (q.hint && q.hint.toLowerCase().includes(term)) ||
            section.title.toLowerCase().includes(term)
          );
        });
      return { ...section, questions: filteredQuestions, originalIndex: si };
    }).filter(s => s.questions.length > 0);
  }, [sections, search, showBookmarkedOnly, bookmarks, difficultyFilter]);

  // ─── Print mode ───
  const handlePrint = useCallback(() => {
    setIsPrintMode(true); expandAll();
    setTimeout(() => { window.print(); setIsPrintMode(false); }, 300);
  }, [expandAll]);

  // ─── Reset ───
  const resetProgress = useCallback(() => {
    setReviewed(new Set()); setBookmarks(new Set());
    setQuizScore({ correct: 0, total: 0 }); setSectionQuizScores({});
    setExpandedAnswers(new Set());
  }, []);

  // ─── Random question ───
  const surpriseMe = useCallback(() => {
    const unreviewed = allQuestions.filter(q => !reviewed.has(q.key));
    const pool = unreviewed.length > 0 ? unreviewed : allQuestions;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setExpandedAnswers(prev => new Set(prev).add(pick.key));
    setFocusedQuestion(pick.key);
    setTimeout(() => {
      document.getElementById(`question-${pick.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [allQuestions, reviewed]);

  // ─── Export bookmarked ───
  const exportBookmarks = useCallback(() => {
    const lines: string[] = [`# ${title} — Bookmarked Questions\n`];
    sections.forEach((s, si) => {
      const bqs = s.questions.filter((_, qi) => bookmarks.has(qKey(si, qi)));
      if (bqs.length === 0) return;
      lines.push(`\n## ${s.title}\n`);
      bqs.forEach((q, i) => {
        lines.push(`### ${i + 1}. ${q.q}\n`);
        lines.push(`**Answer:** ${q.a}\n`);
        if (q.code) lines.push(`\`\`\`tsx\n${q.code}\n\`\`\`\n`);
        if (q.hint) lines.push(`> 💡 **Hint:** ${q.hint}\n`);
      });
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${pageId}-bookmarks.md`; a.click();
    URL.revokeObjectURL(url);
  }, [bookmarks, sections, title, pageId]);

  // ─── Deep link share ───
  const shareQuestion = useCallback((key: string) => {
    const url = `${window.location.origin}${window.location.pathname}#q-${key}`;
    navigator.clipboard.writeText(url).then(() => {
      const el = document.getElementById(`share-toast-${key}`);
      if (el) { el.classList.remove('opacity-0'); setTimeout(() => el.classList.add('opacity-0'), 1500); }
    });
  }, []);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (flashcardMode) {
        if (e.key === ' ' || e.key === 'f') { e.preventDefault(); setFlashcardFlipped(f => !f); }
        if (e.key === 'ArrowRight' || e.key === 'j') { setFlashcardFlipped(false); setFlashcardIndex(i => Math.min(i + 1, allQuestions.length - 1)); }
        if (e.key === 'ArrowLeft' || e.key === 'k') { setFlashcardFlipped(false); setFlashcardIndex(i => Math.max(i - 1, 0)); }
        if (e.key === 'Escape') setFlashcardMode(false);
        return;
      }
      if (e.key === '?') { e.preventDefault(); setShowKeyboardHelp(h => !h); }
      if (e.key === 'd') setDarkMode(d => !d);
      if (e.key === 's') surpriseMe();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flashcardMode, allQuestions.length, surpriseMe]);

  const progressPercent = totalQuestions > 0 ? Math.round((reviewed.size / totalQuestions) * 100) : 0;
  const timerDisplay = `${Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:${(timerSeconds % 60).toString().padStart(2, '0')}`;

  // ─── Section reading times ───
  const readTimes = useMemo(() => sections.map(s => estimateReadTime(s)), [sections]);

  // ─── Weak areas ───
  const weakAreas = useMemo(() => {
    return Object.entries(sectionQuizScores)
      .filter(([, v]) => v.total >= 2 && (v.correct / v.total) < 0.6)
      .map(([title]) => title);
  }, [sectionQuizScores]);

  // ─── Flashcard current ───
  const flashcardQ = allQuestions[flashcardIndex];

  // ─── Flashcard Mode UI ───
  if (flashcardMode && flashcardQ) {
    const diff = getDifficulty(flashcardQ, flashcardQ.questionIndex, sections[flashcardQ.sectionIndex].questions.length);
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-100 dark:bg-zinc-950`}>
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setFlashcardMode(false)} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <X className="h-4 w-4" /> Exit Flashcards
            </button>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {flashcardIndex + 1} / {allQuestions.length}
            </span>
            <DiffBadge level={diff} />
          </div>

          <div
            onClick={() => setFlashcardFlipped(f => !f)}
            className="relative cursor-pointer min-h-[350px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
            style={{ perspective: '1000px' }}
          >
            {!flashcardFlipped ? (
              <div className="flex flex-col h-full">
                <span className="text-xs font-medium text-zinc-400 mb-2">{flashcardQ.sectionTitle}</span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{flashcardQ.q}</h2>
                <div className="flex-1" />
                <p className="text-xs text-zinc-400 text-center animate-pulse">Click or press Space to reveal answer</p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-y-auto">
                <span className="text-xs font-medium text-zinc-400 mb-2">Answer</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">{flashcardQ.a}</p>
                {flashcardQ.code && <SyntaxCode code={flashcardQ.code} />}
                {flashcardQ.hint && (
                  <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <p className="flex items-start gap-2 text-amber-900 dark:text-amber-200 text-xs m-0">
                      <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                      <span><strong>Hint:</strong> {flashcardQ.hint}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => { setFlashcardFlipped(false); setFlashcardIndex(i => Math.max(i - 1, 0)); }}
              disabled={flashcardIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleBookmark(flashcardQ.key)} className={`p-2 rounded-lg transition-colors ${bookmarks.has(flashcardQ.key) ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-400'}`}>
                <Star className={`h-5 w-5 ${bookmarks.has(flashcardQ.key) ? 'fill-current' : ''}`} />
              </button>
              <button onClick={() => toggleReviewed(flashcardQ.key)} className={`p-2 rounded-lg transition-colors ${reviewed.has(flashcardQ.key) ? 'text-emerald-500' : 'text-zinc-400 hover:text-emerald-400'}`}>
                <CheckCircle2 className={`h-5 w-5 ${reviewed.has(flashcardQ.key) ? 'fill-emerald-100' : ''}`} />
              </button>
            </div>
            <button
              onClick={() => { setFlashcardFlipped(false); setFlashcardIndex(i => Math.min(i + 1, allQuestions.length - 1)); }}
              disabled={flashcardIndex === allQuestions.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors text-sm"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-center text-xs text-zinc-400 mt-3">← / → to navigate · Space to flip · Esc to exit</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`min-h-screen bg-zinc-50 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:selection:bg-white dark:selection:text-zinc-900 pb-20 ${isPrintMode ? 'print-mode' : ''}`}>
      {/* ─── STICKY PROGRESS BAR ─── */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 print:hidden">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-12 gap-3">
            {/* Progress */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                {reviewed.size}/{totalQuestions}
              </span>
              <div className="w-20 sm:w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${accentFrom} ${accentTo}`} style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{progressPercent}%</span>
            </div>

            {/* Quiz Score + Timer */}
            <div className="hidden sm:flex items-center gap-3">
              {quizScore.total > 0 && (
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-zinc-700 dark:text-zinc-300">{quizScore.correct}/{quizScore.total}</span>
                </div>
              )}
              {showTimer && (
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Timer className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{timerDisplay}</span>
                  <button onClick={() => setTimerRunning(!timerRunning)} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${timerRunning ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {timerRunning ? 'STOP' : 'START'}
                  </button>
                  <button onClick={() => { setTimerSeconds(0); setTimerRunning(false); }} className="text-zinc-400 hover:text-zinc-600"><RotateCcw className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)} className={`p-1.5 rounded-lg transition-colors ${showBookmarkedOnly ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`} title="Bookmarks">
                <Star className={`h-4 w-4 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
              </button>
              <button onClick={() => setFlashcardMode(true)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="Flashcard mode">
                <FlipHorizontal className="h-4 w-4" />
              </button>
              <button onClick={surpriseMe} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="Random question">
                <Shuffle className="h-4 w-4" />
              </button>
              <button onClick={() => setShowTimer(!showTimer)} className={`p-1.5 rounded-lg transition-colors ${showTimer ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`} title="Timer">
                <Timer className="h-4 w-4" />
              </button>
              <button onClick={() => setShowStats(!showStats)} className={`p-1.5 rounded-lg transition-colors ${showStats ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`} title="Study stats">
                <BarChart3 className="h-4 w-4" />
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="Dark mode">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={handlePrint} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="Print">
                <Printer className="h-4 w-4" />
              </button>
              <button onClick={exportBookmarks} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="Export bookmarks as Markdown">
                <Download className="h-4 w-4" />
              </button>
              <button onClick={() => setShowKeyboardHelp(!showKeyboardHelp)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" title="Keyboard shortcuts (?)">
                <Keyboard className="h-4 w-4" />
              </button>
              <button onClick={resetProgress} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 transition-colors" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KEYBOARD HELP MODAL ─── */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowKeyboardHelp(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">⌨️ Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardHelp(false)} className="text-zinc-400 hover:text-zinc-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['?', 'Toggle this help'], ['D', 'Toggle dark mode'], ['S', 'Random question'],
                ['Space', 'Flip flashcard'], ['← →', 'Prev/next flashcard'],
                ['J / K', 'Prev/next flashcard'], ['Esc', 'Exit flashcard mode'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-3">
                  <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 min-w-[36px] text-center">{key}</kbd>
                  <span className="text-zinc-600 dark:text-zinc-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── STUDY STATS PANEL ─── */}
      {showStats && (
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-16 print:hidden">
          <div className="mt-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-500" /> Study Dashboard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{reviewed.size}</div>
                <div className="text-xs text-zinc-500 mt-1">Questions Reviewed</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{bookmarks.size}</div>
                <div className="text-xs text-zinc-500 mt-1">Bookmarked</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {quizScore.total > 0 ? Math.round((quizScore.correct / quizScore.total) * 100) : 0}%
                </div>
                <div className="text-xs text-zinc-500 mt-1">Quiz Accuracy</div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{timerDisplay}</div>
                <div className="text-xs text-zinc-500 mt-1">Study Time</div>
              </div>
            </div>

            {/* Per-section breakdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Section Progress</h4>
              {sections.map((s, si) => {
                const revCount = s.questions.filter((_, qi) => reviewed.has(qKey(si, qi))).length;
                const pct = s.questions.length > 0 ? Math.round((revCount / s.questions.length) * 100) : 0;
                const qs = sectionQuizScores[s.title];
                const isWeak = weakAreas.includes(s.title);
                return (
                  <div key={si} className={`flex items-center gap-3 text-xs p-2 rounded-lg ${isWeak ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800' : ''}`}>
                    {isWeak && <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                    <span className="text-zinc-600 dark:text-zinc-400 w-48 truncate">{s.title}</span>
                    <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${accentFrom} ${accentTo}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-8 text-right">{pct}%</span>
                    {qs && <span className="text-zinc-400 w-14 text-right">{qs.correct}/{qs.total} quiz</span>}
                  </div>
                );
              })}
            </div>

            {/* Weak areas */}
            {weakAreas.length > 0 && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs text-red-700 dark:text-red-300 font-semibold flex items-center gap-1.5 mb-1">
                  <Brain className="h-4 w-4" /> Needs More Practice
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {weakAreas.join(', ')} — quiz accuracy below 60%. Review these sections again!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex mx-auto max-w-[1400px]">
        {/* ─── STICKY TOC SIDEBAR ─── */}
        <aside className="hidden xl:block w-56 shrink-0 print:hidden">
          <div className="sticky top-16 pt-8 pl-4 pr-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 mb-3">Sections</h4>
            <nav className="space-y-1">
              {sections.map((s, si) => {
                const revCount = s.questions.filter((_, qi) => reviewed.has(qKey(si, qi))).length;
                const pct = s.questions.length > 0 ? Math.round((revCount / s.questions.length) * 100) : 0;
                const isWeak = weakAreas.includes(s.title);
                return (
                  <a
                    key={si}
                    href={`#${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg transition-colors no-underline ${isWeak ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shrink-0" style={{
                      borderColor: pct === 100 ? '#22c55e' : pct > 0 ? '#f59e0b' : '#d4d4d8',
                      color: pct === 100 ? '#22c55e' : pct > 0 ? '#f59e0b' : '#a1a1aa',
                      background: pct === 100 ? 'rgba(34,197,94,0.1)' : 'transparent'
                    }}>
                      {pct === 100 ? '✓' : `${pct}`}
                    </div>
                    <span className="truncate">{s.title.replace(/^\d+\.\s*/, '')}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <div className="flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-10">
          {/* ─── BACK LINK ─── */}
          <div className="mb-6 print:hidden">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </div>

          <article className="prose prose-zinc dark:prose-invert max-w-none">
            {/* ─── HEADER ─── */}
            <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accentFrom} ${accentTo} text-white shadow-lg`}>
                  <BookOpen className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-0">{title}</h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 m-0">
                    {sections.length} sections · {totalQuestions} questions · ~{readTimes.reduce((a, b) => a + b, 0)} min read
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl mb-4">{subtitle}</p>

              {/* ─── SEARCH + DIFFICULTY + CONTROLS ─── */}
              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text" placeholder="Search questions, topics, code..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                  {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"><X className="h-4 w-4" /></button>}
                </div>
                {/* Difficulty filter */}
                <div className="flex items-center gap-1.5">
                  {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                    <button key={d} onClick={() => setDifficultyFilter(d)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${difficultyFilter === d
                        ? d === 'all' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                          : `${DIFF_COLORS[d].bg} ${DIFF_COLORS[d].text} ${DIFF_COLORS[d].border}`
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={expandAll} className="text-xs px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Expand All</button>
                  <button onClick={collapseAll} className="text-xs px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Collapse All</button>
                </div>
              </div>

              {/* Section pills */}
              <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                {sections.map((s, si) => (
                  <a key={s.title} href={`#${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:${accentHoverBg} hover:${accentHoverText} transition-colors no-underline border border-zinc-200/50 dark:border-zinc-700/50`}
                  >
                    {s.title}
                    <span className="ml-1.5 text-zinc-400 dark:text-zinc-500">
                      <Clock className="inline h-3 w-3 -mt-0.5" /> {readTimes[si]}m
                    </span>
                  </a>
                ))}
              </div>

              {/* Filter results count */}
              {(search || showBookmarkedOnly || difficultyFilter !== 'all') && (
                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Filter className="h-4 w-4" />
                  <span>
                    Showing {filteredSections.reduce((a, s) => a + s.questions.length, 0)} questions
                    {search && <> matching &quot;{search}&quot;</>}
                    {showBookmarkedOnly && <> (bookmarked only)</>}
                    {difficultyFilter !== 'all' && <> ({difficultyFilter})</>}
                  </span>
                </div>
              )}
            </header>

            {/* ─── SECTIONS ─── */}
            {filteredSections.map((section) => {
              const si = (section as typeof section & { originalIndex: number }).originalIndex;
              const quizzes = section.quiz || sectionQuizzes[section.title];
              const consoles = consoleExamples.filter(c => c.sectionTitle === section.title);
              const diag = section.diagram || sectionDiagrams[section.title];

              return (
                <section
                  key={section.title}
                  id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className={`mb-8 bg-white dark:bg-zinc-900 p-5 sm:p-7 lg:p-9 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 border-t-4 ${colorMap[section.color] || 'border-t-zinc-500'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-0 mb-0">{section.title}</h2>
                    <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock className="h-3 w-3" />{readTimes[si]} min</span>
                  </div>
                  {section.intro && <p className="text-zinc-700 dark:text-zinc-300 mb-4 text-base leading-relaxed">{section.intro}</p>}

                  {diag && <Diagram title={diag.title} svg={diag.svg} />}

                  <div className="space-y-4 mt-4">
                    {section.questions.map((q, qi) => {
                      const key = qKey(si, qi);
                      const isExpanded = expandedAnswers.has(key) || isPrintMode;
                      const isReviewed = reviewed.has(key);
                      const isBookmarked = bookmarks.has(key);
                      const diff = getDifficulty(q, qi, sections[si].questions.length);
                      const isFocused = focusedQuestion === key;

                      return (
                        <div
                          key={qi}
                          id={`question-${key}`}
                          className={`border rounded-xl p-4 lg:p-5 transition-all duration-300 ${
                            isFocused ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-950' :
                            isReviewed ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
                            : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
                          }`}
                          onAnimationEnd={() => { if (isFocused) setFocusedQuestion(null); }}
                        >
                          <div className="flex items-start gap-2">
                            <button onClick={() => toggleExpanded(key)} className="mt-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors print:hidden shrink-0">
                              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <button onClick={() => toggleExpanded(key)} className="text-left font-bold text-zinc-900 dark:text-zinc-50 text-[15px] leading-snug w-full flex items-center gap-2">
                                <span>Q{qi + 1}: {q.q}</span>
                                <DiffBadge level={diff} />
                              </button>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 print:hidden">
                              <button onClick={() => shareQuestion(key)} className="p-1 rounded text-zinc-300 hover:text-blue-400 dark:text-zinc-600 dark:hover:text-blue-400 transition-colors relative" title="Share link">
                                <Share2 className="h-3.5 w-3.5" />
                                <span id={`share-toast-${key}`} className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-1 rounded whitespace-nowrap opacity-0 transition-opacity pointer-events-none">Copied!</span>
                              </button>
                              <button onClick={() => toggleBookmark(key)} className={`p-1 rounded transition-colors ${isBookmarked ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-400 dark:text-zinc-600 dark:hover:text-amber-400'}`}>
                                <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                              <button onClick={() => toggleReviewed(key)} className={`p-1 rounded transition-colors ${isReviewed ? 'text-emerald-500' : 'text-zinc-300 hover:text-emerald-400 dark:text-zinc-600 dark:hover:text-emerald-400'}`}>
                                <CheckCircle2 className={`h-4 w-4 ${isReviewed ? 'fill-emerald-100 dark:fill-emerald-900/20' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[5000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                            <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 leading-relaxed pl-7">
                              <p><strong className="text-zinc-900 dark:text-zinc-100">A:</strong> {q.a}</p>
                              {q.list && <ul className="list-disc pl-5 space-y-1">{q.list.map((item, li) => <li key={li} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>}
                              {q.code && <SyntaxCode code={q.code} />}
                              {q.console && <ConsoleOutput lines={q.console} />}
                              {q.diagram && <Diagram title={q.diagram.title} svg={q.diagram.svg} />}
                              {q.hint && (
                                <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                  <p className="flex items-start gap-2 text-amber-900 dark:text-amber-200 text-xs m-0">
                                    <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span><strong>Interview Hint:</strong> {q.hint}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {consoles.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {consoles.map((ce, ci) => (
                        <div key={ci}>
                          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-1">
                            <Terminal className="h-4 w-4 text-emerald-500" /> {ce.title}
                          </h4>
                          {ce.code && <SyntaxCode code={ce.code} />}
                          <ConsoleOutput lines={ce.output} />
                        </div>
                      ))}
                    </div>
                  )}

                  {quizzes && quizzes.length > 0 && !isPrintMode && (
                    <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-6 print:hidden">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mt-0 mb-2">
                        🧪 Quick Quiz — {section.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Test yourself! Click an option to check your answer.</p>
                      <Quiz questions={quizzes} onAnswer={(isCorrect) => handleQuizAnswer(isCorrect, section.title)} />
                    </div>
                  )}
                </section>
              );
            })}
          </article>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .sticky { position: relative !important; }
          body { background: white !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
          pre { white-space: pre-wrap !important; word-break: break-all; }
        }
      `}</style>
    </div>
  );
}
