"use client";

import { useEffect, useRef, useState } from "react";

const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi — I’m Peter’s Digital Twin. Ask me about his career journey, systems work, current roles or technical background.",
  },
];

const prompts = [
  "What does Peter do best?",
  "Tell me about his current roles.",
  "What kind of role is he open to?",
];

const renderMessageContent = (content) => content.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
  part.startsWith("**") && part.endsWith("**")
    ? <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    : <span key={`${part}-${index}`}>{part}</span>
));

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m4 4 16 8-16 8 3-8-3-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export default function DigitalTwinChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const submitMessage = async (event) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const userMessage = { id: `${Date.now()}-user`, role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content: text }) => ({ role, content: text })) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Unable to reach the Digital Twin.");
      setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: "assistant", content: payload.message }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: error.message || "I could not reach the Digital Twin just now. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <section className="digital-twin section-shell section-padding" id="digital-twin">
      <div className="section-kicker light"><span>04</span><span>ASK THE DIGITAL TWIN</span></div>
      <div className="twin-layout">
        <div className="twin-intro">
          <p className="twin-status"><span /> ONLINE / GROUNDED IN PROFILE</p>
          <h2>Ask the<br /><span>operator.</span></h2>
          <p className="twin-description">Ask this AI assistant about Peter&apos;s experience, strengths and current work to see where he can add value.</p>
          <div className="twin-meta"><div><span>MODEL</span><strong>STEALTH / OX-ALPHA</strong></div><div><span>KNOWLEDGE BASE</span><strong>CAREER PROFILE / 2026</strong></div></div>
        </div>

        <div className="twin-chat" aria-label="Chat with Peter Falase's Digital Twin">
          <div className="twin-chat-header"><div className="twin-avatar">PF<span>.</span></div><div><strong>Peter&apos;s Digital Twin</strong><span>Career context / live chat</span></div><span className="twin-live"><i />LIVE</span></div>
          <div className="twin-messages" ref={messagesRef} aria-live="polite">
            {messages.map((message) => <div className={`twin-message ${message.role} ${message.isError ? "error" : ""}`} key={message.id}><span className="message-label">{message.role === "assistant" ? "DIGITAL TWIN" : "YOU"}</span><p>{renderMessageContent(message.content)}</p></div>)}
            {isLoading && <div className="twin-message assistant"><span className="message-label">DIGITAL TWIN</span><p className="typing"><i /><i /><i /></p></div>}
          </div>
          <div className="twin-prompts">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => setInput(prompt)}>{prompt}</button>)}</div>
          <form className="twin-form" onSubmit={submitMessage}><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about Peter&apos;s career..." rows="1" aria-label="Ask the Digital Twin a question" disabled={isLoading} /><button type="submit" aria-label="Send question" disabled={!input.trim() || isLoading}><SendIcon /></button></form>
          <p className="twin-note">AI-generated responses are grounded in Peter&apos;s supplied career profile.</p>
        </div>
      </div>
    </section>
  );
}
