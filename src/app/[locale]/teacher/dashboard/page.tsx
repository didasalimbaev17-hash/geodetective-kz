import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { getMyClassroomsAction } from "@/server/actions/classrooms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { CreateClassroomForm } from "@/components/teacher/CreateClassroomForm";
import { Users, BookOpen, GraduationCap, ArrowRight, Plus, Sparkles } from "lucide-react";

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

  const classrooms = await getMyClassroomsAction();
  const totalStudents = classrooms.reduce((s, c) => s + c.studentCount, 0);

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
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
        <CreateClassroomForm triggerLabel={t("teacher.createClass")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <Users className="size-5 text-primary mb-2" />
            <div className="text-3xl font-bold font-numeric">{totalStudents}</div>
            <div className="text-sm text-muted-foreground">
              {t("teacher.students")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <BookOpen className="size-5 text-secondary mb-2" />
            <div className="text-3xl font-bold font-numeric">
              {classrooms.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("teacher.classesTitle")}
            </div>
          </CardContent>
        </Card>
        <Card className="opacity-60 cursor-not-allowed border-dashed">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <Plus className="size-5 text-warning" />
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-warning/15 text-warning px-2 py-0.5 rounded-full border border-warning/30">
                <Sparkles className="size-2.5" />
                {locale === "ru" ? "Скоро" : "Жақын арада"}
              </span>
            </div>
            <div className="text-lg font-bold font-display leading-tight mb-1">
              {locale === "ru" ? "Создать кейс" : "Кейс құру"}
            </div>
            <div className="text-xs text-muted-foreground">
              {locale === "ru"
                ? "Конструктор для собственных сценариев"
                : "Өз сценарийлеріңізге арналған конструктор"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("teacher.classesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {classrooms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="size-12 mx-auto mb-3 opacity-30" />
              <p>
                {locale === "ru"
                  ? "У вас ещё нет классов"
                  : "Сізде әлі сыныптар жоқ"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classrooms.map((c) => (
                <Link
                  key={c.id}
                  href={`/teacher/class/${c.id}` as never}
                  className="block group"
                >
                  <Card className="detective-card hover:border-primary/40 transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {c.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            {c.grade && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <GraduationCap className="size-3" />
                                {c.grade === "10"
                                  ? t("auth.grade10")
                                  : t("auth.grade11")}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground font-mono">
                              {c.code}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="size-3.5" />
                        <span>
                          {c.studentCount}{" "}
                          {locale === "ru" ? "учеников" : "оқушы"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
