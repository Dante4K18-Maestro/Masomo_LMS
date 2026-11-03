import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LibraryBig,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getCertificatesForUser,
  getMyEnrollments,
  getStudentStats,
} from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My learning",
};

export default async function LearningPage() {
  const user = await requireUser();
  if (user.role !== "student") redirect("/dashboard/courses");

  const [enrollments, stats, certificates] = await Promise.all([
    getMyEnrollments(user.id),
    getStudentStats(user.id),
    getCertificatesForUser(user.id),
  ]);

  const inProgress = enrollments.filter((enrollment) => enrollment.progress < 100);
  const completed = enrollments.filter((enrollment) => enrollment.progress === 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My learning"
        title="Every course, one clear view"
        description="Pick up where you left off, revisit a completed course, or check what's next on your path."
        action={
          <Link
            href="/courses"
            className={buttonStyles({ variant: "outline", size: "md" })}
          >
            <BookOpen className="h-4 w-4" />
            Browse catalog
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Enrolled"
          value={stats.totalCourses}
          icon={LibraryBig}
          tone="blue"
        />
        <StatCard
          label="In progress"
          value={inProgress.length}
          icon={TrendingUp}
          tone="lime"
          hint="Keep the loop moving"
        />
        <StatCard
          label="Completed"
          value={stats.completedCourses}
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          label="Certificates"
          value={certificates.length}
          icon={GraduationCap}
          tone="amber"
          hint="Verified proof"
        />
      </div>

      {inProgress.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
                Continue learning
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {inProgress.length} course{inProgress.length === 1 ? "" : "s"} in
                motion.
              </p>
            </div>
            <Badge tone="green" dot>
              Momentum
            </Badge>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {inProgress.map((enrollment) => (
              <CourseCard
                key={enrollment.id}
                course={enrollment.course}
                href={`/dashboard/learning/${enrollment.course.slug}`}
                showProgress
                progress={enrollment.progress}
                enrolled
                actionLabel="Continue"
              />
            ))}
          </div>
        </section>
      )}

      {enrollments.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="You haven't enrolled in a course yet"
          description="Choose an IT path and start with a single lesson. Your progress will be saved automatically."
          action={
            <Link href="/courses" className={buttonStyles({ variant: "electric" })}>
              Explore the catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="bg-white"
        />
      )}

      {completed.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
                Completed courses
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Review the work, or make sure your certificate is issued.
              </p>
            </div>
            <Link
              href="/dashboard/certificates"
              className="text-[10px] font-bold text-electric-600 hover:text-electric-700"
            >
              Certificates
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {completed.map((enrollment) => (
              <CourseCard
                key={enrollment.id}
                course={enrollment.course}
                href={`/dashboard/learning/${enrollment.course.slug}`}
                showProgress
                progress={100}
                enrolled
                actionLabel="Review"
              />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime-50 text-lime-700">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink-950">
                A certificate is closer than you think.
              </p>
              <p className="mt-0.5 max-w-xl text-[11px] leading-5 text-slate-500">
                Complete every lesson and pass each published assessment in a
                course. Your certificate gets a unique public verification code.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/certificates"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            How it works
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
