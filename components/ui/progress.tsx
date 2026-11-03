import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  size = "md",
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      aria-label={label ?? "Progress"}
      className={cn(
        "w-full overflow-hidden rounded-full bg-mist-200/80",
        {
          "h-1.5": size === "sm",
          "h-2": size === "md",
          "h-2.5": size === "lg",
        },
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-electric-500 transition-[width] duration-500",
          barClassName,
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 76,
  stroke = 7,
  className,
  labelClassName,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  labelClassName?: string;
}) {
  const safe = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${safe}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-mist-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-electric-500 transition-all duration-700"
        />
      </svg>
      <span
        className={cn(
          "absolute font-display text-sm font-semibold text-ink-900",
          labelClassName,
        )}
      >
        {safe}%
      </span>
    </div>
  );
}
