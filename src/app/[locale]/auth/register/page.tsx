import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { RegisterForm } from "./RegisterForm";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserProfile } from "@/server/auth/get-user";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { locale } = await params;
  const { role } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Already logged in → bounce to dashboard
  const user = await getCurrentUserProfile();
  if (user) {
    redirect(user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  }

  const initialRole =
    role === "teacher" ? "teacher" : ("student" as "student" | "teacher");

  return (
    <div className="container max-w-md mx-auto py-20">
      <Card className="detective-card">
        <CardHeader>
          <CardTitle className="text-center">{t("auth.registerTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm initialRole={initialRole} />
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.haveAccount")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              {t("auth.loginLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
