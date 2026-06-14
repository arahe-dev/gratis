import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 text-foreground ${className}`}>
      <span className="font-bold tracking-tight">
        <span className="text-muted">&gt;</span>Gr
      </span>
      <span className="font-semibold">GratisCode</span>
    </Link>
  );
}
