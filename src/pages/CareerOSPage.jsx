import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, TrendingUp, FileText, Zap, Award } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

function CareerOSHero() {
  return (
    <section className="relative overflow-hidden bg-[#0B0F2E] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,43,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(63,94,251,0.16),_transparent_30%)]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FF6B2B]/20 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur">
            <Zap className="h-4 w-4 text-[#FF6B2B]" />
            Accelerate your career growth
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Internships, Mentorship & Career Clarity.
            <span className="block text-[#FFB38E]">All in one platform.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            Connect with mentors, land internships at top companies, build your resume, and launch
            your startup journey. CareerOS powers your professional growth.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="https://wa.me/919579040183"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#FF6B2B] px-6 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]"
            >
              Explore Opportunities
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-[#FF6B2B]/12 hover:text-white"
            >
              Browse Programs
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold text-white/82 shadow-lg backdrop-blur">
              500+ Mentors
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold text-white/82 shadow-lg backdrop-blur">
              50+ Companies
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold text-white/82 shadow-lg backdrop-blur">
              98% Success Rate
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6 lg:p-7">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,rgba(255,107,43,0.12))]" />
            <div className="relative space-y-4">
              <div className="rounded-[1.6rem] border border-white/10 bg-[#101738]/80 p-5">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-[#FF6B2B]" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Internships
                    </div>
                    <div className="text-lg font-bold">Top-tier companies</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-[#101738]/80 p-5">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#FF6B2B]" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Mentorship
                    </div>
                    <div className="text-lg font-bold">Industry leaders</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-[#101738]/80 p-5">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#FF6B2B]" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Career Growth
                    </div>
                    <div className="text-lg font-bold">Verified outcomes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Briefcase,
      title: 'Internship Matching',
      description:
        'Get matched with internships at 50+ leading companies based on your skills and interests.',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from 500+ mentors in tech, business, startup, and creative fields.',
    },
    {
      icon: FileText,
      title: 'Resume Building',
      description: 'Create a professional resume with expert guidance. Stand out to recruiters.',
    },
    {
      icon: TrendingUp,
      title: 'Career Guidance',
      description: 'Get clarity on career paths, roles, and how to grow in your chosen field.',
    },
    {
      icon: Award,
      title: 'Startup Jobs',
      description: 'Find opportunities at high-growth startups and launch pad companies.',
    },
    {
      icon: Zap,
      title: 'Skill Development',
      description: 'Access programs to build in-demand skills and level up your career.',
    },
  ];

  return (
    <motion.section
      className="bg-[#f6f7fb] px-4 py-20 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FF6B2B]">
            What CareerOS Offers
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B0F2E] sm:text-4xl">
            Everything you need to build a world-class career.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group rounded-[1.7rem] border border-[#1E5BBF]/30 bg-[#1E5BBF] p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B] transition group-hover:bg-[#FF6B2B] group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/80">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function CTASection() {
  return (
    <section className="bg-[#0B0F2E] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,43,0.16),rgba(255,255,255,0.04))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-12">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Build Your Dream Career.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
          Join thousands of students who landed internships, found mentors, and accelerated their
          career growth with CareerOS.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/919579040183"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#FF6B2B] px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#FF6B2B]/25 transition hover:scale-[1.03] hover:bg-[#ff7a42]"
          >
            Join CareerOS
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-[#FF6B2B]/12 hover:text-white"
          >
            Explore Programs
          </a>
        </div>
      </div>
    </section>
  );
}

export default function CareerOSPage() {
  return (
    <main>
      <CareerOSHero />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
