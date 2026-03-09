import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { GlobalShell } from "@/components/GlobalShell";
import { AdminModeProvider } from "@/lib/context/AdminModeContext";
import { getAdminStatus } from "@/lib/auth";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bella MediSpa | Premium Aesthetic Treatments",
    template: "%s | Bella MediSpa",
  },
  description:
    "Bella MediSpa offers premium aesthetic treatments — facials, microneedling, laser, and more. Book your appointment online today.",
  keywords: ["medispa", "aesthetics", "facial", "microneedling", "laser", "beauty"],
  icons: {
    icon: [
      { url: "/bella-icon.png", type: "image/png" },
    ],
    apple: "/bella-icon.png",
    shortcut: "/bella-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Bella MediSpa",
    title: "Bella MediSpa | Premium Aesthetic Treatments",
    description:
      "Premium aesthetic treatments and personalized skincare. Book online in minutes.",
    images: [{ url: "/bella.jpg" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getAdminStatus();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${playfair.variable} ${inter.className}`} suppressHydrationWarning={true}>
        {/* Wide-spectrum shield: ignore extension-injected attributes (e.g. bis_skin_checked) on metadata/content wrappers */}
        <div suppressHydrationWarning={true}>
          <AdminModeProvider isAdmin={isAdmin}>
            <Navbar />
            <GlobalShell>{children}</GlobalShell>
          </AdminModeProvider>
        </div>
      </body>
    </html>
  );
}
