"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutPage from "@/app/components/CheckoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import order from "@/action/order";
import { useCart } from "../components/CartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function PaymentPage() {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get("amount")) || 0;
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postCode: "",
    state: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await order(formData, cart);
    if (res.success == false) {
      toast.error(res.message);
      setLoading(false);
    } else {
      clearCart();
      setLoading(false);
      router.push("/orders");
      toast.success(res.message);
      // Redirect to the products page after successful payment
    }
  };
  const [isValid, setIsValid] = useState(false);
  const [option, setOption] = useState("card");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateForm({ ...formData, [name]: value });
  };

  const validateForm = (data) => {
    const isFilled = data.address && data.city && data.postCode && data.state;
    setIsValid(isFilled);
  };

  return (
    <>
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
              Phone Number
            </label>
            <input
              required
              type="text"
              id="postCode"
              name="postCode"
              className="border-formborder border my-5 py-1.5 rounded-md pl-2"
              placeholder="Enter Phone Number"
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

      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Checkout</h1>
          <h2 className="text-2xl">
            Your Price
            <span className="font-bold"> ₹{amount.toFixed(2)}</span>
          </h2>
        </div>
        <h3 className="text-xl font-semibold mb-4">Choose Payment Method:</h3>
        <div className="flex justify-center gap-6 my-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={option === "card"}
              onChange={(e) => setOption(e.target.value)}
            />
            Pay On Delivery
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="onDelivery"
              checked={option === "onDelivery"}
              onChange={(e) => setOption(e.target.value)}
            />
            Pay with Card
          </label>
        </div>
        {option === "onDelivery" ? (
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount),
              currency: "jpy",
            }}
          >
            <CheckoutPage
              amount={amount}
              isValid={isValid}
              formData={formData}
            />
          </Elements>
        ) : (
          <div className="text-center mt-10">
            <form onSubmit={handleSubmit}>
              <button
                disabled={loading || !isValid}
                className={`text-white w-full p-5 mt-2 rounded-md font-bold ${
                  !isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } disabled:opacity-50 disabled:animate-pulse`}
              >
                {!loading ? `Pay ₹${amount.toFixed(2)}` : "Processing..."}
              </button>
            </form>
            <p className="text-lg">
              You can pay in cash when the product is delivered.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
