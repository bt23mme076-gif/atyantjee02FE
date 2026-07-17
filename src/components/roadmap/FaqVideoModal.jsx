import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle } from 'lucide-react';
import { getEmbedUrl } from './videoEmbed';
import { resolveAssetUrl } from '../../utils/api';

// Pop-up video player shown when a student taps an FAQ question. Handles
// both YouTube/Vimeo links (admin-pasted) and directly uploaded video files.
export default function FaqVideoModal({ faq, onClose }) {
  const embedUrl = faq ? getEmbedUrl(faq.videoUrl) : null;

  return (
    <AnimatePresence>
      {faq && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B0F2E] shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={faq.question}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : faq.videoUrl ? (
                <video
                  src={resolveAssetUrl(faq.videoUrl)}
                  controls
                  autoPlay
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/40">
                  <PlayCircle className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <h4 className="text-lg font-bold text-white">{faq.question}</h4>
              {faq.shortAnswer && <p className="mt-1 text-sm text-white/60">{faq.shortAnswer}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
