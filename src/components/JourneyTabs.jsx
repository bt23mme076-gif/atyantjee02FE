import React from 'react';
import { Flame, Rocket, Briefcase, TrendingUp } from 'lucide-react';

const journeyTabs = [
  { id: 'after12th', label: 'After 12th', icon: Flame },
  { id: 'college', label: 'College Student', icon: Rocket },
  { id: 'finalyear', label: 'Final Year', icon: Briefcase },
  { id: 'workingpro', label: 'Working Pro', icon: TrendingUp },
];

export default function JourneyTabs({ activeTab, onTabChange }) {
  return (
    <div className="bg-[#0B0F2E] border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {journeyTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-[#FF6B2B] text-white'
                    : 'border border-white/30 bg-white/8 text-white hover:bg-white/12'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
