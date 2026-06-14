"use client";

import { useState } from "react";
import { getAdminData } from "./actions";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminData>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await getAdminData(password);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      setData(null);
      return;
    }
    setData(result);
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-[1100px] px-6 py-16 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Admin</h1>
          <p className="mt-2 text-sm text-muted">Local-only dashboard. Do not expose publicly.</p>

          {!data?.success && (
            <form onSubmit={submit} className="mt-8 max-w-sm space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Checking..." : "View dashboard"}
              </Button>
            </form>
          )}

          {data?.success && (
            <div className="mt-10 space-y-10">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="text-xs uppercase tracking-wide text-muted">Waitlist signups</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{data.waitlistCount}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-6">
                  <p className="text-xs uppercase tracking-wide text-muted">Sponsor leads</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{data.sponsorCount}</p>
                </div>
              </div>

              <section>
                <h2 className="text-lg font-semibold text-foreground">Recent waitlist</h2>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-card text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">City</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.recentWaitlist.map((row) => (
                        <tr key={row.id} className="text-muted">
                          <td className="px-4 py-3">{row.name}</td>
                          <td className="px-4 py-3">{row.email}</td>
                          <td className="px-4 py-3">{row.type}</td>
                          <td className="px-4 py-3">{row.city}</td>
                          <td className="px-4 py-3">{new Date(row.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">Recent sponsors</h2>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-card text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Company</th>
                        <th className="px-4 py-3 font-medium">Budget</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.recentSponsors.map((row) => (
                        <tr key={row.id} className="text-muted">
                          <td className="px-4 py-3">{row.name}</td>
                          <td className="px-4 py-3">{row.email}</td>
                          <td className="px-4 py-3">{row.company}</td>
                          <td className="px-4 py-3">{row.budgetRange}</td>
                          <td className="px-4 py-3">{new Date(row.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
