import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Eye,
  FlaskConical,
  Layers3,
  Trash2,
  Video,
} from "lucide-react";
import { requireCourseManager } from "@/lib/access";
import { getLessonById } from "@/lib/queries";
import { deleteLessonAction } from "@/lib/actions/courses";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ConfirmForm } from "@/components/confirm-form";
import { formatDuration } from "@/lib/utils";
import { LessonForm } from "./lesson-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lesson editor",
};

const kindMeta = {
  reading: { label: "Reading", icon: BookOpen },
  video: { label: "Video", icon: Video },
  lab: { label: "Lab", icon: FlaskConical },
} as const;

export default async function LessonEditorPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const { course } = await requireCourseManager(id);
  const lesson = getLessonById(lessonId);

  if (!lesson || lesson.course_id !== course.id) notFound();

  const kind = kindMeta[lesson.kind] ?? kindMeta.reading;
  const KindIcon = kind.icon;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold text-slate-400">
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-1 hover:text-ink-900"
          >
            <ArrowLeft className="h-3 w-3" />
            Courses
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/courses/${course.id}/edit`}
            className="max-w-[220px] truncate hover:text-ink-900"
          >
            {course.title}
          </Link>
          <span>/</span>
          <span className="max-w-[180px] truncate text-slate-600">
            {lesson.module_title}
          </span>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className={buttonStyles({ variant: "ghost", size: "sm" })}
        >
          <Eye className="h-3.5 w-3.5" />
          View course page
        </Link>
      </div>

      <PageHeader
        eyebrow={`${course.category} · ${lesson.module_title}`}
        title={lesson.title}
        description={
          lesson.summary ??
          "Give this lesson a clear summary so students know what they are about to learn."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">
              <KindIcon className="h-3 w-3" />
              {kind.label}
            </Badge>
            <Badge tone="neutral">
              <Clock3 className="h-3 w-3" />
              {formatDuration(lesson.duration_minutes)}
            </Badge>
            <Badge tone="violet">
              <Layers3 className="h-3 w-3" />
              {lesson.module_title}
            </Badge>
          </div>
        }
      />

      <LessonForm
        courseId={course.id}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          summary: lesson.summary,
          content: lesson.content,
          kind: lesson.kind,
          duration_minutes: lesson.duration_minutes,
        }}
      />

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-coral-200 bg-coral-50/60 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coral-800">
            <Trash2 className="h-3.5 w-3.5" />
            Delete this lesson
          </p>
          <p className="mt-1 text-[10px] leading-4 text-coral-700/80">
            This also removes any student completion records for this lesson.
            The course will recalculate progress automatically.
          </p>
        </div>
        <ConfirmForm
          action={deleteLessonAction}
          message={`Delete "${lesson.title}"? Student progress for this lesson will be removed.`}
          className="shrink-0 rounded-lg border border-coral-200 bg-white px-3 py-2"
          hiddenFields={{ lessonId: lesson.id, courseId: course.id }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete lesson
        </ConfirmForm>
      </div>
    </div>
  );
}
