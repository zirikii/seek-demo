import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface-muted text-ink-secondary",
        brand: "border-transparent bg-seek-pink-light text-seek-pink-dark",
        positive: "border-transparent bg-tone-positive-bg text-tone-positive",
        critical: "border-transparent bg-tone-critical-bg text-tone-critical",
        caution: "border-transparent bg-tone-caution-bg text-tone-caution",
        info: "border-transparent bg-tone-info-bg text-tone-info",
        navy: "border-transparent bg-seek-navy text-white",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
