"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { MARKETING_NAV } from "@/lib/constants/nav";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MarketingHeader({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-secondary transition-colors hover:text-seek-pink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild variant="primary" size="sm">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/oauth/login">Sign in</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/oauth/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-seek-navy hover:bg-surface-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-3" aria-label="Mobile">
              {MARKETING_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface-muted"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
                {user ? (
                  <Button asChild variant="primary">
                    <Link href="/dashboard">Go to dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="secondary">
                      <Link href="/oauth/login">Sign in</Link>
                    </Button>
                    <Button asChild variant="primary">
                      <Link href="/oauth/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
