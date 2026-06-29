import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import AdmissionProgramsSection from '../components/AdmissionProgramsSection';
import FAQItem from '../components/FAQItem';
import { faqCategories } from '../data/siteContent';
import { getWhatsAppLink } from '../utils/whatsapp';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const stats = [
  { value: '5000+', label: 'Students Guided' },
  { value: '100+', label: 'Verified Mentors' },
  { value: '95%', label: 'Satisfaction' },
];

const programGuideCards = [
  {
    title: 'Quick Guidance',
    accent: 'from-emerald-500/20 to-emerald-500/5',
    border: 'hover:border-emerald-400/40',
    dot: 'bg-emerald-500',
    points: [
      'You only need counselling',
      'Small budget',
      'Want quick clarity',
    ],
  },
  {
    title: 'Complete Admission',
    accent: 'from-orange-500/20 to-orange-500/5',
    border: 'hover:border-orange-400/40',
    dot: 'bg-[#FF6B2B]',
    points: [
      'Need end-to-end support',
      'College selection',
      'Choice filling',
    ],
  },
  {
    title: 'Premium Mentorship',
    accent: 'from-purple-500/20 to-purple-500/5',
    border: 'hover:border-purple-400/40',
    dot: 'bg-purple-500',
    points: [
      'Need continuous support',
      'Career planning',
      'Long-term guidance',
    ],
  },
];

const whyChoosePoints = [
  'Talk to seniors with ranks like yours',
  'Real JoSAA experience from recent seniors',
  'Honest advice, not sugarcoating',
  'Affordable guidance starting at just ₹99',
  'Support from choice filling till allotment',
  'No bots. Only real seniors.',
];

function ProgramsHero() {
  return (
    <div className="relative overflow-hidden bg-[#0B0F2E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,43,0.28),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(63,94,251,0.12),_transparent_35%)]" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#FF6B2B]/25 blur-3xl"
      />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#FF6B2B]" />
            Counselling Programs
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Find The Perfect
            <br />
            <span className="bg-gradient-to-r from-[#FF6B2B] to-orange-300 bg-clip-text text-transparent">
              Counselling Plan
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Compare every counselling plan, understand the differences, and choose the one that best fits your college journey.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

function WhyChooseSection() {
  return (
    <motion.section
      className="px-4 py-20 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0B0F2E] p-8 text-white shadow-2xl shadow-[#0B0F2E]/20 sm:p-12">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-3xl" />
        <div className="relative z-10">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFB38E]">Why Atyant</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Why Students Choose Atyant
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {whyChoosePoints.map((point) => (
              <motion.div
                key={point}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/25 text-sm font-black text-emerald-400">
                  ✓
                </div>
                <span className="text-sm font-bold text-white/90 sm:text-base">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ProgramGuideSection() {
  return (
    <motion.section
      className="bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">Choose Wisely</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B0F2E] sm:text-5xl">
            Which Program is Right For You?
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {programGuideCards.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`group relative overflow-hidden rounded-[2rem] border border-[#0B0F2E]/10 bg-white p-8 shadow-[0_20px_60px_rgba(11,15,46,0.08)] backdrop-blur-xl ${card.border}`}
            >
              <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${card.accent} blur-2xl transition-opacity group-hover:opacity-100`} />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#0B0F2E]">{card.title}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#FF6B2B]">Perfect if</p>
                <ul className="mt-5 space-y-3">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${card.dot}`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ProgramsFAQSection() {
  const [openId, setOpenId] = useState('0-0');

  return (
    <motion.section
      id="faq"
      className="relative overflow-hidden bg-[#0B0F2E] px-4 py-20 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,107,43,0.12),_transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFB38E]">Got Questions?</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Frequently Asked Questions</h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-12">
          {faqCategories.map((category, catIndex) => (
            <div key={category.category}>
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
                <span className="inline-block h-6 w-2 rounded-full bg-[#FF6B2B]" />
                {category.category}
              </h3>
              <div className="grid gap-4">
                {category.items.map((item, itemIndex) => {
                  const id = `${catIndex}-${itemIndex}`;
                  return (
                    <FAQItem
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                      open={openId === id}
                      onToggle={() => setOpenId(openId === id ? null : id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ProgramsFinalCTA() {
  return (
    <motion.section
      className="px-4 py-20 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#FF6B2B] via-[#ff7a42] to-[#ff955f] p-10 text-center text-white shadow-[0_30px_100px_rgba(255,107,43,0.35)] sm:p-14">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Still Confused?</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
          Talk to one of our mentors before choosing a plan.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-[#FF6B2B] shadow-2xl transition hover:scale-[1.03] hover:bg-white/95"
          >
            Talk to Expert
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}

export default function ProgramsPage({ user }) {
  return (
    <main>
      <ProgramsHero />
      <AdmissionProgramsSection user={user} />
      <WhyChooseSection />
      <ProgramGuideSection />
      <ProgramsFAQSection />
      <ProgramsFinalCTA />
    </main>
  );
}
