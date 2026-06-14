"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { FieldError } from "./ui/field-error";
import Link from "next/link";

interface WaitlistFormProps {
  onClose: () => void;
}

export function WaitlistForm({ onClose }: WaitlistFormProps) {
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
      city: formData.get("city"),
      type: formData.get("type"),
      currentTool: formData.get("currentTool"),
      whyInterested: formData.get("whyInterested"),
      consent: formData.get("consent"),
      website: formData.get("website"),
    };

    try {
      const res = await fetch("/api/waitlist", {
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
      setMessage("You are on the list. We will be in touch when closed access opens.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again or use the email fallback.");
    }
  }

  if (status === "success") {
    return (
      <div className="py-8 text-center">
        <p className="text-lg font-medium text-foreground">Registered.</p>
        <p className="mt-2 text-sm text-muted" role="status">{message}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button href="mailto:usegratiscode@protonmail.com?subject=GratisCode%20closed%20access%20request">
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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        <Label htmlFor="w-name">Name</Label>
        <Input id="w-name" name="name" required maxLength={100} placeholder="Your name" />
        <FieldError message={errors.name} />
      </div>

      <div>
        <Label htmlFor="w-email">Email</Label>
        <Input id="w-email" name="email" type="email" required maxLength={254} placeholder="you@example.com" />
        <FieldError message={errors.email} />
      </div>

      <div>
        <Label htmlFor="w-city">City</Label>
        <Input id="w-city" name="city" maxLength={100} placeholder="e.g. Bangalore" />
        <FieldError message={errors.city} />
      </div>

      <div>
        <Label htmlFor="w-type">I am a</Label>
        <Select id="w-type" name="type" required>
          <option value="">Select one</option>
          <option value="student">Student</option>
          <option value="indie_builder">Indie builder</option>
          <option value="early_career_developer">Early-career developer</option>
          <option value="open_source_contributor">Open-source contributor</option>
          <option value="hackathon_team">Hackathon team</option>
          <option value="other">Other</option>
        </Select>
        <FieldError message={errors.type} />
      </div>

      <div>
        <Label htmlFor="w-tool">Current AI coding tool (optional)</Label>
        <Input id="w-tool" name="currentTool" maxLength={200} placeholder="e.g. Cursor, Copilot" />
        <FieldError message={errors.currentTool} />
      </div>

      <div>
        <Label htmlFor="w-why">Why are you interested? (optional)</Label>
        <Textarea id="w-why" name="whyInterested" rows={3} maxLength={1000} placeholder="Tell us briefly..." />
        <FieldError message={errors.whyInterested} />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          id="w-consent"
          name="consent"
          type="checkbox"
          value="true"
          required
          className="mt-1 h-4 w-4 rounded border-border bg-card text-foreground"
        />
        <label htmlFor="w-consent" className="text-xs leading-5 text-muted">
          I understand GratisCode is pre-launch, usage is not guaranteed, and I agree to be contacted about closed access under the{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            privacy policy
          </Link>
          .
        </label>
      </div>
      <FieldError message={errors.consent} />

      {status === "error" && (
        <p role="status" className="rounded bg-red-950/30 px-3 py-2 text-xs text-red-300">{message}</p>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Registering..." : "Register for closed access"}
      </Button>

      <p className="text-center text-xs text-muted">
        Or{" "}
        <a
          href="mailto:usegratiscode@protonmail.com?subject=GratisCode%20closed%20access%20request"
          className="underline underline-offset-4 hover:text-foreground"
        >
          email us
        </a>
        .
      </p>
    </form>
  );
}
