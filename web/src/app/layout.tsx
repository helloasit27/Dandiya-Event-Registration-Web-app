import type { Metadata, Viewport } from "next";
import { Outfit, Yatra_One } from "next/font/google";
import { EVENT, ORG } from "@/lib/event";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const yatra = Yatra_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yatra",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${EVENT.name} · ${ORG.brand}`,
  description:
    "Two nights of non-stop garba at Plutone Mall, Rourkela — 17 & 18 October 2026. Live DJ, live dhol, gift hampers and food included. ₹499 per person.",
  openGraph: {
    title: `${EVENT.name} · ${ORG.brand}`,
    description:
      "17 & 18 October 2026 · 6–10 PM · Plutone Mall, 6th Floor, Rourkela. Food included. ₹499 per person.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e0621",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${yatra.variable}`}>
      <body>{children}</body>
    </html>
  );
}
