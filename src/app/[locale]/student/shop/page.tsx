import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { getShopItemsAction, getMyPurchasesAction } from "@/server/actions/shop";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ShopClient } from "./ShopClient";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const user = await getCurrentUserProfile();
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!user && isSupabaseConfigured) redirect("/auth/login");

  const items = await getShopItemsAction();
  const purchases = user ? await getMyPurchasesAction() : [];

  const xp = user?.xp ?? 0;
  const capReached = xp >= 100;

  return (
    <div className="container py-10 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <Link
        href="/student/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {locale === "ru" ? "Кабинет" : "Кабинетке"}
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 font-mono text-xs">
          {locale === "ru" ? "Награды" : "Сыйлықтар"}
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 text-balance leading-tight">
          <span className="gradient-text">{t("shop.title")}</span>
        </h1>
        <p className="text-muted-foreground text-lg font-serif italic">
          {t("shop.subtitle")}
        </p>
      </div>

      {/* Balance card */}
      <Card className="detective-card bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent border-secondary/30 mb-10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-card/60 backdrop-blur flex items-center justify-center shadow-glow-secondary">
                <Sparkles className="size-6 text-secondary" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("shop.balance")}
                </div>
                <div className="text-4xl font-display font-bold font-numeric text-foreground">
                  {xp}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
          </div>
          <Progress value={xp} className="h-2" />
          {capReached && (
            <p className="mt-3 text-xs text-warning font-mono">
              {t("shop.capReached")}
            </p>
          )}
        </CardContent>
      </Card>

      <ShopClient
        items={items}
        purchases={purchases}
        xp={xp}
        locale={locale === "ru" ? "ru" : "kk"}
      />
    </div>
  );
}
