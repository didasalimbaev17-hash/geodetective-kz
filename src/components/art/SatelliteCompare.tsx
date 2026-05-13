"use client";

import { cn } from "@/lib/utils";

type Theme = "lake-shrinking" | "lake-stable" | "city-growing" | "default";

/**
 * SVG-симуляция спутникового снимка "до/после".
 * Не реальное фото — стилизованный схематичный вид сверху.
 */
export function SatelliteFrame({
  year,
  theme = "default",
  state = "before",
  className,
}: {
  year: number | string;
  theme?: Theme;
  state?: "before" | "after";
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {theme === "lake-shrinking" && state === "before" && <LakeBefore />}
        {theme === "lake-shrinking" && state === "after" && <LakeAfter />}
        {theme !== "lake-shrinking" && <DefaultGround />}

        {/* Grid lines (satellite) */}
        <g stroke="#E8A93C" strokeWidth="0.3" opacity="0.25">
          <line x1="0" y1="100" x2="400" y2="100" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="0" y1="300" x2="400" y2="300" />
          <line x1="100" y1="0" x2="100" y2="400" />
          <line x1="200" y1="0" x2="200" y2="400" />
          <line x1="300" y1="0" x2="300" y2="400" />
        </g>

        {/* Crosshair center */}
        <g stroke="#E8A93C" strokeWidth="0.6" opacity="0.6" fill="none">
          <line x1="195" y1="200" x2="205" y2="200" />
          <line x1="200" y1="195" x2="200" y2="205" />
        </g>

        {/* Top-left frame label */}
        <g transform="translate(12, 24)">
          <text fill="#E8A93C" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="2">
            SAT · {year}
          </text>
        </g>

        {/* Top-right coords */}
        <g transform="translate(388, 24)">
          <text fill="#A6A294" fontFamily="ui-monospace, monospace" fontSize="8" textAnchor="end">
            45.0°N · 60.0°E
          </text>
        </g>

        {/* Bottom corner brackets */}
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

function LakeBefore() {
  return (
    <g>
      {/* Land */}
      <rect width="400" height="400" fill="#2a3018" />
      {/* Pixelated noise — like satellite ground */}
      <g fill="#3a4020" opacity="0.6">
        <rect x="0" y="0" width="20" height="20" />
        <rect x="40" y="20" width="20" height="20" />
        <rect x="80" y="0" width="20" height="20" />
        <rect x="320" y="40" width="20" height="20" />
        <rect x="360" y="0" width="20" height="20" />
        <rect x="20" y="340" width="20" height="20" />
        <rect x="340" y="360" width="20" height="20" />
        <rect x="380" y="320" width="20" height="20" />
      </g>

      {/* Big lake — full size 1989 */}
      <ellipse cx="200" cy="200" rx="155" ry="125" fill="#1a4a68" />
      <ellipse cx="200" cy="195" rx="148" ry="118" fill="#2a6a88" />
      <ellipse cx="200" cy="190" rx="135" ry="105" fill="#3da9c9" />

      {/* Inner ripples / shoals */}
      <ellipse cx="170" cy="180" rx="40" ry="25" fill="#5cc8e3" opacity="0.4" />
      <ellipse cx="240" cy="220" rx="30" ry="18" fill="#5cc8e3" opacity="0.4" />

      {/* Rivers feeding the lake */}
      <path d="M 0 80 Q 80 100 130 130 L 150 145" stroke="#3da9c9" strokeWidth="3" fill="none" />
      <path d="M 400 80 Q 320 100 270 130 L 250 145" stroke="#3da9c9" strokeWidth="3" fill="none" />
    </g>
  );
}

function LakeAfter() {
  return (
    <g>
      {/* Land — desertified */}
      <rect width="400" height="400" fill="#5a3520" />
      {/* Salt/sand patterns where lake used to be */}
      <ellipse cx="200" cy="200" rx="155" ry="125" fill="#7a5535" opacity="0.7" />
      <ellipse cx="200" cy="200" rx="155" ry="125" fill="none" stroke="#e8d8b0" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

      {/* Salt patches */}
      <g fill="#e8d8b0" opacity="0.4">
        <ellipse cx="150" cy="180" rx="30" ry="6" />
        <ellipse cx="240" cy="210" rx="35" ry="7" />
        <ellipse cx="180" cy="240" rx="25" ry="5" />
        <ellipse cx="270" cy="170" rx="28" ry="6" />
      </g>

      {/* Tiny remnant of water (north Aral) */}
      <ellipse cx="180" cy="155" rx="42" ry="20" fill="#1a4a68" />
      <ellipse cx="180" cy="153" rx="38" ry="17" fill="#3da9c9" />

      {/* Cracked earth pattern */}
      <g stroke="#3a1f10" strokeWidth="0.4" opacity="0.5" fill="none">
        <path d="M 100 250 L 160 270 L 220 260 L 280 280" />
        <path d="M 80 300 L 150 310 L 220 305 L 290 320" />
        <path d="M 110 330 L 180 340 L 240 335" />
      </g>

      {/* Dried river beds */}
      <path d="M 0 80 Q 80 100 130 130 L 150 145" stroke="#3a1f10" strokeWidth="2" fill="none" strokeDasharray="3 2" opacity="0.6" />
      <path d="M 400 80 Q 320 100 270 130 L 250 145" stroke="#3a1f10" strokeWidth="2" fill="none" strokeDasharray="3 2" opacity="0.6" />
    </g>
  );
}

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
