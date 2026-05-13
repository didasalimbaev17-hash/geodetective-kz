"use client";

import { cn } from "@/lib/utils";

/**
 * Тематические SVG-«фото» для evidence (вместо рандомных picsum).
 * Идентифицируется по `kind` или по подстроке в src.
 */
export function EvidencePhoto({
  kind,
  className,
}: {
  kind?: string;
  className?: string;
}) {
  const Comp = PHOTOS[kind ?? ""] ?? GenericPhoto;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Comp />
    </div>
  );
}

// ============================================================
// Aral rusty ship
// ============================================================
function AralRustyShip() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="erp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2840" />
          <stop offset="60%" stopColor="#7a4838" />
          <stop offset="100%" stopColor="#c8884c" />
        </linearGradient>
        <linearGradient id="erp-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a6840" />
          <stop offset="100%" stopColor="#3a2010" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#erp-sky)" />

      {/* Distant haze */}
      <ellipse cx="400" cy="280" rx="500" ry="50" fill="#a06848" opacity="0.4" />

      {/* Far mountains */}
      <path d="M 0 270 L 150 240 L 280 260 L 420 230 L 560 255 L 720 235 L 800 245 L 800 320 L 0 320 Z" fill="#3a2818" opacity="0.6" />

      {/* Sand foreground */}
      <path d="M 0 280 L 800 280 L 800 500 L 0 500 Z" fill="url(#erp-sand)" />

      {/* Cracked earth */}
      <g stroke="#3a1f10" strokeWidth="0.8" opacity="0.6" fill="none">
        <path d="M 50 380 L 200 365 L 350 385 L 500 370 L 650 390 L 800 380" />
        <path d="M 30 430 L 180 420 L 330 435 L 480 425 L 630 440 L 780 430" />
        <path d="M 0 470 L 150 460 L 300 475 L 450 465 L 600 480 L 750 470" />
      </g>

      {/* Salt flats */}
      <ellipse cx="200" cy="395" rx="80" ry="6" fill="#e8e0c8" opacity="0.5" />
      <ellipse cx="550" cy="430" rx="100" ry="8" fill="#e8e0c8" opacity="0.5" />

      {/* MAIN SHIP — large, central */}
      <g transform="translate(220, 200)">
        {/* Hull massive */}
        <path
          d="M 0 100 L 30 50 L 330 50 L 360 100 L 330 160 L 30 160 Z"
          fill="#5a3020"
          stroke="#3a1f10"
          strokeWidth="2.5"
        />
        {/* Hull stripes */}
        <line x1="20" y1="80" x2="340" y2="80" stroke="#3a1f10" strokeWidth="1" opacity="0.7" />
        <line x1="20" y1="130" x2="340" y2="130" stroke="#8a4020" strokeWidth="0.5" opacity="0.6" />

        {/* Deck */}
        <rect x="100" y="10" width="160" height="40" fill="#6a4030" stroke="#3a1f10" strokeWidth="1.5" />
        {/* Deck cabin */}
        <rect x="135" y="-25" width="90" height="35" fill="#7a5040" stroke="#3a1f10" />
        {/* Windows */}
        <rect x="148" y="-15" width="18" height="12" fill="#4a3020" />
        <rect x="172" y="-15" width="18" height="12" fill="#4a3020" />
        <rect x="196" y="-15" width="18" height="12" fill="#4a3020" />
        {/* Roof */}
        <rect x="155" y="-35" width="50" height="10" fill="#5a3020" />

        {/* Mast */}
        <line x1="180" y1="-35" x2="180" y2="-90" stroke="#3a1f10" strokeWidth="3.5" />
        {/* Crow's nest */}
        <rect x="172" y="-92" width="16" height="6" fill="#3a1f10" />
        {/* Boom */}
        <line x1="180" y1="-65" x2="240" y2="-50" stroke="#3a1f10" strokeWidth="2" />

        {/* Rust streaks down hull */}
        <g stroke="#8a4020" strokeWidth="1.5" opacity="0.7">
          <line x1="50" y1="55" x2="55" y2="155" />
          <line x1="80" y1="50" x2="85" y2="160" />
          <line x1="120" y1="50" x2="125" y2="155" />
          <line x1="200" y1="50" x2="205" y2="158" />
          <line x1="260" y1="50" x2="265" y2="155" />
          <line x1="300" y1="55" x2="305" y2="160" />
          <line x1="330" y1="60" x2="335" y2="155" />
        </g>

        {/* Anchor */}
        <line x1="20" y1="100" x2="-20" y2="170" stroke="#3a1f10" strokeWidth="2" strokeDasharray="3 2" />

        {/* Shadow under ship */}
        <ellipse cx="180" cy="170" rx="220" ry="10" fill="#000" opacity="0.5" />
      </g>

      {/* Crow */}
      <g transform="translate(560, 110)" opacity="0.7">
        <path d="M 0 0 Q 8 -6 16 0 Q 24 -6 32 0" stroke="#1a1010" strokeWidth="1.5" fill="none" />
      </g>

      {/* Sun in haze */}
      <circle cx="640" cy="180" r="32" fill="#ffd27a" opacity="0.7" />
    </svg>
  );
}

// ============================================================
// Generic — пыльный пейзаж
// ============================================================
function GenericPhoto() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gph-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2030" />
          <stop offset="100%" stopColor="#3a3548" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#gph-bg)" />
      <g transform="translate(400, 250)">
        <circle cx="0" cy="0" r="60" fill="none" stroke="#E8A93C" strokeWidth="2" opacity="0.5" />
        <path d="M -25 0 L 25 0 M 0 -25 L 0 25" stroke="#E8A93C" strokeWidth="2" opacity="0.5" />
      </g>
    </svg>
  );
}

const PHOTOS: Record<string, React.ComponentType> = {
  "aral-rusty-ship": AralRustyShip,
};
