import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Cpu,
  CreditCard,
  Eye,
  Heart,
  Pause,
  Play,
  Plus,
  Share2,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const AI_ANALYZERS = [
  {
    id: "1",
    name: "NVDA Momentum Analyzer",
    creator: "Kai AI",
    assets: ["NVDA"],
    signal: "Bullish breakout detection",
    accuracy: 76,
    followers: 1240,
    triggers: 3,
    description:
      "Detects institutional momentum shifts in NVDA using volume + price action.",
    bio: "Ex-quant from Goldman Sachs, specializing in momentum strategies for semiconductor stocks.",
    totalEarnings: "₹4,200/mo",
    paymentMethods: 3,
    platformUsers: 12450,
  },
  {
    id: "2",
    name: "High Volatility Trader AI",
    creator: "Kai AI",
    assets: ["TSLA", "BTC"],
    signal: "Volatility breakout signals",
    accuracy: 68,
    followers: 892,
    triggers: 5,
    description:
      "Identifies high-volatility entry points across TSLA and BTC for short-term trades.",
    bio: "Derivatives trader turned AI researcher, focused on volatility modeling and breakout patterns.",
    totalEarnings: "₹2,800/mo",
    paymentMethods: 2,
    platformUsers: 12450,
  },
  {
    id: "3",
    name: "Crypto Swing Trader",
    creator: "Kai AI",
    assets: ["BTC", "ETH"],
    signal: "Swing trade entry/exit",
    accuracy: 71,
    followers: 2105,
    triggers: 4,
    description:
      "Multi-day swing strategy for BTC and ETH based on RSI + volume confluence.",
    bio: "Crypto-native engineer with 6 years of on-chain analytics experience at a top DeFi protocol.",
    totalEarnings: "₹6,100/mo",
    paymentMethods: 4,
    platformUsers: 12450,
  },
  {
    id: "4",
    name: "AI Growth Basket",
    creator: "Kai AI",
    assets: ["NVDA", "AMD", "MSFT"],
    signal: "AI sector rotation",
    accuracy: 74,
    followers: 3412,
    triggers: 6,
    description:
      "Rotates between NVDA, AMD, and MSFT based on AI sector momentum indicators.",
    bio: "Portfolio manager at a tech hedge fund, building AI-driven sector rotation strategies since 2019.",
    totalEarnings: "₹9,500/mo",
    paymentMethods: 4,
    platformUsers: 12450,
  },
];

const STRATEGIES = [
  {
    id: "1",
    name: "AI Growth Strategy",
    assets: ["NVDA", "AMD", "MSFT"],
    status: "Running",
    performance: "+12.4%",
    positive: true,
  },
  {
    id: "2",
    name: "High Volatility Trader",
    assets: ["TSLA", "BTC"],
    status: "Paused",
    performance: "-2.1%",
    positive: false,
  },
  {
    id: "3",
    name: "Crypto Swing Strategy",
    assets: ["BTC", "ETH"],
    status: "Running",
    performance: "+8.7%",
    positive: true,
  },
];

const ASSETS = [
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
const CONDITIONS = [
  "Price rises above",
  "Volume spikes",
  "Drops more than",
  "RSI > 70",
  "RSI < 30",
  "Bullish crossover",
  "Bearish crossover",
];
const ACTIONS = [
  "Send alert",
  "Create workflow",
  "Execute trade (simulated)",
  "Log signal",
];

type FilterTab = "all" | "ai" | "user" | "following";

interface UserAnalyzer {
  id: string;
  name: string;
  asset: string;
  condition: string;
  action: string;
}

export function AnalyzersPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [userAnalyzers, setUserAnalyzers] = useState<UserAnalyzer[]>([]);
  const [strategies, setStrategies] = useState(STRATEGIES);

  const [createAsset, setCreateAsset] = useState("NVDA");
  const [createCondition, setCreateCondition] = useState(CONDITIONS[0]);
  const [createAction, setCreateAction] = useState(ACTIONS[0]);

  function toggleFollow(id: string, name: string) {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success(`Unfollowed ${name}`);
      } else {
        next.add(id);
        toast.success(`Following ${name}`, {
          description: "You'll receive signals from this analyzer.",
        });
      }
      return next;
    });
  }

  function createAnalyzer() {
    const newAnalyzer: UserAnalyzer = {
      id: crypto.randomUUID(),
      name: `${createAsset} ${createCondition} → ${createAction}`,
      asset: createAsset,
      condition: createCondition,
      action: createAction,
    };
    setUserAnalyzers((prev) => [...prev, newAnalyzer]);
    toast.success("Analyzer created!", { description: newAnalyzer.name });
  }

  function toggleStrategy(id: string) {
    setStrategies((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStatus = s.status === "Running" ? "Paused" : "Running";
        toast.success(`Strategy ${newStatus.toLowerCase()}`, {
          description: s.name,
        });
        return { ...s, status: newStatus };
      }),
    );
  }

  const visibleAnalyzers = AI_ANALYZERS.filter(() => {
    if (filter === "ai") return true;
    if (filter === "user") return false;
    if (filter === "following") return false;
    return true;
  });

  const totalAnalyzers = AI_ANALYZERS.length + userAnalyzers.length;
  const runningStrategies = strategies.filter(
    (s) => s.status === "Running",
  ).length;

  return (
    <div className="space-y-6">
      {/* Platform Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-2"
        data-ocid="analyzers.section"
      >
        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
          <Bot className="h-3 w-3 text-primary" />
          <span className="text-[10px] text-primary font-medium">
            {totalAnalyzers} Total Analyzers
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/50 border border-border rounded-full px-3 py-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">
            12,450 Active Users
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
          <TrendingUp className="h-3 w-3 text-green-400" />
          <span className="text-[10px] text-green-400 font-medium">
            {runningStrategies} Strategies Running
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary/50 border border-border rounded-full px-3 py-1">
          <CreditCard className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-medium">
            Multiple Payment Methods
          </span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          {(["all", "ai", "user", "following"] as FilterTab[]).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === tab
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="analyzers.tab"
            >
              {tab === "ai"
                ? "AI-Created"
                : tab === "user"
                  ? "User-Created"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "following" && following.size > 0 && (
                <span className="ml-1 text-[9px] bg-primary/20 text-primary px-1 rounded-full">
                  {following.size}
                </span>
              )}
            </button>
          ))}
        </div>
        <Badge
          variant="outline"
          className="text-[10px] border-primary/40 text-primary"
        >
          <Bot className="h-3 w-3 mr-1" /> {AI_ANALYZERS.length} AI Analyzers
        </Badge>
      </div>

      {/* AI Analyzer Grid */}
      {(filter === "all" || filter === "ai") && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-4 w-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              AI-Generated Analyzers
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] border-primary/40 text-primary"
            >
              Kai AI ✦
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleAnalyzers.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-xl p-4 flex flex-col"
                data-ocid={`analyzers.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-xs text-foreground">
                      {a.name}
                    </div>
                    <div className="text-[10px] text-primary mt-0.5">
                      {a.creator} ✦
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] border-primary/40 text-primary shrink-0 ml-1"
                  >
                    {a.accuracy}%
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {a.assets.map((asset) => (
                    <Badge
                      key={asset}
                      variant="outline"
                      className="text-[9px] border-border text-muted-foreground"
                    >
                      {asset}
                    </Badge>
                  ))}
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed mb-2 flex-1">
                  {a.description}
                </p>

                {/* Creator Bio */}
                <div className="flex items-start gap-1.5 mb-2 p-2 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] text-primary font-bold">
                      {a.creator.charAt(0)}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-relaxed line-clamp-2">
                    {a.bio}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-3 bg-secondary/20 rounded-lg px-2 py-1.5">
                  <span className="flex items-center gap-0.5">
                    <CreditCard className="h-2.5 w-2.5 text-primary/60" />
                    <span>{a.paymentMethods} payment methods</span>
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span className="flex items-center gap-0.5">
                    <Users className="h-2.5 w-2.5" />
                    <span>{a.followers.toLocaleString()} followers</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {a.triggers} flows
                  </span>
                  <span className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    {a.totalEarnings}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={following.has(a.id) ? "default" : "outline"}
                    className={`flex-1 h-7 text-[10px] ${following.has(a.id) ? "bg-primary/20 text-primary border-primary/30" : "border-border"}`}
                    onClick={() => toggleFollow(a.id, a.name)}
                    data-ocid={`analyzers.toggle.${i + 1}`}
                  >
                    <Heart
                      className={`h-3 w-3 mr-1 ${following.has(a.id) ? "fill-primary" : ""}`}
                    />
                    {following.has(a.id) ? "Following" : "Follow"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] border-border hover:border-primary/40"
                    data-ocid={`analyzers.button.${i + 1}`}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Following */}
      <AnimatePresence>
        {filter === "following" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {following.size === 0 ? (
              <div
                className="text-center py-20 bg-card border border-border rounded-xl"
                data-ocid="analyzers.empty_state"
              >
                <Star className="h-10 w-10 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  You're not following any analyzers yet
                </p>
                <Button
                  variant="ghost"
                  className="text-primary mt-3"
                  onClick={() => setFilter("all")}
                  data-ocid="analyzers.primary_button"
                >
                  Browse Analyzers
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {AI_ANALYZERS.filter((a) => following.has(a.id)).map((a, i) => (
                  <div
                    key={a.id}
                    className="bg-card border border-primary/30 rounded-xl p-4"
                    data-ocid={`analyzers.item.${i + 1}`}
                  >
                    <div className="font-semibold text-xs text-foreground mb-1">
                      {a.name}
                    </div>
                    <div className="text-[10px] text-primary">
                      {a.creator} ✦
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Analyzer */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="analyzers.panel"
        >
          <div className="flex items-center gap-2 mb-5">
            <Plus className="h-4 w-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Create Analyzer
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                1. Select Asset
              </Label>
              <Select value={createAsset} onValueChange={setCreateAsset}>
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="analyzers.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSETS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                2. Set Condition
              </Label>
              <Select
                value={createCondition}
                onValueChange={setCreateCondition}
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="analyzers.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                3. Choose Action
              </Label>
              <Select value={createAction} onValueChange={setCreateAction}>
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="analyzers.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={createAnalyzer}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
              data-ocid="analyzers.submit_button"
            >
              <Cpu className="h-4 w-4 mr-2" /> Create Analyzer
            </Button>
          </div>

          {userAnalyzers.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
                My Analyzers
              </div>
              {userAnalyzers.map((ua, i) => (
                <div
                  key={ua.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border mb-2 text-xs"
                  data-ocid={`analyzers.item.${i + 10}`}
                >
                  <Cpu className="h-3 w-3 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {ua.asset}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {ua.condition} → {ua.action}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] border-green-500/40 text-green-400 shrink-0"
                  >
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Strategies */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
          data-ocid="strategies.panel"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Strategies
            </h2>
          </div>
          <div className="space-y-3">
            {strategies.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="p-4 rounded-xl border border-border bg-secondary/30"
                data-ocid={`strategies.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {s.name}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.assets.map((a) => (
                        <Badge
                          key={a}
                          variant="outline"
                          className="text-[9px] border-border text-muted-foreground"
                        >
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-display font-bold text-sm ${
                        s.positive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {s.performance}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      this month
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-7 text-[10px] ${
                      s.status === "Running"
                        ? "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                        : "border-green-500/40 text-green-400 hover:bg-green-500/10"
                    }`}
                    onClick={() => toggleStrategy(s.id)}
                    data-ocid={`strategies.toggle.${i + 1}`}
                  >
                    {s.status === "Running" ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Run
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] border-border hover:border-primary/40 hover:text-primary"
                    data-ocid={`strategies.button.${i + 1}`}
                  >
                    <Share2 className="h-3 w-3 mr-1" /> Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] border-border hover:border-green-500/40 hover:text-green-400"
                    data-ocid={`strategies.secondary_button.${i + 1}`}
                  >
                    Monetize
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
