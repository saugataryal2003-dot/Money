// Shared domain types for the storyboard generator.
// Strict typing only — no `any`.

export type Platform = "tiktok" | "reels" | "shorts";
export type Tone =
  | "energetic"
  | "educational"
  | "funny"
  | "inspirational"
  | "dramatic"
  | "calm";
export type DurationSec = 15 | 30 | 60;

/** Input collected from the user via the form. */
export interface GenerateInput {
  topic: string;
  platform: Platform;
  tone: Tone;
  durationSec: DurationSec;
  language: string;
}

/** A single shot in the storyboard. */
export interface Scene {
  /** 1-based order. */
  index: number;
  /** Approximate length of this shot in seconds. */
  durationSec: number;
  /** Prompt for an AI video/image generator (the visual). */
  visualPrompt: string;
  /** Big bold text overlaid on screen for this beat. */
  onScreenText: string;
  /** The voiceover/narration line spoken over this shot. */
  voiceover: string;
  /** Camera / motion direction (e.g. "fast push-in", "handheld pan"). */
  cameraDirection: string;
}

/** Full generated package for one short-form video. */
export interface Storyboard {
  /** Punchy 2-second opening hook (the most important line). */
  hook: string;
  /** Candidate titles / on-screen first-frame text options. */
  titleOptions: string[];
  /** Ordered shots that make up the video. */
  scenes: Scene[];
  /** Closing call-to-action line. */
  callToAction: string;
  /** Ready-to-paste caption for the post. */
  caption: string;
  /** Hashtags without the leading '#'. */
  hashtags: string[];
  /** Suggestion for a trending sound / audio style. */
  soundIdea: string;
  /** Thumbnail / cover-frame concept. */
  thumbnailIdea: string;
}

/** Wrapper returned by the API route. */
export interface GenerateResponse {
  storyboard: Storyboard;
  model: string;
}

/** Error body returned by the API route. */
export interface ApiError {
  error: string;
  hint?: string;
}
