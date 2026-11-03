import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  href,
  actionLabel,
  className,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  href?: string;
  actionLabel?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p
            className={cn(
              "eyebrow mb-2.5",
              tone === "dark" ? "text-lime-300" : "text-electric-600",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-display text-[27px] font-semibold leading-tight tracking-[-0.035em] sm:text-[33px]",
            tone === "dark" ? "text-white" : "text-ink-950",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-2 max-w-xl text-sm leading-relaxed",
              tone === "dark" ? "text-slate-400" : "text-slate-500",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action}
      {href && actionLabel && (
        <Link
          href={href}
          className={cn(
            "focus-ring group inline-flex shrink-0 items-center gap-1.5 rounded-lg text-[13px] font-bold transition",
            tone === "dark"
              ? "text-lime-300 hover:text-lime-200"
              : "text-electric-600 hover:text-electric-700",
          )}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
