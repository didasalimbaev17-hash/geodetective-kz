"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  getAvailableStudentsAction,
  addStudentToClassroomAction,
  type StudentRow,
} from "@/server/actions/classrooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, User, Search } from "lucide-react";

export function AddStudentDialog({
  classroomId,
  grade,
  triggerLabel,
}: {
  classroomId: string;
  grade: "10" | "11" | null;
  triggerLabel: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getAvailableStudentsAction(classroomId, grade)
      .then((rows) => setStudents(rows))
      .finally(() => setLoading(false));
  }, [open, classroomId, grade]);

  const filtered = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.email.toLowerCase().includes(q) ||
      (s.fullName ?? "").toLowerCase().includes(q)
    );
  });

  function handleAdd(studentId: string) {
    setAddingId(studentId);
    startTransition(async () => {
      const res = await addStudentToClassroomAction({
        classroomId,
        studentId,
      });
      setAddingId(null);
      if (!res.ok) return;
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      router.refresh();
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="gap-2">
        <Plus className="size-4" />
        {triggerLabel}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <Card
            className="detective-card max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">
                  {locale === "ru" ? "Добавить ученика" : "Оқушы қосу"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    locale === "ru" ? "Поиск по имени/email" : "Аты/email бойынша іздеу"
                  }
                  className="pl-9"
                />
              </div>

              <div className="overflow-y-auto -mx-2 px-2 max-h-[50vh]">
                {loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin mx-auto mb-2" />
                    {locale === "ru" ? "Загрузка..." : "Жүктелуде..."}
                  </div>
                )}

                {!loading && filtered.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    {grade
                      ? locale === "ru"
                        ? `Нет доступных учеников ${grade} класса`
                        : `${grade} сыныптың қол жетімді оқушылары жоқ`
                      : locale === "ru"
                        ? "Нет доступных учеников"
                        : "Қол жетімді оқушылар жоқ"}
                  </div>
                )}

                <div className="space-y-2">
                  {filtered.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 hover:border-border bg-card/40"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate flex items-center gap-2">
                          <User className="size-3.5 text-muted-foreground flex-shrink-0" />
                          {s.fullName ?? s.email.split("@")[0]}
                          {s.grade && (
                            <Badge variant="outline" className="text-xs">
                              {s.grade}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {s.email}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAdd(s.id)}
                        disabled={pending && addingId === s.id}
                        className="gap-1"
                      >
                        {pending && addingId === s.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Plus className="size-3" />
                        )}
                        {t("common.save")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
