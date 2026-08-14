import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Rocket, Briefcase, TrendingUp } from 'lucide-react';

const journeyStages = [
  { id: 'after12th', label: 'After 12th', icon: Flame },
  { id: 'college', label: 'In College', icon: Rocket },
  { id: 'finalyear', label: 'Final Year', icon: Briefcase },
  { id: 'workingpro', label: 'Working Pro', icon: TrendingUp },
];

export default function JourneySelector({ activeStage, onStageChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-[#0B0F2E] to-[#12193d] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Where are you right now?
          </h2>
          <p className="mt-2 text-base text-white/60">
            Choose your stage to get personalized guidance
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {journeyStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <motion.button
                key={stage.id}
                onClick={() => onStageChange(stage.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: journeyStages.indexOf(stage) * 0.1 }}
                className={`relative rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeStage === stage.id
                    ? 'bg-gradient-to-r from-[#FF6B2B] to-[#ff8a57] text-white shadow-lg shadow-[#FF6B2B]/40'
                    : 'border border-white/20 bg-white/8 text-white hover:border-white/40 hover:bg-[#FF6B2B]/12 hover:text-white'
                }`}
              >
                {activeStage === stage.id && (
                  <motion.div
                    layoutId="activeStage"
                    className="absolute inset-0 rounded-full border border-white/30"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative" />
                <span className="relative">{stage.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
