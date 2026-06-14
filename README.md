# GratisCode

A pre-launch teaser/waitlist website for **GratisCode**: a sponsored AI coding client for Indian builders.

**Positioning:** Premium AI coding models, free for Indian builders.

## Tech stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Prisma + PostgreSQL
- Zod validation
- Upstash Redis rate limiting in production with local dev fallback

## Getting started

```bash
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

Set:

- `DATABASE_URL` — pooled production PostgreSQL connection string suitable for Vercel/serverless (PgBouncer/provider pooler/Prisma Accelerate)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — required for production submissions
- `IP_HASH_SALT` — long random string for hashing IPs; required in production
- `ENABLE_ADMIN` — leave unset/false for production
- `ALLOW_UNSAFE_ADMIN` — ignored in production; admin is dev-only until real auth exists

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

PostgreSQL is configured in `prisma/schema.prisma`. Use `npm run db:migrate` locally and `npm run db:deploy`/`prisma migrate deploy` for production deploys. On Vercel/serverless, `DATABASE_URL` must point at a pooled connection endpoint to avoid exhausting Postgres connections.

## Forms and API

- `POST /api/waitlist` — waitlist signups
- `POST /api/sponsor` — sponsor interest leads

Both endpoints include:

- Zod validation
- Honeypot anti-spam field
- API request guards before JSON parsing: `application/json`, required `Content-Length`, and 32KB max body
- Rate limiting by hashed IP first, then normalized email
- Privacy-safe logging (no raw IP, no raw UA)

## Admin dashboard

`/admin` is a simple password-protected dashboard showing counts and recent entries. It is local/dev only until real authentication exists. In production it always returns 404 regardless of env vars.

## Security headers

Configured in `next.config.ts`:

- Content-Security-Policy
- X-Frame-Options
- Referrer-Policy
- X-Content-Type-Options
- Permissions-Policy
- Strict-Transport-Security

CSP tradeoff: production currently allows `script-src 'unsafe-inline'` because Next.js App Router can emit inline bootstrap/flight scripts. This keeps `npm run build && npm start` hydration and forms working. Replace with nonce/hash-based CSP only after end-to-end browser verification.

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
5. Run `prisma migrate deploy` against the production database before accepting submissions.
6. Use a pooled Postgres connection string for `DATABASE_URL`.

### Railway / Fly.io

1. Provision a Postgres database.
2. Update `DATABASE_URL` and `provider = "postgresql"`.
3. Run `prisma migrate deploy` at build/start time.
4. Set `IP_HASH_SALT` and `ADMIN_PASSWORD`.
5. Keep `/admin` disabled or protected in production.

### General

- [ ] Use a strong `IP_HASH_SALT`.
- [ ] Keep `ENABLE_ADMIN` unset/false; production admin returns 404 regardless.
- [ ] Configure Upstash Redis; production submissions fail closed without it.
- [ ] Keep dependencies updated.
- [ ] Review CSP and security headers before going live.

## License

Private — all rights reserved.
