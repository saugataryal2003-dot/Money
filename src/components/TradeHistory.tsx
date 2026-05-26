import type { Trade } from '../lib/database.types';
import { format, parseISO } from 'date-fns';

interface Props {
  trades: Trade[];
}

export default function TradeHistory({ trades }: Props) {
  const closedTrades = trades.filter(t => t.status === 'closed');
  const winRate = closedTrades.length
    ? ((closedTrades.filter(t => (t.pnl ?? 0) > 0).length / closedTrades.length) * 100).toFixed(0)
    : null;
  const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl ?? 0), 0);

  return (
    <div className="space-y-4">
      {closedTrades.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Trades', value: closedTrades.length.toString() },
            { label: 'Win Rate', value: winRate ? `${winRate}%` : '—' },
            { label: 'Total PnL', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className={`text-xl font-bold ${'color' in stat ? stat.color : 'text-white'}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-gray-900 rounded-2xl border border-gray-800">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300">Trade History</h3>
        </div>
        {trades.length === 0 ? (
          <div className="p-8 text-center text-gray-600 text-sm">No trades yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Pair', 'Side', 'Size', 'Entry', 'Exit', 'PnL', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-600 font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {trades.map(trade => (
                  <tr key={trade.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-sm text-white">{trade.pair}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        trade.side === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {trade.side === 'Buy' ? 'LONG' : 'SHORT'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-300">{trade.size}</td>
                    <td className="px-5 py-3 text-sm text-gray-300">${trade.entry_price?.toFixed(2) ?? '—'}</td>
                    <td className="px-5 py-3 text-sm text-gray-300">${trade.exit_price?.toFixed(2) ?? '—'}</td>
                    <td className={`px-5 py-3 text-sm font-medium ${
                      trade.pnl === null ? 'text-gray-600' : trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {trade.pnl === null ? '—' : `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        trade.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                        trade.status === 'closed' ? 'bg-gray-700 text-gray-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">{format(parseISO(trade.opened_at), 'MMM d, HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
