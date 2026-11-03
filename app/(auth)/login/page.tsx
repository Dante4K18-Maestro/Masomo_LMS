import { LoginForm } from "./login-form";

export const metadata = {
  title: "Log in",
  description: "Log in to your BrighterFuture learning account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={next} />;
}
