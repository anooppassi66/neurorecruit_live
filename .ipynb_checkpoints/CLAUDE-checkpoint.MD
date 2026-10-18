# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Commands

**Frontend** (project root):
```bash
npm run dev      # Next.js dev server
npm run build    # production build
npm run lint     # ESLint
npm run start    # serve the production build
```

**Backend** (`server/` directory):
```bash
cd server
npm run dev      # nodemon server.js  (port 5001)
npm start        # node server.js
```

The backend requires a `.env` in `server/` with `MONGODB_URI`, `JWT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, and — for password-reset emails — `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.

There are no automated tests.

## Architecture

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (New York style) · Redux Toolkit + redux-persist · react-toastify

### Pages (`app/`)

| Route | Description |
|---|---|
| `/` | Public landing page (marketing) |
| `/join-now` | Auth page — login + register, no header rendered |
| `/my-profile` | Protected; redirects to `/join-now` if no token |
| `/recruiter-tool` | Recruiter-facing page |
| `/coming-soon`, `/privacy-policy`, `/terms` | Static content pages |

### Authentication flow

Auth state lives in **two places simultaneously** — this is intentional:
1. **Redux store** (`store/authSlice.ts`) — in-memory, hydrated by `redux-persist` from `localStorage` on load.
2. **`localStorage`** keys `token` and `user` — written on login/register, cleared on logout.

Every component that needs the token reads both and falls back:
```ts
const token = tokenFromStore || localStorage.getItem('token')
```

The `Header` component dispatches `setCredentials` on mount if it finds data in `localStorage` but not in the Redux store (handles hard reloads before persist rehydrates).

Protected pages call `router.push('/join-now')` inside a `useEffect` when no token is found — there is no middleware-based guard.

### API layer (`lib/api.ts`)

`apiFetch<T>()` is the single fetch wrapper used for every API call. It:
- Auto-shows `toast.error` on non-OK responses (suppress with `showError: false`).
- Auto-shows `toast.success` on mutating requests when the response body contains `message`/`msg`/`status` (suppress with `showSuccess: false`).
- Throws `ApiError` (with `.status` and `.data`) on failure.
- Deduplicates toasts via `toastId`.

All backend calls go to `https://backend.neurocruit.ai/api/`. The backend source lives in `server/` (Express + MongoDB, port 5001). Routes:
- `POST /api/auth/register` — create user + empty profile, returns JWT
- `POST /api/auth/login` — returns JWT
- `GET  /api/auth/me` — current user (requires `Authorization: Bearer <token>`)
- `PUT  /api/auth/availability` — toggle candidate availability flag
- `POST /api/auth/forgot-password` — email a 6-digit OTP (10 min TTL)
- `POST /api/auth/verify-otp` — verify OTP, returns a 10-minute `resetToken`
- `POST /api/auth/reset-password` — set new password using `resetToken`
- `GET/PUT /api/profile/*` — profile CRUD; resume upload via `POST /api/profile/resume` (multer-s3 → AWS S3)

### Styling conventions

- **Brand primary:** `#2e5090` — used as inline `style` or hardcoded Tailwind arbitrary values `text-[#2e5090]`, `bg-[#2e5090]`. CSS variable `--primary` is also set to this value in `globals.css`.
- **Font:** Inter (loaded via `next/font/google`, applied to `<body>` in `app/layout.tsx`).
- **Animations:** AOS (`aos` package) is initialised globally via `ClientAOSProvider`. Use `data-aos` attributes on elements.
- `images.unoptimized = true` in `next.config.mjs` — external image URLs (e.g. Unstop CDN) can be used directly in `next/image` without domain whitelisting.
- shadcn/ui components live in `components/ui/`. Add new ones with `npx shadcn add <component>`.

### Global providers (`app/layout.tsx`)

Wrapping order: `ReduxProvider` → `ToastRoot` (react-toastify) → page content. `ClientAOSProvider` initialises AOS on mount.
