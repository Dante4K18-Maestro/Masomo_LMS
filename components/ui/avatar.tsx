import { cn, avatarStyle, initials } from "@/lib/utils";

export function Avatar({
  name,
  color = "electric",
  size = "md",
  className,
}: {
  name: string;
  color?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-tight ring-2 ring-white",
        avatarStyle(color),
        {
          "h-6 w-6 text-[9px]": size === "xs",
          "h-8 w-8 text-[11px]": size === "sm",
          "h-10 w-10 text-xs": size === "md",
          "h-12 w-12 text-sm": size === "lg",
          "h-16 w-16 text-lg": size === "xl",
        },
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
