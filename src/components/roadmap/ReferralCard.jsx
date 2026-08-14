// import React, { useState } from 'react';
// import { Gift, Copy, Check } from 'lucide-react';
// import ProgressBar from './ProgressBar';

// // Referral system: shows the student's shareable code/link, how many
// // friends they've referred, and progress toward unlocking referral-gated
// // roadmap content (bonus videos/PDFs flagged by the admin panel).
// export default function ReferralCard({ referral }) {
//   const [copied, setCopied] = useState(false);
//   if (!referral) return null;

//   const { referralCode, referralCount, threshold, unlocked, remaining, shareUrl } = referral;
//   const percent = threshold > 0 ? Math.min(100, Math.round((referralCount / threshold) * 100)) : 0;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       // clipboard API unavailable — user can still select/copy the text field
//     }
//   };

//   return (
//     <div className="rounded-3xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent p-6 sm:p-8">
//       <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="inline-flex items-center gap-2 rounded-full bg-[#8B5CF6]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#C4B5FD]">
//             <Gift className="h-3.5 w-3.5" /> Refer & Unlock
//           </div>
//           <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
//             {unlocked ? 'Bonus content unlocked!' : `Refer ${remaining} more friend${remaining === 1 ? '' : 's'} to unlock bonus content`}
//           </h3>
//           <p className="mt-1 max-w-md text-sm text-white/60">
//             {unlocked
//               ? `You've referred ${referralCount} friends — every bonus video and PDF on the roadmap is now open.`
//               : `Every friend who signs up with your link counts. Refer ${threshold} to unlock premium roadmap content.`}
//           </p>
//         </div>

//         <div className="w-full sm:w-64">
//           <ProgressBar percent={percent} label={`${referralCount} / ${threshold} referrals`} />
//           <div className="mt-3 flex items-center gap-2">
//             <input
//               readOnly
//               value={shareUrl}
//               onClick={(e) => e.target.select()}
//               className="w-full truncate rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
//             />
//             <button
//               type="button"
//               onClick={handleCopy}
//               className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#FF6B2B] px-3 py-2 text-xs font-semibold text-white hover:bg-[#ff7a42]"
//             >
//               {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
//               {copied ? 'Copied' : 'Copy'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Gift, Copy, Check, Sparkles, PartyPopper } from 'lucide-react';

// Referral system: shows the student's shareable code/link and progress
// toward two milestones — bonus content at 3 referrals, full course
// refund at 5 referrals.
export default function ReferralCard({ referral }) {
  const [copied, setCopied] = useState(false);
  if (!referral) return null;

  const {
    referralCode,
    referralCount = 0,
    shareUrl,
    bonusThreshold = 3,
    freeThreshold = 5,
  } = referral;

  const bonusUnlocked = referralCount >= bonusThreshold;
  const freeUnlocked = referralCount >= freeThreshold;

  const percent = Math.min(100, Math.round((referralCount / freeThreshold) * 100));
  const bonusMarkerPercent = Math.round((bonusThreshold / freeThreshold) * 100);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — user can still select/copy the text field
    }
  };

  const remainingForBonus = Math.max(0, bonusThreshold - referralCount);
  const remainingForFree = Math.max(0, freeThreshold - referralCount);

  const headline = freeUnlocked
    ? 'Your course is fully refunded!'
    : bonusUnlocked
      ? `Bonus unlocked! Refer ${remainingForFree} more for a full refund`
      : `Refer ${remainingForBonus} more friend${remainingForBonus === 1 ? '' : 's'} to unlock bonus content`;

  const subtext = freeUnlocked
    ? `You referred ${referralCount} friends — bonus content is unlocked and your course fee will be refunded.`
    : `Refer ${bonusThreshold} friends to unlock bonus content, and ${freeThreshold} to get your course completely free.`;

  return (
    <div className="rounded-3xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#8B5CF6]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#C4B5FD]">
            <Gift className="h-3.5 w-3.5" /> Refer & Unlock
          </div>
          <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">{headline}</h3>
          <p className="mt-1 max-w-md text-sm text-white/60">{subtext}</p>

          {/* Milestone chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                bonusUnlocked
                  ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] ring-1 ring-[#8B5CF6]/40'
                  : 'bg-white/5 text-white/50 ring-1 ring-white/10'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bonus at {bonusThreshold}</span>
              {bonusUnlocked && <Check className="h-3 w-3 text-emerald-400" />}
            </div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                freeUnlocked
                  ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] ring-1 ring-[#FF6B2B]/40'
                  : 'bg-white/5 text-white/50 ring-1 ring-white/10'
              }`}
            >
              <PartyPopper className="h-3.5 w-3.5" />
              <span>Free at {freeThreshold}</span>
              {freeUnlocked && <Check className="h-3 w-3 text-emerald-400" />}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64">
          {/* Two-milestone progress bar */}
          <div className="relative">
            <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
              <span>
                {referralCount} referral{referralCount === 1 ? '' : 's'}
              </span>
              <span>{freeThreshold} = free</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#FF6B2B] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
              {/* Bonus milestone marker */}
              <div
                className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 bg-white/70"
                style={{ left: `${bonusMarkerPercent}%` }}
                title={`Bonus at ${bonusThreshold} referrals`}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-white/40">
              <span style={{ marginLeft: `${bonusMarkerPercent}%`, transform: 'translateX(-50%)' }}>
                {bonusThreshold} = bonus
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              onClick={(e) => e.target.select()}
              className="w-full truncate rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#FF6B2B] px-3 py-2 text-xs font-semibold text-white hover:bg-[#ff7a42]"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
