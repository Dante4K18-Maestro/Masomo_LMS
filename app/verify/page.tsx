import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  FileSearch,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCertificateByCode } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verify a certificate",
  description:
    "Verify a BrighterFuture certificate instantly using its unique verification code.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const [{ code }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const normalised = code?.trim().toUpperCase();

  if (normalised) {
    const certificate = getCertificateByCode(normalised);
    if (certificate) redirect(`/verify/${encodeURIComponent(normalised)}`);
  }

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="bg-white">
        <SiteHeader signedIn={Boolean(user)} />
      </div>

      <section className="relative overflow-hidden border-b border-mist-200 bg-white">
        <div className="absolute inset-0 bg-grid-light bg-[size:42px_42px] opacity-70" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-electric-100/60 blur-3xl" />
        <div className="container-page relative py-14 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-950 text-lime-300 shadow-lift">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <p className="eyebrow mt-5 justify-center text-electric-600">
              <BadgeCheck className="h-3.5 w-3.5" />
              Public verification
            </p>
            <h1 className="mt-3 font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink-950 sm:text-[50px]">
              Check the proof,
              <br />
              not just the claim.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500">
              Every BrighterFuture certificate has a unique code. Enter it below
              to confirm the learner, course, and issue date.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <form
              action="/verify"
              method="get"
              className="rounded-2xl border border-mist-200 bg-white p-3 shadow-lift"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Certificate code</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="code"
                    placeholder="e.g. BF-CYBER-8F2K"
                    className="input h-12 pl-10 font-mono text-[13px] uppercase tracking-wider"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className={buttonStyles({
                    variant: "primary",
                    size: "lg",
                    className: "shrink-0",
                  })}
                >
                  Verify certificate
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {normalised && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-[11px] text-amber-900">
                No certificate was found for{" "}
                <span className="font-mono font-bold">{normalised}</span>. Check
                the code and try again, or ask the certificate holder to share
                their verification link.
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole className="h-3 w-3 text-emerald-500" />
                No account needed
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1.5">
                <FileSearch className="h-3 w-3 text-electric-500" />
                Results are read-only
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Updated instantly</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container-page py-12 lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "Issued after completion",
              text: "A learner must finish every lesson and pass every published assessment in the course.",
            },
            {
              icon: ShieldCheck,
              title: "Unique and permanent",
              text: "Each certificate has a permanent verification code tied to one learner and one course.",
            },
            {
              icon: Sparkles,
              title: "Easy to share",
              text: "Share the public verification page with an employer, client, or anyone who needs proof.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric-50 text-electric-600">
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-[17px] font-semibold text-ink-950">
                {item.title}
              </h2>
              <p className="mt-1.5 text-[12px] leading-6 text-slate-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <Badge tone="dark">Demo space</Badge>
            <p className="mt-2 font-display text-xl font-semibold tracking-tight">
              Want to see a live record?
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              Try one of the seeded certificates:{" "}
              <Link
                href="/verify/BF-CYBER-8F2K"
                className="font-mono font-semibold text-lime-300 hover:text-lime-200"
              >
                BF-CYBER-8F2K
              </Link>
              ,{" "}
              <Link
                href="/verify/BF-DATA-4M7Q"
                className="font-mono font-semibold text-lime-300 hover:text-lime-200"
              >
                BF-DATA-4M7Q
              </Link>
              , or{" "}
              <Link
                href="/verify/BF-ML-6R1X"
                className="font-mono font-semibold text-lime-300 hover:text-lime-200"
              >
                BF-ML-6R1X
              </Link>
              .
            </p>
          </div>
          <Link
            href="/courses"
            className={buttonStyles({ variant: "accent", size: "md" })}
          >
            Explore courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-400">
          Certificates are issued by BrighterFuture Learning. Last verified{" "}
          {formatDate(new Date(), {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          .
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
