import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Plus, Users, FileCheck2, GraduationCap, BookOpen } from "lucide-react";

export default async function TeacherDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");
  if (user.role !== "teacher" && user.role !== "admin") {
    redirect("/student/dashboard");
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">
            <span className="gradient-text">
              {user.fullName ?? user.email.split("@")[0]}
            </span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <GraduationCap className="size-4 text-secondary" />
            {t("auth.roleTeacher")}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          {t("teacher.createClass")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <Users className="size-5 text-primary mb-2" />
            <div className="text-3xl font-bold font-numeric">0</div>
            <div className="text-sm text-muted-foreground">
              {t("teacher.students")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <BookOpen className="size-5 text-secondary mb-2" />
            <div className="text-3xl font-bold font-numeric">0</div>
            <div className="text-sm text-muted-foreground">
              {t("teacher.classesTitle")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <FileCheck2 className="size-5 text-warning mb-2" />
            <div className="text-3xl font-bold font-numeric">0</div>
            <div className="text-sm text-muted-foreground">
              {t("teacher.pendingReviews")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("teacher.classesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="size-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">Сізде әлі сыныптар жоқ</p>
            <Button variant="outline" className="gap-2">
              <Plus className="size-4" />
              {t("teacher.createClass")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Card className="detective-card">
          <CardHeader>
            <CardTitle className="text-lg">Кейстер каталогы</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Барлық қолжетімді кейстерді қараңыз және сыныпқа тағайындаңыз.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/student/dashboard">Кейстерді көру</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="detective-card">
          <CardHeader>
            <CardTitle className="text-lg">Жаңа кейс</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Өз кейсіңізді конструктор арқылы жасаңыз. Жақында қолжетімді
              болады.
            </p>
            <Button variant="outline" className="w-full" disabled>
              <Badge variant="outline" className="text-xs">
                Жақында
              </Badge>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
