import type { Transaction } from '../types';
import { CATEGORY_COLORS } from '../types';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">All Transactions</h3>
      </div>
      {sorted.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">No transactions yet. Add one!</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {sorted.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 group transition-colors">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${CATEGORY_COLORS[tx.category] || '#6b7280'}20` }}
              >
                {tx.type === 'income'
                  ? <TrendingUp size={15} style={{ color: CATEGORY_COLORS[tx.category] || '#6b7280' }} />
                  : <TrendingDown size={15} style={{ color: CATEGORY_COLORS[tx.category] || '#6b7280' }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {tx.description || tx.category}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-white text-[10px] font-medium"
                    style={{ background: CATEGORY_COLORS[tx.category] || '#6b7280' }}
                  >
                    {tx.category}
                  </span>
                  <span>{format(parseISO(tx.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </div>
              </div>
              <button
                onClick={() => onDelete(tx.id)}
                className="text-gray-300 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
