import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Position } from '../lib/database.types';

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('positions')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setPositions(data as Position[]);
    }
    load();

    const channel = supabase
      .channel('positions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'positions' }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { positions };
}
