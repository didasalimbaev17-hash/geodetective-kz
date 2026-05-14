"use client";

import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type CaseSlug =
  | "case-aral-2025"
  | "case-balkhash-2025"
  | "case-almaty-smog-2025"
  | "case-semey-2025"
  | "case-caspian-2025"
  | "case-irtysh-2025";

export function CaseCover({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const locale = useLocale();
  const lang: "kk" | "ru" = locale === "ru" ? "ru" : "kk";
  const Comp = COVERS[slug as CaseSlug] ?? FallbackCover;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Comp lang={lang} />
    </div>
  );
}

type CoverProps = { lang: "kk" | "ru" };

const IRTYSH_CITIES = {
  kk: { ust: "Өскемен", semey: "Семей", pavlodar: "Павлодар", omsk: "Омбы" },
  ru: { ust: "Усть-Каменогорск", semey: "Семей", pavlodar: "Павлодар", omsk: "Омск" },
} as const;

const IRTYSH_COUNTRIES = {
  kk: { china: "ҚХР", kazakhstan: "ҚАЗАҚСТАН", russia: "РЕСЕЙ" },
  ru: { china: "КНР", kazakhstan: "КАЗАХСТАН", russia: "РОССИЯ" },
} as const;

// Все SVG: viewBox 800×500. Композиция: главные объекты в центре по вертикали (y=200..400),
// декоративные элементы — фон / по краям. Текстовые метки удалены — заголовок есть на карточке.

// ============================================================
// 1. ARAL — корабль на пустынном дне
// ============================================================
function AralCover(_props: CoverProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aral-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1d2e" />
          <stop offset="60%" stopColor="#3d2818" />
          <stop offset="100%" stopColor="#7a4a25" />
        </linearGradient>
        <linearGradient id="aral-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a30" />
          <stop offset="100%" stopColor="#3d2818" />
        </linearGradient>
        <radialGradient id="aral-sun" cx="0.7" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#ffb84a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffb84a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="url(#aral-sky)" />
      <rect width="800" height="500" fill="url(#aral-sun)" />

      {/* Sun */}
      <circle cx="600" cy="180" r="42" fill="#ffd27a" opacity="0.9" />

      {/* Distant water remnant */}
      <ellipse cx="650" cy="330" rx="190" ry="20" fill="#2a5a78" opacity="0.7" />
      <ellipse cx="650" cy="328" rx="170" ry="14" fill="#3da9c9" opacity="0.6" />

      {/* Sand / dry seabed */}
      <path d="M 0 320 L 800 320 L 800 500 L 0 500 Z" fill="url(#aral-sand)" />

      {/* Cracked earth */}
      <g stroke="#4a2f1a" strokeWidth="1" opacity="0.5" fill="none">
        <path d="M 30 380 L 130 360 L 200 390 M 220 410 L 320 400 L 380 430" />
        <path d="M 400 400 L 500 380 L 580 405 M 30 460 L 160 450 L 240 470" />
        <path d="M 560 450 L 660 435 L 740 460 M 280 480 L 400 470 L 480 490" />
      </g>

      {/* Salt patches */}
      <ellipse cx="200" cy="395" rx="65" ry="6" fill="#e8e0c8" opacity="0.6" />
      <ellipse cx="420" cy="430" rx="50" ry="6" fill="#e8e0c8" opacity="0.5" />
      <ellipse cx="600" cy="465" rx="70" ry="8" fill="#e8e0c8" opacity="0.5" />

      {/* Rusted ship — main subject, large, centered */}
      <g transform="translate(370, 230)">
        {/* Hull */}
        <path
          d="M 0 100 L 25 60 L 230 60 L 255 100 L 230 140 L 25 140 Z"
          fill="#5a3020"
          stroke="#3a1f10"
          strokeWidth="2"
        />
        {/* Deck */}
        <rect x="75" y="25" width="100" height="35" fill="#6a4030" stroke="#3a1f10" />
        {/* Cabin */}
        <rect x="100" y="0" width="50" height="25" fill="#7a5040" stroke="#3a1f10" />
        {/* Window */}
        <rect x="115" y="8" width="20" height="10" fill="#4a3020" />
        {/* Mast */}
        <line x1="125" y1="0" x2="125" y2="-40" stroke="#3a1f10" strokeWidth="3" />
        <line x1="125" y1="-20" x2="160" y2="-10" stroke="#3a1f10" strokeWidth="1.5" />
        {/* Rust streaks */}
        <path d="M 40 70 L 45 130 M 70 65 L 75 135 M 180 65 L 185 130 M 215 70 L 220 130" stroke="#8a4020" strokeWidth="1.5" opacity="0.7" />
        {/* Anchor chain */}
        <path d="M 0 130 L -40 200" stroke="#3a1f10" strokeWidth="2" strokeDasharray="3 2" />
        {/* Shadow */}
        <ellipse cx="125" cy="148" rx="155" ry="8" fill="#000" opacity="0.5" />
      </g>

      {/* Bird silhouette */}
      <path d="M 100 130 Q 110 122 120 130 Q 130 122 140 130" stroke="#1a1d2e" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
}

// ============================================================
// 2. BALKHASH — два цвета озера в горах
// ============================================================
function BalkhashCover(_props: CoverProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1830" />
          <stop offset="100%" stopColor="#2a4a70" />
        </linearGradient>
        <linearGradient id="bh-water-fresh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5cc8e3" />
          <stop offset="100%" stopColor="#1a4a68" />
        </linearGradient>
        <linearGradient id="bh-water-salt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d8b0" />
          <stop offset="100%" stopColor="#5a6a55" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#bh-sky)" />

      {/* Stars */}
      <g fill="#ffffff" opacity="0.6">
        <circle cx="80" cy="50" r="1" />
        <circle cx="200" cy="80" r="0.8" />
        <circle cx="350" cy="40" r="1.2" />
        <circle cx="550" cy="70" r="1" />
        <circle cx="700" cy="50" r="0.8" />
        <circle cx="450" cy="100" r="0.8" />
      </g>

      {/* Distant mountains range */}
      <path d="M 0 260 L 100 180 L 180 220 L 280 130 L 380 200 L 480 150 L 580 200 L 680 160 L 800 200 L 800 320 L 0 320 Z" fill="#1a2540" />
      <path d="M 0 260 L 100 180 L 180 220 L 280 130 L 380 200 L 480 150 L 580 200 L 680 160 L 800 200" stroke="#3a4560" strokeWidth="1" fill="none" opacity="0.6" />

      {/* Snow caps */}
      <path d="M 80 195 L 100 180 L 120 195 Z M 260 145 L 280 130 L 300 145 Z M 460 165 L 480 150 L 500 165 Z M 660 175 L 680 160 L 700 175 Z" fill="#e8e8f0" opacity="0.85" />

      {/* Foreground hills */}
      <path d="M 0 320 L 200 280 L 400 310 L 600 285 L 800 315 L 800 360 L 0 360 Z" fill="#0f1828" />

      {/* Lake — two halves, large center */}
      <g>
        {/* Fresh (west) — bright cyan */}
        <ellipse cx="280" cy="400" rx="280" ry="60" fill="url(#bh-water-fresh)" />
        {/* Salt (east) — pale grey-green */}
        <ellipse cx="600" cy="400" rx="220" ry="55" fill="url(#bh-water-salt)" />
        {/* Divider — dashed amber line */}
        <line x1="445" y1="350" x2="445" y2="450" stroke="#E8A93C" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
        {/* Glow on divider */}
        <line x1="445" y1="350" x2="445" y2="450" stroke="#E8A93C" strokeWidth="6" opacity="0.15" />
      </g>

      {/* Ripples on fresh side */}
      <g stroke="#a0d8e8" strokeWidth="1" fill="none" opacity="0.6">
        <path d="M 100 410 Q 130 405 160 410 T 220 410" />
        <path d="M 180 430 Q 210 425 240 430 T 300 430" />
        <path d="M 320 420 Q 350 415 380 420 T 410 420" />
      </g>

      {/* Ripples on salt side (less, more crusty) */}
      <g stroke="#e8e0c8" strokeWidth="0.8" fill="none" opacity="0.4" strokeDasharray="2 2">
        <path d="M 500 410 Q 530 405 560 410 T 620 410" />
        <path d="M 600 430 Q 630 425 660 430 T 720 430" />
      </g>

      {/* Reflection on water */}
      <path d="M 0 360 L 200 380 L 400 370 L 600 380 L 800 365 L 800 460 L 0 460 Z" fill="#0a1428" opacity="0.4" />
    </svg>
  );
}

// ============================================================
// 3. ALMATY SMOG — горы за смогом, город, ТЭЦ
// ============================================================
function AlmatyCover(_props: CoverProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1820" />
          <stop offset="50%" stopColor="#5a4030" />
          <stop offset="100%" stopColor="#a87858" />
        </linearGradient>
        <linearGradient id="al-smog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a6855" stopOpacity="0" />
          <stop offset="60%" stopColor="#5a4838" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3a2d22" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#al-sky)" />

      {/* Sun in smog */}
      <circle cx="600" cy="200" r="40" fill="#ffaa55" opacity="0.7" />

      {/* Mountains (Iile-Alatau) — большие, по центру */}
      <path d="M 0 250 L 100 170 L 180 210 L 280 130 L 400 190 L 520 140 L 640 200 L 760 160 L 800 180 L 800 350 L 0 350 Z" fill="#252030" opacity="0.8" />
      {/* Snow caps */}
      <path d="M 260 145 L 280 130 L 300 145 Z M 500 155 L 520 140 L 540 155 Z M 740 175 L 760 160 L 780 175 Z M 80 185 L 100 170 L 120 185 Z" fill="#e0d8e0" opacity="0.7" />

      {/* Smog layer (inversion) */}
      <rect x="0" y="200" width="800" height="200" fill="url(#al-smog)" />

      {/* City silhouette — central */}
      <g fill="#1a1620">
        <rect x="80" y="350" width="40" height="80" />
        <rect x="130" y="320" width="50" height="110" />
        <rect x="190" y="340" width="35" height="90" />
        <rect x="235" y="300" width="55" height="130" />
        <rect x="300" y="325" width="40" height="105" />
        <rect x="350" y="310" width="60" height="120" />
        <rect x="420" y="335" width="45" height="95" />
        <rect x="475" y="295" width="55" height="135" />
        <rect x="540" y="320" width="40" height="110" />
        <rect x="590" y="340" width="50" height="90" />
        <rect x="650" y="315" width="55" height="115" />
      </g>

      {/* Window lights */}
      <g fill="#ffd27a" opacity="0.85">
        <rect x="90" y="365" width="3" height="3" />
        <rect x="105" y="380" width="3" height="3" />
        <rect x="145" y="335" width="3" height="3" />
        <rect x="155" y="355" width="3" height="3" />
        <rect x="250" y="315" width="3" height="3" />
        <rect x="270" y="335" width="3" height="3" />
        <rect x="365" y="325" width="3" height="3" />
        <rect x="395" y="350" width="3" height="3" />
        <rect x="495" y="310" width="3" height="3" />
        <rect x="515" y="335" width="3" height="3" />
        <rect x="670" y="330" width="3" height="3" />
      </g>

      {/* CHP smoke stacks — на правой стороне */}
      <g>
        <rect x="730" y="270" width="6" height="80" fill="#1a1620" />
        <rect x="745" y="250" width="6" height="100" fill="#1a1620" />
        <rect x="760" y="265" width="6" height="85" fill="#1a1620" />
        {/* Smoke clouds rising */}
        <ellipse cx="733" cy="255" rx="20" ry="15" fill="#5a4838" opacity="0.6" />
        <ellipse cx="748" cy="230" rx="25" ry="18" fill="#5a4838" opacity="0.5" />
        <ellipse cx="763" cy="245" rx="22" ry="16" fill="#5a4838" opacity="0.55" />
        <ellipse cx="745" cy="200" rx="35" ry="22" fill="#5a4838" opacity="0.4" />
      </g>

      {/* Ground */}
      <rect x="0" y="430" width="800" height="100" fill="#1a1620" />
    </svg>
  );
}

// ============================================================
// 4. SEMEY — атомный гриб
// ============================================================
function SemeyCover(_props: CoverProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a18" />
          <stop offset="50%" stopColor="#2a1530" />
          <stop offset="100%" stopColor="#5a2530" />
        </linearGradient>
        <radialGradient id="sm-flash" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0%" stopColor="#fff8c0" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ffaa55" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff5520" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="url(#sm-sky)" />

      {/* Distant flash glow */}
      <circle cx="400" cy="280" r="280" fill="url(#sm-flash)" />

      {/* Mushroom cloud — переместил ниже к центру */}
      <g transform="translate(400, 290)">
        {/* Cap (top mushroom head) */}
        <ellipse cx="0" cy="-100" rx="160" ry="60" fill="#5a3540" opacity="0.9" />
        <ellipse cx="0" cy="-115" rx="135" ry="48" fill="#7a4550" opacity="0.75" />
        <ellipse cx="0" cy="-130" rx="105" ry="38" fill="#a05560" opacity="0.65" />
        <ellipse cx="0" cy="-140" rx="75" ry="28" fill="#c47080" opacity="0.55" />
        <ellipse cx="0" cy="-148" rx="45" ry="18" fill="#e090a0" opacity="0.4" />

        {/* Stem */}
        <path d="M -30 -75 Q -12 0 -18 100 L 18 100 Q 12 0 30 -75 Z" fill="#5a3540" opacity="0.9" />
        <path d="M -22 -65 Q -10 0 -14 90 L 14 90 Q 10 0 22 -65 Z" fill="#7a4550" opacity="0.7" />
        <path d="M -12 -50 Q -8 0 -10 80 L 10 80 Q 8 0 12 -50 Z" fill="#a05560" opacity="0.5" />
      </g>

      {/* Steppe ground */}
      <path d="M 0 400 L 800 400 L 800 500 L 0 500 Z" fill="#2a1818" />
      <path d="M 0 415 L 100 410 L 200 420 L 300 412 L 400 422 L 500 415 L 600 423 L 700 417 L 800 425 L 800 500 L 0 500 Z" fill="#3a2218" opacity="0.7" />

      {/* Far village silhouettes */}
      <g fill="#1a1010" opacity="0.85">
        <rect x="80" y="385" width="20" height="15" />
        <polygon points="80,385 90,375 100,385" />
        <rect x="115" y="388" width="18" height="12" />
        <polygon points="115,388 124,380 133,388" />
        <rect x="160" y="386" width="22" height="14" />
        <polygon points="160,386 171,376 182,386" />
        <rect x="640" y="387" width="20" height="13" />
        <polygon points="640,387 650,378 660,387" />
        <rect x="680" y="385" width="18" height="15" />
        <polygon points="680,385 689,376 698,385" />
        <rect x="715" y="388" width="20" height="12" />
        <polygon points="715,388 725,380 735,388" />
      </g>

      {/* Ash particles falling */}
      <g fill="#a06070" opacity="0.4">
        <circle cx="300" cy="220" r="1.5" />
        <circle cx="350" cy="180" r="1" />
        <circle cx="450" cy="200" r="1.5" />
        <circle cx="500" cy="240" r="1" />
        <circle cx="250" cy="260" r="1" />
        <circle cx="550" cy="280" r="1.5" />
      </g>
    </svg>
  );
}

// ============================================================
// 5. CASPIAN — море, луна, нефтяные платформы
// ============================================================
function CaspianCover(_props: CoverProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1830" />
          <stop offset="100%" stopColor="#2a3548" />
        </linearGradient>
        <linearGradient id="cp-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3548" />
          <stop offset="50%" stopColor="#0e2538" />
          <stop offset="100%" stopColor="#051828" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#cp-sky)" />

      {/* Stars */}
      <g fill="#ffffff" opacity="0.7">
        <circle cx="100" cy="60" r="1" />
        <circle cx="250" cy="40" r="0.8" />
        <circle cx="450" cy="80" r="1" />
        <circle cx="650" cy="50" r="0.8" />
        <circle cx="350" cy="100" r="0.8" />
        <circle cx="700" cy="90" r="1" />
      </g>

      {/* Moon — переместил выше и левее, не на главный объект */}
      <circle cx="120" cy="130" r="34" fill="#e0e8f0" opacity="0.9" />
      <circle cx="125" cy="125" r="32" fill="#f5f8fc" />
      <circle cx="118" cy="128" r="3" fill="#c8d0d8" />
      <circle cx="130" cy="135" r="2" fill="#c8d0d8" />
      <circle cx="115" cy="118" r="2.5" fill="#c8d0d8" />

      {/* Sea — большой блок снизу */}
      <rect x="0" y="280" width="800" height="220" fill="url(#cp-sea)" />

      {/* Moon reflection */}
      <g opacity="0.5">
        <ellipse cx="125" cy="295" rx="3" ry="2" fill="#e0e8f0" />
        <ellipse cx="125" cy="310" rx="6" ry="2" fill="#e0e8f0" />
        <ellipse cx="125" cy="335" rx="10" ry="2" fill="#e0e8f0" />
        <ellipse cx="125" cy="365" rx="14" ry="2" fill="#e0e8f0" />
        <ellipse cx="125" cy="400" rx="18" ry="2" fill="#e0e8f0" />
      </g>

      {/* Oil platforms — central, large */}
      <g>
        {/* Big platform — center */}
        <g transform="translate(400, 280)">
          <line x1="-32" y1="0" x2="-38" y2="50" stroke="#3a3a40" strokeWidth="3.5" />
          <line x1="32" y1="0" x2="38" y2="50" stroke="#3a3a40" strokeWidth="3.5" />
          <line x1="-18" y1="0" x2="-22" y2="50" stroke="#2a2a30" strokeWidth="2" />
          <line x1="18" y1="0" x2="22" y2="50" stroke="#2a2a30" strokeWidth="2" />
          {/* X-bracing */}
          <line x1="-32" y1="20" x2="32" y2="20" stroke="#3a3a40" strokeWidth="1" />
          <line x1="-32" y1="35" x2="32" y2="35" stroke="#3a3a40" strokeWidth="1" />
          {/* Deck */}
          <rect x="-45" y="-12" width="90" height="12" fill="#5a5a60" />
          {/* Crane / tower */}
          <polygon points="-8,-12 8,-12 12,-80 -12,-80" fill="#3a3a40" />
          <line x1="0" y1="-80" x2="0" y2="-110" stroke="#5a5a60" strokeWidth="1.5" />
          {/* Flame */}
          <ellipse cx="0" cy="-110" rx="5" ry="10" fill="#ffaa55" opacity="0.9" />
          <ellipse cx="0" cy="-115" rx="3" ry="6" fill="#ffe080" opacity="0.8" />
          {/* Lights */}
          <circle cx="-30" cy="-6" r="2" fill="#ffd27a" />
          <circle cx="0" cy="-6" r="2" fill="#ffd27a" />
          <circle cx="30" cy="-6" r="2" fill="#ffd27a" />
        </g>

        {/* Right smaller platform */}
        <g transform="translate(620, 320)">
          <line x1="-18" y1="0" x2="-22" y2="40" stroke="#3a3a40" strokeWidth="2.5" />
          <line x1="18" y1="0" x2="22" y2="40" stroke="#3a3a40" strokeWidth="2.5" />
          <rect x="-25" y="-8" width="50" height="8" fill="#4a4a50" />
          <polygon points="-4,-8 4,-8 6,-50 -6,-50" fill="#3a3a40" />
          <ellipse cx="0" cy="-58" rx="3" ry="6" fill="#ffaa55" opacity="0.85" />
          <circle cx="-15" cy="-4" r="1.5" fill="#ffd27a" />
          <circle cx="15" cy="-4" r="1.5" fill="#ffd27a" />
        </g>
      </g>

      {/* Oil slick on water */}
      <ellipse cx="430" cy="380" rx="100" ry="8" fill="#0a0008" opacity="0.7" />
      <ellipse cx="460" cy="395" rx="70" ry="5" fill="#1a0510" opacity="0.6" />

      {/* Seal silhouette */}
      <g transform="translate(700, 410)" fill="#2a3540" opacity="0.8">
        <ellipse cx="0" cy="0" rx="25" ry="7" />
        <circle cx="-20" cy="-5" r="5" />
      </g>

      {/* Ripples */}
      <g stroke="#1a4a68" strokeWidth="0.6" fill="none" opacity="0.6">
        <path d="M 250 420 Q 280 418 310 420 T 370 420" />
        <path d="M 540 410 Q 570 408 600 410 T 660 410" />
      </g>
    </svg>
  );
}

// ============================================================
// 6. IRTYSH — карта 3 стран и река через них
// ============================================================
function IrtyshCover({ lang }: CoverProps) {
  const countries = IRTYSH_COUNTRIES[lang];
  const cities = IRTYSH_CITIES[lang];
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1828" />
          <stop offset="100%" stopColor="#2a3a4e" />
        </linearGradient>
        <linearGradient id="ir-river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3da9c9" />
          <stop offset="50%" stopColor="#5cb8d3" />
          <stop offset="100%" stopColor="#1a4a68" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#ir-sky)" />

      <rect x="0" y="0" width="800" height="170" fill="#5a3030" opacity="0.35" />
      <rect x="0" y="170" width="800" height="180" fill="#3a4a30" opacity="0.35" />
      <rect x="0" y="350" width="800" height="150" fill="#30303a" opacity="0.35" />

      <text x="690" y="95" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="22" fontWeight="700" letterSpacing="2" textAnchor="middle" opacity="0.9">
        {countries.china}
      </text>
      <text x="690" y="118" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="11" textAnchor="middle">
        CHINA
      </text>

      <text x="120" y="270" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="22" fontWeight="700" letterSpacing="2" opacity="0.9">
        {countries.kazakhstan}
      </text>
      <text x="120" y="293" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="11">
        KAZAKHSTAN
      </text>

      <text x="120" y="430" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="22" fontWeight="700" letterSpacing="2" opacity="0.9">
        {countries.russia}
      </text>
      <text x="120" y="453" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="11">
        RUSSIA
      </text>

      {/* Borders */}
      <line x1="0" y1="170" x2="800" y2="170" stroke="#E8A93C" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.6" />
      <line x1="0" y1="350" x2="800" y2="350" stroke="#E8A93C" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.6" />

      {/* River — пересекает все 3 страны */}
      <path
        d="M 740 30 Q 700 80 660 130 Q 600 200 540 230 Q 470 270 400 300 Q 330 330 250 380 Q 180 430 100 470"
        stroke="url(#ir-river)"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 740 30 Q 700 80 660 130 Q 600 200 540 230 Q 470 270 400 300 Q 330 330 250 380 Q 180 430 100 470"
        stroke="#a0d8e8"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Canal in China (water diversion) */}
      <line x1="660" y1="130" x2="780" y2="60" stroke="#C0463C" strokeWidth="3" strokeDasharray="3 4" opacity="0.85" />
      <text x="780" y="48" fill="#C0463C" fontFamily="ui-monospace, monospace" fontSize="10" textAnchor="end" opacity="0.9" fontWeight="700">
        4 km³/yr → Karamay
      </text>

      {/* Cities (dots on river) */}
      <g>
        <circle cx="540" cy="230" r="6" fill="#E8A93C" />
        <circle cx="540" cy="230" r="10" fill="#E8A93C" opacity="0.3" />
        <text x="558" y="227" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="600">
          {cities.ust}
        </text>

        <circle cx="400" cy="300" r="6" fill="#E8A93C" />
        <circle cx="400" cy="300" r="10" fill="#E8A93C" opacity="0.3" />
        <text x="418" y="297" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="600">
          {cities.semey}
        </text>

        <circle cx="250" cy="380" r="6" fill="#E8A93C" />
        <circle cx="250" cy="380" r="10" fill="#E8A93C" opacity="0.3" />
        <text x="268" y="377" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="600">
          {cities.pavlodar}
        </text>

        <circle cx="100" cy="470" r="6" fill="#E8A93C" />
        <circle cx="100" cy="470" r="10" fill="#E8A93C" opacity="0.3" />
        <text x="118" y="467" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="600">
          {cities.omsk}
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// FALLBACK
// ============================================================
function FallbackCover(_props: CoverProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2540" />
          <stop offset="100%" stopColor="#3a2540" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#fb-bg)" />
      <g transform="translate(400, 250)">
        <circle cx="0" cy="0" r="60" fill="none" stroke="#E8A93C" strokeWidth="2" opacity="0.6" />
        <path d="M -30 0 L 30 0 M 0 -30 L 0 30" stroke="#E8A93C" strokeWidth="2" opacity="0.6" />
      </g>
    </svg>
  );
}

const COVERS: Record<CaseSlug, React.ComponentType<CoverProps>> = {
  "case-aral-2025": AralCover,
  "case-balkhash-2025": BalkhashCover,
  "case-almaty-smog-2025": AlmatyCover,
  "case-semey-2025": SemeyCover,
  "case-caspian-2025": CaspianCover,
  "case-irtysh-2025": IrtyshCover,
};
