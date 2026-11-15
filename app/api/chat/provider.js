const PROVIDER_TIMEOUT_MS = 30_000;

export class ProviderError extends Error {
  constructor(message, status, reason) {
    super(message);
    this.status = status;
    this.reason = reason;
  }
}

export async function requestProvider({ apiKey, model, messages, signal, timeoutMs = PROVIDER_TIMEOUT_MS, fetchImpl = fetch }) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  try {
    const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Peter Falase Digital Twin",
      },
      body: JSON.stringify({ model, messages, temperature: 0.45, max_tokens: 500, reasoning: { enabled: false } }),
      cache: "no-store",
      signal: combinedSignal,
    });

    if (!response.ok) {
      if (response.body) void response.body.cancel().catch(() => {});
      if (response.status === 429) throw new ProviderError("The AI service is busy. Please try again later.", 429, "rate_limited");
      throw new ProviderError("The Digital Twin is temporarily unavailable. Please try again later.", 502, `upstream_${response.status}`);
    }

    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      if (combinedSignal.aborted) throw error;
      throw new ProviderError("The AI service returned an unexpected response. Please try again.", 502, "invalid_response");
    }
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new ProviderError("The AI service returned an empty response. Please try again.", 502, "empty_response");
    }
    return content.trim();
  } catch (error) {
    if (signal?.aborted) throw new ProviderError("The chat request was cancelled.", 499, "cancelled");
    if (timeout.aborted) throw new ProviderError("The AI service took too long to respond. Please try again.", 504, "timeout");
    if (error instanceof ProviderError) throw error;
    throw new ProviderError("The Digital Twin is temporarily unavailable. Please try again later.", 502, "connection_failed");
  }
}
