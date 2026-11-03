import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { getStaffOptions } from "@/lib/queries";
import { createCourseAction } from "@/lib/actions/courses";
import { PageHeader } from "@/components/page-header";
import { CourseForm } from "@/components/course-form";

export const metadata = {
  title: "New course",
};

export default async function NewCoursePage() {
  const user = await requireStaff();
  const instructors = getStaffOptions().filter(
    (instructor) => user.role === "admin" || instructor.id === user.id,
  );

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/courses"
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Course studio
      </Link>

      <PageHeader
        eyebrow="Course studio"
        title="Build a course worth finishing"
        description="Start with the promise: who it is for, what they will be able to do, and why it matters. You will add the curriculum in the next step."
        action={
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-mist-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-500 shadow-sm">
            <PlusCircle className="h-3.5 w-3.5 text-electric-500" />
            New draft
          </span>
        }
      />

      <CourseForm
        action={createCourseAction}
        mode="create"
        instructors={instructors}
        isAdmin={user.role === "admin"}
      />
    </div>
  );
}
