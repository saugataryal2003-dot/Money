import type { Position } from '../lib/database.types';

interface Props {
  positions: Position[];
}

export default function OpenPositions({ positions }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Open Positions</h3>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{positions.length}</span>
      </div>
      {positions.length === 0 ? (
        <div className="p-8 text-center text-gray-600 text-sm">No open positions</div>
      ) : (
        <div className="divide-y divide-gray-800">
          {positions.map(pos => (
            <div key={pos.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white">{pos.pair}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    pos.side === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {pos.side === 'Buy' ? 'LONG' : 'SHORT'} {pos.leverage}x
                  </span>
                </div>
                <span className={`text-sm font-bold ${
                  pos.unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {pos.unrealized_pnl >= 0 ? '+' : ''}${pos.unrealized_pnl.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-600 mb-0.5">Entry</div>
                  <div className="text-gray-300">${pos.entry_price?.toFixed(2) ?? '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-0.5">Mark</div>
                  <div className="text-gray-300">${pos.mark_price?.toFixed(2) ?? '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-0.5">Liq.</div>
                  <div className="text-rose-400">${pos.liquidation_price?.toFixed(2) ?? '—'}</div>
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-gray-600">SL: <span className="text-rose-400">${pos.stop_loss?.toFixed(2) ?? '—'}</span></span>
                <span className="text-gray-600">TP: <span className="text-emerald-400">${pos.take_profit?.toFixed(2) ?? '—'}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
