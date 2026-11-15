import { randomBytes } from "node:crypto";
import { ChatRequestError } from "./request-validation.js";

// Development-only memory. Production requires a shared, protected store.
const sessions = globalThis.__digitalTwinSessions ??= new Map();
const TTL_MS = 30 * 60 * 1000;
const MAX_SESSIONS = 100;

export function beginConversation(sessionId, now = Date.now()) {
  for (const [id, session] of sessions) {
    if (!session.busy && session.expiresAt <= now) sessions.delete(id);
  }

  let session;
  let id = sessionId;
  if (id) {
    session = sessions.get(id);
    if (!session) throw new ChatRequestError("This chat session has expired. Refresh the page to start again.", 410);
    if (session.busy) throw new ChatRequestError("Please wait for the current reply.", 409);
  } else {
    if (sessions.size >= MAX_SESSIONS) throw new ChatRequestError("The chat is busy. Please try again later.", 503);
    id = randomBytes(32).toString("hex");
    session = { messages: [], expiresAt: now + TTL_MS, busy: false };
    sessions.set(id, session);
  }
  session.busy = true;
  return { id, session, isNew: !sessionId };
}

export function finishConversation(reservation, userMessage, assistantMessage) {
  reservation.session.messages = [...reservation.session.messages, { role: "user", content: userMessage }, { role: "assistant", content: assistantMessage }].slice(-12);
  reservation.session.expiresAt = Date.now() + TTL_MS;
  reservation.session.busy = false;
}

export function cancelConversation(reservation) {
  if (reservation.isNew) sessions.delete(reservation.id);
  else reservation.session.busy = false;
}
