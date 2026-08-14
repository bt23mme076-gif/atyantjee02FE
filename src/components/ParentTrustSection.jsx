import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function ParentTrustSection() {
  const points = [
    'Budget-aware guidance',
    'No fake promises',
    'Senior-based support',
    'Risk-based shortlisting',
    'Clear explanation for parents',
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black">Why Parents Trust Atyant</h2>
          <p className="mt-2 text-sm text-slate-600">
            Practical, evidence-backed guidance that parents can rely on.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {points.map((p) => (
            <motion.div
              whileHover={{ y: -8 }}
              key={p}
              className="rounded-xl border p-6 text-center bg-gradient-to-br from-white to-white/80 flex flex-col items-center justify-center"
            >
              <CheckCircle2 className="w-6 h-6 text-[#FF6B2B]" />
              <div className="mt-3 font-semibold text-[#0B0F2E]">{p}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
