import {
  Binary,
  BrainCircuit,
  CloudCog,
  Code2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const coverThemes: Record<
  string,
  { bg: string; glow: string; accent: string; line: string }
> = {
  ocean: {
    bg: "from-[#061a33] via-[#0a3a66] to-[#0e7490]",
    glow: "bg-cyan-300",
    accent: "text-cyan-200",
    line: "border-cyan-200/20",
  },
  sunset: {
    bg: "from-[#2a0f0a] via-[#9a3412] to-[#f59e0b]",
    glow: "bg-amber-300",
    accent: "text-amber-100",
    line: "border-amber-100/20",
  },
  dusk: {
    bg: "from-[#150a2a] via-[#3b0764] to-[#7e22ce]",
    glow: "bg-fuchsia-300",
    accent: "text-fuchsia-100",
    line: "border-fuchsia-100/20",
  },
  sky: {
    bg: "from-[#06263e] via-[#075985] to-[#0ea5e9]",
    glow: "bg-sky-300",
    accent: "text-sky-100",
    line: "border-sky-100/20",
  },
  violet: {
    bg: "from-[#120f35] via-[#4338ca] to-[#a78bfa]",
    glow: "bg-violet-300",
    accent: "text-violet-100",
    line: "border-violet-100/20",
  },
  lime: {
    bg: "from-[#101a08] via-[#365314] to-[#a3e635]",
    glow: "bg-lime-300",
    accent: "text-lime-100",
    line: "border-lime-100/20",
  },
  ember: {
    bg: "from-[#18110d] via-[#7c2d12] to-[#f97316]",
    glow: "bg-orange-300",
    accent: "text-orange-100",
    line: "border-orange-100/20",
  },
};

const categoryIcons = {
  "Web Development": Code2,
  "Data & AI": BrainCircuit,
  Cybersecurity: ShieldCheck,
  "Cloud & DevOps": CloudCog,
  "Design & Product": Sparkles,
} as const;

export function CourseCover({
  cover,
  category,
  title,
  className,
  compact = false,
  code,
}: {
  cover: string;
  category: string;
  title?: string;
  className?: string;
  compact?: boolean;
  code?: string;
}) {
  const theme = coverThemes[cover] ?? coverThemes.ocean;
  const Icon =
    categoryIcons[category as keyof typeof categoryIcons] ?? Binary;
  const tag =
    code ??
    category
      .split(" ")
      .map((word) => word.slice(0, 3).toUpperCase())
      .join(" / ");

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br",
        theme.bg,
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0 bg-grid-dark bg-[size:26px_26px] opacity-60",
        )}
      />
      <div
        className={cn(
          "absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl",
          theme.glow,
        )}
      />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/30 blur-2xl" />

      <div className="absolute left-5 top-5 flex items-center gap-2">
        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
          {tag}
        </span>
      </div>

      <div
        className={cn(
          "absolute right-5 top-5 grid place-items-center rounded-full border bg-white/10 backdrop-blur",
          theme.line,
          compact ? "h-9 w-9" : "h-12 w-12",
        )}
      >
        <Icon
          className={cn(theme.accent, compact ? "h-4 w-4" : "h-5 w-5")}
          strokeWidth={1.75}
        />
      </div>

      {!compact && title && (
        <p className="absolute bottom-5 left-5 right-16 line-clamp-2 font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] text-white">
          {title}
        </p>
      )}

      <div className="absolute bottom-5 right-5 font-mono text-[10px] tracking-[0.2em] text-white/40">
        01001
      </div>

      <svg
        className="absolute -bottom-8 right-8 h-36 w-36 opacity-[0.18]"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle cx="60" cy="60" r="54" stroke="white" strokeWidth="1" />
        <circle cx="60" cy="60" r="38" stroke="white" strokeWidth="1" />
        <circle cx="60" cy="60" r="21" stroke="white" strokeWidth="1" />
        <path d="M6 60h108M60 6v108" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function coverGradient(cover: string) {
  return coverThemes[cover]?.bg ?? coverThemes.ocean.bg;
}
