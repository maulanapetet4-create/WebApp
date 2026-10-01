import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Laporan Harian Data Mesin CNC", description: "F-PRD-003 digital" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body><main className="mx-auto min-h-screen max-w-xl">{children}</main></body>
    </html>
  );
}
