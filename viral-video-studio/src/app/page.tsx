"use client";

import { useState } from "react";
import { GenerateForm } from "@/components/GenerateForm";
import { StoryboardView } from "@/components/StoryboardView";
import type {
  ApiError,
  GenerateInput,
  GenerateResponse,
} from "@/lib/types";

interface Result {
  response: GenerateResponse;
  input: GenerateInput;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(input: GenerateInput) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as GenerateResponse | ApiError;
      if (!res.ok) {
        setError(data as ApiError);
        setResult(null);
      } else {
        setResult({ response: data as GenerateResponse, input });
      }
    } catch {
      setError({ error: "Network error — is the dev server running?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Viral Video Studio
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          Turn any topic into a virality-optimized short-form script &
          storyboard for TikTok, Reels, and Shorts. Runs entirely on your local
          Ollama — no API key, no cost. Generate fast, post often, iterate on
          what hits.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <GenerateForm loading={loading} onSubmit={handleSubmit} />
        </div>

        <div>
          {error && (
            <div className="rounded-xl border border-accent2/40 bg-accent2/10 p-5">
              <p className="font-semibold text-white">{error.error}</p>
              {error.hint && (
                <p className="mt-1 text-sm text-white/70">{error.hint}</p>
              )}
            </div>
          )}

          {!error && !result && !loading && <EmptyState />}

          {loading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
              Writing your hook, scenes, and captions…
            </div>
          )}

          {result && (
            <StoryboardView
              storyboard={result.response.storyboard}
              input={result.input}
              model={result.response.model}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm text-white/50">
      <p className="mb-2 font-medium text-white/70">
        Enter a topic to generate your first storyboard.
      </p>
      <p>
        You&rsquo;ll get a scroll-stopping hook, a scene-by-scene shot list with
        visual prompts and voiceover, plus a caption, hashtags, and a sound idea
        — everything you need to film or feed into a video generator.
      </p>
    </div>
  );
}
