#!/usr/bin/env node

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

async function probe(name, path, init, expectedStatuses) {
  const res = await fetch(`${baseUrl}${path}`, init);
  const ok = expectedStatuses.includes(res.status);
  const body = await res.text();
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${res.status} ${body.slice(0, 160)}`);
  if (!ok) process.exitCode = 1;
}

await probe("wrong content-type", "/api/waitlist", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: '{"x":1}',
}, [415]);

await probe("malformed JSON", "/api/waitlist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{bad",
}, [400]);

await probe("primitive JSON", "/api/waitlist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "true",
}, [400]);

await probe("oversized JSON", "/api/waitlist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ website: "", name: "a".repeat(40_000) }),
}, [413]);

console.log(`Smoke probes complete against ${baseUrl}. Duplicate, Redis outage, and missing-IP checks require environment-specific setup; see QA.md.`);
