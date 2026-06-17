import type { Scene } from "@/lib/types";

/** A single 9:16 storyboard frame with its shot details. */
export function SceneCard({ scene }: { scene: Scene }) {
  return (
    <div className="flex flex-col gap-3">
      {/* 9:16 vertical preview frame */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-panel to-black">
        <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white/70">
          {scene.index} · {scene.durationSec}s
        </span>
        <div className="flex h-full items-center justify-center p-3">
          <p className="text-center text-sm font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow">
            {scene.onScreenText || "—"}
          </p>
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
            Visual
          </dt>
          <dd className="text-white/80">{scene.visualPrompt}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
            Voiceover
          </dt>
          <dd className="text-white/80">“{scene.voiceover}”</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
            Camera
          </dt>
          <dd className="text-white/60">{scene.cameraDirection}</dd>
        </div>
      </dl>
    </div>
  );
}
