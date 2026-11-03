import Link from "next/link";
import {
  BookOpen,
  Compass,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getCourseCategories,
  getPublishedCourses,
} from "@/lib/queries";
import { COURSE_LEVELS } from "@/lib/constants";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";
import { Button, buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "IT Courses",
  description:
    "Explore BrighterFuture's focused IT courses in web development, data and AI, cybersecurity, cloud, and product design.",
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = first(params.search)?.trim() ?? "";
  const category = first(params.category) ?? "All";
  const level = first(params.level) ?? "All";
  const sort = first(params.sort) ?? "newest";

  const [user, courses, categories] = await Promise.all([
    getCurrentUser(),
    getPublishedCourses({ search, category, level, sort }),
    getCourseCategories(),
  ]);

  const hasFilters = Boolean(search || category !== "All" || level !== "All");

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="bg-white">
        <SiteHeader signedIn={Boolean(user)} />
      </div>

      <section className="relative overflow-hidden border-b border-mist-200 bg-white">
        <div className="absolute inset-0 bg-grid-light bg-[size:40px_40px] opacity-70" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-electric-100/60 blur-3xl" />
        <div className="container-page relative py-12 lg:py-16">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <Link href="/" className="hover:text-ink-900">
                  Home
                </Link>
                <span>/</span>
                <span className="text-ink-800">Courses</span>
              </div>
              <p className="eyebrow mt-5 text-electric-600">
                <Sparkles className="h-3.5 w-3.5" />
                The BrighterFuture catalog
              </p>
              <h1 className="mt-3 max-w-2xl font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink-950 sm:text-[50px]">
                Build real capability,
                <br />
                one IT skill at a time.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Focused courses with practical labs and honest assessments.
                Every path is designed for the work technology teams actually
                do.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-mist-200 bg-mist-50/80 px-5 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-950 text-lime-300">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">
                  {courses.length} course{courses.length === 1 ? "" : "s"} ready
                  to explore
                </p>
                <p className="mt-0.5 text-[13px] font-bold text-ink-950">
                  Find your direction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container-page py-8 lg:py-10">
        <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-soft sm:p-5">
          <form method="get" className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search courses</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search courses, categories, or skills…"
                className="input h-11 pl-10"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
              <label className="relative">
                <span className="sr-only">Category</span>
                <select
                  name="category"
                  defaultValue={category}
                  className="input h-11 min-w-[152px] cursor-pointer appearance-none pr-8"
                >
                  <option value="All">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </label>

              <label className="relative">
                <span className="sr-only">Level</span>
                <select
                  name="level"
                  defaultValue={level}
                  className="input h-11 min-w-[130px] cursor-pointer appearance-none pr-8"
                >
                  <option value="All">All levels</option>
                  {COURSE_LEVELS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </label>

              <label className="relative col-span-2 sm:col-span-1">
                <span className="sr-only">Sort</span>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="input h-11 min-w-[140px] cursor-pointer appearance-none pr-8"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most popular</option>
                  <option value="title">A–Z</option>
                  <option value="duration">Shortest</option>
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </label>
            </div>

            <Button type="submit" variant="primary" className="h-11 lg:px-5">
              Apply filters
            </Button>
            {hasFilters && (
              <Link
                href="/courses"
                className={buttonStyles({
                  variant: "ghost",
                  size: "md",
                  className: "h-11",
                })}
              >
                <X className="h-4 w-4" />
                Clear
              </Link>
            )}
          </form>

          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-mist-100 pt-3">
              <span className="text-[11px] font-semibold text-slate-400">
                Active:
              </span>
              {search && <Badge tone="blue">“{search}”</Badge>}
              {category !== "All" && <Badge tone="violet">{category}</Badge>}
              {level !== "All" && <Badge tone="lime">{level}</Badge>}
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
              {hasFilters ? "Matching courses" : "All courses"}
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {courses.length} result{courses.length === 1 ? "" : "s"}
              {hasFilters ? " for your filters" : " across five IT disciplines"}
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Badge tone="green" dot>
              Enrolling now
            </Badge>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                href={`/courses/${course.slug}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-5 bg-white"
            icon={BookOpen}
            title="No courses match those filters"
            description="Try a broader search, a different level, or clear the filters to see the full catalog."
            action={
              <Link href="/courses" className={buttonStyles({ variant: "primary" })}>
                Clear all filters
              </Link>
            }
          />
        )}

        <div className="mt-14 rounded-2xl border border-mist-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-100 text-lime-800">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink-950">
                  Not sure where to begin?
                </h3>
                <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-500">
                  Start with a foundation course, then build depth. Every path
                  is designed to connect to the next.
                </p>
              </div>
            </div>
            <Link
              href="/register"
              className={buttonStyles({
                variant: "primary",
                className: "shrink-0",
              })}
            >
              Create a free account
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
