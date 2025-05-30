// app/Payment/PaymentClient.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import order from "@/action/order";
import { useCart } from "../components/CartContext";
import { toast } from "sonner";

export default function PaymentClient() {
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

  const [isValid, setIsValid] = useState(false);
  const [option, setOption] = useState("card");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    validateForm(updatedForm);
  };

  const validateForm = (data) => {
    const isFilled = data.address && data.city && data.postCode && data.state;
    setIsValid(isFilled);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await order(formData, cart);
    if (!res.success) {
      toast.error(res.message);
      setLoading(false);
      return;
    }
    clearCart();
    toast.success(res.message);
    router.push("/orders");
  };

  return (
    <div>
      <div className="border border-formborder rounded-md p-10">
        {/* Address Form */}
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
    </div>
  );
}
