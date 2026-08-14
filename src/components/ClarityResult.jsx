import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ShieldCheck, UserCheck, Check } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function ClarityResult({ data }) {
  if (!data) return null;

  // Simple rule-based logic
  let recommendedPlan = 'Decision Bundle';
  let planPrice = '249';
  let riskWarning =
    'Making a choice without proper comparison often leads to regret later in year 2 or placements.';

  if (data.mainConfusion === 'College vs branch') {
    recommendedPlan = 'Decision Bundle';
    riskWarning =
      'Sacrificing branch for a slightly better college tag can hurt your core career interest. Conversely, a poor college can ruin a good branch.';
  } else if (data.mainConfusion === 'Fees vs placement') {
    recommendedPlan = 'Better College Plan';
    planPrice = '149';
    riskWarning =
      'Taking a huge loan for a college with average placements can create massive financial stress post-graduation.';
  } else if (data.mainConfusion === 'Final choice filling') {
    recommendedPlan = 'Premium Choice Plan';
    planPrice = '999';
    riskWarning =
      'One wrong order in your preference list can lock you out of your deserving college forever.';
  } else if (data.mainConfusion === 'Parents are confused') {
    recommendedPlan = 'Senior Review Call';
    planPrice = '299';
    riskWarning =
      'Parents often rely on outdated reputation. Real ground truth from current seniors is completely different.';
  }

  if (data.priority === 'Placements') {
    recommendedPlan = 'Decision Bundle';
    planPrice = '249';
  } else if (data.priority === 'Fees') {
    recommendedPlan = 'Better College Plan';
    planPrice = '149';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto"
    >
      <div className="bg-[#0B0F2E] p-8 text-white relative">
        <h2 className="text-2xl sm:text-3xl font-black">Your Personalized Clarity Path</h2>
        <p className="text-white/80 mt-2">
          Based on your details, here is our analysis for your situation.
        </p>
        <div className="absolute top-8 right-8 opacity-20">
          <ShieldCheck className="w-16 h-16" />
        </div>
      </div>

      <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">
              Profile Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block">Name</span>{' '}
                <span className="font-semibold">{data.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Exam Rank</span>{' '}
                <span className="font-semibold">
                  {data.rank} ({data.exam})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Preferred Branch</span>{' '}
                <span className="font-semibold">{data.preferredBranch || 'Not sure'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Main Confusion</span>{' '}
                <span className="font-semibold">{data.mainConfusion}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FF6B2B]/10 rounded-xl p-5 border border-[#FF6B2B]/20">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-[#FF6B2B] shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Risk Identified</h4>
                <p className="text-sm text-slate-700 mt-1">{riskWarning}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Suggested Next Step</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              For a rank of <b>{data.rank}</b> facing <b>{data.mainConfusion}</b>, the immediate
              next step is to look at accurate, verified placement stats and get a direct senior
              opinion before confirming your seat.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
          <div className="flex items-center gap-2 text-[#FF6B2B] font-bold text-sm uppercase tracking-wider mb-2">
            <UserCheck className="w-5 h-5" /> Recommended Plan
          </div>
          <h3 className="text-2xl font-black text-[#0B0F2E]">{recommendedPlan}</h3>
          <div className="text-3xl font-black mt-3 mb-6">₹{planPrice}</div>

          <ul className="space-y-3 mb-8 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Resolves: {data.mainConfusion}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Focuses on: {data.priority}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Senior verification included</span>
            </li>
          </ul>

          <a
            href={getWhatsAppLink(
              recommendedPlan,
              `Hi Atyant, I filled the clarity form and was recommended the ${recommendedPlan}. My rank is ${data.rank} and I need help with ${data.mainConfusion}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-[#FF6B2B] px-5 py-4 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#ff7a42] shadow-lg shadow-[#FF6B2B]/20"
          >
            Get Help Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
