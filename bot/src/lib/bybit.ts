import { RestClientV5 } from 'bybit-api';
import type { WalletBalanceV5, PositionV5 } from 'bybit-api';
import type { Kline, BotState } from '../types.js';

const client = new RestClientV5({
  key: process.env.BYBIT_API_KEY!,
  secret: process.env.BYBIT_API_SECRET!,
  testnet: process.env.BYBIT_TESTNET === 'true',
});

export async function getKlines(symbol: string, interval: string, limit: number): Promise<Kline[]> {
  const res = await client.getKline({ category: 'linear', symbol, interval: interval as '15', limit });
  if (res.retCode !== 0) throw new Error(`Kline error: ${res.retMsg}`);
  return (res.result.list as string[][]).reverse().map(k => ({
    openTime: Number(k[0]),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
  }));
}

export async function getState(symbol: string): Promise<BotState> {
  const [walletRes, posRes] = await Promise.all([
    client.getWalletBalance({ accountType: 'UNIFIED' }),
    client.getPositionInfo({ category: 'linear', symbol }),
  ]);

  if (walletRes.retCode !== 0) throw new Error(`Wallet error: ${walletRes.retMsg}`);
  if (posRes.retCode !== 0) throw new Error(`Position error: ${posRes.retMsg}`);

  const wallet = walletRes.result.list[0] as WalletBalanceV5 | undefined;
  const balance = Number(wallet?.totalWalletBalance ?? 0);
  const equity = Number(wallet?.totalEquity ?? 0);
  const unrealizedPnl = Number(wallet?.totalPerpUPL ?? 0);

  const positions = posRes.result.list as PositionV5[];
  const pos = positions.find(p => Number(p.size) > 0) ?? null;

  return {
    balance,
    equity,
    unrealizedPnl,
    openPosition: pos
      ? {
          side: pos.side === 'Buy' ? 'Buy' : 'Sell',
          size: Number(pos.size),
          entryPrice: Number(pos.avgPrice),
          unrealizedPnl: Number(pos.unrealisedPnl),
          stopLoss: Number(pos.stopLoss ?? 0),
          takeProfit: Number(pos.takeProfit ?? 0),
        }
      : null,
  };
}

export async function openPosition(
  symbol: string,
  side: 'Buy' | 'Sell',
  qty: string,
  stopLoss: string,
  takeProfit: string,
  leverage: number,
): Promise<string> {
  const leverageStr = String(leverage);
  await client.setLeverage({
    category: 'linear',
    symbol,
    buyLeverage: leverageStr,
    sellLeverage: leverageStr,
  });

  const res = await client.submitOrder({
    category: 'linear',
    symbol,
    side,
    orderType: 'Market',
    qty,
    stopLoss,
    takeProfit,
    timeInForce: 'IOC',
    reduceOnly: false,
    closeOnTrigger: false,
  });

  if (res.retCode !== 0) throw new Error(`Order error (${res.retCode}): ${res.retMsg}`);
  return res.result.orderId;
}

export async function closePosition(symbol: string, side: 'Buy' | 'Sell', qty: string): Promise<void> {
  const closeSide: 'Buy' | 'Sell' = side === 'Buy' ? 'Sell' : 'Buy';
  const res = await client.submitOrder({
    category: 'linear',
    symbol,
    side: closeSide,
    orderType: 'Market',
    qty,
    timeInForce: 'IOC',
    reduceOnly: true,
    closeOnTrigger: false,
  });
  if (res.retCode !== 0) throw new Error(`Close error (${res.retCode}): ${res.retMsg}`);
}
