import type { Signal } from '../lib/database.types';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  signals: Signal[];
  compact?: boolean;
}

export default function SignalFeed({ signals, compact = false }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800">
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">AI Signals</h3>
      </div>
      {signals.length === 0 ? (
        <div className="p-8 text-center text-gray-600 text-sm">No signals yet — start the bot to generate signals</div>
      ) : (
        <div className="divide-y divide-gray-800">
          {signals.map(signal => {
            const isLong = signal.direction === 'LONG';
            const isShort = signal.direction === 'SHORT';
            const Icon = isLong ? TrendingUp : isShort ? TrendingDown : Minus;
            const color = isLong ? 'text-emerald-400' : isShort ? 'text-rose-400' : 'text-gray-400';
            const bg = isLong ? 'bg-emerald-500/10' : isShort ? 'bg-rose-500/10' : 'bg-gray-700/30';
            return (
              <div key={signal.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`${bg} p-1.5 rounded-lg`}>
                      <Icon size={14} className={color} />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${color}`}>{signal.direction}</div>
                      <div className="text-xs text-gray-600">{signal.pair}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-amber-400 font-medium">{signal.confidence.toFixed(0)}% conf</div>
                    <div className="text-xs text-gray-600">{format(parseISO(signal.created_at), 'HH:mm')}</div>
                  </div>
                </div>
                {!compact && signal.reasoning && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{signal.reasoning}</p>
                )}
                {signal.acted_on && (
                  <span className="mt-2 inline-block text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium">EXECUTED</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
