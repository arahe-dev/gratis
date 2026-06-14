"use client";

export default function ErrorPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-6 py-24">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Something went wrong.</h1>
        <p className="mt-4 text-sm text-muted">
          Please refresh the page or email <a href="mailto:usegratiscode@protonmail.com" className="underline underline-offset-4 hover:text-foreground">usegratiscode@protonmail.com</a>.
        </p>
      </div>
    </main>
  );
}
