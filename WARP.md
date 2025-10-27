# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

- Install deps: `npm install` (Node 16+)
- Dev server: `npm run dev` (Vite on http://localhost:5173)
- Build: `npm run build` (outputs to `dist/`)
- Preview build: `npm run preview`
- Linting: not configured
- Tests: not configured (see `TESTING_GUIDE.md` for manual scenarios)

## Architecture Overview

- Framework/tooling: React 18 + React Router v6 + Vite + Tailwind CSS. Vite config in `vite.config.js` uses `@vitejs/plugin-react`; Tailwind palette extended in `tailwind.config.js`.
- State: React Context API with two providers:
  - `src/context/AuthContext.jsx`: auth/session via `localStorage`; exposes `user`, `login`, `signup`, `logout`, `hasRole`, `isAuthenticated`, `loading`.
  - `src/context/EventContext.jsx`: in-memory events/attendees CRUD and selectors (e.g., `registerForEvent`, `getEventById`, `getAllAttendees`). All mutations flow through this context.
- Data model: mock sources in `src/data/*` (`mockUsers.js`, `mockEvents.js`, `mockAttendees.js`). Swap these with API calls when integrating a backend; preserve context method signatures.
- Access control: `src/components/ProtectedRoute.jsx` gates routes by auth and role; redirects to `/login` or `/`.
- Routing: defined in `src/App.jsx`.
  - Public: `/`, `/events`, `/events/:id`, `/login`, `/signup`
  - Protected: `/create` (organizer), `/dashboard` (admin), `/attendees` (admin, organizer)
- App composition (order matters): AuthProvider > EventProvider > BrowserRouter > routes/components.

## Operational Notes

- Test accounts: attendee@example.com, organizer@example.com, admin@example.com (password: `password123`).
- Manual testing flows and expected behaviors are documented in `TESTING_GUIDE.md`.
- Project setup and structure overview are in `README.md`.
