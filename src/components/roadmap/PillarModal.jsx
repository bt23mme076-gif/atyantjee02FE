import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getPillarIcon } from './icons';
import ProgressBar from './ProgressBar';
import RoadmapItemRow from './RoadmapItemRow';

// Popup shown when a pillar tab is clicked (per the "College Arrival Guide
// → creates another pop up → has PDFs, videos and all things" flow).
// Replaces the old always-visible inline section below the tabs.
export default function PillarModal({ pillar, isLoggedIn, openingItemId, onOpenItem, onLockedClick, onClose }) {
  useEffect(() => {
    if (!pillar) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [pillar, onClose]);

  const Icon = pillar ? getPillarIcon(pillar.icon) : null;
  const completedIds = new Set(pillar?.progress?.completedItemIds || []);

  return (
    <AnimatePresence>
      {pillar && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0F2E] p-6 shadow-2xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 pr-10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B2B]/15 text-[#FF6B2B]">
                {Icon && <Icon className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{pillar.title}</h3>
                  {pillar.isFlagship && (
                    <span className="rounded-full bg-[#8B5CF6]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#C4B5FD]">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/60">{pillar.tagline}</p>
              </div>
            </div>

            {isLoggedIn && (
              <div className="mt-6">
                <ProgressBar percent={pillar.progress?.percent || 0} label="Your progress" />
              </div>
            )}

            <div className="mt-6 space-y-3">
              {pillar.items?.length ? (
                pillar.items.map((item) => (
                  <RoadmapItemRow
                    key={item.id}
                    item={item}
                    isLoggedIn={isLoggedIn}
                    isCompleted={completedIds.has(item.id)}
                    isOpening={openingItemId === item.id}
                    onOpen={onOpenItem}
                    onLockedClick={onLockedClick}
                  />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/40">
                  Content for this section is on its way — check back soon.
                </p>
              )}
            </div>

            {!isLoggedIn ? (
              <p className="mt-6 text-center text-sm text-white/50">
                <a href="/login" className="font-semibold text-[#FF6B2B] hover:underline">
                  Log in
                </a>{' '}
                to open resources and track your progress automatically.
              </p>
            ) : (
              <p className="mt-6 text-center text-xs text-white/35">
                Opening a video or document marks it complete automatically — no extra steps.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
