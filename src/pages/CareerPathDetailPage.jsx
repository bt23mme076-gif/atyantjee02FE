import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Settings,
  Zap,
  Building,
  LineChart,
  DollarSign,
  GraduationCap,
  Award,
  Globe,
  Rocket,
  Gamepad2,
  Megaphone,
  Coins,
  Truck,
  Bot,
  Brain,
  Link2,
  PenTool,
  Handshake,
  Users,
  Scale,
  FlaskConical,
  Leaf,
  HelpCircle,
  Loader2,
  Users2,
  TrendingUp,
  Star,
  MessageSquare,
  RotateCcw,
  PlayCircle,
  FileText,
  ClipboardCheck,
  ExternalLink,
  X,
  Check,
  Wrench,
  Ban,
  Code,
  BookOpen,
  Lock,
} from 'lucide-react';
import {
  getCareerDetail,
  getRelatedCareers,
  createPaymentOrder,
  buildReturnUrl,
} from '../utils/api';
import ItemViewerModal from '../components/roadmap/ItemViewerModal';
import { ICON_MAP } from '../data/careerIcons';
import { load } from '@cashfreepayments/cashfree-js';

function formatSlug(slug) {
  return (slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Skill Node with tooltip ──────────────────────────────────────────────────
function SkillNode({ skill, levelId, color, shadow, isActive, onToggle, onClose }) {
  const btnRef = useRef(null);

  return (
    <div className={`relative flex flex-col items-center ${isActive ? 'z-40' : 'z-10'}`}>
      <button
        ref={btnRef}
        onClick={onToggle}
        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 ${shadow} ${color} ${isActive ? 'scale-105 ring-2 ring-white/30' : 'hover:scale-[1.04]'}`}
      >
        {skill}
      </button>

      {/* Desktop tooltip — anchored below node, hidden on mobile */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="hidden sm:block absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-[#141830] border border-white/15 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] origin-top"
          >
            <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#141830] border-t border-l border-white/15 rotate-45 rounded-sm" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-snug mb-1">{skill}</p>
                <p className="text-xs text-white/55 leading-relaxed">
                  {levelId.charAt(0).toUpperCase() + levelId.slice(1)} skill — essential for this
                  career path.
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="shrink-0 text-white/35 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile tooltip — fixed bottom sheet, above sticky CTA */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed bottom-[72px] left-3 right-3 z-[200] bg-[#141830] border border-white/15 rounded-2xl p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-snug mb-1">{skill}</p>
                <p className="text-xs text-white/55 leading-relaxed">
                  {levelId.charAt(0).toUpperCase() + levelId.slice(1)} skill — essential for this
                  career path.
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="shrink-0 text-white/35 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillTreeGraph({ tree }) {
  const [activeNode, setActiveNode] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveNode(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const levels = [
    {
      id: 'foundational',
      Icon: Leaf,
      title: 'Foundational',
      items: tree.foundational || [],
      color: 'bg-white/5 border-white/20 text-white',
      shadow: 'shadow-[0_0_12px_rgba(255,255,255,0.04)]',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'intermediate',
      Icon: Zap,
      title: 'Intermediate',
      items: tree.intermediate || [],
      color: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
      shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.12)]',
      iconColor: 'text-violet-400',
    },
    {
      id: 'advanced',
      Icon: Rocket,
      title: 'Advanced',
      items: tree.advanced || [],
      color: 'bg-[#FF6B2B]/10 border-[#FF6B2B]/30 text-[#FF9E6B]',
      shadow: 'shadow-[0_0_12px_rgba(255,107,43,0.12)]',
      iconColor: 'text-[#FF6B2B]',
    },
    {
      id: 'interview',
      Icon: Award,
      title: 'Must-Have for Interviews',
      items: tree.mustHaveForInterviews || [],
      color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.12)]',
      iconColor: 'text-emerald-400',
    },
  ].filter((l) => l.items.length > 0);

  return (
    <div className="relative py-6 w-full" ref={containerRef}>
      <div className="flex flex-col gap-10 items-center w-full">
        {levels.map((level, lIdx) => (
          <div key={level.id} className="w-full flex flex-col items-center gap-5">
            {/* Tier label */}
            <div className="flex items-center gap-2 bg-white/[0.04] px-4 py-1.5 rounded-full border border-white/10 shadow">
              <level.Icon className={`w-3.5 h-3.5 ${level.iconColor}`} />
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                {level.title}
              </span>
            </div>

            {/* Skill pills */}
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 w-full max-w-3xl px-2">
              {level.items.map((skill, sIdx) => {
                const nodeKey = `${level.id}-${sIdx}`;
                const isActive = activeNode === nodeKey;
                return (
                  <SkillNode
                    key={sIdx}
                    skill={skill}
                    levelId={level.id}
                    color={level.color}
                    shadow={level.shadow}
                    isActive={isActive}
                    onToggle={() => setActiveNode(isActive ? null : nodeKey)}
                    onClose={() => setActiveNode(null)}
                  />
                );
              })}
            </div>

            {/* Connector to next tier */}
            {lIdx < levels.length - 1 && (
              <div className="flex flex-col items-center gap-0.5 mt-2">
                <div className="w-px h-5 bg-white/10" />
                <ChevronDown className="w-3.5 h-3.5 text-white/15" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Roadmap Stepper ────────────────────────────────────────────────────────
function RoadmapStepper({ roadmap }) {
  const [completed, setCompleted] = useState(new Set());

  const toggleItem = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalItems = roadmap.reduce(
    (acc, yr) => acc + (yr.learn?.length || 0) + (yr.build?.length || 0),
    0
  );
  const overallProgress = totalItems === 0 ? 0 : (completed.size / totalItems) * 100;

  return (
    <div className="relative">
      {/* Overall Progress Bar */}
      <div className="mb-12 p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Journey Progress
          </span>
          <span className="text-lg font-black text-[#FF6B2B]">{Math.round(overallProgress)}%</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6B2B] to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="relative">
        <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full z-0" />

        <div className="space-y-12">
          {roadmap.map((yr, yIdx) => {
            const yrTotal = (yr.learn?.length || 0) + (yr.build?.length || 0);
            let yrCompletedCount = 0;
            if (yr.learn)
              yr.learn.forEach((_, i) => completed.has(`${yIdx}-learn-${i}`) && yrCompletedCount++);
            if (yr.build)
              yr.build.forEach((_, i) => completed.has(`${yIdx}-build-${i}`) && yrCompletedCount++);
            const yrProgress = yrTotal === 0 ? 0 : (yrCompletedCount / yrTotal) * 100;

            const isLeft = yIdx % 2 === 0;

            return (
              <div
                key={yIdx}
                className="relative flex flex-col md:flex-row items-start md:items-center w-full z-10"
              >
                {/* Node */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full border-4 border-[#0B0F2E] bg-gradient-to-br from-[#FF6B2B] to-violet-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,43,0.4)]">
                  <span className="text-lg font-black text-white">{yr.year}</span>
                </div>

                {/* Content Card */}
                <div
                  className={`w-full pl-20 md:w-1/2 ${isLeft ? 'md:pr-12 md:pl-0' : 'md:ml-auto md:pl-12 md:pr-0'}`}
                >
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <Gamepad2 className="w-20 h-20" />
                    </div>

                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {yr.focus || `Year ${yr.year}`}
                        </h3>
                        <p className="text-sm text-white/50 mt-1">{yr.milestone}</p>
                      </div>
                      <span className="text-sm font-bold text-white/40">
                        {Math.round(yrProgress)}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-6 relative z-10">
                      <motion.div
                        className="h-full bg-violet-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${yrProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="space-y-5 relative z-10">
                      {yr.learn?.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                            <BookOpen className="w-3.5 h-3.5" /> Learn
                          </p>
                          <div className="space-y-2.5">
                            {yr.learn.map((l, i) => {
                              const id = `${yIdx}-learn-${i}`;
                              const isDone = completed.has(id);
                              return (
                                <label
                                  key={i}
                                  className="flex items-start gap-3 cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isDone}
                                    onChange={() => toggleItem(id)}
                                  />
                                  <div
                                    className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-white/40 bg-white/5'}`}
                                  >
                                    {isDone && (
                                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    )}
                                  </div>
                                  <span
                                    className={`text-sm leading-snug transition-colors ${isDone ? 'text-white/30 line-through' : 'text-white/75 group-hover:text-white'}`}
                                  >
                                    {l}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {yr.build?.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-[#FF9E6B] uppercase tracking-wider mb-3">
                            <Wrench className="w-3.5 h-3.5" /> Build
                          </p>
                          <div className="space-y-2.5">
                            {yr.build.map((b, i) => {
                              const id = `${yIdx}-build-${i}`;
                              const isDone = completed.has(id);
                              return (
                                <label
                                  key={i}
                                  className="flex items-start gap-3 cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isDone}
                                    onChange={() => toggleItem(id)}
                                  />
                                  <div
                                    className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isDone ? 'bg-[#FF6B2B] border-[#FF6B2B]' : 'border-white/20 group-hover:border-white/40 bg-white/5'}`}
                                  >
                                    {isDone && (
                                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    )}
                                  </div>
                                  <span
                                    className={`text-sm leading-snug transition-colors ${isDone ? 'text-white/30 line-through' : 'text-white/75 group-hover:text-white'}`}
                                  >
                                    {b}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {yr.skip?.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                            <Ban className="w-3.5 h-3.5" /> Skip
                          </p>
                          <ul className="space-y-1.5">
                            {yr.skip.map((s, i) => (
                              <li key={i} className="text-sm text-white/50 flex items-start gap-2">
                                <span className="mt-0.5 text-rose-500/60">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Story Card Carousel ─────────────────────────────────────────────────────
function StoriesCarousel({ stories }) {
  const [idx, setIdx] = useState(0);
  if (!stories?.length) return null;

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50 && idx < stories.length - 1) {
      setIdx(idx + 1);
    } else if (swipe > 50 && idx > 0) {
      setIdx(idx - 1);
    }
  };

  return (
    <div className="relative overflow-hidden w-full pb-2">
      <motion.div
        className="flex"
        animate={{ x: `-${idx * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {stories.map((story, i) => (
          <motion.div
            key={i}
            className="w-full shrink-0 px-2"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full cursor-grab active:cursor-grabbing backdrop-blur-sm hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#FF6B2B] to-violet-500 flex items-center justify-center text-white font-black shadow-lg">
                    {story.name ? story.name[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{story.name}</p>
                    <div className="flex items-center mt-0.5">
                      <span className="text-[10px] font-bold text-[#FF9E6B] bg-[#FF6B2B]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {story.collegeType}
                      </span>
                    </div>
                  </div>
                </div>
                <MessageSquare className="h-5 w-5 text-white/10 shrink-0" />
              </div>
              <p className="text-sm text-white/70 leading-relaxed italic relative">
                <span className="text-2xl text-white/10 absolute -top-3 -left-2">"</span>
                {story.summary}
                <span className="text-2xl text-white/10 absolute -bottom-4 -right-2">"</span>
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {stories.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${i === idx ? 'w-6 bg-[#FF6B2B]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Resource Card ───────────────────────────────────────────────────────────
function ResourceCard({ icon, label, title, url, description }) {
  const Inner = (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 h-full ${url ? 'hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer group' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white leading-snug">{title || description}</p>
      {url && (
        <div className="mt-2 flex items-center gap-1 text-xs text-[#FF9E6B] group-hover:gap-2 transition-all">
          Open <ChevronRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );
  if (url)
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {Inner}
      </a>
    );
  return Inner;
}

// ─── Related Path Card ───────────────────────────────────────────────────────
function RelatedCard({ career }) {
  const Icon = ICON_MAP[career.slug] || HelpCircle;
  return (
    <Link to={`/careers/${career.slug}`}>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 hover:border-white/20 hover:bg-white/[0.06] transition-all group">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B2B]/10 ring-1 ring-[#FF6B2B]/20">
          <Icon className="h-3.5 w-3.5 text-[#FF6B2B]" />
        </div>
        <span className="text-sm font-semibold text-white/80 truncate">
          {career.title || formatSlug(career.slug)}
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-white/20 ml-auto shrink-0 group-hover:text-white/40 transition" />
      </div>
    </Link>
  );
}

// ─── Visual Components ────────────────────────────────────────────────────────
function SalaryGauge({ min, max, note }) {
  // Assume a scale up to 50L for the visual gauge to keep it meaningful
  const maxScale = 50;
  const minL = min / 100000;
  const maxL = max / 100000;

  const minPercent = Math.min((minL / maxScale) * 100, 100);
  const maxPercent = Math.min((maxL / maxScale) * 100, 100);

  return (
    <div className="w-48 sm:w-56">
      <div className="flex justify-between items-end mb-1.5">
        <p className="text-xs font-bold text-white/35 uppercase tracking-wider">Salary Range</p>
        <span className="text-xs font-bold text-white">
          ₹{minL.toFixed(1)}L – {maxL.toFixed(1)}L
        </span>
      </div>
      <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ left: 0, width: 0 }}
          animate={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
        />
      </div>
      {note && <p className="text-[10px] text-white/30 mt-1 text-left leading-tight">{note}</p>}
    </div>
  );
}

function DifficultyMeter({ difficulty }) {
  const levels = {
    Low: { color: 'text-emerald-400', fill: 'fill-emerald-500', percent: 33 },
    Medium: { color: 'text-amber-400', fill: 'fill-amber-500', percent: 66 },
    High: { color: 'text-rose-400', fill: 'fill-rose-500', percent: 100 },
  };
  const level = levels[difficulty] || levels.Medium;

  return (
    <div className="w-32">
      <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2 text-left">
        Difficulty
      </p>
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 36 36" className="h-6 w-6 transform -rotate-90">
          <path
            className="text-white/10"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <motion.path
            className={level.color}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${level.percent}, 100`}
            initial={{ strokeDasharray: '0, 100' }}
            animate={{ strokeDasharray: `${level.percent}, 100` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <span className={`text-sm font-bold ${level.color}`}>{difficulty}</span>
      </div>
    </div>
  );
}

function TraitsRadar({ traits }) {
  if (!traits || traits.length === 0) return null;
  const size = 160;
  const center = size / 2;
  const radius = size / 2 - 25; // Leave room for labels
  const angleStep = (Math.PI * 2) / traits.length;

  const getPoint = (index, r) => {
    const angle = index * angleStep - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const bgPoints = traits
    .map((_, i) => `${getPoint(i, radius).x},${getPoint(i, radius).y}`)
    .join(' ');
  // Create a slight pseudo-random variation in values so it looks like a real chart
  const dataPoints = traits
    .map((_, i) => {
      const r = radius * (0.6 + Math.abs(Math.sin(i * 13)) * 0.4); // fake data 60-100%
      return `${getPoint(i, r).x},${getPoint(i, r).y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0">
      <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2">
        Best-Fit Traits
      </p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={bgPoints}
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
          {traits.map((_, i) => {
            const p = getPoint(i, radius);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={p.x}
                y2={p.y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            );
          })}
          <motion.polygon
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ transformOrigin: 'center' }}
            points={dataPoints}
            fill="rgba(255, 107, 43, 0.2)"
            stroke="#FF6B2B"
            strokeWidth="1.5"
          />
        </svg>
        {traits.map((t, i) => {
          const p = getPoint(i, radius + 15);
          return (
            <div
              key={i}
              className="absolute text-[9px] text-white/60 whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 font-semibold"
              style={{ left: p.x, top: p.y }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Common Mistake Flip Card ────────────────────────────────────────────────
function MistakeFlipCard({ text }) {
  const [isFlipped, setIsFlipped] = useState(false);

  let title = text;
  let explanation = text;
  if (text.includes(':')) {
    const parts = text.split(':');
    title = parts[0].trim();
    explanation = parts.slice(1).join(':').trim();
  } else if (text.includes('-')) {
    const parts = text.split('-');
    title = parts[0].trim();
    explanation = parts.slice(1).join('-').trim();
  } else {
    title = text.length > 55 ? text.substring(0, 55) + '...' : text;
  }

  return (
    <div
      className="relative w-full h-32 cursor-pointer group"
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 25 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-5 hover:bg-rose-500/[0.06] transition-colors flex items-center gap-4 shadow-lg backdrop-blur-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white/90 line-clamp-2 leading-snug">{title}</p>
            <p className="text-[10px] text-rose-400/60 mt-1.5 uppercase tracking-wider font-bold">
              Tap to flip
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 hover:bg-emerald-500/[0.06] transition-colors flex items-start gap-4 shadow-lg backdrop-blur-sm"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex-1 h-full overflow-y-auto custom-scrollbar pr-1">
            <p className="text-sm text-white/80 leading-relaxed">{explanation}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareerPathDetailPage({ user }) {
  const { slug } = useParams();
  const [career, setCareer] = useState(null);
  const [items, setItems] = useState([]);
  const [viewingItem, setViewingItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockForm, setUnlockForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([getCareerDetail(slug), getRelatedCareers(slug).catch(() => ({ related: [] }))])
      .then(([careerData, relData]) => {
        setCareer(careerData.career);
        setItems(careerData.items || []);
        setRelated(relData.related || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleMaterialClick = (item) => {
    const isUnlocked = user?.unlockedPaths?.includes(slug);
    if (!isUnlocked && !user?.premium) {
      setShowUnlockModal(true);
    } else {
      setViewingItem(item);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      // 1. Create order
      const data = await createPaymentOrder({
        planId: 'career-premium',
        pathSlug: slug,
        name: unlockForm.name,
        email: unlockForm.email,
        phone: unlockForm.phone,
        returnUrl: buildReturnUrl('/payment-status', '{order_id}'),
      });

      if (!data.paymentSessionId) throw new Error(data.message || 'Failed to create order session');

      // 2. Initialize Cashfree with correct environment
      const mode = data.cashfreeEnvironment === 'production' ? 'production' : 'sandbox';
      const cashfree = await load({ mode });

      // 3. Trigger checkout
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
      });
    } catch (err) {
      console.error(err);
      setPaymentError(err.message || 'Payment initialization failed.');
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F2E] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#FF6B2B] animate-spin" />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen bg-[#0B0F2E] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertTriangle className="h-10 w-10 text-white/20" />
        <p className="text-white/50">{error || 'Career path not found'}</p>
        <Link to="/roadmap" className="text-sm text-[#FF6B2B] underline">
          ← Back to all paths
        </Link>
      </div>
    );
  }

  const Icon = ICON_MAP[career.slug] || HelpCircle;
  const diff = career.snapshot?.difficultyToBreakIn;
  const diffColor =
    { Low: 'text-emerald-400', Medium: 'text-amber-400', High: 'text-rose-400' }[diff] ||
    'text-white/50';
  const salaryMin = career.snapshot?.salaryRangeINR?.min;
  const salaryMax = career.snapshot?.salaryRangeINR?.max;

  return (
    <div className="min-h-screen bg-[#0B0F2E]">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#FF6B2B] origin-left z-50 shadow-[0_0_10px_#FF6B2B]"
        style={{ scaleX }}
      />

      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,43,0.12),transparent_40%)]" />
        <div className="relative mx-auto max-w-4xl">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All career paths
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-[#FF6B2B]/10 ring-1 ring-[#FF6B2B]/25 flex items-center justify-center">
              <Icon className="h-7 w-7 text-[#FF6B2B]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {career.title}
              </h1>
              {career.tagline && <p className="mt-1 text-base text-white/55">{career.tagline}</p>}
            </div>
          </div>

          {/* Stat bar */}
          <div className="mt-8 flex flex-wrap justify-center sm:justify-start gap-8 sm:gap-12 items-start text-center sm:text-left">
            {salaryMin > 0 && (
              <SalaryGauge
                min={salaryMin}
                max={salaryMax}
                note={career.snapshot?.salaryRangeINR?.note}
              />
            )}
            {diff && <DifficultyMeter difficulty={diff} />}
            {career.snapshot?.bestFitTraits?.length > 0 && (
              <TraitsRadar traits={career.snapshot.bestFitTraits} />
            )}
          </div>
          {career.snapshot?.idealFor && (
            <div className="mt-6 border-l-0 sm:border-l-2 border-[#FF6B2B]/40 pl-0 sm:pl-4 text-center sm:text-left">
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed italic">
                "{career.snapshot.idealFor}"
              </p>
            </div>
          )}
        </div>
      </motion.section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-32 space-y-16">
        {/* ── 2. Roadmap Timeline ──────────────────────────────────────────── */}
        {career.roadmap?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<TrendingUp className="h-4 w-4" />} label="4-Year Roadmap" />
            <RoadmapStepper roadmap={career.roadmap} />
          </motion.section>
        )}

        {/* ── 3. Skill Tree ────────────────────────────────────────────────── */}
        {career.skillTree && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<Code className="h-4 w-4" />} label="Skill Tree" />
            <SkillTreeGraph tree={career.skillTree} />
          </motion.section>
        )}

        {/* ── 4. Real Stories ──────────────────────────────────────────────── */}
        {career.realStories?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<MessageSquare className="h-4 w-4" />} label="From the Field" />
            <StoriesCarousel stories={career.realStories} />
          </motion.section>
        )}

        {/* ── 5. Entry Points ──────────────────────────────────────────────── */}
        {career.entryPoints && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<Users2 className="h-4 w-4" />} label="Getting In" />
            <div className="grid sm:grid-cols-2 gap-5">
              {career.entryPoints.hiringCompanies?.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                    Companies That Hire (Tier-2 Friendly)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {career.entryPoints.hiringCompanies.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {career.entryPoints.onCampusVsOffCampus && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Campus vs Off-Campus
                    </p>
                    <p className="text-sm text-white/65 leading-relaxed">
                      {career.entryPoints.onCampusVsOffCampus}
                    </p>
                  </div>
                )}
                {career.entryPoints.referralTips && (
                  <div className="rounded-2xl border border-[#FF6B2B]/20 bg-[#FF6B2B]/[0.04] p-5">
                    <p className="text-xs font-bold text-[#FF9E6B] uppercase tracking-wider mb-2">
                      💡 Referral Tips
                    </p>
                    <p className="text-sm text-white/65 leading-relaxed">
                      {career.entryPoints.referralTips}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── 6. Common Mistakes ───────────────────────────────────────────── */}
        {career.commonMistakes?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<AlertTriangle className="h-4 w-4" />} label="Common Mistakes" />
            <div className="grid sm:grid-cols-2 gap-5">
              {career.commonMistakes.map((m, i) => (
                <MistakeFlipCard key={i} text={m} />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 7. Resources ─────────────────────────────────────────────────── */}
        {career.resources && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<BookOpen className="h-4 w-4" />} label="Start Here" />
            <div className="grid sm:grid-cols-2 gap-4">
              {career.resources.course?.title && (
                <ResourceCard
                  icon="🎥"
                  label="Course"
                  title={career.resources.course.title}
                  url={career.resources.course.url}
                />
              )}
              {career.resources.book?.title && (
                <ResourceCard
                  icon="📗"
                  label="Book"
                  title={career.resources.book.title}
                  url={career.resources.book.url}
                />
              )}
              {career.resources.projectIdea && (
                <ResourceCard
                  icon="🛠️"
                  label="Project Idea"
                  description={career.resources.projectIdea}
                />
              )}
              {career.resources.community?.name && (
                <ResourceCard
                  icon="💬"
                  label="Community"
                  title={career.resources.community.name}
                  url={career.resources.community.url}
                />
              )}
            </div>
          </motion.section>
        )}

        {/* ── 8. Custom Learning & Preparation Material ─────────────────────── */}
        {items.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              icon={<BookOpen className="h-4 w-4" />}
              label="Learning & Preparation Materials"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item) => {
                const isVideo = item.type === 'video';
                const isDoc = item.type === 'document';
                const isArticle = item.type === 'article';
                const isTask = item.type === 'task';
                const isQuiz = item.type === 'quiz';

                const typeLabel =
                  {
                    video: '🎬 Video',
                    document: '📄 Document',
                    article: '🔗 Article',
                    task: '📋 Task',
                    quiz: '🧩 Quiz',
                  }[item.type] || item.type;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleMaterialClick(item)}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 cursor-pointer hover:border-white/20 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#FF9E6B]">
                        {isVideo && <PlayCircle className="h-5 w-5" />}
                        {isDoc && <FileText className="h-5 w-5" />}
                        {isArticle && <BookOpen className="h-5 w-5" />}
                        {isTask && <ClipboardCheck className="h-5 w-5" />}
                        {isQuiz && <HelpCircle className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white group-hover:text-[#FF9E6B] transition">
                          {item.title}
                        </p>
                        <p className="text-xs text-white/45 capitalize">
                          {typeLabel} {item.durationLabel ? ` · ${item.durationLabel}` : ''}
                        </p>
                      </div>
                    </div>
                    {user?.unlockedPaths?.includes(slug) || user?.premium ? (
                      <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/70 transition shrink-0" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-500/60 group-hover:text-amber-500 transition shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── 9. Related Paths ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader icon={<Star className="h-4 w-4" />} label="You Might Also Like" />
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <RelatedCard key={r.slug} career={r} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ── 10. Sticky Bottom CTA (mobile) ────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 border-t border-white/10 bg-[#0B0F2E]/95 backdrop-blur-lg px-4 py-3 flex gap-3">
        <Link
          to="/quiz"
          className="flex-1 rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] py-2.5 text-xs font-bold text-white text-center shadow-lg shadow-[#FF6B2B]/15"
        >
          <RotateCcw className="inline h-3 w-3 mr-1" /> Retake quiz
        </Link>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
          className="flex-1 rounded-full border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/80"
        >
          Talk to a senior
        </button>
      </div>

      {/* Item Viewer Modal */}
      <ItemViewerModal item={viewingItem} onClose={() => setViewingItem(null)} />

      {/* Unlock Premium Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowUnlockModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0B0F2E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-[#FF6B2B]/10 text-[#FF6B2B] rounded-full flex items-center justify-center mb-4">
                  <Star className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Unlock Premium Materials
                </h2>
                <p className="text-sm text-white/60">
                  Get lifetime access to exclusive study materials, interview prep, and roadmaps for{' '}
                  {career.title} for just <span className="font-bold text-white">₹249</span>.
                </p>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                {paymentError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                    {paymentError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 ml-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={unlockForm.name}
                    onChange={(e) => setUnlockForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B2B] focus:ring-1 focus:ring-[#FF6B2B] transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 ml-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={unlockForm.email}
                    onChange={(e) => setUnlockForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B2B] focus:ring-1 focus:ring-[#FF6B2B] transition-all outline-none"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 ml-1 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    title="10-digit mobile number"
                    value={unlockForm.phone}
                    onChange={(e) =>
                      setUnlockForm((f) => ({
                        ...f,
                        phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                      }))
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF6B2B] focus:ring-1 focus:ring-[#FF6B2B] transition-all outline-none"
                    placeholder="9876543210"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full mt-2 bg-gradient-to-r from-[#FF6B2B] to-[#ff8c59] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#FF6B2B]/20 flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Pay ₹249 & Unlock'
                  )}
                </button>
                <p className="text-[10px] text-white/40 text-center mt-3">
                  Secured by Cashfree Payments
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared section header ────────────────────────────────────────────────────
function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6B2B]/10 text-[#FF6B2B]">
        {icon}
      </div>
      <h2 className="text-lg font-black text-white">{label}</h2>
    </div>
  );
}
