"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Track = {
  id: string;
  title: string;
  reciter: string | null;
  audioUrl: string;
  duration: string | null;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlaylistPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const track = tracks[index];

  useEffect(() => {
    if (playing) {
      audioRef.current?.play().catch(() => setPlaying(false));
    }
  }, [index, playing]);

  if (!track) return null;

  function goToIndex(i: number, autoplay: boolean) {
    setIndex(i);
    setProgress(0);
    setDuration(0);
    setError(false);
    setPlaying(autoplay);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setError(false);
      audioRef.current.play().then(
        () => setPlaying(true),
        () => {
          setPlaying(false);
          setError(true);
        }
      );
    }
  }

  function playTrack(i: number) {
    goToIndex(i, true);
  }

  function next() {
    goToIndex((index + 1) % tracks.length, true);
  }

  function prev() {
    goToIndex((index - 1 + tracks.length) % tracks.length, true);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03]">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
        onError={() => {
          setPlaying(false);
          setError(true);
        }}
        autoPlay={playing}
      />

      <div className="flex flex-col gap-4 border-b border-[#f3d27a]/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f3e9d2]">
            {track.title}
          </p>
          {track.reciter && (
            <p className="text-xs text-[#241d14]/50 dark:text-[#f3e9d2]/50">{track.reciter}</p>
          )}
          {error && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Impossible de lire cette piste — vérifiez le lien audio.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Piste précédente"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f3d27a]/20 text-[#241d14] dark:text-[#f3e9d2] hover:border-[#f3d27a]/50"
          >
            ⏮
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Lecture"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f3d27a] to-[#c9973a] text-lg text-[#0c0c0a] shadow-[0_10px_30px_-10px_rgba(243,210,122,0.6)]"
          >
            {playing ? "❚❚" : "▶"}
          </motion.button>
          <button
            onClick={next}
            aria-label="Piste suivante"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f3d27a]/20 text-[#241d14] dark:text-[#f3e9d2] hover:border-[#f3d27a]/50"
          >
            ⏭
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 pt-4 text-[11px] text-[#241d14]/45 dark:text-[#f3e9d2]/45">
        <span>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = v;
            setProgress(v);
          }}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#f3d27a]/15 accent-[#f3d27a]"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <ul className="max-h-80 overflow-y-auto p-3">
        {tracks.map((t, i) => (
          <li key={t.id}>
            <button
              onClick={() => playTrack(i)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                i === index
                  ? "bg-[#f3d27a]/12 text-[#8a6420] dark:text-[#f3d27a]"
                  : "text-[#241d14]/75 dark:text-[#f3e9d2]/75 hover:bg-[#241d14]/[0.04] dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-5 shrink-0 text-center text-xs opacity-60">
                {i === index && playing ? "♪" : i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate">{t.title}</span>
              {t.duration && (
                <span className="shrink-0 text-xs opacity-50">{t.duration}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
