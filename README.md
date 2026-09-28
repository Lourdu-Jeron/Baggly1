# Baggly

Manufacturing management dashboard for a bag production business: inventory, orders, labour, sales, and a cost/GST calculator.

![Dashboard](screenshot.png)

## Modules
- **Dashboard:** weekly production, category mix, KPIs
- **Inventory:** stock levels with low-stock alerts, CSV export
- **Orders, Labour, Sales, Analytics**
- **Cost Calculator:** per-bag cost, margin and GST

## Tech stack
React 19, TypeScript, Vite, Recharts

## Run locally
npm install
npm run dev

## Known limitations
- Uses sample data (`src/data.jsx`); data resets on refresh
- No backend or database yet

## Roadmap
- Postgres backend for persistent storage
- Analytical SQL queries powering the dashboard KPIs
- Deployment on Vercel