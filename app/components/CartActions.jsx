"use client";
import { useCart } from "@/app/components/CartContext";

const CartActions = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  );
};

export default CartActions;