import React from 'react';
import { motion } from 'framer-motion';

function mockSuggestion(stream, rank, confusion) {
  const r = Number(rank) || 999999;
  let risk = 'Low';
  if (r > 100000) risk = 'High';
  else if (r > 30000) risk = 'Medium';

  let direction = 'Explore nearby tier colleges and branch-fit options.';
  if (stream === 'PCM') direction = 'Consider strong CSE/IT options and build coding practice.';
  if (stream === 'PCB') direction = 'Explore biotech, allied health, and strong biology programs.';
  if (stream === 'Commerce')
    direction = 'Look at commerce + analytics pathways and secure internships.';

  if (confusion && confusion.toLowerCase().includes('branch'))
    direction = 'Prioritise branch-fit over college brand.';

  return { risk, direction, next: 'Talk to a senior for a 20-min clarity call.' };
}

export default function DecisionTool() {
  const [stream, setStream] = React.useState('PCM');
  const [rank, setRank] = React.useState('');
  const [confusion, setConfusion] = React.useState('');
  const [result, setResult] = React.useState(null);

  function handleGet() {
    const res = mockSuggestion(stream, rank, confusion);
    setResult(res);
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-white px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-r from-white/60 to-white/40 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0B0F2E]">Decision Tool</h3>
            <p className="text-sm text-[#0B0F2E]/70">Quick suggestion — no accounts</p>
          </div>

          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-3">
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="rounded-md border px-3 py-2.5 text-sm"
            >
              <option>PCM</option>
              <option>PCB</option>
              <option>Commerce</option>
            </select>
            <input
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="Rank / Marks"
              className="rounded-md border px-3 py-2.5 text-sm"
            />
            <input
              value={confusion}
              onChange={(e) => setConfusion(e.target.value)}
              placeholder="Main confusion (optional)"
              className="rounded-md border px-3 py-2.5 text-sm"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={handleGet}
              className="rounded-full bg-[#FF6B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a42] transition"
            >
              Get My Best Option
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
              className="rounded-full border px-4 py-2.5 text-sm hover:bg-[#FF6B2B]/10 transition"
            >
              Talk to a senior
            </button>
          </div>

          {result && (
            <div className="mt-4 rounded-lg border p-4">
              <div className="text-sm text-[#FF6B2B] font-semibold">
                Your Risk Level: <span className="text-black">{result.risk}</span>
              </div>
              <div className="mt-2 text-lg font-bold">
                Suggested Direction:{' '}
                <span className="text-[#0B0F2E] font-semibold">{result.direction}</span>
              </div>
              <div className="mt-1 text-sm text-gray-700">Next Step: {result.next}</div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
