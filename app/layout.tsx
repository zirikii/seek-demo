import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SEEK";

export const metadata: Metadata = {
  title: {
    default: `${appName} — Australia's no. 1 jobs site (demo)`,
    template: `%s | ${appName}`,
  },
  description:
    "Unofficial SEEK-style jobs marketplace demo. Search jobs, save roles, build your profile and track applications.",
  icons: {
    icon: [
      { url: "/brand/icon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.ico", sizes: "any" },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: "#1F3C88",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
