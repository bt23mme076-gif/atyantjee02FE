import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles, MapPin, IndianRupee } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function ComparisonTool() {
  const [optionA, setOptionA] = useState({ college: '', branch: '', fees: '', location: '' });
  const [optionB, setOptionB] = useState({ college: '', branch: '', fees: '', location: '' });
  const [showResult, setShowResult] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = (e) => {
    e.preventDefault();
    if (!optionA.college || !optionB.college) return;

    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      setShowResult(true);
    }, 1200); // Fake processing time
  };

  const InputField = ({ label, value, onChange, placeholder, icon: Icon }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          required
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-[#FF6B2B] focus:ring-1 focus:ring-[#FF6B2B] text-sm ${Icon ? 'pl-9' : ''}`}
        />
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="comparison">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0F2E]/5 text-[#0B0F2E] text-sm font-bold mb-4 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#FF6B2B]" /> Smart Compare
          </div>
          <h2 className="text-3xl font-black text-[#0B0F2E] sm:text-4xl">
            College vs Branch Dilemma?
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Enter two options you are confused about, and see how a senior would analyze them.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Form Side */}
          <div className="bg-[#f6f7fb] rounded-3xl p-6 sm:p-8 border border-slate-200">
            <form onSubmit={handleCompare}>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Option A */}
                <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-lg font-bold text-[#0B0F2E] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0B0F2E] text-white flex items-center justify-center text-xs">
                      A
                    </span>
                    Option A
                  </div>
                  <InputField
                    label="College Name"
                    value={optionA.college}
                    onChange={(e) => setOptionA({ ...optionA, college: e.target.value })}
                    placeholder="e.g. VIT Vellore"
                  />
                  <InputField
                    label="Branch"
                    value={optionA.branch}
                    onChange={(e) => setOptionA({ ...optionA, branch: e.target.value })}
                    placeholder="e.g. Mech"
                  />
                  <InputField
                    label="Fees (4 Yrs)"
                    value={optionA.fees}
                    onChange={(e) => setOptionA({ ...optionA, fees: e.target.value })}
                    placeholder="e.g. 15L"
                    icon={IndianRupee}
                  />
                  <InputField
                    label="Location"
                    value={optionA.location}
                    onChange={(e) => setOptionA({ ...optionA, location: e.target.value })}
                    placeholder="e.g. Tamil Nadu"
                    icon={MapPin}
                  />
                </div>

                {/* VS Divider (Mobile hidden, Desktop absolute or simple text) */}
                <div className="hidden sm:flex items-center justify-center -mx-3 z-10">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B2B] text-white font-bold flex items-center justify-center shadow-lg shadow-[#FF6B2B]/30 border-4 border-[#f6f7fb]">
                    VS
                  </div>
                </div>
                <div className="sm:hidden text-center font-bold text-slate-400 -my-2">VS</div>

                {/* Option B */}
                <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-lg font-bold text-[#FF6B2B] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B2B] text-white flex items-center justify-center text-xs">
                      B
                    </span>
                    Option B
                  </div>
                  <InputField
                    label="College Name"
                    value={optionB.college}
                    onChange={(e) => setOptionB({ ...optionB, college: e.target.value })}
                    placeholder="e.g. SRM IST"
                  />
                  <InputField
                    label="Branch"
                    value={optionB.branch}
                    onChange={(e) => setOptionB({ ...optionB, branch: e.target.value })}
                    placeholder="e.g. CSE"
                  />
                  <InputField
                    label="Fees (4 Yrs)"
                    value={optionB.fees}
                    onChange={(e) => setOptionB({ ...optionB, fees: e.target.value })}
                    placeholder="e.g. 18L"
                    icon={IndianRupee}
                  />
                  <InputField
                    label="Location"
                    value={optionB.location}
                    onChange={(e) => setOptionB({ ...optionB, location: e.target.value })}
                    placeholder="e.g. Chennai"
                    icon={MapPin}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isComparing}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0B0F2E] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#12183f] disabled:opacity-70"
                >
                  {isComparing ? 'Analyzing...' : 'Compare Now'}
                </button>
              </div>
            </form>
          </div>

          {/* Result Side */}
          <div className="h-full flex items-center">
            <AnimatePresence mode="wait">
              {!showResult && !isComparing ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center"
                >
                  <Sparkles className="w-12 h-12 mb-4 text-slate-300" />
                  <p>Enter your options and click compare to see the analysis.</p>
                </motion.div>
              ) : isComparing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center justify-center py-20"
                >
                  <div className="w-12 h-12 border-4 border-[#FF6B2B]/30 border-t-[#FF6B2B] rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-medium animate-pulse">
                    Running placement algorithms...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full bg-[#0B0F2E] text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B2B] opacity-5 blur-[100px] rounded-full"></div>

                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#FF6B2B]" /> Analysis Result
                  </h3>

                  <div className="space-y-6 relative z-10">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white">
                            Safer Option (Lower Risk)
                          </div>
                          <div className="text-sm text-white/70 mt-1">
                            {optionA.branch.toLowerCase().includes('cse')
                              ? optionA.college
                              : optionB.college}{' '}
                            provides better job security due to branch demand.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white">Fees / Location Note</div>
                          <div className="text-sm text-white/70 mt-1">
                            Consider if the extra fees for {optionB.college} justifies the ROI
                            compared to {optionA.college}.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-[#FF6B2B] font-bold mb-2">
                        Senior Opinion
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed italic">
                        "Most students regret taking a lower branch in a decent college unless they
                        specifically want to go for higher studies. If you want a tech job, branch
                        matters more in tier 2/3 colleges."
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/60 mb-4">
                        This is a mock AI analysis. For exact placement data and real senior advice,
                        get the Decision Bundle.
                      </p>
                      <a
                        href={getWhatsAppLink(
                          'Decision Bundle',
                          `Hi Atyant, I am confused between ${optionA.college} (${optionA.branch}) and ${optionB.college} (${optionB.branch}). I want to buy the Decision Bundle.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B2B] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#ff7a42] hover:scale-105 shadow-lg shadow-[#FF6B2B]/20"
                      >
                        Get Real Senior Advice <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
