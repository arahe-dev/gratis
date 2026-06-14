"use client";

import { useState } from "react";

const EMAIL = "usegratiscode@protonmail.com";

export function CopyEmail({
  className = "",
  button = false,
}: {
  className?: string;
  button?: boolean;
}) {
  const [toast, setToast] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  if (button) {
    return (
      <span className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Copy email to clipboard
        </button>
        {toast && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background">
            Email copied.
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={copy}
        className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-foreground"
      >
        {EMAIL}
      </button>
      {toast && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background">
          Email copied.
        </span>
      )}
    </span>
  );
}
