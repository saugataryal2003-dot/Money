import type { Transaction } from '../types';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function SummaryCards({ transactions }: Props) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const cards = [
    {
      label: 'Total Balance',
      value: fmt(balance),
      icon: Wallet,
      bg: 'bg-indigo-600',
      sub: balance >= 0 ? 'In the green' : 'Over budget',
    },
    {
      label: 'Total Income',
      value: fmt(income),
      icon: TrendingUp,
      bg: 'bg-emerald-600',
      sub: `${transactions.filter(t => t.type === 'income').length} transactions`,
    },
    {
      label: 'Total Expenses',
      value: fmt(expenses),
      icon: TrendingDown,
      bg: 'bg-rose-600',
      sub: `${transactions.filter(t => t.type === 'expense').length} transactions`,
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: PiggyBank,
      bg: 'bg-amber-500',
      sub: savingsRate >= 20 ? 'Great job!' : 'Aim for 20%+',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{card.label}</span>
              <div className={`${card.bg} p-2 rounded-xl`}>
                <Icon size={16} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-xs text-gray-400">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
