import type { Scene, Storyboard } from "../types";

/**
 * PHASE 2 SEAM — not wired to any paid API yet.
 *
 * These interfaces define how the storyboard turns into an actual MP4 later:
 *   1. VideoProvider  — text-to-video per scene (e.g. fal.ai, Replicate, Veo).
 *   2. TtsProvider    — voiceover narration (e.g. ElevenLabs, OpenAI, Piper).
 *   3. A stitch step  — ffmpeg concatenates clips, lays audio + captions, exports 9:16.
 *
 * The current StubProvider returns placeholders so the rest of the app — and a
 * future render pipeline — can be developed without spending money. Dropping in
 * a real implementation means implementing these interfaces; nothing else changes.
 *
 * Cost reality (why this is deferred): current text-to-video pricing runs roughly
 * $0.05–$0.50 per generated second, so a finished 30s reel can cost $2–$15+.
 */

export interface GeneratedClip {
  sceneIndex: number;
  /** URL or local path to the generated video clip. */
  url: string;
  durationSec: number;
}

export interface VideoProvider {
  readonly name: string;
  generateClip(scene: Scene): Promise<GeneratedClip>;
}

export interface SynthesizedAudio {
  /** URL or local path to the generated audio. */
  url: string;
  durationSec: number;
}

export interface TtsProvider {
  readonly name: string;
  synthesize(text: string, language: string): Promise<SynthesizedAudio>;
}

export class RenderNotConfiguredError extends Error {
  constructor() {
    super(
      "Video rendering is a Phase 2 feature and is not configured. " +
        "Implement a VideoProvider + TtsProvider and an ffmpeg stitch step to enable it.",
    );
    this.name = "RenderNotConfiguredError";
  }
}

/** Placeholder provider — documents the contract, costs nothing, renders nothing. */
export class StubVideoProvider implements VideoProvider {
  readonly name = "stub";
  async generateClip(scene: Scene): Promise<GeneratedClip> {
    return {
      sceneIndex: scene.index,
      url: "",
      durationSec: scene.durationSec,
    };
  }
}

export class StubTtsProvider implements TtsProvider {
  readonly name = "stub";
  async synthesize(): Promise<SynthesizedAudio> {
    return { url: "", durationSec: 0 };
  }
}

/**
 * Entry point a Phase 2 pipeline will call. Throws today on purpose so the
 * deferred boundary is explicit rather than silently producing nothing.
 */
export async function renderStoryboard(_storyboard: Storyboard): Promise<never> {
  throw new RenderNotConfiguredError();
}
