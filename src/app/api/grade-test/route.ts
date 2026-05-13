import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint — пингует Claude API напрямую,
 * показывает что именно не так с интеграцией.
 * Открыть: https://geodetective-kz.vercel.app/api/grade-test
 */
export async function GET() {
  const env = {
    AI_PROVIDER: process.env.AI_PROVIDER ?? "(not set, defaults to claude)",
    HAS_ANTHROPIC_KEY: Boolean(process.env.ANTHROPIC_API_KEY),
    ANTHROPIC_KEY_PREFIX: process.env.ANTHROPIC_API_KEY?.slice(0, 14) ?? "(missing)",
    ANTHROPIC_GRADING_MODEL: process.env.ANTHROPIC_GRADING_MODEL ?? "(not set, code defaults to haiku)",
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      ok: false,
      env,
      error: "ANTHROPIC_API_KEY is not set in environment variables",
    });
  }

  let model = process.env.ANTHROPIC_GRADING_MODEL ?? "claude-haiku-4-5";
  if (model.includes("sonnet")) model = "claude-haiku-4-5";

  const startedAt = Date.now();

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model,
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: 'Reply with valid JSON only: {"ok": true, "echo": "claude works"}',
        },
      ],
    });

    const elapsed = Date.now() - startedAt;
    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock?.type === "text" ? textBlock.text : "(no text)";

    return NextResponse.json({
      ok: true,
      env,
      model,
      elapsed_ms: elapsed,
      response_preview: text.slice(0, 200),
      usage: response.usage,
    });
  } catch (err) {
    const elapsed = Date.now() - startedAt;
    const e = err as { message?: string; status?: number; error?: { type?: string; message?: string } };
    return NextResponse.json(
      {
        ok: false,
        env,
        model,
        elapsed_ms: elapsed,
        error: {
          message: e.message,
          status: e.status,
          type: e.error?.type,
          detail: e.error?.message,
        },
      },
      { status: 500 }
    );
  }
}
