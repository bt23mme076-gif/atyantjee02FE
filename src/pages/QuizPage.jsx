import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Loader2,
  ChevronRight,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { getQuizQuestions, submitQuizAnswers, submitQuizEmail, isUserLoggedIn } from '../utils/api';

// ─── Unique session ID for anonymous tracking ─────────────────────────────────
function getOrCreateSessionId() {
  const key = 'atyant_quiz_session';
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, sid);
  }
  return sid;
}

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function CircleProgress({ percent, size = 80, strokeWidth = 6 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#FF6B2B"
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

// ─── Icon map for career path icons ──────────────────────────────────────────
import { ICON_MAP } from '../data/careerIcons';

// ─── Slide transition variants ────────────────────────────────────────────────
const slideVariants = {
  enterForward: { opacity: 0, x: 60 },
  enterBackward: { opacity: 0, x: -60 },
  center: { opacity: 1, x: 0 },
  exitForward: { opacity: 0, x: -60 },
  exitBackward: { opacity: 0, x: 60 },
};

// ─── Option button ────────────────────────────────────────────────────────────
function OptionButton({ label, selected, onClick, multiSelect }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full text-left rounded-xl px-5 py-4 text-sm font-medium border transition-all duration-200 ${
        selected
          ? 'bg-[#FF6B2B]/15 border-[#FF6B2B] text-white shadow-[0_0_0_1px_rgba(255,107,43,0.4)]'
          : 'bg-white/[0.03] border-white/10 text-white/80 hover:border-white/30 hover:bg-white/[0.06]'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex-shrink-0 h-5 w-5 rounded-${multiSelect ? 'md' : 'full'} border-2 flex items-center justify-center transition-all ${
            selected ? 'bg-[#FF6B2B] border-[#FF6B2B]' : 'border-white/30'
          }`}
        >
          {selected && <CheckCircle className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>
        <span>{label}</span>
      </div>
    </motion.button>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────
function ResultCard({ match, rank }) {
  const IconComponent = ICON_MAP[match.careerId] || HelpCircle;
  const rankColors = [
    'from-[#FF6B2B] to-[#ff8c59]',
    'from-[#7c3aed] to-[#9f67fa]',
    'from-[#0ea5e9] to-[#38bdf8]',
  ];
  return (
    <Link to={`/careers/${match.careerId}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.15 }}
        className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer group"
      >
        {/* Rank badge */}
        <div
          className={`absolute top-4 right-4 h-7 w-7 rounded-full bg-gradient-to-br ${rankColors[rank]} flex items-center justify-center text-xs font-black text-white shadow-lg`}
        >
          {rank + 1}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Circular progress */}
          <div className="relative flex-shrink-0 mt-2 sm:mt-0">
            <CircleProgress percent={match.matchPercent} size={76} strokeWidth={5.5} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-white leading-none">
                {match.matchPercent}%
              </span>
              <span className="text-[9px] text-white/50 leading-none mt-0.5 uppercase tracking-wider">
                match
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center sm:justify-start">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B2B]/15 ring-1 ring-[#FF6B2B]/30">
                  <IconComponent className="h-3.5 w-3.5 text-[#FF6B2B]" />
                </div>
                <span className="text-base font-bold text-white leading-none">
                  {match.title ||
                    match.careerId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </div>
            </div>

            <p className="text-sm text-white/60 leading-relaxed pr-0 sm:pr-8">{match.reason}</p>

            <div className="mt-4 flex items-center justify-center sm:justify-start gap-1 text-xs font-semibold text-[#FF6B2B] group-hover:gap-2 transition-all">
              Explore this career path <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────
export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0); // 0-indexed question index
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [answers, setAnswers] = useState({}); // questionId → [optionId, ...]
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const sessionId = useRef(getOrCreateSessionId()).current;

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/login?redirect=/quiz', {
        state: { message: 'Please log in to take the Career Fit Quiz', redirect: '/quiz' },
      });
      return;
    }

    getQuizQuestions()
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [navigate]);

  const currentQ = questions[step];
  const isMulti = currentQ?.type === 'multi_select';
  const currentAnswers = answers[currentQ?.id] || [];

  const toggleOption = useCallback(
    (optId) => {
      if (!currentQ) return;
      setAnswers((prev) => {
        const existing = prev[currentQ.id] || [];
        if (isMulti) {
          const idx = existing.indexOf(optId);
          const updated = idx >= 0 ? existing.filter((o) => o !== optId) : [...existing, optId];
          return { ...prev, [currentQ.id]: updated };
        }
        return { ...prev, [currentQ.id]: [optId] };
      });
    },
    [currentQ, isMulti]
  );

  const canNext = currentAnswers.length > 0;
  const isLast = step === questions.length - 1;

  const goNext = () => {
    if (!canNext) return;
    if (isLast) {
      handleSubmit();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
        questionId,
        selectedOptionIds,
      }));
      const data = await submitQuizAnswers({ sessionId, answers: answersArray });
      setResult(data.result);
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !result?.id) return;
    try {
      await submitQuizEmail(result.id, email);
      setEmailSent(true);
    } catch (err) {
      console.error('Email submission failed:', err);
    }
  };

  const retake = () => {
    setStep(0);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setEmail('');
    setEmailSent(false);
    setDirection(1);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F2E] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#FF6B2B] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F2E] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-white/60">{error}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-[#FF6B2B] underline">
          Go back
        </button>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-[#0B0F2E] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Title & Subtext & Email Box */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B2B]/15 ring-1 ring-[#FF6B2B]/30 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#FF6B2B]" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Your Top Career Matches
                </h1>
                <p className="mt-3 text-white/60 text-sm sm:text-base leading-relaxed">
                  Based on your answers, here are the 3 paths that fit you best. Explore them to
                  find roadmaps, skills, and senior guidance.
                </p>
              </motion.div>

              {/* Email capture form */}
              {!emailSent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="h-4 w-4 text-[#FF9E6B]" />
                    <p className="text-sm font-semibold text-white">
                      Get your results in your inbox
                    </p>
                  </div>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B2B]/50"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#FF6B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a42] transition shrink-0"
                    >
                      Send
                    </button>
                  </form>
                </motion.div>
              )}

              {emailSent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center lg:text-left"
                >
                  <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center lg:justify-start gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>We've saved your email address!</span>
                  </p>
                  <p className="mt-1 text-xs text-white/50">Your results will be sent to {email}</p>
                </motion.div>
              )}
            </div>

            {/* Right Column: Result Cards List & CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-4">
                {(result.topMatches || []).map((match, i) => (
                  <ResultCard key={match.careerId} match={match} rank={i} />
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={retake}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-sm font-semibold text-white/80 hover:bg-white/5 transition"
                >
                  <RotateCcw className="h-4 w-4" /> Retake quiz
                </button>
                <Link
                  to="/roadmap"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
                >
                  Explore all 30 paths <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz question screen ────────────────────────────────────────────────────
  const progress = questions.length > 0 ? ((step + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0B0F2E] px-4 py-16 sm:px-6">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm text-white/40 disabled:opacity-0 hover:text-white/70 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <span className="text-xs font-semibold text-white/40">
            Question {step + 1} of {questions.length}
          </span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? 'enterForward' : 'enterBackward'}
            animate="center"
            exit={direction > 0 ? 'exitForward' : 'exitBackward'}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-8">
              <h2 className="text-xl font-black text-white sm:text-2xl leading-tight">
                {currentQ?.question}
              </h2>
              {currentQ?.subtext && (
                <p className="mt-2 text-sm text-white/45">{currentQ.subtext}</p>
              )}
              {isMulti && (
                <p className="mt-1.5 text-xs font-semibold text-[#FF9E6B]">Select all that apply</p>
              )}
            </div>

            <div className="space-y-3">
              {(currentQ?.options || []).map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={currentAnswers.includes(opt.id)}
                  onClick={() => toggleOption(opt.id)}
                  multiSelect={isMulti}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next / Submit button */}
        <div className="mt-8">
          <motion.button
            type="button"
            onClick={goNext}
            disabled={!canNext || submitting}
            whileHover={canNext ? { scale: 1.02 } : {}}
            whileTap={canNext ? { scale: 0.98 } : {}}
            className={`w-full rounded-full py-3.5 text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
              canNext
                ? 'bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] shadow-lg shadow-[#FF6B2B]/20 hover:shadow-[#FF6B2B]/30'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Calculating your matches…
              </>
            ) : isLast ? (
              <>
                See my career matches <CheckCircle className="h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
