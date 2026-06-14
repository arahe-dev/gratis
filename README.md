# GratisCode

A pre-launch teaser/waitlist website for **GratisCode**: a sponsored AI coding client for Indian builders.

**Positioning:** Premium AI coding models, free for Indian builders.

## Tech stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Prisma + SQLite (dev/local)
- Zod validation
- Simple in-memory rate limiting (swap for Redis in production)

## Getting started

```bash
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

Set:

- `DATABASE_URL` — defaults to `file:./dev.db` for SQLite
- `IP_HASH_SALT` — long random string for hashing IPs
- `ADMIN_PASSWORD` — password for the local admin dashboard

Run the database migration:

```bash
npm run db:migrate
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

SQLite is used for local development. To switch to PostgreSQL:

1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`.
2. Update `DATABASE_URL` in `.env.local` to a Postgres connection string.
3. Run `npm run db:migrate`.

## Forms and API

- `POST /api/waitlist` — waitlist signups
- `POST /api/sponsor` — sponsor interest leads

Both endpoints include:

- Zod validation
- Honeypot anti-spam field
- Rate limiting by hashed IP and email
- Privacy-safe logging (no raw IP, no raw UA)

## Admin dashboard

`/admin` is a simple password-protected dashboard showing counts and recent entries. It is intended for local use only. Protect or disable it before public deployment.

## Security headers

Configured in `next.config.ts`:

- Content-Security-Policy
- X-Frame-Options
- Referrer-Policy
- X-Content-Type-Options
- Permissions-Policy
- Strict-Transport-Security

## Privacy

See `PRIVACY.md` and the `/privacy` page.

## The ₹1000 → up to 4 developer-months claim

A ₹1000 sponsor pool can fund up to 4 developer-months under the initial target allowance of roughly ₹250 of model tokens per developer-month.

Assumptions:

- Target allowance: ~₹250 of model tokens per developer per month.
- Model prices remain in the low-cost tier with prompt caching.
- Token mix is typical for light-to-moderate coding assistance.
- Sponsor pool size and availability do not change materially.

This is an estimate, not a guarantee. Actual coverage depends on model prices, token mix, sponsor pool size, cache rates, and availability. Usage is not guaranteed until launch.

## Deployment checklist

### Vercel

1. Push to GitHub / GitLab.
2. Import repo in Vercel.
3. Set environment variables from `.env.example`.
4. Add build command: `prisma generate && next build` (or use `postinstall`).
5. For Postgres, set `DATABASE_URL` and update `prisma/schema.prisma`.

### Railway / Fly.io

1. Provision a Postgres database.
2. Update `DATABASE_URL` and `provider = "postgresql"`.
3. Run `prisma migrate deploy` at build/start time.
4. Set `IP_HASH_SALT` and `ADMIN_PASSWORD`.
5. Keep `/admin` disabled or protected in production.

### General

- [ ] Use a strong `IP_HASH_SALT`.
- [ ] Rotate `ADMIN_PASSWORD` regularly; do not expose `/admin` publicly.
- [ ] Swap in-memory rate limiting for Redis in high-traffic scenarios.
- [ ] Keep dependencies updated.
- [ ] Review CSP and security headers before going live.

## License

Private — all rights reserved.
