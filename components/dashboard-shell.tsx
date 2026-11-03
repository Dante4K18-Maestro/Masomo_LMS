"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { PublicUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { logoutAction } from "@/lib/actions/auth";

const studentNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/learning", label: "My learning", icon: LibraryBig },
  { href: "/courses", label: "Browse courses", icon: BookOpen },
  { href: "/dashboard/assessments", label: "Assessments", icon: FileCheck2 },
  { href: "/dashboard/certificates", label: "Certificates", icon: GraduationCap },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const staffNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/courses", label: "Courses", icon: LibraryBig },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/assessments", label: "Assessments", icon: FileCheck2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const pageNames: Record<string, string> = {
  dashboard: "Overview",
  learning: "My learning",
  courses: "Courses",
  students: "Students",
  assessments: "Assessments",
  analytics: "Analytics",
  certificates: "Certificates",
  settings: "Settings",
  edit: "Course studio",
  lessons: "Lesson editor",
  take: "Assessment room",
  results: "Results",
  new: "Create",
};

function getPageName(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last || last === "dashboard") return "Overview";
  if (segments.includes("lessons")) return "Lesson editor";
  if (segments.includes("results")) return "Assessment results";
  if (segments.includes("take")) return "Assessment room";
  if (segments[2] === "courses" && (last === "edit" || last === "students")) {
    return last === "students" ? "Course students" : "Course studio";
  }
  return pageNames[last] ?? "Dashboard";
}

export function DashboardShell({
  user,
  children,
}: {
  user: PublicUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = user.role === "student" ? studentNav : staffNav;
  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "instructor"
        ? "Instructor"
        : "Student";
  const pageName = getPageName(pathname);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-mist-50">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[262px] flex-col overflow-y-auto bg-ink-950 px-4 pb-5 pt-5 transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Logo href="/dashboard" theme="dark" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="focus-ring grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-slate-300 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime-300/15 text-lime-300">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold text-white">
              BrighterFuture
            </p>
            <p className="text-[9px] text-slate-500">
              {roleLabel} workspace
            </p>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-600" />
        </div>

        <nav className="mt-6" aria-label="Dashboard navigation">
          <p className="px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            {user.role === "student" ? "Learning" : "Workspace"}
          </p>
          <div className="mt-2 space-y-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold transition",
                    active
                      ? "bg-lime-300 text-ink-950 shadow-[0_6px_18px_-10px_rgba(199,244,90,0.8)]"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-[17px] w-[17px]",
                      active ? "text-ink-950" : "text-slate-500 group-hover:text-slate-300",
                    )}
                    strokeWidth={1.9}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <p className="mt-6 px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Explore
          </p>
          <div className="mt-2 space-y-0.5">
            <Link
              href="/courses"
              className="focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <BookOpen className="h-[17px] w-[17px] text-slate-500 group-hover:text-slate-300" />
              Course catalog
            </Link>
            <Link
              href="/verify"
              className="focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <CircleHelp className="h-[17px] w-[17px] text-slate-500 group-hover:text-slate-300" />
              Verify a certificate
            </Link>
          </div>
        </nav>

        <div className="mt-auto pt-8">
          {user.role === "student" ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-electric-600/20 to-lime-300/10 p-4">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-lime-300">
                A little every day
              </p>
              <p className="mt-2 font-display text-[15px] font-semibold leading-snug text-white">
                Small steps compound.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                Twenty focused minutes today beats a perfect plan next week.
              </p>
              <Link
                href="/dashboard/learning"
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-lime-300 hover:text-lime-200"
              >
                Continue learning
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-electric-600/20 to-lime-300/10 p-4">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-lime-300">
                Course studio
              </p>
              <p className="mt-2 font-display text-[15px] font-semibold leading-snug text-white">
                Shape what learners build next.
              </p>
              <Link
                href="/dashboard/courses/new"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-lime-300 px-2.5 py-1.5 text-[10px] font-bold text-ink-950 transition hover:bg-lime-200"
              >
                <PlusCircle className="h-3 w-3" />
                New course
              </Link>
            </div>
          )}
          <p className="mt-4 px-2 text-[9px] text-slate-600">
            BrighterFuture · v1.0
          </p>
        </div>
      </aside>

      <div className="lg:pl-[262px]">
        <header className="sticky top-0 z-30 border-b border-mist-200 bg-white/90 backdrop-blur">
          <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mist-200 bg-white text-ink-800 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <span>Workspace</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-600">{roleLabel}</span>
              </div>
              <p className="truncate font-display text-[15px] font-semibold tracking-tight text-ink-950">
                {pageName}
              </p>
            </div>

            <form
              action="/courses"
              method="get"
              className="relative hidden xl:block"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="search"
                placeholder="Search courses…"
                className="h-9 w-[230px] rounded-xl border border-mist-200 bg-mist-50 pl-9 pr-3 text-[11px] text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-electric-300 focus:bg-white focus:ring-4 focus:ring-electric-50"
              />
            </form>

            <Link
              href={
                user.role === "student"
                  ? "/dashboard/assessments"
                  : "/dashboard/assessments"
              }
              className="focus-ring relative grid h-9 w-9 place-items-center rounded-xl border border-mist-200 bg-white text-slate-500 transition hover:border-mist-300 hover:text-ink-900"
              aria-label="Open assessments"
              title="Assessments"
            >
              <Bell className="h-4 w-4" />
              {user.role === "student" && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-coral-500 ring-2 ring-white" />
              )}
            </Link>

            <details className="group relative">
              <summary className="focus-ring flex cursor-pointer list-none items-center gap-2.5 rounded-xl border border-transparent p-1 transition hover:border-mist-200 hover:bg-mist-50 [&::-webkit-details-marker]:hidden">
                <Avatar name={user.name} color={user.avatar_color} size="sm" />
                <div className="hidden text-left sm:block">
                  <p className="max-w-[120px] truncate text-[11px] font-bold leading-tight text-ink-950">
                    {user.name}
                  </p>
                  <p className="text-[9px] leading-tight text-slate-400">
                    {roleLabel}
                  </p>
                </div>
                <ChevronRight className="hidden h-3 w-3 text-slate-400 transition group-open:rotate-90 sm:block" />
              </summary>

              <div className="absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-2xl border border-mist-200 bg-white p-2 shadow-lift">
                <div className="flex items-center gap-2.5 rounded-xl bg-mist-50 p-3">
                  <Avatar name={user.name} color={user.avatar_color} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-ink-950">
                      {user.name}
                    </p>
                    <p className="truncate text-[9px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-1.5">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-600 hover:bg-mist-50 hover:text-ink-950"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    Account settings
                  </Link>
                  {user.role === "student" && (
                    <Link
                      href="/dashboard/certificates"
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-600 hover:bg-mist-50 hover:text-ink-950"
                    >
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                      My certificates
                    </Link>
                  )}
                </div>
                <div className="mt-1.5 border-t border-mist-100 pt-1.5">
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-coral-600 hover:bg-coral-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </details>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1460px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
