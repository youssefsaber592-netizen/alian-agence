import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "ALIAN STORE — Modern home & lifestyle essentials",
    template: "%s | ALIAN STORE",
  },
  description:
    "A curated online store for modern home, kitchen, bathroom and lifestyle products with an Arabic-first, fully bilingual experience.",
  keywords: [
    "ALIAN STORE",
    "home decor",
    "kitchen supplies",
    "bathroom accessories",
    "متجر",
    "ديكور",
  ],
  openGraph: {
    title: "ALIAN STORE — Modern home & lifestyle essentials",
    description:
      "Curated products, honest prices and a calm shopping experience in Arabic and English.",
    type: "website",
    locale: "ar_EG",
  },
};

export const viewport: Viewport = {
  themeColor: "#05080f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${fontVariables} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
