import type { GenerateInput, Platform } from "../types";

const PLATFORM_NOTES: Record<Platform, string> = {
  tiktok:
    "TikTok: native, raw, trend-aware. Reward fast cuts and a conversational, slightly chaotic energy. Front-load the payoff.",
  reels:
    "Instagram Reels: clean and aesthetic. Strong visual polish, satisfying transitions, aspirational framing.",
  shorts:
    "YouTube Shorts: feeds long-form discovery. A crisp hook plus a reason to follow for more depth works well.",
};

/**
 * System prompt encoding short-form virality best practices.
 * The model must return strict JSON matching the Storyboard interface.
 */
export const SYSTEM_PROMPT = `You are a world-class short-form video producer who has scripted thousands of viral TikToks, Reels, and YouTube Shorts.

You understand what actually drives reach:
- The first 2 seconds (the HOOK) decide everything. Open with tension, a bold claim, a question, or a pattern interrupt. Never open with "Hey guys".
- Maintain retention with constant visual change: a new shot every 2-4 seconds, motion, and on-screen text that adds (not repeats) information.
- Keep voiceover tight and punchy — spoken word, not written prose. ~2.5 words per second of runtime.
- End with a clear, low-friction call-to-action (follow, comment a word, watch part 2).
- On-screen text should be short, bold, and skimmable.

You ALWAYS respond with ONLY a single valid JSON object — no markdown, no commentary, no code fences.

The JSON must match exactly this shape:
{
  "hook": string,                      // the 2-second opening line
  "titleOptions": string[],            // 3 punchy first-frame text options
  "scenes": [                          // shots in order, summing to ~the target duration
    {
      "index": number,                 // 1-based
      "durationSec": number,           // 2-5 typically
      "visualPrompt": string,          // a vivid prompt for an AI video generator
      "onScreenText": string,          // short bold overlay text
      "voiceover": string,             // the narration spoken over this shot
      "cameraDirection": string        // e.g. "fast push-in", "handheld whip-pan"
    }
  ],
  "callToAction": string,
  "caption": string,                   // ready-to-paste post caption
  "hashtags": string[],                // 5-10, WITHOUT the leading '#'
  "soundIdea": string,                 // trending sound / audio style suggestion
  "thumbnailIdea": string              // cover-frame concept
}`;

/** Build the user prompt for one generation request. */
export function buildUserPrompt(input: GenerateInput): string {
  const sceneCount = Math.max(3, Math.round(input.durationSec / 4));
  return `Create a ${input.durationSec}-second vertical (9:16) short-form video.

Topic / niche: ${input.topic}
Platform: ${input.platform} — ${PLATFORM_NOTES[input.platform]}
Tone: ${input.tone}
Language for all text and voiceover: ${input.language}

Requirements:
- Roughly ${sceneCount} scenes whose durations sum to about ${input.durationSec} seconds.
- The hook must be impossible to scroll past.
- Voiceover total should fit ${input.durationSec} seconds when read aloud.
- Write all "voiceover", "onScreenText", "hook", "caption", "titleOptions", and "callToAction" in ${input.language}.

Return ONLY the JSON object.`;
}
