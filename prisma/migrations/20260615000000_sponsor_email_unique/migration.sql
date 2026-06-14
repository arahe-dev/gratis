-- Enforce one sponsor lead per email address.
CREATE UNIQUE INDEX "SponsorLead_email_key" ON "SponsorLead"("email");
