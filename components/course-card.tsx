import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Play,
  Users,
} from "lucide-react";
import type { Course } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { CourseCover } from "@/components/course-cover";

export function CourseCard({
  course,
  href,
  className,
  showProgress,
  progress,
  enrolled,
  actionLabel,
}: {
  course: Course;
  href: string;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  enrolled?: boolean;
  actionLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-mist-300 hover:shadow-lift focus-ring",
        className,
      )}
    >
      <div className="relative">
        <CourseCover
          cover={course.cover}
          category={course.category}
          title={course.title}
          className="h-[172px]"
        />
        <div className="absolute right-4 top-4">
          <Badge tone="dark" className="border-white/15 bg-black/25 backdrop-blur">
            {course.level}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span>{course.category}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.lesson_count} lessons
          </span>
        </div>

        <h3 className="font-display text-[19px] font-semibold leading-snug tracking-[-0.025em] text-ink-900 transition-colors group-hover:text-electric-600">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
          {course.subtitle}
        </p>

        {showProgress ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">
                {progress === 100 ? "Course complete" : "Your progress"}
              </span>
              <span className="text-ink-800">{progress ?? 0}%</span>
            </div>
            <ProgressBar
              value={progress ?? 0}
              barClassName={progress === 100 ? "bg-emerald-500" : undefined}
            />
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" />
              {course.duration_hours}h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {course.student_count ?? 0} learners
            </span>
            <span className="ml-auto text-electric-600">{course.level}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-mist-100 pt-4">
          <span className="flex items-center gap-2">
            <span
              className="grid h-6 w-6 place-items-center rounded-full bg-mist-100 text-[8px] font-bold uppercase text-slate-600"
              aria-hidden="true"
            >
              {course.instructor_name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {course.instructor_name}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-900">
            {enrolled ? (
              <>
                <Play className="h-3 w-3 fill-current" />
                {actionLabel ?? "Continue"}
              </>
            ) : (
              <>
                {actionLabel ?? "View course"}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CourseListRow({ course }: { course: Course }) {
  return (
    <div className="flex items-center gap-4">
      <CourseCover
        cover={course.cover}
        category={course.category}
        className="h-12 w-12 shrink-0 rounded-xl"
        compact
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink-900">
          {course.title}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {course.category} · {formatDuration(course.duration_hours * 60)}
        </p>
      </div>
    </div>
  );
}
