# BrighterFuture

A modern learning management system for future IT professionals. Students browse
the catalog, enroll in courses, work through module-based lessons, take auto-graded
assessments, and earn verifiable certificates. Instructors and admins manage
courses, curricula, students, and analytics from the same app.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, Server Actions) and React 19
- TypeScript, Tailwind CSS
- SQLite via `better-sqlite3` (schema and demo data are created automatically)
- `jose` JWT sessions in an httpOnly cookie, `bcryptjs` password hashing
- `zod`, `react-markdown` + `remark-gfm` for lesson rendering, `lucide-react` icons

## Getting started

```bash
npm install
cp .env.example .env   # optional; the app falls back to dev defaults
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first run the database is
created at `data/brighterfuture.db` and seeded automatically.

## Demo accounts

| Role       | Email                        | Password     |
| ---------- | ---------------------------- | ------------ |
| Admin      | `admin@brighterfuture.dev`   | `Admin123!`  |
| Instructor | `instructor@brighterfuture.dev` | `Teach123!` |
| Student    | `student@brighterfuture.dev` | `Student123!` |

Additional students and instructors use `Student123!` / `Teach123!`
(see `lib/seed-data.ts`).

## Scripts

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Start the development server                                        |
| `npm run build`   | Production build                                                    |
| `npm run start`   | Serve the production build                                          |
| `npm run lint`    | Lint with Next.js                                                   |
| `npm run typecheck` | Type-check with `tsc --noEmit`                                    |
| `npm run db:seed` | Seed an empty database with the demo dataset and print a summary    |
| `npm run db:reset`| Delete the SQLite database and rebuild it from scratch with seed data |

## Environment

| Variable        | Default                     | Purpose                              |
| --------------- | --------------------------- | ------------------------------------ |
| `AUTH_SECRET`   | dev-only fallback           | JWT signing secret — set in production |
| `DATABASE_PATH` | `data/brighterfuture.db`    | Absolute path to the SQLite database |

## Project layout

```
app/                  Routes: marketing site, auth, dashboard, verify
  (auth)/             Login and registration
  dashboard/          Student and staff workspaces
  courses/            Public catalog and course detail
  verify/             Public certificate verification
components/           Shared UI, dashboard shell, charts, forms
lib/
  actions/            Server actions (auth, courses, assessments, learning, profile)
  access.ts           Authorization and certificate issuance
  auth.ts             Session handling and role guards
  db.ts, schema.ts    SQLite connection and schema
  queries.ts          Read queries
  seed.ts, seed-data.ts  Demo dataset
scripts/              Database reset and seed commands
data/                 SQLite files (git-ignored)
```
