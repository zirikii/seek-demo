import * as React from "react";
import { cn } from "../cn";

export interface DemoRibbonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text shown inside the pill. Defaults to "Demo". */
  label?: string;
}

/**
 * Small, dependency-light pill used across the demo apps to mark them as
 * unofficial recreations. Uses the shared `--demo-accent` token so the dot
 * colour stays consistent regardless of each app's own theme.
 */
export function DemoRibbon({
  label = "Demo",
  className,
  ...props
}: DemoRibbonProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "var(--demo-accent, #f54e00)" }}
      />
      {label}
    </span>
  );
}

export default DemoRibbon;
