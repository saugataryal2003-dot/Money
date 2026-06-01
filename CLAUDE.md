# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # preview production build locally
```

No test suite yet — build is the primary correctness check.

## Environment

Requires a `.env` file in the project root (never commit it):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

This is a **Vite + React SPA** — no SSR, no server components. Use `@supabase/supabase-js` directly (not `@supabase/ssr`, which is Next.js-only).

### Data flow

```
Supabase (PostgreSQL + Realtime)
    ↕ REST queries + postgres_changes subscriptions
src/hooks/          ← one hook per table, all use supabase.channel() for live updates
    ↕
src/components/     ← pure presentational components, receive data as props
    ↕
src/App.tsx         ← calls all hooks, owns tab state, passes data down
```

### Key files

- `src/lib/supabase.ts` — single shared Supabase client (reads from `VITE_` env vars)
- `src/lib/database.types.ts` — TypeScript interfaces for all 6 DB tables; update here when schema changes
- `src/hooks/use*.ts` — each hook fetches initial data + subscribes to Realtime; cleanup removes the channel on unmount
- `supabase/migrations/001_schema.sql` — full DB schema; run manually in Supabase SQL Editor (no migration runner)

### Database tables

| Table | Purpose |
|---|---|
| `bot_config` | Single-row config (leverage, SL/TP, active flag) — dashboard reads/writes this |
| `portfolio_snapshots` | Hourly balance+equity readings written by the bot |
| `signals` | AI signal output (LONG/SHORT/HOLD + confidence + reasoning) |
| `trades` | Executed orders with entry/exit/PnL |
| `positions` | Currently open positions synced from Bybit |
| `bot_logs` | Bot runtime logs |

RLS is enabled on all tables with permissive `allow_all` policies (personal project). The bot service (Phase 3, not yet built) will write to these tables using the service role key.

### Planned bot service

The `bot/` directory does not exist yet. Phase 2–4 will add a Node.js service that:
- Connects to **Bybit Testnet** (BTC/USDT perpetuals)
- Generates trade signals via **Claude API**
- Executes orders and writes results to Supabase

### Dead code

`src/types.ts`, `src/useStore.ts`, and several components (`AddTransactionModal`, `BudgetTracker`, `Charts`, `SummaryCards`, `TransactionList`) are leftovers from the initial personal-finance prototype and are not imported by `App.tsx`. They can be deleted.

## Deployment

Deployed to Vercel. `vercel.json` rewrites all routes to `/index.html` for SPA routing. Environment variables must be set in the Vercel project settings (same names as `.env`).
