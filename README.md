# Steward Attendance System — Frontend

A React-based attendance management platform for church stewards. Tracks steward attendance at meetings, manages excused absences, and provides real-time attendance dashboards for administrators.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **API Layer**: TanStack React Query + Axios
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Fuzzy Search**: Fuse.js
- **Toasts**: react-hot-toast

## Features

- Role-based dashboards (Admin, Leader, Pastor, Steward)
- Real-time attendance marking with optimistic UI updates
- Bulk mark present/absent with multi-select (bottom-sheet actions on mobile)
- Rush mode for high-volume check-in (keyboard navigation)
- QR/barcode check-in codes for meetings (scan or enter a code)
- Meeting lifecycle management (create, finalize, report)
- Excuse request workflow (submit, approve, reject)
- Bulk steward import from CSV (single-user or CSV via the Add New User menu)
- Global search across stewards, departments, meetings, and pages
- Rate-limited login: access token held in memory + rotating refresh token in an httpOnly cookie
- Fully responsive, mobile-first UI (touch-target sizing, safe-area insets, fixed menus)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The production build uses `https://steward-api-nlga.onrender.com` as the default API base URL.

## Live Sites

- **Frontend**: <https://dc-attendance-gray.vercel.app>
- **API**: <https://steward-api-nlga.onrender.com> (OpenAPI docs at `/api-docs`)

## Project Structure

```
src/
├── app/
│   └── layouts/          # App shell, sidebar, header
├── components/
│   ├── global-search/    # Global search overlay
│   ├── pages/            # Page-specific components
│   │   ├── attendance/
│   │   ├── checkin/      # Meeting QR code and check-in flow
│   │   ├── stewards/
│   │   ├── meetings/
│   │   └── login/
│   ├── shared/           # Reusable UI components
│   └── ui/               # Low-level primitives
├── features/
│   ├── attendance/       # Attendance hooks, API, types, schema
│   ├── auth/             # Auth hooks, API, types, schema
│   ├── meetings/         # Meeting hooks, API, types, schema
│   └── stewards/         # Steward hooks, API, types, schema
├── hooks/                # Shared hooks (useAuth, useToast)
├── pages/                # Top-level route pages
└── services/             # Axios instance, interceptors
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview production build locally |

## Architecture

- Every page fetches its own data via TanStack Query hooks — no global state store
- Attendance mutations use optimistic updates with rollback on error
- The attendance page polls every 10 seconds for multi-user sync
- The access token is held in memory only and is refreshed on 401 via a rotating httpOnly-cookie refresh token; the signed-in user profile is cached in localStorage
- Stale in-memory tokens are detected on app load by decoding the JWT `exp` claim, and the session is restored via `GET /auth/me`
