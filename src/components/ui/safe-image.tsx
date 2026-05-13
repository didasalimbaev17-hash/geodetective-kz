"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  fallbackHue?: number; // 0-360
};

/**
 * Image with graceful SVG fallback when remote URL fails (hotlink/CORS/404).
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackLabel,
  fallbackHue,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <Placeholder label={fallbackLabel ?? alt} hue={fallbackHue} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Placeholder({
  label,
  hue,
  className,
}: {
  label: string;
  hue?: number;
  className?: string;
}) {
  // Deterministic hue from label if not provided
  const h =
    hue ??
    Math.abs([...label].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % 360;

  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${h} 50% 20%) 0%, hsl(${(h + 60) % 360} 40% 12%) 100%)`,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`p${h}`}
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
          >
            <circle cx="10" cy="10" r="1" fill={`hsl(${h} 80% 70%)`} />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#p${h})`} />
      </svg>
      <div
        className="relative font-display font-bold tracking-tight"
        style={{
          color: `hsl(${h} 70% 75%)`,
          fontSize: "clamp(2rem, 8vw, 5rem)",
          textShadow: `0 2px 12px hsl(${h} 50% 15%)`,
        }}
      >
        {initials || "?"}
      </div>
    </div>
  );
}
