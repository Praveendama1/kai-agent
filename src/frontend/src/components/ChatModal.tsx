import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Mic, Plus, Send, Sparkles, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateResponse } from "../engine/ChatEngine";
import type { MarketData } from "../engine/ChatEngine";
import { useActor } from "../hooks/useActor";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  createdAt: Date;
  messages: Message[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  markets: MarketData[];
  initialMessage?: string;
}

const SUGGESTIONS = [
  "MSFT Analysis",
  "Market Summary",
  "Portfolio Risk",
  "Upgrade Plan",
  "BTC Warning?",
  "Active Workflows",
];

const LS_KEY = "kai_chat_sessions";

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((s: ChatSession) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      messages: s.messages.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(sessions.slice(0, 20)));
}

function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    const key = `${i}-${p.slice(0, 8)}`;
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={key}>{p.slice(2, -2)}</strong>;
    }
    return <span key={key}>{p}</span>;
  });
}

export function ChatModal({ open, onClose, markets, initialMessage }: Props) {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [registered, setRegistered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { actor } = useActor();
  const initialMessageRef = useRef(initialMessage);
  const initialHandledRef = useRef(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  // Register and sync with backend
  useEffect(() => {
    if (!actor || registered) return;
    (async () => {
      try {
        const isReg = await actor.isRegistered();
        if (!isReg) await actor.register();
        setRegistered(true);
        // Sync sessions from backend
        const backendSessions = await actor.getAllSessions();
        if (backendSessions.length > 0 && sessions.length === 0) {
          // Load first session messages
          const msgs = await actor.getMessages(backendSessions[0]);
          const session: ChatSession = {
            id: backendSessions[0],
            name: msgs[0]?.content.slice(0, 30) ?? "Session",
            createdAt: new Date(),
            messages: msgs.map((m) => ({
              id: crypto.randomUUID(),
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp: new Date(Number(m.timestamp) / 1_000_000),
            })),
          };
          setSessions([session]);
          setActiveSessionId(session.id);
        }
      } catch {
        // Backend unavailable — use local storage only
        setRegistered(true);
      }
    })();
  }, [actor, registered, sessions.length]);

  const createNewSession = useCallback(() => {
    const id = crypto.randomUUID();
    const session: ChatSession = {
      id,
      name: "New Chat",
      createdAt: new Date(),
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Hi! I'm Kai, your AI financial agent. I can analyze MSFT, NVDA, BTC, ETH, assess portfolio risk, explain your workflows, and more. What would you like to explore today?",
          timestamp: new Date(),
        },
      ],
    };
    setSessions((prev) => {
      const updated = [session, ...prev];
      saveSessions(updated);
      return updated;
    });
    setActiveSessionId(id);
    if (actor) {
      actor.createSession(id).catch(() => {});
    }
    return session;
  }, [actor]);

  // Initialize on first open
  const firstSessionId = sessions[0]?.id;
  useEffect(() => {
    if (!open) return;
    if (sessions.length === 0) {
      createNewSession();
    } else if (!activeSessionId) {
      setActiveSessionId(firstSessionId ?? null);
    }
  }, [
    open,
    sessions.length,
    activeSessionId,
    createNewSession,
    firstSessionId,
  ]);

  // Handle initial message from outside
  useEffect(() => {
    if (
      !open ||
      !initialMessage ||
      initialMessage === initialMessageRef.current ||
      initialHandledRef.current
    )
      return;
    if (initialMessage && activeSessionId) {
      initialHandledRef.current = true;
      setInput(initialMessage);
    }
  }, [open, initialMessage, activeSessionId]);

  useEffect(() => {
    if (open) {
      initialHandledRef.current = false;
      initialMessageRef.current = initialMessage;
    }
  }, [open, initialMessage]);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, scrollToBottom]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content) return;

      let sessionId = activeSessionId;
      if (!sessionId) {
        const s = createNewSession();
        sessionId = s.id;
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                name: s.messages.length === 1 ? content.slice(0, 35) : s.name,
                messages: [...s.messages, userMsg],
              }
            : s,
        );
        saveSessions(updated);
        return updated;
      });
      setInput("");
      setIsTyping(true);
      scrollToBottom();

      // Persist user message to backend
      if (actor && sessionId) {
        actor
          .addMessage(sessionId, {
            content,
            role: "user",
            timestamp: BigInt(Date.now()) * BigInt(1_000_000),
          })
          .catch(() => {});
      }

      // Generate response
      const delay = 500 + Math.random() * 700;
      await new Promise((r) => setTimeout(r, delay));

      const botContent = generateResponse(content, { markets });
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botContent,
        timestamp: new Date(),
      };

      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...s.messages, botMsg] } : s,
        );
        saveSessions(updated);
        return updated;
      });
      setIsTyping(false);
      scrollToBottom();

      // Persist bot message to backend
      if (actor && sessionId) {
        actor
          .addMessage(sessionId, {
            content: botContent,
            role: "assistant",
            timestamp: BigInt(Date.now()) * BigInt(1_000_000),
          })
          .catch(() => {});
      }
    },
    [input, activeSessionId, actor, markets, createNewSession, scrollToBottom],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="chat.modal"
        >
          <motion.div
            initial={{ scale: 0.97, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 10 }}
            className="relative flex w-full max-w-5xl mx-auto my-4 bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-60 border-r border-border bg-sidebar">
              <div className="p-4 border-b border-border">
                <Button
                  onClick={createNewSession}
                  className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-sm"
                  variant="ghost"
                  data-ocid="chat.open_modal_button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {sessions.map((s, i) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        s.id === activeSessionId
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                      data-ocid={`chat.item.${i + 1}`}
                    >
                      <div className="font-medium truncate">{s.name}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">
                        {s.createdAt.toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center pulse-glow">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-foreground">
                      Kai Agent
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Financial AI · Always on
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  data-ocid="chat.close_button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                ref={scrollRef}
              >
                {(activeSession?.messages ?? []).map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "user" ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary/20 text-foreground rounded-tr-sm"
                          : "bg-secondary text-foreground rounded-tl-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {renderContent(msg.content)}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1.5 opacity-60">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                    data-ocid="chat.loading_state"
                  >
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1 items-center h-4">
                        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Suggestions */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="shrink-0 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-1">
                <div className="flex gap-2 items-end bg-input border border-border rounded-xl px-3 py-2 focus-within:border-primary/50 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about MSFT, portfolio risk, workflows..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-[120px] py-1"
                    rows={1}
                    data-ocid="chat.textarea"
                  />
                  <div className="flex gap-1 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      data-ocid="chat.toggle"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isTyping}
                      className="h-8 w-8 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg"
                      size="icon"
                      data-ocid="chat.submit_button"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
