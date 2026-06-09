import Anthropic from '@anthropic-ai/sdk';
import type { Kline, SignalResult } from '../types.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  const changes = closes.slice(1).map((v, i) => v - closes[i]);
  const gains = changes.map(c => Math.max(c, 0));
  const losses = changes.map(c => Math.max(-c, 0));

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  const rs = avgGain / (avgLoss || 0.0001);
  return Math.round((100 - 100 / (1 + rs)) * 100) / 100;
}

export async function generateSignal(
  klines: Kline[],
  currentPrice: number,
  hasOpenPosition: boolean,
): Promise<SignalResult> {
  const closes = klines.map(k => k.close);
  const rsi = calculateRSI(closes);
  const change24h = closes.length > 1
    ? ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100
    : 0;

  const recent = klines.slice(-20).map(k =>
    `O:${k.open.toFixed(0)} H:${k.high.toFixed(0)} L:${k.low.toFixed(0)} C:${k.close.toFixed(0)} V:${k.volume.toFixed(0)}`
  ).join('\n');

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are a BTC/USDT perpetual futures signal generator (Bybit Testnet, 15-min chart).\n\nMarket snapshot:\n- Price: $${currentPrice.toFixed(2)}\n- RSI(14): ${rsi.toFixed(1)}\n- Change (this window): ${change24h.toFixed(2)}%\n- Open position: ${hasOpenPosition ? 'YES — output HOLD' : 'NO'}\n\nRecent 15-min candles (oldest → newest):\n${recent}\n\nReply with ONLY valid JSON, no markdown:\n{"direction":"LONG"|"SHORT"|"HOLD","confidence":0.0-1.0,"reasoning":"1-2 sentences"}\n\nRules: HOLD if confidence < 0.65 or open position exists.`,
    }],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text.trim();
  const parsed = JSON.parse(raw) as { direction: 'LONG' | 'SHORT' | 'HOLD'; confidence: number; reasoning: string };

  return {
    direction: parsed.direction,
    confidence: Math.min(1, Math.max(0, parsed.confidence)),
    reasoning: parsed.reasoning,
    indicators: { rsi, price: currentPrice, change24h },
  };
}
