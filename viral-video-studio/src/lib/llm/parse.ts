import type { Scene, Storyboard } from "../types";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function asNumber(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseScene(raw: unknown, index: number): Scene {
  const r = isRecord(raw) ? raw : {};
  return {
    index: asNumber(r.index, index + 1),
    durationSec: asNumber(r.durationSec, 3),
    visualPrompt: asString(r.visualPrompt),
    onScreenText: asString(r.onScreenText),
    voiceover: asString(r.voiceover),
    cameraDirection: asString(r.cameraDirection),
  };
}

/**
 * Coerce arbitrary parsed JSON into a Storyboard. Missing/malformed fields
 * degrade to sensible defaults rather than throwing, so a slightly off-spec
 * model response still produces a usable result.
 */
export function coerceStoryboard(raw: unknown): Storyboard {
  const r = isRecord(raw) ? raw : {};
  const scenesRaw = Array.isArray(r.scenes) ? r.scenes : [];
  return {
    hook: asString(r.hook),
    titleOptions: asStringArray(r.titleOptions),
    scenes: scenesRaw.map((s, i) => parseScene(s, i)),
    callToAction: asString(r.callToAction),
    caption: asString(r.caption),
    hashtags: asStringArray(r.hashtags).map((h) => h.replace(/^#/, "")),
    soundIdea: asString(r.soundIdea),
    thumbnailIdea: asString(r.thumbnailIdea),
  };
}

/** True when the coerced storyboard has enough content to be useful. */
export function isUsableStoryboard(sb: Storyboard): boolean {
  return sb.hook.trim().length > 0 && sb.scenes.length > 0;
}

/**
 * Extract the first balanced JSON object from a string. Models sometimes wrap
 * JSON in prose or code fences despite instructions; this recovers it.
 */
export function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}
