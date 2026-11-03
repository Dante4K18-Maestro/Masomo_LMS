import { cn } from "@/lib/utils";

export function WeeklyActivityChart({
  data,
}: {
  data: { label: string; lessons: number; assessments: number; total: number }[];
}) {
  const max = Math.max(1, ...data.map((item) => item.total));
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500">This week</p>
          <p className="mt-1 font-display text-[26px] font-semibold tracking-[-0.04em] text-ink-950">
            {total}{" "}
            <span className="text-[11px] font-medium tracking-normal text-slate-400">
              activities
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-medium text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-electric-500" />
            Lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-lime-300" />
            Assessments
          </span>
        </div>
      </div>

      <div className="mt-5 flex h-[138px] items-end gap-2 sm:gap-3">
        {data.map((day) => {
          const height = Math.max(6, (day.total / max) * 100);
          return (
            <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-[108px] w-full items-end justify-center">
                <div
                  className="relative flex w-full max-w-[30px] flex-col-reverse overflow-hidden rounded-md bg-mist-100"
                  style={{ height: `${height}%` }}
                  title={`${day.total} activities on ${day.label}`}
                >
                  <div
                    className="bg-electric-500"
                    style={{
                      height: `${
                        day.total === 0 ? 0 : (day.lessons / day.total) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-lime-300"
                    style={{
                      height: `${
                        day.total === 0 ? 0 : (day.assessments / day.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold",
                  day.total > 0 ? "text-slate-500" : "text-slate-300",
                )}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EnrollmentTrendChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="grid h-[170px] place-items-center rounded-xl border border-dashed border-mist-200 text-[11px] text-slate-400">
        Enrollment activity will appear here.
      </div>
    );
  }

  const max = Math.max(1, ...data.map((item) => item.count));

  return (
    <div className="flex h-[170px] items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[9px] font-bold text-slate-500">{item.count}</span>
          <div className="flex h-[110px] w-full items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-electric-600 to-electric-400 transition-all"
              style={{ height: `${Math.max(7, (item.count / max) * 100)}%` }}
              title={`${item.count} enrollments`}
            />
          </div>
          <span className="truncate text-[8.5px] font-medium text-slate-400">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HorizontalMetricBars({
  data,
  color = "electric",
}: {
  data: { label: string; value: number; caption?: string }[];
  color?: "electric" | "lime" | "violet";
}) {
  const max = Math.max(1, ...data.map((item) => item.value));
  const barColor = {
    electric: "bg-electric-500",
    lime: "bg-lime-400",
    violet: "bg-violet-400",
  }[color];

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <p className="truncate text-[11px] font-semibold text-ink-800">
              {item.label}
            </p>
            <span className="shrink-0 text-[10px] font-bold text-slate-500">
              {item.caption ?? item.value}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-mist-100">
            <div
              className={cn("h-full rounded-full", barColor)}
              style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
