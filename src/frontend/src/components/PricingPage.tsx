import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Check, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    icon: Zap,
    description: "Get started with AI-powered market insights",
    features: [
      "2 active workflows",
      "Basic market alerts",
      "7-day chat history",
      "Community support",
      "MSFT & NVDA tracking",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    icon: Star,
    description: "Everything you need to trade smarter",
    features: [
      "Unlimited workflows",
      "Real-time market warnings",
      "1-year chat history",
      "Priority support",
      "Flow monetization enabled",
      "Advanced portfolio analytics",
      "2FA security",
      "Custom alert thresholds",
    ],
    cta: "Upgrade Now",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/ month",
    icon: Building2,
    description: "For power users and institutional traders",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "Dedicated account manager",
      "SLA guarantee (99.9%)",
      "White-label options",
      "Full API access",
      "Team collaboration (up to 10)",
      "Custom data integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Simple Pricing
        </h1>
        <p className="text-muted-foreground text-lg">
          Start free, scale when you're ready
        </p>
      </motion.div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        data-ocid="pricing.section"
      >
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex flex-col rounded-2xl p-6 border transition-all ${
              plan.highlighted
                ? "bg-card border-primary shadow-glow"
                : "bg-card border-border"
            }`}
            data-ocid={`pricing.item.${i + 1}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-3">
                  {plan.badge}
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlighted ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <plan.icon
                  className={`h-5 w-5 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <div className="font-display font-bold text-foreground">
                  {plan.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {plan.description}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                {plan.period}
              </span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check
                    className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-primary" : "text-green-400"}`}
                  />
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.highlighted
                  ? "bg-primary hover:bg-primary/80 text-primary-foreground"
                  : "border border-border bg-transparent hover:bg-muted text-foreground"
              }`}
              variant={plan.highlighted ? "default" : "outline"}
              data-ocid={`pricing.primary_button.${i + 1}`}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center p-6 rounded-2xl bg-card border border-border"
      >
        <p className="text-muted-foreground text-sm">
          All plans include 30-day money-back guarantee. Prices in USD. Flow
          monetization earnings are in INR (₹).
        </p>
      </motion.div>
    </div>
  );
}
