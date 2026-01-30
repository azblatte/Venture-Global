# VG Control Tower — Runbook

## Overview
VG Control Tower is a Next.js + Postgres dashboard for monitoring Venture Global LNG.
It ships with seed data and adapter stubs so you can run locally without paid APIs.

## Prerequisites
- Node.js 18+
- Docker (for Postgres)

## Local Setup
1) Install dependencies
```bash
npm install
```

2) Copy environment variables
```bash
cp .env.example .env
```

3) Start Postgres
```bash
docker compose up -d
```

4) Push schema + seed data
```bash
npx prisma db push
npm run db:seed
```

5) Run the app
```bash
npm run dev
```

## Seed Data
Edit JSON files in `seed-data/` to update vessel lists, terminals, positions, pricing, insights, or news.
- `vessels.json` — canonical fleet registry
- `vessel-positions.json` — latest AIS points (seed)
- `terminals.json` — terminal metadata + geofence polygons
- `pricing-history.json` — daily HH / TTF / JKM history
- `insights.json` — daily insight bullets
- `news-articles.json` — news/events timeline

## Data Sources (Adapters)
Phase v1 stubs will plug into these providers:
- EIA — Henry Hub daily prices
- FRED — TTF / JKM proxies
- Alpha Vantage — VG stock price
- NewsData + RSS — LNG news

## Environment Variables
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vg_control_tower
EIA_API_KEY=
FRED_API_KEY=
ALPHA_VANTAGE_KEY=
NEWSDATA_API_KEY=
CRON_SECRET=changeme
```

## Notes
- The UI renders from seed JSON if no database is configured.
- If `DATABASE_URL` is set, pricing updates are stored in Postgres and survive Vercel cold starts.
- The daily price job uses **EIA Henry Hub** (free, 1‑day delayed). TTF/JKM are estimated unless you add a paid provider.
- If the EIA API key is missing, the refresh button will fall back to cached data and show a message.
- No data is fabricated beyond the seed files and the clearly labeled TTF/JKM estimates.
- The **LNG Dashboard** (`/lng-dashboard`) uses Plotly and models weekly cargo flows for visualization. Replace modeled cargoes with a real EIA LNG exports series if you add a provider.
