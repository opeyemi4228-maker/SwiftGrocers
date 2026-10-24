import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import MobileTabBar from "@/components/layout/MobileTabBar";
import CartDrawer from "@/components/cart/CartDrawer";
import Toasts from "@/components/layout/Toasts";
import LocationPicker from "@/components/location/LocationPicker";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import { SITE, organizationLd, websiteLd } from "@/lib/seo";

const sans = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SwiftGrocers | Order Foodstuff & Groceries Online in Nigeria",
    template: "%s · SwiftGrocers",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "buy foodstuff online",
    "online grocery Lagos",
    "grocery delivery Abuja",
    "foodstuff delivery Port Harcourt",
    "buy rice online Nigeria",
    "soup ingredients delivery",
    "egusi soup pack",
    "pay on delivery groceries",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: "SwiftGrocers | Skip the market. Keep the freshness.",
    description: "Fresh foodstuff and groceries at your door in under 2 hours. Lagos, Abuja, Port Harcourt and Ibadan. Pay on delivery.",
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: "SwiftGrocers | Skip the market. Keep the freshness.",
    description: "Foodstuff delivered in under 2 hours. Pay on delivery.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: true, address: false, email: false },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f4d3a" },
    { media: "(prefers-color-scheme: dark)", color: "#13100d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG" className={sans.variable}>
      <body className="min-h-dvh pb-tabbar font-sans">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <AppContextProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>

          <MobileTabBar />
          <CartDrawer />
          <LocationPicker />
          <WhatsAppButton />
          <Toasts />
        </AppContextProvider>
      </body>
    </html>
  );
}
