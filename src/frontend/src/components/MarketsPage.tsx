import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle,
  ChevronRight,
  Eye,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { MarketData } from "../engine/ChatEngine";

const STOCK_META: Record<
  string,
  { name: string; sector: string; color: string }
> = {
  NVDA: { name: "NVIDIA", sector: "AI Semiconductors", color: "#76b900" },
  MSFT: { name: "Microsoft", sector: "Cloud & AI", color: "#00D4FF" },
  AAPL: { name: "Apple", sector: "Consumer Tech", color: "#a8b8c8" },
  TSLA: { name: "Tesla", sector: "EV & Mobility", color: "#cc2233" },
  AMZN: { name: "Amazon", sector: "E-commerce & Cloud", color: "#ff9900" },
  GOOGL: { name: "Google", sector: "Ads & AI", color: "#4285f4" },
  META: { name: "Meta", sector: "Social & AI", color: "#0668e1" },
  NFLX: { name: "Netflix", sector: "Streaming", color: "#e50914" },
  AMD: { name: "AMD", sector: "Semiconductors", color: "#ed1c24" },
  JPM: { name: "JPMorgan", sector: "Banking", color: "#00a0df" },
  BTC: { name: "Bitcoin", sector: "Crypto", color: "#f7931a" },
  ETH: { name: "Ethereum", sector: "Crypto", color: "#627eea" },
};

const AI_INSIGHTS: Record<string, string> = {
  NVDA: "Bullish momentum driven by sustained AI chip demand from hyperscalers.",
  MSFT: "Azure + Copilot integration accelerating enterprise AI adoption.",
  AAPL: "Services revenue diversification reducing hardware cycle dependency.",
  TSLA: "FSD progress key catalyst; high P/E demands execution on Robotaxi.",
  AMZN: "AWS AI services re-accelerating cloud growth beyond market estimates.",
  GOOGL: "Search dominance intact; Gemini AI closing gap with OpenAI.",
  META: "AI ad-targeting delivering record ROI; Reality Labs long-term bet.",
  NFLX: "Ad-tier monetization and password crackdown driving subscriber growth.",
  AMD: "MI300X gaining AI traction; EPYC server CPUs continuing strong growth.",
  JPM: "Strong NIM with AI adoption in finance; defensive dividend play.",
  BTC: "Post-halving consolidation; institutional ETF inflows remain strong.",
  ETH: "Staking yield ~3.8% APR + deflationary supply mechanics.",
};

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 120;
  const h = 40;
  const range = max - min || 1;
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`,
    )
    .join(" ");
  const areaBottom = `${w},${h} 0,${h}`;
  const areaPath = `0,${h - ((data[0] - min) / range) * (h - 2) - 1} ${pts} ${areaBottom}`;
  const color = positive ? "#4ade80" : "#f87171";
  const gradId = positive ? "grad-up" : "grad-dn";
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
      aria-label={positive ? "Price trend up" : "Price trend down"}
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1] - min) / range) * (h - 2) - 1}
        r="2"
        fill={color}
      />
    </svg>
  );
}

function ComparisonChart({
  selected,
  markets,
}: { selected: string[]; markets: MarketData[] }) {
  const COLORS = ["#00D4FF", "#76b900", "#ff9900", "#f87171", "#a78bfa"];
  const w = 600;
  const h = 160;
  const selectedMarkets = selected
    .map((s) => markets.find((m) => m.symbol === s))
    .filter(Boolean) as MarketData[];
  return (
    <div className="overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h}`}
        className="min-w-[320px]"
        aria-label="Stock price comparison chart"
        role="img"
      >
        {selectedMarkets.map((m, idx) => {
          const data = m.sparkline;
          if (!data || data.length < 2) return null;
          const base = data[0];
          const normalized = data.map((v) => ((v - base) / base) * 100);
          const min = Math.min(...normalized);
          const max = Math.max(...normalized);
          const range = max - min || 1;
          const pts = normalized
            .map(
              (v, i) =>
                `${(i / (normalized.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`,
            )
            .join(" ");
          return (
            <polyline
              key={m.symbol}
              points={pts}
              fill="none"
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth="2"
              strokeLinejoin="round"
              opacity="0.9"
            />
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 mt-3">
        {selectedMarkets.map((m, idx) => (
          <div key={m.symbol} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-3 h-0.5 rounded-full inline-block"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-muted-foreground">{m.symbol}</span>
            <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
              {m.change >= 0 ? "+" : ""}
              {m.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type FilterTab = "all" | "stocks" | "crypto";

interface Props {
  markets: MarketData[];
  onOpenChat: (msg?: string) => void;
  onSwitchToTrade?: (symbol: string) => void;
}

export function MarketsPage({ markets, onOpenChat }: Props) {
  const [monitoring, setMonitoring] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");

  const filteredMarkets = markets.filter((m) => {
    if (filter === "stocks") return m.type === "stock";
    if (filter === "crypto") return m.type === "crypto";
    return true;
  });

  const topPerformer = markets.length
    ? markets.reduce((a, b) => (a.change > b.change ? a : b))
    : null;
  const highVolatility = markets.filter((m) => m.volatility === "High");
  const proactiveMsg =
    highVolatility.length > 0
      ? `${highVolatility.map((m) => m.symbol).join(", ")} showing high volatility — consider setting alerts`
      : topPerformer
        ? `${topPerformer.symbol} is today's top performer — create a monitoring workflow?`
        : null;

  function handleMonitor(symbol: string) {
    setMonitoring((prev) => {
      const next = new Set(prev);
      next.add(symbol);
      return next;
    });
    toast.success(`${symbol} monitoring workflow created`, {
      description: `Kai will alert you on significant ${symbol} price moves.`,
      icon: <Zap className="h-4 w-4 text-primary" />,
    });
  }

  function handleAlert(symbol: string) {
    toast.success(`Alert set for ${symbol}`, {
      description: `You'll be notified on significant ${symbol} price moves.`,
      icon: <Bell className="h-4 w-4 text-yellow-400" />,
    });
  }

  function toggleSelect(symbol: string) {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : prev.length < 3
          ? [...prev, symbol]
          : prev,
    );
  }

  const recentlyViewed = markets.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Proactive AI Banner */}
      <AnimatePresence>
        {proactiveMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/8 px-4 py-3"
            data-ocid="markets.panel"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-primary/90 flex-1">
              <span className="font-semibold">Kai:</span> {proactiveMsg}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-primary text-xs h-7 shrink-0"
              onClick={() => onOpenChat(proactiveMsg)}
              data-ocid="markets.primary_button"
            >
              Act <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Performer + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {topPerformer && (
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-muted-foreground">Top Performer:</span>
            <span className="font-semibold text-foreground">
              {topPerformer.symbol}
            </span>
            <span
              className={
                topPerformer.change >= 0
                  ? "text-green-400 font-medium"
                  : "text-red-400 font-medium"
              }
            >
              {topPerformer.change >= 0 ? "+" : ""}
              {topPerformer.change.toFixed(2)}%
            </span>
            <Badge
              variant="outline"
              className="text-[10px] border-yellow-500/40 text-yellow-400 ml-1"
            >
              Today
            </Badge>
          </div>
        )}
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          {(["all", "stocks", "crypto"] as FilterTab[]).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="markets.tab"
            >
              {tab === "all"
                ? "All Assets"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout: cards + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Stock Card Grid */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-foreground">
                Market Intelligence
              </h2>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live · 3s</span>
            </div>
            {selected.length >= 2 && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                {selected.length} selected
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarkets.map((m, i) => {
              const meta = STOCK_META[m.symbol];
              const isPositive = m.change >= 0;
              const isMonitored = monitoring.has(m.symbol);
              const isSelected = selected.includes(m.symbol);
              const priceFmt =
                m.type === "crypto"
                  ? m.price.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : m.price.toFixed(2);

              return (
                <motion.div
                  key={m.symbol}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`relative bg-card border rounded-xl p-4 transition-all ${
                    isSelected
                      ? "border-primary/60 shadow-[0_0_0_1px_oklch(0.81_0.15_205_/_0.3)]"
                      : "border-border hover:border-border/80"
                  }`}
                  data-ocid={`markets.item.${i + 1}`}
                >
                  {isMonitored && (
                    <span className="absolute top-3 right-3 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[9px] text-green-400 font-medium">
                        LIVE
                      </span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleSelect(m.symbol)}
                    className={`absolute top-3 left-3 w-4 h-4 rounded border transition-all ${isSelected ? "bg-primary border-primary" : "border-border hover:border-primary/50"} flex items-center justify-center`}
                    title="Compare"
                    data-ocid={`markets.checkbox.${i + 1}`}
                  >
                    {isSelected && (
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    )}
                  </button>

                  <div className="mt-4 mb-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-bold tracking-wider"
                        style={{ color: meta?.color ?? "#fff" }}
                      >
                        {m.symbol}
                      </span>
                      {meta && (
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 h-4"
                          style={{
                            borderColor: `${meta.color}40`,
                            color: meta.color,
                          }}
                        >
                          {meta.sector}
                        </Badge>
                      )}
                      {m.type === "crypto" && (
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 h-4 border-yellow-500/40 text-yellow-400"
                        >
                          CRYPTO
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {meta?.name ?? m.symbol}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-2">
                    <div className="font-display text-xl font-bold text-foreground">
                      ${priceFmt}
                    </div>
                    <div
                      className={`flex items-center gap-0.5 text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {isPositive ? "+" : ""}
                      {m.change.toFixed(2)}%
                    </div>
                  </div>

                  <div className="mb-3">
                    <Sparkline data={m.sparkline} positive={isPositive} />
                  </div>

                  <div className="grid grid-cols-3 gap-1 mb-3 text-center">
                    {[
                      { label: "Mkt Cap", value: m.marketCap },
                      { label: "Volume", value: m.volume },
                      {
                        label: m.type === "crypto" ? "Type" : "P/E",
                        value:
                          m.type === "crypto" ? "Crypto" : m.peRatio.toString(),
                      },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="bg-secondary/30 rounded-lg p-1.5"
                      >
                        <div className="text-[9px] text-muted-foreground">
                          {metric.label}
                        </div>
                        <div className="text-xs font-medium text-foreground">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Score + Confidence */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">
                        AI Score
                      </span>
                      <span className="text-[10px] font-bold text-primary">
                        {m.aiScore}/10
                      </span>
                    </div>
                    <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(to right, oklch(0.55 0.18 145), oklch(0.81 0.15 205))",
                          width: `${m.aiScore * 10}%`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.aiScore * 10}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-muted-foreground">
                      Confidence:{" "}
                      <span className="text-foreground font-medium">
                        {m.confidence}%
                      </span>
                    </span>
                    <span className="text-[9px] text-muted-foreground/60">
                      {m.lastUpdated}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] py-0 h-4 ${m.trend === "Bullish" ? "border-green-500/40 text-green-400" : m.trend === "Bearish" ? "border-red-500/40 text-red-400" : "border-yellow-500/40 text-yellow-400"}`}
                    >
                      {m.trend === "Bullish"
                        ? "▲"
                        : m.trend === "Bearish"
                          ? "▼"
                          : "―"}{" "}
                      {m.trend}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[9px] py-0 h-4 ${m.volatility === "Low" ? "border-green-500/40 text-green-400" : m.volatility === "Medium" ? "border-yellow-500/40 text-yellow-400" : "border-red-500/40 text-red-400"}`}
                    >
                      {m.volatility} Vol
                    </Badge>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                    {AI_INSIGHTS[m.symbol]}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] px-1 border-border hover:border-primary/40 hover:text-primary"
                      onClick={() => onOpenChat(`${m.symbol} analysis`)}
                      data-ocid={`markets.button.${i + 1}`}
                    >
                      <Eye className="h-3 w-3 mr-0.5" /> Analyze
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 text-[10px] px-1 transition-all ${isMonitored ? "border-green-500/40 text-green-400" : "border-border hover:border-primary/40 hover:text-primary"}`}
                      onClick={() => handleMonitor(m.symbol)}
                      disabled={isMonitored}
                      data-ocid={`markets.toggle.${i + 1}`}
                    >
                      <Activity className="h-3 w-3 mr-0.5" />
                      {isMonitored ? "Live" : "Monitor"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] px-1 border-border hover:border-yellow-500/40 hover:text-yellow-400"
                      onClick={() => handleAlert(m.symbol)}
                      data-ocid={`markets.secondary_button.${i + 1}`}
                    >
                      <Bell className="h-3 w-3 mr-0.5" /> Alert
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-sm text-foreground">
                AI Insight Panel
              </h3>
            </div>
            {topPerformer && (
              <button
                type="button"
                className="w-full mb-4 p-3 rounded-lg bg-secondary/40 border border-border cursor-pointer hover:border-primary/30 transition-colors text-left"
                onClick={() => onOpenChat(`${topPerformer.symbol} analysis`)}
                data-ocid="insights.button"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-[10px] text-green-400 font-medium uppercase tracking-wider">
                    Trending
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {topPerformer.symbol} — {topPerformer.trend}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {AI_INSIGHTS[topPerformer.symbol]}
                </div>
              </button>
            )}
            {highVolatility.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                  Risk Alerts
                </div>
                {highVolatility.map((m) => (
                  <button
                    type="button"
                    key={m.symbol}
                    className="w-full flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/20 mb-2 cursor-pointer hover:border-red-500/40 transition-colors text-left"
                    onClick={() => onOpenChat(`Alert me if ${m.symbol} drops`)}
                    data-ocid="insights.panel"
                  >
                    <AlertTriangle className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-foreground">
                        {m.symbol} High Volatility
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        Consider setting a price alert
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="mb-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                Suggested Workflows
              </div>
              {[
                {
                  label: "Track Top Performer",
                  msg: `Track ${topPerformer?.symbol ?? "NVDA"}`,
                  icon: Zap,
                },
                {
                  label: "Portfolio Risk Check",
                  msg: "portfolio risk",
                  icon: Shield,
                },
                {
                  label: "Daily Market Brief",
                  msg: "market summary",
                  icon: Activity,
                },
              ].map((w, i) => (
                <button
                  type="button"
                  key={w.label}
                  onClick={() => onOpenChat(w.msg)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/60 transition-colors text-left mb-1"
                  data-ocid={`insights.secondary_button.${i + 1}`}
                >
                  <w.icon className="h-3 w-3 text-primary shrink-0" />
                  <span className="text-xs text-foreground">{w.label}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                Recently Viewed
              </div>
              {recentlyViewed.map((m) => (
                <button
                  type="button"
                  key={m.symbol}
                  className="w-full flex items-center justify-between py-1.5 border-b border-border/40 last:border-0 hover:text-primary transition-colors"
                  onClick={() => onOpenChat(`${m.symbol} analysis`)}
                  data-ocid="insights.link"
                >
                  <span className="text-xs font-medium text-foreground">
                    {m.symbol}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${m.change >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {m.change >= 0 ? "+" : ""}
                    {m.change.toFixed(2)}% since last check
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Consent & Earnings
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">
              Portfolio data securely used to improve recommendations.
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-foreground font-medium">₹125</span>
              <span className="text-[10px] text-muted-foreground">
                earned this month
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] border-border hover:border-red-500/40 hover:text-red-400"
                onClick={() => onOpenChat("revoke consent")}
                data-ocid="consent.button"
              >
                Revoke
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] border-border hover:border-primary/40 hover:text-primary"
                onClick={() => onOpenChat("data usage")}
                data-ocid="consent.secondary_button"
              >
                View Usage
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comparison Section */}
      <AnimatePresence>
        {selected.length >= 2 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="bg-card border border-primary/30 rounded-xl p-5"
            data-ocid="comparison.panel"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">
                Comparison: {selected.join(" vs ")}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground text-xs h-7"
                onClick={() => setSelected([])}
                data-ocid="comparison.close_button"
              >
                Clear
              </Button>
            </div>
            <div className="mb-5">
              <ComparisonChart selected={selected} markets={markets} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" data-ocid="comparison.table">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">Asset</th>
                    <th className="text-right py-2 pr-4 font-medium">Price</th>
                    <th className="text-right py-2 pr-4 font-medium">Change</th>
                    <th className="text-right py-2 pr-4 font-medium">
                      AI Score
                    </th>
                    <th className="text-right py-2 pr-4 font-medium">
                      Confidence
                    </th>
                    <th className="text-right py-2 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {selected
                    .map((s) => markets.find((m) => m.symbol === s))
                    .filter(Boolean)
                    .sort((a, b) => b!.change - a!.change)
                    .map((m, i) => (
                      <tr
                        key={m!.symbol}
                        className="border-b border-border/40 last:border-0"
                        data-ocid={`comparison.row.${i + 1}`}
                      >
                        <td className="py-2 pr-4">
                          <span className="font-semibold text-foreground">
                            {m!.symbol}
                          </span>
                        </td>
                        <td className="text-right py-2 pr-4 font-mono text-foreground">
                          $
                          {m!.type === "crypto"
                            ? m!.price.toLocaleString()
                            : m!.price.toFixed(2)}
                        </td>
                        <td
                          className={`text-right py-2 pr-4 font-medium ${m!.change >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {m!.change >= 0 ? "+" : ""}
                          {m!.change.toFixed(2)}%
                        </td>
                        <td className="text-right py-2 pr-4 text-primary font-medium">
                          {m!.aiScore}/10
                        </td>
                        <td className="text-right py-2 pr-4 text-foreground">
                          {m!.confidence}%
                        </td>
                        <td
                          className={`text-right py-2 ${m!.trend === "Bullish" ? "text-green-400" : m!.trend === "Bearish" ? "text-red-400" : "text-yellow-400"}`}
                        >
                          {m!.trend}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
