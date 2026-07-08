import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface EmployerLogoProps {
  src: string;
  name: string;
  size?: number;
  className?: string;
}

/** Square employer letter-mark with a subtle border. */
export function EmployerLogo({ src, name, size = 48, className }: EmployerLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        unoptimized
        className="h-full w-full object-cover"
      />
    </span>
  );
}
