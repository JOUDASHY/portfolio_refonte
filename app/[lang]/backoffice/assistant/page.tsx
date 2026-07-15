"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  AssistantService,
  ChatMessage,
  Conversation,
} from "../../../services/assistantService";
import Modal from "../../../ux/ui/Modal";

/* ═══════════════════════════════════════════════════════════
   COPY BUTTON
═══════════════════════════════════════════════════════════ */
function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={copy}
      title="Copier dans le presse-papier"
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
        copied
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "assistant-pill text-foreground/70 hover:bg-white/10 hover:text-foreground"
      }`}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Copié !
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   CODE BLOCK
═══════════════════════════════════════════════════════════ */
function CodeBlock({ children, language }: { children: string; language?: string }) {
  const lang = language?.replace("language-", "") || "code";
  return (
    <div className="my-3 rounded-xl overflow-hidden border assistant-border">
      <div className="flex items-center justify-between px-4 py-2 assistant-surface-muted border-b assistant-border">
        <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">{lang}</span>
        <CopyButton text={children} label="Copier le code" />
      </div>
      <pre className="overflow-x-auto p-4 bg-black/40 text-xs font-mono leading-relaxed">
        <code className="text-green-300">{children}</code>
      </pre>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LETTER BLOCK (blockquote = texte prêt à l'emploi)
═══════════════════════════════════════════════════════════ */
function LetterBlock({ children, rawText }: { children: React.ReactNode; rawText: string }) {
  return (
    <div className="my-3 rounded-xl border border-accent/20 bg-accent/[0.03] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-accent/[0.06] border-b border-accent/15">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-accent/70">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <span className="text-xs font-semibold text-accent/70 uppercase tracking-wider">
            Message prêt à l&apos;emploi
          </span>
        </div>
        <CopyButton text={rawText} label="Copier le message" />
      </div>
      <div className="px-5 py-4 text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap font-sans">
        {children}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  
  const childrenText = node.children ? node.children.map(extractText).join("") : "";
  
  switch (node.type) {
    case "paragraph":
      return childrenText + "\n\n";
    case "heading":
      return childrenText + "\n\n";
    case "listItem":
      return "• " + childrenText + "\n";
    case "list":
      return childrenText + "\n";
    case "blockquote":
      return childrenText;
    default:
      return childrenText;
  }
}

function preprocessContent(text: string): string {
  if (!text) return "";

  let result = text;
  
  // Remplacer les guillemets français et smart par des guillemets normaux
  result = result.replace(/[«“]([\s\S]{80,}?)[»”]/g, '"$1"');
  
  // Trouver les blocs de textes de plus de 80 caractères entourés de guillemets contenant au moins un retour à la ligne
  result = result.replace(/"([\s\S]{80,}?)"/g, (match, p1) => {
    if (!p1.includes("\n")) return match;
    const blockquoted = p1
      .split("\n")
      .map((line: string) => `> ${line}`)
      .join("\n");
    return `\n\n${blockquoted}\n\n`;
  });

  return result;
}

/* ═══════════════════════════════════════════════════════════
   MARKDOWN RENDERER
═══════════════════════════════════════════════════════════ */
function MarkdownMessage({ content }: { content: string }) {
  const processed = preprocessContent(content);
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-foreground mb-3 mt-4 first:mt-0 pb-2 border-b border-white/10">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold text-foreground mb-2 mt-4 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-foreground/90 mb-1.5 mt-3 first:mt-0">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-sm text-foreground/85 leading-7 mb-3 last:mb-0">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-foreground/70">{children}</em>,
        ul: ({ children }) => <ul className="my-2 space-y-1.5">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 space-y-1.5 list-decimal pl-5">{children}</ol>,
        li: ({ children }) => (
          <li className="text-sm text-foreground/85 leading-relaxed flex items-start gap-2.5">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
            <span>{children}</span>
          </li>
        ),
        code: ({ children, className }) => {
          const text = String(children).replace(/\n$/, "");
          const isBlock = !!className?.includes("language-") || text.includes("\n");
          if (isBlock) return <CodeBlock language={className}>{text}</CodeBlock>;
          return (
            <code className="bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-accent/90">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children, node }) => {
          const rawText = node ? extractText(node).trim() : String(children).trim();
          return <LetterBlock rawText={rawText}>{children}</LetterBlock>;
        },
        hr: () => <hr className="border-white/10 my-4" />,
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent/70 transition-colors">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-semibold text-foreground/70 border-b border-white/10">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-xs text-foreground/80 border-b border-white/5">{children}</td>
        ),
      }}
    >
      {processed}
    </ReactMarkdown>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOT AVATAR
═══════════════════════════════════════════════════════════ */
function BotAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mt-0.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5m9 0a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5M5 21a7 7 0 0 1 7-7 7 7 0 0 1 7 7H5z" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONVERSATION SIDEBAR ITEM
═══════════════════════════════════════════════════════════ */
function ConvItem({
  conv,
  active,
  onSelect,
  onDelete,
  onRename,
}: {
  conv: Conversation;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conv.title);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function submitRename() {
    if (draft.trim() && draft !== conv.title) onRename(draft.trim());
    setEditing(false);
    setShowMenu(false);
  }

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150 ${
        active
          ? "bg-white/10 text-foreground"
          : "text-foreground/60 hover:bg-white/5 hover:text-foreground/90"
      }`}
      onClick={() => { if (!editing) onSelect(); }}
    >
      {/* Icon */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-foreground/40">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>

      {/* Title / input */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={submitRename}
          onKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") { setEditing(false); setDraft(conv.title); } }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-b border-accent/50 text-xs text-foreground focus:outline-none py-0.5"
        />
      ) : (
        <span className="flex-1 text-xs truncate">{conv.title}</span>
      )}

      {/* Badge message count */}
      {!editing && (
        <span className="shrink-0 text-[10px] text-foreground/30">
          {conv.message_count}
        </span>
      )}

      {/* Menu (3 dots) */}
      {!editing && (
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu((v) => !v); }}
            className="p-1 rounded hover:bg-white/10 text-foreground/50 hover:text-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-7 z-50 w-36 rounded-lg border assistant-border assistant-menu shadow-xl py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { setEditing(true); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground/70 hover:bg-white/5 hover:text-foreground transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Renommer
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" />
                </svg>
                Supprimer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════ */
export default function AssistantPage() {
  /* ── State ── */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [jobOfferText, setJobOfferText] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ── Charger la liste des conversations ── */
  useEffect(() => {
    AssistantService.getConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, []);

  /* ── Auto-scroll ── */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  /* ── Sélectionner une conversation ── */
  async function selectConv(id: number) {
    if (id === activeConvId) return;
    setActiveConvId(id);
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const detail = await AssistantService.getConversation(id);
      setMessages(detail.messages);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }

  /* ── Nouvelle conversation ── */
  function newConversation() {
    setActiveConvId(null);
    setMessages([]);
    inputRef.current?.focus();
  }

  const handleSuggestionClick = (s: string) => {
    if (s === "Rédigez-moi un message pour répondre à une offre d'emploi") {
      setIsOfferModalOpen(true);
    } else {
      setQuestion(s);
      inputRef.current?.focus();
    }
  };

  async function handleGenerateFromOffer() {
    if (!jobOfferText.trim() || sending) return;
    setIsOfferModalOpen(false);

    const rawOffer = jobOfferText.trim();
    const formattedPrompt = `Bonjour, voici une offre d'emploi à laquelle je souhaite postuler :\n\n${rawOffer}\n\nEn te basant sur mon CV, rédige-moi un message d'accompagnement/de motivation sur‑mesure pour postuler à cette offre (mail, message LinkedIn ou lettre de motivation). Fais ressortir mes compétences les plus pertinentes pour ce poste. Réponds en 100 mots maximum, de façon très concise et percutante. N'oublie pas d'inclure mon numéro WhatsApp (+261348655523) et le lien de mon portfolio (https://portfolio-nilsen.unityfianar.site) à la fin du message.`;

    const userMsg: ChatMessage = { role: "user", content: `Rédigez-moi un message pour répondre à cette offre d'emploi :\n\n${rawOffer}` };
    setMessages((prev) => [...prev, userMsg]);
    setJobOfferText("");
    setSending(true);

    try {
      const res = await AssistantService.chat(formattedPrompt, activeConvId ?? undefined);

      if (!activeConvId) {
        setActiveConvId(res.conversation_id);
        AssistantService.getConversations().then(setConversations).catch(() => {});
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId ? { ...c, message_count: c.message_count + 2 } : c
          )
        );
      }

      setMessages((prev) => [...prev, { role: "assistant", content: res.reponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur : impossible de contacter l'assistant." },
      ]);
    } finally {
      setSending(false);
    }
  }

  /* ── Envoyer un message ── */
  async function envoyer(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || sending) return;

    const userMsg: ChatMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setSending(true);

    try {
      const res = await AssistantService.chat(question, activeConvId ?? undefined);

      /* Si nouvelle conversation → l'ajouter à la sidebar */
      if (!activeConvId) {
        setActiveConvId(res.conversation_id);
        // Recharger la liste pour avoir le titre auto-généré
        AssistantService.getConversations().then(setConversations).catch(() => {});
      } else {
        // Mettre à jour le message_count local
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId ? { ...c, message_count: c.message_count + 2 } : c
          )
        );
      }

      setMessages((prev) => [...prev, { role: "assistant", content: res.reponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur : impossible de contacter l'assistant." },
      ]);
    } finally {
      setSending(false);
    }
  }

  /* ── Supprimer une conversation ── */
  async function deleteConv(id: number) {
    try {
      await AssistantService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) newConversation();
    } catch {}
  }

  /* ── Renommer une conversation ── */
  async function renameConv(id: number, title: string) {
    try {
      await AssistantService.renameConversation(id, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
    } catch {}
  }

  /* ── Auto-resize textarea ── */
  function adjustHeight() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); }
  }

  const suggestions = [
    "Quelles sont ses compétences ?",
    "Parle-moi de ses expériences",
    "Quels projets a-t-il réalisé ?",
    "Quelle est sa formation ?",
    "Rédigez-moi un message pour répondre à une offre d'emploi",
  ];

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden">

      {/* ══════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════
          ZONE PRINCIPALE
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b assistant-border assistant-surface-muted">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Masquer le panneau" : "Afficher le panneau"}
            className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            {activeConvId ? (
              <p className="text-sm font-medium text-foreground/80 truncate">
                {conversations.find((c) => c.id === activeConvId)?.title ?? "Conversation"}
              </p>
            ) : (
              <p className="text-sm text-foreground/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Nouvelle conversation
              </p>
            )}
          </div>

          {activeConvId && (
            <button
              onClick={newConversation}
              className="inline-flex items-center gap-1.5 rounded-lg border assistant-border assistant-pill px-3 py-1.5 text-xs text-foreground/70 hover:text-foreground transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Nouveau chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {loadingMsgs ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-foreground/30">
              <span className="flex gap-1.5">
                {[0, 0.15, 0.3].map((d, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </span>
              <p className="text-xs">Chargement...</p>
            </div>

          ) : messages.length === 0 ? (
            /* ── Empty state ── */
            <div className="h-full flex flex-col items-center justify-center gap-8 px-6 text-foreground/60">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-accent/70">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5m9 0a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5M5 21a7 7 0 0 1 7-7 7 7 0 0 1 7 7H5z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground/80">Assistant CV</p>
                  <p className="text-sm mt-1 text-foreground/50">Posez votre première question</p>
                </div>
              </div>

              {/* Suggestion vedette */}
              <button
                onClick={() => handleSuggestionClick("Rédigez-moi un message pour répondre à une offre d'emploi")}
                className="group flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3.5 text-left hover:border-accent/50 hover:bg-accent/10 transition-all max-w-sm w-full"
              >
                <span className="shrink-0 w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-accent/80 uppercase tracking-wider mb-0.5">✦ Suggestion</p>
                  <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-snug">
                    Rédigez-moi un message pour répondre à une offre d&apos;emploi
                  </p>
                </div>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-foreground/25 group-hover:text-accent/50 shrink-0 transition-colors">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
              </button>

              {/* Chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestions.slice(0, 4).map((s) => (
                  <button key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="text-xs rounded-full border assistant-border assistant-pill px-3 py-1.5 text-foreground/70 hover:border-accent/30 hover:text-foreground hover:bg-accent/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          ) : (
            /* ── Messages ── */
            <div className="py-4 space-y-0">
              {messages.map((msg, i) => (
                <div key={i}
                  className={`px-4 sm:px-6 py-4 ${
                    msg.role === "user"
                      ? "bg-transparent"
                      : "assistant-surface-muted border-y assistant-border"
                  }`}
                >
                  <div className="w-full">
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] assistant-user-bubble border rounded-2xl rounded-br-sm px-4 py-3">
                          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 group">
                        <BotAvatar />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-accent/60 mb-2 uppercase tracking-wider">
                            Assistant
                          </p>
                          <MarkdownMessage content={msg.content} />
                          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CopyButton text={msg.content} label="Copier" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing */}
              {sending && (
                <div className="px-4 sm:px-6 py-4 assistant-surface-muted border-y assistant-border">
                  <div className="w-full flex gap-3">
                    <BotAvatar />
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-accent/60 mb-3 uppercase tracking-wider">Assistant</p>
                      <div className="flex items-center gap-2">
                        <span className="flex gap-1">
                          {[0, 0.15, 0.3].map((d, i) => (
                            <span key={i} className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: `${d}s` }} />
                          ))}
                        </span>
                        <span className="text-xs text-foreground/40">En train de rédiger...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} className="h-4" />
            </div>
          )}
        </div>

        {/* ── Input ── */}
        <div className="px-4 pb-4 pt-3 border-t assistant-border assistant-surface-muted">
          {!loadingMsgs && messages.length > 0 && messages.length < 4 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {suggestions.map((s) => (
                <button key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="text-xs rounded-full border assistant-border assistant-pill px-2.5 py-1 text-foreground/70 hover:border-accent/30 hover:text-foreground hover:bg-accent/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="relative rounded-2xl border assistant-border assistant-input focus-within:border-accent/40 transition-all duration-200 shadow-lg">
            <textarea
              ref={inputRef}
              rows={1}
              value={question}
              onChange={(e) => { setQuestion(e.target.value); adjustHeight(); }}
              onKeyDown={handleKeyDown}
              placeholder="Envoyer un message… (Entrée pour envoyer, Maj+Entrée = nouvelle ligne)"
              disabled={sending}
              className="w-full resize-none bg-transparent px-5 py-4 pr-16 text-sm text-foreground placeholder-foreground/30 focus:outline-none leading-relaxed max-h-40 overflow-y-auto"
              style={{ minHeight: "56px" }}
            />
            <button
              onClick={() => envoyer()}
              disabled={sending || !question.trim()}
              className={`absolute right-3 bottom-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                question.trim() && !sending
                  ? "bg-accent hover:brightness-110 shadow-lg shadow-accent/25"
                  : "bg-white/10 opacity-40 cursor-not-allowed"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SIDEBAR — droite
      ══════════════════════════════════════════════════ */}
      <aside
        className={`flex flex-col border-l assistant-border assistant-surface-muted transition-all duration-300 overflow-hidden ${
          sidebarOpen ? "w-64 min-w-[200px]" : "w-0"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b assistant-border assistant-surface">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Conversations</span>
          <button
            onClick={newConversation}
            title="Nouvelle conversation"
            className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 hover:bg-accent/25 transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-accent">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {loadingConvs ? (
            <div className="flex flex-col gap-2 p-2 pt-4">
              {[80, 65, 90, 55].map((w, i) => (
                <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-foreground/50 text-center py-8 px-4">
              Aucune conversation.<br />Commencez à écrire !
            </p>
          ) : (
            conversations.map((conv) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={conv.id === activeConvId}
                onSelect={() => selectConv(conv.id)}
                onDelete={() => deleteConv(conv.id)}
                onRename={(title) => renameConv(conv.id, title)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Modal pour coller l'offre d'emploi */}
      <Modal
        open={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Répondre à une offre d'emploi"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-foreground/60 leading-relaxed">
            Collez la description ou le texte de l&apos;offre d&apos;emploi ci-dessous. L&apos;assistant va générer un message d&apos;accompagnement personnalisé (mail, lettre ou message LinkedIn) basé sur votre profil et votre CV.
          </p>
          <textarea
            value={jobOfferText}
            onChange={(e) => setJobOfferText(e.target.value)}
            placeholder="Exemple : Karytis IT recrute un(e) DevOps Java Full Stack... (Collez toute la description de poste ici)"
            className="w-full min-h-[250px] resize-y rounded-xl border assistant-border assistant-input p-4 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 leading-relaxed font-sans"
          />
          <div className="flex justify-end gap-2.5">
            <button
              onClick={() => setIsOfferModalOpen(false)}
              className="rounded-lg border assistant-border assistant-pill px-4 py-2 text-xs font-semibold text-foreground/75 hover:bg-white/10 hover:text-foreground transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleGenerateFromOffer}
              disabled={sending || !jobOfferText.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white shadow-lg shadow-accent/25 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              {sending ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Génération...
                </>
              ) : (
                "Générer la réponse"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

