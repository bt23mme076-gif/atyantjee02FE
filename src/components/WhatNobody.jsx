import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Eye, ShieldAlert, Users, Sparkles } from 'lucide-react';

const items = [
  {
    title: 'Tier 3 CSE ≠ guaranteed placement',
    description:
      "Companies filter by college reputation first. A CS degree alone won't save you if the college has zero industry ties.",
    icon: AlertTriangle,
    accent: 'rose',
    gradient: 'from-rose-500/20 to-transparent',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    borderColor: 'hover:border-rose-500/50',
    glow: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]',
  },
  {
    title: 'Branch matters more than you think',
    description:
      '4 years of studying a subject you hate will destroy your GPA. Don\'t sacrifice branch just for a "tag".',
    icon: Eye,
    accent: 'cyan',
    gradient: 'from-cyan-500/20 to-transparent',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/50',
    glow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]',
  },
  {
    title: 'Colleges hide real placement data',
    description:
      'The "highest package" is often off-campus. Median packages are usually 3-4 LPA, not the 12 LPA they advertise.',
    icon: ShieldAlert,
    accent: 'amber',
    gradient: 'from-amber-500/20 to-transparent',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    borderColor: 'hover:border-amber-500/50',
    glow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
  },
  {
    title: 'Following friends leads to regret',
    description:
      "Your friend's ideal college might be terrible for your specific rank and career goals. Choose for yourself.",
    icon: Users,
    accent: 'purple',
    gradient: 'from-purple-500/20 to-transparent',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/50',
    glow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function WhatNobody() {
  return (
    <section
      className="relative bg-[#0B0F2E] px-4 py-12 lg:py-16 sm:px-6 lg:px-8"
      style={{ overflow: 'hidden' }}
    >
      {/* DECORATIVE FLOATING ORBS */}
      <div className="pointer-events-none absolute -top-24 left-[-80px] h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute top-40 right-[-100px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />

      {/* LIGHT GRID FOR DEPTH */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              Hidden Truths
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            What Nobody Tells You
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {' '}
              About College Decisions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400"
          >
            Little truths that quietly shape your future, but most students realise them too late.
            We expose the reality so you can choose wisely.
          </motion.p>
        </div>

        {/* CARDS GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={card}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 ${it.borderColor} ${it.glow}`}
            >
              {/* Top Accent Gradient */}
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${it.gradient}`} />

              {/* Inner Glow */}
              <div
                className={`absolute -right-20 -top-20 h-32 w-32 rounded-full bg-gradient-to-br ${it.gradient} blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50`}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* ICON */}
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${it.iconBg} ${it.iconColor} ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <it.icon className="h-6 w-6" strokeWidth={2} />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold leading-snug text-white">{it.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400 font-medium">
                    {it.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
