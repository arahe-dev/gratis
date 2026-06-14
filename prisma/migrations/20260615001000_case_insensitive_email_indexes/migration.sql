-- Enforce case-insensitive email uniqueness for all writes, including manual imports.
-- This migration requires existing data to have no duplicates by lower(email).
CREATE UNIQUE INDEX "WaitlistSignup_email_lower_key" ON "WaitlistSignup" (lower("email"));
CREATE UNIQUE INDEX "SponsorLead_email_lower_key" ON "SponsorLead" (lower("email"));
