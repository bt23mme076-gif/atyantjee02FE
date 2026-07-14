import React, { useState } from 'react';
import { getDecision } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Code, Cpu, Wrench, Briefcase,
  GitBranch, Compass, FileEdit, MapPin, Target,
  Building, BookOpen, TrendingUp, Rocket, ArrowRight,
  Calculator, HelpCircle, CheckCircle2, Lock,
  Crown, ChevronLeft, User, GraduationCap, Flame, Trophy
} from 'lucide-react';
import { ALL_INDIAN_STATES, POPULAR_LANGUAGES } from '../data/siteContent';

// ── Data ──────────────────────────────────────────────────────────────────────


const STEPS = [
  { key: 'basic', label: 'Identity', icon: User, q: 'Who are you?', sub: 'Tell us a bit about yourself and where to send your results.' },
  { key: 'academic', label: 'Academic', icon: GraduationCap, q: 'Your academic profile?', sub: 'This helps us match you to the right college tier.' },
  { key: 'confusion', label: 'Confusion', icon: Flame, q: "What's your biggest confusion?", sub: 'Be honest. This is where most students get stuck.' },
];

const STEP_COLORS = [
  { from: '#3B82F6', to: '#60A5FA' },   // Identity — blue
  { from: '#A855F7', to: '#818CF8' },   // Academic — purple
  { from: '#F97316', to: '#FBBF24' },   // Confusion — orange
];

const TILE_COLORS = [
  { base: 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md', active: 'border-blue-500 bg-blue-50 shadow-[0_0_16px_rgba(59,130,246,0.15)]', iconBase: 'bg-blue-100 text-blue-600', iconActive: 'bg-blue-500 text-white shadow-md', check: 'text-blue-500', lbl: 'text-blue-900' },
  { base: 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md', active: 'border-purple-500 bg-purple-50 shadow-[0_0_16px_rgba(139,92,246,0.15)]', iconBase: 'bg-purple-100 text-purple-600', iconActive: 'bg-purple-500 text-white shadow-md', check: 'text-purple-500', lbl: 'text-purple-900' },
  { base: 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-md', active: 'border-orange-500 bg-orange-50 shadow-[0_0_16px_rgba(249,115,22,0.15)]', iconBase: 'bg-orange-100 text-orange-600', iconActive: 'bg-orange-500 text-white shadow-md', check: 'text-orange-500', lbl: 'text-orange-900' },
];

const EXAM_SUGGESTIONS = {
  JEE: {
    top: 'Your JEE score is strong. Focus on top NITs/IITs and a branch that aligns with your long-term goals.',
    mid: 'You have good JEE potential. Target strong state and national colleges, then choose the branch that excites you most.',
    low: 'Consider good state-level colleges with stable placements, and keep branch fit + growth skills as your priority.',
  },
  default: {
    top: 'Your profile is promising. Focus on colleges that combine career growth with branch strength.',
    mid: 'Good options are available. Balance branch interest with college reputation and future outcomes.',
    low: 'Look for colleges with strong student support and practical career pathways.',
  },
};

const CONFETTI_COLORS = ['#60A5FA', '#A78BFA', '#34D399', '#FBBF24', '#F87171', '#38BDF8', '#FB923C'];

const slideVariants = {
  enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d < 0 ? 50 : -50, opacity: 0 }),
};

// ── Confetti ──────────────────────────────────────────────────────────────────

const Confetti = () => {
  const particles = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    w: Math.random() * 7 + 3,
    h: Math.random() * 5 + 2,
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 1.2,
    rotate: Math.random() * 720,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: -10, width: p.w, height: p.h, backgroundColor: p.color }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
};

// ── Option Tile ───────────────────────────────────────────────────────────────

const OptionTile = ({ selected, onClick, icon: Icon, label, description, colorIdx = 0 }) => {
  const c = TILE_COLORS[colorIdx % TILE_COLORS.length];
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${selected ? c.active : c.base}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${selected ? c.iconActive : c.iconBase}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-black text-sm ${selected ? c.lbl : 'text-slate-700'}`}>{label}</h4>
          {description && <p className="mt-0.5 text-xs text-slate-400 leading-snug">{description}</p>}
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400 }} className="shrink-0">
              <CheckCircle2 className={`h-5 w-5 ${c.check}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function DecisionEngine() {
  const [activeStep, setActiveStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState(null);
  const [revealing, setRevealing] = useState(false);

  // Step 1: Basic States
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gender, setGender] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [homeState, setHomeState] = useState('');

  // Step 2: Academic States
  const [examType, setExamType] = useState('');
  const [rankInput, setRankInput] = useState('');
  const [category, setCategory] = useState('');
  const [categoryRank, setCategoryRank] = useState('');

  // Step 3: Confusion States
  const [confusion, setConfusion] = useState('');

  const step = STEPS[activeStep - 1];
  const sc = STEP_COLORS[activeStep - 1];
  const gradStyle = { background: `linear-gradient(to right, ${sc.from}, ${sc.to})` };
  const gradStyleB = { background: `linear-gradient(to bottom, ${sc.from}, ${sc.to})` };

  const validateStep = () => {
    if (activeStep === 1 && (!fullName.trim() || !whatsapp.trim() || !gender || !preferredLanguage.trim() || !homeState)) return false;
    if (activeStep === 2 && (!examType || !rankInput.trim() || !category)) return false;
    if (activeStep === 3 && !confusion) return false;
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) { alert('Please fill in all fields to continue.'); return; }
    setDirection(1);
    setActiveStep(s => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    setDirection(-1);
    setActiveStep(s => Math.max(s - 1, 1));
  };

  const buildLocalSuggestion = () => {
    const rank = parseInt(rankInput, 10);
    const examData = EXAM_SUGGESTIONS[examType] || EXAM_SUGGESTIONS.default;
    const tier = rank > 0 ? (rank < 5000 ? 'top' : rank < 50000 ? 'mid' : 'low') : 'mid';
    return `${examData[tier]} Based on your profile from ${homeState}, your category requirements (${category}), and your deep confusion about ${confusion.toLowerCase()}, we recommend navigating toward institutional channels that optimize state home quotas and rank stability metrics.`;
  };

  const handleReveal = async () => {
    if (!validateStep()) return;
    setRevealing(true);
    try {
      const data = await getDecision({
        stream: 'pcm', // Default fallback stream
        rank: parseInt(rankInput, 10) || 0,
        confusion: `${confusion} | Category: ${category} | Category Rank: ${categoryRank || 'N/A'} | Language: ${preferredLanguage} | Gender: ${gender}`,
        name: fullName || undefined,
        state: homeState
      });
      const serverText = data?.result?.direction || data?.result?.suggestion || data?.result?.message || data?.result?.text || '';
      const nextStep = data?.result?.nextStep ? ` ${data.result.nextStep}` : '';
      setResult((serverText + nextStep).trim() || buildLocalSuggestion());
    } catch (err) {
      console.warn('Decision API error, using local fallback:', err.message);
      setResult(buildLocalSuggestion());
    } finally {
      setRevealing(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7 }}
      className="bg-[#0B0F2E] px-4 py-16 lg:py-24 sm:px-6 lg:px-8 relative"
      style={{ overflow: 'hidden' }}
    >
      {/* Ambient blobs */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#FF6B2B]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-5 py-2 mb-5">
            <Sparkles className="h-4 w-4 text-[#FFB38E]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#FFB38E]">Personalized Path Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Clarity Decision Engine</h2>
          <p className="mt-3 text-white/50 text-base">3 quick sections. Your exact college roadmap.</p>
        </div>

        {!result ? (
          /* ── SPLIT SCREEN ── */
          <div className="rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.55)] grid grid-cols-1 lg:grid-cols-[290px_1fr] overflow-hidden">

            {/* ── LEFT: Gradient sidebar ── */}
            <div className="relative" style={gradStyleB}>
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Mobile: compact strip */}
              <div className="relative flex items-center justify-between p-5 lg:hidden border-b border-white/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Step {activeStep} of {STEPS.length}</p>
                  <p className="text-sm font-black text-white mt-0.5">{step.label}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {STEPS.map((s, i) => (
                    <div key={i} className={`rounded-full transition-all duration-300 ${i + 1 < activeStep ? 'h-1.5 w-5 bg-white/50' :
                      i + 1 === activeStep ? 'h-2 w-6 bg-white' : 'h-1.5 w-1.5 bg-white/20'
                      }`} />
                  ))}
                </div>
              </div>

              {/* Desktop: Profile summary sidebar */}
              <div className="relative hidden lg:flex flex-col h-full p-8">
                <div className="mb-8 pb-6 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-3">Building your profile</p>
                  <AnimatePresence mode="wait">
                    {fullName ? (
                      <motion.div key="name" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-xl font-black text-white truncate">{fullName}</p>
                        {whatsapp && <p className="text-xs text-white/70 mt-1 font-medium truncate">{whatsapp}</p>}
                      </motion.div>
                    ) : (
                      <motion.p key="ph" className="text-sm text-white/50 font-bold">Your roadmap awaits...</motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step dynamic vertical roadmap list */}
                <div className="flex-1 space-y-0">
                  {STEPS.map((s, idx) => {
                    const num = idx + 1;
                    const isDone = num < activeStep;
                    const isCurrent = num === activeStep;
                    const Icon = s.icon;
                    return (
                      <div key={s.key} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-400 ${isDone ? 'bg-white/90 shadow-sm' :
                            isCurrent ? 'bg-white/15 ring-2 ring-white/30' : 'bg-white/[0.06]'
                            }`}>
                            {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-[#080C24]" /> : <Icon className={`h-3.5 w-3.5 ${isCurrent ? 'text-white' : 'text-white/20'}`} />}
                          </div>
                          {idx < STEPS.length - 1 && <div className="w-px h-8 my-1 bg-white/10 shrink-0" />}
                        </div>

                        <div className="pb-2 pt-1 flex-1 min-w-0">
                          <p className={`text-xs font-black mb-1 ${isCurrent ? 'text-white' : isDone ? 'text-white/80' : 'text-white/40'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                            {s.label}
                          </p>
                          {isDone && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-0.5 overflow-hidden">
                              {s.key === 'basic' && <><p className="text-[11px] text-white/75 truncate">{fullName} ({gender})</p><p className="text-[11px] text-white/60 truncate">{homeState}</p></>}
                              {s.key === 'academic' && <><p className="text-[11px] text-white/75">{examType} · CRL {rankInput}</p><p className="text-[11px] text-white/60">Cat: {category}</p></>}
                              {s.key === 'confusion' && <p className="text-[11px] text-white/75 truncate">{confusion}</p>}
                            </motion.div>
                          )}
                          {isCurrent && (
                            <div className="flex items-center gap-1.5">
                              <motion.div className="h-1 w-1 rounded-full bg-white/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} />
                              <p className="text-[11px] text-white/60">Answering...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-white/20 shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">AI-powered roadmap engine</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Form logic panel ── */}
            <div className="bg-white flex flex-col">
              <div className="p-7 sm:p-10 flex-1">
                <div className="flex items-center justify-between mb-5">
                  <span className="rounded-full px-3.5 py-1.5 text-xs font-black text-white shadow-sm" style={gradStyle}>
                    {step.label}
                  </span>
                  <span className="text-xs font-bold text-slate-300 tabular-nums">{activeStep}&thinsp;/&thinsp;{STEPS.length}</span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100 mb-8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={gradStyle}
                    animate={{ width: `${(activeStep / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>

                <div className="min-h-[340px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter" animate="center" exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight mb-2">{step.q}</h3>
                        <p className="text-sm text-slate-400">{step.sub}</p>
                      </div>

                      {/* ── STEP 1: Basic Identity Page ── */}
                      {activeStep === 1 && (
                        <div className="max-w-xl space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">Full Name</label>
                              <input
                                type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Rahul Gupta"
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.07)]"
                              />
                            </div>
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">WhatsApp Number</label>
                              <input
                                type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 XXXXX XXXXX"
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.07)]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">Gender</label>
                              <select
                                value={gender} onChange={e => setGender(e.target.value)}
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white h-[58px]"
                              >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">
                                Preferred Language
                              </label>
                              <select
                                value={preferredLanguage}
                                onChange={e => setPreferredLanguage(e.target.value)}
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 pl-5 pr-10 py-4 text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.07)] h-[58px]"
                              >
                                <option value="" disabled>Select Language</option>
                                {POPULAR_LANGUAGES.map(lang => (
                                  <option key={lang} value={lang}>{lang}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="relative">
                            <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">Home State</label>
                            <select
                              value={homeState} onChange={e => setHomeState(e.target.value)}
                              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white max-h-52"
                            >
                              <option value="" disabled>Select your home state</option>
                              {ALL_INDIAN_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* ── STEP 2: Academic Profile Page ── */}
                      {activeStep === 2 && (
                        <div className="space-y-5">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Exam type</p>
                            <div className="grid grid-cols-2 gap-3 max-w-xs">
                              {[
                                { id: 'JEE', icon: Calculator, desc: 'JEE Mains / Advanced' },
                                { id: 'Other', icon: HelpCircle, desc: 'State / Other exam' },
                              ].map((e, i) => (
                                <OptionTile key={e.id} selected={examType === e.id} onClick={() => setExamType(e.id)} icon={e.icon} label={e.id} description={e.desc} colorIdx={i} />
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">Rank (CRL)</label>
                              <input
                                type="text" value={rankInput} onChange={e => setRankInput(e.target.value)} placeholder="e.g. 45000"
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:bg-white focus:border-purple-400 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.07)]"
                              />
                            </div>
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">Category</label>
                              <select
                                value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:bg-white focus:border-purple-400 h-[58px]"
                              >
                                <option value="" disabled>Select Category</option>
                                <option value="General">General / OPEN</option>
                                <option value="OBC-NCL">OBC-NCL</option>
                                <option value="EWS">EWS</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="PwD">PwD</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <label className="absolute -top-2.5 left-4 inline-block bg-white px-1.5 text-xs font-black text-slate-500 z-10">Category Rank (Optional)</label>
                              <input
                                type="text" value={categoryRank} onChange={e => setCategoryRank(e.target.value)} placeholder="e.g. 12000"
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/60 px-5 py-4 text-slate-800 outline-none transition-all focus:bg-white focus:border-purple-400 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.07)]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── STEP 3: Confusion Metric Page ── */}
                      {activeStep === 3 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { id: 'College vs Branch', icon: GitBranch, desc: 'Should I compromise branch for a better college?' },
                            { id: 'Branch vs Career', icon: Compass, desc: 'Will this branch limit my future jobs?' },
                            { id: 'Entrance exam choice', icon: FileEdit, desc: 'Which backup exams are worth taking?' },
                            { id: 'Location vs Profile', icon: MapPin, desc: 'Is moving far away worth the college tag?' },
                            { id: 'Future career fit', icon: Target, desc: "I don't even know what I want to do yet." },
                          ].map((c, i) => (
                            <OptionTile key={c.id} selected={confusion === c.id} onClick={() => setConfusion(c.id)} icon={c.icon} label={c.id} description={c.desc} colorIdx={i} />
                          ))}
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 px-7 sm:px-10 py-5">
                <button
                  type="button" onClick={handleBack} disabled={activeStep === 1}
                  className={`flex items-center gap-1.5 text-sm font-bold transition-all ${activeStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-slate-800 hover:-translate-x-1'}`}
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                {activeStep < STEPS.length ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    type="button" onClick={handleNext}
                    className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black text-white shadow-lg"
                    style={gradStyle}
                  >
                    Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    type="button" onClick={handleReveal} disabled={revealing}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-3.5 text-sm font-black text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all disabled:opacity-70"
                  >
                    <Sparkles className="h-4 w-4" /> {revealing ? 'Generating…' : 'Reveal Roadmap'}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

        ) : (
          /* ── RESULT VIEW PANEL ── */
          <div className="relative">
            <Confetti />

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 160, delay: 0.15 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] mb-4"
              >
                <Trophy className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">
                {fullName ? `${fullName.split(' ')[0]}'s` : 'Your'} College Direction
              </h3>
              <p className="text-white/40 text-sm">Mapped from your assessment parameters</p>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
              className="overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] grid grid-cols-1 sm:grid-cols-5 mb-5"
            >
              {/* Left sidebar info summary */}
              <div className="sm:col-span-2 bg-[#080C24] p-6 border-b border-white/10 sm:border-b-0 sm:border-r">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-5">Your Profile</p>
                <div className="divide-y divide-white/[0.07]">
                  {[
                    { l: 'Exam', v: examType || '—' },
                    { l: 'CRL Rank', v: rankInput || '—' },
                    { l: 'Category', v: category || '—' },
                    { l: 'Home State', v: homeState || '—' },
                    { l: 'Language', v: preferredLanguage || '—' },
                  ].map(s => (
                    <div key={s.l} className="flex justify-between items-center py-3">
                      <span className="text-xs text-white/30 font-bold">{s.l}</span>
                      <span className="text-sm text-white font-black">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right content result string mapping */}
              <div className="sm:col-span-3 bg-white p-6 flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Your Direction</p>
                <p className="text-slate-700 text-sm leading-relaxed flex-1">{result}</p>
                <div className="mt-5 flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Personalized analysis</span>
                </div>
              </div>
            </motion.div>

            {/* Locked Mentors Section */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mb-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-black text-white/25 uppercase tracking-widest whitespace-nowrap">Matched Mentors — {homeState || 'Your State'}</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'R***** S.', college: 'Top IIT', branch: 'Computer Science' },
                  { name: 'A***** K.', college: 'Top NIT', branch: 'Electronics' },
                  { name: 'M***** P.', college: 'Tier 1 State', branch: 'Core Engineering' },
                ].map((m, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-4 select-none">
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 backdrop-blur-[5px]">
                      <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-bold text-white">
                        <Lock className="h-3 w-3 text-white/50" /> Match Locked
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="h-12 w-12 rounded-full bg-white/10 overflow-hidden blur-[3px] shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}&backgroundColor=1e293b`} alt="Mentor" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{m.name}</div>
                        <div className="text-xs text-white/50">{m.college}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 opacity-50">
                      <div className="flex items-center gap-1.5 text-xs text-white/60"><BookOpen className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{m.branch}</span></div>
                      <div className="flex items-center gap-1.5 text-xs text-white/60"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{homeState || 'Target State'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Call To Actions */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="https://wa.me/919579040183"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-black text-white shadow-[0_0_24px_rgba(37,211,102,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_36px_rgba(37,211,102,0.5)]"
              >
                Discuss on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105"
              >
                <Crown className="h-4 w-4 text-amber-400" /> Unlock a Mentor
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
