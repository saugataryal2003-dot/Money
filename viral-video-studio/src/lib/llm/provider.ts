import type { GenerateInput, Storyboard } from "../types";

/** Raised when the LLM backend cannot be reached or returns junk. */
export class LlmError extends Error {
  readonly hint?: string;
  constructor(message: string, hint?: string) {
    super(message);
    this.name = "LlmError";
    this.hint = hint;
  }
}

/**
 * Provider-agnostic interface for the "brain" that writes storyboards.
 * The default implementation is Ollama (local, free), but a Gemini/Claude/etc.
 * provider can be dropped in without touching the API route or UI.
 */
export interface LlmProvider {
  /** Human-readable model identifier, surfaced in the response. */
  readonly modelName: string;
  generateStoryboard(input: GenerateInput): Promise<Storyboard>;
}
