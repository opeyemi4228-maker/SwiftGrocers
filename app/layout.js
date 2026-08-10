import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import MobileTabBar from "@/components/layout/MobileTabBar";
import CartDrawer from "@/components/cart/CartDrawer";
import Toasts from "@/components/layout/Toasts";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  metadataBase: new URL("https://swiftgrocers.com.ng"),
  title: {
    default: "SwiftGrocers — Fresh groceries delivered in hours",
    template: "%s · SwiftGrocers",
  },
  description:
    "Shop fresh produce, pantry staples and household essentials from vendors across Nigeria. Same-day delivery, transparent pricing, free over ₦25,000.",
  openGraph: {
    type: "website",
    siteName: "SwiftGrocers",
    title: "SwiftGrocers — Fresh groceries delivered in hours",
    description:
      "Fresh produce and everyday essentials, picked the day you order and delivered to your door.",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#13100d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh pb-tabbar font-sans">
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
          <Toasts />
        </AppContextProvider>
      </body>
    </html>
  );
}
