import { useState } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import { usePositions } from './hooks/usePositions';
import { useSignals } from './hooks/useSignals';
import { useTrades } from './hooks/useTrades';
import { useBotConfig } from './hooks/useBotConfig';
import Navbar from './components/Navbar';
import PortfolioCards from './components/PortfolioCards';
import EquityChart from './components/EquityChart';
import OpenPositions from './components/OpenPositions';
import SignalFeed from './components/SignalFeed';
import TradeHistory from './components/TradeHistory';
import BotControls from './components/BotControls';
import './index.css';

type Tab = 'dashboard' | 'trades' | 'signals' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const { snapshot, history, loading } = usePortfolio();
  const { positions } = usePositions();
  const { signals } = useSignals();
  const { trades } = useTrades();
  const { config, updateConfig } = useBotConfig();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar tab={tab} onTabChange={setTab} botActive={config?.active ?? false} />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {tab === 'dashboard' && (
          <>
            <PortfolioCards snapshot={snapshot} loading={loading} />
            <EquityChart history={history} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <OpenPositions positions={positions} />
              <SignalFeed signals={signals.slice(0, 5)} compact />
            </div>
          </>
        )}
        {tab === 'trades' && <TradeHistory trades={trades} />}
        {tab === 'signals' && <SignalFeed signals={signals} />}
        {tab === 'settings' && config && (
          <BotControls config={config} onUpdate={updateConfig} />
        )}
        {tab === 'settings' && !config && (
          <div className="text-gray-600 text-sm p-8 text-center">
            Run the SQL migration in Supabase to initialise bot config.
          </div>
        )}
      </main>
    </div>
  );
}
