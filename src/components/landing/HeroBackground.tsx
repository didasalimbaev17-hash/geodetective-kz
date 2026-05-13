"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-float" />
      <div className="absolute top-40 left-10 w-[400px] h-[400px] rounded-full bg-secondary/15 blur-[80px]" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-danger/8 blur-[100px]" />

      {/* Decorative compass */}
      <motion.div
        className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] compass-decor opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${(i * 13 + 7) % 100}%`,
            top: `${(i * 17 + 11) % 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scan line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_20px_hsl(var(--primary)/0.6)] animate-scan-line" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background" />
    </div>
  );
}
