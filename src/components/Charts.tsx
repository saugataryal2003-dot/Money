import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import type { Transaction } from '../types';
import { CATEGORY_COLORS } from '../types';
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface Props {
  transactions: Transaction[];
}

function fmt(n: number | string | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n ?? 0));
}

export default function Charts({ transactions }: Props) {
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const now = new Date();
  const months = eachMonthOfInterval({ start: subMonths(startOfMonth(now), 5), end: startOfMonth(now) });
  const barData = months.map(month => {
    const label = format(month, 'MMM');
    const key = format(month, 'yyyy-MM');
    const income = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);
    return { label, income, expenses };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Expenses by Category</h3>
        {pieData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No expense data yet</div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(v as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {pieData.slice(0, 6).map(entry => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: CATEGORY_COLORS[entry.name] || '#6b7280' }} />
                    <span className="text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-gray-800 font-medium">{fmt(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Income vs Expenses (6 months)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${Number(v) / 1000}k`} />
            <Tooltip formatter={(v) => fmt(v as number)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
