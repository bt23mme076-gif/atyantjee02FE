import React from 'react';

function useCount(target, duration = 1200) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.round(target / (duration / 50)));
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(t);
      } else setValue(start);
    }, 50);
    return () => clearInterval(t);
  }, [target, duration]);
  return value;
}

export default function TrustMetrics() {
  const a = useCount(12000);
  const b = useCount(100);
  const c = useCount(49);
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-3 text-center">
          <div className="rounded-xl border p-4 sm:p-6 bg-white">
            <div className="text-xl sm:text-2xl font-black text-[#0B0F2E]">
              {a.toLocaleString()}+
            </div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">Students Guided</div>
          </div>
          <div className="rounded-xl border p-4 sm:p-6 bg-white">
            <div className="text-xl sm:text-2xl font-black text-[#0B0F2E]">{b}+</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">Colleges Covered</div>
          </div>
          <div className="rounded-xl border p-4 sm:p-6 bg-white">
            <div className="text-xl sm:text-2xl font-black text-[#0B0F2E]">4.{c}</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1">Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
