# HiveMind Client (Vite + React)

A cyber-themed React frontend for the HiveMind ecosystem with dashboard analytics, job submission, marketplace exchange, credits tracking, and cart/checkout flows.

## Tech Stack

- React 19 + Vite 6
- React Router DOM
- Tailwind CSS 4
- Lucide React icons
- ESLint

## Getting Started

```bash
npm install
npm run dev
```

### Available Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## App Routes

- `/` — Landing Page
- `/dashboard` — System overview, task queue, credit activity, node/activity panels
- `/submit` — Submit Compute Job form
- `/jobs` — Jobs list
- `/jobs/:id` — Job details
- `/contributors` — Contributors/network page
- `/credits` — Credits overview and history
- `/marketplace` — Exchange + asset catalog
- `/cart` — Cart queue and balance impact
- `/checkout` — Checkout flow
- `/settings` — User/node settings

## State Management

### Wealth Context (`src/context/WealthContext.jsx`)

- Global balances: `hiveCoins`, `mindCredits`
- Exchange action: `exchangeHCToMC(amount)`
- Uses exchange rate from mock data (`mockWealth.exchangeRate`)
- **Resets on every page reload** to values from `src/data/mock.js` (no persistence)

### Cart Context (`src/context/CartContext.jsx`)

- Cart operations: add/remove/update/clear
- Cart total from item `cost`
- **Persists** in `localStorage` under `hivemind_cart`

## Recent Updates Incorporated

- Dashboard right-side quick nav aligned flush to the viewport edge.
- Marketplace:
	- Functional HC → MC conversion with validation.
	- Confirmation/error messaging after exchange.
	- Neural Weights placeholder state.
	- "New Partner Rewards Coming Soon" placeholder styling and one-line text fit.
- Wealth synchronization:
	- Conversion updates reflected across app views using `WealthContext`.
	- Wealth resets to mock values after refresh (current behavior).
- Floating header logo:
	- Landing icon now uses existing continuous spin animation on hover.
- Dashboard text behavior:
	- `ScrambleText` removed from Current Task Queue row content.
	- `ScrambleText` applied to Dashboard, Current Task Queue, and Credit Activity headers.
	- Task queue table tightened to avoid horizontal scrolling.
- Submit Job:
	- Min RAM slider now updates displayed value live.
	- Min RAM range set to **8–128 GB**.

## Project Structure (Key Folders)

- `src/components/layout` — shell, headers, nav
- `src/components/marketplace` — marketplace-specific UI
- `src/components/common` — shared UI utilities (e.g., `ScrambleText`)
- `src/context` — global app contexts (`CartContext`, `WealthContext`)
- `src/pages` — route-level pages
- `src/data` — mock/static data

## Notes

- Exchange updates are currently in-memory for the session and reset on reload by design.
- If you later want persistent wealth state, reintroduce storage in `WealthContext`.
