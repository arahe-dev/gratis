"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { FieldError } from "./ui/field-error";

interface SponsorFormProps {
  onClose: () => void;
}

export function SponsorForm({ onClose }: SponsorFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      budgetRange: formData.get("budgetRange"),
      targetAudience: formData.get("targetAudience"),
      message: formData.get("message"),
      consent: formData.get("consent"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setMessage(data.message || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage("Thank you. We will be in touch about sponsoring GratisCode developer compute.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again or use the email fallback.");
    }
  }

  if (status === "success") {
    return (
      <div className="py-8 text-center">
        <p className="text-lg font-medium text-foreground">Interest recorded.</p>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button href="mailto:usegratiscode@protonmail.com?subject=Sponsor%20GratisCode%20developer%20compute">
            Open email fallback
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="s-name">Name</Label>
        <Input id="s-name" name="name" required maxLength={100} placeholder="Your name" />
        <FieldError message={errors.name} />
      </div>

      <div>
        <Label htmlFor="s-email">Email</Label>
        <Input id="s-email" name="email" type="email" required maxLength={254} placeholder="you@company.com" />
        <FieldError message={errors.email} />
      </div>

      <div>
        <Label htmlFor="s-company">Company or organization</Label>
        <Input id="s-company" name="company" required maxLength={200} placeholder="Acme Inc." />
        <FieldError message={errors.company} />
      </div>

      <div>
        <Label htmlFor="s-budget">Sponsor budget range</Label>
        <Select id="s-budget" name="budgetRange" required>
          <option value="">Select one</option>
          <option value="₹1000">₹1000</option>
          <option value="₹5000">₹5000</option>
          <option value="₹25000">₹25000</option>
          <option value="₹75000+">₹75000+</option>
          <option value="custom">Custom</option>
        </Select>
        <FieldError message={errors.budgetRange} />
      </div>

      <div>
        <Label htmlFor="s-audience">Target audience (optional)</Label>
        <Input id="s-audience" name="targetAudience" maxLength={500} placeholder="e.g. CS students, indie hackers" />
        <FieldError message={errors.targetAudience} />
      </div>

      <div>
        <Label htmlFor="s-message">Message (optional)</Label>
        <Textarea id="s-message" name="message" rows={3} maxLength={2000} placeholder="Anything else we should know..." />
        <FieldError message={errors.message} />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          id="s-consent"
          name="consent"
          type="checkbox"
          value="true"
          required
          className="mt-1 h-4 w-4 rounded border-border bg-card text-foreground"
        />
        <label htmlFor="s-consent" className="text-xs leading-5 text-muted">
          I agree to be contacted about sponsoring GratisCode developer compute.
        </label>
      </div>
      <FieldError message={errors.consent} />

      {status === "error" && (
        <p className="rounded bg-red-950/30 px-3 py-2 text-xs text-red-300">{message}</p>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Sponsor Indian developers"}
      </Button>

      <p className="text-center text-xs text-muted">
        Or{" "}
        <a
          href="mailto:usegratiscode@protonmail.com?subject=Sponsor%20GratisCode%20developer%20compute"
          className="underline underline-offset-4 hover:text-foreground"
        >
          email us
        </a>
        .
      </p>
    </form>
  );
}

