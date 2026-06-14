import { notFound } from "next/navigation";
import { AdminClient } from "./admin-client";

export default function AdminPage() {
  // Dev-only dashboard. Never expose password-only admin in production.
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_ADMIN !== "true") {
    notFound();
  }

  return <AdminClient />;
}
