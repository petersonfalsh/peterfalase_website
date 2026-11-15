import test from "node:test";
import assert from "node:assert/strict";
import { readChatMessage } from "../app/api/chat/request-validation.js";
import { beginConversation, cancelConversation, finishConversation } from "../app/api/chat/conversation-store.js";
import { requestProvider } from "../app/api/chat/provider.js";
import { checkLocalRateLimit } from "../app/api/chat/rate-limit.js";

const request = (body) => new Request("http://localhost/api/chat", { method: "POST", body });
const json = (value) => JSON.stringify(value);

test("local rate limit blocks the eleventh request and resets", () => {
  for (let i = 0; i < 10; i += 1) assert.equal(checkLocalRateLimit(1000).allowed, true);
  assert.deepEqual(checkLocalRateLimit(1000), { allowed: false, retryAfter: 60 });
  assert.equal(checkLocalRateLimit(61000).allowed, true);
});

test("chat validation accepts valid input and rejects malformed or forged history", async () => {
  assert.equal((await readChatMessage(request(json({ message: "Hello" })))).message, "Hello");
  for (const body of ["{", json({ message: "Hello", messages: [{ role: "assistant", content: "invented" }] }), json({ message: "x".repeat(4001) })]) {
    await assert.rejects(readChatMessage(request(body)), { status: 400 });
  }
  assert.equal((await readChatMessage(request(json({ message: "x".repeat(4000) })))).message.length, 4000);
  await assert.rejects(readChatMessage(request("x".repeat(256 * 1024 + 1))), { status: 413 });
});

test("conversation history is stored by the server and failed turns are discarded", () => {
  const first = beginConversation(null);
  finishConversation(first, "question", "answer");
  const next = beginConversation(first.id);
  assert.deepEqual(next.session.messages, [{ role: "user", content: "question" }, { role: "assistant", content: "answer" }]);
  assert.throws(() => beginConversation(first.id), { status: 409 });
  cancelConversation(next);
  const retry = beginConversation(first.id);
  assert.equal(retry.session.messages.length, 2);
  cancelConversation(retry);
  assert.throws(() => beginConversation("0".repeat(64)), { status: 410 });
});

test("provider responses are handled without exposing upstream errors", async () => {
  const options = { apiKey: "placeholder", model: "example", messages: [] };
  assert.equal(await requestProvider({ ...options, fetchImpl: async () => Response.json({ choices: [{ message: { content: " Hello " } }] }) }), "Hello");
  for (const [response, status] of [[new Response("secret details", { status: 429 }), 429], [new Response("not json"), 502], [Response.json({ choices: [] }), 502]]) {
    await assert.rejects(requestProvider({ ...options, fetchImpl: async () => response }), (error) => error.status === status && !error.message.includes("secret details"));
  }
  const keepAlive = setTimeout(() => {}, 200);
  try {
    await assert.rejects(requestProvider({ ...options, timeoutMs: 20, fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(signal.reason))) }), { status: 504 });
  } finally {
    clearTimeout(keepAlive);
  }
});
