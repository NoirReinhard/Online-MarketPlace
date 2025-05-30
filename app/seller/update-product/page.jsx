import UpdateProductForm from "@/app/components/UpdateProductForm";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product update form...</div>}>
      <UpdateProductForm />
    </Suspense>
  );
}
