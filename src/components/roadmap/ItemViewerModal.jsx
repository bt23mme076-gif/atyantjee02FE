import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ClipboardCheck, HelpCircle, FileText, PlayCircle } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/api';

/**
 * Determines if a URL is an uploaded server file (starts with /api/)
 * vs an external link (YouTube, Drive, etc.)
 */
function isHostedFile(url) {
  return url && url.startsWith('/api/');
}

/**
 * Determines if a URL is embeddable as an iframe (Google Drive PDF preview, etc.)
 */
function getEmbedUrl(url) {
  if (!url) return null;
  // Google Drive: convert to preview URL
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  // If it's our own hosted PDF, use it directly
  if (isHostedFile(url)) return resolveAssetUrl(url);
  return null;
}

/**
 * Determines if a YouTube URL can be embedded
 */
function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  return null;
}

// ─── Per-type viewer components ───────────────────────────────────────────────

function VideoViewer({ item }) {
  const resolved = resolveAssetUrl(item.url);
  const youtubeEmbed = getYoutubeEmbedUrl(item.url);
  const isUploaded = isHostedFile(item.url);

  if (!item.url) {
    return <p className="text-center text-sm text-white/50 py-8">No video attached to this item yet.</p>;
  }

  if (youtubeEmbed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={youtubeEmbed}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  if (isUploaded) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video
          src={resolved}
          controls
          autoPlay
          className="h-full w-full"
          title={item.title}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Vimeo / other: open in new tab as we can't embed arbitrary iframes
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <PlayCircle className="h-16 w-16 text-[#FF6B2B]/60" />
      <p className="text-center text-sm text-white/70">This video opens in a new tab.</p>
      <a
        href={resolved}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#FF6B2B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a42]"
      >
        <ExternalLink className="h-4 w-4" /> Open Video
      </a>
    </div>
  );
}

function DocumentViewer({ item }) {
  const resolved = resolveAssetUrl(item.url);
  const embedUrl = getEmbedUrl(item.url);

  if (!item.url) {
    return <p className="text-center text-sm text-white/50 py-8">No document attached to this item yet.</p>;
  }

  if (embedUrl) {
    return (
      <div className="h-[60vh] w-full overflow-hidden rounded-xl bg-gray-900">
        <iframe
          src={embedUrl}
          title={item.title}
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  // PPT / DOC: can't embed → open in tab
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <FileText className="h-16 w-16 text-blue-400/60" />
      <p className="text-center text-sm text-white/70">
        This document opens in a new tab (PDF, PPT, or DOC).
      </p>
      <a
        href={resolved}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        <ExternalLink className="h-4 w-4" /> Open Document
      </a>
    </div>
  );
}

function ArticleViewer({ item }) {
  const url = item.url;
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <ExternalLink className="h-12 w-12 text-green-400/60" />
      <p className="text-center text-sm text-white/60 max-w-sm">
        This article opens in a new tab. Come back once you've read it — it'll be marked complete.
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          <ExternalLink className="h-4 w-4" /> Read Article
        </a>
      ) : (
        <p className="text-xs text-white/40">No link attached yet.</p>
      )}
    </div>
  );
}

function TaskViewer({ item }) {
  const description = item.durationLabel || item.description || '';
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-start gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4">
        <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
        <div>
          <p className="font-semibold text-white">{item.title}</p>
          {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
        </div>
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-full border border-yellow-400/30 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10"
        >
          <ExternalLink className="h-4 w-4" /> Open reference link
        </a>
      )}
      <p className="text-xs text-white/40 text-center">
        Closing this marks the task as complete. ✓
      </p>
    </div>
  );
}

function QuizViewer({ item }) {
  const url = item.url || '/quiz';
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <HelpCircle className="h-16 w-16 text-rose-400/60" />
      <p className="text-center text-sm text-white/70 max-w-sm">
        Ready to test your knowledge? This quiz helps reinforce what you've learnt.
      </p>
      <a
        href={url}
        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
      >
        <HelpCircle className="h-4 w-4" /> Start Quiz
      </a>
    </div>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────

export default function ItemViewerModal({ item, onClose, onComplete }) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  const typeLabels = {
    video: '🎬 Video',
    document: '📄 Document',
    article: '🔗 Article',
    task: '📋 Task',
    quiz: '🧩 Quiz',
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="viewer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110000] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="viewer-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0F2E] p-6 shadow-2xl sm:p-8"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close viewer"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-5 pr-10">
              <p className="mb-1 text-xs font-semibold text-[#FF9E6B] uppercase tracking-wide">
                {typeLabels[item.type] || item.type}
                {item.durationLabel && item.type !== 'task' ? ` · ${item.durationLabel}` : ''}
              </p>
              <h3 className="text-xl font-bold text-white sm:text-2xl">{item.title}</h3>
            </div>

            {/* Type-specific content */}
            {item.type === 'video'    && <VideoViewer    item={item} />}
            {item.type === 'document' && <DocumentViewer item={item} />}
            {item.type === 'article'  && <ArticleViewer  item={item} />}
            {item.type === 'task'     && <TaskViewer     item={item} />}
            {item.type === 'quiz'     && <QuizViewer     item={item} />}

            {/* Completion note */}
            <p className="mt-4 text-center text-xs text-white/30">
              <CheckCircle2 className="mb-0.5 mr-1 inline h-3.5 w-3.5 text-emerald-400" />
              Opening this content marks it as complete automatically.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
