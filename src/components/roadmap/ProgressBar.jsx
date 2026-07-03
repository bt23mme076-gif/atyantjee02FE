import React from 'react';
import { motion } from 'framer-motion';

// Reusable progress bar. `size="lg"` is used for the hero's overall
// progress; the default (sm) size is used inline per-pillar in the tabs.
export default function ProgressBar({ percent = 0, label, size = 'sm' }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const height = size === 'lg' ? 'h-3' : 'h-1.5';

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-white/60">
          <span>{label}</span>
          <span className="text-white/80">{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${height} overflow-hidden rounded-full bg-white/10`}>
        <motion.div
          className={`${height} rounded-full bg-gradient-to-r from-[#FF6B2B] to-[#8B5CF6]`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
