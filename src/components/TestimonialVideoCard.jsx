import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function TestimonialVideoCard({ src, name, city, poster }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(255,107,43,0.08)]"
    >
      <div
        className="relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-[#0B0F2E]"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          muted={muted}
          loop
          playsInline
          className="h-full w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Play/Pause overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="h-6 w-6 fill-[#FF6B2B] text-[#FF6B2B]" />
            </span>
          </div>
        )}

        {/* Mute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Pause indicator when playing, on hover */}
        {playing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40">
              <Pause className="h-6 w-6 text-white" />
            </span>
          </div>
        )}
      </div>

      {/* Name + City */}
      <div className="flex items-center gap-3 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B2B] to-[#ff955f] text-sm font-black text-white shadow-md shadow-[#FF6B2B]/20">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-black text-[#0B0F2E]">{name}</p>
          <p className="text-xs text-slate-400 font-medium">{city}</p>
        </div>
      </div>
    </motion.div>
  );
}
