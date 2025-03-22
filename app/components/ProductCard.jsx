"use client";
import React, { useState } from "react";
import Button from "../elements/Button";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "@/app/components/CartContext";
import CartActions from "@/app/components/CartActions";

const ProductCard = ({ product, ishome }) => {
  const { addToCart } = useCart();
  const [check, setcheck] = useState(false);
  const [show, setshow] = useState(false);
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Product deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData.error);
      }
    } catch (error) {
      console.error("Network error deleting product:", error);
    }
  };

  return (
    <div
      key={product._id}
      className="startup-card w-[350px] flex flex-col h-[490px] group"
    >
      <div className="flex justify-between items-center">
        <p>{product.createdAt}</p>
        {ishome == "False" && (
          <FaTrash
            className="text-lg hover:cursor-pointer text-red-600"
            onClick={() => setshow(true)}
          />
        )}
      </div>
      <div>
        {show && (
          <div className="absolute top-0 left-0 w-[350px] h-[490px] bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg">
              <p className="text-2xl">Are you sure you want to delete?</p>
              <div className="flex justify-between items-center pt-[20px]">
                <Button label="Cancel"  onClick={() => setshow(false)} />
                <button label="Delete" onClick={handleDelete} >Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-16-medium pt-[20px]">{product.seller.name}</p>
      <Link href={`/products/${product._id}`} passHref>
        <p className="text-26-semibold capitalize line-clamp-1">
          {product.name}
        </p>
        <p className="startup-card_desc">{product.description}</p>
        <Image
          src={product.imageUrl}
          width={150}
          height={150}
          alt="Product"
          className="w-[350px] h-[200px] object-cover max-w-[100%] rounded-lg pt-[5px]"
        />
        <div className="flex justify-between items-center pt-[15px] ">
          <p className="font-semibold text-2xl">₹{product.price}</p>
          <CartActions product={product} /> 
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
