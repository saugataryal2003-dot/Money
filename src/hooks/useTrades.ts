import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Trade } from '../lib/database.types';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('trades')
        .select('*')
        .order('opened_at', { ascending: false })
        .limit(100);
      if (data) setTrades(data as Trade[]);
    }
    load();

    const channel = supabase
      .channel('trades_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { trades };
}
