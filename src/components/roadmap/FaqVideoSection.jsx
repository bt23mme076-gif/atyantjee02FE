import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import FaqVideoModal from './FaqVideoModal';

// "Quick guidance" FAQ section — a grid of common questions; tapping one
// opens a pop-up video (FaqVideoModal) instead of a plain text answer.
export default function FaqVideoSection({ faqVideos = [] }) {
  const [openFaq, setOpenFaq] = useState(null);

  if (!faqVideos.length) return null;

  return (
    <section className="bg-[#0B0F2E] pb-20 sm:pb-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#FF9E6B]">Quick Guidance</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Got questions? Watch the answer.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Short videos from the team and mentors, answering the questions students ask most.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {faqVideos.map((faq) => (
            <button
              key={faq.id}
              type="button"
              onClick={() => setOpenFaq(faq)}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#FF6B2B]/40 hover:bg-white/[0.05]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF6B2B]/15 text-[#FF6B2B]">
                <PlayCircle className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">{faq.question}</span>
                {faq.shortAnswer && <span className="block truncate text-xs text-white/45">{faq.shortAnswer}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>

      <FaqVideoModal faq={openFaq} onClose={() => setOpenFaq(null)} />
    </section>
  );
}
