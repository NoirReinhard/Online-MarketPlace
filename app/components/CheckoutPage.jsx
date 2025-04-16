"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import order from "@/action/order";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { useCart } from "../components/CartContext";
import { toast } from "sonner";

const CheckoutPage = ({ amount, isValid, formData }) => {
  const { clearCart, cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!isValid) {
      setErrorMessage("Please fill in all required fields before proceeding.");
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const res = await order(formData, cart);
    if (res.success == false) {
      toast.error(res.message);
      setLoading(false);
    } else {
      toast.success(res.message);
      clearCart();
      setLoading(false);

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:3000/payment-success?amount=${amount}`,
        },
      });
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div className="text-red-500 my-2">{errorMessage}</div>}

      <button
        disabled={!stripe || loading || !isValid}
        className={`text-white w-full p-5 mt-2 rounded-md font-bold ${
          !isValid
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        } disabled:opacity-50 disabled:animate-pulse`}
      >
        {!loading ? `Pay ₹${amount.toFixed(2)}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
