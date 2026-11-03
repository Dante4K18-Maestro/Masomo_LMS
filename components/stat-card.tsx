import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "blue",
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "blue" | "lime" | "violet" | "amber" | "coral" | "green";
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
}) {
  const tones = {
    blue: "bg-electric-50 text-electric-600",
    lime: "bg-lime-50 text-lime-700",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    coral: "bg-coral-50 text-coral-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-mist-200 bg-white p-5 shadow-soft",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold text-slate-500">{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl",
            tones[tone],
          )}
        >
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
        </span>
      </div>
      <p className="mt-3 font-display text-[30px] font-semibold leading-none tracking-[-0.04em] text-ink-950">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-bold",
              trend.direction === "up" ? "text-emerald-600" : "text-coral-600",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
        {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
