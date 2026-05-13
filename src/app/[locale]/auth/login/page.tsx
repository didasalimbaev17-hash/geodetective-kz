import { setRequestLocale, getTranslations } from "next-intl/server";
import { LoginForm } from "./LoginForm";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPABASE_CONFIGURED } from "@/lib/env";
import { Info } from "lucide-react";

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
          {!SUPABASE_CONFIGURED && (
            <div className="mb-4 flex items-start gap-2 text-sm bg-warning/10 border border-warning/30 rounded-md p-3">
              <Info className="size-4 mt-0.5 flex-shrink-0 text-warning" />
              <span>
                Demo режим: тіркелу үшін Supabase қосылуы керек. Тікелей{" "}
                <Link
                  href="/student/dashboard"
                  className="text-primary underline"
                >
                  каталогқа өту
                </Link>{" "}
                болады.
              </span>
            </div>
          )}
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
