import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  return (
    <div className="relative bg-[#0B0F2E] text-white" style={{ overflow: 'hidden' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,43,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(63,94,251,0.15),_transparent_30%)]" />

      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FF6B2B]/20 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Exam Pills */}
            <div className="mb-6 flex flex-wrap gap-2.5">
              {['JEE Main', 'JEE Advanced', 'BITSAT', 'MHT-CET', 'CSAB'].map((exam) => (
                <span
                  key={exam}
                  className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/80"
                >
                  {exam}
                </span>
              ))}
            </div>

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#FF6B2B]" />
              Decision Clarity Platform
            </div>

            {/* Heading */}
            <h1 className="max-w-2xl text-4xl font-black leading-none sm:text-5xl lg:text-6.5xl uppercase tracking-tight">
              RIGHT GUIDANCE TODAY. <br />
              <span className="italic text-[#FF6B2B] mt-2 block lowercase first-letter:uppercase">
                better college. better future.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 lg:text-lg font-medium">
              Talk to real IIT/NIT & top college seniors who recently went through JoSAA counselling themselves.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-start gap-3 w-full max-w-sm">
              <a
                href="#pricing"
                className="w-full inline-flex items-center justify-center rounded-full border-2 border-[#FF6B2B] bg-white px-7 py-3.5 text-sm font-black text-[#FF6B2B] shadow-[0_0_28px_rgba(255,107,43,0.4)] ring-2 ring-[#FF6B2B]/20 transition duration-300 hover:bg-[#FF6B2B] hover:text-white hover:scale-[1.03]"
              >
                See counselling plans
              </a>

              <button
                onClick={() => navigate('/mentors')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B2B] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF6B2B]/30 transition duration-300 hover:bg-[#e05a1f] hover:scale-[1.03]"
              >
                Find my mentor
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE ANIMATED CARDS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative h-[520px] w-full max-w-[520px]">

              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute left-10 top-16 w-[340px] rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Career Match</p>
                    <h3 className="mt-1 text-3xl font-black text-white">92%</h3>
                  </div>
                  <div className="rounded-2xl bg-[#FF6B2B]/20 px-4 py-2 text-sm font-semibold text-[#FF6B2B]">
                    AI Powered
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-white/50">Recommended Branch</p>
                    <div className="mt-2 flex items-center justify-between">
                      <h4 className="text-lg font-bold">Computer Science</h4>
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                        Best Fit
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-white/50">Skill Readiness</p>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6B2B] to-orange-300"
                      />
                    </div>
                    <p className="mt-2 text-sm text-white/70">78% ready for placements</p>
                  </div>
                </div>
              </motion.div>

              {/* AI Card */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute right-0 top-0 w-[240px] rounded-[24px] border border-white/10 bg-[#111633]/90 p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B2B]/20 text-[#FF6B2B]">
                    ✨
                  </div>
                  <div>
                    <h4 className="font-semibold">Real Mentors</h4>
                    <p className="text-xs text-white/50">Online now</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-white/75">
                  "Based on your interests, CSE with AI specialization matches your profile best."
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-8 right-6 w-[220px] rounded-[24px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
              >
                <p className="text-sm text-white/50">Students Guided</p>
                <h3 className="mt-2 text-4xl font-black text-white">5K+</h3>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 2 }}
                      className="h-2 rounded-full bg-[#FF6B2B]"
                    />
                  </div>
                  <span className="text-xs text-white/60">85%</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-white/60">
                  Students reported better clarity after mentorship.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
