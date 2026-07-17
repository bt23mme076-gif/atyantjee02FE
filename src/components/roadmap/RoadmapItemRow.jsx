import React from 'react';
import {
  PlayCircle,
  FileText,
  ClipboardCheck,
  HelpCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
  Loader2,
  Gift,
} from 'lucide-react';

const typeIconMap = {
  video: PlayCircle,
  document: FileText,
  article: FileText,
  task: ClipboardCheck,
  quiz: HelpCircle,
};

// A single resource row inside the pillar popup. There is no manual "mark
// complete" control — clicking the row opens the video/PDF/article (in a
// new tab, once Phase 2's admin uploads add real files) and that click
// itself marks the item complete for logged-in students.
//
// Referral-gated items (requiresReferralUnlock) show a lock instead, and
// clicking them calls onLockedClick so the page can point the student at
// their referral progress instead of trying to open/complete anything.
export default function RoadmapItemRow({
  item,
  isCompleted,
  isOpening,
  onOpen,
  onLockedClick,
}) {
  const TypeIcon = typeIconMap[item.type] || FileText;
  const isLocked = item.locked;

  return (
    <button
      type="button"
      disabled={isOpening}
      onClick={() => (isLocked ? onLockedClick?.(item) : onOpen(item))}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition ${
        isCompleted
          ? 'border-emerald-400/30 bg-emerald-500/5'
          : isLocked
            ? item.price
              ? 'border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-500/35'
              : 'border-[#8B5CF6]/25 bg-[#8B5CF6]/5 hover:border-[#8B5CF6]/40'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isCompleted
              ? 'bg-emerald-500/15 text-emerald-400'
              : isLocked
                ? item.price
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-[#8B5CF6]/15 text-[#C4B5FD]'
                : 'bg-white/5 text-[#FF9E6B]'
          }`}
        >
          <TypeIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{item.title}</p>
          <p className="text-xs text-white/45">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            {item.durationLabel ? ` · ${item.durationLabel}` : ''}
            {isLocked ? (item.price ? ` · Unlock for ₹${item.price}` : ' · Refer friends to unlock') : ''}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isOpening ? (
          <Loader2 className="h-4 w-4 animate-spin text-white/50" />
        ) : isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : isLocked ? (
          item.price ? (
            <Lock className="h-4 w-4 text-amber-500/80" />
          ) : (
            <Gift className="h-4 w-4 text-[#C4B5FD]" />
          )
        ) : (
          <ExternalLink className="h-4 w-4 text-white/40" />
        )}
      </div>
    </button>
  );
}
