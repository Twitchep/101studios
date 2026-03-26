import { useEffect, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadContentWithLiveEditor } from "@/utils/contentLoader";

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type SiteSnapshot = {
  products: Array<{ title: string; category?: string; price?: number }>;
  portfolio: Array<{ title: string; category?: string }>;
  updates: Array<{ title: string; created_at?: string }>;
};

type AssistantReply = {
  text: string;
  route?: string;
};

const quickPrompts = [
  "Show me products",
  "Open portfolio",
  "Latest updates",
  "How can I contact you?",
];

const containsAny = (value: string, terms: string[]) => terms.some((term) => value.includes(term));

export default function AIAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [snapshot, setSnapshot] = useState<SiteSnapshot>({ products: [], portfolio: [], updates: [] });
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I’m TWITCH. I can guide you through products, portfolio, updates, and contact details.",
    },
  ]);

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        const [productsRaw, portfolioRaw, updatesRaw] = await Promise.all([
          loadContentWithLiveEditor("products", "products"),
          loadContentWithLiveEditor("portfolio", "portfolio_items"),
          loadContentWithLiveEditor("updates", "live_updates"),
        ]);

        const products = (Array.isArray(productsRaw) ? productsRaw : []).slice(0, 6).map((product: any) => ({
          title: product.title ?? "Product",
          category: product.category,
          price: typeof product.price === "number" ? product.price : undefined,
        }));

        const portfolio = (Array.isArray(portfolioRaw) ? portfolioRaw : []).slice(0, 6).map((item: any) => ({
          title: item.title ?? "Project",
          category: item.category,
        }));

        const updates = (Array.isArray(updatesRaw) ? updatesRaw : []).slice(0, 6).map((item: any) => ({
          title: item.title ?? "Update",
          created_at: item.created_at,
        }));

        setSnapshot({ products, portfolio, updates });
      } catch (error) {
        console.error("Assistant context load failed:", error);
      }
    };

    loadSnapshot();
  }, []);

  const latestProductLine = useMemo(() => {
    if (snapshot.products.length === 0) {
      return "I can open the shop page so you can browse everything.";
    }

    const firstThree = snapshot.products.slice(0, 3).map((item) => item.title).join(", ");
    return `Top items right now include ${firstThree}.`;
  }, [snapshot.products]);

  const latestPortfolioLine = useMemo(() => {
    if (snapshot.portfolio.length === 0) {
      return "I can open the portfolio page to explore recent projects.";
    }

    const firstThree = snapshot.portfolio.slice(0, 3).map((item) => item.title).join(", ");
    return `Recent portfolio highlights include ${firstThree}.`;
  }, [snapshot.portfolio]);

  const latestUpdatesLine = useMemo(() => {
    if (snapshot.updates.length === 0) {
      return "I can open the updates section so you can see the latest announcements.";
    }

    return `Latest update: ${snapshot.updates[0].title}.`;
  }, [snapshot.updates]);

  const buildReply = (rawText: string): AssistantReply => {
    const text = rawText.trim().toLowerCase();
    const wantsNavigation = containsAny(text, ["open", "go", "take", "show", "navigate"]);

    if (containsAny(text, ["hello", "hi", "hey"])) {
      return {
        text: "Hello! Ask me about products, portfolio, updates, videos, or contact and I’ll guide you instantly.",
      };
    }

    if (containsAny(text, ["help", "what can you do"])) {
      return {
        text: "I can guide visitors to Shop, Portfolio, Updates, Videos, and Contact pages. I also provide quick summaries from your site content.",
      };
    }

    if (containsAny(text, ["shop", "product", "buy", "price", "cart"])) {
      return {
        text: `${latestProductLine} ${wantsNavigation ? "Opening the shop page now." : "Say 'open shop' and I’ll take you there."}`,
        route: wantsNavigation ? "/shop" : undefined,
      };
    }

    if (containsAny(text, ["portfolio", "design", "project", "work"])) {
      return {
        text: `${latestPortfolioLine} ${wantsNavigation ? "Opening portfolio now." : "Say 'open portfolio' and I’ll take you there."}`,
        route: wantsNavigation ? "/portfolio" : undefined,
      };
    }

    if (containsAny(text, ["news", "update", "blog", "latest"])) {
      return {
        text: `${latestUpdatesLine} ${wantsNavigation ? "Opening updates now." : "Say 'open updates' and I’ll take you there."}`,
        route: wantsNavigation ? "/updates" : undefined,
      };
    }

    if (containsAny(text, ["video", "youtube", "watch"])) {
      return {
        text: wantsNavigation
          ? "Opening videos now so you can watch the latest content."
          : "I can take you to the videos page. Say 'open videos'.",
        route: wantsNavigation ? "/videos" : undefined,
      };
    }

    if (containsAny(text, ["contact", "whatsapp", "email", "call"])) {
      return {
        text: wantsNavigation
          ? "Opening contact page now so you can reach the team quickly."
          : "You can contact the team directly from the Contact page. Say 'open contact'.",
        route: wantsNavigation ? "/contact" : undefined,
      };
    }

    if (containsAny(text, ["about", "company", "who are you"])) {
      return {
        text: wantsNavigation
          ? "Opening the About page now."
          : "I can open the About page for you. Say 'open about'.",
        route: wantsNavigation ? "/about" : undefined,
      };
    }

    return {
      text: "I can help with products, portfolio, updates, videos, and contact. Try asking: 'open shop' or 'latest updates'.",
    };
  };

  const askAssistantApi = async (conversation: AssistantMessage[]): Promise<AssistantReply> => {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentRoute: location.pathname,
        snapshot,
        messages: conversation.map((message) => ({
          role: message.role,
          content: message.text,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Assistant API unavailable");
    }

    const data = await response.json();
    return {
      text: String(data?.reply || "I’m here and ready to help."),
      route: typeof data?.suggestedRoute === "string" ? data.suggestedRoute : undefined,
    };
  };

  const sendMessage = async (messageText?: string) => {
    const content = (messageText ?? input).trim();
    if (!content || isTyping) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: content,
    };

    const nextConversation = [...messages, userMessage];
    setMessages(nextConversation);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await askAssistantApi(nextConversation);

      const assistantMessage: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: reply.text,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reply.route) {
        if (location.pathname !== reply.route) {
          navigate(reply.route);
        }
      }
    } catch (error) {
      const fallback = buildReply(content);
      const assistantMessage: AssistantMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: "assistant",
        text: fallback.text,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (fallback.route && location.pathname !== fallback.route) {
        navigate(fallback.route);
      }

      console.error("Assistant fallback triggered:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {isOpen && (
        <div className="mb-4 w-[22rem] max-w-[calc(100vw-2rem)] rounded-[1.5rem] border border-white/20 bg-black/70 backdrop-blur-2xl shadow-[0_18px_70px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl border border-primary/35 bg-primary/15 flex items-center justify-center">
                <Bot size={17} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-primary font-orbitron">AI Assistant</p>
                <p className="text-xs text-white/70 font-rajdhani">TWITCH • Website Navigator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-white/10 p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X size={15} />
            </button>
          </div>

          <div className="max-h-[22rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-white/15 bg-black/40 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white/80">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white/80 transition hover:border-primary/35 hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ask TWITCH anything about the website..."
                className="h-10 flex-1 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-primary/40"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-[1.03]"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group inline-flex items-center gap-2 rounded-full border border-primary/35 bg-black/60 px-4 py-3 text-sm text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-[0_12px_35px_rgba(249,115,22,0.35)]"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/30">
          {isOpen ? <X size={15} /> : <MessageCircle size={15} />}
        </span>
        <span className="font-orbitron uppercase tracking-[0.08em] text-[11px]">TWITCH</span>
        <Sparkles size={14} className="text-primary" />
      </button>
    </div>
  );
}
