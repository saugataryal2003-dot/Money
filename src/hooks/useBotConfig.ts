import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { BotConfig } from '../lib/database.types';

export function useBotConfig() {
  const [config, setConfig] = useState<BotConfig | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('bot_config')
        .select('*')
        .limit(1)
        .single();
      if (data) setConfig(data as BotConfig);
    }
    load();

    const channel = supabase
      .channel('config_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bot_config' }, payload => {
        setConfig(payload.new as BotConfig);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function updateConfig(updates: Partial<Omit<BotConfig, 'id'>>): Promise<void> {
    if (!config) return;
    const { data } = await supabase
      .from('bot_config')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', config.id)
      .select()
      .single();
    if (data) setConfig(data as BotConfig);
  }

  return { config, updateConfig };
}
