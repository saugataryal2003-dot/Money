import { LayoutDashboard, List, Zap, Settings } from 'lucide-react';

type Tab = 'dashboard' | 'trades' | 'signals' | 'settings';

interface Props {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  botActive: boolean;
}

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trades', label: 'Trades', icon: List },
  { id: 'signals', label: 'Signals', icon: Zap },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navbar({ tab, onTabChange, botActive }: Props) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 w-7 h-7 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-black text-sm">₿</span>
          </div>
          <span className="font-semibold text-white text-sm">TradingBot</span>
        </div>

        <nav className="flex gap-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${botActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-gray-600'}`} />
          <span className={`text-xs font-medium ${botActive ? 'text-emerald-400' : 'text-gray-500'}`}>
            {botActive ? 'LIVE' : 'STOPPED'}
          </span>
        </div>
      </div>
    </header>
  );
}
