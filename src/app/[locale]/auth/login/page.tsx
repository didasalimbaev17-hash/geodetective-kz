import { setRequestLocale, getTranslations } from "next-intl/server";
import { LoginForm } from "./LoginForm";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="container max-w-md mx-auto py-20">
      <Card className="detective-card">
        <CardHeader>
          <CardTitle className="text-center">{t("auth.loginTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.noAccount")}{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline font-medium"
            >
              {t("auth.registerLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
