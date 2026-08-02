"use client";

import { useState } from "react";
import type { GenerateInput, Storyboard } from "@/lib/types";
import { storyboardToMarkdown } from "@/lib/export";
import { SceneCard } from "./SceneCard";

interface Props {
  storyboard: Storyboard;
  input: GenerateInput;
  model: string;
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StoryboardView({ storyboard, input, model }: Props) {
  const [copied, setCopied] = useState(false);

  const markdown = storyboardToMarkdown(storyboard, input);
  const slug = input.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Hook · first 2 seconds
        </p>
        <p className="mt-1 text-xl font-bold text-white">{storyboard.hook}</p>
      </div>

      {storyboard.titleOptions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/60">
            Title options
          </h3>
          <ul className="flex flex-wrap gap-2">
            {storyboard.titleOptions.map((t, i) => (
              <li
                key={i}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/85"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
          Storyboard · {storyboard.scenes.length} scenes
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {storyboard.scenes.map((scene) => (
            <SceneCard key={scene.index} scene={scene} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoBlock label="Call to action">{storyboard.callToAction}</InfoBlock>
        <InfoBlock label="Sound idea">{storyboard.soundIdea}</InfoBlock>
        <InfoBlock label="Caption">{storyboard.caption}</InfoBlock>
        <InfoBlock label="Thumbnail idea">{storyboard.thumbnailIdea}</InfoBlock>
      </div>

      {storyboard.hashtags.length > 0 && (
        <p className="text-sm text-accent">
          {storyboard.hashtags.map((h) => `#${h}`).join("  ")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
        <button
          onClick={copyMarkdown}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          {copied ? "Copied!" : "Copy as Markdown"}
        </button>
        <button
          onClick={() =>
            download(`${slug || "storyboard"}.md`, markdown, "text/markdown")
          }
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Download .md
        </button>
        <button
          onClick={() =>
            download(
              `${slug || "storyboard"}.json`,
              JSON.stringify(storyboard, null, 2),
              "application/json",
            )
          }
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Download .json
        </button>
        <span className="ml-auto text-xs text-white/40">model: {model}</span>
      </div>
    </section>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/50">
        {label}
      </p>
      <p className="text-sm text-white/85">{children}</p>
    </div>
  );
}
