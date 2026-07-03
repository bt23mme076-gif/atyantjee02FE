import React from 'react';
import { getPillarIcon } from './icons';

// Horizontal, scrollable tab strip for the 7 roadmap segments/categories.
// Each tab shows a mini progress ring via a colored dot once the user has
// made any progress in that pillar.
export default function PillarTabs({ pillars, activeKey, onChange }) {
  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      {pillars.map((pillar, idx) => {
        const Icon = getPillarIcon(pillar.icon);
        const isActive = pillar.key === activeKey;
        const percent = pillar.progress?.percent || 0;

        return (
          <button
            key={pillar.key}
            type="button"
            onClick={() => onChange(pillar.key)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'border-[#FF6B2B] bg-[#FF6B2B] text-white shadow-lg shadow-[#FF6B2B]/25'
                : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/20' : 'bg-white/10 text-white/50'
              }`}
            >
              {idx + 1}
            </span>
            <Icon className="h-4 w-4" />
            <span className="whitespace-nowrap">{pillar.title}</span>
            {percent > 0 && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${percent >= 100 ? 'bg-emerald-400' : 'bg-white/60'}`}
                title={`${percent}% complete`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
