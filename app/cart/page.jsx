"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const Page = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const calculateTotal = () => {
    let totalAmount = 0;
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.cquantity;
      let delivery = subtotal * 0.05;
      totalAmount = subtotal + delivery;
    });
    setTotal(totalAmount);
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const handleCheckout = () => {
    router.push(`/Payment?amount=${total.toFixed(2)}`);
  };

  return (
    <>
      <div className="min-h-[85vh] bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">SubTotal</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-15 rounded-lg h-12"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4 border rounded w-max py-1 px-2">
                      <button
                        className="text-gray-500 hover:text-gray-700 font-semibold"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.cquantity > 1
                              ? item.cquantity - 1
                              : item.cquantity
                          )
                        }
                      >
                        -
                      </button>
                      <p className="">{item.cquantity}</p>
                      <button
                        className="text-gray-500 hover:text-gray-700 font-semibold"
                        onClick={() =>
                          updateQuantity(item._id, item.cquantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    ${(item.price * item.cquantity).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <Link href="/" className="text-gray-500 underline">
              Continue Shopping
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">
                Total with Delivery Cost: ${total.toFixed(2)}
              </span>
              <button
                className="font-bold py-2 px-7 bg-gray-500 rounded-md text-white"
                onClick={() => clearCart()}
              >
                Clear Cart
              </button>
              <button
                className="font-bold py-2 px-7 bg-green-500 rounded-md text-white hover:bg-green-600"
                onClick={handleCheckout}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-24 right-4 text-lg">
          <p>
            <span className="text-red-500">Note:</span> Delivery Cost is 5% of
            the Product Price
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;
