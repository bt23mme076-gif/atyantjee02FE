import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles } from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

export const ADMISSION_PROGRAMS = [
  {
    id: 'college-clarity',
    title: 'College Clarity',
    badge: 'LIMITED TIME OFFER',
    badgeFloating: false,
    discount: '33% OFF',
    price: '999',
    oldPrice: '1,500',
    shortDesc: 'Quick expert clarity before your CAP rounds.',
    bestFor: 'Students who want quick clarity before CAP rounds.',
    features: [
      'Personalized Strategy Session',
      'Rank, College & Branch Analysis',
      'Personalized College Shortlist',
      'CAP Strategy Guidance',
      'WhatsApp Support',
    ],
    bonusLabel: 'Bonus Resources',
    bonusItems: [
      'Top Maharashtra Colleges Guide',
      'Branch Scope Guide',
      'Common Admission Mistakes',
    ],
    cta: 'Get Clarity →',
    footerNote: 'Quick clarity before your CAP round.',
    colorTheme: 'default',
    whatsappText: "Hi, I'm interested in the College Clarity program",
  },
  {
    id: 'admission-success',
    title: 'Admission Success',
    badge: '⭐ MOST POPULAR',
    badgeFloating: true,
    subtitle: 'Chosen by Students & Parents',
    shortDesc: 'Complete support from CAP rounds till final admission.',
    discount: '43% OFF',
    price: '1,999',
    oldPrice: '3,500',
    bestFor: 'Students who want support till final admission.',
    valueCallout: '🏆 Best Value',
    comparisonHint: 'Everything in College Clarity + Complete Admission Support',
    features: [
      'Everything in College Clarity',
      'Dedicated Admission Mentor',
      'Complete CAP & Spot Round Support',
      'Choice Filling Review',
      'Unlimited WhatsApp Support',
      'Final Admission Guidance',
    ],
    bonusLabel: 'Career Advantage Pack',
    bonusItems: [
      'Resume Templates',
      'LinkedIn Starter Guide',
      'Internship Roadmap',
      'Placement Preparation Roadmap',
      'Career Opportunities by Branch',
    ],
    cta: 'Get Full Support →',
    footerNote: 'Support till admission. Guidance beyond admission.',
    colorTheme: 'center',
    whatsappText: "Hi, I'm interested in the Admission Success program",
  },
  {
    id: 'admission-career-growth',
    title: 'Admission + Career Growth',
    badge: '👑 PREMIUM',
    badgeFloating: true,
    shortDesc: 'Full handholding from admission to career success.',
    discount: '20% OFF',
    price: '3,999',
    oldPrice: '5,000',
    bestFor: 'Students & parents who want complete handholding.',
    features: [
      'Everything in Admission Success',
      'Personal 1-on-1 Mentor',
      'Parent Consultation Session',
      'Priority Support',
      'College Joining Guidance',
    ],
    bonusLabel: 'Premium Career Accelerator',
    bonusItems: [
      'Resume Review & Optimization',
      'LinkedIn Profile Review',
      'Personalized Career Roadmap',
      'Placement Strategy',
      'Industry & Domain Selection Guidance',
    ],
    cta: 'Go Premium →',
    footerNote: 'From MHT-CET Admission to Career Success.',
    colorTheme: 'premium',
    whatsappText: "Hi, I'm interested in the Admission + Career Growth program",
  },
];

// ─── Constants ─────────────────────────────────────────────────────────────────

const COLLEGES = [
  'COEP Pune', 'VJTI Mumbai', 'SPIT Mumbai', 'PICT Pune',
  'Walchand College of Engineering', 'VIT Pune', 'PCCOE Pune',
  'DJSCE Mumbai', 'TSEC Mumbai', 'VIIT Pune',
  '+100 Other Colleges Across Maharashtra',
];

const TOPICS = [
  'MHT-CET CAP Rounds', 'Spot Rounds', 'Institute Level Rounds',
  'College Selection', 'Branch Selection', 'Internships', 'Career Planning',
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildWhatsAppUrl(text) {
  if (!text) return 'https://wa.me/919579040183';
  return `https://wa.me/919579040183?text=${encodeURIComponent(text)}`;
}

// ─── Flip Card ─────────────────────────────────────────────────────────────────

function FlipCard({ card, index }) {
  const [flipped, setFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device once on mount
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  const isCenter = card.colorTheme === 'center';
  const isPremium = card.colorTheme === 'premium';

  // Card height — center is visually dominant
  const cardH = isCenter ? 'h-[560px]' : 'h-[520px]';

  // Border / glow per theme
  const frontBorder = isCenter
    ? 'border-2 border-[#FF6B2B] shadow-[0_0_40px_6px_rgba(255,107,43,0.25)]'
    : isPremium
    ? 'border-2 border-[#6366f1] shadow-[0_0_20px_2px_rgba(99,102,241,0.15)]'
    : 'border border-slate-200 shadow-lg';

  const backBg = isCenter
    ? 'bg-gradient-to-br from-[#1c1200] to-[#3d2a00]'
    : isPremium
    ? 'bg-gradient-to-br from-[#1e1b4b] to-[#312e81]'
    : 'bg-[#0B0F2E]';

  const btnFront = isCenter
    ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-amber-500/30 hover:from-[#d97706] hover:to-[#f59e0b]'
    : isPremium
    ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5]'
    : 'bg-[#0B0F2E] text-white hover:bg-[#12183f]';

  const btnBack = isCenter
    ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-amber-500/40'
    : isPremium
    ? 'bg-[#6366f1] text-white'
    : 'bg-white text-[#0B0F2E]';

  const checkColor = isCenter ? 'text-[#fbbf24]' : isPremium ? 'text-[#818cf8]' : 'text-[#FF6B2B]';

  // Entry animation — center drops in from top, others fade up
  const entryVariants = {
    hidden: isCenter ? { opacity: 0, y: -32, scale: 0.96 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.7, ease: 'easeOut', delay: index * 0.1 },
    },
  };

  // Pulse animation for center card only
  const pulseVariants = {
    idle: { boxShadow: '0 0 40px 6px rgba(255,107,43,0.25)' },
    pulse: { boxShadow: '0 0 60px 14px rgba(255,107,43,0.45)' },
  };

  return (
    <motion.div
      variants={entryVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      // Center card lifts higher on the page
      className={`relative w-full ${cardH} ${isCenter ? '-mt-6' : ''}`}
      style={{ perspective: '1200px' }}
      // Desktop: flip on hover. Mobile: flip on tap only
      onHoverStart={() => { if (!isTouchDevice) setFlipped(true); }}
      onHoverEnd={() => { if (!isTouchDevice) setFlipped(false); }}
      onClick={() => setFlipped((v) => !v)}
    >
      {/* Floating badge above the card */}
      {card.badgeFloating && (
        <div
          className={`absolute -top-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg ${
            isCenter
              ? 'bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57] shadow-[#FF6B2B]/40'
              : 'bg-gradient-to-r from-[#6366f1] to-[#818cf8] shadow-indigo-500/30'
          }`}
        >
          {card.badge}
        </div>
      )}

      {/* Flip container */}
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >

        {/* ── FRONT ── */}
        <motion.div
          className={`absolute inset-0 rounded-[2.2rem] bg-white flex flex-col p-6 sm:p-8 ${frontBorder}`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          // Pulse glow on center card
          {...(isCenter && {
            animate: 'pulse',
            variants: pulseVariants,
            transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          })}
        >
          {/* Center card top accent bar — removed */}

          {/* Inline badge (non-floating) */}
          {!card.badgeFloating && (
            <span className="self-start mb-3 rounded-full bg-orange-500/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-orange-600">
              {card.badge}
            </span>
          )}

          {/* Discount */}
          <span className={`self-start rounded-full px-3 py-1 text-[10px] font-black mb-3 ${
            isCenter ? 'bg-amber-100 text-amber-700' : 'bg-orange-500/10 text-orange-600'
          }`}>
            {card.discount}
          </span>

          {/* Value callout (center only) */}
          {card.valueCallout && (
            <span className="self-start mb-2 rounded-lg bg-gradient-to-r from-[#d97706] to-[#f59e0b] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
              {card.valueCallout}
            </span>
          )}

          {/* Title */}
          <h3 className={`font-black leading-tight tracking-tight text-[#0B0F2E] ${isCenter ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
            {card.title}
          </h3>

          {/* Short description */}
          <p className="mt-3 text-base font-medium text-slate-500 leading-relaxed flex-1">
            {card.shortDesc}
          </p>

          {/* Comparison hint (center only) */}
          {card.comparisonHint && (
            <p className="mt-2 text-[11px] font-bold text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              ✦ {card.comparisonHint}
            </p>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`font-black text-[#0B0F2E] ${isCenter ? 'text-5xl' : 'text-4xl'}`}>
              ₹{card.price}
            </span>
            {card.oldPrice && (
              <span className="text-base font-bold line-through text-slate-400">₹{card.oldPrice}</span>
            )}
          </div>

          {/* CTA */}
          <a
            href={buildWhatsAppUrl(card.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-black cursor-pointer transition-all duration-200 hover:scale-[1.03] ${btnFront}`}
          >
            {card.cta}
          </a>

          {/* Flip hint */}
          <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
            {flipped ? '' : isTouchDevice ? 'Tap to see what\'s included →' : 'Hover to see what\'s included →'}
          </p>
        </motion.div>

        {/* ── BACK ── */}
        <div
          className={`absolute inset-0 rounded-[2.2rem] ${backBg} flex flex-col p-6 sm:p-8 overflow-y-auto scrollbar-none`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Back header */}
          <div className="mb-4">
            <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${isCenter ? 'text-amber-300' : isPremium ? 'text-indigo-300' : 'text-[#FF6B2B]'}`}>
              What's included
            </p>
            <h4 className="text-lg font-black text-white">{card.title}</h4>
          </div>

          {/* Features */}
          <div className="space-y-2 flex-1">
            {card.features.map((f) => (
              <div key={f} className="flex items-start gap-2.5">
                <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${checkColor}`} />
                <span className="text-sm font-medium text-white/85 leading-snug">{f}</span>
              </div>
            ))}
          </div>

          {/* Bonus */}
          {card.bonusItems?.length > 0 && (
            <div className={`mt-4 rounded-2xl p-4 border ${
              isCenter ? 'bg-amber-900/30 border-amber-700/40' : isPremium ? 'bg-indigo-900/40 border-indigo-700/40' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`h-3.5 w-3.5 ${isCenter ? 'text-amber-300' : isPremium ? 'text-indigo-300' : 'text-amber-400'}`} />
                <p className={`text-[10px] font-black uppercase tracking-wider ${isCenter ? 'text-amber-300' : isPremium ? 'text-indigo-300' : 'text-amber-300'}`}>
                  {card.bonusLabel}
                </p>
              </div>
              <div className="space-y-1.5">
                {card.bonusItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Star className={`h-3 w-3 shrink-0 fill-current ${isCenter ? 'text-amber-400' : isPremium ? 'text-indigo-400' : 'text-amber-400'}`} />
                    <span className="text-xs font-medium text-white/75">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          {card.footerNote && (
            <p className="mt-3 text-center text-xs text-white/40 italic">{card.footerNote}</p>
          )}

          {/* Back CTA */}
          <a
            href={buildWhatsAppUrl(card.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`mt-4 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-black cursor-pointer transition-all duration-200 hover:scale-[1.03] ${btnBack}`}
          >
            {card.cta}
          </a>
        </div>

      </motion.div>
    </motion.div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <motion.div
      className="mx-auto max-w-3xl text-center mb-16"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <p className="text-sm font-semibold tracking-[0.22em] uppercase text-[#FF6B2B]">
        ADMISSION PROGRAMS
      </p>
      <h2 className="mt-3 font-black text-3xl sm:text-5xl text-[#0B0F2E]">
        Get the Guidance Your Admission Deserves
      </h2>
      <p className="mt-4 text-base sm:text-lg font-normal text-slate-600 leading-relaxed">
        Your entrance exam rank is fixed. Your admission outcome isn't.
      <br />
        Get expert guidance before making the decisions that shape your next four years.
      </p>
    </motion.div>
  );
}

// ─── Trust Strip ────────────────────────────────────────────────────────────────

function TrustStrip() {
  return (
    <motion.div
      className="mx-auto max-w-5xl mt-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0B0F2E] px-8 py-10 shadow-[0_30px_80px_rgba(11,15,46,0.25)]">
        <div className="pointer-events-none absolute -left-10 top-0 h-56 w-56 rounded-full bg-[#FF6B2B]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FF6B2B] mb-2">Our Coverage</p>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-8">
            🎯 Colleges We Help Students Evaluate
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {COLLEGES.map((name, i) => (
              <span
                key={name}
                className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 ${
                  i === COLLEGES.length - 1
                    ? 'border border-[#FF6B2B]/60 bg-[#FF6B2B]/15 text-[#FFB38E]'
                    : 'border border-white/10 bg-white/8 text-white/85 hover:bg-white/15'
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Info Banner ────────────────────────────────────────────────────────────────

function InfoBanner() {
  return (
    <motion.div
      className="mx-auto max-w-4xl mt-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#FF6B2B]/25 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 shadow-[0_8px_32px_rgba(255,107,43,0.1)]">
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-[#FF6B2B] to-[#ff8a57]" />
        <div className="flex flex-wrap items-center gap-3 justify-center pl-2">
          <span className="text-sm font-black text-[#0B0F2E] flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B2B] text-white text-xs">✦</span>
            Guidance available for:
          </span>
          {TOPICS.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-[#FF6B2B]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#FF6B2B] shadow-sm"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────────

export default function AdmissionProgramsSection() {
  return (
    <section className="font-sans bg-[#f6f7fb] px-4 py-20 sm:px-6 lg:px-8 overflow-x-hidden">
      <SectionHeader />

      {/* Card grid — center card gets extra top space via -mt-6 on the card itself */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-end pb-6">
        {ADMISSION_PROGRAMS.map((card, index) => (
          <div
            key={card.id}
            className={index === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}
          >
            <FlipCard card={card} index={index} />
          </div>
        ))}
      </div>

      <TrustStrip />
      <InfoBanner />
    </section>
  );
}
