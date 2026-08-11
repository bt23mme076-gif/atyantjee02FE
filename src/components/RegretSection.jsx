import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Imported the router hook
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Building2,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Quote,
} from 'lucide-react';

const regretStories = [
  {
    title: 'Took wrong branch due to pressure',
    description:
      'Parents pushed me into ECE at a tier 2 college. After 2 years, I realized I love coding.',
    icon: BookOpen,
    accent: 'rose',
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
    iconBg: 'bg-rose-100/80',
    iconColor: 'text-rose-600',
    glow: 'shadow-[0_20px_40px_-15px_rgba(225,29,72,0.15)]',
    borderColor: 'border-rose-200',
  },
  {
    title: 'Choose college blindly after rank',
    description: 'Got rank 45k, chose XYZ college just because it was in the merit list.',
    icon: Building2,
    accent: 'amber',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    glow: 'shadow-[0_20px_40px_-15px_rgba(217,119,6,0.15)]',
    borderColor: 'border-amber-200',
  },
  {
    title: 'Followed friends instead of data',
    description: 'All my friends picked Delhi colleges, so I did too instead of choosing wisely.',
    icon: Users,
    accent: 'indigo',
    gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
    iconBg: 'bg-indigo-100/80',
    iconColor: 'text-indigo-600',
    glow: 'shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)]',
    borderColor: 'border-indigo-200',
  },
  {
    title: 'Skipped senior advice & wasted time',
    description: 'Ignored seniors who warned me about the branch and college combo.',
    icon: Clock,
    accent: 'emerald',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-100/80',
    iconColor: 'text-emerald-600',
    glow: 'shadow-[0_20px_40px_-15px_rgba(5,150,105,0.15)]',
    borderColor: 'border-emerald-200',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

// ─── INTERACTIVE CARD COMPONENT ─────────────────────────────────────────────
function InteractiveCard({ story, idx }) {
  const ref = useRef(null);

  // Mouse position values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the tilt animation
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={itemVariants}
      style={{ perspective: 1000 }}
      className="group relative h-full w-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative h-full overflow-hidden rounded-[2rem] bg-white p-6 border border-slate-100 shadow-sm transition-shadow duration-300 group-hover:${story.glow} group-hover:${story.borderColor}`}
      >
        {/* Dynamic Gradient Top Edge */}
        <div
          className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${story.gradient} opacity-50`}
        />

        {/* Corner Glow Background */}
        <div
          className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${story.gradient} blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0`}
        />

        {/* 3D Content Container */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="relative z-10 flex flex-col h-full"
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${story.iconBg} ${story.iconColor} ring-4 ring-white shadow-sm`}
            >
              <story.icon className="h-6 w-6" strokeWidth={2} />
            </div>

            {/* Subtle Big Number */}
            <div className="text-[48px] font-black leading-none text-slate-50 transition-colors duration-500 group-hover:text-slate-100/50">
              0{idx + 1}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-3 leading-snug">
              {story.title}
            </h3>

            <div className="relative">
              <Quote className="absolute -left-2 -top-2 h-6 w-6 text-slate-100 -z-10 rotate-180" />
              <p className="text-sm leading-relaxed text-slate-600 font-medium">
                "{story.description}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RegretSection() {
  const navigate = useNavigate(); // 2. Initialized the hook at the top of the component

  return (
    <section
      className="relative bg-slate-50 px-4 py-12 lg:py-16 sm:px-6 lg:px-8"
      style={{ overflow: 'hidden' }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_2px,transparent_2px),linear-gradient(to_bottom,#000000_2px,transparent_2px)] opacity-[0.05] bg-[size:40px_40px]" />

      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-200/20 blur-[100px]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-7xl"
      >
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200/50 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B2B] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B2B]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
              Real Stories
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Students Like You <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FF6B2B] to-rose-500 bg-clip-text text-transparent">
              Made These Mistakes
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600"
          >
            But they don&apos;t have to be yours. Learn from students who&apos;ve already navigated
            the confusion.
          </motion.p>
        </div>

        {/* STORY CARDS */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {regretStories.map((story, idx) => (
            <InteractiveCard key={idx} story={story} idx={idx} />
          ))}
        </div>

        {/* BOTTOM CTA BANNER */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="mt-10 relative overflow-hidden rounded-[2rem] bg-dark px-6 py-8 shadow-2xl transition-transform duration-300 sm:px-10 sm:py-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#FF6B2B]/20 opacity-50" />
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#FF6B2B]/30 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h4 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Skip this, and you risk the same regret.
              </h4>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-300 md:justify-start">
                <Sparkles className="h-4 w-4 text-[#FF6B2B]" />
                Join 12,000+ students who got it right the first time
              </p>
            </div>

            {/* 3. Added the inline onClick handler here */}
            <button
              onClick={() => navigate('/programs')}
              className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#FF6B2B] px-6 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-[#ff7b48] hover:shadow-[0_0_20px_rgba(255,107,43,0.4)]"
            >
              Get Expert Guidance
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
