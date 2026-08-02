import type { GenerateInput, Storyboard } from "../types";
import { buildUserPrompt, SYSTEM_PROMPT } from "../prompts/storyboard";
import { LlmError, type LlmProvider } from "./provider";
import {
  coerceStoryboard,
  extractJsonObject,
  isUsableStoryboard,
} from "./parse";

const DEFAULT_HOST = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.1";

interface OllamaChatResponse {
  message?: { content?: string };
}

/** Local Ollama provider — zero cost, no API key. */
export class OllamaProvider implements LlmProvider {
  readonly modelName: string;
  private readonly host: string;

  constructor(host?: string, model?: string) {
    this.host = (host ?? DEFAULT_HOST).replace(/\/$/, "");
    this.modelName = model ?? DEFAULT_MODEL;
  }

  static fromEnv(): OllamaProvider {
    return new OllamaProvider(process.env.OLLAMA_HOST, process.env.OLLAMA_MODEL);
  }

  async generateStoryboard(input: GenerateInput): Promise<Storyboard> {
    const raw = await this.chat(input);
    const jsonText = extractJsonObject(raw) ?? raw;

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new LlmError(
        "The model did not return valid JSON.",
        "Try again, or switch OLLAMA_MODEL to an instruction-tuned model like llama3.1 or qwen2.5.",
      );
    }

    const storyboard = coerceStoryboard(parsed);
    if (!isUsableStoryboard(storyboard)) {
      throw new LlmError(
        "The model returned an empty or incomplete storyboard.",
        "Try a more specific topic or a larger model.",
      );
    }
    return storyboard;
  }

  private async chat(input: GenerateInput): Promise<string> {
    const url = `${this.host}/api/chat`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.modelName,
          stream: false,
          format: "json",
          options: { temperature: 0.9 },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(input) },
          ],
        }),
      });
    } catch {
      throw new LlmError(
        `Could not reach Ollama at ${this.host}.`,
        "Install Ollama (https://ollama.com), run `ollama serve`, and `ollama pull " +
          this.modelName +
          "`.",
      );
    }

    if (res.status === 404) {
      throw new LlmError(
        `Model "${this.modelName}" is not available in Ollama.`,
        `Run \`ollama pull ${this.modelName}\` first.`,
      );
    }
    if (!res.ok) {
      throw new LlmError(
        `Ollama returned HTTP ${res.status}.`,
        "Check that `ollama serve` is running and the model name is correct.",
      );
    }

    const data = (await res.json()) as OllamaChatResponse;
    const content = data.message?.content;
    if (!content) {
      throw new LlmError("Ollama returned an empty response.");
    }
    return content;
  }
}
