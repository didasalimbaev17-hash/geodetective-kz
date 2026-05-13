"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { signOutAction } from "@/server/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserCircle,
  LayoutDashboard,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";

export function UserMenu({
  user,
}: {
  user: { email: string; role: string; fullName?: string | null };
}) {
  const t = useTranslations();
  const [pending, startTransition] = useTransition();

  const isTeacher = user.role === "teacher";
  const isAdmin = user.role === "admin";

  const dashboardHref = isTeacher
    ? "/teacher/dashboard"
    : "/student/dashboard";

  const fullName = user.fullName || user.email.split("@")[0];
  // Только имя (первое слово) для компактной кнопки в шапке
  const shortName = fullName.split(/\s+/)[0];
  const initial = fullName.charAt(0).toUpperCase();

  function handleLogout() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-border/60 bg-card/40 hover:bg-card/80 backdrop-blur transition-all">
          <div className="relative">
            <div className="size-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xs">
              {initial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success ring-2 ring-background" />
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {shortName}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        {/* User info header */}
        <div className="px-3 py-3 flex items-start gap-3 border-b border-border/60 mb-1">
          <div className="size-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm leading-tight break-words">{fullName}</div>
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {user.email}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
              {isTeacher ? (
                <>
                  <GraduationCap className="size-3" />
                  {t("auth.roleTeacher")}
                </>
              ) : isAdmin ? (
                <>
                  <Sparkles className="size-3" />
                  Admin
                </>
              ) : (
                <>
                  <User className="size-3" />
                  {t("auth.roleStudent")}
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuItem asChild>
          <Link href={dashboardHref as never}>
            <LayoutDashboard className="size-4" />
            {t("nav.dashboard")}
          </Link>
        </DropdownMenuItem>

        {!isTeacher && (
          <DropdownMenuItem asChild>
            <Link href="/student/profile">
              <UserCircle className="size-4" />
              {t("nav.profile")}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem danger onSelect={handleLogout} disabled={pending}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          {t("common.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
