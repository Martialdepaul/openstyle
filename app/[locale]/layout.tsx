import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCategories } from "@/lib/products";
import { auth } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site-url";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** F11 : réglages par défaut hérités par toute page qui ne surcharge pas openGraph/twitter. */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: "OPENSTYLE", template: "%s — OPENSTYLE" },
  description: "Un style qui s'accorde à votre identité. Vêtements, sacs, accessoires et parfums — Yaoundé, Cameroun.",
  openGraph: {
    siteName: "OPENSTYLE",
    type: "website",
    images: [{ url: "/logo.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  const isCustomerLoggedIn = session?.user.role === "CUSTOMER";

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <Header categories={categories} isCustomerLoggedIn={isCustomerLoggedIn} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
