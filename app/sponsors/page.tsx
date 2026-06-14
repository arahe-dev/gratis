import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { CopyEmail } from "@/components/copy-email";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sponsor disclosure — GratisCode",
  description: "How GratisCode sponsorship works and how compute is funded.",
};

export default function SponsorsPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <article className="mx-auto max-w-[1100px] px-6 py-16 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sponsor disclosure
          </h1>
          <p className="mt-4 text-sm text-muted">
            How sponsor money becomes free model access for Indian builders.
          </p>

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">The model</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              GratisCode is a sponsored AI coding client. Sponsors contribute to a pool that pays
              for model tokens. Users get free access to premium AI coding models; sponsors get
              tasteful brand presence in the client UI.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">What sponsors do not get</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>No access to private prompts.</li>
              <li>No access to repos, files, or generated outputs.</li>
              <li>No access to code or model reasoning.</li>
              <li>No injection of ads into prompts, code, repo context, or generated output.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">₹1000 → up to 4 developer-months</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A ₹1000 sponsor pool can fund up to 4 developer-months under the initial target
              allowance of roughly ₹250 of model tokens per developer-month.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This is an estimate, not a guarantee. Actual coverage depends on model prices, token
              mix, sponsor pool size, cache rates, and availability. Usage is not guaranteed until
              launch.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Become a sponsor</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Interested in sponsoring Indian developers? Get in touch at{" "}
              <CopyEmail className="inline" />.
            </p>
            <div className="mt-6">
              <Button href="mailto:usegratiscode@protonmail.com?subject=Sponsor%20GratisCode%20developer%20compute">
                Sponsor via email
              </Button>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
