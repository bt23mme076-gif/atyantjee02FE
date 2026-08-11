import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: 1, title: 'Understand your rank reality', icon: '📊' },
  { num: 2, title: 'Compare real outcomes', icon: '🔍' },
  { num: 3, title: 'Choose best path', icon: '🎯' },
  { num: 4, title: 'Validate with seniors', icon: '✅' },
];

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AtyantFramework() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-[#071032] to-[#0B122B] text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center px-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Atyant Decision System™</h2>
          <p className="mt-2 text-xs sm:text-sm text-white/70">
            A repeatable 4-step approach to make the right 4-year decision.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex items-center justify-center"
        >
          <div className="w-full max-w-6xl">
            {/* Desktop Flowchart */}
            <div className="hidden md:flex items-center gap-2 justify-between px-4">
              {steps.map((step, i) => (
                <React.Fragment key={step.num}>
                  <motion.div
                    custom={i}
                    variants={stepVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#ff8a57] shadow-xl">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl">{step.icon}</div>
                        <div className="text-xs font-bold mt-1">Step {step.num}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-sm font-semibold text-white">
                      {step.title}
                    </div>
                  </motion.div>

                  {i < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="flex-1 h-1 bg-gradient-to-r from-[#FF6B2B] to-white/20 origin-left"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile Flowchart (Vertical) */}
            <div className="md:hidden space-y-4 px-4">
              {steps.map((step, i) => (
                <div key={step.num}>
                  <motion.div
                    custom={i}
                    variants={stepVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    whileHover={{ x: 8 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#ff8a57] shadow-lg">
                      <div className="flex flex-col items-center">
                        <div className="text-xl">{step.icon}</div>
                        <div className="text-xs font-bold">Step {step.num}</div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold text-white">{step.title}</div>
                    </div>
                  </motion.div>
                  {i < steps.length - 1 && <div className="ml-8 h-6 border-l-2 border-white/20" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
