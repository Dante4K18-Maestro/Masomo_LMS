import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  Clock3,
  CloudCog,
  Code2,
  Compass,
  GraduationCap,
  Layers3,
  LineChart,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getPlatformStats,
  getPublishedCourses,
  getCourseCategories,
} from "@/lib/queries";
import { FAQ_ITEMS, CATEGORY_BLURBS, IT_CATEGORIES } from "@/lib/constants";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

const categoryIcons = {
  "Web Development": Code2,
  "Data & AI": BrainCircuit,
  Cybersecurity: ShieldCheck,
  "Cloud & DevOps": CloudCog,
  "Design & Product": Sparkles,
} as const;

const journey = [
  {
    number: "01",
    title: "Choose your direction",
    description:
      "Pick an IT path that matches the problems you want to solve. Every course is mapped to real roles and skills.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Build with intent",
    description:
      "Short lessons, deliberate labs, and projects that push you past following along. Learn the why behind the how.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Prove what you know",
    description:
      "Auto-graded assessments and a verified certificate give you concrete evidence of the skills you have built.",
    icon: Award,
  },
];

const testimonials = [
  {
    quote:
      "The labs felt like real work, not homework. I shipped a full-stack capstone and used it to land my first developer role six weeks later.",
    name: "Maya Chen",
    role: "Full-Stack Developer",
    previous: "formerly marketing",
    initials: "MC",
    color: "bg-lime-200 text-lime-900",
  },
  {
    quote:
      "I finally understand how the cloud fits together. The failure exercises were the moment it clicked — I stopped being afraid of breaking production.",
    name: "Noah Williams",
    role: "Cloud Support Engineer",
    previous: "former IT support",
    initials: "NW",
    color: "bg-sky-100 text-sky-800",
  },
  {
    quote:
      "The data course taught me to ask better questions before touching a model. My team now trusts my analysis because I show my reasoning.",
    name: "Priya Nair",
    role: "Data Analyst",
    previous: "career accelerator",
    initials: "PN",
    color: "bg-coral-100 text-coral-800",
  },
];

export default async function HomePage() {
  const [user, courses, categories, stats] = await Promise.all([
    getCurrentUser(),
    getPublishedCourses({ sort: "popular" }),
    getCourseCategories(),
    getPlatformStats(),
  ]);

  const featuredCourses = courses.slice(0, 3);
  const categoryCounts = new Map(
    categories.map((category) => [
      category,
      courses.filter((course) => course.category === category).length,
    ]),
  );
  const totalMinutes = courses.reduce(
    (sum, course) => sum + course.duration_hours * 60,
    0,
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid-dark bg-[size:52px_52px] opacity-30" />
        <div className="absolute -left-32 top-20 h-[460px] w-[460px] rounded-full bg-electric-500/20 blur-[110px]" />
        <div className="absolute right-[-100px] top-[-80px] h-[380px] w-[380px] rounded-full bg-lime-300/10 blur-[90px]" />
        <SiteHeader theme="dark" signedIn={Boolean(user)} />

        <div className="container-page relative grid items-center gap-12 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-2 pr-3.5 backdrop-blur">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-lime-300">
                <Sparkles className="h-3 w-3 text-ink-950" />
              </span>
              <span className="text-[11px] font-semibold tracking-wide text-slate-200">
                Real skills. Real projects. No fluff.
              </span>
            </div>

            <h1 className="mt-6 font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[62px] lg:text-[68px] xl:text-[76px]">
              Your future
              <br />
              in tech starts{" "}
              <span className="relative inline-block text-lime-300">
                brighter
                <svg
                  viewBox="0 0 240 16"
                  fill="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-lime-300/70"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 12C59 3 155 2 238 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-7 max-w-[540px] text-[15px] leading-7 text-slate-300 sm:text-base">
              Master the IT skills shaping tomorrow — web development, data and
              AI, cybersecurity, and cloud — through focused lessons, hands-on
              labs, and feedback that actually helps you grow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard" : "/register"}
                className={buttonStyles({
                  variant: "accent",
                  size: "lg",
                  className: "group",
                })}
              >
                {user ? "Continue learning" : "Start learning free"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/courses"
                className={buttonStyles({ variant: "dark", size: "lg" })}
              >
                <Play className="h-4 w-4 fill-current" />
                Explore courses
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex -space-x-2">
                {["MC", "NW", "PN", "TM"].map((initials, index) => (
                  <span
                    key={initials}
                    className={`grid h-8 w-8 place-items-center rounded-full border-2 border-ink-950 text-[9px] font-bold ${
                      ["bg-lime-200 text-lime-900", "bg-sky-200 text-sky-900", "bg-coral-200 text-coral-900", "bg-violet-200 text-violet-900"][index]
                    }`}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <p className="text-[12px] text-slate-400">
                <span className="font-semibold text-white">{stats.learners * 240}+ learners</span>{" "}
                building brighter careers
              </p>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3.5 w-3.5 fill-lime-300 text-lime-300"
                  />
                ))}
                <span className="ml-1 text-[12px] text-slate-400">4.9 average</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] animate-fade-up [animation-delay:120ms]">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-electric-500/20 via-transparent to-lime-300/10 blur-2xl" />
            <div className="relative rotate-[1.5deg] rounded-[28px] border border-white/10 bg-white/[0.07] p-2.5 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover:rotate-0">
              <div className="overflow-hidden rounded-[20px] bg-[#f6f8fc] text-ink-950 shadow-xl">
                <div className="flex items-center gap-2 border-b border-mist-200 bg-white px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
                  </div>
                  <div className="mx-auto flex items-center gap-1.5 rounded-md bg-mist-100 px-3 py-1 font-mono text-[8px] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    app.brighterfuture.dev
                  </div>
                </div>

                <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[78px_1fr]">
                  <div className="flex flex-col items-center gap-2 border-r border-mist-200 bg-white px-2 py-4">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-ink-950">
                      <span className="font-display text-[11px] font-bold text-lime-300">
                        b
                      </span>
                    </div>
                    {[Code2, BookOpen, LineChart, Award].map((Icon, index) => (
                      <span
                        key={index}
                        className={`grid h-7 w-7 place-items-center rounded-lg ${
                          index === 1
                            ? "bg-electric-50 text-electric-600"
                            : "text-slate-400"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    ))}
                  </div>

                  <div className="min-w-0 p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Tuesday, 10:24
                        </p>
                        <p className="mt-0.5 font-display text-[15px] font-semibold tracking-tight">
                          Good morning, Maya
                        </p>
                      </div>
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-200 text-[8px] font-bold text-lime-900">
                        MC
                      </span>
                    </div>

                    <div className="mt-3 overflow-hidden rounded-xl bg-gradient-to-br from-ink-900 to-electric-800 p-3.5 text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-electric-200">
                            Continue learning
                          </p>
                          <p className="mt-1 font-display text-[13px] font-semibold leading-snug">
                            Full-Stack Web Development
                          </p>
                          <p className="mt-0.5 text-[9px] text-slate-400">
                            Module 3 · State, data fetching, and loading states
                          </p>
                        </div>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime-300 text-ink-950">
                          <Play className="h-3 w-3 fill-current" />
                        </span>
                      </div>
                      <div className="mt-3.5">
                        <div className="mb-1.5 flex justify-between text-[8px]">
                          <span className="text-slate-400">Course progress</span>
                          <span className="font-semibold text-lime-300">75%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/15">
                          <div className="h-full w-3/4 rounded-full bg-lime-300" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-mist-200 bg-white p-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-lime-50 text-lime-700">
                            <Zap className="h-3 w-3" />
                          </span>
                          <p className="text-[8px] font-semibold text-slate-400">
                            Weekly goal
                          </p>
                        </div>
                        <p className="mt-1.5 font-display text-[17px] font-semibold">
                          4 <span className="text-[9px] font-medium text-slate-400">/ 5 lessons</span>
                        </p>
                      </div>
                      <div className="rounded-xl border border-mist-200 bg-white p-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-electric-50 text-electric-600">
                            <Target className="h-3 w-3" />
                          </span>
                          <p className="text-[8px] font-semibold text-slate-400">
                            Latest score
                          </p>
                        </div>
                        <p className="mt-1.5 font-display text-[17px] font-semibold">
                          90% <span className="text-[9px] font-medium text-emerald-600">Passed</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 rounded-xl border border-mist-200 bg-white p-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-semibold text-slate-400">
                          Up next · Data Science with Python
                        </p>
                        <span className="font-mono text-[7px] text-slate-300">02 / 09</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist-100">
                        <div className="h-full w-1/4 rounded-full bg-electric-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 bottom-12 hidden animate-float rounded-2xl border border-white/15 bg-ink-900/90 p-3.5 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-300 text-ink-950">
                  <BadgeCheck className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold text-white">
                    Certificate earned
                  </p>
                  <p className="text-[8px] text-slate-400">
                    Cybersecurity Essentials
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-[-18px] hidden rounded-2xl border border-white/15 bg-white p-3 shadow-xl sm:block">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-electric-50 text-electric-600">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[9px] font-bold text-ink-950">Cohort energy</p>
                  <p className="text-[8px] text-slate-400">128 learning now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="container-page grid grid-cols-2 divide-x divide-white/10 py-6 sm:grid-cols-4">
            {[
              { value: `${stats.courses}`, label: "Focused IT courses" },
              { value: `${stats.lessons}+`, label: "Lessons and labs" },
              { value: `${Math.round(totalMinutes / 60)}h`, label: "Of deep practice" },
              { value: "100%", label: "Practical curriculum" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 text-center first:pl-0 last:pr-0 sm:px-6">
                <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[28px]">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-500 sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="paths" className="relative bg-white py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Career paths"
            title="Choose a direction with a future"
            description="Every course is firmly rooted in information technology — built around the skills teams hire for right now."
            href="/courses"
            actionLabel="Browse all courses"
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {IT_CATEGORIES.map((category, index) => {
              const Icon =
                categoryIcons[category as keyof typeof categoryIcons] ?? Code2;
              const accent = [
                "bg-electric-50 text-electric-600",
                "bg-violet-50 text-violet-600",
                "bg-coral-50 text-coral-600",
                "bg-sky-50 text-sky-600",
                "bg-lime-50 text-lime-700",
              ][index];
              return (
                <Link
                  key={category}
                  href={`/courses?category=${encodeURIComponent(category)}`}
                  className="focus-ring group flex flex-col rounded-2xl border border-mist-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-soft"
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <p className="mt-4 text-[13px] font-bold text-ink-950">
                    {category}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">
                    {CATEGORY_BLURBS[category]}
                  </p>
                  <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition group-hover:text-electric-600">
                    {categoryCounts.get(category) ?? 0} course
                    {(categoryCounts.get(category) ?? 0) === 1 ? "" : "s"}
                    <ArrowRight className="h-3 w-3" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Popular right now"
            title="Start with a course that stretches you"
            description="Deep enough to matter. Structured enough to finish. Every learning path ends with something you can show."
            href="/courses"
            actionLabel="Explore the catalog"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                href={`/courses/${course.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20 lg:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow text-electric-600">How it works</p>
              <h2 className="mt-3 max-w-md font-display text-[33px] font-semibold leading-[1.08] tracking-[-0.04em] text-ink-950 sm:text-[42px]">
                Less passive watching.
                <br />
                More{" "}
                <span className="text-electric-500">building</span>.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                BrighterFuture is designed around the way technical skill
                actually develops: focused input, deliberate practice, and
                honest feedback.
              </p>
              <Link
                href="/register"
                className={buttonStyles({ variant: "primary", className: "mt-6" })}
              >
                Create your free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {journey.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="group grid gap-5 rounded-2xl border border-mist-200 bg-white p-6 transition hover:border-mist-300 hover:shadow-soft sm:grid-cols-[auto_1fr] sm:p-7"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist-100 text-ink-800 transition group-hover:bg-electric-50 group-hover:text-electric-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-slate-400">
                          {step.number}
                        </span>
                        <span className="h-px flex-1 bg-mist-200 sm:max-w-[60px]" />
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink-950">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Clock3, value: "Self-paced", label: "Learn on your schedule" },
                  { icon: BadgeCheck, value: "Verified", label: "Shareable certificates" },
                  { icon: Users, value: "Human", label: "Instructor feedback" },
                ].map((item) => (
                  <div
                    key={item.value}
                    className="rounded-xl border border-mist-200 bg-mist-50/60 p-4"
                  >
                    <item.icon className="h-4 w-4 text-electric-500" />
                    <p className="mt-2.5 text-xs font-bold text-ink-900">{item.value}</p>
                    <p className="mt-0.5 text-[10.5px] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="relative overflow-hidden bg-ink-950 py-20 lg:py-24">
        <div className="absolute inset-0 bg-grid-dark bg-[size:48px_48px] opacity-25" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-electric-500/15 blur-3xl" />
        <div className="container-page relative grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-lg">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 shadow-2xl backdrop-blur">
                <div className="rounded-xl bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                        Assessment result
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-ink-950">
                        Security Essentials Exam
                      </p>
                    </div>
                    <ProgressRing value={90} size={64} stroke={6} />
                  </div>
                  <div className="mt-5 rounded-xl bg-mist-50 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-900">
                        Cybersecurity Essentials
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <Check className="h-3 w-3" />
                        Passed
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        ["Score", "45 / 50"],
                        ["Pass mark", "75%"],
                        ["Attempt", "1 of ∞"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-white p-2.5">
                          <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                            {label}
                          </p>
                          <p className="mt-1 text-[11px] font-bold text-ink-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[
                      ["Threat modeling", true],
                      ["OWASP and injection", true],
                      ["Incident response", true],
                      ["Network segmentation", false],
                    ].map(([label, correct]) => (
                      <div
                        key={String(label)}
                        className="flex items-center gap-2.5 text-[11px]"
                      >
                        <span
                          className={`grid h-4 w-4 place-items-center rounded-full ${
                            correct
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-coral-100 text-coral-600"
                          }`}
                        >
                          {correct ? (
                            <Check className="h-2.5 w-2.5" />
                          ) : (
                            <span className="text-[9px] font-bold">×</span>
                          )}
                        </span>
                        <span className="flex-1 text-slate-600">{label}</span>
                        <span className="font-mono text-[8px] text-slate-300">
                          {correct ? "correct" : "review"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -right-5 -top-5 rounded-xl border border-white/15 bg-lime-300 px-3 py-2 shadow-lg">
                <p className="text-[9px] font-bold uppercase tracking-wider text-ink-950">
                  Feedback in seconds
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow text-lime-300">Assessment that teaches</p>
            <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[44px]">
              Know exactly where
              <br />
              you stand.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Quizzes and exams are not a final hurdle — they are a map. Get
              graded instantly, revisit the concepts that slipped, and see your
              progress build over time.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                "Auto-graded assessments with clear pass marks",
                "Detailed answer review for every question",
                "Progress and results connected to your course path",
                "Verified certificates when you meet every requirement",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime-300/15 text-lime-300">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-[13px] leading-6 text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/courses"
              className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-lime-300 transition hover:text-lime-200"
            >
              Find your next assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="stories" className="bg-mist-50 py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Learner stories"
            title="Real people, building real momentum"
            description="Brighter futures are made of small, deliberate steps. These are a few of the paths our learners are taking."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex flex-col rounded-2xl border border-mist-200 bg-white p-6 shadow-soft"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[14px] leading-7 text-slate-600">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-mist-100 pt-5">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold ${testimonial.color}`}
                  >
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="text-[12px] font-bold text-ink-950">
                      {testimonial.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {testimonial.role} · {testimonial.previous}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 border-t border-mist-200 pt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Skills built across
            </p>
            {["React & TypeScript", "Python & pandas", "AWS", "OWASP", "Figma"].map(
              (item) => (
                <span key={item} className="font-display text-sm font-semibold text-slate-400">
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-20 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow text-electric-600">Questions</p>
            <h2 className="mt-3 font-display text-[33px] font-semibold leading-tight tracking-[-0.04em] text-ink-950">
              Everything you need
              <br />
              to start with clarity.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Still curious? Write to us at{" "}
              <a
                href="mailto:hello@brighterfuture.dev"
                className="font-semibold text-electric-600 underline-offset-2 hover:underline"
              >
                hello@brighterfuture.dev
              </a>
              .
            </p>
          </div>
          <div className="divide-y divide-mist-200 border-y border-mist-200">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-ink-950">
                  {item.question}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-mist-200 text-slate-400 transition group-open:rotate-180 group-open:border-electric-200 group-open:bg-electric-50 group-open:text-electric-600">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="mt-3 max-w-xl pr-10 text-[13px] leading-6 text-slate-500">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[28px] bg-ink-950 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute inset-0 bg-grid-dark bg-[size:42px_42px] opacity-25" />
            <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-electric-500/25 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <Badge tone="lime" className="mb-4">
                  <Sparkles className="h-3 w-3" />
                  Your next chapter
                </Badge>
                <h2 className="max-w-xl font-display text-[33px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[43px]">
                  The future is technical.
                  <br />
                  Make yours{" "}
                  <span className="text-lime-300">brighter</span>.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
                  Join a learning community built for people who want to
                  understand deeply — and build things that matter.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/register"
                  className={buttonStyles({
                    variant: "accent",
                    size: "lg",
                    className: "whitespace-nowrap",
                  })}
                >
                  Start learning free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className={buttonStyles({
                    variant: "dark",
                    size: "lg",
                    className: "whitespace-nowrap",
                  })}
                >
                  Explore your dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
