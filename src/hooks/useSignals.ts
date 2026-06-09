import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Signal } from '../lib/database.types';

export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setSignals(data as Signal[]);
    }
    load();

    const channel = supabase
      .channel('signals_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals' }, payload => {
        setSignals(s => [payload.new as Signal, ...s].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { signals };
}
