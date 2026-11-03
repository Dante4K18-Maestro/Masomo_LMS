import Link from "next/link";
import { ArrowLeft, BadgeCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.02fr_0.98fr]">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Logo />
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[12px] font-semibold text-slate-500 transition hover:text-ink-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[430px]">{children}</div>
        </main>

        <footer className="px-5 pb-6 text-[10px] text-slate-400 sm:px-8 lg:px-12">
          © {new Date().getFullYear()} BrighterFuture Learning ·{" "}
          <Link href="/courses" className="hover:text-ink-800">
            Courses
          </Link>{" "}
          ·{" "}
          <a href="mailto:hello@brighterfuture.dev" className="hover:text-ink-800">
            Support
          </a>
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div className="absolute inset-0 bg-grid-dark bg-[size:46px_46px] opacity-30" />
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-electric-500/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-lime-300/10 blur-[90px]" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-lime-300" />
            <span className="text-[10px] font-semibold tracking-wide text-slate-200">
              Build skills that compound
            </span>
          </div>

          <div className="max-w-lg">
            <div className="mb-8 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-lime-300"
                  aria-hidden="true"
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              ))}
            </div>
            <blockquote className="font-display text-[30px] font-medium leading-[1.18] tracking-[-0.03em] text-white xl:text-[38px]">
              “The practical work changed how I think. I stopped collecting
              tutorials and started building things I could explain.”
            </blockquote>
            <div className="mt-7 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-200 text-xs font-bold text-lime-950">
                MC
              </span>
              <div>
                <p className="text-[12px] font-bold text-white">Maya Chen</p>
                <p className="text-[10px] text-slate-400">
                  Full-stack learner · Career switcher
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    This week
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-white">
                    Keep your momentum
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-300 text-ink-950">
                  <BadgeCheck className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["4", "lessons"],
                  ["1", "assessment"],
                  ["90%", "score"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-white/[0.06] p-3">
                    <p className="font-display text-lg font-semibold text-lime-300">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            A learning platform built for the technically curious.
          </p>
        </div>
      </aside>
    </div>
  );
}
