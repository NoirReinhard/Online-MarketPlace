import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata = {
  title: "Tensai Trade",
  description:
    "An Online Marketplace where you can sell and buy the groceries you want",
  icons: {
    icon: "/assets/favicon-32x32-removebg-preview.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <Toaster richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
