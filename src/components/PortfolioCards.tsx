import type { PortfolioSnapshot } from '../lib/database.types';
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';

interface Props {
  snapshot: PortfolioSnapshot | null;
  loading: boolean;
}

function usd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

export default function PortfolioCards({ snapshot, loading }: Props) {
  const roi = snapshot && snapshot.balance > 0
    ? ((snapshot.equity - snapshot.balance) / snapshot.balance) * 100
    : null;

  const cards = [
    { label: 'Balance', value: snapshot ? usd(snapshot.balance) : null, icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Equity', value: snapshot ? usd(snapshot.equity) : null, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    {
      label: 'Unrealized PnL',
      value: snapshot ? usd(snapshot.unrealized_pnl) : null,
      icon: snapshot && snapshot.unrealized_pnl < 0 ? TrendingDown : TrendingUp,
      color: snapshot && snapshot.unrealized_pnl < 0 ? 'text-rose-400' : 'text-emerald-400',
      bg: snapshot && snapshot.unrealized_pnl < 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10',
    },
    {
      label: 'Total ROI',
      value: roi !== null ? `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%` : null,
      icon: Percent,
      color: roi !== null && roi < 0 ? 'text-rose-400' : 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{card.label}</span>
              <div className={`${card.bg} p-2 rounded-xl`}>
                <Icon size={14} className={card.color} />
              </div>
            </div>
            <div className={`text-xl font-bold ${loading || !card.value ? 'text-gray-700 animate-pulse' : 'text-white'}`}>
              {loading ? '$—' : card.value ?? '$—'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
