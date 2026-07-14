import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Rocket, Target, Users, ArrowRight } from 'lucide-react';
import JourneyTabs from '../components/JourneyTabs';
import DecisionEngine from '../components/DecisionEngine';
import RegretSection from '../components/RegretSection';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const cards = [
  { title: 'Internships', icon: Briefcase, text: 'Find real opportunities while you study.' },
  { title: 'Mentorship', icon: Users, text: 'Get guidance from people already ahead of you.' },
  { title: 'Resume Help', icon: FileText, text: 'Build a profile that looks serious and ready.' },
  { title: 'Roadmaps', icon: Target, text: 'See the next step instead of guessing your path.' },
  { title: 'Skill Growth', icon: Rocket, text: 'Grow with projects, habits, and smart upskilling.' },
];

export default function CollegePage({ activeTab, onTabChange }) {
  return (
    <main>
      <JourneyTabs activeTab={activeTab} onTabChange={onTabChange} />
      <motion.section
        id="top"
        className="relative bg-[#0B0F2E] text-white"
        style={{ overflow: 'hidden' }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,43,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(63,94,251,0.16),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur">
              <Users className="h-4 w-4 text-[#FF6B2B]" />
              Built for students who want to grow while in college
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build Your Career
              <span className="block text-[#FFB38E]">While In College</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
              ATYANT helps college students unlock internships, mentorship, resume support, skill growth, and career roadmaps without wasting years figuring it out alone.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="https://wa.me/919579040183" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#FF6B2B] px-6 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]">
                Get Career Guidance
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-[#FF6B2B]/12 hover:text-white">
                Explore Programs
              </a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {['Internships', 'Mentorship', 'Resume Help'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold text-white/82 shadow-lg backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6 lg:p-7">
            <div className="space-y-4">
              {[
                'Internship matching',
                'Mentor conversations',
                'Portfolio building',
                'Career roadmap clarity',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-[#101738]/80 px-4 py-4 text-white/82">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold">{item}</span>
                    <ArrowRight className="h-4 w-4 text-[#FF6B2B]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* <DecisionEngine /> */}
      <RegretSection />

      <motion.section className="bg-[#f6f7fb] px-4 py-20 sm:px-6 lg:px-8" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">Your Next Move</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B0F2E] sm:text-4xl">Everything you need to build momentum in college.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div 
                  key={card.title} 
                  whileHover={{ y: -8, scale: 1.01 }} 
                  className="group rounded-[1.7rem] border border-white/10 bg-[#0B0F2E] p-7 shadow-[0_20px_60px_rgba(11,15,46,0.15)] transition"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] transition group-hover:bg-[#FF6B2B] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/80">{card.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <section className="bg-[#0B0F2E] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,43,0.16),rgba(255,255,255,0.04))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Grow Faster Before You Graduate.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">Use college years wisely with the right internships, support system, and career strategy.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="https://wa.me/919579040183" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#FF6B2B] px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]">
              Join CareerOS
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
