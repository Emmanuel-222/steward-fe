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

## Features

- Role-based dashboards (Admin, Leader, Pastor, Steward)
- Real-time attendance marking with optimistic UI updates
- Bulk mark present/absent with multi-select
- Rush mode for high-volume check-in (keyboard navigation)
- Meeting lifecycle management (create, finalize, report)
- Excuse request workflow (submit, approve, reject)
- Global search across stewards, departments, meetings, and pages
- Rate-limited login with JWT + refresh token auth
- Responsive design (mobile-first)

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

## Project Structure

```
src/
├── app/
│   └── layouts/          # App shell, sidebar, header
├── components/
│   ├── global-search/    # Global search overlay
│   ├── pages/            # Page-specific components
│   │   ├── attendance/
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
- Auth tokens are stored in localStorage with automatic refresh on 401
- Stale tokens are detected on app load by decoding the JWT `exp` claim
