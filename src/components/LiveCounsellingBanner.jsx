import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examSchedule } from '../data/siteContent';

const THEME = {
  orange: {
    border: 'border-[#FF6B2B]/40',
    bg: 'from-[#FF6B2B]/15 via-[#FF6B2B]/5 to-transparent',
    dot: 'bg-[#FF6B2B]',
    text: 'text-[#FF6B2B]',
    button: 'bg-[#FF6B2B] hover:bg-[#ff7b48]',
  },
  blue: {
    border: 'border-blue-400/40',
    bg: 'from-blue-500/15 via-blue-500/5 to-transparent',
    dot: 'bg-blue-500',
    text: 'text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-500',
  },
  green: {
    border: 'border-emerald-400/40',
    bg: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-500',
  },
};

function getLiveExams() {
  const now = new Date();
  return examSchedule.filter((exam) => {
    const start = new Date(exam.start);
    const end = new Date(exam.end);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  });
}

export default function LiveCounsellingBanner() {
  const navigate = useNavigate();
  const liveExams = getLiveExams();

  // Nothing is live right now — don't show a stale/empty banner.
  if (liveExams.length === 0) return null;

  return (
    <section className="relative bg-[#0B0F2E] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-row overflow-x-auto gap-2 py-1 scrollbar-none sm:flex-wrap sm:items-center sm:gap-3">
          {liveExams.map((exam) => {
            const theme = THEME[exam.colorTheme] || THEME.orange;
            return (
              <motion.button
                key={exam.id}
                onClick={() => navigate(exam.anchor)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex shrink-0 items-center justify-between gap-3 rounded-2xl border ${theme.border} bg-gradient-to-r ${theme.bg} px-4 py-1 text-left backdrop-blur`}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${theme.dot} opacity-75`}
                    />
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${theme.dot}`}
                    />
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${theme.text}`}
                  >
                    <Radio className="h-3.5 w-3.5" />
                    Live Now
                  </span>
                  <span className="text-sm font-bold text-white">{exam.fullName}</span>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full ${theme.button} px-3.5 py-1.5 text-xs font-bold text-white transition`}
                >
                  View Plans
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
