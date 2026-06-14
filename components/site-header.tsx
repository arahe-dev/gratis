import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <nav className="flex w-full items-center gap-5 text-sm text-muted sm:w-auto sm:gap-6">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/sponsors" className="transition-colors hover:text-foreground">
            Sponsors
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
