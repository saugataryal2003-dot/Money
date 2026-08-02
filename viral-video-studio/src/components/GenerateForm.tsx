"use client";

import { useState } from "react";
import type {
  DurationSec,
  GenerateInput,
  Platform,
  Tone,
} from "@/lib/types";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "reels", label: "Instagram Reels" },
  { value: "shorts", label: "YouTube Shorts" },
];

const TONES: Tone[] = [
  "energetic",
  "educational",
  "funny",
  "inspirational",
  "dramatic",
  "calm",
];

const DURATIONS: DurationSec[] = [15, 30, 60];

interface Props {
  loading: boolean;
  onSubmit: (input: GenerateInput) => void;
}

const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";
const fieldCls =
  "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-accent";

export function GenerateForm({ loading, onSubmit }: Props) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [tone, setTone] = useState<Tone>("energetic");
  const [durationSec, setDurationSec] = useState<DurationSec>(30);
  const [language, setLanguage] = useState("English");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ topic: topic.trim(), platform, tone, durationSec, language });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-panel/60 p-5"
    >
      <div>
        <label htmlFor="topic" className={labelCls}>
          Topic or niche
        </label>
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. 3 budgeting tricks that doubled my savings"
          rows={2}
          maxLength={300}
          className={fieldCls}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="platform" className={labelCls}>
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className={fieldCls}
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tone" className={labelCls}>
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className={fieldCls}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className={labelCls}>
            Length
          </label>
          <select
            id="duration"
            value={durationSec}
            onChange={(e) =>
              setDurationSec(Number(e.target.value) as DurationSec)
            }
            className={fieldCls}
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} seconds
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className={labelCls}>
            Language
          </label>
          <input
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={fieldCls}
            maxLength={40}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || topic.trim().length < 3}
        className="w-full rounded-lg bg-gradient-to-r from-accent to-accent2 px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Generating…" : "Generate storyboard"}
      </button>
    </form>
  );
}
