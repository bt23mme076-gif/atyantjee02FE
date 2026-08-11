import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

const sample = {
  a: {
    title: 'Tier 2 Mechanical',
    placement: 45,
    salary: '3.5 LPA',
    growth: 'Moderate',
    risk: 'Medium',
    highlight: true,
    accent: 'blue',
  },
  b: {
    title: 'Tier 3 CSE',
    placement: 30,
    salary: '2.8 LPA',
    growth: 'High',
    risk: 'High',
    highlight: false,
    accent: 'slate',
  },
};

const getProgressBar = (value, color) => (
  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${value}%` }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`h-full bg-${color}-500`}
    />
  </div>
);

export default function ComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-12 lg:py-16 sm:px-6 lg:px-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0B0F2E_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/40 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200/50 shadow-sm"
          >
            <BarChart3 className="h-4 w-4 text-[#FF6B2B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
              Data-Driven Choice
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Compare the Reality
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 text-base text-slate-600"
          >
            A quick side-by-side view to reduce decision friction and expose hidden truths.
          </motion.p>
        </div>

        <div className="relative mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Subtle VS Badge for Desktop */}
          <div className="absolute left-1/2 top-1/2 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-50 bg-white shadow-xl md:flex z-20">
            <span className="text-base font-black italic text-slate-400">VS</span>
          </div>

          {[sample.a, sample.b].map((opt, idx) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -6 }}
              className={`relative overflow-hidden rounded-[2rem] p-6 transition-all duration-300 ${opt.highlight ? 'border-2 border-blue-500 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] bg-white' : 'border border-slate-200 bg-white/60 backdrop-blur-sm shadow-lg'}`}
            >
              {opt.highlight && (
                <div className="absolute right-0 top-0 rounded-bl-3xl bg-blue-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  Recommended
                </div>
              )}

              <div className="mb-6 pr-12">
                <h3 className="text-xl font-black text-slate-900">{opt.title}</h3>
                <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                  Snapshot of real outcomes to help compare choices quickly.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-slate-700">
                      <TrendingUp className="h-4 w-4 text-slate-400" /> Placement Rate
                    </span>
                    <span className="font-bold text-slate-900">{opt.placement}%</span>
                  </div>
                  {getProgressBar(opt.placement, opt.highlight ? 'blue' : 'slate')}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Avg Salary
                    </span>
                    <div className="mt-0.5 text-base font-black text-slate-900">{opt.salary}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Growth
                    </span>
                    <div className="mt-0.5 text-base font-black text-slate-900">{opt.growth}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-3">
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                      Risk Level
                    </span>
                    <div className="text-xs font-bold text-rose-900">{opt.risk} Risk of Regret</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                  Read full analysis
                </button>
                <button
                  className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white transition-all ${opt.highlight ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30' : 'bg-slate-900 hover:bg-slate-800'}`}
                >
                  Select Path{' '}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
