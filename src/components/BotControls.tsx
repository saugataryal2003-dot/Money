import { useState } from 'react';
import type { BotConfig } from '../lib/database.types';
import { Power, AlertTriangle } from 'lucide-react';

interface Props {
  config: BotConfig;
  onUpdate: (updates: Partial<Omit<BotConfig, 'id'>>) => Promise<void>;
}

export default function BotControls({ config, onUpdate }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    pair: config.pair,
    leverage: config.leverage,
    position_size_pct: config.position_size_pct,
    stop_loss_pct: config.stop_loss_pct,
    take_profit_pct: config.take_profit_pct,
    max_positions: config.max_positions,
    daily_loss_limit: config.daily_loss_limit,
  });

  async function handleToggle() {
    setSaving(true);
    await onUpdate({ active: !config.active });
    setSaving(false);
  }

  async function handleSave() {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
  }

  return (
    <div className="max-w-xl space-y-5">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-300">Bot Status</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {config.active ? `Running · monitoring ${config.pair} for signals` : 'Stopped'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
              config.active
                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            <Power size={14} />
            {saving ? '...' : config.active ? 'Stop Bot' : 'Start Bot'}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
          <AlertTriangle size={13} />
          <span>Bybit Testnet — no real money at risk until you switch to mainnet</span>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-5">Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Trading Pair</label>
            <input
              type="text"
              value={form.pair}
              onChange={e => setForm(f => ({ ...f, pair: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Leverage (x)</label>
              <input type="number" value={form.leverage} min={1} max={100}
                onChange={e => setForm(f => ({ ...f, leverage: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Position Size (% balance)</label>
              <input type="number" value={form.position_size_pct} min={0.1} max={100}
                onChange={e => setForm(f => ({ ...f, position_size_pct: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Stop Loss (%)</label>
              <input type="number" value={form.stop_loss_pct} min={0.1}
                onChange={e => setForm(f => ({ ...f, stop_loss_pct: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Take Profit (%)</label>
              <input type="number" value={form.take_profit_pct} min={0.1}
                onChange={e => setForm(f => ({ ...f, take_profit_pct: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Max Positions</label>
              <input type="number" value={form.max_positions} min={1}
                onChange={e => setForm(f => ({ ...f, max_positions: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Daily Loss Limit (%)</label>
              <input type="number" value={form.daily_loss_limit} min={0.1}
                onChange={e => setForm(f => ({ ...f, daily_loss_limit: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40" />
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 text-gray-900 font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
