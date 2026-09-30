"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  User,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
// useRef kept for messagesEndRef scroll anchor
import { useForm } from "react-hook-form";

import { askPortfolioAssistant } from "@/lib/ai-api";
import { cn } from "@/lib/utils";

type TMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const INITIAL_MESSAGE: TMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm Shawon's AI assistant. Ask me about his projects, skills, experience or availability — I'll do my best to help."
};

const SUGGESTED_PROMPTS = [
  "What projects has he built?",
  "What's his tech stack?",
  "Is he available for work?",
  "Tell me about his experience."
];

function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  const key = "portfolio-ai-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, watch, setFocus } = useForm<{
    query: string;
  }>({ defaultValues: { query: "" } });

  const query = watch("query");

  useEffect(() => {
    if (open) {
      setTimeout(() => setFocus("query"), 100);
    }
  }, [open, setFocus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: TMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askPortfolioAssistant(text.trim(), getSessionId());
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: response
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "I'm temporarily unavailable. Please use the contact form to reach Shawon directly."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = ({ query }: { query: string }) => {
    reset();
    sendMessage(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-line-strong bg-glass-strong shadow-lift backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-gradient-to-r from-brand/10 to-brand-2/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-soft">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fg">Portfolio Assistant</p>
                  <p className="text-xs text-muted">Powered by Gemini AI</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="rounded-xl p-2 text-muted transition hover:bg-glass hover:text-fg"
              >
                <X size={17} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6",
                      msg.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-brand to-brand-2 text-white"
                        : "rounded-bl-md bg-glass text-fg"
                    )}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-glass text-muted">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-glass px-4 py-2.5">
                    <Loader2 size={15} className="animate-spin text-muted" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (shown only initially) */}
            {messages.length === 1 && (
              <div className="border-t border-line px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-line bg-glass px-3 py-1 text-xs text-muted transition hover:border-brand/40 hover:text-fg"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border-t border-line bg-glass p-3"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-ink/30 px-4 py-2.5 transition focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/10">
                <input
                  {...register("query")}
                  placeholder="Ask me anything…"
                  autoComplete="off"
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted/60 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  aria-label="Send message"
                  className="text-brand transition hover:text-brand-bright disabled:opacity-30"
                >
                  <Send size={17} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 text-white shadow-lift transition-shadow hover:shadow-[0_8px_32px_color-mix(in_oklab,var(--color-accent-bright)_40%,transparent)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="absolute"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>

        {!open && messages.length === 1 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-bright text-[9px] font-bold text-ink">
            AI
          </span>
        )}
      </motion.button>
    </div>
  );
}
