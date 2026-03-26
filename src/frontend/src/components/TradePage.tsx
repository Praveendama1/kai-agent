import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { MarketData } from "../engine/ChatEngine";

const ALL_SYMBOLS = [
  "NVDA",
  "MSFT",
  "AAPL",
  "TSLA",
  "AMZN",
  "GOOGL",
  "META",
  "NFLX",
  "AMD",
  "JPM",
  "BTC",
  "ETH",
];

interface TradeRecord {
  id: string;
  time: string;
  symbol: string;
  action: "BUY" | "SELL";
  qty: number;
  price: number;
  value: number;
  status: "Executed";
  privacy: "public" | "private";
}

const INITIAL_HISTORY: TradeRecord[] = [
  {
    id: "1",
    time: "12:34 PM",
    symbol: "NVDA",
    action: "BUY",
    qty: 5,
    price: 179.4,
    value: 897,
    status: "Executed",
    privacy: "public",
  },
  {
    id: "2",
    time: "11:20 AM",
    symbol: "TSLA",
    action: "SELL",
    qty: 3,
    price: 242.1,
    value: 726.3,
    status: "Executed",
    privacy: "public",
  },
  {
    id: "3",
    time: "Yesterday",
    symbol: "BTC",
    action: "BUY",
    qty: 0.1,
    price: 67200,
    value: 6720,
    status: "Executed",
    privacy: "public",
  },
];

function getRiskLevel(volatility?: string): {
  label: string;
  bars: number;
  color: string;
} {
  if (volatility === "High")
    return { label: "High", bars: 4, color: "text-red-400" };
  if (volatility === "Medium")
    return { label: "Medium", bars: 3, color: "text-yellow-400" };
  return { label: "Low", bars: 2, color: "text-green-400" };
}

interface Props {
  markets: MarketData[];
  initialSymbol?: string;
}

export function TradePage({ markets, initialSymbol }: Props) {
  const [symbol, setSymbol] = useState(initialSymbol ?? "NVDA");
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState("5");
  const [inputMode, setInputMode] = useState<"shares" | "amount">("shares");
  const [showRisk, setShowRisk] = useState(false);
  const [history, setHistory] = useState<TradeRecord[]>(INITIAL_HISTORY);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradePrivacy, setTradePrivacy] = useState<"public" | "private">(
    "public",
  );

  const market = markets.find((m) => m.symbol === symbol);
  const currentPrice = market?.price ?? 0;
  const risk = getRiskLevel(market?.volatility);
  const qtyNum = Number.parseFloat(qty) || 0;
  const tradeValue = inputMode === "shares" ? qtyNum * currentPrice : qtyNum;
  const shareCount = inputMode === "amount" ? qtyNum / currentPrice : qtyNum;
  const confidence = market?.confidence ?? 72;
  const potentialGain = tradeValue * (market?.aiScore ?? 7) * 0.025;
  const potentialLoss =
    tradeValue * (risk.bars === 4 ? 0.12 : risk.bars === 3 ? 0.08 : 0.04);
  const priceFmt =
    market?.type === "crypto"
      ? currentPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : currentPrice.toFixed(2);

  function handleAnalyze() {
    if (!qty || qtyNum <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    setShowRisk(true);
  }

  async function handleExecute() {
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 800));
    const record: TradeRecord = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      symbol,
      action,
      qty: shareCount,
      price: currentPrice,
      value: tradeValue,
      status: "Executed",
      privacy: tradePrivacy,
    };
    setHistory((prev) => [record, ...prev]);
    setShowRisk(false);
    setIsExecuting(false);
    toast.success(`${action} ${symbol} executed (simulated)`, {
      description: `${shareCount.toFixed(symbol === "BTC" || symbol === "ETH" ? 4 : 2)} shares @ $${priceFmt} · ${tradePrivacy === "public" ? "🌐 Public" : "🔒 Private"}`,
      icon: <CheckCircle2 className="h-4 w-4 text-green-400" />,
    });
  }

  function toggleTradePrivacy(id: string) {
    setHistory((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = t.privacy === "public" ? "private" : "public";
        toast("Trade visibility updated", {
          description: `${t.symbol} trade is now ${next === "public" ? "🌐 public" : "🔒 private"}.`,
        });
        return { ...t, privacy: next };
      }),
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trade Execution Panel */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
          data-ocid="trade.panel"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Trade Execution
            </h2>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] border-primary/40 text-primary"
            >
              Simulated
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Asset Selector */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Asset
              </Label>
              <Select
                value={symbol}
                onValueChange={(v) => {
                  setSymbol(v);
                  setShowRisk(false);
                }}
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="trade.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SYMBOLS.map((s) => {
                    const m = markets.find((x) => x.symbol === s);
                    const p =
                      m?.type === "crypto"
                        ? m.price.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })
                        : (m?.price.toFixed(2) ?? "");
                    return (
                      <SelectItem key={s} value={s}>
                        <span className="font-medium">{s}</span>
                        {m && (
                          <span className="text-muted-foreground ml-2">
                            ${p}
                          </span>
                        )}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Current Price */}
            {market && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                <span className="text-xs text-muted-foreground">
                  Current Price
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-foreground">
                    ${priceFmt}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      market.change >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {market.change >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5 inline" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 inline" />
                    )}
                    {market.change >= 0 ? "+" : ""}
                    {market.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}

            {/* Buy/Sell Toggle */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Action
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAction("BUY")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    action === "BUY"
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-secondary/40 text-muted-foreground border border-border"
                  }`}
                  data-ocid="trade.toggle"
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setAction("SELL")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    action === "SELL"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-secondary/40 text-muted-foreground border border-border"
                  }`}
                  data-ocid="trade.toggle"
                >
                  SELL
                </button>
              </div>
            </div>

            {/* Input mode + Quantity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs text-muted-foreground">
                  {inputMode === "shares" ? "Quantity (Shares)" : "Amount (₹)"}
                </Label>
                <button
                  type="button"
                  onClick={() =>
                    setInputMode(inputMode === "shares" ? "amount" : "shares")
                  }
                  className="text-[10px] text-primary hover:underline"
                >
                  Switch to {inputMode === "shares" ? "Amount" : "Shares"}
                </button>
              </div>
              <Input
                type="number"
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value);
                  setShowRisk(false);
                }}
                placeholder={
                  inputMode === "shares" ? "Number of shares" : "Amount in ₹"
                }
                className="bg-input border-border"
                data-ocid="trade.input"
              />
              {qtyNum > 0 && currentPrice > 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {inputMode === "shares"
                    ? `Est. Value: $${tradeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    : `Est. Shares: ${shareCount.toFixed(4)}`}
                </p>
              )}
            </div>

            {/* Privacy Toggle */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Trade Visibility
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTradePrivacy("public")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    tradePrivacy === "public"
                      ? "bg-primary/15 text-primary border border-primary/40"
                      : "bg-secondary/40 text-muted-foreground border border-border"
                  }`}
                  data-ocid="trade.toggle"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setTradePrivacy("private")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    tradePrivacy === "private"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/40"
                      : "bg-secondary/40 text-muted-foreground border border-border"
                  }`}
                  data-ocid="trade.toggle"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {tradePrivacy === "public"
                  ? "Public trades visible to marketplace"
                  : "Only you can see this trade"}
              </p>
            </div>

            <Button
              onClick={handleAnalyze}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
              data-ocid="trade.primary_button"
            >
              <Shield className="h-4 w-4 mr-2" /> Analyze Trade
            </Button>
          </div>
        </motion.section>

        {/* Risk Analysis Panel */}
        <div className="space-y-4">
          <AnimatePresence>
            {showRisk && market && (
              <motion.section
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="bg-card border border-primary/40 rounded-xl p-6"
                data-ocid="trade.dialog"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">
                    Risk Analysis
                  </h3>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Asset</span>
                    <span className="font-medium text-foreground">
                      {symbol} @ ${priceFmt}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Action</span>
                    <span
                      className={`font-semibold ${
                        action === "BUY" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {action}{" "}
                      {shareCount.toFixed(
                        symbol === "BTC" || symbol === "ETH" ? 4 : 2,
                      )}{" "}
                      shares
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trade Value</span>
                    <span className="font-medium text-foreground">
                      $
                      {tradeValue.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Visibility</span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        tradePrivacy === "public"
                          ? "text-primary"
                          : "text-yellow-400"
                      }`}
                    >
                      {tradePrivacy === "public" ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      {tradePrivacy === "public" ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Risk Level
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className={`w-3 h-3 rounded-sm ${
                              bar <= risk.bars
                                ? risk.bars >= 4
                                  ? "bg-red-400"
                                  : risk.bars >= 3
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                                : "bg-secondary"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-semibold ${risk.color}`}>
                        {risk.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Confidence
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {confidence}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Potential Loss
                    </span>
                    <span className="text-red-400 font-medium">
                      -${potentialLoss.toFixed(0)} (-
                      {((potentialLoss / tradeValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Potential Gain
                    </span>
                    <span className="text-green-400 font-medium">
                      +${potentialGain.toFixed(0)} (+
                      {((potentialGain / tradeValue) * 100).toFixed(1)}%)
                    </span>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="text-foreground font-medium">
                          {symbol}
                        </span>{" "}
                        shows{" "}
                        <span className="text-primary">
                          {market.trend.toLowerCase()} momentum
                        </span>{" "}
                        with{" "}
                        <span className={risk.color}>
                          {risk.label.toLowerCase()} volatility
                        </span>
                        . Confidence: {confidence}%.
                      </p>
                    </div>
                  </div>
                </div>

                {risk.bars >= 4 && (
                  <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2 mb-4">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    High volatility detected. Consider reducing position size.
                  </div>
                )}

                <Button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className={`w-full font-semibold ${
                    action === "BUY"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  data-ocid="trade.confirm_button"
                >
                  {isExecuting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                      Executing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Confirm & Execute {action}
                    </span>
                  )}
                </Button>
              </motion.section>
            )}
          </AnimatePresence>

          {!showRisk && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <Shield className="h-10 w-10 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Risk analysis will appear here after you click Analyze Trade
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trade History */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5"
        data-ocid="tradehistory.table"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold text-foreground">
            Trade History
          </h2>
          <Badge
            variant="outline"
            className="ml-auto text-[10px] border-green-500/40 text-green-400"
          >
            {history.length} trades
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                {[
                  "Time",
                  "Asset",
                  "Action",
                  "Qty",
                  "Price",
                  "Value",
                  "Visibility",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className={`py-2 font-medium ${
                      h === "Time" ? "text-left" : "text-right"
                    } pr-4 last:pr-0`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b border-border/40 last:border-0"
                  data-ocid={`tradehistory.row.${i + 1}`}
                >
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {t.time}
                  </td>
                  <td className="text-right py-2.5 pr-4 font-semibold text-foreground">
                    {t.symbol}
                  </td>
                  <td
                    className={`text-right py-2.5 pr-4 font-bold ${
                      t.action === "BUY" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.action}
                  </td>
                  <td className="text-right py-2.5 pr-4 text-foreground">
                    {t.qty.toFixed(
                      t.symbol === "BTC" || t.symbol === "ETH" ? 4 : 0,
                    )}
                  </td>
                  <td className="text-right py-2.5 pr-4 font-mono text-muted-foreground">
                    $
                    {t.price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-right py-2.5 pr-4 text-foreground font-medium">
                    $
                    {t.value.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="text-right py-2.5 pr-4">
                    <button
                      type="button"
                      onClick={() => toggleTradePrivacy(t.id)}
                      title={
                        t.privacy === "public"
                          ? "Click to make private"
                          : "Click to make public"
                      }
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors ${
                        t.privacy === "public"
                          ? "text-green-400 hover:bg-green-400/10"
                          : "text-yellow-400 hover:bg-yellow-400/10"
                      }`}
                      data-ocid={`tradehistory.toggle.${i + 1}`}
                    >
                      {t.privacy === "public" ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      <span className="text-[9px]">
                        {t.privacy === "public" ? "Public" : "Private"}
                      </span>
                    </button>
                  </td>
                  <td className="text-right py-2.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-green-500/40 text-green-400"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
