-- MoneyApp — Trading Bot Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → paste → Run

create extension if not exists "uuid-ossp";

-- Portfolio snapshots (hourly balance/equity readings from Bybit)
create table if not exists portfolio_snapshots (
  id uuid primary key default uuid_generate_v4(),
  balance numeric not null,
  equity numeric not null,
  unrealized_pnl numeric default 0,
  timestamp timestamptz default now()
);

-- Single-row bot configuration
create table if not exists bot_config (
  id uuid primary key default uuid_generate_v4(),
  leverage int default 5,
  position_size_pct numeric default 2,
  max_positions int default 1,
  daily_loss_limit numeric default 10,
  stop_loss_pct numeric default 2,
  take_profit_pct numeric default 4,
  active boolean default false,
  strategy text default 'ai_signals',
  pair text default 'BTCUSDT',
  updated_at timestamptz default now()
);

-- AI/Claude signals
create table if not exists signals (
  id uuid primary key default uuid_generate_v4(),
  pair text not null default 'BTCUSDT',
  direction text not null check (direction in ('LONG', 'SHORT', 'HOLD')),
  confidence numeric not null,
  reasoning text,
  indicators jsonb,
  price_at_signal numeric,
  acted_on boolean default false,
  created_at timestamptz default now()
);

-- Executed trades
create table if not exists trades (
  id uuid primary key default uuid_generate_v4(),
  bybit_order_id text,
  pair text not null default 'BTCUSDT',
  side text not null check (side in ('Buy', 'Sell')),
  size numeric not null,
  leverage int,
  entry_price numeric,
  exit_price numeric,
  stop_loss numeric,
  take_profit numeric,
  pnl numeric,
  pnl_pct numeric,
  status text default 'open' check (status in ('open', 'closed', 'cancelled')),
  signal_id uuid references signals(id),
  opened_at timestamptz default now(),
  closed_at timestamptz
);

-- Open positions (synced live from Bybit)
create table if not exists positions (
  id uuid primary key default uuid_generate_v4(),
  bybit_position_id text,
  pair text not null default 'BTCUSDT',
  side text not null check (side in ('Buy', 'Sell')),
  size numeric not null,
  leverage int,
  entry_price numeric,
  mark_price numeric,
  liquidation_price numeric,
  unrealized_pnl numeric default 0,
  stop_loss numeric,
  take_profit numeric,
  trade_id uuid references trades(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bot logs
create table if not exists bot_logs (
  id uuid primary key default uuid_generate_v4(),
  level text default 'info' check (level in ('info', 'warn', 'error', 'debug')),
  message text not null,
  data jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table portfolio_snapshots enable row level security;
alter table bot_config enable row level security;
alter table signals enable row level security;
alter table trades enable row level security;
alter table positions enable row level security;
alter table bot_logs enable row level security;

-- Permissive policies (personal project — tighten with auth later)
create policy "allow_all" on portfolio_snapshots using (true) with check (true);
create policy "allow_all" on bot_config using (true) with check (true);
create policy "allow_all" on signals using (true) with check (true);
create policy "allow_all" on trades using (true) with check (true);
create policy "allow_all" on positions using (true) with check (true);
create policy "allow_all" on bot_logs using (true) with check (true);

-- Enable Realtime
alter publication supabase_realtime add table portfolio_snapshots;
alter publication supabase_realtime add table positions;
alter publication supabase_realtime add table signals;
alter publication supabase_realtime add table trades;
alter publication supabase_realtime add table bot_config;

-- Seed default bot config
insert into bot_config (leverage, position_size_pct, max_positions, daily_loss_limit, stop_loss_pct, take_profit_pct, active, strategy, pair)
values (5, 2, 1, 10, 2, 4, false, 'ai_signals', 'BTCUSDT');
