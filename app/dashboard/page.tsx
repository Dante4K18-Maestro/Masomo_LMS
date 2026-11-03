import { requireUser } from "@/lib/auth";
import { StudentOverview } from "@/components/dashboard/student-overview";
import { StaffOverview } from "@/components/dashboard/staff-overview";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);

  if (user.role === "student") {
    return <StudentOverview welcome={params.welcome === "1"} />;
  }
  return <StaffOverview />;
}
