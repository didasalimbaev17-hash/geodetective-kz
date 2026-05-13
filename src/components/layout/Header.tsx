"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Compass, Languages, LogIn, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ user }: { user?: { email: string; role: string } | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === "kk" ? "ru" : "kk";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <Compass className="size-6 text-primary" strokeWidth={2} />
          <span className="gradient-text">{t("common.appName")}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {user?.role === "student" && (
            <>
              <Link href="/student/dashboard" className="hover:text-primary transition-colors">
                {t("nav.dashboard")}
              </Link>
              <Link href="/student/profile" className="hover:text-primary transition-colors">
                {t("nav.profile")}
              </Link>
            </>
          )}
          {user?.role === "teacher" && (
            <>
              <Link href="/teacher/dashboard" className="hover:text-primary transition-colors">
                {t("nav.dashboard")}
              </Link>
              <Link href="/teacher/classes" className="hover:text-primary transition-colors">
                {t("nav.classes")}
              </Link>
            </>
          )}
          <Link href="/about" className="hover:text-primary transition-colors">
            {t("nav.about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="gap-1.5 font-mono text-xs uppercase"
            title={t("common.language")}
          >
            <Languages className="size-4" />
            {locale}
          </Button>

          {user ? (
            <Button asChild variant="ghost" size="sm">
              <Link
                href={
                  user.role === "teacher"
                    ? "/teacher/dashboard"
                    : "/student/dashboard"
                }
              >
                <UserCircle className="size-4" />
                <span className="hidden sm:inline">{user.email.split("@")[0]}</span>
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/auth/login">
                <LogIn className="size-4" />
                {t("common.login")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function HeaderSpacer({ className }: { className?: string }) {
  return <div className={cn("h-16", className)} />;
}
