import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ParticleClusterBackground from '../components/ParticleClusterBackground';
import RegretSection from '../components/RegretSection';
import WhatNobody from '../components/WhatNobody';
import DecisionEngine from '../components/DecisionEngine';
import AdmissionProgramsSection from '../components/AdmissionProgramsSection';
import ComparisonSection from '../components/ComparisonSection';
import AtyantFramework from '../components/AtyantFramework';
import GamifiedBentoSection from '../components/GamifiedBentoSection';
import PricingCard from '../components/PricingCard';
import TestimonialCard from '../components/TestimonialCard';
import FAQItem from '../components/FAQItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  faqCategories,
  freeGroupBullets,
  howItWorksSteps,
  pillars,
  pricingPlans,
  testimonials,
} from '../data/siteContent';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

// ─── SECTION 3: How Atyant Solves It — Redesigned ─────────────────
function HowItWorksSection() {
  return (
    <motion.section
      id="how-it-works"
      className="relative bg-[#F8FAFC] px-4 py-24 sm:px-6 lg:px-8"
      style={{ overflow: 'hidden' }}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[radial-gradient(#0B0F2E_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HOW IT WORKS */}
        <div className="max-w-2xl">

          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">
            How Launchpad Works
          </div>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B0F2E] sm:text-5xl">
            Three steps to a
            <br />
            better decision.
          </h2>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {howItWorksSteps.map((item) => (
            <motion.div
              key={item.step}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
              className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-[#0B0F2E]/10
                bg-white/80
                p-8
                shadow-[0_20px_60px_rgba(11,15,46,0.08)]
                backdrop-blur-xl
              "
            >

              {/* Glow */}
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-200/40 blur-2xl" />

              <div className="relative z-10">

                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-[#ff955f] text-lg font-black text-white shadow-xl shadow-[#FF6B2B]/30">
                  {item.step}
                </div>

                <h3 className="mt-6 text-2xl font-black text-[#0B0F2E]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

        {/* WHY ATYANT WINS */}
        <div className="relative mt-24 overflow-hidden rounded-[2.5rem] bg-[#0B0F2E] px-8 py-14 shadow-[0_40px_120px_rgba(11,15,46,0.3)]">

          {/* Floating Orbs */}
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10">

            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFB38E]">
              Why Atyant Launchpad Wins
            </div>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Built for clarity.
              <br />
              Designed for real outcomes.
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <motion.div
                    key={pillar.title}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                    }}
                    className="
                      rounded-[1.8rem]
                      border
                      border-white/10
                      bg-white/5
                      p-7
                      backdrop-blur-xl
                    "
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B2B]/15 text-[#FFB38E]">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-white">
                      {pillar.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {pillar.description}
                    </p>

                  </motion.div>
                );
              })}

            </div>

          </div>

        </div>

        {/* COMMUNITY + PARENTS */}
        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {/* COMMUNITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              bg-gradient-to-br
              from-[#1A1B3A]
              to-[#241E54]
              px-8
              py-10
              shadow-[0_30px_90px_rgba(36,30,84,0.35)]
            "
          >

            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative z-10">

              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFC900]">
                Free Community
              </div>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Join 12,000+ Students
                <br />
                In Our Community
              </h2>

              <p className="mt-4 text-base leading-7 text-white/80">
                Get college updates, cutoff alerts, mistakes to avoid,
                and real senior Q&A — all in our exclusive group.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {freeGroupBullets.map((bullet) => (
                  <motion.div
                    key={bullet}
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3"
                  >

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B2B] text-sm font-bold text-white">
                      ✓
                    </div>

                    <div className="text-sm text-white">
                      {bullet}
                    </div>

                  </motion.div>
                ))}

              </div>

              <div className="mt-8 flex justify-center">

                <a
                  href="https://chat.whatsapp.com/EnpaX25ybPU07nC3mDe0Z5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-gradient-to-br
                    from-[#FF6B2B]
                    to-[#ff8a57]
                    px-7
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-2xl
                    transition
                    hover:scale-[1.04]
                  "
                >
                  Join Free Group
                </a>

              </div>

            </div>

          </motion.div>

          {/* PARENTS TRUST */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-orange-100
              bg-[#FFF9F5]
              p-8
              shadow-[0_20px_80px_rgba(255,107,43,0.08)]
            "
          >

            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />

            <div className="relative z-10">

              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">
                Parent Confidence
              </div>

              <h3 className="mt-3 text-4xl font-black text-[#0B0F2E]">
                🛡️ Why Parents
                <br />
                Trust Atyant
              </h3>

              <p className="mt-4 text-base font-medium text-slate-600">
                Practical, evidence-backed guidance that parents can rely on.
              </p>

              <div className="mt-10 space-y-7">

                {[
                  {
                    title: '100% Honest Feedback',
                    text: 'No sugar-coating. Real insights from real seniors.',
                  },
                  {
                    title: 'Data-Backed Placement Truth',
                    text: 'College outcomes verified from 100+ colleges.',
                  },
                  {
                    title: 'Personalized For Your Kid',
                    text: 'Not generic advice. Your situation matters.',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ x: 6 }}
                    className="flex items-start gap-4"
                  >

                    <div className="mt-1 h-3 w-3 rounded-full bg-[#FF6B2B]" />

                    <div>

                      <p className="text-lg font-bold text-[#0B0F2E]">
                        {item.title}
                      </p>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {item.text}
                      </p>

                    </div>

                  </motion.div>
                ))}

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </motion.section>
  );
}

// ─── SECTION 4: Social Proof — real stories, real numbers ────────────────────
function StoriesSection() {
  return (
    <motion.section
      id="stories"
      className="bg-white px-4 py-20 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">Success Stories</div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B0F2E] sm:text-4xl">Students who found clarity.</h2>
        </div>
        <div className="mt-10">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name} className="h-auto">
                <TestimonialCard {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
}

// ─── SECTION 6: Pricing — simple, clear, lowest barrier first ────────────────
function PricingSection({ user }) {
  return (
    <motion.section
      id="pricing"
      className="bg-[#f6f7fb] px-4 py-12 sm:px-6 lg:px-8 overflow-x-hidden relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">

          {/* Stunning Integrated Early Bird Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 rounded-full bg-white border border-slate-200 px-2 py-1.5 pr-5 mb-5 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-center bg-[#0B0F2E] rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              <span className="mr-1.5 animate-pulse">🔥</span> Early Bird
            </div>
            <span className="text-xs font-bold text-slate-700">Join now for personalized college matching</span>
          </motion.div>

          <h2 className="text-4xl font-black tracking-tight text-[#0B0F2E] sm:text-5xl lg:text-6xl">
            Pick the Clarity <br className="hidden sm:block" />
            You Actually Need.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-500 max-w-xl mx-auto font-medium">
            Plans are designed to be simple and transparent. Built to help students and parents make the right decision faster, without the confusion.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-20">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
        {user?.plan && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() =>
                window.open(
                  "https://wa.me/919579040183?text=Hi%2C%20I%20have%20already%20purchased%20a%20plan%20and%20would%20like%20to%20upgrade.%20Please%20guide%20me.",
                  "_blank"
               )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Upgrade Plan
            </button>
          </div>
        )}
        {/* Why Choose Atyant Section */}
        <div className="mt-20 max-w-4xl mx-auto bg-[#0B0F2E] rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-[#0B0F2E]/20 border border-white/5">
          <div className="absolute right-0 top-0 w-72 h-72 bg-gradient-to-br from-orange-500/10 to-transparent blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-center mb-10 tracking-tight uppercase">
              ✨ Why Students Choose Atyant
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                'Talk to seniors with ranks like yours',
                'Real JoSAA experience from recent seniors',
                'Honest advice, not sugarcoating',
                'Affordable guidance starting at just ₹99',
                'Support from choice filling till allotment',
                'No bots. Only real seniors.',
              ].map((point) => (
                <div key={point} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-400 text-sm font-black">
                    ✓
                  </div>
                  <span className="text-sm sm:text-base font-bold text-white/90">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust line */}
        <div className="mt-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">🔥 Limited Time Early Launch Offer</p>
          <p className="mt-2 text-base font-semibold text-slate-600">Trusted Seniors. Real Insights. Better Decisions.</p>
        </div>
      </div>
    </motion.section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [openId, setOpenId] = useState('0-0');

  return (
    <motion.section
      id="faq"
      className="relative bg-[#F8FAFC] px-4 pt-10 pb-24 sm:px-6 lg:px-8"
      style={{ overflow: 'hidden' }}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_2px,transparent_2px),linear-gradient(to_bottom,#000000_2px,transparent_2px)] opacity-[0.05] bg-[size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="w-full flex flex-col items-center text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 rounded-full bg-white border border-slate-200 px-2 py-1.5 pr-5 mb-5 shadow-sm"
          >
            <div className="flex items-center justify-center bg-[#FF6B2B] rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              <span className="mr-1.5 animate-pulse">💡</span> Answers
            </div>
            <span className="text-xs font-bold text-slate-700">Clear Your Doubts</span>
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight text-[#0B0F2E] sm:text-5xl">Frequently Asked Questions.</h2>
        </div>
        <div className="mt-16 mx-auto max-w-3xl space-y-12">
          {faqCategories.map((category, catIndex) => (
            <div key={category.category}>
              <h3 className="text-xl font-bold text-[#0B0F2E] mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-[#FF6B2B] rounded-full inline-block"></span>
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

// ─── SECTION 7: Final CTA — ONE action only ───────────────────────────────────
function FinalCTA() {
  return (
    <div className="relative w-full">
      <ParticleClusterBackground particleCount={18} variant="dark" intensity="medium" />
      <section id="contact" className="relative bg-[#0B0F2E] px-4 py-20 text-white sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,43,0.16),rgba(255,255,255,0.04))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">One Wrong Decision Costs 4 Years.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
            One right decision changes everything. Get clarity on college, branch, and your future before you commit.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <a
              href="https://chat.whatsapp.com/EnpaX25ybPU07nC3mDe0Z5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#FF6B2B] px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]"
            >
              Get Clarity Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function LaunchpadPage({ activeTab, onTabChange, user }) {
  return (
    <main>
      {/* 1. Hero — speak their exact situation */}
      <Hero activeTab={activeTab} onTabChange={onTabChange} />

      {/* 2. The 3 biggest mistakes — emotional hook (fears they already have) */}
      <RegretSection />

      {/* Bridge: seen the mistakes, now name your specific confusion */}
      <DecisionEngine />

      {/* Admission Programs — three program cards with WhatsApp CTAs */}
      <AdmissionProgramsSection />

      {/* 5. Pricing — lowest barrier first, integrated early bird */}
      <PricingSection user={user} />
      <WhatNobody />

      {/* 3. The Gamified Launchpad Bento Grid (Replaces 5 long sections) */}
      <GamifiedBentoSection />

      {/* 4. Success Stories*/}
      <StoriesSection />

      
      <FAQSection />
      <FinalCTA />
    </main>
  );
}
