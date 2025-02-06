"use client";
import React from "react";
import Button from "../elements/Button";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const ProductCard = ({ product, ishome }) => {
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
    <Link href={`/products/${product._id}`} passHref>
    <div
      key={product._id}
      className="startup-card w-[350px] flex flex-col h-[490px] group"
    >
      <div className="flex justify-between items-center">
        <p>{product.createdAt}</p>
        {ishome == "False" && (
          <FaTrash
            className="text-lg hover:cursor-pointer text-red-600"
            onClick={handleDelete}
          />
        )}
      </div>
      <p className="text-16-medium pt-[20px]">{product.seller.name}</p>
      <p className="text-26-semibold capitalize line-clamp-1">{product.name}</p>
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
        <Button label="Add To Cart" rounded />
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
