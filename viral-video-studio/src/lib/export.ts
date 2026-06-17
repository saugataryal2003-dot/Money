import type { GenerateInput, Storyboard } from "./types";

/** Render a storyboard as a human-readable Markdown brief. */
export function storyboardToMarkdown(
  sb: Storyboard,
  input: GenerateInput,
): string {
  const lines: string[] = [];
  lines.push(`# ${input.topic}`);
  lines.push("");
  lines.push(
    `**Platform:** ${input.platform} · **Tone:** ${input.tone} · **Length:** ${input.durationSec}s · **Language:** ${input.language}`,
  );
  lines.push("");
  lines.push(`## Hook (first 2s)`);
  lines.push(`> ${sb.hook}`);
  lines.push("");
  if (sb.titleOptions.length > 0) {
    lines.push(`## Title options`);
    sb.titleOptions.forEach((t) => lines.push(`- ${t}`));
    lines.push("");
  }
  lines.push(`## Scenes`);
  sb.scenes.forEach((s) => {
    lines.push(`### Scene ${s.index} — ${s.durationSec}s`);
    lines.push(`- **Visual:** ${s.visualPrompt}`);
    lines.push(`- **On-screen text:** ${s.onScreenText}`);
    lines.push(`- **Voiceover:** ${s.voiceover}`);
    lines.push(`- **Camera:** ${s.cameraDirection}`);
    lines.push("");
  });
  lines.push(`## Call to action`);
  lines.push(sb.callToAction);
  lines.push("");
  lines.push(`## Caption`);
  lines.push(sb.caption);
  lines.push("");
  if (sb.hashtags.length > 0) {
    lines.push(`## Hashtags`);
    lines.push(sb.hashtags.map((h) => `#${h}`).join(" "));
    lines.push("");
  }
  lines.push(`## Sound idea`);
  lines.push(sb.soundIdea);
  lines.push("");
  lines.push(`## Thumbnail idea`);
  lines.push(sb.thumbnailIdea);
  lines.push("");
  return lines.join("\n");
}
