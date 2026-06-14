import { NextRequest, NextResponse } from "next/server";

const MAX_JSON_BYTES = 32 * 1024;

function badRequest(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

async function readBodyWithLimit(request: NextRequest): Promise<string | null> {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_JSON_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(body);
}

export async function parseJsonObject(request: NextRequest): Promise<
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: NextResponse }
> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false, response: badRequest("Content-Type must be application/json.", 415) };
  }

  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return { ok: false, response: badRequest("Content-Length is required.", 411) };
  }

  const length = Number(contentLength);
  if (!Number.isInteger(length) || length < 0) {
    return { ok: false, response: badRequest("Invalid Content-Length.") };
  }
  if (length > MAX_JSON_BYTES) {
    return { ok: false, response: badRequest("Request body is too large.", 413) };
  }

  const text = await readBodyWithLimit(request);
  if (text === null) {
    return { ok: false, response: badRequest("Request body is too large.", 413) };
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { ok: false, response: badRequest("Invalid JSON body.") };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, response: badRequest("Invalid request body.") };
  }

  return { ok: true, body: body as Record<string, unknown> };
}
