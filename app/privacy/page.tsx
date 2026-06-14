import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { CopyEmail } from "@/components/copy-email";

export const metadata: Metadata = {
  title: "Privacy policy — GratisCode",
  description: "How GratisCode handles data, privacy, and sponsor disclosures.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <article className="mx-auto max-w-[1100px] px-6 py-16 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-4 text-sm text-muted">Last updated: June 2026. Pre-launch draft.</p>

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This site only collects what you voluntarily submit through the waitlist or sponsor
              forms: name, email, city, builder type, optional tool/interest notes, and sponsor
              details. We also store a hashed IP address for abuse prevention and rate limiting.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We do not collect private code, prompts, repos, files, generated outputs, or model
              reasoning on this website.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Our commitment</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>We do not inject ads into prompts.</li>
              <li>We do not inject ads into generated code.</li>
              <li>We do not show sponsors your private code.</li>
              <li>Private code and prompts are not used for training without explicit opt-in consent.</li>
              <li>Sponsors do not receive private prompts, repos, files, generated outputs, or code.</li>
              <li>Minimal operational data may be stored for abuse prevention, waitlist management, analytics, security, and service improvement.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Cookies and tracking</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We do not use tracking pixels, Google Analytics, or third-party analytics by default.
              We do not set cookies unless strictly necessary for security or functionality. If we
              add cookies later, this page will be updated and they will be documented clearly.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Data retention and deletion</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Waitlist and sponsor data is retained until you ask us to delete it or until the
              project winds down. To request deletion, email{" "}
              <CopyEmail className="inline" />{" "}
              with the subject “Delete my GratisCode data”.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We hash IP addresses with a server-side salt before storing them. We do not log full
              IP addresses permanently, and we do not store raw user agent strings. Security
              headers are configured to reduce common attack surface.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              For privacy questions or deletion requests, email{" "}
              <CopyEmail className="inline" />.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
