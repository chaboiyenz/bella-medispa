import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/lib/context/CartContext";
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
    icon: "/bella.jpg",
    apple: "/bella.jpg",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
