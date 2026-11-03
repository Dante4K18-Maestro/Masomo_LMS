import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCertificateByCode } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { CourseCover } from "@/components/course-cover";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = getCertificateByCode(
    decodeURIComponent(code).trim().toUpperCase(),
  );
  return {
    title: certificate ? `Certificate ${certificate.code}` : "Certificate not found",
    description: certificate
      ? `Verify the BrighterFuture certificate issued to ${certificate.user_name} for ${certificate.course_title}.`
      : "This BrighterFuture certificate could not be verified.",
  };
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [{ code }, user] = await Promise.all([params, getCurrentUser()]);
  const normalised = decodeURIComponent(code).trim().toUpperCase();
  const certificate = getCertificateByCode(normalised);

  if (!certificate) {
    return (
      <div className="min-h-screen bg-mist-50">
        <div className="bg-white">
          <SiteHeader signedIn={Boolean(user)} />
        </div>
        <main className="container-page py-14 lg:py-20">
          <div className="mx-auto max-w-xl rounded-2xl border border-coral-200 bg-white p-7 text-center shadow-lift sm:p-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral-50 text-coral-600">
              <AlertCircle className="h-7 w-7" />
            </span>
            <Badge tone="red" className="mt-5">
              Not verified
            </Badge>
            <h1 className="mt-3 font-display text-[28px] font-semibold tracking-tight text-ink-950">
              We could not find that certificate
            </h1>
            <p className="mt-2 text-[12px] leading-6 text-slate-500">
              The code{" "}
              <span className="font-mono font-semibold text-ink-800">
                {normalised}
              </span>{" "}
              is not in our verification records. Check for typos, or ask the
              certificate holder for their verification link.
            </p>
            <form action="/verify" method="get" className="mt-6 flex gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Certificate code</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="code"
                  placeholder="Try another code"
                  className="input h-10 pl-9 font-mono text-[11px] uppercase tracking-wider"
                  required
                />
              </label>
              <button
                type="submit"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                Verify
              </button>
            </form>
            <Link
              href="/verify"
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-ink-900"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to verification
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="bg-white">
        <SiteHeader signedIn={Boolean(user)} />
      </div>

      <section className="relative overflow-hidden border-b border-mist-200 bg-ink-950 text-white">
        <div className="absolute inset-0 bg-grid-dark bg-[size:44px_44px] opacity-30" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-electric-500/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="container-page relative py-10 lg:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Certificate verification
            </Link>
            <Badge tone="green" dot>
              Verified record
            </Badge>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300 text-ink-950">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-lime-300">
                  Authentic BrighterFuture certificate
                </p>
              </div>
              <h1 className="mt-4 font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[44px]">
                This achievement is real.
              </h1>
              <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-400">
                The certificate below is registered to a real learner and a
                completed BrighterFuture course. The record is read-only and
                available to anyone with the verification code.
              </p>

              <div className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.04] py-3">
                {[
                  [certificate.user_name ?? "Learner", "Learner"],
                  [String(certificate.course_level ?? "Course"), "Level"],
                  [
                    `${certificate.duration_hours ?? 0}h`,
                    "Course length",
                  ],
                ].map(([value, label]) => (
                  <div key={label} className="px-3 text-center">
                    <p className="truncate font-display text-[13px] font-semibold text-white">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[8.5px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses"
                  className={buttonStyles({ variant: "accent", size: "md" })}
                >
                  Explore the courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                  <LockKeyhole className="h-3 w-3 text-emerald-400" />
                  Immutable verification record
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0b1f36] via-[#102d4c] to-[#183f63] p-6 shadow-lift sm:p-7">
                <div className="absolute inset-0 bg-grid-dark bg-[size:24px_24px] opacity-30" />
                <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-lime-300/10 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <Logo theme="dark" href="/" />
                    <Award className="h-7 w-7 text-lime-300" />
                  </div>

                  <p className="mt-7 font-mono text-[8.5px] uppercase tracking-[0.18em] text-slate-500">
                    Certificate of completion
                  </p>
                  <p className="mt-2 font-display text-[24px] font-semibold leading-tight tracking-tight text-white">
                    {certificate.user_name}
                  </p>
                  <p className="mt-3 text-[10px] leading-5 text-slate-400">
                    has successfully completed all lessons and assessments in
                  </p>
                  <p className="mt-1 font-display text-[17px] font-semibold leading-snug text-lime-300">
                    {certificate.course_title}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[7.5px] uppercase tracking-wider text-slate-500">
                        Certificate code
                      </p>
                      <p className="mt-1 font-mono text-[10px] font-bold text-white">
                        {certificate.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7.5px] uppercase tracking-wider text-slate-500">
                        Issued
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-white">
                        {formatDate(certificate.issued_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-300 text-[8px] font-bold text-ink-950">
                        BF
                      </span>
                      <div>
                        <p className="text-[8px] font-bold text-white">
                          BrighterFuture Learning
                        </p>
                        <p className="text-[7px] text-slate-500">
                          Verified digital credential
                        </p>
                      </div>
                    </div>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-lime-300/30 bg-lime-300/10 text-lime-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container-page py-10 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          <section className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
                  Verified details
                </h2>
                <p className="text-[10px] text-slate-400">
                  Read-only information from the original certificate record.
                </p>
              </div>
            </div>
            <dl className="grid gap-px bg-mist-100 sm:grid-cols-2">
              {[
                {
                  label: "Certificate holder",
                  value: certificate.user_name ?? "—",
                  icon: BadgeCheck,
                },
                {
                  label: "Course",
                  value: certificate.course_title ?? "—",
                  icon: BookOpen,
                },
                {
                  label: "Certificate code",
                  value: certificate.code,
                  icon: ShieldCheck,
                  mono: true,
                },
                {
                  label: "Issue date",
                  value: formatDate(certificate.issued_at, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
                  icon: CalendarDays,
                },
                {
                  label: "Course level",
                  value: certificate.course_level ?? "—",
                  icon: Sparkles,
                },
                {
                  label: "Course length",
                  value: `${certificate.duration_hours ?? 0} hours`,
                  icon: Clock3,
                },
              ].map((item) => (
                <div key={item.label} className="bg-white p-5">
                  <dt className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </dt>
                  <dd
                    className={`mt-1.5 text-[13px] font-semibold text-ink-900 ${
                      item.mono ? "font-mono text-[12px]" : ""
                    }`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mist-100 bg-mist-50/60 px-5 py-4 sm:px-6">
              <p className="inline-flex items-center gap-1.5 text-[9.5px] text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Record checked against the BrighterFuture registry
              </p>
              <Link
                href={`/courses/${certificate.course_slug ?? ""}`}
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                View the course
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
              <CourseCover
                cover={certificate.course_cover ?? "ocean"}
                category={certificate.course_level ?? "Course"}
                title={certificate.course_title}
                className="h-[130px] rounded-xl"
              />
              <p className="mt-4 font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] text-electric-600">
                Completed course
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-ink-950">
                {certificate.course_title}
              </h2>
              <p className="mt-1 text-[10.5px] leading-5 text-slate-500">
                {certificate.course_level} · {certificate.duration_hours} hours
                of focused IT learning.
              </p>
              <Link
                href={`/courses/${certificate.course_slug ?? ""}`}
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
              >
                Explore course
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
              <p className="text-[11px] font-bold text-ink-950">
                What this verifies
              </p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "The certificate code exists in our registry.",
                  "The learner completed all required lessons.",
                  "The learner passed every published assessment.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[10px] leading-4 text-slate-500"
                  >
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-mist-200 bg-white p-5 text-[10px] leading-4 text-slate-400 shadow-soft">
              This page is a public verification record. Student email addresses,
              assessment answers, and other private learning data are never
              displayed.
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
