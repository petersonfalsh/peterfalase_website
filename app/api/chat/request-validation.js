const MAX_BODY_BYTES = 256 * 1024;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 4000;

export class ChatRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function readChatMessages(request) {
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

  if (!body || !Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    throw new ChatRequestError("Please send between 1 and 12 chat messages.", 400);
  }

  const messages = body.messages.map((message) => {
    if (!message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string") {
      throw new ChatRequestError("Each chat message must have a valid role and text.", 400);
    }
    const content = message.content.trim();
    if (!content) throw new ChatRequestError("Chat messages cannot be empty.", 400);
    if (content.length > MAX_MESSAGE_CHARS) {
      throw new ChatRequestError("Each chat message must be 4,000 characters or fewer.", 400);
    }
    return { role: message.role, content };
  });

  if (!messages.some((message) => message.role === "user")) {
    throw new ChatRequestError("Please ask a question about Peter's career.", 400);
  }
  return messages;
}
