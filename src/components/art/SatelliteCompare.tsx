"use client";

import { cn } from "@/lib/utils";

type Theme =
  | "aral"
  | "balkhash"
  | "almaty"
  | "semey"
  | "caspian"
  | "irtysh"
  | "default";

/**
 * Стилизованный спутниковый снимок до/после. Подбирает сцену по теме кейса.
 */
export function SatelliteFrame({
  year,
  scenarioId,
  state = "before",
  className,
}: {
  year: number | string;
  scenarioId?: string;
  state?: "before" | "after";
  className?: string;
}) {
  const theme = themeFromScenario(scenarioId);

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Scene theme={theme} state={state} />

        {/* Satellite grid overlay */}
        <g stroke="#E8A93C" strokeWidth="0.3" opacity="0.2">
          <line x1="0" y1="100" x2="400" y2="100" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="0" y1="300" x2="400" y2="300" />
          <line x1="100" y1="0" x2="100" y2="400" />
          <line x1="200" y1="0" x2="200" y2="400" />
          <line x1="300" y1="0" x2="300" y2="400" />
        </g>

        {/* Crosshair center */}
        <g stroke="#E8A93C" strokeWidth="0.6" opacity="0.7" fill="none">
          <line x1="195" y1="200" x2="205" y2="200" />
          <line x1="200" y1="195" x2="200" y2="205" />
        </g>

        {/* Frame label */}
        <g transform="translate(12, 24)">
          <text fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="2">
            SAT · {year}
          </text>
        </g>

        {/* Corner brackets */}
        <g stroke="#E8A93C" strokeWidth="1" fill="none" opacity="0.7">
          <path d="M 8 8 L 8 24 M 8 8 L 24 8" />
          <path d="M 392 8 L 392 24 M 392 8 L 376 8" />
          <path d="M 8 392 L 8 376 M 8 392 L 24 392" />
          <path d="M 392 392 L 392 376 M 392 392 L 376 392" />
        </g>
      </svg>
    </div>
  );
}

function themeFromScenario(scenarioId?: string): Theme {
  if (!scenarioId) return "default";
  if (scenarioId.includes("aral")) return "aral";
  if (scenarioId.includes("balkhash")) return "balkhash";
  if (scenarioId.includes("almaty")) return "almaty";
  if (scenarioId.includes("semey")) return "semey";
  if (scenarioId.includes("caspian")) return "caspian";
  if (scenarioId.includes("irtysh")) return "irtysh";
  return "default";
}

function Scene({ theme, state }: { theme: Theme; state: "before" | "after" }) {
  switch (theme) {
    case "aral":
      return state === "before" ? <AralBefore /> : <AralAfter />;
    case "balkhash":
      return state === "before" ? <BalkhashBefore /> : <BalkhashAfter />;
    case "almaty":
      return state === "before" ? <AlmatyBefore /> : <AlmatyAfter />;
    case "semey":
      return state === "before" ? <SemeyBefore /> : <SemeyAfter />;
    case "caspian":
      return state === "before" ? <CaspianBefore /> : <CaspianAfter />;
    case "irtysh":
      return state === "before" ? <IrtyshBefore /> : <IrtyshAfter />;
    default:
      return <DefaultGround />;
  }
}

// ============================================================
// ARAL
// ============================================================
function AralBefore() {
  return (
    <g>
      <rect width="400" height="400" fill="#2a3018" />
      <g fill="#3a4020" opacity="0.5">
        <rect x="0" y="0" width="20" height="20" />
        <rect x="40" y="20" width="20" height="20" />
        <rect x="320" y="40" width="20" height="20" />
        <rect x="20" y="340" width="20" height="20" />
        <rect x="340" y="360" width="20" height="20" />
      </g>
      <ellipse cx="200" cy="200" rx="155" ry="125" fill="#1a4a68" />
      <ellipse cx="200" cy="195" rx="148" ry="118" fill="#2a6a88" />
      <ellipse cx="200" cy="190" rx="135" ry="105" fill="#3da9c9" />
      <ellipse cx="170" cy="180" rx="40" ry="25" fill="#5cc8e3" opacity="0.4" />
      <ellipse cx="240" cy="220" rx="30" ry="18" fill="#5cc8e3" opacity="0.4" />
      <path d="M 0 80 Q 80 100 130 130 L 150 145" stroke="#3da9c9" strokeWidth="3" fill="none" />
      <path d="M 400 80 Q 320 100 270 130 L 250 145" stroke="#3da9c9" strokeWidth="3" fill="none" />
    </g>
  );
}

function AralAfter() {
  return (
    <g>
      <rect width="400" height="400" fill="#5a3520" />
      <ellipse cx="200" cy="200" rx="155" ry="125" fill="#7a5535" opacity="0.7" />
      <ellipse cx="200" cy="200" rx="155" ry="125" fill="none" stroke="#e8d8b0" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
      <g fill="#e8d8b0" opacity="0.4">
        <ellipse cx="150" cy="180" rx="30" ry="6" />
        <ellipse cx="240" cy="210" rx="35" ry="7" />
        <ellipse cx="180" cy="240" rx="25" ry="5" />
        <ellipse cx="270" cy="170" rx="28" ry="6" />
      </g>
      <ellipse cx="180" cy="155" rx="42" ry="20" fill="#1a4a68" />
      <ellipse cx="180" cy="153" rx="38" ry="17" fill="#3da9c9" />
      <g stroke="#3a1f10" strokeWidth="0.4" opacity="0.5" fill="none">
        <path d="M 100 250 L 160 270 L 220 260 L 280 280" />
        <path d="M 80 300 L 150 310 L 220 305 L 290 320" />
      </g>
      <path d="M 0 80 Q 80 100 130 130 L 150 145" stroke="#3a1f10" strokeWidth="2" fill="none" strokeDasharray="3 2" opacity="0.6" />
      <path d="M 400 80 Q 320 100 270 130 L 250 145" stroke="#3a1f10" strokeWidth="2" fill="none" strokeDasharray="3 2" opacity="0.6" />
    </g>
  );
}

// ============================================================
// BALKHASH (озеро с двумя половинами, сокращение)
// ============================================================
function BalkhashBefore() {
  return (
    <g>
      <rect width="400" height="400" fill="#1a2030" />
      <g fill="#2a3540" opacity="0.6">
        <rect x="0" y="0" width="15" height="15" />
        <rect x="50" y="40" width="15" height="15" />
        <rect x="350" y="30" width="15" height="15" />
        <rect x="20" y="370" width="15" height="15" />
      </g>
      {/* Big lake split horizontally */}
      <path d="M 50 180 Q 100 160 200 165 Q 300 170 360 185 Q 365 220 320 240 Q 240 250 150 245 Q 80 240 45 220 Z" fill="#1a4a68" />
      {/* Fresh (west) */}
      <path d="M 50 180 Q 100 160 200 165 L 200 245 Q 80 240 45 220 Z" fill="#3da9c9" />
      {/* Salt (east) */}
      <path d="M 200 165 Q 300 170 360 185 Q 365 220 320 240 Q 240 250 200 245 Z" fill="#a8b8a0" opacity="0.9" />
      {/* Divider */}
      <line x1="200" y1="155" x2="200" y2="255" stroke="#E8A93C" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
      {/* River feeding from south (Ile) */}
      <path d="M 200 400 Q 200 320 200 245" stroke="#3da9c9" strokeWidth="3" fill="none" />
    </g>
  );
}

function BalkhashAfter() {
  return (
    <g>
      <rect width="400" height="400" fill="#1a2030" />
      <g fill="#2a3540" opacity="0.6">
        <rect x="0" y="0" width="15" height="15" />
        <rect x="50" y="40" width="15" height="15" />
        <rect x="350" y="30" width="15" height="15" />
      </g>
      {/* Outline of original lake — dashed (gone) */}
      <path d="M 50 180 Q 100 160 200 165 Q 300 170 360 185 Q 365 220 320 240 Q 240 250 150 245 Q 80 240 45 220 Z" fill="none" stroke="#3a4560" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
      {/* Smaller lake — west half remains, east shrunken */}
      <path d="M 65 190 Q 110 175 200 180 L 200 235 Q 100 235 60 215 Z" fill="#3da9c9" />
      {/* East: just salt flats */}
      <path d="M 200 180 Q 280 180 320 195 Q 320 215 290 225 Q 240 230 200 230 Z" fill="#c8c0a0" opacity="0.7" />
      <g fill="#e8d8b0" opacity="0.4">
        <ellipse cx="260" cy="210" rx="30" ry="4" />
        <ellipse cx="300" cy="220" rx="20" ry="3" />
      </g>
      {/* Reduced river */}
      <path d="M 200 400 Q 200 320 200 230" stroke="#3da9c9" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* China canal taking water (red dashed) */}
      <path d="M 50 350 Q 100 360 150 380" stroke="#C0463C" strokeWidth="1.5" fill="none" strokeDasharray="3 2" opacity="0.8" />
    </g>
  );
}

// ============================================================
// ALMATY (PM2.5: чистый воздух → смог)
// ============================================================
function AlmatyBefore() {
  return (
    <g>
      <rect width="400" height="400" fill="#1a3050" />
      {/* Mountains visible */}
      <path d="M 0 280 L 60 200 L 120 240 L 180 180 L 240 230 L 300 190 L 360 235 L 400 210 L 400 320 L 0 320 Z" fill="#2a3548" />
      <path d="M 160 195 L 180 180 L 200 195 Z M 280 205 L 300 190 L 320 205 Z" fill="#e0e8f0" opacity="0.8" />
      {/* City — well-lit, clear */}
      <g fill="#3a3548">
        <rect x="60" y="320" width="30" height="60" />
        <rect x="100" y="300" width="30" height="80" />
        <rect x="140" y="310" width="25" height="70" />
        <rect x="180" y="290" width="35" height="90" />
        <rect x="230" y="305" width="30" height="75" />
        <rect x="275" y="295" width="35" height="85" />
        <rect x="320" y="315" width="30" height="65" />
      </g>
      <g fill="#ffd27a" opacity="0.85">
        <rect x="105" y="320" width="3" height="3" />
        <rect x="115" y="335" width="3" height="3" />
        <rect x="185" y="305" width="3" height="3" />
        <rect x="200" y="320" width="3" height="3" />
        <rect x="280" y="310" width="3" height="3" />
        <rect x="290" y="330" width="3" height="3" />
      </g>
    </g>
  );
}

function AlmatyAfter() {
  return (
    <g>
      <rect width="400" height="400" fill="#3a2820" />
      {/* Mountains barely visible through smog */}
      <path d="M 0 280 L 60 200 L 120 240 L 180 180 L 240 230 L 300 190 L 360 235 L 400 210 L 400 320 L 0 320 Z" fill="#3a3030" opacity="0.5" />
      {/* Heavy smog layer */}
      <rect x="0" y="180" width="400" height="200" fill="#5a4838" opacity="0.7" />
      {/* Dim sun */}
      <circle cx="300" cy="150" r="22" fill="#ffaa55" opacity="0.5" />
      {/* City — dim through smog */}
      <g fill="#1a1518" opacity="0.9">
        <rect x="60" y="320" width="30" height="60" />
        <rect x="100" y="300" width="30" height="80" />
        <rect x="140" y="310" width="25" height="70" />
        <rect x="180" y="290" width="35" height="90" />
        <rect x="230" y="305" width="30" height="75" />
        <rect x="275" y="295" width="35" height="85" />
        <rect x="320" y="315" width="30" height="65" />
      </g>
      {/* CHP smokestacks belching */}
      <g>
        <rect x="350" y="265" width="4" height="55" fill="#1a1518" />
        <rect x="360" y="255" width="4" height="65" fill="#1a1518" />
        <ellipse cx="352" cy="255" rx="14" ry="10" fill="#5a4838" opacity="0.7" />
        <ellipse cx="362" cy="240" rx="18" ry="12" fill="#5a4838" opacity="0.6" />
      </g>
    </g>
  );
}

// ============================================================
// SEMEY (степь чистая → радиоактивный кратер)
// ============================================================
function SemeyBefore() {
  return (
    <g>
      <rect width="400" height="400" fill="#3a4028" />
      {/* Steppe pattern */}
      <g fill="#4a5028" opacity="0.6">
        {Array.from({ length: 30 }).map((_, i) => (
          <ellipse
            key={i}
            cx={(i * 47) % 400}
            cy={(i * 73) % 400}
            rx={8 + (i % 3) * 3}
            ry={3 + (i % 2) * 2}
          />
        ))}
      </g>
      {/* Small villages */}
      <g fill="#2a2018">
        <rect x="80" y="200" width="8" height="8" />
        <rect x="90" y="200" width="8" height="8" />
        <rect x="160" y="280" width="8" height="8" />
        <rect x="280" y="180" width="8" height="8" />
        <rect x="320" y="260" width="8" height="8" />
      </g>
      {/* Rivers */}
      <path d="M 0 150 Q 100 160 200 145 Q 300 135 400 150" stroke="#3da9c9" strokeWidth="2" fill="none" opacity="0.7" />
    </g>
  );
}

function SemeyAfter() {
  return (
    <g>
      <rect width="400" height="400" fill="#2a1818" />
      {/* Crater — central */}
      <radialGradient id="sm-crater">
        <stop offset="0%" stopColor="#1a0808" />
        <stop offset="40%" stopColor="#3a1818" />
        <stop offset="100%" stopColor="#5a2818" />
      </radialGradient>
      <circle cx="200" cy="200" r="80" fill="url(#sm-crater)" />
      <circle cx="200" cy="200" r="80" fill="none" stroke="#8a3020" strokeWidth="1.5" opacity="0.7" />
      <circle cx="200" cy="200" r="50" fill="none" stroke="#c04030" strokeWidth="1" opacity="0.5" />
      <circle cx="200" cy="200" r="25" fill="#0a0408" />
      {/* Radiation zones (rings) */}
      <circle cx="200" cy="200" r="120" fill="none" stroke="#C0463C" strokeWidth="0.6" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="200" cy="200" r="170" fill="none" stroke="#C0463C" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.4" />
      {/* Burned/dead villages */}
      <g fill="#1a0a08" opacity="0.7">
        <rect x="80" y="200" width="8" height="8" />
        <rect x="90" y="200" width="8" height="8" />
        <rect x="160" y="280" width="8" height="8" />
        <rect x="280" y="180" width="8" height="8" />
      </g>
      {/* Dry river */}
      <path d="M 0 150 Q 100 160 200 145 Q 300 135 400 150" stroke="#3a1f10" strokeWidth="1.5" fill="none" strokeDasharray="3 2" opacity="0.6" />
    </g>
  );
}

// ============================================================
// CASPIAN (уровень воды падает)
// ============================================================
function CaspianBefore() {
  return (
    <g>
      <rect width="400" height="400" fill="#3a4830" />
      {/* Land */}
      <path d="M 0 80 Q 80 70 160 90 Q 220 110 280 80 Q 340 60 400 80 L 400 0 L 0 0 Z" fill="#4a5530" />
      {/* Sea — large, fills bottom 70% */}
      <path d="M 0 80 Q 80 70 160 90 Q 220 110 280 80 Q 340 60 400 80 L 400 400 L 0 400 Z" fill="#1a3548" />
      {/* Coastal water lighter */}
      <path d="M 0 80 Q 80 70 160 90 Q 220 110 280 80 Q 340 60 400 80 L 400 120 L 0 120 Z" fill="#2a5070" opacity="0.7" />
      {/* Oil platforms */}
      <g fill="#3a3a40">
        <rect x="180" y="200" width="3" height="20" />
        <rect x="220" y="180" width="3" height="20" />
        <circle cx="181" cy="200" r="4" />
        <circle cx="221" cy="180" r="4" />
      </g>
      {/* Seal */}
      <ellipse cx="120" cy="280" rx="10" ry="3" fill="#2a3540" />
      <ellipse cx="320" cy="320" rx="10" ry="3" fill="#2a3540" />
    </g>
  );
}

function CaspianAfter() {
  return (
    <g>
      <rect width="400" height="400" fill="#3a4830" />
      {/* Original coastline (dashed) */}
      <path d="M 0 80 Q 80 70 160 90 Q 220 110 280 80 Q 340 60 400 80" stroke="#3a4560" strokeWidth="0.8" strokeDasharray="3 2" fill="none" opacity="0.5" />
      {/* New coastline (lower, retreated) */}
      <path d="M 0 130 Q 80 125 160 140 Q 220 155 280 130 Q 340 115 400 130 L 400 0 L 0 0 Z" fill="#4a5530" />
      {/* Exposed seabed (between old and new coastline) */}
      <path d="M 0 80 Q 80 70 160 90 Q 220 110 280 80 Q 340 60 400 80 L 400 130 Q 340 115 280 130 Q 220 155 160 140 Q 80 125 0 130 Z" fill="#6a7848" />
      {/* Cracked seabed pattern */}
      <g stroke="#3a2a18" strokeWidth="0.4" opacity="0.5" fill="none">
        <path d="M 30 100 L 90 105 L 140 100" />
        <path d="M 230 105 L 290 110 L 350 105" />
      </g>
      {/* Sea — smaller, lower */}
      <path d="M 0 130 Q 80 125 160 140 Q 220 155 280 130 Q 340 115 400 130 L 400 400 L 0 400 Z" fill="#1a3548" />
      {/* Oil platforms — now further from shore */}
      <g fill="#3a3a40">
        <rect x="180" y="240" width="3" height="20" />
        <rect x="220" y="220" width="3" height="20" />
        <circle cx="181" cy="240" r="4" />
        <circle cx="221" cy="220" r="4" />
      </g>
      {/* Oil spill */}
      <ellipse cx="200" cy="290" rx="35" ry="4" fill="#0a0008" opacity="0.7" />
    </g>
  );
}

// ============================================================
// IRTYSH (полноводная река → отвод воды в Китай)
// ============================================================
function IrtyshBefore() {
  return (
    <g>
      <rect width="400" height="400" fill="#2a3548" />
      {/* Country borders */}
      <line x1="0" y1="100" x2="400" y2="100" stroke="#E8A93C" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
      <line x1="0" y1="280" x2="400" y2="280" stroke="#E8A93C" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
      {/* Big healthy river meandering through */}
      <path
        d="M 360 0 Q 340 50 320 100 Q 280 150 240 200 Q 200 250 160 300 Q 120 350 60 400"
        stroke="#3da9c9"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 360 0 Q 340 50 320 100 Q 280 150 240 200 Q 200 250 160 300 Q 120 350 60 400"
        stroke="#5cb8d3"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Cities (dots) */}
      <circle cx="320" cy="100" r="4" fill="#E8A93C" />
      <circle cx="240" cy="200" r="4" fill="#E8A93C" />
      <circle cx="160" cy="300" r="4" fill="#E8A93C" />
    </g>
  );
}

function IrtyshAfter() {
  return (
    <g>
      <rect width="400" height="400" fill="#2a3548" />
      <line x1="0" y1="100" x2="400" y2="100" stroke="#E8A93C" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
      <line x1="0" y1="280" x2="400" y2="280" stroke="#E8A93C" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5" />
      {/* Thin river — depleted */}
      <path
        d="M 360 0 Q 340 50 320 100 Q 280 150 240 200 Q 200 250 160 300 Q 120 350 60 400"
        stroke="#3da9c9"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Dried banks */}
      <path
        d="M 360 0 Q 340 50 320 100 Q 280 150 240 200 Q 200 250 160 300 Q 120 350 60 400"
        stroke="#5a4828"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 360 0 Q 340 50 320 100 Q 280 150 240 200 Q 200 250 160 300 Q 120 350 60 400"
        stroke="#3da9c9"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Canal diverting water (red, in China zone) */}
      <path d="M 360 30 L 290 50 L 250 30" stroke="#C0463C" strokeWidth="3" strokeDasharray="3 2" fill="none" opacity="0.85" />
      <text x="200" y="55" fill="#C0463C" fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700">
        → Karamay
      </text>
      {/* Cities */}
      <circle cx="320" cy="100" r="4" fill="#E8A93C" />
      <circle cx="240" cy="200" r="4" fill="#E8A93C" />
      <circle cx="160" cy="300" r="4" fill="#E8A93C" />
    </g>
  );
}

// ============================================================
// DEFAULT (fallback)
// ============================================================
function DefaultGround() {
  return (
    <g>
      <rect width="400" height="400" fill="#1a2030" />
      <g fill="#2a3548" opacity="0.6">
        {Array.from({ length: 40 }).map((_, i) => (
          <rect
            key={i}
            x={(i * 47) % 400}
            y={(i * 73) % 400}
            width={10 + (i % 4) * 5}
            height={10 + (i % 3) * 4}
          />
        ))}
      </g>
      <ellipse cx="200" cy="220" rx="80" ry="50" fill="#3da9c9" opacity="0.6" />
    </g>
  );
}
