// app/Payment/page.js
import { Suspense } from "react";
import PaymentClient from "../components/PaymentClient";

export const dynamic = "force-dynamic"; // Optional, disables static rendering if needed

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading Payment Page...</div>}>
      <PaymentClient />
    </Suspense>
  );
}
