"use client";

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
  variant = "wide",
}: {
  slug: string;
  className?: string;
  variant?: "wide" | "square";
}) {
  const Comp = COVERS[slug as CaseSlug] ?? FallbackCover;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Comp variant={variant} />
    </div>
  );
}

type SubProps = { variant: "wide" | "square" };

// ============================================================
// 1. ARAL — высыхающее море с кораблём
// ============================================================
function AralCover({ variant }: SubProps) {
  return (
    <svg
      viewBox="0 0 800 500"
      className="w-full h-full"
      preserveAspectRatio={variant === "square" ? "xMidYMid slice" : "xMidYMid slice"}
      xmlns="http://www.w3.org/2000/svg"
    >
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
        <radialGradient id="aral-sun" cx="0.7" cy="0.3" r="0.4">
          <stop offset="0%" stopColor="#ffb84a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffb84a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="320" fill="url(#aral-sky)" />
      {/* Sun glow */}
      <rect width="800" height="320" fill="url(#aral-sun)" />
      {/* Sun */}
      <circle cx="560" cy="160" r="38" fill="#ffd27a" opacity="0.8" />

      {/* Distant water (small remnant) */}
      <ellipse cx="650" cy="320" rx="180" ry="22" fill="#2a5a78" opacity="0.7" />
      <ellipse cx="650" cy="318" rx="170" ry="16" fill="#3da9c9" opacity="0.5" />

      {/* Sand / dry seabed */}
      <path d="M 0 320 L 800 320 L 800 500 L 0 500 Z" fill="url(#aral-sand)" />

      {/* Cracked earth pattern */}
      <g stroke="#4a2f1a" strokeWidth="1" opacity="0.4" fill="none">
        <path d="M 50 380 L 120 360 L 180 390 M 200 410 L 280 400 L 320 430" />
        <path d="M 350 400 L 420 380 L 480 405 M 50 450 L 150 440 L 220 460" />
        <path d="M 500 440 L 580 425 L 650 450 M 280 470 L 380 460 L 450 480" />
      </g>

      {/* Salt patches */}
      <ellipse cx="180" cy="395" rx="55" ry="6" fill="#e8e0c8" opacity="0.5" />
      <ellipse cx="380" cy="430" rx="42" ry="5" fill="#e8e0c8" opacity="0.5" />
      <ellipse cx="540" cy="460" rx="60" ry="7" fill="#e8e0c8" opacity="0.5" />

      {/* Rusted ship — главная фишка */}
      <g transform="translate(180, 290)">
        {/* Hull */}
        <path
          d="M 0 80 L 20 50 L 180 50 L 200 80 L 180 110 L 20 110 Z"
          fill="#5a3020"
          stroke="#3a1f10"
          strokeWidth="2"
        />
        {/* Deck */}
        <rect x="60" y="20" width="80" height="30" fill="#6a4030" stroke="#3a1f10" />
        {/* Cabin */}
        <rect x="80" y="0" width="40" height="20" fill="#7a5040" stroke="#3a1f10" />
        {/* Mast */}
        <line x1="100" y1="0" x2="100" y2="-30" stroke="#3a1f10" strokeWidth="2" />
        {/* Rust streaks */}
        <path d="M 30 60 L 35 100 M 50 55 L 55 105 M 150 55 L 155 100 M 170 60 L 175 100" stroke="#8a4020" strokeWidth="1" opacity="0.7" />
        {/* Shadow */}
        <ellipse cx="100" cy="115" rx="120" ry="6" fill="#000" opacity="0.4" />
      </g>

      {/* Title overlay corner */}
      <g transform="translate(40, 40)">
        <text x="0" y="20" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3" opacity="0.9">
          ARAL · 1960→2025
        </text>
        <text x="0" y="50" fill="#F0EAD6" fontFamily="serif" fontSize="32" fontWeight="700" opacity="0.95">
          −13×
        </text>
        <text x="0" y="68" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
          AREA SHRINKAGE
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// 2. BALKHASH — озеро двух цветов с горами
// ============================================================
function BalkhashCover({ variant }: SubProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1830" />
          <stop offset="100%" stopColor="#2a4a70" />
        </linearGradient>
        <linearGradient id="bh-water-fresh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3da9c9" />
          <stop offset="100%" stopColor="#1a4a68" />
        </linearGradient>
        <linearGradient id="bh-water-salt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8b8a0" />
          <stop offset="100%" stopColor="#5a6a55" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#bh-sky)" />

      {/* Mountains */}
      <path d="M 0 280 L 120 180 L 200 220 L 320 140 L 440 200 L 560 160 L 680 220 L 800 180 L 800 320 L 0 320 Z" fill="#1a2540" opacity="0.9" />
      <path d="M 0 280 L 120 180 L 200 220 L 320 140 L 440 200 L 560 160 L 680 220 L 800 180" stroke="#3a4560" strokeWidth="1" fill="none" />

      {/* Snow caps */}
      <path d="M 100 195 L 120 180 L 140 195 Z M 300 155 L 320 140 L 340 155 Z M 540 175 L 560 160 L 580 175 Z" fill="#e8e8f0" opacity="0.8" />

      {/* Mountains reflection */}
      <path d="M 0 320 L 120 380 L 200 350 L 320 410 L 440 360 L 560 400 L 680 350 L 800 380 L 800 500 L 0 500 Z" fill="#0a1428" opacity="0.6" />

      {/* Lake — two halves */}
      <g>
        {/* Fresh (west) */}
        <ellipse cx="280" cy="380" rx="280" ry="60" fill="url(#bh-water-fresh)" />
        {/* Salty (east) */}
        <ellipse cx="600" cy="380" rx="200" ry="55" fill="url(#bh-water-salt)" />
        {/* Divider line where halves meet */}
        <line x1="445" y1="340" x2="445" y2="420" stroke="#E8A93C" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      </g>

      {/* Ripples */}
      <g stroke="#a0d8e8" strokeWidth="0.6" fill="none" opacity="0.5">
        <path d="M 100 380 Q 130 376 160 380 T 220 380" />
        <path d="M 300 410 Q 330 406 360 410 T 420 410" />
        <path d="M 520 390 Q 550 386 580 390 T 640 390" />
      </g>

      {/* Title corner */}
      <g transform="translate(40, 40)">
        <text x="0" y="20" fill="#3DA9C9" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3">
          BALKHASH · ILE RIVER
        </text>
        <text x="0" y="50" fill="#F0EAD6" fontFamily="serif" fontSize="32" fontWeight="700">
          50% · 50%
        </text>
        <text x="0" y="68" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
          FRESH / SALT
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// 3. ALMATY SMOG — горы за смогом с городом
// ============================================================
function AlmatyCover({ variant }: SubProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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
      <circle cx="600" cy="180" r="35" fill="#ffaa55" opacity="0.7" />

      {/* Distant mountains (Iile-Alatau) — фоном, едва видны через смог */}
      <path d="M 0 220 L 100 140 L 180 180 L 280 100 L 400 160 L 520 110 L 640 170 L 760 130 L 800 150 L 800 320 L 0 320 Z" fill="#252030" opacity="0.7" />
      {/* Snow */}
      <path d="M 260 115 L 280 100 L 300 115 Z M 500 125 L 520 110 L 540 125 Z M 740 145 L 760 130 L 780 145 Z" fill="#e0d8e0" opacity="0.5" />

      {/* Smog layer (inversion) */}
      <rect x="0" y="180" width="800" height="180" fill="url(#al-smog)" />

      {/* City silhouette */}
      <g fill="#1a1620">
        <rect x="50" y="320" width="40" height="80" />
        <rect x="100" y="290" width="50" height="110" />
        <rect x="160" y="310" width="35" height="90" />
        <rect x="205" y="270" width="55" height="130" />
        <rect x="270" y="295" width="40" height="105" />
        <rect x="320" y="280" width="60" height="120" />
        <rect x="390" y="305" width="45" height="95" />
        <rect x="445" y="265" width="55" height="135" />
        <rect x="510" y="290" width="40" height="110" />
        <rect x="560" y="310" width="50" height="90" />
        <rect x="620" y="285" width="55" height="115" />
        <rect x="685" y="300" width="40" height="100" />
        <rect x="735" y="315" width="50" height="85" />
      </g>

      {/* Window lights */}
      <g fill="#ffd27a" opacity="0.7">
        <rect x="60" y="335" width="3" height="3" />
        <rect x="75" y="350" width="3" height="3" />
        <rect x="115" y="305" width="3" height="3" />
        <rect x="125" y="325" width="3" height="3" />
        <rect x="220" y="285" width="3" height="3" />
        <rect x="240" y="305" width="3" height="3" />
        <rect x="335" y="295" width="3" height="3" />
        <rect x="365" y="320" width="3" height="3" />
        <rect x="465" y="280" width="3" height="3" />
        <rect x="485" y="305" width="3" height="3" />
        <rect x="640" y="300" width="3" height="3" />
        <rect x="700" y="315" width="3" height="3" />
      </g>

      {/* CHP smoke stacks */}
      <g>
        <rect x="700" y="240" width="6" height="80" fill="#1a1620" />
        <rect x="715" y="220" width="6" height="100" fill="#1a1620" />
        <rect x="730" y="235" width="6" height="85" fill="#1a1620" />
        {/* Smoke */}
        <ellipse cx="703" cy="225" rx="20" ry="15" fill="#5a4838" opacity="0.5" />
        <ellipse cx="718" cy="200" rx="25" ry="18" fill="#5a4838" opacity="0.4" />
        <ellipse cx="733" cy="215" rx="22" ry="16" fill="#5a4838" opacity="0.5" />
      </g>

      {/* Ground */}
      <rect x="0" y="400" width="800" height="100" fill="#1a1620" />

      {/* Title corner */}
      <g transform="translate(40, 40)">
        <text x="0" y="20" fill="#E07A3B" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3">
          ALMATY · WINTER
        </text>
        <text x="0" y="50" fill="#F0EAD6" fontFamily="serif" fontSize="32" fontWeight="700">
          PM2.5 ×12
        </text>
        <text x="0" y="68" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
          ABOVE WHO LIMIT
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// 4. SEMEY — атомный гриб над степью
// ============================================================
function SemeyCover({ variant }: SubProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a18" />
          <stop offset="50%" stopColor="#2a1530" />
          <stop offset="100%" stopColor="#5a2530" />
        </linearGradient>
        <radialGradient id="sm-flash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff8c0" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ffaa55" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff5520" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="url(#sm-sky)" />

      {/* Distant flash */}
      <circle cx="400" cy="220" r="200" fill="url(#sm-flash)" />

      {/* Mushroom cloud */}
      <g transform="translate(400, 220)">
        {/* Cap */}
        <ellipse cx="0" cy="-80" rx="120" ry="50" fill="#5a3540" opacity="0.85" />
        <ellipse cx="0" cy="-90" rx="100" ry="40" fill="#7a4550" opacity="0.7" />
        <ellipse cx="0" cy="-100" rx="80" ry="32" fill="#a05560" opacity="0.6" />
        <ellipse cx="0" cy="-105" rx="55" ry="22" fill="#c47080" opacity="0.5" />
        {/* Stem */}
        <path d="M -25 -60 Q -10 0 -15 80 L 15 80 Q 10 0 25 -60 Z" fill="#5a3540" opacity="0.85" />
        <path d="M -18 -50 Q -8 0 -12 70 L 12 70 Q 8 0 18 -50 Z" fill="#7a4550" opacity="0.6" />
      </g>

      {/* Steppe ground */}
      <path d="M 0 320 L 800 320 L 800 500 L 0 500 Z" fill="#2a1818" />
      <path d="M 0 340 L 100 335 L 200 345 L 300 338 L 400 348 L 500 340 L 600 348 L 700 342 L 800 350 L 800 500 L 0 500 Z" fill="#3a2218" opacity="0.7" />

      {/* Far village (silhouettes) */}
      <g fill="#1a1010" opacity="0.8">
        <rect x="100" y="305" width="20" height="15" />
        <polygon points="100,305 110,295 120,305" />
        <rect x="135" y="308" width="18" height="12" />
        <polygon points="135,308 144,300 153,308" />
        <rect x="180" y="306" width="22" height="14" />
        <polygon points="180,306 191,296 202,306" />
        {/* Right side */}
        <rect x="640" y="307" width="20" height="13" />
        <polygon points="640,307 650,298 660,307" />
        <rect x="680" y="305" width="18" height="15" />
        <polygon points="680,305 689,296 698,305" />
      </g>

      {/* Radiation symbol overlay */}
      <g transform="translate(700, 80)" opacity="0.5">
        <circle cx="0" cy="0" r="25" fill="none" stroke="#ffaa55" strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill="#ffaa55" />
        <path d="M 0 -25 L -8 -8 L 8 -8 Z" fill="#ffaa55" />
        <path d="M 22 12 L 7 4 L 11 18 Z" fill="#ffaa55" />
        <path d="M -22 12 L -7 4 L -11 18 Z" fill="#ffaa55" />
      </g>

      {/* Title corner */}
      <g transform="translate(40, 40)">
        <text x="0" y="20" fill="#C0463C" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3">
          SEMEY · 1949–1989
        </text>
        <text x="0" y="50" fill="#F0EAD6" fontFamily="serif" fontSize="32" fontWeight="700">
          456 TESTS
        </text>
        <text x="0" y="68" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
          NUCLEAR LEGACY
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// 5. CASPIAN — море с нефтяными платформами
// ============================================================
function CaspianCover({ variant }: SubProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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

      {/* Moon */}
      <circle cx="150" cy="120" r="30" fill="#e0e8f0" opacity="0.85" />
      <circle cx="155" cy="115" r="28" fill="#f5f8fc" />
      <circle cx="148" cy="118" r="3" fill="#c8d0d8" />
      <circle cx="160" cy="125" r="2" fill="#c8d0d8" />

      {/* Sea */}
      <rect x="0" y="260" width="800" height="240" fill="url(#cp-sea)" />

      {/* Moon reflection */}
      <g opacity="0.5">
        <ellipse cx="155" cy="280" rx="3" ry="2" fill="#e0e8f0" />
        <ellipse cx="155" cy="295" rx="6" ry="2" fill="#e0e8f0" />
        <ellipse cx="155" cy="320" rx="10" ry="2" fill="#e0e8f0" />
        <ellipse cx="155" cy="350" rx="14" ry="2" fill="#e0e8f0" />
        <ellipse cx="155" cy="385" rx="18" ry="2" fill="#e0e8f0" />
      </g>

      {/* Water level marks (showing falling level) */}
      <g stroke="#E8A93C" strokeWidth="1" strokeDasharray="3 3" opacity="0.5">
        <line x1="0" y1="240" x2="800" y2="240" />
        <line x1="0" y1="220" x2="800" y2="220" />
      </g>
      <text x="20" y="218" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="9">
        1995
      </text>
      <text x="20" y="238" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="9">
        2010
      </text>

      {/* Oil platforms */}
      <g>
        {/* Platform 1 */}
        <g transform="translate(400, 240)">
          {/* Legs */}
          <line x1="-25" y1="0" x2="-30" y2="40" stroke="#3a3a40" strokeWidth="3" />
          <line x1="25" y1="0" x2="30" y2="40" stroke="#3a3a40" strokeWidth="3" />
          <line x1="-15" y1="0" x2="-18" y2="40" stroke="#2a2a30" strokeWidth="2" />
          <line x1="15" y1="0" x2="18" y2="40" stroke="#2a2a30" strokeWidth="2" />
          {/* Deck */}
          <rect x="-35" y="-10" width="70" height="10" fill="#5a5a60" />
          {/* Tower */}
          <polygon points="-5,-10 5,-10 8,-60 -8,-60" fill="#3a3a40" />
          <line x1="0" y1="-60" x2="0" y2="-80" stroke="#5a5a60" strokeWidth="1" />
          {/* Flame */}
          <ellipse cx="0" cy="-80" rx="3" ry="6" fill="#ffaa55" opacity="0.8" />
          {/* Lights */}
          <circle cx="-20" cy="-5" r="1.5" fill="#ffd27a" />
          <circle cx="20" cy="-5" r="1.5" fill="#ffd27a" />
        </g>

        {/* Platform 2 (smaller) */}
        <g transform="translate(620, 280)">
          <line x1="-15" y1="0" x2="-18" y2="30" stroke="#3a3a40" strokeWidth="2" />
          <line x1="15" y1="0" x2="18" y2="30" stroke="#3a3a40" strokeWidth="2" />
          <rect x="-22" y="-6" width="44" height="6" fill="#4a4a50" />
          <polygon points="-3,-6 3,-6 5,-40 -5,-40" fill="#3a3a40" />
          <ellipse cx="0" cy="-50" rx="2" ry="4" fill="#ffaa55" opacity="0.8" />
        </g>
      </g>

      {/* Oil slick */}
      <ellipse cx="430" cy="320" rx="80" ry="6" fill="#0a0008" opacity="0.6" />
      <ellipse cx="450" cy="335" rx="60" ry="4" fill="#1a0510" opacity="0.5" />

      {/* Seal silhouette */}
      <g transform="translate(700, 340)" fill="#2a3540" opacity="0.7">
        <ellipse cx="0" cy="0" rx="22" ry="6" />
        <circle cx="-18" cy="-4" r="4" />
      </g>

      {/* Ripples */}
      <g stroke="#1a4a68" strokeWidth="0.5" fill="none" opacity="0.6">
        <path d="M 100 380 Q 130 378 160 380 T 220 380" />
        <path d="M 300 410 Q 330 408 360 410 T 420 410" />
        <path d="M 520 400 Q 550 398 580 400 T 640 400" />
      </g>

      {/* Title corner */}
      <g transform="translate(40, 40)">
        <text x="0" y="20" fill="#3DA9C9" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3">
          CASPIAN · 5 STATES
        </text>
        <text x="0" y="50" fill="#F0EAD6" fontFamily="serif" fontSize="32" fontWeight="700">
          −2.3m
        </text>
        <text x="0" y="68" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
          SEA LEVEL DROP
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// 6. IRTYSH — река через 3 страны с границами
// ============================================================
function IrtyshCover({ variant }: SubProps) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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

      {/* Three country areas (top-down map style) */}
      {/* China (top right corner) */}
      <path d="M 600 0 L 800 0 L 800 200 L 580 200 L 600 0 Z" fill="#5a3030" opacity="0.4" />
      <text x="690" y="100" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2" textAnchor="middle" opacity="0.85">
        ҚХР
      </text>
      <text x="690" y="120" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" textAnchor="middle">
        CHINA
      </text>

      {/* Kazakhstan (middle) */}
      <path d="M 0 200 L 800 200 L 800 350 L 0 350 Z" fill="#3a4a30" opacity="0.4" />
      <text x="400" y="280" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2" textAnchor="middle" opacity="0.85">
        ҚАЗАҚСТАН
      </text>
      <text x="400" y="298" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" textAnchor="middle">
        KAZAKHSTAN
      </text>

      {/* Russia (bottom) */}
      <path d="M 0 350 L 800 350 L 800 500 L 0 500 Z" fill="#30303a" opacity="0.4" />
      <text x="400" y="430" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2" textAnchor="middle" opacity="0.85">
        РЕСЕЙ
      </text>
      <text x="400" y="448" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" textAnchor="middle">
        RUSSIA
      </text>

      {/* Borders */}
      <line x1="0" y1="200" x2="800" y2="200" stroke="#E8A93C" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
      <line x1="0" y1="350" x2="800" y2="350" stroke="#E8A93C" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
      <line x1="600" y1="0" x2="580" y2="200" stroke="#E8A93C" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />

      {/* River — пересекает все 3 страны */}
      <path
        d="M 720 30 Q 700 80 660 130 Q 600 180 540 220 Q 470 260 400 290 Q 330 320 250 360 Q 180 410 100 470"
        stroke="url(#ir-river)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 720 30 Q 700 80 660 130 Q 600 180 540 220 Q 470 260 400 290 Q 330 320 250 360 Q 180 410 100 470"
        stroke="#a0d8e8"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Canal in China (water diversion) */}
      <line x1="660" y1="130" x2="780" y2="80" stroke="#5a3030" strokeWidth="3" strokeDasharray="2 3" opacity="0.7" />
      <text x="780" y="70" fill="#C0463C" fontFamily="ui-monospace, monospace" fontSize="8" textAnchor="end" opacity="0.8">
        4 km³/yr → Karamay
      </text>

      {/* Cities (dots on river) */}
      <g>
        <circle cx="540" cy="220" r="5" fill="#E8A93C" />
        <text x="555" y="218" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="9">
          Өскемен
        </text>
        <circle cx="400" cy="290" r="5" fill="#E8A93C" />
        <text x="415" y="288" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="9">
          Семей
        </text>
        <circle cx="250" cy="360" r="5" fill="#E8A93C" />
        <text x="265" y="358" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="9">
          Павлодар
        </text>
        <circle cx="100" cy="470" r="5" fill="#E8A93C" />
        <text x="115" y="468" fill="#F0EAD6" fontFamily="ui-monospace, monospace" fontSize="9">
          Омбы
        </text>
      </g>

      {/* Title corner */}
      <g transform="translate(40, 40)">
        <text x="0" y="20" fill="#3DA9C9" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="3">
          IRTYSH · 4248 km
        </text>
        <text x="0" y="50" fill="#F0EAD6" fontFamily="serif" fontSize="32" fontWeight="700">
          3 STATES
        </text>
        <text x="0" y="68" fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
          1 RIVER · NO TREATY
        </text>
      </g>
    </svg>
  );
}

// ============================================================
// FALLBACK
// ============================================================
function FallbackCover() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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

const COVERS: Record<CaseSlug, React.ComponentType<SubProps>> = {
  "case-aral-2025": AralCover,
  "case-balkhash-2025": BalkhashCover,
  "case-almaty-smog-2025": AlmatyCover,
  "case-semey-2025": SemeyCover,
  "case-caspian-2025": CaspianCover,
  "case-irtysh-2025": IrtyshCover,
};
