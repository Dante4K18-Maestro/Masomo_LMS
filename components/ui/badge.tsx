import { cn } from "@/lib/utils";

type BadgeTone =
  | "neutral"
  | "blue"
  | "green"
  | "lime"
  | "amber"
  | "red"
  | "violet"
  | "dark";

const tones: Record<BadgeTone, string> = {
  neutral: "border-mist-200 bg-mist-50 text-slate-600",
  blue: "border-electric-100 bg-electric-50 text-electric-700",
  green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  lime: "border-lime-200 bg-lime-50 text-lime-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-coral-200 bg-coral-50 text-coral-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  dark: "border-white/10 bg-white/10 text-white/85",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-5",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full bg-current", {
            "text-electric-500": tone === "blue",
            "text-emerald-500": tone === "green",
            "text-lime-500": tone === "lime",
            "text-amber-500": tone === "amber",
            "text-coral-500": tone === "red",
            "text-violet-500": tone === "violet",
          })}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: BadgeTone; label: string }> = {
    published: { tone: "green", label: "Published" },
    draft: { tone: "amber", label: "Draft" },
    archived: { tone: "neutral", label: "Archived" },
    active: { tone: "green", label: "Active" },
    suspended: { tone: "red", label: "Suspended" },
    in_progress: { tone: "blue", label: "In progress" },
    submitted: { tone: "green", label: "Submitted" },
    passed: { tone: "green", label: "Passed" },
    failed: { tone: "red", label: "Needs another try" },
  };
  const entry = map[status] ?? { tone: "neutral" as BadgeTone, label: status };
  return (
    <Badge tone={entry.tone} dot>
      {entry.label}
    </Badge>
  );
}
