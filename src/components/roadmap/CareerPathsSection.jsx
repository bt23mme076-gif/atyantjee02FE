import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronDown, Code, Database, Briefcase, Palette, Shield, Cloud, Settings, Zap,
  Building, LineChart, DollarSign, GraduationCap, Award, Globe, Rocket, Gamepad2,
  Megaphone, Coins, Truck, Bot, Brain, Cpu, Link2, PenTool, Handshake, Users, Scale,
  FlaskConical, Leaf, HelpCircle, Lock
} from 'lucide-react';

const iconMap = {
  'software-engineering': Code,
  'data-science': Database,
  'product-management': Briefcase,
  'ui-ux-design': Palette,
  'cybersecurity': Shield,
  'cloud-and-devops': Cloud,
  'mechanical-core': Settings,
  'electronics-and-vlsi': Zap,
  'civil-and-infra': Building,
  'consulting': LineChart,
  'investment-banking': DollarSign,
  'mba-prep': GraduationCap,
  'gate-prep': Award,
  'ms-abroad': Globe,
  'entrepreneurship': Rocket,
  'game-development': Gamepad2,
  'digital-marketing': Megaphone,
  'finance-and-fpanda': Coins,
  'supply-chain-and-operations': Truck,
  'robotics': Bot,
  'ai-ml-research': Brain,
  'embedded-systems': Cpu,
  'blockchain-and-web3': Link2,
  'technical-writing': PenTool,
  'sales-and-business-development': Handshake,
  'hr-and-people-ops': Users,
  'legal-and-compliance': Scale,
  'biotech-and-pharma': FlaskConical,
  'renewable-energy': Leaf
};

function getCareerPathIcon(slug) {
  return iconMap[slug] || HelpCircle;
}

function CareerPathCard({ path, isLoggedIn }) {
  const IconComponent = getCareerPathIcon(path.slug);

  return (
    <Link to={`/careers/${path.slug}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#FF6B2B]/40 hover:bg-white/[0.05] cursor-pointer"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white ring-1 ring-white/15">
            <IconComponent className="h-4.5 w-4.5 text-[#FF6B2B]" strokeWidth={2.2} />
          </div>
          <span className="truncate text-sm font-semibold text-white">{path.title}</span>
        </div>
        {isLoggedIn ? (
          <ArrowRight className="h-4 w-4 shrink-0 text-white/30" />
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-white/30" />
        )}
      </motion.div>
    </Link>
  );
}

// "29 career paths. One platform." grid — styled to match the dark navy /
// orange-accent language used everywhere else on the site (PillarSection,
// RoadmapHero), not the light-mode reference design. The "+N more" control
// is a real toggle: it expands the grid to reveal every remaining path
// instead of being static text.
export default function CareerPathsSection({ featured = [], more = [], totalCount = 0, remainingCount = 0, isLoggedIn = false }) {
  const [expanded, setExpanded] = useState(false);

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
          <Link
            to="/quiz"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#FF6B2B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/20 transition hover:scale-[1.02] hover:bg-[#ff7a42] sm:self-auto"
          >
            Take the Career Fit Quiz <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((path) => (
            <CareerPathCard key={path.id} path={path} isLoggedIn={isLoggedIn} />
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
                  <CareerPathCard key={path.id} path={path} isLoggedIn={isLoggedIn} />
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
