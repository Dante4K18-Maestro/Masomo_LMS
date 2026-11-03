import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getCertificatesForUser,
  getStaffStats,
  getStudentStats,
} from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { SettingsForms } from "./settings-forms";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const isStudent = user.role === "student";
  const studentStats = isStudent ? getStudentStats(user.id) : null;
  const staffStats = isStudent ? null : getStaffStats(user);
  const certificates = isStudent ? getCertificatesForUser(user.id) : [];

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "instructor"
        ? "Instructor"
        : "Student";

  const profileFields = [
    Boolean(user.name),
    Boolean(user.headline),
    Boolean(user.bio),
    Boolean(user.avatar_color),
  ];
  const completeness = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  );

  const summary =
    isStudent && studentStats
      ? [
          {
            label: "Enrolled courses",
            value: studentStats.totalCourses,
            icon: BookOpen,
          },
          {
            label: "Certificates",
            value: certificates.length,
            icon: Award,
          },
          {
            label: "Lessons completed",
            value: studentStats.lessonsCompleted,
            icon: Sparkles,
          },
        ]
      : [
          {
            label: user.role === "admin" ? "Courses" : "Your courses",
            value: staffStats?.totalCourses ?? 0,
            icon: BookOpen,
          },
          {
            label: "Students reached",
            value: staffStats?.totalStudents ?? 0,
            icon: Users,
          },
          {
            label: "Assessments",
            value: staffStats?.totalAssessments ?? 0,
            icon: GraduationCap,
          },
        ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your account"
        title="Settings"
        description="Shape how you show up, keep your sign-in secure, and review the details attached to your BrighterFuture account."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <SettingsForms user={user} />

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <section className="relative overflow-hidden rounded-2xl bg-ink-950 p-5 text-white shadow-lift">
            <div className="absolute inset-0 bg-grid-dark bg-[size:32px_32px] opacity-20" />
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-electric-500/25 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <Avatar
                  name={user.name}
                  color={user.avatar_color}
                  size="xl"
                  className="ring-4 ring-white/10"
                />
                <Badge tone="dark">{roleLabel}</Badge>
              </div>
              <h2 className="mt-4 font-display text-[20px] font-semibold leading-tight tracking-tight">
                {user.name}
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {user.headline ?? "Add a headline to introduce yourself."}
              </p>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                <p className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="flex items-center gap-2 text-[11px] text-slate-300">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  Joined {formatDate(user.created_at)}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Profile strength
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-white">
                    {completeness}% complete
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {profileFields.map((filled, index) => (
                    <span
                      key={index}
                      className={
                        filled
                          ? "h-1.5 w-5 rounded-full bg-lime-300"
                          : "h-1.5 w-5 rounded-full bg-white/15"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-[14px] font-semibold text-ink-950">
                Account snapshot
              </h2>
              <StatusBadge status={user.status} />
            </div>
            <div className="mt-4 space-y-3">
              {summary.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mist-50 text-slate-500">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="min-w-0 flex-1 text-[11px] font-medium text-slate-500">
                      {item.label}
                    </p>
                    <p className="font-display text-[17px] font-semibold text-ink-950">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t border-mist-100 pt-4">
              <p className="text-[10px] leading-4 text-slate-400">
                {isStudent
                  ? "Your progress, attempts, and certificates stay attached to this account."
                  : "Course, roster, and assessment ownership stays attached to this account."}
              </p>
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-50 text-lime-700">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h2 className="font-display text-[14px] font-semibold text-ink-950">
                Keep it secure
              </h2>
            </div>
            <ul className="mt-3 space-y-2 text-[10.5px] leading-5 text-slate-500">
              <li>Use a unique password you do not share.</li>
              <li>Sign out on shared or public devices.</li>
              <li>Contact an administrator if you notice unfamiliar activity.</li>
            </ul>
            <Link
              href={isStudent ? "/dashboard/certificates" : "/dashboard/courses"}
              className={buttonStyles({
                variant: "outline",
                size: "sm",
                className: "mt-4 w-full",
              })}
            >
              {isStudent ? "View certificates" : "Open course studio"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
