"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { TerminalCard } from "@/components/terminal-card";
import { SignupModal, type ModalMode } from "@/components/signup-modal";
import { CopyEmail } from "@/components/copy-email";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("waitlist");

  function open(mode: ModalMode) {
    setModalMode(mode);
    setModalOpen(true);
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-[1100px] px-6 pb-24 pt-16 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
                Closed access launching soon
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Premium AI coding models, free for Indian builders.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                GratisCode is a sponsored AI coding client for Indian students, indie hackers, and
                early-career developers. Sponsor-funded ads cover the model bill so users can focus
                on shipping.
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Ads stay outside prompts, code, repo context, generated output, and model reasoning.
              </p>

              <CopyEmail button className="mt-6" />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => open("waitlist")}>Register for closed access</Button>
                <Button variant="secondary" onClick={() => open("sponsor")}>
                  Sponsor Indian developers
                </Button>
              </div>
            </div>

            <div className="flex items-center">
              <TerminalCard />
            </div>
          </div>
        </section>

        {/* Sponsor economics */}
        <section className="border-t border-border bg-[#0e0e0e]">
          <div className="mx-auto max-w-[1100px] px-6 py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Sponsor-funded compute.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                  Sponsors cover the model bill. In return, they get tasteful, context-aware brand
                  presence in the UI — never inside prompts, code, repo context, generated output,
                  or model reasoning.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  ₹1000
                </p>
                <p className="mt-2 text-lg font-medium text-foreground">
                  can fund up to 4 developer-months
                </p>
                <p className="text-sm text-muted">for Indian builders.</p>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  A ₹1000 sponsor pool can fund up to 4 developer-months under the initial target
                  allowance of roughly ₹250 of model tokens per developer-month.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  Estimate depends on model prices, token mix, sponsor pool size, cache rates, and
                  availability. Usage is not guaranteed until launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy commitment */}
        <section className="mx-auto max-w-[1100px] px-6 py-20 sm:py-28">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Our commitment to privacy
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "We do not inject ads into prompts.",
              "We do not inject ads into generated code.",
              "We do not show sponsors your private code.",
              "Private code and prompts are not used for training without explicit opt-in consent.",
              "Sponsors do not receive private prompts, repos, files, generated outputs, or code.",
              "Minimal operational data may be stored for abuse prevention, waitlist management, security, and service improvement.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button variant="secondary" href="/privacy">
              Read full privacy policy
            </Button>
          </div>
        </section>

        {/* Early access */}
        <section className="border-t border-border bg-[#0e0e0e]">
          <div className="mx-auto max-w-[1100px] px-6 py-20 sm:py-28">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Early access
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              GratisCode is currently pre-launch. Closed access will be given first to students,
              indie builders, open-source contributors, hackathon teams, and early supporters.
            </p>
            <p className="mt-6 text-sm text-muted">
              Questions? Email <CopyEmail className="inline" />.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => open("waitlist")}>Register for closed access</Button>
              <Button variant="secondary" onClick={() => open("sponsor")}>
                Sponsor Indian developers
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SignupModal
        mode={modalMode}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSwitchMode={setModalMode}
      />
    </>
  );
}
