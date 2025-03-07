import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "./components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tensai Trade",
  description:
    "An Online Marketplace where you can sell and buy the groceries you want ",
    icons: {
      icon: "/assets/favicon.png", 
    },
};

export default function RootLayout({ children }) {
  return (
    <SessionProvider refetchInterval={0}>
    <html lang="en">
      
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
        </body>
      
    </html>
    </SessionProvider>
  );
}
