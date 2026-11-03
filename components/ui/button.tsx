import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "electric"
  | "accent"
  | "outline"
  | "ghost"
  | "danger"
  | "dark";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-55",
    {
      "bg-ink-950 text-white shadow-sm hover:bg-ink-800 active:scale-[0.985]":
        variant === "primary",
      "bg-electric-500 text-white shadow-[0_6px_18px_-6px_rgba(54,120,246,0.65)] hover:bg-electric-600 active:scale-[0.985]":
        variant === "electric",
      "bg-lime-300 text-ink-950 shadow-[0_6px_18px_-8px_rgba(174,230,43,0.8)] hover:bg-lime-200 active:scale-[0.985]":
        variant === "accent",
      "border border-mist-300 bg-white text-ink-800 shadow-sm hover:border-mist-400 hover:bg-mist-50 active:scale-[0.985]":
        variant === "outline",
      "text-ink-700 hover:bg-mist-100 hover:text-ink-950":
        variant === "ghost",
      "bg-coral-500 text-white shadow-sm hover:bg-coral-600 active:scale-[0.985]":
        variant === "danger",
      "bg-white/10 text-white ring-1 ring-inset ring-white/15 backdrop-blur hover:bg-white/15":
        variant === "dark",
      "h-8 px-3 text-xs": size === "sm",
      "h-10 px-4 text-[13px]": size === "md",
      "h-12 rounded-[14px] px-6 text-sm": size === "lg",
      "h-9 w-9": size === "icon",
    },
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  loading = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
