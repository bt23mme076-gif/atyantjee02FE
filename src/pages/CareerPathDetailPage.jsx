import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronRight, AlertTriangle,
  BookOpen, Cpu, Code, Database, Briefcase, Palette, Shield, Cloud,
  Settings, Zap, Building, LineChart, DollarSign, GraduationCap, Award,
  Globe, Rocket, Gamepad2, Megaphone, Coins, Truck, Bot, Brain,
  Link2, PenTool, Handshake, Users, Scale, FlaskConical, Leaf, HelpCircle,
  Loader2, Users2, TrendingUp, Star, MessageSquare, RotateCcw
} from 'lucide-react';
import { getCareerDetail, getRelatedCareers } from '../utils/api';

const ICON_MAP = {
  'software-engineering': Code, 'data-science': Database, 'product-management': Briefcase,
  'ui-ux-design': Palette, 'cybersecurity': Shield, 'cloud-and-devops': Cloud,
  'mechanical-core': Settings, 'electronics-and-vlsi': Zap, 'civil-and-infra': Building,
  'consulting': LineChart, 'investment-banking': DollarSign, 'mba-prep': GraduationCap,
  'gate-prep': Award, 'ms-abroad': Globe, 'entrepreneurship': Rocket,
  'game-development': Gamepad2, 'digital-marketing': Megaphone, 'finance-and-fpanda': Coins,
  'supply-chain-and-operations': Truck, 'robotics': Bot, 'ai-ml-research': Brain,
  'embedded-systems': Cpu, 'blockchain-and-web3': Link2, 'technical-writing': PenTool,
  'sales-and-business-development': Handshake, 'hr-and-people-ops': Users,
  'legal-and-compliance': Scale, 'biotech-and-pharma': FlaskConical, 'renewable-energy': Leaf,
};

function formatSlug(slug) {
  return (slug || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Skill Chip ─────────────────────────────────────────────────────────────
function SkillChip({ label, variant = 'default' }) {
  const styles = {
    default: 'bg-white/5 border-white/10 text-white/70',
    intermediate: 'bg-violet-500/10 border-violet-500/25 text-violet-300',
    advanced: 'bg-[#FF6B2B]/10 border-[#FF6B2B]/25 text-[#FF9E6B]',
    interview: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ─── Roadmap Year Card ──────────────────────────────────────────────────────
function RoadmapYear({ data, index }) {
  const [open, setOpen] = useState(index === 0);
  const colors = ['from-[#FF6B2B] to-[#ff8c59]', 'from-violet-500 to-violet-400', 'from-sky-500 to-sky-400', 'from-emerald-500 to-emerald-400'];
  return (
    <div className="relative">
      {/* Connector line */}
      {index < 3 && (
        <div className="absolute left-[19px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-white/15 to-transparent z-0" />
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 w-full flex items-center gap-4 text-left group"
      >
        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center shadow-lg text-white font-black text-sm`}>
          {data.year}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white">{data.focus || `Year ${data.year}`}</div>
          <div className="text-xs text-white/40 truncate">{data.milestone}</div>
        </div>
        <ChevronDown className={`flex-shrink-0 h-4 w-4 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="ml-14 mt-4 mb-6 space-y-4">
              {data.learn?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">📚 Learn</p>
                  <ul className="space-y-1">
                    {data.learn.map((l, i) => <li key={i} className="text-sm text-white/65 flex items-start gap-2"><span className="mt-0.5 text-emerald-500/60">•</span>{l}</li>)}
                  </ul>
                </div>
              )}
              {data.build?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#FF9E6B] uppercase tracking-wider mb-2">🛠️ Build</p>
                  <ul className="space-y-1">
                    {data.build.map((b, i) => <li key={i} className="text-sm text-white/65 flex items-start gap-2"><span className="mt-0.5 text-[#FF6B2B]/60">•</span>{b}</li>)}
                  </ul>
                </div>
              )}
              {data.skip?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">🚫 Skip (time wasters)</p>
                  <ul className="space-y-1">
                    {data.skip.map((s, i) => <li key={i} className="text-sm text-white/65 flex items-start gap-2"><span className="mt-0.5 text-rose-500/60">•</span>{s}</li>)}
                  </ul>
                </div>
              )}
              {data.milestone && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                  <p className="text-xs font-bold text-emerald-400 mb-1">🎯 Year-end milestone</p>
                  <p className="text-sm text-white/70">{data.milestone}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Story Card Carousel ─────────────────────────────────────────────────────
function StoriesCarousel({ stories }) {
  const [idx, setIdx] = useState(0);
  if (!stories?.length) return null;
  const story = stories[idx];
  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Users2 className="h-4 w-4 text-[#FF9E6B]" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{story.collegeType}</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed mb-4">"{story.summary}"</p>
        <p className="text-xs font-bold text-white/40">— {story.name}</p>
      </div>
      {stories.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${i === idx ? 'w-6 bg-[#FF6B2B]' : 'w-1.5 bg-white/20'}`}
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
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 h-full ${url ? 'hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer group' : ''}`}>
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
  if (url) return <a href={url} target="_blank" rel="noreferrer">{Inner}</a>;
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
        <span className="text-sm font-semibold text-white/80 truncate">{career.title || formatSlug(career.slug)}</span>
        <ArrowRight className="h-3.5 w-3.5 text-white/20 ml-auto shrink-0 group-hover:text-white/40 transition" />
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareerPathDetailPage() {
  const { slug } = useParams();
  const [career, setCareer] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      getCareerDetail(slug),
      getRelatedCareers(slug).catch(() => ({ related: [] })),
    ])
      .then(([careerData, relData]) => {
        setCareer(careerData.career);
        setRelated(relData.related || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

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
        <Link to="/roadmap" className="text-sm text-[#FF6B2B] underline">← Back to all paths</Link>
      </div>
    );
  }

  const Icon = ICON_MAP[career.slug] || HelpCircle;
  const diff = career.snapshot?.difficultyToBreakIn;
  const diffColor = { Low: 'text-emerald-400', Medium: 'text-amber-400', High: 'text-rose-400' }[diff] || 'text-white/50';
  const salaryMin = career.snapshot?.salaryRangeINR?.min;
  const salaryMax = career.snapshot?.salaryRangeINR?.max;

  return (
    <div className="min-h-screen bg-[#0B0F2E]">

      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,43,0.12),transparent_40%)]" />
        <div className="relative mx-auto max-w-4xl">
          <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> All career paths
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-[#FF6B2B]/10 ring-1 ring-[#FF6B2B]/25 flex items-center justify-center">
              <Icon className="h-7 w-7 text-[#FF6B2B]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{career.title}</h1>
              {career.tagline && (
                <p className="mt-1 text-base text-white/55">{career.tagline}</p>
              )}
            </div>
          </div>

          {/* Stat bar */}
          <div className="mt-8 flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8 text-center sm:text-left">
            {salaryMin > 0 && (
              <div>
                <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-1">Salary Range</p>
                <p className="text-sm font-bold text-white">
                  ₹{(salaryMin / 100000).toFixed(1)}L – ₹{(salaryMax / 100000).toFixed(1)}L/yr
                </p>
                {career.snapshot?.salaryRangeINR?.note && (
                  <p className="text-[10px] text-white/30 mt-0.5">{career.snapshot.salaryRangeINR.note}</p>
                )}
              </div>
            )}
            {diff && (
              <div>
                <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-1">Break-In Difficulty</p>
                <p className={`text-sm font-bold ${diffColor}`}>{diff}</p>
              </div>
            )}
            {career.snapshot?.bestFitTraits?.length > 0 && (
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2">Best-Fit Traits</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {career.snapshot.bestFitTraits.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/60">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {career.snapshot?.idealFor && (
            <div className="mt-6 border-l-0 sm:border-l-2 border-[#FF6B2B]/40 pl-0 sm:pl-4 text-center sm:text-left">
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed italic">"{career.snapshot.idealFor}"</p>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-32 space-y-16">

        {/* ── 2. Roadmap Timeline ──────────────────────────────────────────── */}
        {career.roadmap?.length > 0 && (
          <section>
            <SectionHeader icon={<TrendingUp className="h-4 w-4" />} label="4-Year Roadmap" />
            <div className="space-y-2">
              {career.roadmap.map((yr, i) => (
                <RoadmapYear key={yr.year} data={yr} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── 3. Skill Tree ────────────────────────────────────────────────── */}
        {career.skillTree && (
          <section>
            <SectionHeader icon={<Code className="h-4 w-4" />} label="Skill Tree" />
            <div className="space-y-5">
              {career.skillTree.foundational?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">🌱 Foundational</p>
                  <div className="flex flex-wrap gap-2">{career.skillTree.foundational.map((s) => <SkillChip key={s} label={s} />)}</div>
                </div>
              )}
              {career.skillTree.intermediate?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">⚡ Intermediate</p>
                  <div className="flex flex-wrap gap-2">{career.skillTree.intermediate.map((s) => <SkillChip key={s} label={s} variant="intermediate" />)}</div>
                </div>
              )}
              {career.skillTree.advanced?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#FF9E6B] uppercase tracking-wider mb-3">🔥 Advanced</p>
                  <div className="flex flex-wrap gap-2">{career.skillTree.advanced.map((s) => <SkillChip key={s} label={s} variant="advanced" />)}</div>
                </div>
              )}
              {career.skillTree.mustHaveForInterviews?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">🎯 Must-Have for Interviews</p>
                  <div className="flex flex-wrap gap-2">{career.skillTree.mustHaveForInterviews.map((s) => <SkillChip key={s} label={s} variant="interview" />)}</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 4. Real Stories ──────────────────────────────────────────────── */}
        {career.realStories?.length > 0 && (
          <section>
            <SectionHeader icon={<MessageSquare className="h-4 w-4" />} label="From the Field" />
            <StoriesCarousel stories={career.realStories} />
          </section>
        )}

        {/* ── 5. Entry Points ──────────────────────────────────────────────── */}
        {career.entryPoints && (
          <section>
            <SectionHeader icon={<Users2 className="h-4 w-4" />} label="Getting In" />
            <div className="grid sm:grid-cols-2 gap-5">
              {career.entryPoints.hiringCompanies?.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Companies That Hire (Tier-2 Friendly)</p>
                  <div className="flex flex-wrap gap-2">
                    {career.entryPoints.hiringCompanies.map((c) => (
                      <span key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {career.entryPoints.onCampusVsOffCampus && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Campus vs Off-Campus</p>
                    <p className="text-sm text-white/65 leading-relaxed">{career.entryPoints.onCampusVsOffCampus}</p>
                  </div>
                )}
                {career.entryPoints.referralTips && (
                  <div className="rounded-2xl border border-[#FF6B2B]/20 bg-[#FF6B2B]/[0.04] p-5">
                    <p className="text-xs font-bold text-[#FF9E6B] uppercase tracking-wider mb-2">💡 Referral Tips</p>
                    <p className="text-sm text-white/65 leading-relaxed">{career.entryPoints.referralTips}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Common Mistakes ───────────────────────────────────────────── */}
        {career.commonMistakes?.length > 0 && (
          <section>
            <SectionHeader icon={<AlertTriangle className="h-4 w-4" />} label="Common Mistakes" />
            <div className="space-y-3">
              {career.commonMistakes.map((m, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-rose-500/15 bg-rose-500/[0.03] px-4 py-3">
                  <span className="mt-0.5 text-rose-400 text-sm">✕</span>
                  <p className="text-sm text-white/65">{m}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 7. Resources ─────────────────────────────────────────────────── */}
        {career.resources && (
          <section>
            <SectionHeader icon={<BookOpen className="h-4 w-4" />} label="Start Here" />
            <div className="grid sm:grid-cols-2 gap-4">
              {career.resources.course?.title && (
                <ResourceCard icon="🎥" label="Course" title={career.resources.course.title} url={career.resources.course.url} />
              )}
              {career.resources.book?.title && (
                <ResourceCard icon="📗" label="Book" title={career.resources.book.title} url={career.resources.book.url} />
              )}
              {career.resources.projectIdea && (
                <ResourceCard icon="🛠️" label="Project Idea" description={career.resources.projectIdea} />
              )}
              {career.resources.community?.name && (
                <ResourceCard icon="💬" label="Community" title={career.resources.community.name} url={career.resources.community.url} />
              )}
            </div>
          </section>
        )}

        {/* ── 8. Related Paths ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section>
            <SectionHeader icon={<Star className="h-4 w-4" />} label="You Might Also Like" />
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => <RelatedCard key={r.slug} career={r} />)}
            </div>
          </section>
        )}
      </div>

      {/* ── 9. Sticky Bottom CTA (mobile) ────────────────────────────────── */}
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
