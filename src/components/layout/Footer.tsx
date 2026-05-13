import { useTranslations } from "next-intl";
import { Compass } from "lucide-react";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/30 mt-20">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-primary" />
          <span className="font-display font-semibold text-foreground">
            {t("common.appName")}
          </span>
          <span>© {year}</span>
        </div>
        <div>{t("landing.footer.madeWith")}</div>
      </div>
    </footer>
  );
}
