"use client";

import { useState, useRef, useEffect } from "react";
import { AssistantService } from "../../../../services/assistantService";

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

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Assistant IA</h1>
          <p className="text-sm text-foreground/60 mt-1">Posez vos questions à l'assistant basé sur le CV et l'API</p>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-foreground/60">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mb-3 opacity-50">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <p>Aucun message pour le moment</p>
              <p className="text-sm mt-1">Posez votre première question ci-dessous</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-accent text-white rounded-br-none"
                      : "bg-white/10 text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {chargement && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-foreground rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <form onSubmit={envoyer} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez une question..."
              className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
              disabled={chargement}
            />
            <button
              type="submit"
              disabled={chargement || !question.trim()}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
