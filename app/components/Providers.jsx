"use client"; // Ensure this runs on the client side

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/app/components/CartContext";

export default function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={0}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
