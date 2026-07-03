import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

// Pastel dot colors keyed by the backend's `colorKey`. Tuned as translucent
// fills over the dark navy background (rest of the site's convention —
// see PillarSection/RoadmapItemCard) rather than the light-mode pastel
// swatches used by the original my-roadmap-mate reference.
const dotColorMap = {
  rose: 'bg-rose-400/25 ring-1 ring-rose-400/40',
  violet: 'bg-violet-400/25 ring-1 ring-violet-400/40',
  emerald: 'bg-emerald-400/25 ring-1 ring-emerald-400/40',
  amber: 'bg-amber-400/25 ring-1 ring-amber-400/40',
  sky: 'bg-sky-400/25 ring-1 ring-sky-400/40',
};

function CareerPathCard({ path, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(path)}
      whileHover={{ y: -2 }}
      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#FF6B2B]/40 hover:bg-white/[0.05]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={`h-9 w-9 shrink-0 rounded-full ${dotColorMap[path.colorKey] || dotColorMap.rose}`} />
        <span className="truncate text-sm font-semibold text-white">{path.title}</span>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-white/30" />
    </motion.button>
  );
}

// "29 career paths. One platform." grid — styled to match the dark navy /
// orange-accent language used everywhere else on the site (PillarSection,
// RoadmapHero), not the light-mode reference design. The "+N more" control
// is a real toggle: it expands the grid to reveal every remaining path
// instead of being static text.
export default function CareerPathsSection({ featured = [], more = [], totalCount = 0, remainingCount = 0 }) {
  const [expanded, setExpanded] = useState(false);

  const handleSelect = () => {
    // No dedicated per-path page yet — reuse the site's existing lead
    // capture flow so interest here still reaches the team.
    window.dispatchEvent(new CustomEvent('openLeadModal'));
  };

  if (!featured.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0B0F2E] py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.14),_transparent_35%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FF9E6B]">Career Exploration</p>
            <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl">
              {totalCount || featured.length} career paths. One platform.
            </h2>
            <p className="mt-3 max-w-lg text-white/60">
              From Software Engineering to MBA prep — explore every direction available to you.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSelect}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#FF6B2B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/20 transition hover:scale-[1.02] hover:bg-[#ff7a42] sm:self-auto"
          >
            Take the Career Fit Quiz <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((path) => (
            <CareerPathCard key={path.id} path={path} onSelect={handleSelect} />
          ))}
        </div>

        <AnimatePresence>
          {expanded && more.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {more.map((path) => (
                  <CareerPathCard key={path.id} path={path} onSelect={handleSelect} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            {expanded ? 'Show fewer paths' : `+ ${remainingCount} more paths inside the platform`}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </section>
  );
}
