"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { SessionUser } from "@/lib/types";
import { APP_NAV } from "@/lib/constants/nav";
import { cn } from "@/lib/utils/cn";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { useAppData } from "@/components/providers/AppDataProvider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function isActive(pathname: string, href: string): boolean {
  if (href === "/jobs") return pathname === "/jobs" || pathname.startsWith("/jobs/");
  return pathname === href;
}

export function AppTopNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const { savedCount, appliedCount } = useAppData();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const badgeFor = (key?: "saved" | "applied") =>
    key === "saved" ? savedCount : key === "applied" ? appliedCount : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex" aria-label="Primary">
          {APP_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const badge = badgeFor(item.badgeKey);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-ring relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-seek-pink-light text-seek-pink-dark"
                    : "text-ink-secondary hover:bg-surface-muted hover:text-seek-navy",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {badge ? (
                  <Badge tone={active ? "brand" : "neutral"} className="ml-1 px-1.5 py-0">
                    {badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <UserMenu user={user} />
          </div>

          {/* Mobile navigation */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-seek-navy hover:bg-surface-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex-1 overflow-y-auto px-3">
                <div className="mb-4 rounded-lg bg-surface-muted p-3">
                  <p className="text-sm font-semibold text-seek-navy">{user.name}</p>
                  <p className="truncate text-xs text-ink-muted">{user.email}</p>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {APP_NAV.map((item) => {
                    const active = isActive(pathname, item.href);
                    const badge = badgeFor(item.badgeKey);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                          active
                            ? "bg-seek-pink-light text-seek-pink-dark"
                            : "text-ink-secondary hover:bg-surface-muted",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                        {badge ? <Badge tone="neutral">{badge}</Badge> : null}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="border-t border-line p-3">
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                  className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-tone-critical hover:bg-surface-muted"
                >
                  Sign out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
