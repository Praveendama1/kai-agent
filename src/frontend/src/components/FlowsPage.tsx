import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Pause,
  Play,
  Plus,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface FlowNode {
  type: "trigger" | "condition" | "action" | "outcome";
  icon: typeof Zap;
  title: string;
  desc: string;
}

interface Flow {
  id: string;
  name: string;
  status: "Running" | "Paused";
  lastRun: string;
  accuracy: number;
  nodes: FlowNode[];
}

const FLOWS: Flow[] = [
  {
    id: "1",
    name: "NVDA Confidence Monitor",
    status: "Running",
    lastRun: "7 min ago",
    accuracy: 78,
    nodes: [
      {
        type: "trigger",
        icon: TrendingUp,
        title: "Price Alert",
        desc: "NVDA > $180",
      },
      {
        type: "condition",
        icon: Activity,
        title: "Volume Check",
        desc: "Volume High",
      },
      { type: "action", icon: Zap, title: "Buy Signal", desc: "+ Alert sent" },
      { type: "outcome", icon: CheckCircle2, title: "Executed", desc: "+2.3%" },
    ],
  },
  {
    id: "2",
    name: "Portfolio Auto-Simulate",
    status: "Paused",
    lastRun: "2 hrs ago",
    accuracy: 64,
    nodes: [
      {
        type: "trigger",
        icon: Activity,
        title: "Schedule",
        desc: "Daily 9:00 AM",
      },
      {
        type: "condition",
        icon: AlertTriangle,
        title: "Risk Check",
        desc: "If risk > Medium",
      },
      {
        type: "action",
        icon: Bot,
        title: "Simulate",
        desc: "Run portfolio sim",
      },
      {
        type: "outcome",
        icon: CheckCircle2,
        title: "Report",
        desc: "Saved to log",
      },
    ],
  },
  {
    id: "3",
    name: "Crypto Alert System",
    status: "Running",
    lastRun: "1 min ago",
    accuracy: 71,
    nodes: [
      {
        type: "trigger",
        icon: TrendingUp,
        title: "BTC Spike",
        desc: "Volume > 2x avg",
      },
      {
        type: "condition",
        icon: Activity,
        title: "Trend Check",
        desc: "Bullish signal",
      },
      { type: "action", icon: Bell, title: "Notify", desc: "Push alert sent" },
      { type: "outcome", icon: CheckCircle2, title: "Tracked", desc: "Logged" },
    ],
  },
];

const AI_TEMPLATES = [
  {
    name: "NVDA Momentum Flow",
    creator: "Kai AI",
    desc: "Buys on volume + bullish breakout",
    accuracy: 76,
  },
  {
    name: "Crypto Swing Trader",
    creator: "Kai AI",
    desc: "High volume trigger → buy/sell signal",
    accuracy: 68,
  },
  {
    name: "Risk Guard",
    creator: "Kai AI",
    desc: "Portfolio drops 5% → stop-loss trigger",
    accuracy: 82,
  },
];

const NODE_COLORS: Record<string, string> = {
  trigger: "border-primary/40 bg-primary/10 text-primary",
  condition: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  action: "border-green-500/40 bg-green-500/10 text-green-400",
  outcome: "border-purple-500/40 bg-purple-500/10 text-purple-400",
};

const NODE_LABELS: Record<string, string> = {
  trigger: "TRIGGER",
  condition: "CONDITION",
  action: "ACTION",
  outcome: "OUTCOME",
};

export function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>(FLOWS);
  const [selectedFlow, setSelectedFlow] = useState<Flow>(FLOWS[0]);

  function toggleFlow(id: string) {
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newStatus = f.status === "Running" ? "Paused" : "Running";
        toast.success(
          `Flow ${newStatus === "Running" ? "resumed" : "paused"}`,
          {
            description: f.name,
            icon:
              newStatus === "Running" ? (
                <Play className="h-4 w-4 text-green-400" />
              ) : (
                <Pause className="h-4 w-4 text-yellow-400" />
              ),
          },
        );
        return { ...f, status: newStatus as "Running" | "Paused" };
      }),
    );
    setSelectedFlow((prev) => {
      if (prev.id !== id) return prev;
      const newStatus = prev.status === "Running" ? "Paused" : "Running";
      return { ...prev, status: newStatus as "Running" | "Paused" };
    });
  }

  function createFlow() {
    toast.success("New flow created", {
      description: "Configure nodes in the canvas.",
    });
    const newFlow: Flow = {
      id: crypto.randomUUID(),
      name: `Custom Flow ${flows.length + 1}`,
      status: "Paused",
      lastRun: "Never",
      accuracy: 0,
      nodes: [
        {
          type: "trigger",
          icon: TrendingUp,
          title: "Trigger",
          desc: "Set condition",
        },
        {
          type: "condition",
          icon: Activity,
          title: "Condition",
          desc: "Define rule",
        },
        { type: "action", icon: Zap, title: "Action", desc: "Choose action" },
        {
          type: "outcome",
          icon: CheckCircle2,
          title: "Outcome",
          desc: "Track result",
        },
      ],
    };
    setFlows((prev) => [...prev, newFlow]);
    setSelectedFlow(newFlow);
  }

  function applyTemplate(name: string) {
    toast.success(`Template activated: ${name}`, {
      description: "Added to your flows and set to Paused.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Flow List */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-card border border-border rounded-xl p-4"
          data-ocid="flows.panel"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm text-foreground">
              My Flows
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] border-green-500/40 text-green-400"
            >
              {flows.filter((f) => f.status === "Running").length} running
            </Badge>
          </div>
          <div className="space-y-2 mb-4">
            {flows.map((flow, i) => (
              <button
                type="button"
                key={flow.id}
                onClick={() => setSelectedFlow(flow)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedFlow.id === flow.id
                    ? "bg-primary/10 border-primary/40"
                    : "bg-secondary/30 border-border hover:border-border/60"
                }`}
                data-ocid={`flows.item.${i + 1}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${flow.status === "Running" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}
                  />
                  <span className="text-xs font-medium text-foreground truncate">
                    {flow.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {flow.lastRun}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] py-0 h-4 ${flow.status === "Running" ? "border-green-500/40 text-green-400" : "border-yellow-500/40 text-yellow-400"}`}
                  >
                    {flow.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={createFlow}
            variant="outline"
            className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10 text-xs h-8"
            data-ocid="flows.open_modal_button"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Flow
          </Button>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-card border border-border rounded-xl p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFlow.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-display font-semibold text-foreground">
                      {selectedFlow.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${selectedFlow.status === "Running" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {selectedFlow.status} · Last: {selectedFlow.lastRun}
                      </span>
                      {selectedFlow.accuracy > 0 && (
                        <Badge
                          variant="outline"
                          className="text-[9px] border-primary/40 text-primary"
                        >
                          {selectedFlow.accuracy}% accuracy
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-border"
                    onClick={() => toggleFlow(selectedFlow.id)}
                    data-ocid="flows.toggle"
                  >
                    {selectedFlow.status === "Running" ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-muted-foreground"
                    data-ocid="flows.secondary_button"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Visual Flow Nodes */}
              <div className="overflow-x-auto pb-2">
                <div className="flex items-center gap-2 min-w-max">
                  {selectedFlow.nodes.map((node, i) => (
                    <div key={node.title} className="flex items-center gap-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative p-4 rounded-xl border w-40 ${NODE_COLORS[node.type]}`}
                        data-ocid={`flows.card.${i + 1}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            className={`text-[9px] py-0 h-4 border-0 ${node.type === "trigger" ? "bg-primary/20 text-primary" : node.type === "condition" ? "bg-yellow-500/20 text-yellow-400" : node.type === "action" ? "bg-green-500/20 text-green-400" : "bg-purple-500/20 text-purple-400"}`}
                          >
                            {NODE_LABELS[node.type]}
                          </Badge>
                          <Settings className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                        </div>
                        <node.icon className="h-5 w-5 mb-2" />
                        <div className="text-xs font-semibold text-foreground">
                          {node.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {node.desc}
                        </div>
                      </motion.div>
                      {i < selectedFlow.nodes.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Self-improvement badge */}
              {selectedFlow.accuracy > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-lg px-4 py-2.5"
                >
                  <Bot className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">
                      Self-Improvement:
                    </span>{" "}
                    Last run accuracy: {selectedFlow.accuracy}% → Threshold
                    adjusted to improve performance.
                  </p>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* AI Flow Templates */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold text-foreground">
            AI Flow Templates
          </h2>
          <Badge
            variant="outline"
            className="text-[10px] border-primary/40 text-primary ml-1"
          >
            Kai AI ✦
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {AI_TEMPLATES.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="p-4 rounded-xl border border-border bg-secondary/30 hover:border-primary/30 transition-colors"
              data-ocid={`flows.item.${i + 4}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">
                  {t.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] border-primary/40 text-primary shrink-0 ml-2"
                >
                  {t.accuracy}%
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">{t.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {t.creator}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => applyTemplate(t.name)}
                  data-ocid={`flows.button.${i + 1}`}
                >
                  Use Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
