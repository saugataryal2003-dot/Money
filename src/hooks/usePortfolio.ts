import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PortfolioSnapshot } from '../lib/database.types';

export function usePortfolio() {
  const [snapshot, setSnapshot] = useState<PortfolioSnapshot | null>(null);
  const [history, setHistory] = useState<PortfolioSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('portfolio_snapshots')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(168);
      if (data && data.length > 0) {
        setSnapshot(data[0] as PortfolioSnapshot);
        setHistory((data as PortfolioSnapshot[]).reverse());
      }
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_snapshots' }, payload => {
        const row = payload.new as PortfolioSnapshot;
        setSnapshot(row);
        setHistory(h => [...h, row]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { snapshot, history, loading };
}
