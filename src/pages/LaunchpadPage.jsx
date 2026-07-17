import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Compass,
  Building2,
  FileText,
  Globe,
  Users,
  ShieldCheck,
  Star,
  Headphones,
  TrendingUp,
  Trophy,
  Target,
  Rocket,
  Check,
  MessageCircle,
  UserCheck,
  RefreshCw,
  HelpCircle,
  Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import TestimonialCard from '../components/TestimonialCard';
import TestimonialVideoCard from '../components/TestimonialVideoCard';
import LiveCounsellingBanner from '../components/LiveCounsellingBanner';
import CoursePricingCards from '../components/CoursePricingCards';
import FAQItem from '../components/FAQItem';

import { faqCategories, testimonials, testimonialVideos } from '../data/siteContent';

// ─── PREMIUM SVG HERO GRAPHIC ───────────────────────────────────────────────
function HeroGraphic() {
  return (
    <div className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-[#FF6B2B]/20 blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/15 blur-[80px]" />

      {/* 3D-like Glowing Grid Table */}
      <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,#FF6B2B_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,114,255,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_rotateY(0deg)_rotateZ(-45deg)]" />

      {/* SVG Container */}
      <svg
        className="relative z-10 w-[300px] h-[300px] md:w-[380px] md:h-[380px] drop-shadow-[0_0_35px_rgba(255,107,43,0.25)]"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* School Building Glow in background */}
        <g opacity="0.5">
          <path
            d="M260 120 L300 120 L300 180 L260 180 Z"
            stroke="#FF6B2B"
            strokeWidth="2"
            filter="url(#glow-orange)"
          />
          <path d="M300 140 L340 140 L340 180 L300 180 Z" stroke="#FF6B2B" strokeWidth="1.5" />
          <path d="M220 140 L260 140 L260 180 L220 180 Z" stroke="#FF6B2B" strokeWidth="1.5" />
          {/* Roof triangles */}
          <path d="M260 120 L280 90 L300 120 Z" fill="#FF6B2B" opacity="0.3" />
          <path d="M220 140 L240 120 L260 140 Z" fill="#FF6B2B" opacity="0.2" />
          <path d="M300 140 L320 120 L340 140 Z" fill="#FF6B2B" opacity="0.2" />
          {/* Flag */}
          <line x1="280" y1="90" x2="280" y2="60" stroke="#FF6B2B" strokeWidth="2" />
          <path d="M280 60 L300 70 L280 80 Z" fill="#FF6B2B" />
        </g>

        {/* Graduation Cap (Center stage) */}
        <g transform="translate(0, -10)">
          {/* Cap Base / Hanging Tassel */}
          <path
            d="M160 210 L160 240 C160 255, 240 255, 240 240 L240 210"
            stroke="#0B72FF"
            strokeWidth="4"
            fill="#0B0F2E"
            filter="url(#glow-blue)"
          />
          <path d="M160 225 C160 235, 240 235, 240 225" stroke="#0B72FF" strokeWidth="2" />

          {/* Cap Top Rhombus */}
          <polygon
            points="200,150 310,185 200,220 90,185"
            fill="#0E164D"
            stroke="#0B72FF"
            strokeWidth="3"
            filter="url(#glow-blue)"
          />
          <polygon
            points="200,155 295,185 200,215 105,185"
            fill="#141E61"
            stroke="#FF6B2B"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Tassel */}
          <path
            d="M200 185 L140 205 L135 235"
            stroke="#FF6B2B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon points="135,235 131,245 139,245" fill="#FF6B2B" />
        </g>

        {/* Compass (Bottom Right foreground) */}
        <g transform="translate(70, 70)">
          {/* Outer Dial */}
          <circle
            cx="210"
            cy="210"
            r="45"
            fill="#0B0F2E"
            stroke="#FF6B2B"
            strokeWidth="3"
            filter="url(#glow-orange)"
          />
          <circle cx="210" cy="210" r="38" stroke="#0B72FF" strokeWidth="1.5" />

          {/* Compass ticks */}
          <line x1="210" y1="168" x2="210" y2="173" stroke="#FF6B2B" strokeWidth="2" />
          <line x1="210" y1="247" x2="210" y2="252" stroke="#FF6B2B" strokeWidth="2" />
          <line x1="168" y1="210" x2="173" y2="210" stroke="#FF6B2B" strokeWidth="2" />
          <line x1="247" y1="210" x2="252" y2="210" stroke="#FF6B2B" strokeWidth="2" />

          {/* Glowing Needle */}
          <polygon points="210,180 216,210 210,213" fill="#FF6B2B" filter="url(#glow-orange)" />
          <polygon points="210,240 216,210 210,213" fill="#0B72FF" />
          <circle cx="210" cy="210" r="4" fill="#FFFFFF" />
        </g>

        {/* Floating particles */}
        <circle cx="90" cy="120" r="2" fill="#FF6B2B" filter="url(#glow-orange)" />
        <circle cx="320" cy="240" r="3" fill="#0B72FF" />
        <circle cx="120" cy="290" r="1.5" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
}

export default function LaunchpadPage({ activeTab, onTabChange, user }) {
  const navigate = useNavigate();
  const [faqOpenId, setFaqOpenId] = useState('0-0');

  // Exam pills config
  const examPills = [
    {
      label: 'JoSAA',
      icon: <GraduationCap className="h-3.5 w-3.5" />,
      active: true,
      glowClass:
        'border-[#FF6B2B] bg-[#FF6B2B]/10 text-white shadow-[0_0_15px_rgba(255,107,43,0.25)]',
    },
    {
      label: 'CSAB',
      icon: <Sparkles className="h-3.5 w-3.5" />,
      active: true,
      glowClass:
        'border-purple-500/50 bg-purple-500/10 text-white/95 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
    },
    {
      label: 'MHT-CET',
      icon: <Building2 className="h-3.5 w-3.5" />,
      active: true,
      glowClass:
        'border-emerald-500/50 bg-emerald-500/10 text-white/95 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    },
    {
      label: 'COMEDK',
      icon: <FileText className="h-3.5 w-3.5" />,
      active: false,
      labelSuffix: 'Coming Soon',
    },
    {
      label: 'State CETs',
      icon: <Globe className="h-3.5 w-3.5" />,
      active: false,
      labelSuffix: 'Coming Soon',
    },
    {
      label: 'All India',
      icon: <Building2 className="h-3.5 w-3.5" />,
      active: false,
      labelSuffix: 'Coming Soon',
    },
    {
      label: 'Govt + Private',
      icon: <Building2 className="h-3.5 w-3.5" />,
      active: false,
      labelSuffix: 'Coming Soon',
    },
  ];

  return (
    <main className="bg-[#0B0F2E] text-white min-h-screen relative font-sans overflow-x-hidden">
      {/* Background ambient mesh */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(circle_at_top,_rgba(255,107,43,0.12)_0%,_rgba(11,15,46,0)_70%)] pointer-events-none z-0" />
      <div className="absolute top-[350px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Exam Pills Row */}
        <div className="w-full border-b border-white/5 py-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-3 min-w-max pb-1">
            {examPills.map((pill, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  pill.active
                    ? pill.glowClass
                    : 'border-white/5 bg-white/2 text-white/40 cursor-default'
                }`}
              >
                <span className={pill.active ? 'text-inherit' : 'opacity-50'}>{pill.icon}</span>
                <span>{pill.label}</span>
                {pill.labelSuffix && (
                  <span className="text-[8px] font-black uppercase tracking-wider text-white/30 bg-white/5 px-1 py-0.5 rounded ml-1">
                    {pill.labelSuffix}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Hero Section */}
        <div className="grid items-center gap-8 lg:gap-16 lg:grid-cols-2 py-10 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight uppercase">
              RIGHT GUIDANCE <br />
              TODAY. <br />
              <span className="italic text-[#FF6B2B] lowercase first-letter:uppercase font-serif block mt-1">
                Better college. better future.
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 max-w-xl font-medium">
              Talk to real IIT/NIT & top college seniors who recently went through counselling
              themselves.
            </p>

            {/* Mobile Viewports Only: Compact row of 3 main cards (above the fold, no scroll) */}
            <div className="block lg:hidden mt-8">
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => navigate('/programs#josaa')}
                  className="flex flex-col items-center justify-between p-3 rounded-lg bg-white/3 border border-white/10 shadow-sm active:scale-95 transition text-center"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                    🎓
                  </div>
                  <span className="text-[11px] font-bold text-white mt-2 leading-tight">
                    JoSAA / CSAB
                  </span>
                  <span className="text-[8px] font-bold text-green-400 uppercase tracking-wide bg-green-500/10 px-1.5 py-0.5 rounded-full mt-1.5 border border-green-500/20">
                    Active
                  </span>
                </button>

                <button
                  onClick={() => navigate('/programs#mhtcet')}
                  className="flex flex-col items-center justify-between p-3 rounded-lg bg-white/3 border border-white/10 shadow-sm active:scale-95 transition text-center"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                    🏛️
                  </div>
                  <span className="text-[11px] font-bold text-white mt-2 leading-tight">
                    MHT-CET
                  </span>
                  <span className="text-[8px] font-bold text-green-400 uppercase tracking-wide bg-green-500/10 px-1.5 py-0.5 rounded-full mt-1.5 border border-green-500/20">
                    Active
                  </span>
                </button>

                <button
                  onClick={() => navigate('/programs#othercounselling')}
                  className="flex flex-col items-center justify-between p-3 rounded-lg bg-white/3 border border-white/10 shadow-sm active:scale-95 transition text-center"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                    🌐
                  </div>
                  <span className="text-[11px] font-bold text-white mt-2 leading-tight">
                    All India
                  </span>
                  <span className="text-[8px] font-bold text-green-400 uppercase tracking-wide bg-green-500/10 px-1.5 py-0.5 rounded-full mt-1.5 border border-green-500/20">
                    Active
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Desktop Right Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hidden lg:block"
          >
            <HeroGraphic />
          </motion.div>
        </div>

        <CoursePricingCards />

        {/* 3. Counselling Path Section */}
        <div className="py-12 lg:py-16">
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#FF6B2B]" />
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#FFB38E] text-center">
              Choose your counselling path
            </h2>
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#FF6B2B]" />
          </div>

          {/* Cards columns (Desktop view) */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: JoSAA / CSAB */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/3 p-8 shadow-sm flex flex-col justify-between hover:border-[#FF6B2B]/40 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="rounded-full bg-green-500/15 border border-green-500/25 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-400">
                    Active Now
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                  JoSAA / CSAB Counselling
                </h3>
                <p className="text-sm leading-relaxed text-slate-400 mb-8">
                  For JEE Main & Advanced students applying through JoSAA & CSAB (IIT • NIT • IIIT •
                  GFTIs)
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Real Seniors, Real Guidance', icon: <Users className="h-4 w-4" /> },
                    { label: 'Rank Based Strategy', icon: <Target className="h-4 w-4" /> },
                    {
                      label: 'Better Choices, Better Future',
                      icon: <TrendingUp className="h-4 w-4" />,
                    },
                    { label: 'Support till Allotment', icon: <Trophy className="h-4 w-4" /> },
                  ].map((bullet, index) => (
                    <div key={index} className="flex items-center gap-3.5 text-sm text-slate-300">
                      <div className="text-[#FF6B2B]">{bullet.icon}</div>
                      <span>{bullet.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/programs#josaa')}
                className="w-full py-4 rounded-lg bg-[#FF6B2B] text-white font-bold text-sm tracking-wide shadow-lg hover:bg-[#e05a1f] hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Explore JoSAA / CSAB →
              </button>
            </div>

            {/* Card 2: MHT-CET */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/3 p-8 shadow-sm flex flex-col justify-between hover:border-[#FF6B2B]/40 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="rounded-full bg-green-500/15 border border-green-500/25 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-400">
                    Active Now
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                  MHT-CET Counselling
                </h3>
                <p className="text-sm leading-relaxed text-slate-400 mb-8">
                  For Maharashtra Engineering Admissions, CAP Rounds, Spot Rounds, Government &
                  Private Colleges
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Personalized Strategy', icon: <Target className="h-4 w-4" /> },
                    { label: 'Choice Filing Support', icon: <FileText className="h-4 w-4" /> },
                    { label: 'Expert Mentors', icon: <Headphones className="h-4 w-4" /> },
                    { label: 'Career Advantage', icon: <Rocket className="h-4 w-4" /> },
                  ].map((bullet, index) => (
                    <div key={index} className="flex items-center gap-3.5 text-sm text-slate-300">
                      <div className="text-[#FF6B2B]">{bullet.icon}</div>
                      <span>{bullet.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/programs#mhtcet')}
                className="w-full py-4 rounded-lg bg-[#FF6B2B] text-white font-bold text-sm tracking-wide shadow-lg hover:bg-[#e05a1f] hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Explore MHT-CET →
              </button>
            </div>

            {/* Card 3: All India */}
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/3 p-8 shadow-sm flex flex-col justify-between hover:border-[#FF6B2B]/40 transition duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="rounded-full bg-green-500/15 border border-green-500/25 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-400">
                    Active Now
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white border border-white/10">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                  All India Counselling
                </h3>
                <p className="text-sm leading-relaxed text-slate-400 mb-8">
                  For engineering admissions across other states (COMEDK, State CETs, private &
                  government universities)
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Choice Filing Support', icon: <FileText className="h-4 w-4" /> },
                    { label: 'State Cutoff Analytics', icon: <TrendingUp className="h-4 w-4" /> },
                    { label: 'Verified Senior Guidance', icon: <Users className="h-4 w-4" /> },
                    { label: 'Spot Round Strategy', icon: <Trophy className="h-4 w-4" /> },
                  ].map((bullet, index) => (
                    <div key={index} className="flex items-center gap-3.5 text-sm text-slate-300">
                      <div className="text-[#FF6B2B]">{bullet.icon}</div>
                      <span>{bullet.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/programs#othercounselling')}
                className="w-full py-4 rounded-lg bg-[#FF6B2B] text-white font-bold text-sm tracking-wide shadow-lg hover:bg-[#e05a1f] hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Explore All India →
              </button>
            </div>
          </div>

          {/* 4. Atyant Career Accelerator Card (Green/Coming Soon) */}
          <div className="mt-8 relative overflow-hidden rounded-lg border border-white/10 bg-white/3 p-8 shadow-sm hover:border-[#FF6B2B]/40 transition duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <span className="inline-flex rounded-full bg-green-500/10 border border-green-500/30 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-400 mb-4">
                  Coming Soon
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Atyant <span className="text-[#FF6B2B]">Career Accelerator</span>
                </h3>
                <p className="mt-1.5 text-sm font-semibold text-slate-300">
                  Become Job Ready. Increase your ROI. Land Better Placements.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    'Industry Relevant Skills',
                    'High Impact Projects',
                    'Internship Acceleration',
                    'Placement Preparation',
                    'Mentorship from Seniors',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="h-4 w-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-[9px]">
                        ✓
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => {
                    window.open(
                      'https://wa.me/919579040183?text=Hi%2C%20I%20want%20to%20get%20notified%20about%20the%20Atyant%20Career%20Accelerator.%20Please%20register%20my%20number.',
                      '_blank'
                    );
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#FF6B2B] hover:bg-[#e05a1f] text-white font-bold text-sm tracking-wide shadow-lg active:scale-95 transition"
                >
                  <Bell className="h-4 w-4 animate-bounce" />
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Stats Bar Section */}
        <div className="py-8 lg:py-12 border-t border-b border-white/5 my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                val: '5000+',
                lbl: 'Students Guided',
                color: '#FF6B2B',
                icon: <Users className="h-5 w-5" />,
              },
              {
                val: '100+',
                lbl: 'Verified Mentors',
                color: '#0B72FF',
                icon: <ShieldCheck className="h-5 w-5" />,
              },
              {
                val: '95%',
                lbl: 'Satisfaction Rate',
                color: '#10B981',
                icon: <Star className="h-5 w-5 fill-[#10B981]" />,
              },
              {
                val: '24x7',
                lbl: 'Support',
                color: '#8B5CF6',
                icon: <Headphones className="h-5 w-5" />,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center justify-center gap-3.5"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border shadow-inner shrink-0"
                  style={{
                    color: stat.color,
                    borderColor: `${stat.color}35`,
                    backgroundColor: `${stat.color}12`,
                    boxShadow: `0 0 15px ${stat.color}15`,
                  }}
                >
                  {stat.icon}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white leading-tight">{stat.val}</div>
                  <div className="text-xs font-semibold text-slate-400">{stat.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Why Students Choose Atyant */}
        <div className="py-12 lg:py-16">
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#FF6B2B]" />
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#FFB38E] text-center">
              Why Students Choose Atyant
            </h2>
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#FF6B2B]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                desc: 'Talk to seniors with ranks like yours',
                icon: <Users className="h-5 w-5" />,
                color: '#FF6B2B',
              },
              {
                desc: 'Real JoSAA / CSAB & MHT-CET experience',
                icon: <MessageCircle className="h-5 w-5" />,
                color: '#FF6B2B',
              },
              {
                desc: 'Honest advice, not sugarcoating',
                icon: <ShieldCheck className="h-5 w-5" />,
                color: '#10B981',
              },
              {
                desc: 'Affordable guidance starting at ₹99',
                icon: <span className="font-bold text-sm">₹99</span>,
                color: '#FF6B2B',
                isCustomIcon: true,
              },
              {
                desc: 'Support from choice filing till allotment',
                icon: (
                  <RefreshCw className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
                ),
                color: '#FF6B2B',
              },
              {
                desc: 'No bots. Only real seniors.',
                icon: <UserCheck className="h-5 w-5" />,
                color: '#10B981',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-6 rounded-lg border border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5 transition-all text-center"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full border mb-4 shadow-md"
                  style={{
                    color: card.color,
                    borderColor: `${card.color}35`,
                    backgroundColor: `${card.color}15`,
                    boxShadow: `0 0 12px ${card.color}15`,
                  }}
                >
                  {card.icon}
                </div>
                <p className="text-sm font-semibold leading-relaxed text-slate-200">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. WhatsApp Contact Box */}
        <div className="py-8">
          <div className="relative overflow-hidden rounded-lg border border-white/5 bg-white/2 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-[-100px] left-[-100px] w-64 h-64 rounded-full bg-green-500/5 blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 shadow-[0_0_20px_rgba(37,211,102,0.15)]">
                <MessageCircle className="h-7 w-7 fill-[#25D366] text-transparent" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white leading-snug">Still confused?</h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-medium">
                  Talk to a senior before investing your future.{' '}
                  <span className="text-[#10B981] font-semibold">
                    Usually replies within a few minutes.
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                window.open(
                  'https://wa.me/919579040183?text=Hi%2C%20I%20have%20some%20queries%20about%20my%20counselling%20strategy.%20Can%20you%20help%20me%3F',
                  '_blank'
                );
              }}
              className="group shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-4 text-sm font-black text-white shadow-lg active:scale-95 transition"
            >
              Chat on WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 8. Success Stories (FAQ, stories, Swiper slides) styled dark */}
        <div className="py-16 border-t border-white/5 mt-12">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFB38E]">
              Success Stories
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Students who found clarity.
            </h2>
          </div>

          {/* Video testimonials */}
          {testimonialVideos.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {testimonialVideos.map((video, idx) => (
                <div
                  key={video.src || idx}
                  className="rounded-[1.8rem] overflow-hidden border border-white/5 bg-white/2 p-2.5"
                >
                  <TestimonialVideoCard {...video} />
                </div>
              ))}
            </div>
          )}

          <div>
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
              className="pb-12"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.name} className="h-auto">
                  <div className="rounded-[2rem] border border-white/5 bg-white/2 p-6 h-full flex flex-col justify-between">
                    <TestimonialCard {...testimonial} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* 9. FAQs Section styled dark */}
        <div className="py-16 border-t border-white/5">
          <div className="w-full flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-2 py-1.5 pr-5 mb-5 shadow-sm">
              <div className="flex items-center justify-center bg-[#FF6B2B] rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
                <span className="mr-1.5 animate-pulse">💡</span> Answers
              </div>
              <span className="text-xs font-bold text-slate-300">Clear Your Doubts</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-12">
            {faqCategories.map((category, catIndex) => (
              <div key={category.category}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
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
                        open={faqOpenId === id}
                        onToggle={() => setFaqOpenId(faqOpenId === id ? null : id)}
                        dark={true}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
