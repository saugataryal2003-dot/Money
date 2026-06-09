# MoneyApp — Bybit Crypto Trading Bot

Automated BTC/USDT perpetuals trading bot with real-time dashboard, AI-powered signals via Claude, and Bybit Testnet integration.

## Stack
- **Dashboard** — React + TypeScript + Vite + Tailwind CSS v4 + Recharts
- **Database** — Supabase (PostgreSQL + Realtime)
- **Bot** — Node.js + TypeScript (Phase 3)
- **Exchange** — Bybit Testnet → Mainnet (BTC/USDT Perpetuals)
- **AI Signals** — Claude API

## Setup

### 1. Run the database migration
1. Go to your [Supabase project](https://supabase.com/dashboard) → **SQL Editor**
2. Paste and run the contents of `supabase/migrations/001_schema.sql`

### 2. Set environment variables
```bash
cp .env.example .env
```
Fill in `.env` with your Supabase URL and anon key (Settings → API).

### 3. Run the dashboard
```bash
npm install
npm run dev
```

## Roadmap
- [x] Phase 1 — Supabase schema + real-time dashboard
- [ ] Phase 2 — Bybit Testnet connection + position sync
- [ ] Phase 3 — Bot service with order execution
- [ ] Phase 4 — Claude AI signal engine
- [ ] Phase 5 — Risk management (SL/TP, daily loss limit)
- [ ] Phase 6 — Analytics (win rate, Sharpe, drawdown)
