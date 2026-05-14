import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import {
  getClassroomDetailsAction,
  getClassroomCaseProgressAction,
} from "@/server/actions/classrooms";
import { getAllScenarios, getScenarioMeta } from "@/data/cases";
import { getLocalizedText } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";
import { AddStudentDialog } from "@/components/teacher/AddStudentDialog";
import { RemoveStudentButton } from "@/components/teacher/RemoveStudentButton";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  User,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");
  if (user.role !== "teacher" && user.role !== "admin") {
    redirect("/student/dashboard");
  }

  const room = await getClassroomDetailsAction(id);
  if (!room) notFound();

  const allScenarios = getAllScenarios().map(getScenarioMeta);
  const classScenarios = room.grade
    ? allScenarios.filter((s) => s.grade === room.grade)
    : allScenarios;

  const progress = await getClassroomCaseProgressAction(id);
  const progressMap = new Map(progress.map((p) => [p.scenarioSlug, p.completedBy]));

  const removeConfirm =
    locale === "ru"
      ? "Убрать ученика из класса?"
      : "Оқушыны сыныптан шығарасыз ба?";

  return (
    <div className="container py-10">
      <Link
        href="/teacher/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        {t("teacher.classesTitle")}
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">{room.name}</span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            {room.grade && (
              <Badge variant="outline" className="gap-1">
                <GraduationCap className="size-3" />
                {room.grade === "10"
                  ? t("auth.grade10")
                  : t("auth.grade11")}
              </Badge>
            )}
            <Badge variant="outline" className="font-mono">
              {room.code}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="size-3.5" />
              {room.students.length}{" "}
              {locale === "ru" ? "учеников" : "оқушы"}
            </span>
          </div>
        </div>
        <AddStudentDialog
          classroomId={room.id}
          grade={room.grade}
          triggerLabel={locale === "ru" ? "Добавить ученика" : "Оқушы қосу"}
        />
      </div>

      {/* Students */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {locale === "ru" ? "Ученики класса" : "Сынып оқушылары"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {room.students.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <User className="size-10 mx-auto mb-2 opacity-30" />
              {locale === "ru"
                ? "В классе пока нет учеников. Нажмите «Добавить ученика»."
                : "Сыныпта оқушылар әлі жоқ. «Оқушы қосу» батырмасын басыңыз."}
            </div>
          ) : (
            <div className="space-y-2">
              {room.students.map((s) => {
                const totalForClass = classScenarios.length;
                const ratio =
                  totalForClass === 0
                    ? 0
                    : Math.round((s.completedCount / totalForClass) * 100);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 bg-card/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {s.fullName ?? s.email.split("@")[0]}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {s.email}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                      <Sparkles className="size-3.5 text-primary" />
                      <span className="font-mono">{s.xp} XP</span>
                    </div>
                    <div className="w-32 flex-shrink-0">
                      <div className="text-xs text-muted-foreground mb-1">
                        {s.completedCount}/{totalForClass}{" "}
                        {locale === "ru" ? "кейсов" : "кейс"}
                      </div>
                      <Progress value={ratio} className="h-1" />
                    </div>
                    <RemoveStudentButton
                      classroomId={room.id}
                      studentId={s.id}
                      confirmMessage={removeConfirm}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cases */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ru" ? "Кейсы класса" : "Сынып кейстері"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classScenarios.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {locale === "ru"
                ? "Для этого класса нет кейсов."
                : "Бұл сыныпқа арналған кейстер жоқ."}
            </div>
          ) : (
            <div className="space-y-3">
              {classScenarios.map((s) => {
                const completedBy = progressMap.get(s.id) ?? 0;
                const totalStudents = room.students.length;
                const ratio =
                  totalStudents === 0
                    ? 0
                    : Math.round((completedBy / totalStudents) * 100);
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/60"
                  >
                    <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">
                        {getLocalizedText(s.title, locale)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {completedBy}/{totalStudents}{" "}
                        {locale === "ru" ? "прошли" : "өтті"}
                      </div>
                    </div>
                    <div className="w-32 flex-shrink-0">
                      <Progress value={ratio} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
