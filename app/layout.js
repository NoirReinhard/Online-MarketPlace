import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import { Toaster } from "sonner";
import { Playfair_Display } from "next/font/google";
import { UserProvider } from "./components/UserContext";

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tensai Trade",
  description:
    "An Online Marketplace where you can sell and buy the groceries you want",
  icons: {
    icon: "/assets/Background-Removed.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <UserProvider>
            <Navbar />
            <Toaster richColors />
            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
