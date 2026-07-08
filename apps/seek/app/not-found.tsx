import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4 text-center">
      <Logo />
      <h1 className="mt-8 text-5xl font-bold text-seek-navy">404</h1>
      <p className="mt-2 text-lg text-ink-secondary">
        We couldn&apos;t find the page you were looking for.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/jobs">Search jobs</Link>
        </Button>
      </div>
    </div>
  );
}
