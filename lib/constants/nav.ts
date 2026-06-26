import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bookmark,
  Briefcase,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional badge key resolved at render (e.g. counts). */
  badgeKey?: "saved" | "applied";
}

/** Primary authenticated navigation (candidate app). */
export const APP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Job search", href: "/jobs", icon: Search },
  { label: "Saved jobs", href: "/saved-jobs", icon: Bookmark, badgeKey: "saved" },
  { label: "Saved searches", href: "/saved-searches", icon: Bell },
  { label: "Applied jobs", href: "/applied", icon: Briefcase, badgeKey: "applied" },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings },
];

/** Marketing top-nav links. */
export const MARKETING_NAV: { label: string; href: string }[] = [
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Career advice", href: "/career-advice" },
];

export const PROFILE_MENU: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Saved jobs", href: "/saved-jobs", icon: Bookmark },
  { label: "Applied jobs", href: "/applied", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];
