import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../styles/blackswan-tokens.css";
import "../styles/aether-monochrome.css";
import "../styles/midnight-terminal.css";

// Minimal PUBLIC-ONLY root layout for the extracted marketing site.
// (Drops the auth/db/scheduler/sidebar/topbar stack from the full hub layout
// so the build stays small and doesn't pull better-sqlite3 / Supabase auth.)

export const metadata: Metadata = {
  title: {
    default: "ROI Marketing — You don't spend on marketing. You invest in ROI.",
    template: "%s · Marketing Hub",
  },
  description:
    "Campaigns, content, email, SEO, ads, analytics, CRM, landing pages, automation. Run marketing like a $50M team — solo.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background-100 text-[rgb(var(--text))] antialiased">
        {children}
      </body>
    </html>
  );
}