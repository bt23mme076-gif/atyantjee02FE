import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

const options = [
  {
    id: 'safe-college',
    label: 'I do not know which college is safe',
    suggestion:
      'Relying on last year cutoffs is risky. You need a data-backed list of safe, target, and reach colleges for your specific rank.',
    plan: 'Premium Choice Plan',
  },
  {
    id: 'college-branch',
    label: 'I am confused between college and branch',
    suggestion:
      "Don't guess. Compare the median salary of the lower branch vs the placement rate of the lower college.",
    plan: 'Decision Bundle',
  },
  {
    id: 'fees',
    label: 'I am worried about fees',
    suggestion:
      'High fees + average placement = debt trap. We help you find colleges with the best ROI in your exact budget.',
    plan: 'Better College Plan',
  },
  {
    id: 'parents',
    label: 'My parents are confused',
    suggestion:
      'Parents need facts, not rumors. A direct call with a senior can solve 90% of parent-student disagreements.',
    plan: 'Senior Review Call',
  },
  {
    id: 'choice-filling',
    label: 'I need final choice filling help',
    suggestion:
      'One mistake in preference order can cost you your dream seat. Get an expert-verified list.',
    plan: 'Premium Choice Plan',
  },
];

export default function QuickConfusionSelector() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f6f7fb]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] text-sm font-bold mb-4 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Quick Help
          </div>
          <h2 className="text-3xl font-black text-[#0B0F2E] sm:text-4xl">
            What is your biggest confusion right now?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition font-medium ${
                  selected?.id === opt.id
                    ? 'border-[#FF6B2B] bg-white shadow-md text-[#FF6B2B]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100"
              >
                <h3 className="text-xl font-bold text-[#0B0F2E] mb-3">Here's the reality:</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{selected.suggestion}</p>
                <a
                  href={getWhatsAppLink(
                    selected.plan,
                    `Hi Atyant, ${selected.label.toLowerCase()}. I need help.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0B0F2E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#12183f] hover:scale-105"
                >
                  Get Help on WhatsApp <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex flex-col items-center justify-center h-full text-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl"
              >
                <HelpCircle className="w-12 h-12 mb-3 text-slate-300" />
                <p>Select your confusion from the left to get a quick suggestion.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
