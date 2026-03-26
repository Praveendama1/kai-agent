import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { MarketData } from "../engine/ChatEngine";

interface Props {
  markets: MarketData[];
  onAskAbout: (symbol: string) => void;
}

const ASSET_META: Record<string, { name: string; color: string }> = {
  MSFT: { name: "Microsoft", color: "#00D4FF" },
  NVDA: { name: "NVIDIA", color: "#76b900" },
  BTC: { name: "Bitcoin", color: "#f7931a" },
  ETH: { name: "Ethereum", color: "#627eea" },
};

function formatPrice(symbol: string, price: number): string {
  if (symbol === "BTC" || symbol === "ETH") {
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `$${price.toFixed(2)}`;
}

export function MarketSpotlight({ markets, onAskAbout }: Props) {
  const alerts = markets.filter((m) => Math.abs(m.change) > 2);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Market Spotlight
        </h2>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">
            Live · updates every 15s
          </span>
        </div>
      </div>

      <AnimatePresence>
        {alerts.map((m) => (
          <motion.div
            key={`alert-${m.symbol}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mb-3 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
              m.change < 0
                ? "bg-destructive/15 border border-destructive/40 text-red-400"
                : "bg-green-500/10 border border-green-500/30 text-green-400"
            }`}
          >
            {m.change < 0 ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : (
              <Zap className="h-4 w-4 shrink-0" />
            )}
            <span>
              {m.change < 0
                ? `⚠ ${m.symbol} dropped ${Math.abs(m.change).toFixed(2)}% — Consider reviewing position`
                : `📈 ${m.symbol} surged ${m.change.toFixed(2)}% — Bullish momentum`}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {markets.map((m, i) => {
          const meta = ASSET_META[m.symbol];
          const isPositive = m.change >= 0;
          return (
            <motion.div
              key={m.symbol}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-all hover:shadow-glow"
              onClick={() => onAskAbout(m.symbol)}
              data-ocid={`market.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">
                    {meta.name}
                  </div>
                  <div className="font-display text-xl font-bold text-foreground">
                    {formatPrice(m.symbol, m.price)}
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `${meta.color}20`,
                    color: meta.color,
                  }}
                >
                  {m.symbol.slice(0, 2)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {isPositive ? "+" : ""}
                  {m.change.toFixed(2)}%
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium ${
                    m.volatility === "Low"
                      ? "border-green-500/40 text-green-400"
                      : m.volatility === "Medium"
                        ? "border-yellow-500/40 text-yellow-400"
                        : "border-red-500/40 text-red-400"
                  }`}
                >
                  {m.volatility}
                </Badge>
              </div>

              <div
                className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(to right, transparent, ${meta.color}, transparent)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
