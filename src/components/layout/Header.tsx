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
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-border/40" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container relative flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight group"
        >
          <div className="relative">
            <Compass
              className="size-7 text-primary transition-transform group-hover:rotate-180 duration-700"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 blur-md bg-primary/40 -z-10 group-hover:bg-primary/60 transition-colors" />
          </div>
          <span className="gradient-text text-lg">{t("common.appName")}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {user?.role === "student" && (
            <>
              <NavLink href="/student/dashboard" label={t("nav.dashboard")} />
              <NavLink href="/student/profile" label={t("nav.profile")} />
            </>
          )}
          {user?.role === "teacher" && (
            <>
              <NavLink href="/teacher/dashboard" label={t("nav.dashboard")} />
            </>
          )}
          <NavLink href="/about" label={t("nav.about")} />
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="px-3 h-9 rounded-lg border border-border/60 bg-card/40 hover:bg-card/80 backdrop-blur transition-all flex items-center gap-1.5 font-mono text-xs uppercase"
            title={t("common.language")}
          >
            <Languages className="size-3.5" />
            {locale}
          </button>

          {user ? (
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link
                href={
                  user.role === "teacher"
                    ? "/teacher/dashboard"
                    : "/student/dashboard"
                }
              >
                <div className="relative">
                  <UserCircle className="size-5 text-primary" />
                  <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success ring-2 ring-background" />
                </div>
                <span className="hidden sm:inline text-sm">
                  {user.email.split("@")[0]}
                </span>
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="gap-1.5 shadow-glow-primary">
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

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href as never}
      className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
    >
      {label}
    </Link>
  );
}

export function HeaderSpacer({ className }: { className?: string }) {
  return <div className={cn("h-16", className)} />;
}
