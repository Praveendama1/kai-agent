import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  Cpu,
  CreditCard,
  DollarSign,
  GitBranch,
  LayoutDashboard,
  Menu,
  Mic,
  PieChart,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AnalyzersPage } from "./components/AnalyzersPage";
import { ChatModal } from "./components/ChatModal";
import { Dashboard } from "./components/Dashboard";
import { FlowsPage } from "./components/FlowsPage";
import { MarketsPage } from "./components/MarketsPage";
import { PaymentMethodsPanel } from "./components/PaymentMethodsPanel";
import { PortfolioPage } from "./components/PortfolioPage";
import { PricingPage } from "./components/PricingPage";
import { SecurityPage } from "./components/SecurityPage";
import { StrategiesPage } from "./components/StrategiesPage";
import { TradePage } from "./components/TradePage";
import { useMarketSimulator } from "./hooks/useMarketSimulator";

type Tab =
  | "dashboard"
  | "markets"
  | "portfolio"
  | "trade"
  | "flows"
  | "analyzers"
  | "strategies";
type Page = "main" | "pricing" | "security";

const NAV_TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "markets", label: "Markets", icon: TrendingUp },
  { id: "portfolio", label: "Portfolio", icon: PieChart },
  { id: "trade", label: "Trade", icon: Zap },
  { id: "flows", label: "Flows", icon: GitBranch },
  { id: "analyzers", label: "Analyzers", icon: Cpu },
  { id: "strategies", label: "Strategies", icon: Target },
];

export default function App() {
  const [page, setPage] = useState<Page>("main");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMsg, setChatInitialMsg] = useState("");
  const [agentBarInput, setAgentBarInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const [tradeSymbol, setTradeSymbol] = useState<string | undefined>(undefined);
  const [showPayments, setShowPayments] = useState(false);
  const markets = useMarketSimulator();

  const openChat = (msg?: string) => {
    setChatInitialMsg(msg ?? "");
    setChatOpen(true);
  };

  const handleAgentBarSubmit = () => {
    if (agentBarInput.trim()) {
      openChat(agentBarInput.trim());
      setAgentBarInput("");
    } else {
      openChat();
    }
  };

  const switchToFlows = () => {
    setPage("main");
    setActiveTab("flows");
  };
  const switchToTrade = (symbol?: string) => {
    setPage("main");
    setActiveTab("trade");
    if (symbol) setTradeSymbol(symbol);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster theme="dark" />

      {/* Top Navigation */}
      <header
        className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm"
        data-ocid="nav.panel"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-sm">
              Kai Agent
            </span>
          </div>

          {/* Main tabs — center */}
          {page === "main" && (
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {NAV_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-ocid="nav.tab"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Payment Methods button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setShowPayments(true)}
              data-ocid="nav.open_modal_button"
              title="Payment Methods"
            >
              <CreditCard className="h-4 w-4" />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                data-ocid="nav.toggle"
              >
                <Bell className="h-4 w-4" />
              </Button>
              {notifications > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPage("security")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                page === "security"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              <Shield className="h-3.5 w-3.5" />
              Security
            </button>
            <button
              type="button"
              onClick={() => setPage("pricing")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === "pricing"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              <DollarSign className="h-3.5 w-3.5" />
              Pricing
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border overflow-hidden lg:hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setPage("main");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPage("security");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Shield className="h-4 w-4" />
                  Security
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPage("pricing");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Market Ticker Bar */}
      {page === "main" && (
        <div className="border-b border-border bg-card/40 px-4 py-1.5 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground hidden sm:block">
                Live · 12 Assets
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-none py-0.5">
              {markets.map((m) => (
                <span
                  key={m.symbol}
                  className="text-xs flex items-center gap-1 shrink-0"
                >
                  <span className="text-muted-foreground">{m.symbol}</span>
                  <span
                    className={
                      m.change >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {m.change >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5 inline" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 inline" />
                    )}
                    {m.change >= 0 ? "+" : ""}
                    {m.change.toFixed(2)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-28">
        <AnimatePresence mode="wait">
          {page === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === "dashboard" && (
                <Dashboard
                  markets={markets}
                  onOpenChat={openChat}
                  onSwitchToFlows={switchToFlows}
                  onSwitchToTrade={switchToTrade}
                />
              )}
              {activeTab === "markets" && (
                <MarketsPage
                  markets={markets}
                  onOpenChat={openChat}
                  onSwitchToTrade={switchToTrade}
                />
              )}
              {activeTab === "portfolio" && (
                <PortfolioPage
                  markets={markets}
                  onOpenChat={openChat}
                  onSwitchToTrade={switchToTrade}
                />
              )}
              {activeTab === "trade" && (
                <TradePage markets={markets} initialSymbol={tradeSymbol} />
              )}
              {activeTab === "flows" && <FlowsPage />}
              {activeTab === "analyzers" && <AnalyzersPage />}
              {activeTab === "strategies" && <StrategiesPage />}
            </motion.div>
          )}
          {page === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="ghost"
                onClick={() => setPage("main")}
                className="mb-4 text-muted-foreground"
                data-ocid="pricing.secondary_button"
              >
                ← Back
              </Button>
              <PricingPage />
            </motion.div>
          )}
          {page === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="ghost"
                onClick={() => setPage("main")}
                className="mb-4 text-muted-foreground"
                data-ocid="security.secondary_button"
              >
                ← Back
              </Button>
              <SecurityPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Agent Bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-30 p-3 border-t border-border bg-background/95 backdrop-blur-md"
        data-ocid="agentbar.panel"
      >
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 focus-within:border-primary/50 transition-colors">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <input
              value={agentBarInput}
              onChange={(e) => setAgentBarInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAgentBarSubmit()}
              onClick={() => !agentBarInput && openChat()}
              placeholder="Ask Kai anything about markets, portfolio, workflows..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              data-ocid="agentbar.input"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0"
              data-ocid="agentbar.toggle"
            >
              <Mic className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setPage("main");
              setActiveTab("flows");
              handleAgentBarSubmit();
            }}
            className="bg-primary hover:bg-primary/80 text-primary-foreground text-sm px-4 h-10 rounded-xl shrink-0"
            data-ocid="agentbar.primary_button"
          >
            <GitBranch className="h-3.5 w-3.5 mr-1.5" /> Build Workflow
          </Button>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        markets={markets}
        initialMessage={chatInitialMsg}
      />

      {/* Payment Methods Drawer */}
      <AnimatePresence>
        {showPayments && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPayments(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 flex"
            >
              <PaymentMethodsPanel onClose={() => setShowPayments(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer (hidden, for attribution) */}
      <div className="hidden">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
