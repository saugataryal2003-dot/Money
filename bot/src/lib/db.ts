import { createClient } from '@supabase/supabase-js';
import type { SignalResult, BotState } from '../types.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function saveSnapshot(state: BotState): Promise<void> {
  await supabase.from('portfolio_snapshots').insert({
    balance: state.balance,
    equity: state.equity,
    unrealized_pnl: state.unrealizedPnl,
  });
}

export async function saveSignal(signal: SignalResult): Promise<string | null> {
  const { data } = await supabase
    .from('signals')
    .insert({
      pair: 'BTCUSDT',
      direction: signal.direction,
      confidence: signal.confidence,
      reasoning: signal.reasoning,
      indicators: signal.indicators,
      price_at_signal: signal.indicators.price,
    })
    .select('id')
    .single();
  return (data as { id: string } | null)?.id ?? null;
}

export async function saveTrade(params: {
  bybitOrderId: string;
  side: 'Buy' | 'Sell';
  size: number;
  leverage: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  signalId: string | null;
}): Promise<string | null> {
  const { data } = await supabase
    .from('trades')
    .insert({
      bybit_order_id: params.bybitOrderId,
      pair: 'BTCUSDT',
      side: params.side,
      size: params.size,
      leverage: params.leverage,
      entry_price: params.entryPrice,
      stop_loss: params.stopLoss,
      take_profit: params.takeProfit,
      status: 'open',
      signal_id: params.signalId,
    })
    .select('id')
    .single();
  return (data as { id: string } | null)?.id ?? null;
}

export async function closeTrade(tradeId: string, exitPrice: number, pnl: number): Promise<void> {
  await supabase
    .from('trades')
    .update({
      exit_price: exitPrice,
      pnl,
      pnl_pct: exitPrice > 0 ? (pnl / exitPrice) * 100 : 0,
      status: 'closed',
      closed_at: new Date().toISOString(),
    })
    .eq('id', tradeId);
}

export async function log(
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: unknown,
): Promise<void> {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level.toUpperCase()}] ${message}`, data !== undefined ? JSON.stringify(data) : '');
  await supabase.from('bot_logs').insert({ level, message, data: data ?? null });
}
