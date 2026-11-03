import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { getStaffCourses } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { buttonStyles } from "@/components/ui/button";
import { AssessmentCreateForm } from "./assessment-create-form";

export const metadata = {
  title: "New assessment",
};

export default async function NewAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const [user, params] = await Promise.all([requireStaff(), searchParams]);
  const courses = getStaffCourses(user);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/assessments"
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All assessments
      </Link>

      <PageHeader
        eyebrow="Assessment studio"
        title="Create a new checkpoint"
        description="Start with the essentials. You will build and publish the questions once the assessment exists."
      />

      {courses.length > 0 ? (
        <AssessmentCreateForm
          courses={courses.map((course) => ({
            id: course.id,
            title: course.title,
            cover: course.cover,
            status: course.status,
          }))}
          preselectedCourseId={params.courseId}
        />
      ) : (
        <EmptyState
          icon={PlusCircle}
          title="Create a course first"
          description="Assessments belong to a course. Build a course, add a curriculum, then come back to add checkpoints."
          action={
            <Link
              href="/dashboard/courses/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Create a course
            </Link>
          }
          className="bg-white"
        />
      )}
    </div>
  );
}
