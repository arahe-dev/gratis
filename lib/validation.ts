import { z } from "zod";

const typeEnum = [
  "student",
  "indie_builder",
  "early_career_developer",
  "open_source_contributor",
  "hackathon_team",
  "other",
] as const;

const budgetEnum = ["₹1000", "₹5000", "₹25000", "₹75000+", "custom"] as const;

export const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email").max(254),
  city: z.string().max(100).optional().or(z.literal("")),
  type: z.enum(typeEnum, { message: "Please select a type" }),
  currentTool: z.string().max(200).optional().or(z.literal("")),
  whyInterested: z.string().max(1000).optional().or(z.literal("")),
  consent: z.literal("true", { message: "You must agree to be contacted" }),
  // Honeypot field: must be empty. Bots often fill hidden fields.
  website: z.string().max(0).optional(),
});

export const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email").max(254),
  company: z.string().min(1, "Company is required").max(200),
  budgetRange: z.enum(budgetEnum, { message: "Please select a budget range" }),
  targetAudience: z.string().max(500).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: z.literal("true", { message: "You must agree to be contacted" }),
  website: z.string().max(0).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type SponsorInput = z.infer<typeof sponsorSchema>;
