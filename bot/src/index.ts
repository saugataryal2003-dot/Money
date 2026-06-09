import 'dotenv/config';
import { createServer } from 'http';
import { getKlines, getState, openPosition, closePosition } from './lib/bybit.js';
import { generateSignal } from './lib/claude.js';
import { saveSnapshot, saveSignal, saveTrade, closeTrade, log } from './lib/db.js';

const SYMBOL = process.env.SYMBOL ?? 'BTCUSDT';
const INTERVAL_MS = Number(process.env.INTERVAL_MS ?? '300000');
const LEVERAGE = 5;
const STOP_LOSS_PCT = 0.02;
const TAKE_PROFIT_PCT = 0.04;
const POSITION_SIZE_PCT = 0.02;
const MIN_CONFIDENCE = 0.65;
const REVERSE_CONFIDENCE = 0.70;

let currentTradeId: string | null = null;
let hadPosition = false;

async function tick(): Promise<void> {
  try {
    const [klines, state] = await Promise.all([
      getKlines(SYMBOL, '15', 60),
      getState(SYMBOL),
    ]);

    const currentPrice = klines[klines.length - 1].close;
    await saveSnapshot(state);

    // Detect position closed by SL/TP between ticks
    if (hadPosition && !state.openPosition && currentTradeId) {
      await closeTrade(currentTradeId, currentPrice, 0);
      await log('info', `Position auto-closed (SL/TP) near $${currentPrice.toFixed(2)}`);
      currentTradeId = null;
    }
    hadPosition = state.openPosition !== null;

    const signal = await generateSignal(klines, currentPrice, state.openPosition !== null);
    const signalId = await saveSignal(signal);

    await log(
      'info',
      `${signal.direction} ${(signal.confidence * 100).toFixed(0)}% | RSI ${signal.indicators.rsi} | $${currentPrice.toFixed(0)}`,
      { reasoning: signal.reasoning },
    );

    if (state.openPosition) {
      const { side, size, unrealizedPnl } = state.openPosition;
      const shouldReverse =
        (side === 'Buy' && signal.direction === 'SHORT' && signal.confidence >= REVERSE_CONFIDENCE) ||
        (side === 'Sell' && signal.direction === 'LONG' && signal.confidence >= REVERSE_CONFIDENCE);

      if (shouldReverse) {
        await closePosition(SYMBOL, side, String(size));
        if (currentTradeId) await closeTrade(currentTradeId, currentPrice, unrealizedPnl);
        await log('info', `Reversed ${side} → ${signal.direction} at $${currentPrice.toFixed(2)}`);
        currentTradeId = null;
        hadPosition = false;
      }
      return;
    }

    if (signal.direction !== 'HOLD' && signal.confidence >= MIN_CONFIDENCE) {
      const side: 'Buy' | 'Sell' = signal.direction === 'LONG' ? 'Buy' : 'Sell';
      const rawQty = (state.balance * POSITION_SIZE_PCT) / currentPrice;
      const qty = String(Math.max(0.001, Math.round(rawQty * 1000) / 1000));

      const slPrice = side === 'Buy'
        ? (currentPrice * (1 - STOP_LOSS_PCT)).toFixed(2)
        : (currentPrice * (1 + STOP_LOSS_PCT)).toFixed(2);
      const tpPrice = side === 'Buy'
        ? (currentPrice * (1 + TAKE_PROFIT_PCT)).toFixed(2)
        : (currentPrice * (1 - TAKE_PROFIT_PCT)).toFixed(2);

      const orderId = await openPosition(SYMBOL, side, qty, slPrice, tpPrice, LEVERAGE);
      currentTradeId = await saveTrade({
        bybitOrderId: orderId,
        side,
        size: Number(qty),
        leverage: LEVERAGE,
        entryPrice: currentPrice,
        stopLoss: Number(slPrice),
        takeProfit: Number(tpPrice),
        signalId,
      });

      await log('info', `Opened ${side} ${qty} BTC @ $${currentPrice.toFixed(2)}`, {
        orderId,
        sl: slPrice,
        tp: tpPrice,
      });
    }
  } catch (err) {
    const msg = err instanceof Error
      ? err.message
      : typeof err === 'object'
        ? JSON.stringify(err)
        : String(err);
    await log('error', `Tick failed: ${msg}`).catch(console.error);
  }
}

// Health endpoint required by Railway to keep the container alive
createServer((_, res) => res.end('OK')).listen(Number(process.env.PORT ?? 3000));

await log('info', `Bot starting — ${SYMBOL} every ${INTERVAL_MS / 1000}s (testnet=${process.env.BYBIT_TESTNET})`);
await tick();
setInterval(tick, INTERVAL_MS);
