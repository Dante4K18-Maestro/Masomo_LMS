import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/logo";

const footerLinks = [
  {
    title: "Learn",
    links: [
      { label: "All courses", href: "/courses" },
      { label: "Web development", href: "/courses?category=Web+Development" },
      { label: "Data & AI", href: "/courses?category=Data+%26+AI" },
      { label: "Cybersecurity", href: "/courses?category=Cybersecurity" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Career paths", href: "/#paths" },
      { label: "Verify a certificate", href: "/verify" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our approach", href: "/#approach" },
      { label: "Learner stories", href: "/#stories" },
      { label: "FAQs", href: "/#faq" },
      { label: "Contact", href: "mailto:hello@brighterfuture.dev" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-slate-400">
      <div className="absolute inset-0 bg-grid-dark bg-[size:44px_44px] opacity-30" />
      <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-electric-500/10 blur-3xl" />
      <div className="container-page relative py-14 lg:py-18">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo theme="dark" />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-400">
              Practical technology education for people building what comes
              next. Learn deeply, build visibly, and move with confidence.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="focus-ring group inline-flex items-center gap-1 rounded text-[13px] transition hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BrighterFuture Learning. Built for the curious.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
              All systems operational
            </span>
            <a href="mailto:hello@brighterfuture.dev" className="hover:text-white">
              hello@brighterfuture.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
