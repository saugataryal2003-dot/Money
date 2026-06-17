// Input validation at the system boundary (the API route).
import type {
  DurationSec,
  GenerateInput,
  Platform,
  Tone,
} from "./types";

const PLATFORMS: readonly Platform[] = ["tiktok", "reels", "shorts"];
const TONES: readonly Tone[] = [
  "energetic",
  "educational",
  "funny",
  "inspirational",
  "dramatic",
  "calm",
];
const DURATIONS: readonly DurationSec[] = [15, 30, 60];

export interface ValidationResult {
  ok: boolean;
  value?: GenerateInput;
  error?: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Parse + validate an untrusted request body into a GenerateInput. */
export function parseGenerateInput(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  if (topic.length < 3) {
    return { ok: false, error: "Topic must be at least 3 characters." };
  }
  if (topic.length > 300) {
    return { ok: false, error: "Topic must be 300 characters or fewer." };
  }

  const platform = body.platform;
  if (!PLATFORMS.includes(platform as Platform)) {
    return { ok: false, error: "Invalid platform." };
  }

  const tone = body.tone;
  if (!TONES.includes(tone as Tone)) {
    return { ok: false, error: "Invalid tone." };
  }

  const durationSec = body.durationSec;
  if (!DURATIONS.includes(durationSec as DurationSec)) {
    return { ok: false, error: "Duration must be 15, 30, or 60 seconds." };
  }

  const language =
    typeof body.language === "string" && body.language.trim().length > 0
      ? body.language.trim().slice(0, 40)
      : "English";

  return {
    ok: true,
    value: {
      topic,
      platform: platform as Platform,
      tone: tone as Tone,
      durationSec: durationSec as DurationSec,
      language,
    },
  };
}
