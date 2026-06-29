import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  'csab-popular': 'featured',
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
    valueCallout: ['navy-glow', 'csab-popular'].includes(plan.colorTheme) ? '🏆 Best Choice' : undefined,
    comparisonHint: ['navy-glow', 'csab-popular'].includes(plan.colorTheme) ? 'Most chosen by students & parents' : undefined,
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

// ─── Plan Card (flat, with expandable details) ────────────────────────────────

function FlipCard({ card, index }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

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
    } catch { /* ignore */ }
  }, [card.isPaymentPlan, card.planTitle]);

  const isCenter = card.colorTheme === 'center';
  const isFeatured = card.colorTheme === 'featured';
  const isPremium = card.colorTheme === 'premium';
  const isGreen = card.colorTheme === 'green';
  const isOrange = isCenter || isFeatured;

  const cardBorder = isOrange
    ? 'border-2 border-[#FF6B2B] shadow-[0_0_32px_4px_rgba(255,107,43,0.18)]'
    : isPremium
      ? 'border-2 border-[#6366f1] shadow-[0_0_20px_2px_rgba(99,102,241,0.13)]'
      : isGreen
        ? 'border border-emerald-200 shadow-[0_8px_30px_rgba(16,185,129,0.07)]'
        : 'border border-slate-200 shadow-lg';

  const btnStyle = isOrange
    ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-amber-500/30 hover:from-[#d97706] hover:to-[#f59e0b]'
    : isPremium
      ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5]'
      : isGreen
        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
        : 'bg-[#0B0F2E] text-white hover:bg-[#12183f]';

  const checkColor = isOrange
    ? 'text-[#f59e0b]'
    : isPremium ? 'text-[#818cf8]'
    : isGreen ? 'text-emerald-500'
    : 'text-[#FF6B2B]';

  const bonusBg = isOrange
    ? 'bg-amber-50 border-amber-200'
    : isPremium ? 'bg-indigo-50 border-indigo-200'
    : isGreen ? 'bg-emerald-50 border-emerald-200'
    : 'bg-slate-50 border-slate-200';

  const bonusAccent = isOrange
    ? 'text-amber-600'
    : isPremium ? 'text-indigo-600'
    : isGreen ? 'text-emerald-600'
    : 'text-[#FF6B2B]';

  const discountBg = isOrange
    ? 'bg-amber-100 text-amber-700'
    : isGreen ? 'bg-emerald-100 text-emerald-700'
    : 'bg-orange-50 text-orange-600';

  const toggleColor = isOrange
    ? 'text-amber-600 hover:text-amber-700'
    : isPremium ? 'text-indigo-500 hover:text-indigo-600'
    : 'text-[#FF6B2B] hover:text-[#e55a1f]';

  function handleCTA(e) {
    e.stopPropagation();
    if (card.isPaymentPlan && card.planTitle) {
      const planId = PLAN_ID_MAP[card.planTitle];
      if (!planId) { window.open(getWhatsAppLink(card.planTitle), '_blank'); return; }
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
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
        className={`relative w-full rounded-[2rem] bg-white p-6 sm:p-8 ${cardBorder}`}
      >
        {card.badgeFloating && (
          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg z-10 ${
            isOrange
              ? 'bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57]'
              : 'bg-gradient-to-r from-[#6366f1] to-[#818cf8]'
          }`}>
            {card.badge}
          </div>
        )}

        {/* discount row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-black ${discountBg}`}>
            {card.discount}
          </span>
          {card.discountLabel && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              • {card.discountLabel}
            </span>
          )}
        </div>

        {card.valueCallout && (
          <span className="mb-2 inline-block rounded-lg bg-gradient-to-r from-[#d97706] to-[#f59e0b] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            {card.valueCallout}
          </span>
        )}

        <h3 className={`font-black leading-tight tracking-tight text-[#0B0F2E] ${isOrange ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
          {card.title}
        </h3>

        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{card.shortDesc}</p>

        {card.comparisonHint && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700">
            ✦ {card.comparisonHint}
          </p>
        )}

        {/* price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className={`font-black text-[#0B0F2E] ${isOrange ? 'text-4xl' : 'text-3xl'}`}>
            ₹{card.price}
          </span>
          {card.oldPrice && (
            <span className="text-sm font-bold line-through text-slate-400">₹{card.oldPrice}</span>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleCTA}
          className={`mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-full px-5 py-3.5 text-sm font-black transition-all duration-200 hover:scale-[1.02] ${btnStyle}`}
        >
          {card.cta}
        </button>

        {/* See more toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-bold transition-colors ${toggleColor}`}
        >
          {open ? 'Hide details ↑' : "See what's included ↓"}
        </button>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <p className={`mb-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                  isOrange ? 'text-amber-600' : isPremium ? 'text-indigo-500' : isGreen ? 'text-emerald-600' : 'text-[#FF6B2B]'
                }`}>What's included</p>
                {card.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} />
                    <span className="text-sm font-medium leading-snug text-slate-700">{f}</span>
                  </div>
                ))}

                {card.bonusItems?.length > 0 && (
                  <div className={`mt-3 rounded-xl border p-3.5 ${bonusBg}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className={`h-3.5 w-3.5 ${bonusAccent}`} />
                      <p className={`text-[10px] font-black uppercase tracking-wider ${bonusAccent}`}>
                        {card.bonusLabel}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {card.bonusItems.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Star className={`h-3 w-3 shrink-0 fill-current ${bonusAccent}`} />
                          <span className="text-xs font-medium text-slate-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {card.footerNote && (
                  <p className="pt-1 text-center text-[10px] italic text-slate-400">{card.footerNote}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        {/* CSAB Special Rounds */}
        <div id="csab-section" />
        <motion.div
          className="mx-auto mb-12 max-w-3xl text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-5 inline-flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-5 shadow-sm"
          >
            <div className="flex items-center justify-center rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              <span className="mr-1.5 animate-pulse">🟧</span> Active Now
            </div>
            <span className="text-xs font-bold text-slate-700">CSAB Special Rounds are live — don't miss your last chance</span>
          </motion.div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">CSAB Special Rounds</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0B0F2E] sm:text-5xl lg:text-6xl">
            Don't Lose Your <br className="hidden sm:block" />
            Last Opportunity.
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 items-start gap-8 pb-6 sm:grid-cols-2">
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

        {/* All India Counselling / MHT-CET */}
        <div id="mhtcet-section" />
        <div className="mt-24 border-t border-slate-200/80 pt-20">
          <motion.div
            className="mx-auto mb-16 max-w-3xl text-center"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
              🔵 All India Counselling
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B0F2E] sm:text-5xl">
              Get the Guidance Your Admission Deserves
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              MHT-CET • COMEDK • State CETs • Govt &amp; Private Colleges
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {admissionPrograms.map((card, index) => (
              <div key={card.id} className={index === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <FlipCard card={card} index={index} />
              </div>
            ))}
          </div>

          <TrustStrip />
          <InfoBanner />
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">🔥 Limited Time Early Launch Offer</p>
          <p className="mt-2 text-base font-semibold text-slate-600">Trusted Seniors. Real Insights. Better Decisions.</p>
        </div>


        {/* ─────────────── Other Counselling Section ─────────────── */}
        <motion.div
          className="mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-200/60 bg-white/90 p-10 shadow-[0_35px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl">

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
                Looking for Counselling
                <br />
                Beyond These Plans?
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-center text-lg leading-relaxed text-slate-600">
                We also provide personalized counselling for
                <span className="font-bold text-[#0B0F2E]">
                  {" "}other colleges, universities, admissions,
                  branch selection, management quota,
                  spot rounds, private colleges and much more.
                </span>
              </p>

              {/* Pills */}

              <div className="mt-8 flex flex-wrap justify-center gap-3">

                {[
                  "Engineering",
                  "Private Colleges",
                  "Management Quota",
                  "Spot Round",
                  "College Selection",
                  "Branch Guidance",
                  "Career Advice"
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-100"
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
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-8 py-6 text-white shadow-[0_20px_60px_rgba(16,185,129,0.35)] transition-all duration-300"
                >

                  <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex items-center gap-5">

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

                    <div className="text-left">

                      <div className="text-xl font-black">
                        Chat on WhatsApp
                      </div>

                      <div className="mt-1 text-sm text-white/90">
                        Usually replies within a few minutes
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
    </section>
  );
}
