import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  BarChart2,
  GitBranch,
  Pause,
  Play,
  Plus,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const ALL_ASSETS = [
  "NVDA",
  "MSFT",
  "AAPL",
  "TSLA",
  "AMZN",
  "GOOGL",
  "META",
  "AMD",
  "NFLX",
  "JPM",
  "BTC",
  "ETH",
];

type RiskLevel = "Low" | "Medium" | "Medium-High" | "High";
type Status = "Active" | "Paused";

interface Strategy {
  id: number;
  name: string;
  description: string;
  assets: string[];
  returnPct: number;
  risk: RiskLevel;
  status: Status;
  analyzers: string[];
  flows: string[];
  createdBy: "ai" | "user";
}

const INITIAL_STRATEGIES: Strategy[] = [
  {
    id: 1,
    name: "AI Growth Strategy",
    description:
      "Momentum-based strategy targeting high-growth AI and semiconductor stocks.",
    assets: ["NVDA", "MSFT", "AMD"],
    returnPct: 14.2,
    risk: "Medium",
    status: "Active",
    analyzers: ["NVDA Momentum", "AMD Signal"],
    flows: ["AI Alert Flow"],
    createdBy: "ai",
  },
  {
    id: 2,
    name: "High Volatility Trader",
    description:
      "Capitalizes on high-volatility assets using stop-loss automation and swing signals.",
    assets: ["TSLA", "BTC"],
    returnPct: 8.7,
    risk: "High",
    status: "Paused",
    analyzers: ["High Vol Detector"],
    flows: ["Stop-Loss Flow"],
    createdBy: "ai",
  },
  {
    id: 3,
    name: "Crypto Swing Strategy",
    description:
      "Swing trading on major crypto assets with AI-generated entry and exit signals.",
    assets: ["BTC", "ETH"],
    returnPct: 11.3,
    risk: "Medium-High",
    status: "Active",
    analyzers: ["Crypto Swing AI"],
    flows: ["Crypto Monitor"],
    createdBy: "ai",
  },
];

const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "border-green-500/40 text-green-400 bg-green-500/10",
  Medium: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
  "Medium-High": "border-orange-500/40 text-orange-400 bg-orange-500/10",
  High: "border-red-500/40 text-red-400 bg-red-500/10",
};

export function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(INITIAL_STRATEGIES);
  const [open, setOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formGoal, setFormGoal] = useState("");
  const [formRisk, setFormRisk] = useState<RiskLevel>("Medium");
  const [formAssets, setFormAssets] = useState<string[]>([]);

  const activeCount = strategies.filter((s) => s.status === "Active").length;
  const avgReturn =
    strategies.reduce((sum, s) => sum + s.returnPct, 0) / strategies.length;
  const best = strategies.reduce((a, b) => (a.returnPct > b.returnPct ? a : b));

  const toggleAsset = (asset: string) => {
    setFormAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset],
    );
  };

  const handleCreate = () => {
    if (!formName.trim()) return;
    const newStrategy: Strategy = {
      id: Date.now(),
      name: formName.trim(),
      description: formGoal.trim() || "User-created strategy.",
      assets: formAssets.length ? formAssets : ["NVDA"],
      returnPct: 0,
      risk: formRisk,
      status: "Active",
      analyzers: [],
      flows: [],
      createdBy: "user",
    };
    setStrategies((prev) => [newStrategy, ...prev]);
    setFormName("");
    setFormGoal("");
    setFormRisk("Medium");
    setFormAssets([]);
    setOpen(false);
  };

  const toggleStatus = (id: number) => {
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Paused" : "Active" }
          : s,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
        data-ocid="strategies.panel"
      >
        <div>
          <h1 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Strategies
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Combine analyzers + workflows into self-executing investment systems
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/80 text-primary-foreground h-9 rounded-lg text-sm"
              data-ocid="strategies.open_modal_button"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Create Strategy
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border text-foreground max-w-md"
            data-ocid="strategies.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">New Strategy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Strategy Name
                </Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tech Momentum 2026"
                  className="bg-secondary/40 border-border text-foreground"
                  data-ocid="strategies.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Risk Level
                </Label>
                <Select
                  value={formRisk}
                  onValueChange={(v) => setFormRisk(v as RiskLevel)}
                >
                  <SelectTrigger
                    className="bg-secondary/40 border-border"
                    data-ocid="strategies.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {(
                      ["Low", "Medium", "Medium-High", "High"] as RiskLevel[]
                    ).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Select Assets
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {ALL_ASSETS.map((asset) => (
                    <div
                      key={asset}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <Checkbox
                        checked={formAssets.includes(asset)}
                        onCheckedChange={() => toggleAsset(asset)}
                        data-ocid="strategies.checkbox"
                      />
                      <span className="text-xs text-muted-foreground">
                        {asset}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Goal</Label>
                <Textarea
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  placeholder="Describe the strategy goal..."
                  className="bg-secondary/40 border-border text-foreground text-sm resize-none"
                  rows={2}
                  data-ocid="strategies.textarea"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => setOpen(false)}
                data-ocid="strategies.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formName.trim()}
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
                data-ocid="strategies.submit_button"
              >
                Create Strategy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          {
            label: "Total Strategies",
            value: strategies.length.toString(),
            icon: Target,
            color: "text-primary",
          },
          {
            label: "Active",
            value: activeCount.toString(),
            icon: Activity,
            color: "text-green-400",
          },
          {
            label: "Avg Return",
            value: `+${avgReturn.toFixed(1)}%`,
            icon: TrendingUp,
            color: "text-green-400",
          },
          {
            label: "Best Performer",
            value: best.name.split(" ").slice(0, 2).join(" "),
            icon: Sparkles,
            color: "text-yellow-400",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
            data-ocid={`strategies.card.${i + 1}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.color} shrink-0`} />
            <div>
              <div className={`font-display font-bold text-lg ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {strategies.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4"
              data-ocid={`strategies.item.${i + 1}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-foreground text-sm truncate">
                      {s.name}
                    </span>
                    {s.createdBy === "ai" && (
                      <Badge
                        variant="outline"
                        className="text-[9px] border-primary/40 text-primary shrink-0"
                      >
                        <Sparkles className="h-2.5 w-2.5 mr-0.5" /> AI
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`h-2 w-2 rounded-full ${s.status === "Active" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      s.status === "Active"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>

              {/* Asset badges */}
              <div className="flex flex-wrap gap-1.5">
                {s.assets.map((a) => (
                  <Badge
                    key={a}
                    variant="outline"
                    className="text-[10px] border-border text-muted-foreground"
                  >
                    {a}
                  </Badge>
                ))}
              </div>

              {/* Metrics row */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground mb-0.5">
                    Return
                  </div>
                  <div
                    className={`font-display font-bold text-base ${
                      s.returnPct >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {s.returnPct >= 0 ? "+" : ""}
                    {s.returnPct.toFixed(1)}%
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground mb-0.5">
                    Risk
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${RISK_COLORS[s.risk]}`}
                  >
                    {s.risk}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground mb-0.5">
                    Components
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <BarChart2 className="h-3 w-3" />
                      {s.analyzers.length}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <GitBranch className="h-3 w-3" />
                      {s.flows.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <Button
                  size="sm"
                  className={`flex-1 h-7 text-xs rounded-lg ${
                    s.status === "Active"
                      ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30"
                      : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                  }`}
                  variant="ghost"
                  onClick={() => toggleStatus(s.id)}
                  data-ocid={`strategies.toggle.${i + 1}`}
                >
                  {s.status === "Active" ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" /> Run
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                  data-ocid={`strategies.secondary_button.${i + 1}`}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground hover:text-primary text-xs"
                  data-ocid={`strategies.button.${i + 1}`}
                >
                  Details
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {strategies.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="strategies.empty_state"
        >
          <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No strategies yet. Create your first one.</p>
        </div>
      )}

      {/* Kai Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/8 px-5 py-4"
      >
        <Zap className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm text-primary/90">
          <span className="font-semibold">Kai Insight:</span> AI Growth Strategy
          is performing 12% above benchmark this week. Consider increasing
          allocation to NVDA.
        </p>
      </motion.div>
    </div>
  );
}
