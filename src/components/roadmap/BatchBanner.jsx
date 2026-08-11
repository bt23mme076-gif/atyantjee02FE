import React from 'react';
import { Users } from 'lucide-react';

// Shows which cohort/batch the student is in and how many peers are on the
// same journey, reinforcing the "you're not doing this alone" feeling.
export default function BatchBanner({ batch, memberCount }) {
  if (!batch) return null;

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur">
      <Users className="h-4 w-4 text-[#8B5CF6]" />
      <span>
        You're in <span className="font-semibold text-white">{batch.name}</span>
        {memberCount ? (
          <span className="text-white/50">
            {' '}
            · {memberCount.toLocaleString('en-IN')} students journeying with you
          </span>
        ) : null}
      </span>
    </div>
  );
}
