import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import StreakBadge from './StreakBadge';
import ProgressBar from './ProgressBar';
import BatchBanner from './BatchBanner';

// Hero for the /roadmap page. Mirrors the reference design's "From Day 1 of
// College to Day 1 of Your Career" headline while keeping Atyant's dark
// navy + orange/purple gradient language from the rest of the site.
export default function RoadmapHero({ user, streak, overallProgress, batch, memberCount }) {
  const isLoggedIn = !!user;

  return (
    <section className="relative overflow-hidden bg-[#0B0F2E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,43,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.18),_transparent_30%)]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8B5CF6]/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#FF6B2B]" />
            For India's engineering students
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            From Day 1 of College
            <span className="block text-[#FFB38E]">to Day 1 of Your Career.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Your exact roadmap, skills, and community to go from confused fresher to placed
            professional — 7 structured pillars, one clear path.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <a
                href="#pillars"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B2B] px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]"
              >
                Continue Your Roadmap <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B2B] px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]"
              >
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <a
              href="#pillars"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white/10"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isLoggedIn && (
              <StreakBadge
                currentStreak={streak?.currentStreak}
                longestStreak={streak?.longestStreak}
              />
            )}
            {isLoggedIn && batch && <BatchBanner batch={batch} memberCount={memberCount} />}
            {!isLoggedIn && (
              <p className="text-sm text-white/50">
                Join thousands of students already on their path
              </p>
            )}
          </div>

          {isLoggedIn && (
            <div className="mx-auto mt-8 max-w-sm">
              <ProgressBar percent={overallProgress} label="Overall roadmap progress" size="lg" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
