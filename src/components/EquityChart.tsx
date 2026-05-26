import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PortfolioSnapshot } from '../lib/database.types';
import { format, parseISO } from 'date-fns';

interface Props {
  history: PortfolioSnapshot[];
}

export default function EquityChart({ history }: Props) {
  const data = history.map(s => ({
    time: format(parseISO(s.timestamp), 'MMM d HH:mm'),
    equity: s.equity,
  }));

  const min = data.length ? Math.min(...data.map(d => d.equity)) * 0.995 : 0;
  const max = data.length ? Math.max(...data.map(d => d.equity)) * 1.005 : 1000;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Equity Curve</h3>
        <span className="text-xs text-gray-600">Updates every hour</span>
      </div>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
          No data yet — start the bot to begin tracking
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#4b5563' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[min, max]}
              tick={{ fontSize: 10, fill: '#4b5563' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${Number(v).toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#6b7280' }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Equity']}
            />
            <Area type="monotone" dataKey="equity" stroke="#f59e0b" strokeWidth={2} fill="url(#equityGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
