import React from 'react';
import { Flame } from 'lucide-react';

// Compact streak pill used in the hero and sticky sub-nav, mirroring the
// "5-day streak" card from the roadmap design reference but in Atyant's
// orange/navy palette.
export default function StreakBadge({ currentStreak = 0, longestStreak = 0 }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B2B]/30 bg-[#FF6B2B]/10 px-4 py-2 text-sm font-semibold text-[#FFB38E] backdrop-blur">
      <Flame className="h-4 w-4 text-[#FF6B2B]" />
      <span>{currentStreak}-day streak</span>
      {longestStreak > currentStreak && (
        <span className="text-white/40 font-normal">· best {longestStreak}</span>
      )}
    </div>
  );
}
