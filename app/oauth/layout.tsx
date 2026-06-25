import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function OAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-16 items-center">
          <Logo />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="py-6 text-center text-xs text-ink-muted">
        <p>
          Unofficial demo &middot; Not affiliated with SEEK Limited &middot;{" "}
          <Link href="/" className="hover:underline">
            Back to home
          </Link>
        </p>
      </footer>
    </div>
  );
}
