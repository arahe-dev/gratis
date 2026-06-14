"use client";

import { useEffect, useRef } from "react";
import { WaitlistForm } from "./waitlist-form";
import { SponsorForm } from "./sponsor-form";

export type ModalMode = "waitlist" | "sponsor";

interface SignupModalProps {
  mode: ModalMode;
  isOpen: boolean;
  onClose: () => void;
  onSwitchMode: (mode: ModalMode) => void;
}

export function SignupModal({ mode, isOpen, onClose, onSwitchMode }: SignupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    previousFocus.current = document.activeElement as HTMLElement;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      modalRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
      previousFocus.current = null;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-[#111] p-6 shadow-2xl outline-none sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex border-b border-border">
          <button
            type="button"
            onClick={() => onSwitchMode("waitlist")}
            aria-pressed={mode === "waitlist"}
            className={`px-4 pb-3 text-sm font-medium transition-colors ${
              mode === "waitlist" ? "border-b border-foreground text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Closed access
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode("sponsor")}
            aria-pressed={mode === "sponsor"}
            className={`px-4 pb-3 text-sm font-medium transition-colors ${
              mode === "sponsor" ? "border-b border-foreground text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Sponsor
          </button>
        </div>
        <h2 id="signup-modal-title" className="mb-1 text-lg font-semibold text-foreground">
          {mode === "waitlist" ? "Register for closed access" : "Sponsor Indian developers"}
        </h2>
        <p className="mb-6 text-sm text-muted">
          {mode === "waitlist" ? "Join the waitlist for early access to GratisCode." : "Tell us about your sponsorship interest."}
        </p>
        {mode === "waitlist" ? <WaitlistForm onClose={onClose} /> : <SponsorForm onClose={onClose} />}
      </div>
    </div>
  );
}
