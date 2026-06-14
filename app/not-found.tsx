import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[60vh] w-full max-w-[1100px] flex-1 items-center px-6 py-20">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            This page is not available.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            The page may have moved, or the link may be incorrect. GratisCode is still pre-launch, so some routes are intentionally limited.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Go home
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-[#1a1a1a]"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
