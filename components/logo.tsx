import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  theme = "light",
  compact = false,
  className,
}: {
  href?: string;
  theme?: "light" | "dark";
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring group inline-flex items-center gap-2.5 rounded-lg",
        className,
      )}
      aria-label="BrighterFuture home"
    >
      <span
        className={cn(
          "relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[11px] shadow-sm transition-transform duration-300 group-hover:-rotate-3",
          theme === "dark" ? "bg-lime-300" : "bg-ink-950",
        )}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className="h-9 w-9"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="19.5"
            r="9"
            stroke={theme === "dark" ? "#0b1729" : "#c7f45a"}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="42 16"
            transform="rotate(-45 18 19.5)"
          />
          <path
            d="M18 5.5V9"
            stroke={theme === "dark" ? "#0b1729" : "#ffffff"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M27.5 9.5L25 12"
            stroke={theme === "dark" ? "#0b1729" : "#5b9aff"}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!compact && (
        <span
          className={cn(
            "font-display text-[19px] font-semibold tracking-[-0.04em]",
            theme === "dark" ? "text-white" : "text-ink-950",
          )}
        >
          Brighter<span className={theme === "dark" ? "text-lime-300" : "text-electric-500"}>Future</span>
        </span>
      )}
    </Link>
  );
}
