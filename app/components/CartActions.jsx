"use client";
import { useCart } from "@/app/components/CartContext";

const CartActions = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="border-formborder border py-1  px-4 bg-button_color text-white  font-semibold rounded-md"
    >
      Add to Cart
    </button>
  );
};

export default CartActions;