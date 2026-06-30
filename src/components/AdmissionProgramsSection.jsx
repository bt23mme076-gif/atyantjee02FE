import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentModal, PLAN_ID_MAP } from './PricingCard';
import { pricingPlans, admissionPrograms } from '../data/siteContent';
import { getWhatsAppLink } from '../utils/whatsapp';
import { MessageCircle, ArrowRight } from "lucide-react";

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

const THEME_MAP = {
  green: 'green',
  orange: 'default',
  'navy-glow': 'center',
  purple: 'premium',
};

function buildWhatsAppUrl(text) {
  if (!text) return getWhatsAppLink();
  return `https://wa.me/919579040183?text=${encodeURIComponent(text)}`;
}

function pricingPlanToFlipCard(plan) {
  return {
    id: plan.title.toLowerCase().replace(/\s+/g, '-'),
    title: plan.title,
    badge: plan.badge,
    badgeFloating: !!plan.badge,
    discount: plan.discount,
    discountLabel: plan.discountLabel,
    price: plan.price,
    oldPrice: plan.originalPrice,
    shortDesc: plan.bestFor,
    valueCallout: plan.valueCallout || (plan.colorTheme === 'navy-glow' ? '🏆 Best Choice' : undefined),
    comparisonHint: plan.colorTheme === 'navy-glow' ? 'Most chosen by students & parents' : undefined,
    features: plan.features,
    bonusLabel: plan.bonusLabel?.replace(/^🎁\s*/, '') || 'Bonus Guides',
    bonusItems: plan.bonus || [],
    cta: plan.cta,
    footerNote: plan.bottomText,
    colorTheme: THEME_MAP[plan.colorTheme] || 'default',
    isPaymentPlan: true,
    planTitle: plan.title,
  };
}

const counsellingFlipCards = pricingPlans.map(pricingPlanToFlipCard);

// ─── Flip Card ────────────────────────────────────────────────────────────────

function FlipCard({ card, index }) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  useEffect(() => {
    if (!card.isPaymentPlan || !card.planTitle) return;
    const planId = PLAN_ID_MAP[card.planTitle];
    if (!planId) return;
    const pending = localStorage.getItem('atyant_pending_booking');
    if (!pending) return;
    try {
      const { bundleId } = JSON.parse(pending);
      if (bundleId === planId && localStorage.getItem('user_token')) {
        setShowPayment(true);
        localStorage.removeItem('atyant_pending_booking');
      }
    } catch {
      /* ignore */
    }
  }, [card.isPaymentPlan, card.planTitle]);

  const isCenter = card.colorTheme === 'center';
  const isPremium = card.colorTheme === 'premium';
  const isGreen = card.colorTheme === 'green';

  const cardH = (isCenter || isPremium) ? 'h-[560px]' : 'h-[520px]';

const frontBorder = isCenter
  ? 'border-2 border-black shadow-[0_0_40px_6px_rgba(255,107,43,0.25)]'
  : isPremium
    ? 'border-2 border-black shadow-[0_0_40px_6px_rgba(99,102,241,0.3)]'
    : isGreen
      ? 'border-[1.5px] border-black shadow-[0_15px_50px_rgba(16,185,129,0.08)]'
      : 'border-[1.5px] border-black shadow-lg';

  const backBg = isCenter
    ? 'bg-gradient-to-br from-[#1c1200] to-[#3d2a00]'
    : isPremium
      ? 'bg-gradient-to-br from-[#1e1b4b] to-[#312e81]'
      : isGreen
        ? 'bg-gradient-to-br from-[#052e16] to-[#064e3b]'
        : 'bg-[#0B0F2E]';

  const btnFront = isCenter
    ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-amber-500/30 hover:from-[#d97706] hover:to-[#f59e0b]'
    : isPremium
      ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5]'
      : isGreen
        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
        : 'bg-[#0B0F2E] text-white hover:bg-[#12183f]';

  const btnBack = isCenter
    ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-amber-500/40'
    : isPremium
      ? 'bg-[#6366f1] text-white'
      : isGreen
        ? 'bg-emerald-500 text-white'
        : 'bg-white text-[#0B0F2E]';

  const checkColor = isCenter
    ? 'text-[#fbbf24]'
    : isPremium
      ? 'text-[#818cf8]'
      : isGreen
        ? 'text-emerald-400'
        : 'text-[#FF6B2B]';

  const entryVariants = {
    hidden: isCenter ? { opacity: 0, y: -32, scale: 0.96 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut', delay: index * 0.1 },
    },
  };

  const pulseVariants = {
    idle: { boxShadow: '0 0 40px 6px rgba(255,107,43,0.25)' },
    pulse: { boxShadow: '0 0 60px 14px rgba(255,107,43,0.45)' },
  };

  const pulseVariantsPremium = {
    idle: { boxShadow: '0 0 40px 6px rgba(99,102,241,0.3)' },
    pulse: { boxShadow: '0 0 60px 14px rgba(99,102,241,0.5)' },
  };

  function handleCTA(e) {
    e.stopPropagation();

    if (card.isPaymentPlan && card.planTitle) {
      const planId = PLAN_ID_MAP[card.planTitle];
      if (!planId) {
        window.open(getWhatsAppLink(card.planTitle), '_blank');
        return;
      }
      const token = localStorage.getItem('user_token');
      if (!token) {
        localStorage.setItem('atyant_pending_booking', JSON.stringify({ bundleId: planId }));
        navigate('/login', { state: { message: 'Please sign up or log in as a Student to buy this mentorship plan.' } });
        return;
      }
      setShowPayment(true);
      return;
    }

    window.open(buildWhatsAppUrl(card.whatsappText), '_blank');
  }

  return (
    <>
      <motion.div
        variants={entryVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className={`relative w-full ${cardH} ${isCenter ? '-mt-6' : ''}`}
        style={{ perspective: '1200px' }}
        onHoverStart={() => { if (!isTouchDevice) setFlipped(true); }}
        onHoverEnd={() => { if (!isTouchDevice) setFlipped(false); }}
        onClick={() => setFlipped((v) => !v)}
      >
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

        <motion.div
          className="relative h-full w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT */}
          <motion.div
            className={`absolute inset-0 flex flex-col rounded-[2.2rem] bg-white p-6 sm:p-8 ${frontBorder}`}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            {...(isCenter && {
              animate: 'pulse',
              variants: pulseVariants,
              transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            })}
            {...(isPremium && {
              animate: 'pulse',
              variants: pulseVariantsPremium,
              transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            })}
          >
            {!card.badgeFloating && card.badge && (
              <span className="mb-3 self-start rounded-full bg-orange-500/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-orange-600">
                {card.badge}
              </span>
            )}

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`self-start rounded-full px-3 py-1 text-[10px] font-black ${
                isCenter ? 'bg-amber-100 text-amber-700' : isGreen ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-500/10 text-orange-600'
              }`}>
                {card.discount}
              </span>
              {card.discountLabel && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  • {card.discountLabel}
                </span>
              )}
            </div>

            {card.valueCallout && (
              <span className="mb-2 self-start rounded-lg bg-gradient-to-r from-[#d97706] to-[#f59e0b] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                {card.valueCallout}
              </span>
            )}

            <h3 className={`font-black leading-tight tracking-tight text-[#0B0F2E] ${isCenter ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
              {card.title}
            </h3>

            {card.subtitle && (
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">{card.subtitle}</p>
            )}

          <div className="mt-3 flex-1">
            <p className="text-base font-medium leading-relaxed text-slate-500">
              {card.shortDesc}
            </p>

            {!flipped && isTouchDevice && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(true);
                }}
                className="mt-2 text-sm font-semibold text-[#FF6B2B] underline underline-offset-4 hover:text-[#ff7b48]"
              >
                Read more...
              </button>
            )}
          </div>

            {card.comparisonHint && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700">
                ✦ {card.comparisonHint}
              </p>
            )}

            <div className="mt-4 flex items-baseline gap-2">
              <span className={`font-black text-[#0B0F2E] ${isCenter ? 'text-5xl' : 'text-4xl'}`}>
                ₹{card.price}
              </span>
              {card.oldPrice && (
                <span className="text-base font-bold line-through text-slate-400">₹{card.oldPrice}</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCTA}
              className={`mt-5 inline-flex w-full cursor-pointer items-center justify-center rounded-full px-5 py-3.5 text-sm font-black transition-all duration-200 hover:scale-[1.03] ${btnFront}`}
            >
              {card.cta}
            </button>
          </motion.div>

          {/* BACK */}
          <div
            className={`absolute inset-0 flex flex-col overflow-y-auto rounded-[2.2rem] p-6 sm:p-8 scrollbar-none ${backBg}`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="mb-4">
              <p className={`mb-1 text-xs font-black uppercase tracking-[0.2em] ${
                isCenter ? 'text-amber-300' : isPremium ? 'text-indigo-300' : isGreen ? 'text-emerald-300' : 'text-[#FF6B2B]'
              }`}>
                What&apos;s included
              </p>
              <h4 className="text-lg font-black text-white">{card.title}</h4>
            </div>

            <div className="flex-1 space-y-2">
              {card.features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} />
                  <span className="text-sm font-medium leading-snug text-white/85">{f}</span>
                </div>
              ))}
            </div>

            {card.bonusItems?.length > 0 && (
              <div className={`mt-4 rounded-2xl border p-4 ${
                isCenter
                  ? 'border-amber-700/40 bg-amber-900/30'
                  : isPremium
                    ? 'border-indigo-700/40 bg-indigo-900/40'
                    : isGreen
                      ? 'border-emerald-700/40 bg-emerald-900/30'
                      : 'border-white/10 bg-white/5'
              }`}>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className={`h-3.5 w-3.5 ${
                    isCenter ? 'text-amber-300' : isPremium ? 'text-indigo-300' : isGreen ? 'text-emerald-300' : 'text-amber-400'
                  }`} />
                  <p className={`text-[10px] font-black uppercase tracking-wider ${
                    isCenter ? 'text-amber-300' : isPremium ? 'text-indigo-300' : isGreen ? 'text-emerald-300' : 'text-amber-300'
                  }`}>
                    {card.bonusLabel}
                  </p>
                </div>
                <div className="space-y-1.5">
                  {card.bonusItems.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Star className={`h-3 w-3 shrink-0 fill-current ${
                        isCenter ? 'text-amber-400' : isPremium ? 'text-indigo-400' : isGreen ? 'text-emerald-400' : 'text-amber-400'
                      }`} />
                      <span className="text-xs font-medium text-white/75">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card.footerNote && (
              <p className="mt-3 text-center text-xs italic text-white/40">{card.footerNote}</p>
            )}

            <button
              type="button"
              onClick={handleCTA}
              className={`mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-full px-5 py-3.5 text-sm font-black transition-all duration-200 hover:scale-[1.03] ${btnBack}`}
            >
              {card.cta}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {showPayment && card.isPaymentPlan && (
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          planTitle={card.planTitle}
          planPrice={card.price}
          mentorId={null}
          onSuccessRedirectUrl={getWhatsAppLink(card.planTitle)}
        />
      )}
    </>
  );
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function TrustStrip() {
  return (
    <motion.div
      className="mx-auto mt-20 max-w-5xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0B0F2E] px-8 py-10 shadow-[0_30px_80px_rgba(11,15,46,0.25)]">
        <div className="pointer-events-none absolute -left-10 top-0 h-56 w-56 rounded-full bg-[#FF6B2B]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#FF6B2B]">Our Coverage</p>
          <h3 className="mb-8 text-xl font-black text-white sm:text-2xl">
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

function InfoBanner() {
  return (
    <motion.div
      className="mx-auto mt-6 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#FF6B2B]/25 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 shadow-[0_8px_32px_rgba(255,107,43,0.1)]">
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-[#FF6B2B] to-[#ff8a57]" />
        <div className="flex flex-wrap items-center justify-center gap-3 pl-2">
          <span className="flex items-center gap-2 text-sm font-black text-[#0B0F2E]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B2B] text-xs text-white">✦</span>
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

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdmissionProgramsSection({ user }) {
  return (
    <section id="programs" className="relative overflow-x-hidden bg-[#f6f7fb] px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-gradient-to-b from-blue-500/10 to-transparent blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* JEE Counselling Plans */}
        <motion.div
          id="josaa"
          className="mx-auto mb-12 max-w-3xl text-center scroll-mt-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-5 inline-flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-5 shadow-sm"
          >
            <div className="flex items-center justify-center rounded-full bg-[#0B0F2E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              <span className="mr-1.5 animate-pulse">🔥</span> Early Bird
            </div>
            <span className="text-xs font-bold text-slate-700">Join now for personalized college matching</span>
          </motion.div>

          <div className="mb-5 flex justify-center">
            <span className="rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg">
             CSAB Counselling Plans
            </span>
          </div>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0B0F2E] sm:text-5xl lg:text-6xl">
            Pick the Clarity <br className="hidden sm:block" />
            You Actually Need.
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 items-end gap-8 pb-6 sm:grid-cols-2">
          {counsellingFlipCards.map((card, index) => (
            <FlipCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {user?.plan && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                window.open(
                  'https://wa.me/919579040183?text=Hi%2C%20I%20have%20already%20purchased%20a%20plan%20and%20would%20like%20to%20upgrade.%20Please%20guide%20me.',
                  '_blank',
                )
              }
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        {/* MHT-CET Admission Programs */}
        <div id="mhtcet" className="mt-24 scroll-mt-24 border-t border-slate-200/80 pt-20">
          <motion.div
            className="mx-auto mb-16 max-w-3xl text-center"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-80px' }}
          >
          <div className="mb-5 flex justify-center">
            <span className="rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg">
              MHT-CET Counselling Plans
            </span>
          </div>
            <h2 className="mt-3 text-3xl font-black text-[#0B0F2E] sm:text-5xl">
              Get the Guidance Your Admission Deserves
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-8 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {admissionPrograms.map((card, index) => (
              <div key={card.id} className={index === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <FlipCard card={card} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────── Other Counselling Section ─────────────── */}
        <motion.div
          className="mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div id="othercounselling" className="relative overflow-hidden rounded-[2.5rem] border border-emerald-200/60 bg-white/90 p-10 shadow-[0_35px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl">

            {/* Background Glow */}
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#FF6B2B]/10 blur-3xl" />

            <div className="relative z-10">

              {/* Badge */}
              <div className="mb-6 flex justify-center">
                <span className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg">
                  OTHER COUNSELLING
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-center text-3xl font-black text-[#0B0F2E] sm:text-5xl">
                Need Guidance
                <br />
                Beyond These Plans?
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-center text-base sm:text-lg leading-relaxed text-slate-600">
                We guide students for
                <span>
                  {" "}any college, any state,
                  private universities,
                  spot rounds, and more.
                </span>
              </p>

              {/* Pills */}

              <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">

                {[
                  "Private Colleges",
                  "Spot Round",
                  "College Selection",
                  "Career Advice Plan"
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs sm:text-sm font-semibold text-center text-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-100"
                  >
                    {item}
                  </span>
                ))}

              </div>

              {/* CTA */}

              <div className="mt-12 flex justify-center">

                <motion.a
                  href="https://wa.me/919753324876"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="group relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-6 py-4 text-white shadow-[0_20px_60px_rgba(16,185,129,0.35)] transition-all duration-300"
                >

                  <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex items-center justify-between gap-4">

                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <MessageCircle size={34} />
                    </motion.div>

                    <div className="flex-1 text-left">

                      <div className="text-xl font-black">
                        Chat on WhatsApp
                      </div>

                      <div className="mt-1 text-sm text-white/90">
                        Replies within a few minutes
                      </div>

                    </div>

                    <ArrowRight
                      size={24}
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    />

                  </div>

                </motion.a>

              </div>

              {/* Footer */}

              <p className="mt-6 text-center text-sm text-slate-500">
                💬 Get one-to-one guidance from experienced mentors for admissions not listed above.
              </p>

            </div>

          </div>
        </motion.div>
      </div>
        <TrustStrip />
        <InfoBanner />
        <div className="mt-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">🔥 Limited Time Early Launch Offer</p>
          <p className="mt-2 text-base font-semibold text-slate-600">Trusted Seniors. Real Insights. Better Decisions.</p>
        </div>
    </section>
  );
}

