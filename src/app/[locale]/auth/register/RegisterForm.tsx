"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { signUpAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function RegisterForm({
  initialRole,
}: {
  initialRole: "student" | "teacher";
}) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "teacher">(initialRole);
  const [grade, setGrade] = useState<"10" | "11">("10");

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    formData.set("role", role);
    if (role === "student") formData.set("grade", grade);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (!result.ok) {
        const translated = t(`auth.errors.${result.errorCode}` as never);
        setError(result.errorDetail ? `${translated} (${result.errorDetail})` : translated);
      } else if (result.needsEmailConfirm) {
        setSuccess(t("auth.checkEmail"));
      } else {
        const target = role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
        router.push(target);
        router.refresh();
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>{t("auth.chooseRole")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {(["student", "teacher"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                role === r
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-border/80 text-muted-foreground"
              )}
            >
              {r === "student" ? (
                <User className="size-6" />
              ) : (
                <GraduationCap className="size-6" />
              )}
              <span className="text-sm font-medium">
                {r === "student" ? t("auth.roleStudent") : t("auth.roleTeacher")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {role === "student" && (
        <div className="space-y-2">
          <Label>{t("auth.chooseGrade")}</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["10", "11"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={cn(
                  "py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                  grade === g
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-border/80 text-muted-foreground"
                )}
              >
                {g === "10" ? t("auth.grade10") : t("auth.grade11")}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">{t("common.fullName")}</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("common.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("common.password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md p-3">
          <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-md p-3">
          <CheckCircle className="size-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("common.register")}
      </Button>
    </form>
  );
}
