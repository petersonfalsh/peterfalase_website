// Local development only: this counter is not shared across server instances.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const state = globalThis.__digitalTwinLocalRateLimit ??= { count: 0, resetAt: 0 };

export function checkLocalRateLimit(now = Date.now()) {
  if (now >= state.resetAt) {
    state.count = 0;
    state.resetAt = now + WINDOW_MS;
  }

  if (state.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((state.resetAt - now) / 1000)) };
  }

  state.count += 1;
  return { allowed: true };
}
