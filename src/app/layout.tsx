import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PreviewBanner } from "@/components/PreviewBanner";
import { siteConfig } from "@/config/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalSiteUrl),
  title: {
    default: `Lead Generation for IT Companies | ${siteConfig.brandName}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Reach relevant buyers through cold email, LinkedIn outreach, cold calling, and marketplace prospecting. Explore a managed programme for your IT company.",
  robots:
    siteConfig.siteMode === "preview"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <PreviewBanner />
        <Header />
        {/* tabIndex={-1} is what makes the skip link actually skip: a plain #id
            target is not focusable, so activating the link moved the viewport
            but left focus on <body>, and the next Tab went back to the header. */}
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        {siteConfig.gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${siteConfig.gaMeasurementId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
