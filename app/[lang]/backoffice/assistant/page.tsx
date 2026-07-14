"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { AssistantService } from "../../../services/assistantService";

/* ── Markdown renderer for assistant messages ─────────────────── */
function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        /* Headings */
        h1: ({ children }) => (
          <h1 className="text-base font-black text-accent mb-2 mt-1 border-b border-accent/30 pb-1">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold text-accent/90 mb-1.5 mt-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-white/90 mb-1 mt-1.5">
            {children}
          </h3>
        ),
        /* Paragraphs */
        p: ({ children }) => (
          <p className="text-sm text-foreground/90 leading-relaxed mb-2 last:mb-0">
            {children}
          </p>
        ),
        /* Bold */
        strong: ({ children }) => (
          <strong className="font-bold text-accent/90">{children}</strong>
        ),
        /* Italic */
        em: ({ children }) => (
          <em className="italic text-white/75">{children}</em>
        ),
        /* Unordered list */
        ul: ({ children }) => (
          <ul className="my-1.5 space-y-1 pl-2">{children}</ul>
        ),
        /* Ordered list */
        ol: ({ children }) => (
          <ol className="my-1.5 space-y-1 pl-2 list-decimal list-inside">
            {children}
          </ol>
        ),
        /* List item */
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-sm text-foreground/85">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
            <span>{children}</span>
          </li>
        ),
        /* Inline code */
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className="block bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-green-400 my-2 overflow-x-auto">
                {children}
              </code>
            );
          }
          return (
            <code className="bg-black/30 border border-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-accent">
              {children}
            </code>
          );
        },
        /* Blockquote */
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent/50 pl-3 my-2 text-sm text-white/60 italic">
            {children}
          </blockquote>
        ),
        /* Horizontal rule */
        hr: () => <hr className="border-white/10 my-3" />,
        /* Links */
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

/* ── Avatar ───────────────────────────────────────────────────── */
function BotAvatar() {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-accent">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5m9 0a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5M5 21a7 7 0 0 1 7-7 7 7 0 0 1 7 7H5z" />
      </svg>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chargement, setChargement] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chargement]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const nouveauMessage = { role: "user" as const, content: question };
    setMessages((prev) => [...prev, nouveauMessage]);
    setQuestion("");
    setChargement(true);

    try {
      const reponse = await AssistantService.poserQuestion(question);
      setMessages((prev) => [...prev, { role: "assistant", content: reponse }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur : impossible de contacter l'assistant." },
      ]);
    } finally {
      setChargement(false);
    }
  }

  /* Suggested questions */
  const suggestions = [
    "Quelles sont ses compétences ?",
    "Parle-moi de ses expériences",
    "Quels projets a-t-il réalisé ?",
    "Quelle est sa formation ?",
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Assistant IA
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            Posez vos questions à l&apos;assistant basé sur le CV et l&apos;API
          </p>
        </div>
        {/* Clear button */}
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground/60 hover:text-foreground hover:border-white/20 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" />
            </svg>
            Effacer
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* Empty state */}
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-6 text-foreground/60">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-accent/70">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5m9 0a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5M5 21a7 7 0 0 1 7-7 7 7 0 0 1 7 7H5z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground/80">Assistant CV</p>
                  <p className="text-sm mt-1">Posez votre première question ci-dessous</p>
                </div>
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuestion(s)}
                    className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/70 hover:border-accent/30 hover:text-foreground hover:bg-accent/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Bot avatar on the left */}
                {msg.role === "assistant" && <BotAvatar />}

                {/* Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-accent text-white rounded-br-none"
                      : "bg-white/[0.07] border border-white/10 text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="leading-relaxed">{msg.content}</p>
                  ) : (
                    <MarkdownMessage content={msg.content} />
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {chargement && (
            <div className="flex gap-2.5 justify-start">
              <BotAvatar />
              <div className="bg-white/[0.07] border border-white/10 text-foreground rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.4s" }} />
                </span>
                <span className="text-xs text-foreground/50">En train de répondre...</span>
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          {/* Quick suggestions when chatting */}
          {messages.length > 0 && messages.length < 3 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuestion(s)}
                  className="text-xs rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-foreground/60 hover:border-accent/30 hover:text-foreground hover:bg-accent/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={envoyer} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez une question sur le CV..."
              className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              disabled={chargement}
            />
            <button
              type="submit"
              disabled={chargement || !question.trim()}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
