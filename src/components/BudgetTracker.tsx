import { useState, type FormEvent } from 'react';
import type { Transaction, Budget } from '../types';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../types';
import { Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  onUpsert: (b: Budget) => void;
  onDelete: (category: string) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function BudgetTracker({ transactions, budgets, onUpsert, onDelete }: Props) {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const currentMonth = format(new Date(), 'yyyy-MM');

  const spendingByCategory = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!category || !limit) return;
    onUpsert({ category, limit: parseFloat(limit) });
    setCategory('');
    setLimit('');
  }

  const usedCategories = budgets.map(b => b.category);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Monthly Budgets</h3>
        <p className="text-xs text-gray-400 mt-0.5">{format(new Date(), 'MMMM yyyy')}</p>
      </div>

      <div className="p-5 space-y-4">
        {budgets.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No budgets set. Add one below.</p>
        )}
        {budgets.map(budget => {
          const spent = spendingByCategory[budget.category] || 0;
          const pct = Math.min((spent / budget.limit) * 100, 100);
          const over = spent > budget.limit;
          const color = CATEGORY_COLORS[budget.category] || '#6b7280';

          return (
            <div key={budget.category} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-sm text-gray-700">{budget.category}</span>
                  {over && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-medium">Over budget</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{fmt(spent)} / {fmt(budget.limit)}</span>
                  <button
                    onClick={() => onDelete(budget.category)}
                    className="text-gray-300 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: over ? '#f43f5e' : color,
                  }}
                />
              </div>
            </div>
          );
        })}

        <form onSubmit={handleAdd} className="pt-3 border-t border-gray-100 flex gap-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">Category</option>
            {EXPENSE_CATEGORIES.filter(c => !usedCategories.includes(c)).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            placeholder="Limit $"
            className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-xl px-3 py-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
