"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  RefreshCcw,
  PlusCircle,
  Shield,
  MapPin,
  Users,
  Zap,
  Music,
  ShoppingBag,
  Clock,
} from "lucide-react";
import {
  purchaseItemAction,
  markPurchaseUsedAction,
  type ShopItemRow,
  type PurchaseWithItem,
} from "@/server/actions/shop";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "refresh-ccw": RefreshCcw,
  "plus-circle": PlusCircle,
  shield: Shield,
  "map-pin": MapPin,
  users: Users,
  zap: Zap,
  music: Music,
};

export function ShopClient({
  items,
  purchases,
  xp,
  locale,
}: {
  items: ShopItemRow[];
  purchases: PurchaseWithItem[];
  xp: number;
  locale: "kk" | "ru";
}) {
  const t = useTranslations("shop");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const activePurchases = purchases.filter((p) => p.purchase.state === "active");
  const usedPurchases = purchases.filter((p) => p.purchase.state === "used");
  const activeItemIds = new Set(activePurchases.map((p) => p.item.id));

  function handleBuy(slug: string) {
    setError(null);
    startTransition(async () => {
      const res = await purchaseItemAction(slug);
      if (!res.ok) {
        const msg =
          res.error === "insufficient_xp"
            ? t("notEnough")
            : res.error === "already_owned"
              ? t("owned")
              : locale === "ru"
                ? "Ошибка покупки"
                : "Сатып алу қатесі";
        setError(msg);
      }
    });
  }

  function handleMarkUsed(purchaseId: string) {
    setError(null);
    startTransition(async () => {
      await markPurchaseUsedAction(purchaseId);
    });
  }

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ru" ? "ru-RU" : "kk-KZ",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  return (
    <div className="space-y-12">
      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Active inventory */}
      {activePurchases.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="size-5 text-success" />
            <h2 className="font-display text-2xl font-bold">
              {t("myInventory")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePurchases.map(({ purchase, item }) => {
              const Icon = ICON_MAP[item.icon] ?? Sparkles;
              const title = locale === "ru" ? item.titleRu : item.titleKk;
              const date = dateFormatter.format(new Date(purchase.purchasedAt));
              return (
                <Card
                  key={purchase.id}
                  className="detective-card bg-gradient-to-br from-success/15 via-success/5 to-transparent border-success/30"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="size-5 text-success" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-sm leading-tight mb-1">
                          {title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          {t("purchasedOn", { date })}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs border-success/40 text-success hover:bg-success/10"
                      disabled={pending}
                      onClick={() => handleMarkUsed(purchase.id)}
                    >
                      <CheckCircle2 className="size-3.5 mr-1.5" />
                      {t("markUsed")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Catalog */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-secondary" />
          <h2 className="font-display text-2xl font-bold">
            {t("rewardsList")}
          </h2>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {locale === "ru"
              ? "Магазин временно пуст. Загрузите данные на проде."
              : "Магазин уақытша бос. Деректерді жүктеу қажет."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? Sparkles;
              const title = locale === "ru" ? item.titleRu : item.titleKk;
              const description =
                locale === "ru" ? item.descriptionRu : item.descriptionKk;
              const owned = activeItemIds.has(item.id);
              const canAfford = xp >= item.cost;
              const disabled = pending || !canAfford || owned;
              return (
                <Card
                  key={item.id}
                  className={`detective-card ${owned ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
                        <Icon
                          className="size-5 text-secondary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-base leading-tight mb-1">
                          {title}
                        </h3>
                        {description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/40">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs gap-1 border-secondary/40"
                      >
                        <Sparkles className="size-3 text-secondary" />
                        {item.cost} XP
                      </Badge>
                      <Button
                        size="sm"
                        variant={owned ? "secondary" : "default"}
                        className="h-8 text-xs"
                        disabled={disabled}
                        onClick={() => handleBuy(item.slug)}
                      >
                        {owned
                          ? t("owned")
                          : !canAfford
                            ? t("notEnough")
                            : t("buy")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* History */}
      {usedPurchases.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="size-5 text-muted-foreground" />
            <h2 className="font-display text-xl font-bold text-muted-foreground">
              {t("history")}
            </h2>
          </div>
          <div className="space-y-2">
            {usedPurchases.slice(0, 10).map(({ purchase, item }) => {
              const title = locale === "ru" ? item.titleRu : item.titleKk;
              const date = dateFormatter.format(new Date(purchase.purchasedAt));
              return (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between px-4 py-2 rounded-lg bg-card/40 border border-border/30 text-sm"
                >
                  <span className="text-muted-foreground line-through">
                    {title}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {date}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
