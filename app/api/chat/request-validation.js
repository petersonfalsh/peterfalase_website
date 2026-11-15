import { MAX_CHAT_MESSAGE_LENGTH } from "../../chat-limits.js";

const MAX_BODY_BYTES = 256 * 1024;

export class ChatRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function readChatMessage(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new ChatRequestError("Please provide a chat request.", 400);

  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw new ChatRequestError("The chat request is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } catch (error) {
    if (error instanceof ChatRequestError) throw error;
    throw new ChatRequestError("The chat request could not be read.", 400);
  } finally {
    reader.releaseLock();
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ChatRequestError("Please send valid JSON.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => !["message", "sessionId"].includes(key))) {
    throw new ChatRequestError("Please send a question and an optional session ID.", 400);
  }
  if (typeof body.message !== "string" || !body.message.trim()) {
    throw new ChatRequestError("Please ask a question about Peter's career.", 400);
  }
  if (body.message.length > MAX_CHAT_MESSAGE_LENGTH) {
    throw new ChatRequestError("Each chat message must be 4,000 characters or fewer.", 400);
  }
  const message = body.message.trim();
  if (body.sessionId != null && (typeof body.sessionId !== "string" || !/^[a-f0-9]{64}$/.test(body.sessionId))) {
    throw new ChatRequestError("The chat session is invalid. Refresh the page to start again.", 400);
  }
  return { message, sessionId: body.sessionId ?? null };
}
