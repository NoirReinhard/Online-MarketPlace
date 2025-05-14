"use client";
import { useCart } from "@/app/components/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../elements/Button";

const CartActions = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const handleClick = () => {
    router.push(`/seller/update-product?id=${product._id}`);
  };
  return (
    <>
      {session?.user?.id == product.sellerId._id ? (
        <Button label="Update Product" onClick={() => handleClick()}></Button>
      ) : (
        <button
          onClick={() => addToCart(product)}
          className="border-formborder border py-1  px-4 bg-button_color text-white  font-semibold rounded-md"
        >
          Add to Cart
        </button>
      )}
    </>
  );
};

export default CartActions;
