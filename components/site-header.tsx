"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/#paths", label: "Career paths" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#stories", label: "Stories" },
];

export function SiteHeader({
  theme = "light",
  signedIn = false,
}: {
  theme?: "light" | "dark";
  signedIn?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "relative z-40 border-b",
        theme === "dark"
          ? "border-white/10 bg-ink-950/90 text-white backdrop-blur"
          : "border-mist-200 bg-white/90 text-ink-950 backdrop-blur",
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo theme={theme} />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring rounded text-[13px] font-semibold transition",
                theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-ink-950",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {signedIn ? (
            <Link
              href="/dashboard"
              className={buttonStyles({
                variant: theme === "dark" ? "accent" : "primary",
                size: "md",
              })}
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "focus-ring rounded-lg px-3 py-2 text-[13px] font-semibold transition",
                  theme === "dark"
                    ? "text-slate-300 hover:bg-white/10 hover:text-white"
                    : "text-slate-600 hover:bg-mist-100 hover:text-ink-950",
                )}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={buttonStyles({
                  variant: theme === "dark" ? "accent" : "primary",
                  size: "md",
                })}
              >
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "focus-ring grid h-10 w-10 place-items-center rounded-xl sm:hidden",
            theme === "dark"
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-mist-100 text-ink-900 hover:bg-mist-200",
          )}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className={cn(
            "border-t px-5 pb-5 pt-3 sm:hidden",
            theme === "dark"
              ? "border-white/10 bg-ink-950"
              : "border-mist-200 bg-white",
          )}
        >
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-semibold",
                  theme === "dark"
                    ? "text-slate-200 hover:bg-white/10"
                    : "text-slate-700 hover:bg-mist-50",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-current/10 pt-4">
            {signedIn ? (
              <Link
                href="/dashboard"
                className={buttonStyles({ variant: "accent", size: "md" })}
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonStyles({ variant: "outline", size: "md" })}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={buttonStyles({ variant: "accent", size: "md" })}
                >
                  Start learning
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
