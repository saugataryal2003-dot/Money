export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface PortfolioSnapshot {
  id: string;
  balance: number;
  equity: number;
  unrealized_pnl: number;
  timestamp: string;
}

export interface BotConfig {
  id: string;
  leverage: number;
  position_size_pct: number;
  max_positions: number;
  daily_loss_limit: number;
  stop_loss_pct: number;
  take_profit_pct: number;
  active: boolean;
  strategy: string;
  pair: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT' | 'HOLD';
  confidence: number;
  reasoning: string | null;
  indicators: Json | null;
  price_at_signal: number | null;
  acted_on: boolean;
  created_at: string;
}

export interface Trade {
  id: string;
  bybit_order_id: string | null;
  pair: string;
  side: 'Buy' | 'Sell';
  size: number;
  leverage: number | null;
  entry_price: number | null;
  exit_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  pnl: number | null;
  pnl_pct: number | null;
  status: 'open' | 'closed' | 'cancelled';
  signal_id: string | null;
  opened_at: string;
  closed_at: string | null;
}

export interface Position {
  id: string;
  bybit_position_id: string | null;
  pair: string;
  side: 'Buy' | 'Sell';
  size: number;
  leverage: number | null;
  entry_price: number | null;
  mark_price: number | null;
  liquidation_price: number | null;
  unrealized_pnl: number;
  stop_loss: number | null;
  take_profit: number | null;
  trade_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BotLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data: Json | null;
  created_at: string;
}
