import Link from "next/link";
import { CopyEmail } from "./copy-email";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-foreground">GratisCode</p>
            <p className="mt-2 text-sm text-muted">
              Premium AI coding models, free for Indian builders.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Contact</p>
            <p className="mt-2 text-sm text-muted">
              <CopyEmail />
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Legal</p>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted">
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy policy
              </Link>
              <Link href="/sponsors" className="transition-colors hover:text-foreground">
                Sponsor disclosure
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} GratisCode. Pre-launch. Usage not guaranteed.
        </div>
      </div>
    </footer>
  );
}
