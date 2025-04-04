"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutPage from "@/app/components/CheckoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get("amount")) || 0; // Get the amount from query params

  // State for form fields
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postCode: "",
    state: "",
  });

  const [isValid, setIsValid] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate form after updating state
    validateForm({ ...formData, [name]: value });
  };

  // Function to validate form
  const validateForm = (data) => {
    const isFilled = data.address && data.city && data.postCode && data.state;
    setIsValid(isFilled);
  };

  return (
    <>
      {/* Address Form */}
      <div className="border border-formborder rounded-md p-10">
        
          <label htmlFor="address" className="block font-semibold">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            className="border-formborder border my-5 py-1.5 rounded-md pl-2 w-full"
            placeholder="Enter Your Address"
            rows={4}
            required
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="flex justify-between">
            <div>
              <label htmlFor="city" className="block font-semibold">
                City
              </label>
              <input
                required
                type="text"
                id="city"
                name="city"
                className="border-formborder border my-5 py-1.5 rounded-md pl-2"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="postCode" className="block font-semibold">
                Post Code
              </label>
              <input
                required
                type="text"
                id="postCode"
                name="postCode"
                className="border-formborder border my-5 py-1.5 rounded-md pl-2"
                placeholder="Enter Post Code"
                value={formData.postCode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="state" className="block font-semibold">
                State
              </label>
              <input
                required
                type="text"
                id="state"
                name="state"
                className="border-formborder border my-5 py-1.5 rounded-md pl-2"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>
      </div>

      {/* Payment Section */}
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Checkout</h1>
          <h2 className="text-2xl">
            Your Price
            <span className="font-bold"> ₹{amount.toFixed(2)}</span>
          </h2>
        </div>

        {/* Stripe Payment */}
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "jpy",
          }}
        >
          <CheckoutPage amount={amount} isValid={isValid} formData={formData}/>
        </Elements>
      </main>
    </>
  );
}
