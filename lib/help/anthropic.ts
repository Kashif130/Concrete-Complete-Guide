// Minimal Anthropic Messages API client (fetch only — no SDK dependency, in keeping with the
// project's no-extra-packages approach). Supports streaming (SSE) and plain completion.

export type LlmConfig = { apiKey: string; model: string; endpoint: string };

export class LlmError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "LlmError";
  }
}

export function llmConfig(): LlmConfig | null {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;
  const base = (process.env.ANTHROPIC_BASE_URL?.trim() || "https://api.anthropic.com").replace(/\/+$/, "");
  return {
    apiKey,
    // Haiku keeps a public, unauthenticated help widget cheap. Set HELP_MODEL to use a larger model.
    model: process.env.HELP_MODEL?.trim() || "claude-haiku-4-5-20251001",
    endpoint: `${base}/v1/messages`,
  };
}

type Msg = { role: "user" | "assistant"; content: string };
type Req = { system: string; messages: Msg[]; maxTokens: number; signal?: AbortSignal };

async function call(cfg: LlmConfig, req: Req, stream: boolean): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(cfg.endpoint, {
      method: "POST",
      signal: req.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": cfg.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: req.maxTokens,
        system: req.system,
        messages: req.messages,
        stream,
      }),
    });
  } catch (e) {
    throw new LlmError(e instanceof Error ? e.message : "network error");
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 200);
    } catch {
      /* ignore */
    }
    throw new LlmError(`Anthropic API ${res.status} ${detail}`, res.status);
  }
  return res;
}

/** Yields text deltas as they arrive. Throws LlmError on HTTP/stream errors. */
export async function* streamText(cfg: LlmConfig, req: Req): AsyncGenerator<string> {
  const res = await call(cfg, req, true);
  if (!res.body) throw new LlmError("empty response body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let i: number;
      while ((i = buf.indexOf("\n\n")) !== -1) {
        const raw = buf.slice(0, i);
        buf = buf.slice(i + 2);
        const data = raw
          .split("\n")
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.slice(5).trimStart())
          .join("");
        if (!data) continue;
        let ev: { type?: string; delta?: { type?: string; text?: string }; error?: { message?: string } };
        try {
          ev = JSON.parse(data);
        } catch {
          continue;
        }
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) yield ev.delta.text;
        else if (ev.type === "error") throw new LlmError(ev.error?.message ?? "stream error");
        else if (ev.type === "message_stop") return;
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* already closed */
    }
  }
}

export async function completeText(cfg: LlmConfig, req: Req): Promise<string> {
  const res = await call(cfg, req, false);
  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  return (data.content ?? []).map((b) => (b.type === "text" ? b.text ?? "" : "")).join("").trim();
}

/** A signal that aborts when `parent` does or after `ms`; call `done()` to release the timer. */
export function withTimeout(parent: AbortSignal, ms: number): { signal: AbortSignal; done: () => void } {
  const c = new AbortController();
  const onParent = () => c.abort();
  if (parent.aborted) c.abort();
  else parent.addEventListener("abort", onParent, { once: true });
  const timer = setTimeout(() => c.abort(), ms);
  return {
    signal: c.signal,
    done: () => {
      clearTimeout(timer);
      parent.removeEventListener("abort", onParent);
    },
  };
}
