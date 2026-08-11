import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MessageCircle,
  Star,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  Trophy,
  Users,
} from 'lucide-react';

export default function GamifiedBentoSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 relative"
      style={{ overflow: 'hidden' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_2px,transparent_2px),linear-gradient(to_bottom,#000000_2px,transparent_2px)] opacity-[0.1] bg-[size:40px_40px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">
            <Zap className="h-4 w-4" /> The Launchpad Edge
          </div>
          <h2 className="text-3xl font-black text-[#0B0F2E] sm:text-5xl tracking-tight">
            Everything you need. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#FF6B2B]">
              In one decision system.
            </span>
          </h2>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          {/* Trust Metrics (1x1) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-[2rem] bg-[#0B0F2E] p-6 text-white flex flex-col justify-center shadow-lg relative overflow-hidden group"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full transition-all group-hover:bg-blue-500/40" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-4xl font-black text-[#FF6B2B] tracking-tighter">12k+</div>
                <div className="text-sm text-blue-200 mt-1 font-semibold">Students Guided</div>
              </div>
              <Users className="w-10 h-10 text-white/10" />
            </div>
            <div className="relative z-10 mt-4 flex gap-4 border-t border-white/10 pt-4">
              <div>
                <div className="text-xl font-bold text-white">100+</div>
                <div className="text-[10px] uppercase text-slate-400 font-bold">Colleges</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">4.9</div>
                <div className="text-[10px] uppercase text-slate-400 font-bold">Rating</div>
              </div>
            </div>
          </motion.div>

          {/* How It Works (2x2) */}
          <motion.div className="col-span-1 md:col-span-2 row-span-2 rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm flex flex-col relative overflow-hidden">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              How Launchpad Works
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-6">
              Three steps to a better decision.
            </h3>

            <div className="flex flex-col gap-5 flex-1 justify-center">
              <div className="flex items-center gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100 flex items-center justify-center font-black text-lg">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Share Details</div>
                  <div className="text-sm text-slate-500">Tell us your rank + target colleges.</div>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100 flex items-center justify-center font-black text-lg">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Get Matched</div>
                  <div className="text-sm text-slate-500">
                    Get matched with a verified mentor from that exact college.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] shadow-sm border border-[#FF6B2B]/20 flex items-center justify-center font-black text-lg">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Book Session</div>
                  <div className="text-sm text-slate-500">
                    Book a session. Fill your choices right.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Community (1x2) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="col-span-1 row-span-2 rounded-[2rem] bg-gradient-to-br from-[#1A1B3A] to-[#241E54] p-8 text-white flex flex-col shadow-lg relative overflow-hidden"
          >
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/20 blur-3xl rounded-full" />
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-white/10 items-center justify-center mb-6 border border-white/10 backdrop-blur-sm">
                <MessageCircle className="w-6 h-6 text-[#FFC900]" />
              </div>
              <h3 className="text-2xl font-black leading-tight mb-3">Free Community</h3>
              <p className="text-sm text-slate-300 leading-relaxed flex-1">
                Join 12,000+ students. Get college updates, cutoff alerts, and real senior Q&A.
              </p>

              <div className="mt-6 space-y-2 mb-8">
                {['College updates', 'Cutoff alerts', 'Mistakes to avoid'].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B2B]" /> {t}
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/919579040183"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57] text-white text-sm font-bold py-3.5 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-[#FF6B2B]/30 flex justify-center items-center gap-2"
              >
                Join Free Group <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Data Driven Compare (2x1) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="col-span-1 md:col-span-2 row-span-1 rounded-[2rem] bg-[#0F172A] p-8 text-white flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden relative shadow-xl group cursor-pointer border border-slate-800"
          >
            <div className="absolute right-0 top-0 h-full w-2/3 bg-blue-500/10 transform -skew-x-12 translate-x-20 group-hover:translate-x-16 transition-transform duration-500" />

            <div className="relative z-10 flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                <TrendingUp className="w-3 h-3" /> Compare Outcomes
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">Data-Driven Choice</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Stop guessing. See the exact placement differences before you commit 4 years to the
                wrong path.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-center w-full sm:w-auto mt-6 sm:mt-0">
              {/* Left Card: Safe choice */}
              <div className="bg-slate-800/80 backdrop-blur-md px-5 py-4 rounded-2xl border border-slate-700 text-center flex-1 sm:w-36 shadow-lg transform sm:translate-x-4">
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">
                  Tier 2 Mech
                </div>
                <div className="text-xl font-black text-white">
                  3.5<span className="text-xs text-slate-500 ml-0.5">LPA</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-3 text-[9px] text-yellow-400 font-bold bg-yellow-400/10 rounded-full py-1">
                  <AlertTriangle className="w-3 h-3" /> Avg Growth
                </div>
              </div>

              {/* VS Badge */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-xs font-black shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20 border-2 border-[#0F172A]">
                VS
              </div>

              {/* Right Card: High Risk choice */}
              <div className="bg-[#1A1110] px-6 py-5 rounded-2xl border border-red-500/30 shadow-2xl scale-110 z-10 text-center flex-1 sm:w-40 relative transform sm:-translate-x-2">
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border border-white" />
                <div className="text-[10px] uppercase font-black text-slate-400 mb-1">
                  Tier 3 CSE
                </div>
                <div className="text-2xl font-black text-[#FFB38E]">
                  2.8<span className="text-xs text-red-400/50 ml-0.5">LPA</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-red-400 font-bold bg-red-500/10 rounded-full py-1 px-2">
                  <AlertTriangle className="w-3 h-3" /> High Regret
                </div>
              </div>
            </div>
          </motion.div>

          {/* Parent Confidence (1x1) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-[2rem] bg-[#FFF9F5] border border-orange-100 p-8 flex flex-col justify-center relative overflow-hidden"
          >
            <ShieldCheck className="w-10 h-10 text-[#FF6B2B] mb-4" />
            <div className="font-black text-[#0B0F2E] text-xl mb-2">Parent Confidence</div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              100% honest, data-backed guidance. No sugar-coating.
            </p>
          </motion.div>

          {/* Success Story (1x1) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-1 row-span-1 rounded-[2rem] bg-white border border-slate-200 p-8 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex gap-1 text-[#FFC900] mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-base font-bold text-slate-800 leading-snug">
                "Saved me from taking a wrong private college."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex justify-center items-center overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
                  alt="Rohan"
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Rohan</div>
                <div className="text-[10px] font-bold text-slate-400">Pune</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
