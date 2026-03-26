import { useCallback, useEffect, useRef, useState } from "react";
import type { MarketData } from "../engine/ChatEngine";

interface AssetConfig {
  price: number;
  marketCap: string;
  peRatio: number;
  band: number;
  type: "stock" | "crypto";
}

const INITIAL: Record<string, AssetConfig> = {
  NVDA: {
    price: 179.4,
    marketCap: "$4.5T",
    peRatio: 45,
    band: 0.028,
    type: "stock",
  },
  MSFT: {
    price: 420.15,
    marketCap: "$3.1T",
    peRatio: 35,
    band: 0.018,
    type: "stock",
  },
  AAPL: {
    price: 189.3,
    marketCap: "$2.9T",
    peRatio: 29,
    band: 0.015,
    type: "stock",
  },
  TSLA: {
    price: 245.6,
    marketCap: "$780B",
    peRatio: 62,
    band: 0.038,
    type: "stock",
  },
  AMZN: {
    price: 185.2,
    marketCap: "$1.9T",
    peRatio: 42,
    band: 0.022,
    type: "stock",
  },
  GOOGL: {
    price: 172.8,
    marketCap: "$2.1T",
    peRatio: 24,
    band: 0.02,
    type: "stock",
  },
  META: {
    price: 510.5,
    marketCap: "$1.3T",
    peRatio: 28,
    band: 0.025,
    type: "stock",
  },
  NFLX: {
    price: 681.2,
    marketCap: "$296B",
    peRatio: 42,
    band: 0.022,
    type: "stock",
  },
  AMD: {
    price: 168.4,
    marketCap: "$272B",
    peRatio: 38,
    band: 0.032,
    type: "stock",
  },
  JPM: {
    price: 198.7,
    marketCap: "$576B",
    peRatio: 12,
    band: 0.012,
    type: "stock",
  },
  BTC: {
    price: 67420,
    marketCap: "$1.3T",
    peRatio: 0,
    band: 0.045,
    type: "crypto",
  },
  ETH: {
    price: 3582,
    marketCap: "$430B",
    peRatio: 0,
    band: 0.042,
    type: "crypto",
  },
};

const VOLUME_OPTIONS: MarketData["volume"][] = ["Low", "Medium", "High"];
const VOLUME_WEIGHTS = [0.3, 0.5, 0.2];

function weightedVolume(): MarketData["volume"] {
  const r = Math.random();
  if (r < VOLUME_WEIGHTS[0]) return VOLUME_OPTIONS[0];
  if (r < VOLUME_WEIGHTS[0] + VOLUME_WEIGHTS[1]) return VOLUME_OPTIONS[1];
  return VOLUME_OPTIONS[2];
}

function randomWalk(price: number, maxPct: number): number {
  const pct = (Math.random() - 0.5) * 2 * maxPct;
  return price * (1 + pct);
}

function getVolatility(absPct: number): MarketData["volatility"] {
  if (absPct < 0.5) return "Low";
  if (absPct < 1.5) return "Medium";
  return "High";
}

function genSparkline(basePrice: number, band: number, count = 20): number[] {
  const points: number[] = [];
  let p = basePrice;
  for (let i = 0; i < count; i++) {
    p = randomWalk(p, band * 0.6);
    points.unshift(p);
  }
  return points;
}

function computeAiScore(
  sparkline: number[],
  volatility: MarketData["volatility"],
): number {
  if (sparkline.length < 2) return 5;
  const first = sparkline[0];
  const last = sparkline[sparkline.length - 1];
  const momentum = (last - first) / first;
  let score = 5 + momentum * 100;
  if (volatility === "High") score -= 1;
  if (volatility === "Low") score += 0.5;
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function computeTrend(sparkline: number[]): MarketData["trend"] {
  if (sparkline.length < 5) return "Neutral";
  const recent = sparkline.slice(-5);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const pct = ((last - first) / first) * 100;
  if (pct > 0.4) return "Bullish";
  if (pct < -0.4) return "Bearish";
  return "Neutral";
}

function computeConfidence(
  aiScore: number,
  volatility: MarketData["volatility"],
): number {
  let base = aiScore * 10;
  if (volatility === "High") base -= 12;
  if (volatility === "Low") base += 8;
  return Math.max(
    45,
    Math.min(96, Math.round(base + (Math.random() - 0.5) * 10)),
  );
}

function getLastUpdated(): string {
  const secs = ["2s", "3s", "4s", "5s", "6s"];
  return `Updated ${secs[Math.floor(Math.random() * secs.length)]} ago`;
}

function initMarket(symbol: string): MarketData {
  const cfg = INITIAL[symbol];
  const sparkline = genSparkline(cfg.price, cfg.band);
  const change =
    ((sparkline[sparkline.length - 1] - sparkline[sparkline.length - 2]) /
      sparkline[sparkline.length - 2]) *
    100;
  const volatility = getVolatility(Math.abs(change));
  const aiScore = computeAiScore(sparkline, volatility);
  return {
    symbol,
    price: cfg.price,
    change,
    volatility,
    aiScore,
    trend: computeTrend(sparkline),
    volume: weightedVolume(),
    marketCap: cfg.marketCap,
    peRatio: cfg.peRatio,
    sparkline,
    confidence: computeConfidence(aiScore, volatility),
    lastUpdated: getLastUpdated(),
    type: cfg.type,
  };
}

export function useMarketSimulator() {
  const [markets, setMarkets] = useState<MarketData[]>(() =>
    Object.keys(INITIAL).map(initMarket),
  );

  const pricesRef = useRef<Record<string, number>>(
    Object.fromEntries(Object.entries(INITIAL).map(([s, v]) => [s, v.price])),
  );

  const tick = useCallback(() => {
    setMarkets((prev) =>
      prev.map((m) => {
        const band = INITIAL[m.symbol].band;
        const oldPrice = pricesRef.current[m.symbol];
        const newPrice = randomWalk(oldPrice, band);
        const changePct = ((newPrice - oldPrice) / oldPrice) * 100;
        pricesRef.current[m.symbol] = newPrice;
        const newSparkline = [...m.sparkline.slice(1), newPrice];
        const volatility = getVolatility(Math.abs(changePct));
        const aiScore = computeAiScore(newSparkline, volatility);
        return {
          ...m,
          price: newPrice,
          change: changePct,
          volatility,
          sparkline: newSparkline,
          aiScore,
          trend: computeTrend(newSparkline),
          volume: weightedVolume(),
          confidence: computeConfidence(aiScore, volatility),
          lastUpdated: getLastUpdated(),
        };
      }),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 3000);
    return () => clearInterval(interval);
  }, [tick]);

  return markets;
}
