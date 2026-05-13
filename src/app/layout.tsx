import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono, Source_Serif_4, Noto_Sans } from "next/font/google";

// Noto Sans — лучшая поддержка казахских диакритик (Ұ, Қ, Ң, Ғ, Ү, Ө, І, Һ, Ә)
const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Manrope — для display-заголовков, отлично читает казахский
const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  variable: "--font-source-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GeoDetective KZ",
  description:
    "Образовательная веб-игра-расследование по географии для учеников 10-11 классов Казахстана",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E1116",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="kk"
      className={`${notoSans.variable} ${manrope.variable} ${sourceSerif.variable} ${jetbrains.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
