export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volatility: "Low" | "Medium" | "High";
  aiScore: number;
  trend: "Bullish" | "Bearish" | "Neutral";
  volume: "Low" | "Medium" | "High";
  marketCap: string;
  peRatio: number;
  sparkline: number[];
  confidence: number;
  lastUpdated: string;
  type: "stock" | "crypto";
}

export interface ChatContext {
  markets: MarketData[];
  currentPage?: string;
}

const RESPONSES: Record<string, (ctx: ChatContext, query: string) => string> = {
  msft: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "MSFT");
    const price = m ? `$${m.price.toFixed(2)}` : "~$420";
    const trend =
      m && m.change > 0 ? "📈 trending upward" : "📉 under pressure";
    const vol = m?.volatility ?? "Medium";
    const rec =
      vol === "High"
        ? "HOLD — elevated volatility"
        : m && m.change > 1
          ? "BUY signal — positive momentum"
          : "HOLD — stable range";
    return `**Microsoft (MSFT) Analysis**\n\nCurrent price: **${price}** | ${trend} | Volatility: **${vol}**\n\n**AI Confidence Score: ${m?.aiScore ?? 78}/10**\n\nMSFT remains a cornerstone of enterprise AI and cloud infrastructure. Azure revenue continues double-digit growth, and Copilot AI integration is driving ARPU expansion across Office 365.\n\n**Key Metrics:**\n- P/E Ratio: ~35x (sector-premium justified by AI exposure)\n- Cloud growth: +28% YoY\n- AI licensing revenue: accelerating\n\n**Recommendation: ${rec}**\n\nWatch for earnings report catalyst. Strong institutional support above $400 support level.`;
  },
  nvda: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "NVDA");
    const price = m ? `$${m.price.toFixed(2)}` : "~$179";
    const trend = m && m.change > 0 ? "📈 bullish" : "📉 correcting";
    return `**NVIDIA (NVDA) Analysis**\n\nCurrent price: **${price}** | ${trend} | Volatility: **${m?.volatility ?? "High"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 9}/10**\n\nNVDA is the defining infrastructure play of the AI era. H100/H200 GPU demand from hyperscalers remains severely supply-constrained through 2025.\n\n**Growth Drivers:**\n- Data center revenue: $47B run rate\n- Blackwell GPU architecture: next supercycle\n- CUDA ecosystem moat: 5+ year lead\n- Sovereign AI deals: 40+ countries\n\n**Trend: ${m?.trend ?? "Bullish"}** — AI chip demand shows no signs of slowing.\n\n**Recommendation: BUY on dips** — long-term structural winner.`;
  },
  aapl: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "AAPL");
    const price = m ? `$${m.price.toFixed(2)}` : "~$189";
    return `**Apple (AAPL) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Low"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 7}/10**\n\nAPPL combines unmatched brand loyalty with a growing high-margin services ecosystem. Apple Intelligence AI features are driving upgrade cycles.\n\n**Key Metrics:**\n- Market Cap: $2.9T\n- P/E Ratio: ~29x\n- Services revenue: $24B/quarter (record)\n- iPhone installed base: 1.2B devices\n\n**Trend: ${m?.trend ?? "Neutral"}** — Stable compounder with AI optionality.\n\n**Recommendation: HOLD** — Best for defensive growth portfolios.`;
  },
  tsla: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "TSLA");
    const price = m ? `$${m.price.toFixed(2)}` : "~$245";
    const vol = m?.volatility ?? "High";
    const warning =
      vol === "High"
        ? "\n\n⚠️ **Volatility Warning:** TSLA is showing high volatility. Consider position sizing carefully."
        : "";
    return `**Tesla (TSLA) Analysis**\n\nCurrent price: **${price}** | Volatility: **${vol}**\n\n**AI Confidence Score: ${m?.aiScore ?? 6}/10**\n\nTSLA trades on Elon Musk's innovation narrative as much as fundamentals. FSD progress and Robotaxi timeline are key catalysts.${warning}\n\n**Key Metrics:**\n- Market Cap: $780B\n- P/E Ratio: ~62x (premium for optionality)\n- EV delivery growth: moderating\n- Energy storage: fastest-growing segment\n\n**Trend: ${m?.trend ?? "Neutral"}** — High-risk, high-reward.\n\n**Recommendation: TRADE** — Better for active traders than long-term investors.`;
  },
  amzn: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "AMZN");
    const price = m ? `$${m.price.toFixed(2)}` : "~$185";
    return `**Amazon (AMZN) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Medium"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 8}/10**\n\nAMZN's AWS cloud division is the profit engine powering retail expansion and AI infrastructure bets.\n\n**Key Metrics:**\n- Market Cap: $1.9T\n- P/E Ratio: ~42x\n- AWS growth: +17% YoY\n- Advertising revenue: $14B/quarter\n\n**Trend: ${m?.trend ?? "Bullish"}** — AWS AI services driving re-acceleration.\n\n**Recommendation: BUY** — Balanced growth + cloud infrastructure exposure.`;
  },
  googl: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "GOOGL");
    const price = m ? `$${m.price.toFixed(2)}` : "~$172";
    return `**Google (GOOGL) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Low"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 8}/10**\n\nGOOGL dominates search (90% share) while its Gemini AI suite challenges OpenAI across enterprise and consumer markets.\n\n**Key Metrics:**\n- Market Cap: $2.1T\n- P/E Ratio: ~24x (attractive for AI growth)\n- YouTube ad revenue: $9B/quarter\n- Google Cloud: +28% YoY\n\n**Trend: ${m?.trend ?? "Bullish"}** — Search moat + AI transformation.\n\n**Recommendation: BUY** — Best value AI play in mega-cap tech.`;
  },
  meta: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "META");
    const price = m ? `$${m.price.toFixed(2)}` : "~$510";
    return `**Meta (META) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Medium"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 8}/10**\n\nMETA's AI-driven ad targeting and Llama open-source strategy are delivering record ROI. Reality Labs remains a long-term bet.\n\n**Key Metrics:**\n- Market Cap: $1.3T\n- P/E Ratio: ~28x\n- Ad revenue: $40B/quarter\n- Daily Active Users: 3.2B\n\n**Trend: ${m?.trend ?? "Bullish"}** — Strong cash flow + AI advertising edge.\n\n**Recommendation: BUY** — High cash flow + future VR/AI optionality.`;
  },
  btc: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "BTC");
    const price = m ? `$${m.price.toLocaleString()}` : "~$67,000";
    const vol = m?.volatility ?? "High";
    const warning =
      vol === "High"
        ? "\n\n⚠️ **Volatility Warning:** BTC is showing high volatility. Consider reducing position size."
        : "";
    return `**Bitcoin (BTC) Analysis**\n\nCurrent price: **${price}** | Volatility: **${vol}**${warning}\n\nBTC is in post-halving consolidation phase. Institutional ETF inflows remain strong.\n\n**Price Targets:**\n- Bull case: $85,000\n- Base case: $62,000–$72,000\n- Bear case: $52,000\n\n⚠ Never allocate more than 5–10% of portfolio to any single crypto asset.`;
  },
  eth: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "ETH");
    const price = m ? `$${m.price.toLocaleString()}` : "~$3,500";
    return `**Ethereum (ETH) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Medium"}**\n\nETH offers programmable money + staking yield (~3.8% APR) + deflationary supply mechanics.\n\n**Recommendation: ACCUMULATE** on dips toward $3,200 support.`;
  },
  nflx: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "NFLX");
    const price = m ? `$${m.price.toFixed(2)}` : "~$680";
    return `**Netflix (NFLX) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Medium"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 7}/10**\n\nNFLX continues to dominate streaming with ad-tier monetization and password-sharing crackdown driving subscriber growth.\n\n**Recommendation: HOLD** — Strong content moat, monitor competition.`;
  },
  amd: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "AMD");
    const price = m ? `$${m.price.toFixed(2)}` : "~$168";
    return `**AMD Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Medium"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 7}/10**\n\nAMD's MI300X GPU is gaining AI traction, eating into NVDA's dominance. EPYC server CPUs continue strong growth.\n\n**Recommendation: BUY** — Best NVDA alternative for AI exposure.`;
  },
  jpm: (ctx) => {
    const m = ctx.markets.find((x) => x.symbol === "JPM");
    const price = m ? `$${m.price.toFixed(2)}` : "~$198";
    return `**JPMorgan Chase (JPM) Analysis**\n\nCurrent price: **${price}** | Volatility: **${m?.volatility ?? "Low"}**\n\n**AI Confidence Score: ${m?.aiScore ?? 7}/10**\n\nJPM is the gold standard of US banking — strong net interest income, diversified revenue, and leading AI adoption in finance.\n\n**Recommendation: BUY** — Best defensive financial stock with AI upside.`;
  },
  market: (ctx) => {
    const lines = ctx.markets.slice(0, 7).map((m) => {
      const arrow = m.change >= 0 ? "↑" : "↓";
      const color = m.change >= 0 ? "🟢" : "🔴";
      return `${color} **${m.symbol}**: $${m.price.toFixed(2)} ${arrow}${Math.abs(m.change).toFixed(2)}% | ${m.volatility} Vol | AI Score: ${m.aiScore}/10`;
    });
    const topPerformer = ctx.markets.reduce((a, b) =>
      a.change > b.change ? a : b,
    );
    const alerts = ctx.markets.filter((m) => Math.abs(m.change) > 2);
    const alertText =
      alerts.length > 0
        ? `\n\n⚡ **Active Alerts:**\n${alerts.map((m) => `- ${m.symbol} ${m.change > 0 ? "surged" : "dropped"} ${Math.abs(m.change).toFixed(2)}% — ${m.change > 0 ? "watch for breakout" : "consider reviewing position"}`).join("\n")}`
        : "\n\n✅ No major alerts — market relatively stable.";
    return `**Market Summary — 12-Asset Intelligence**\n\n🏆 **Top Performer: ${topPerformer.symbol}** (+${Math.max(0, topPerformer.change).toFixed(2)}%)\n\n${lines.join("\n")}${alertText}\n\n**Kai Recommendation:** Check the Markets tab for sparklines, AI scores, and comparison charts.`;
  },
  portfolio: () =>
    "**Portfolio Risk Analysis**\n\nBased on your active workflows:\n\n**Recommended Allocation:**\n- 📊 70% Equities (NVDA 20%, MSFT 15%, AAPL 10%, AMZN 10%, GOOGL 10%, META 5%)\n- 🔵 20% Stable Growth (diversified)\n- 🟡 10% High-Risk (TSLA, speculative)\n\n**Current Risk Score: 68/100** (Moderate-Aggressive)\n\n**Kai AI Recommendation:** Consider trimming TSLA exposure given high P/E (62x) and rotating into GOOGL (24x P/E) for better value.",
  workflow: () =>
    "**Active Workflows (3 running)**\n\n1. **NVDA Confidence Monitor** — 🟢 Running\n2. **Portfolio Auto-Simulate** — ⏸ Paused\n3. **Daily Brief Generator** — 🟢 Running\n\n**Create new workflow:** Use Quick Actions → Build Workflow.",
  consent: () =>
    "**Consent & Trust Panel**\n\n✅ **Portfolio Holdings** — Active | Expires Jan 2025\n✅ **Market Confidence Scores** — Active | Expires Dec 2024\n✅ **Alert Preferences** — Active | Permanent\n\nHushh's consent model gives you 40% revenue share on anonymized data you choose to monetize.",
  earnings: () =>
    "**Flow Monetization — This Month**\n\n💰 **Total Earned: ₹312 ($3.74 USD)**\n\n**Revenue Split:**\n- 🟢 You (40%): ₹124.80\n- 🔵 Kai AI (30%): ₹93.60\n- 🟡 Brand Partners (30%): ₹93.60\n\nUpgrade to **Pro** to unlock unlimited data flows and increase your earning potential.",
  pricing: () =>
    "**Kai Agent Pricing Plans**\n\n🆓 **Free** — $0/month\n⭐ **Pro** — $29/month (Most Popular)\n🏢 **Enterprise** — $99/month\n\nClick **Pricing** in the top nav to compare plans.",
  security: () =>
    "**Security Center**\n\n🔐 **Two-Factor Authentication (2FA)**\n- Status: configurable in Security settings\n- Method: TOTP (Google Authenticator, Authy)\n\n**Security Score: 75/100**",
  help: () =>
    "**What Kai Agent Can Do**\n\n📈 **Market Analysis** — Ask about NVDA, MSFT, AAPL, TSLA, AMZN, GOOGL, META, NFLX, AMD, JPM, BTC, ETH\n📼 **Portfolio & Risk** — Risk analysis and allocation suggestions\n⚙️ **Workflows** — Automation and alert creation\n🔒 **Platform** — Consent, monetization, security\n\nJust ask naturally — I understand financial context.",
  warning: (ctx) => {
    const drops = ctx.markets.filter((m) => m.change < -2);
    const surges = ctx.markets.filter((m) => m.change > 2);
    if (drops.length === 0 && surges.length === 0) {
      return "**Market Alerts — No Active Warnings**\n\n✅ All 12 tracked assets are within normal range (±2%).\n\nI continuously monitor NVDA, MSFT, AAPL, TSLA, AMZN, GOOGL, META, NFLX, AMD, JPM, BTC, ETH every 3 seconds.";
    }
    const msgs = [
      ...drops.map(
        (m) =>
          `🔴 **${m.symbol} dropped ${Math.abs(m.change).toFixed(2)}%** — Consider reviewing your position.`,
      ),
      ...surges.map(
        (m) =>
          `🟢 **${m.symbol} surged ${m.change.toFixed(2)}%** — Bullish momentum. Watch for continuation.`,
      ),
    ];
    return `**⚠ Active Market Alerts**\n\n${msgs.join("\n\n")}`;
  },
};

export function generateResponse(input: string, ctx: ChatContext): string {
  const q = input.toLowerCase();

  if (q.includes("msft") || q.includes("microsoft"))
    return RESPONSES.msft(ctx, input);
  if (q.includes("nvda") || q.includes("nvidia"))
    return RESPONSES.nvda(ctx, input);
  if (q.includes("aapl") || q.includes("apple"))
    return RESPONSES.aapl(ctx, input);
  if (q.includes("tsla") || q.includes("tesla"))
    return RESPONSES.tsla(ctx, input);
  if (q.includes("amzn") || q.includes("amazon"))
    return RESPONSES.amzn(ctx, input);
  if (q.includes("googl") || q.includes("google"))
    return RESPONSES.googl(ctx, input);
  if (q.includes("meta") || q.includes("facebook"))
    return RESPONSES.meta(ctx, input);
  if (q.includes("btc") || q.includes("bitcoin"))
    return RESPONSES.btc(ctx, input);
  if (q.includes("eth") || q.includes("ethereum"))
    return RESPONSES.eth(ctx, input);
  if (q.includes("nflx") || q.includes("netflix"))
    return RESPONSES.nflx(ctx, input);
  if (q.includes("amd")) return RESPONSES.amd(ctx, input);
  if (q.includes("jpm") || q.includes("jpmorgan"))
    return RESPONSES.jpm(ctx, input);
  if (
    q.includes("market") ||
    q.includes("today") ||
    q.includes("overview") ||
    q.includes("summary")
  )
    return RESPONSES.market(ctx, input);
  if (
    q.includes("warning") ||
    q.includes("alert") ||
    q.includes("drop") ||
    q.includes("crash") ||
    q.includes("fall")
  )
    return RESPONSES.warning(ctx, input);
  if (
    q.includes("portfolio") ||
    q.includes("risk") ||
    q.includes("allocat") ||
    q.includes("diversif")
  )
    return RESPONSES.portfolio(ctx, input);
  if (
    q.includes("invest") ||
    q.includes("buy") ||
    q.includes("forecast") ||
    q.includes("predict")
  )
    return `**Investment Guidance**\n\n${RESPONSES.market(ctx, input)}\n\nAlways do your own research — I'm an AI, not a licensed financial advisor.`;
  if (q.includes("workflow") || q.includes("automat") || q.includes("trigger"))
    return RESPONSES.workflow(ctx, input);
  if (q.includes("consent") || q.includes("data") || q.includes("privacy"))
    return RESPONSES.consent(ctx, input);
  if (
    q.includes("earn") ||
    q.includes("monetiz") ||
    q.includes("revenue") ||
    q.includes("₹")
  )
    return RESPONSES.earnings(ctx, input);
  if (
    q.includes("pric") ||
    q.includes("plan") ||
    q.includes("upgrade") ||
    q.includes("pro") ||
    q.includes("subscri")
  )
    return RESPONSES.pricing(ctx, input);
  if (
    q.includes("secur") ||
    q.includes("2fa") ||
    q.includes("authenticat") ||
    q.includes("login")
  )
    return RESPONSES.security(ctx, input);
  if (
    q.includes("help") ||
    q.includes("what can") ||
    q.includes("capabilities") ||
    q.includes("feature")
  )
    return RESPONSES.help(ctx, input);

  const marketSummary = RESPONSES.market(ctx, input);
  return `I understand you're asking about: "${input.slice(0, 60)}${input.length > 60 ? "..." : ""}"\n\nHere's the latest market context:\n\n${marketSummary}\n\nType **help** to see everything I can do.`;
}
