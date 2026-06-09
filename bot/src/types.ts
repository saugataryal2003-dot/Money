export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SignalResult {
  direction: 'LONG' | 'SHORT' | 'HOLD';
  confidence: number;
  reasoning: string;
  indicators: {
    rsi: number;
    price: number;
    change24h: number;
  };
}

export interface BotState {
  balance: number;
  equity: number;
  unrealizedPnl: number;
  openPosition: {
    side: 'Buy' | 'Sell';
    size: number;
    entryPrice: number;
    unrealizedPnl: number;
    stopLoss: number;
    takeProfit: number;
  } | null;
}
