"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type SceneTheme =
  | "aral"
  | "balkhash"
  | "almaty"
  | "semey"
  | "caspian"
  | "irtysh"
  | "default";

function themeFromScenario(scenarioId: string): SceneTheme {
  if (scenarioId.includes("aral")) return "aral";
  if (scenarioId.includes("balkhash")) return "balkhash";
  if (scenarioId.includes("almaty")) return "almaty";
  if (scenarioId.includes("semey")) return "semey";
  if (scenarioId.includes("caspian")) return "caspian";
  if (scenarioId.includes("irtysh")) return "irtysh";
  return "default";
}

const COUNTRY_LABELS = {
  kk: { china: "ҚХР", kazakhstan: "ҚАЗАҚСТАН", russia: "РЕСЕЙ" },
  ru: { china: "КНР", kazakhstan: "КАЗАХСТАН", russia: "РОССИЯ" },
} as const;

/**
 * Тематический визуальный фон симуляции. Реагирует на ключевые индикаторы:
 * - вода (waterLevel) → размер озера / моря
 * - PM2.5 → плотность смога
 * - онкология → радиоактивная зона
 * - сток (waterFlow) → толщина реки
 * И так далее
 */
export function SimulationVisual({
  scenarioId,
  indicators,
  progress,
  className,
}: {
  scenarioId: string;
  indicators: Record<string, number>;
  progress: number; // 0..1
  className?: string;
}) {
  const theme = themeFromScenario(scenarioId);
  const locale = useLocale();
  const lang = locale === "ru" ? "ru" : "kk";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {theme === "aral" && <AralScene indicators={indicators} progress={progress} />}
      {theme === "balkhash" && <BalkhashScene indicators={indicators} progress={progress} />}
      {theme === "almaty" && <AlmatyScene indicators={indicators} progress={progress} />}
      {theme === "semey" && <SemeyScene indicators={indicators} progress={progress} />}
      {theme === "caspian" && <CaspianScene indicators={indicators} progress={progress} />}
      {theme === "irtysh" && <IrtyshScene indicators={indicators} progress={progress} lang={lang} />}
      {theme === "default" && <DefaultScene />}

      {/* Scanline */}
      <div
        className="absolute inset-x-0 h-px bg-primary/60 shadow-[0_0_12px_hsl(var(--primary)/0.7)] pointer-events-none"
        style={{ top: `${progress * 100}%` }}
      />
    </div>
  );
}

type SceneProps = {
  indicators: Record<string, number>;
  progress: number;
};

// ============================================================
// ARAL — озеро с морфингом, размер зависит от waterLevel
// ============================================================
function AralScene({ indicators }: SceneProps) {
  const wl = indicators.waterLevel ?? 20;
  // Map waterLevel (12..30m) to lake size (small..large)
  const size = Math.max(0.3, Math.min(1.4, (wl - 12) / 16));

  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ar-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2540" />
          <stop offset="100%" stopColor="#3d2818" />
        </linearGradient>
      </defs>
      <rect width="800" height="480" fill="url(#ar-bg)" />

      {/* Original lake outline (where it used to be) */}
      <ellipse cx="400" cy="260" rx="320" ry="170" fill="none" stroke="#5a3520" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Current lake — animates by size */}
      <motion.ellipse
        cx="400"
        cy="260"
        animate={{ rx: 320 * size, ry: 170 * size }}
        transition={{ duration: 0.3 }}
        fill="#1a4a68"
        opacity="0.9"
      />
      <motion.ellipse
        cx="400"
        cy="255"
        animate={{ rx: 305 * size, ry: 155 * size }}
        transition={{ duration: 0.3 }}
        fill="#3da9c9"
        opacity="0.9"
      />

      {/* Rivers feeding from sides */}
      <path d="M 0 130 Q 100 160 200 200 L 240 220" stroke="#3da9c9" strokeWidth="3" fill="none" opacity={0.4 + size * 0.6} />
      <path d="M 800 130 Q 700 160 600 200 L 560 220" stroke="#3da9c9" strokeWidth="3" fill="none" opacity={0.4 + size * 0.6} />

      {/* Salt patches around (when lake small) */}
      {size < 0.7 && (
        <g fill="#e8d8b0" opacity={(0.7 - size) * 1.5}>
          <ellipse cx="250" cy="320" rx="50" ry="6" />
          <ellipse cx="550" cy="340" rx="65" ry="8" />
          <ellipse cx="350" cy="380" rx="40" ry="5" />
        </g>
      )}
    </svg>
  );
}

// ============================================================
// BALKHASH — двухцветное озеро, западная и восточная половины
// ============================================================
function BalkhashScene({ indicators }: SceneProps) {
  const wl = indicators.waterLevel ?? 340;
  // 337..345 m range
  const size = Math.max(0.5, Math.min(1.2, (wl - 337) / 8));

  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bh-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1830" />
          <stop offset="100%" stopColor="#1a2548" />
        </linearGradient>
      </defs>
      <rect width="800" height="480" fill="url(#bh-bg)" />

      {/* Mountains */}
      <path d="M 0 180 L 120 120 L 240 160 L 360 100 L 480 150 L 600 120 L 720 160 L 800 130 L 800 240 L 0 240 Z" fill="#1a2540" />
      <path d="M 340 115 L 360 100 L 380 115 Z M 580 135 L 600 120 L 620 135 Z" fill="#e0e8f0" opacity="0.7" />

      {/* Lake — fresh west half */}
      <motion.ellipse
        cx="280"
        cy="320"
        animate={{ rx: 230 * size, ry: 60 * size }}
        transition={{ duration: 0.3 }}
        fill="#3da9c9"
      />
      {/* Salt east half */}
      <motion.ellipse
        cx="540"
        cy="320"
        animate={{ rx: 180 * size, ry: 55 * size }}
        transition={{ duration: 0.3 }}
        fill="#a8b8a0"
      />
      {/* Divider */}
      <line x1="410" y1="270" x2="410" y2="370" stroke="#E8A93C" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />

      {/* Ile river feeding */}
      <path d="M 0 470 Q 100 420 200 380 L 280 360" stroke="#3da9c9" strokeWidth="4" fill="none" />
    </svg>
  );
}

// ============================================================
// ALMATY — город со смогом, плотность зависит от PM2.5
// ============================================================
function AlmatyScene({ indicators }: SceneProps) {
  const pm = indicators.pm25Winter ?? 180;
  // 50..200 → smog opacity 0.2..0.95
  const smog = Math.max(0.15, Math.min(0.95, pm / 200));
  const skyHue = pm > 120 ? "#5a4030" : pm > 80 ? "#3a4050" : "#1a3050";

  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="al-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pm > 120 ? "#1a1820" : "#0e1830"} />
          <stop offset="100%" stopColor={skyHue} />
        </linearGradient>
        <linearGradient id="al-smog-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a6855" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a2d22" stopOpacity={smog} />
        </linearGradient>
      </defs>
      <rect width="800" height="480" fill="url(#al-bg)" />

      {/* Sun (dimmed when smog) */}
      <circle cx="650" cy="120" r="34" fill="#ffaa55" opacity={1 - smog * 0.6} />

      {/* Mountains (Iile-Alatau) */}
      <path d="M 0 220 L 100 130 L 200 180 L 300 100 L 420 170 L 540 120 L 660 180 L 760 140 L 800 160 L 800 320 L 0 320 Z" fill="#252030" opacity={1 - smog * 0.5} />
      <path d="M 280 115 L 300 100 L 320 115 Z M 520 135 L 540 120 L 560 135 Z" fill="#e0d8e0" opacity={(1 - smog * 0.5) * 0.7} />

      {/* Smog layer — animated */}
      <motion.rect
        x="0"
        y="200"
        width="800"
        height="200"
        animate={{ opacity: smog }}
        transition={{ duration: 0.3 }}
        fill="url(#al-smog-grad)"
      />

      {/* City silhouette */}
      <g fill="#1a1620">
        <rect x="40" y="330" width="40" height="80" />
        <rect x="90" y="300" width="50" height="110" />
        <rect x="150" y="320" width="35" height="90" />
        <rect x="195" y="280" width="55" height="130" />
        <rect x="260" y="305" width="40" height="105" />
        <rect x="310" y="290" width="60" height="120" />
        <rect x="380" y="315" width="45" height="95" />
        <rect x="435" y="275" width="55" height="135" />
        <rect x="500" y="300" width="40" height="110" />
        <rect x="550" y="320" width="50" height="90" />
        <rect x="610" y="295" width="55" height="115" />
        <rect x="675" y="310" width="40" height="100" />
        <rect x="725" y="325" width="50" height="85" />
      </g>

      {/* CHP smokestacks belching smoke */}
      <g>
        <rect x="730" y="245" width="6" height="80" fill="#1a1620" />
        <rect x="745" y="225" width="6" height="100" fill="#1a1620" />
        <motion.ellipse cx="733" cy="235" rx="20" ry="15" fill="#5a4838" animate={{ opacity: smog * 0.8 }} transition={{ duration: 0.3 }} />
        <motion.ellipse cx="748" cy="210" rx="25" ry="18" fill="#5a4838" animate={{ opacity: smog * 0.7 }} transition={{ duration: 0.3 }} />
      </g>

      {/* Ground */}
      <rect x="0" y="410" width="800" height="70" fill="#1a1620" />
    </svg>
  );
}

// ============================================================
// SEMEY — степь, ядерный кратер, кольца радиации (меньше при улучшении)
// ============================================================
function SemeyScene({ indicators }: SceneProps) {
  const cancer = indicators.cancerCases ?? 342;
  // 150..400 → radiation intensity 0.3..1.0
  const rad = Math.max(0.2, Math.min(1.0, (cancer - 150) / 250));

  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a18" />
          <stop offset="100%" stopColor={rad > 0.6 ? "#3a1818" : "#2a2018"} />
        </linearGradient>
        <radialGradient id="sm-rad-glow" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0%" stopColor="#ffaa55" stopOpacity={rad * 0.6} />
          <stop offset="100%" stopColor="#ff5520" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="480" fill="url(#sm-bg)" />

      {/* Glow at crater */}
      <circle cx="400" cy="260" r="250" fill="url(#sm-rad-glow)" />

      {/* Crater rings (animated by radiation) */}
      <motion.circle cx="400" cy="260" r="180" animate={{ opacity: rad * 0.6 }} transition={{ duration: 0.3 }} fill="none" stroke="#C0463C" strokeWidth="1" strokeDasharray="4 3" />
      <motion.circle cx="400" cy="260" r="130" animate={{ opacity: rad * 0.8 }} transition={{ duration: 0.3 }} fill="none" stroke="#c04030" strokeWidth="1.5" strokeDasharray="3 2" />
      <motion.circle cx="400" cy="260" r="80" animate={{ opacity: rad }} transition={{ duration: 0.3 }} fill="#3a1818" />
      <motion.circle cx="400" cy="260" r="40" animate={{ opacity: rad * 1.2 }} transition={{ duration: 0.3 }} fill="#1a0808" />

      {/* Steppe */}
      <path d="M 0 360 L 800 360 L 800 480 L 0 480 Z" fill="#2a1818" opacity={1 - rad * 0.3} />
      <path d="M 0 380 L 100 375 L 200 385 L 300 378 L 400 388 L 500 380 L 600 388 L 700 382 L 800 390 L 800 480 L 0 480 Z" fill="#3a2218" opacity={1 - rad * 0.3} />

      {/* Distant villages — fade when high radiation */}
      <g fill="#1a1010" opacity={1 - rad * 0.6}>
        <rect x="80" y="345" width="20" height="15" /> <polygon points="80,345 90,335 100,345" />
        <rect x="115" y="348" width="18" height="12" /> <polygon points="115,348 124,340 133,348" />
        <rect x="660" y="347" width="20" height="13" /> <polygon points="660,347 670,338 680,347" />
        <rect x="700" y="345" width="18" height="15" /> <polygon points="700,345 709,336 718,345" />
      </g>
    </svg>
  );
}

// ============================================================
// CASPIAN — море с уровнем, нефтяные платформы
// ============================================================
function CaspianScene({ indicators }: SceneProps) {
  const wl = indicators.waterLevel ?? -29;
  // -31..-26 m range
  const seaLevel = Math.max(0.1, Math.min(1.0, (wl + 31) / 5));
  const seaTop = 320 - seaLevel * 80; // y coord (lower = more water)

  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1830" />
          <stop offset="100%" stopColor="#1a2538" />
        </linearGradient>
        <linearGradient id="cp-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3548" />
          <stop offset="100%" stopColor="#051828" />
        </linearGradient>
      </defs>

      <rect width="800" height="480" fill="url(#cp-bg)" />

      {/* Stars */}
      <g fill="#ffffff" opacity="0.7">
        <circle cx="100" cy="60" r="1" />
        <circle cx="250" cy="40" r="0.8" />
        <circle cx="450" cy="80" r="1" />
        <circle cx="650" cy="50" r="0.8" />
        <circle cx="700" cy="100" r="1" />
      </g>

      {/* Moon */}
      <circle cx="120" cy="120" r="32" fill="#f5f8fc" opacity="0.9" />

      {/* Exposed seabed (when water low) */}
      <motion.path
        animate={{ d: `M 0 240 L 800 240 L 800 ${seaTop} L 0 ${seaTop} Z` }}
        transition={{ duration: 0.3 }}
        fill="#6a7848"
      />

      {/* Sea — animated level */}
      <motion.rect
        x="0"
        width="800"
        animate={{ y: seaTop, height: 480 - seaTop }}
        transition={{ duration: 0.3 }}
        fill="url(#cp-water)"
      />

      {/* Oil platforms */}
      <g transform="translate(420, 240)">
        <rect x="-30" y="-10" width="60" height="10" fill="#5a5a60" />
        <line x1="-25" y1="0" x2="-30" y2="50" stroke="#3a3a40" strokeWidth="3" />
        <line x1="25" y1="0" x2="30" y2="50" stroke="#3a3a40" strokeWidth="3" />
        <polygon points="-8,-10 8,-10 12,-70 -12,-70" fill="#3a3a40" />
        <ellipse cx="0" cy="-80" rx="5" ry="10" fill="#ffaa55" opacity="0.9" />
      </g>
      <g transform="translate(630, 280)">
        <rect x="-20" y="-7" width="40" height="7" fill="#4a4a50" />
        <line x1="-15" y1="0" x2="-18" y2="35" stroke="#3a3a40" strokeWidth="2.5" />
        <line x1="15" y1="0" x2="18" y2="35" stroke="#3a3a40" strokeWidth="2.5" />
        <polygon points="-5,-7 5,-7 7,-45 -7,-45" fill="#3a3a40" />
        <ellipse cx="0" cy="-52" rx="3" ry="6" fill="#ffaa55" opacity="0.85" />
      </g>

      {/* Seal */}
      {seaLevel > 0.3 && (
        <g transform="translate(680, 400)" fill="#2a3540" opacity={Math.min(1, seaLevel * 1.5)}>
          <ellipse cx="0" cy="0" rx="22" ry="6" />
          <circle cx="-18" cy="-4" r="4" />
        </g>
      )}
    </svg>
  );
}

// ============================================================
// IRTYSH — река через 3 страны, толщина зависит от waterFlow
// ============================================================
function IrtyshScene({
  indicators,
  lang,
}: SceneProps & { lang: "kk" | "ru" }) {
  const flow = indicators.waterFlow ?? 5;
  // 3..10 km3/yr range
  const thickness = Math.max(3, Math.min(20, (flow / 10) * 20));
  const pollution = indicators.pollutionIndex ?? 50;
  const riverColor = pollution > 60 ? "#6a5530" : pollution > 30 ? "#3da9c9" : "#5cd0e8";
  const labels = COUNTRY_LABELS[lang];

  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1828" />
          <stop offset="100%" stopColor="#2a3a4e" />
        </linearGradient>
      </defs>

      <rect width="800" height="480" fill="url(#ir-bg)" />

      {/* Three country bands */}
      <rect x="0" y="0" width="800" height="160" fill="#5a3030" opacity="0.3" />
      <rect x="0" y="160" width="800" height="180" fill="#3a4a30" opacity="0.3" />
      <rect x="0" y="340" width="800" height="140" fill="#30303a" opacity="0.3" />

      {/* Country labels */}
      <text x="690" y="90" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="20" fontWeight="700" textAnchor="middle">{labels.china}</text>
      <text x="100" y="260" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="20" fontWeight="700">{labels.kazakhstan}</text>
      <text x="100" y="420" fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="20" fontWeight="700">{labels.russia}</text>

      {/* Borders */}
      <line x1="0" y1="160" x2="800" y2="160" stroke="#E8A93C" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
      <line x1="0" y1="340" x2="800" y2="340" stroke="#E8A93C" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />

      {/* River — thickness depends on flow */}
      <motion.path
        d="M 740 30 Q 700 80 660 130 Q 600 200 540 230 Q 470 270 400 300 Q 330 340 250 380 Q 180 430 100 470"
        stroke={riverColor}
        animate={{ strokeWidth: thickness }}
        transition={{ duration: 0.3 }}
        fill="none"
        strokeLinecap="round"
      />

      {/* Canal diverting (red, in China zone) */}
      <line x1="660" y1="130" x2="780" y2="60" stroke="#C0463C" strokeWidth="3" strokeDasharray="3 4" opacity="0.85" />

      {/* Cities */}
      <circle cx="540" cy="230" r="5" fill="#E8A93C" />
      <circle cx="400" cy="300" r="5" fill="#E8A93C" />
      <circle cx="250" cy="380" r="5" fill="#E8A93C" />
    </svg>
  );
}

function DefaultScene() {
  return (
    <svg viewBox="0 0 800 480" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="480" fill="#1a2540" />
    </svg>
  );
}

// Suppress unused import warning if AnimatePresence not used in any scene
void AnimatePresence;
