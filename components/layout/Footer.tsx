import Link from "next/link";
import { Logo } from "./Logo";

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "For candidates",
    links: [
      { label: "Search jobs", href: "/jobs" },
      { label: "Saved searches", href: "/saved-searches" },
      { label: "Career advice", href: "/career-advice" },
      { label: "Explore companies", href: "/companies" },
    ],
  },
  {
    heading: "For employers",
    links: [
      { label: "Post a job", href: "/" },
      { label: "Products & prices", href: "/" },
      { label: "Recruitment advice", href: "/" },
      { label: "Talent search", href: "/" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About this demo", href: "/career-advice" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Contact", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-seek-navy text-white/90">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo variant="white" height={26} />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Australia&apos;s no. 1 jobs site — connecting candidates with their next opportunity.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/15 pt-6 text-xs text-white/60">
          <p>
            Unofficial demo &middot; Not affiliated with, endorsed by, or sponsored by SEEK
            Limited. Brand assets are recreated approximations used for UI/UX fidelity only.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} SEEK demo. Built for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}
