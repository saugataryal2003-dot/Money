# Viral Video Studio

Turn any topic into a virality-optimized **short-form script + storyboard** for
TikTok, Instagram Reels, and YouTube Shorts. The "brain" runs on **local
[Ollama](https://ollama.com)** — no API key, no per-use cost.

Each generation gives you:

- A scroll-stopping **hook** (the first 2 seconds)
- A **scene-by-scene storyboard** (visual prompt, on-screen text, voiceover,
  camera direction, timing) shown as 9:16 frames
- **Title options**, a ready-to-paste **caption**, **hashtags**, a **sound
  idea**, and a **thumbnail idea**
- One-click **export** to Markdown or JSON

## Quick start

1. **Install Ollama** from <https://ollama.com>, then pull a model and start it:
   ```bash
   ollama pull llama3.1
   ollama serve            # usually already running after install
   ```
2. **Configure** (optional — defaults work out of the box):
   ```bash
   cp .env.example .env
   # OLLAMA_HOST=http://localhost:11434
   # OLLAMA_MODEL=llama3.1
   ```
3. **Run the app:**
   ```bash
   npm install
   npm run dev
   ```
   Open <http://localhost:3000>, enter a topic, and generate.

> Tip: instruction-tuned models that follow JSON well work best
> (`llama3.1`, `qwen2.5`). Bigger models give better hooks.

## How it works

```
Browser form  →  POST /api/generate  →  OllamaProvider  →  local Ollama
   (UI)              (validates input)     (LLM brain)        (free)
                            │
                            ▼
                   Storyboard JSON  →  rendered as 9:16 scene cards + export
```

Key files:

| Path | Role |
|---|---|
| `src/lib/types.ts` | Domain types (`GenerateInput`, `Storyboard`, `Scene`) |
| `src/lib/validation.ts` | Boundary validation of the request body |
| `src/lib/prompts/storyboard.ts` | Virality-tuned system + user prompts |
| `src/lib/llm/provider.ts` | `LlmProvider` interface (swap in any model) |
| `src/lib/llm/ollama.ts` | Local Ollama implementation |
| `src/app/api/generate/route.ts` | API route |
| `src/components/*` | Form + storyboard UI |

The LLM is behind the `LlmProvider` interface, so adding a Gemini/Claude/OpenAI
backend later means writing one class — the API route and UI don't change.

## Phase 2 — actually rendering video (deferred)

This MVP stops at the script + storyboard because that stage is **free and
reliable**. Turning a storyboard into a finished MP4 needs three more pieces,
already stubbed behind interfaces in `src/lib/render/provider.ts`:

1. **`VideoProvider`** — text-to-video per scene (e.g. fal.ai, Replicate, Veo)
2. **`TtsProvider`** — voiceover narration (e.g. ElevenLabs, OpenAI, local Piper)
3. **An ffmpeg stitch step** — concatenate clips, lay audio + burn-in captions,
   export 9:16

**Cost reality (why it's deferred):** current text-to-video pricing runs roughly
**$0.05–$0.50 per generated second**, so a finished 30s reel can cost **$2–$15+**,
and you'll generate several before one is good. Wire this up when you're ready to
spend — the seam is in place so nothing else has to change.

## An honest note on "going viral"

No tool can guarantee a hit. What this app does is remove the slow part — coming
up with strong hooks and tight structure — so you can **produce a lot, post
consistently, and double down on whatever lands**. Volume + good hooks +
iteration is the actual strategy; this is the machine for the first part.
