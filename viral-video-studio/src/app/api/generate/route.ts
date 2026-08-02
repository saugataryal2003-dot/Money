import { NextResponse } from "next/server";
import { OllamaProvider } from "@/lib/llm/ollama";
import { LlmError } from "@/lib/llm/provider";
import type { ApiError, GenerateResponse } from "@/lib/types";
import { parseGenerateInput } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const err: ApiError = { error: "Request body must be valid JSON." };
    return NextResponse.json(err, { status: 400 });
  }

  const parsed = parseGenerateInput(body);
  if (!parsed.ok || !parsed.value) {
    const err: ApiError = { error: parsed.error ?? "Invalid input." };
    return NextResponse.json(err, { status: 400 });
  }

  const provider = OllamaProvider.fromEnv();
  try {
    const storyboard = await provider.generateStoryboard(parsed.value);
    const ok: GenerateResponse = { storyboard, model: provider.modelName };
    return NextResponse.json(ok, { status: 200 });
  } catch (e) {
    if (e instanceof LlmError) {
      const err: ApiError = { error: e.message, hint: e.hint };
      return NextResponse.json(err, { status: 502 });
    }
    const err: ApiError = { error: "Unexpected error generating storyboard." };
    return NextResponse.json(err, { status: 500 });
  }
}
