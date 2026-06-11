import Image from "next/image";
import { cn } from "@/lib/utils";

type SentinelLogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
};

export function SentinelLogo({
  size = 32,
  showWordmark = true,
  className,
  wordmarkClassName,
}: SentinelLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/sentinel-icon.png"
        alt="Sentinel"
        width={size}
        height={size}
        className="rounded-lg"
        priority
      />
      {showWordmark && (
        <span className={cn("font-bold text-foreground", wordmarkClassName)}>Sentinel</span>
      )}
    </div>
  );
}
