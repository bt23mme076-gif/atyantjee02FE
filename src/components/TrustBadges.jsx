import React from 'react';
import { Check } from 'lucide-react';

const trustItems = [
  '100+ Verified Mentors',
  'Real Conversations, Not Generic Advice',
  'Private & Confidential',
  'Rank-Similar Mentor Matching',
  'Trusted by Students & Parents',
];

export default function TrustBadges() {
  return (
    <div className="bg-[#0B0F2E] border-y border-white/5 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2.5 transition-all hover:scale-[1.03]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black shadow-sm shadow-emerald-500/10">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white/90 tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
