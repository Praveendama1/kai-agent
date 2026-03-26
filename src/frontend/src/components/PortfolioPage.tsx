import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Minus,
  PieChart,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { MarketData } from "../engine/ChatEngine";

const HOLDINGS = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    shares: 10,
    avgCost: 175,
    sector: "AI/Semi",
    color: "#76b900",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    shares: 5,
    avgCost: 418,
    sector: "Cloud/AI",
    color: "#00D4FF",
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    shares: 8,
    avgCost: 250,
    sector: "EV",
    color: "#cc2233",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    shares: 0.5,
    avgCost: 64000,
    sector: "Crypto",
    color: "#f7931a",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    shares: 3,
    avgCost: 3400,
    sector: "Crypto",
    color: "#627eea",
  },
];

const SECTOR_ALLOCATION = [
  { name: "AI/Semiconductors", pct: 45, color: "bg-green-500" },
  { name: "Cloud/Tech", pct: 25, color: "bg-primary" },
  { name: "Crypto", pct: 22, color: "bg-yellow-500" },
  { name: "Finance", pct: 8, color: "bg-purple-500" },
];

interface Props {
  markets: MarketData[];
  onOpenChat: (msg?: string) => void;
  onSwitchToTrade: (symbol?: string) => void;
}

export function PortfolioPage({ markets, onOpenChat, onSwitchToTrade }: Props) {
  const getPrice = (symbol: string) =>
    markets.find((m) => m.symbol === symbol)?.price ?? 0;
  const getTrend = (symbol: string) =>
    markets.find((m) => m.symbol === symbol)?.trend ?? "Neutral";
  const getChange = (symbol: string) =>
    markets.find((m) => m.symbol === symbol)?.change ?? 0;

  const holdingsWithCalc = HOLDINGS.map((h) => {
    const currentPrice = getPrice(h.symbol) || h.avgCost;
    const value = currentPrice * h.shares;
    const pl = (currentPrice - h.avgCost) * h.shares;
    const plPct = ((currentPrice - h.avgCost) / h.avgCost) * 100;
    return { ...h, currentPrice, value, pl, plPct };
  });

  const totalValue = holdingsWithCalc.reduce((sum, h) => sum + h.value, 0);
  const totalPL = holdingsWithCalc.reduce((sum, h) => sum + h.pl, 0);
  const totalPLPct = (totalPL / (totalValue - totalPL)) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Portfolio Value",
            value: `₹${(totalValue * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
            sub: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`,
            color: "text-foreground",
            icon: PieChart,
          },
          {
            label: "Total P&L",
            value: `${totalPL >= 0 ? "+" : ""}₹${(totalPL * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
            sub: `${totalPLPct >= 0 ? "+" : ""}${totalPLPct.toFixed(2)}% overall`,
            color: totalPL >= 0 ? "text-green-400" : "text-red-400",
            icon: totalPL >= 0 ? ArrowUpRight : ArrowDownRight,
          },
          {
            label: "Risk Level",
            value: "Medium-High",
            sub: "65% AI concentration",
            color: "text-orange-400",
            icon: AlertTriangle,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-xl p-5"
            data-ocid={`portfolio.card.${i + 1}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className={`font-display text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-2 bg-card border border-border rounded-xl p-5"
          data-ocid="portfolio.table"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">
              Holdings
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] border-green-500/40 text-green-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block mr-1.5" />
              Live Prices
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  {[
                    "Asset",
                    "Shares",
                    "Avg Cost",
                    "Current",
                    "Value",
                    "P&L",
                    "P&L%",
                    "Trend",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`py-2 font-medium ${h === "Asset" ? "text-left" : "text-right"} pr-3 last:pr-0`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdingsWithCalc.map((h, i) => {
                  const trend = getTrend(h.symbol);
                  const dayChange = getChange(h.symbol);
                  const priceFmt =
                    h.symbol === "BTC" || h.symbol === "ETH"
                      ? h.currentPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      : h.currentPrice.toFixed(2);
                  return (
                    <tr
                      key={h.symbol}
                      className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors"
                      data-ocid={`portfolio.row.${i + 1}`}
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: h.color }}
                          />
                          <div>
                            <span className="font-semibold text-foreground">
                              {h.symbol}
                            </span>
                            <div className="text-[9px] text-muted-foreground">
                              {h.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 pr-3 text-foreground">
                        {h.shares}
                      </td>
                      <td className="text-right py-3 pr-3 text-muted-foreground">
                        ${h.avgCost.toLocaleString()}
                      </td>
                      <td className="text-right py-3 pr-3 text-foreground font-mono">
                        ${priceFmt}
                      </td>
                      <td className="text-right py-3 pr-3 text-foreground font-medium">
                        $
                        {h.value.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td
                        className={`text-right py-3 pr-3 font-medium ${h.pl >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {h.pl >= 0 ? "+" : ""}$
                        {h.pl.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td
                        className={`text-right py-3 pr-3 font-medium ${h.plPct >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {h.plPct >= 0 ? "+" : ""}
                        {h.plPct.toFixed(1)}%
                      </td>
                      <td className="text-right py-3">
                        <div className="flex items-center justify-end gap-1">
                          {trend === "Bullish" ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-green-400" />
                          ) : trend === "Bearish" ? (
                            <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 text-yellow-400" />
                          )}
                          <span
                            className={`text-[10px] ${dayChange >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {dayChange >= 0 ? "+" : ""}
                            {dayChange.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Sector Allocation */}
          <motion.section
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-sm text-foreground">
                Sector Allocation
              </h3>
            </div>
            <div className="space-y-3">
              {SECTOR_ALLOCATION.map((sector) => (
                <div key={sector.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{sector.name}</span>
                    <span className="text-foreground font-medium">
                      {sector.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${sector.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Kai AI Recommendation */}
          <motion.section
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-primary/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-sm text-foreground">
                Kai Recommendation
              </h3>
            </div>
            <div className="flex items-start gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are{" "}
                <span className="text-yellow-400 font-semibold">
                  65% invested in AI stocks
                </span>
                . Consider diversifying into Finance or Energy for better risk
                distribution.
              </p>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 text-xs h-8"
                variant="ghost"
                onClick={() => onOpenChat("Optimize my portfolio")}
                data-ocid="portfolio.primary_button"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Rebalance Portfolio
              </Button>
              <Button
                className="w-full text-xs h-8"
                variant="outline"
                onClick={() => onSwitchToTrade()}
                data-ocid="portfolio.secondary_button"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Add to Trade
              </Button>
            </div>
          </motion.section>

          {/* Performance Bar */}
          <motion.section
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-display font-semibold text-sm text-foreground mb-3">
              Best Performers
            </h3>
            {holdingsWithCalc
              .sort((a, b) => b.plPct - a.plPct)
              .slice(0, 3)
              .map((h, i) => (
                <div
                  key={h.symbol}
                  className="flex items-center gap-3 mb-2 last:mb-0"
                  data-ocid={`portfolio.item.${i + 1}`}
                >
                  <span className="text-[10px] text-muted-foreground w-4">
                    {i + 1}.
                  </span>
                  <span
                    className="font-medium text-xs text-foreground flex-1"
                    style={{ color: h.color }}
                  >
                    {h.symbol}
                  </span>
                  <span
                    className={`text-xs font-semibold ${h.plPct >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {h.plPct >= 0 ? "+" : ""}
                    {h.plPct.toFixed(1)}%
                  </span>
                  <Progress
                    value={Math.abs(h.plPct) * 3}
                    className="w-16 h-1.5"
                  />
                </div>
              ))}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
