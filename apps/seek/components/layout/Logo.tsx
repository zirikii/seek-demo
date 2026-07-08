import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  variant?: "pink" | "white";
  href?: string;
  className?: string;
  /** Rendered logo height in pixels (width scales to the 2.8:1 lockup ratio). */
  height?: number;
}

/** seek logo (dotted-arrow mark + wordmark), linked. Uses the brand SVGs under /brand. */
export function Logo({ variant = "pink", href = "/", className, height = 30 }: LogoProps) {
  const src = variant === "white" ? "/brand/logo-white.svg" : "/brand/logo.svg";
  const width = Math.round(height * 2.8);
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center focus-ring rounded-sm", className)}
      aria-label="SEEK home"
    >
      <Image src={src} alt="SEEK" width={width} height={height} priority unoptimized />
    </Link>
  );
}
