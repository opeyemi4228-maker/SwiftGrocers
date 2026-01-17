import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const outfit = Montserrat({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "SwiftGrocers - Your Online Grocery Store",
  description: "Shop fresh groceries online with SwiftGrocers. Enjoy fast delivery, great deals, and a wide selection of products at your fingertips.",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
  );
}
