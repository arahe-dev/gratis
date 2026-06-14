# Production readiness QA checklist

Run before public teaser traffic:

- [ ] `npm run lint` passes.
- [ ] `npx prisma generate` passes.
- [ ] `npm run build` passes.
- [ ] With the production server running, `npm run qa:api` passes for malformed/oversized request probes.
- [ ] `npm run build && npm start` loads without CSP console errors in a browser.
- [ ] Forms, modal open/close, copy email, and client-side interactions work under `npm start`.
- [ ] `POST /api/waitlist` and `POST /api/sponsor` reject missing/wrong `Content-Type` before parsing.
- [ ] Missing `Content-Length` returns a clean error before parsing.
- [ ] Body larger than 32KB returns 413 and is not fully parsed.
- [ ] Malformed JSON returns 400, not 500.
- [ ] `{}`, `null`, `[]`, and primitive JSON values return clean 400 responses.
- [ ] Duplicate waitlist email returns generic success and does not reveal membership.
- [ ] Duplicate sponsor email returns generic success and does not reveal membership.
- [ ] Missing `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` in production returns 503 for submissions.
- [ ] Missing client IP in production returns 503 and does not bypass rate limiting.
- [ ] IP rate limit is checked before email rate limit; normalized email rate limit is also enforced after validation.
- [ ] Admin is hidden in production regardless of `ENABLE_ADMIN`/`ALLOW_UNSAFE_ADMIN`.
- [ ] Production `DATABASE_URL` uses pooled Postgres suitable for Vercel/serverless.
- [ ] `prisma migrate deploy` has been run against production.
- [ ] No form asks for private prompts, code, repos, files, or generated outputs.

## Manual API probes

Replace the URL as needed:

```bash
# Wrong content-type should fail before JSON parsing
curl -i -X POST http://localhost:3000/api/waitlist -H "Content-Type: text/plain" --data '{"x":1}'

# Malformed JSON should be 400
curl -i -X POST http://localhost:3000/api/waitlist -H "Content-Type: application/json" --data '{bad'

# Primitive body should be 400
curl -i -X POST http://localhost:3000/api/waitlist -H "Content-Type: application/json" --data 'true'

# Oversized body should be 413
python - <<'PY' | curl -i -X POST http://localhost:3000/api/waitlist -H "Content-Type: application/json" --data-binary @-
print('{"website":"","name":"' + ('a' * 40000) + '"}')
PY
```

## CSP note

The production CSP intentionally allows `script-src 'unsafe-inline'` because Next.js App Router can emit inline bootstrap/flight scripts. This is deployment-safe for hydration but not a strict nonce/hash CSP. Tighten this later with full nonce/hash plumbing and browser verification.
