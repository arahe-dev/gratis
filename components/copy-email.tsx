"use client";

import { useState } from "react";

const EMAIL = "usegratiscode@protonmail.com";

type CopyStatus = "idle" | "copied" | "failed";

export function CopyEmail({ className = "", button = false }: { className?: string; button?: boolean }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [toast, setToast] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setStatus("copied");
      setToast(true);
      setTimeout(() => { setStatus("idle"); setToast(false); }, 2000);
    } catch {
      setStatus("failed");
    }
  }

  const btnClasses = button
    ? "inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    : "text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground";

  return (
    <span className={`relative inline-block ${className}`}>
      <button type="button" onClick={copy} className={btnClasses}>
        {button ? "Copy email to clipboard" : EMAIL}
      </button>
      {toast && <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background">Email copied.</span>}
      {status === "failed" && !toast && (
        <span className="ml-2 text-xs text-muted">
          Copy failed.{" "}
          <a href={`mailto:${EMAIL}`} className="underline hover:text-foreground">Send email</a>.
        </span>
      )}
    </span>
  );
}
