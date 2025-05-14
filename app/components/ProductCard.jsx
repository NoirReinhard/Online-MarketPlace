"use client";
import React, { useState } from "react";
import Button from "../elements/Button";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import CartActions from "@/app/components/CartActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useUserContext } from "./UserContext";
import { usePathname } from "next/navigation";

const ProductCard = ({ product, ishome }) => {
  const [show, setshow] = useState(false);
  const { data: session } = useSession();
  const { profileImage } = useUserContext();
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const handleClick = () => {
    router.push(`seller/update-product?id=${product._id}`);
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      const res = await response.json();
      if (response.ok) {
        router.refresh();
        toast.success(res.message);
      } else {
        toast.error(errorData.error);
        console.error("Error deleting product:", errorData.error);
      }
    } catch (error) {
      console.error("Network error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={product._id}
      className="startup-card md:w-[370px] max-[825px]:w-[300px] flex flex-col h-[370px] w-[250px] md:h-[490px] group"
    >
      <div className="flex justify-between items-center">
        <p>{product.createdAt}</p>
        {(ishome == "False" || session?.user?.role == "admin") && (
          <FaTrash
            className="text-lg hover:cursor-pointer text-red-600"
            onClick={() => setshow(true)}
          />
        )}
      </div>
      <div>
        {show && (
          <>
            <div className="bg-black bg-opacity-50 fixed inset-0 z-40" />
            <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white p-5 rounded-lg">
                <p className="text-xl">Are you sure you want to delete?</p>
                <div className="flex justify-between items-center pt-[20px]">
                  <Button
                    label="Cancel"
                    backColor="bg-white"
                    color="text-black"
                    onClick={() => setshow(false)}
                  />
                  <Button
                    label={loading ? "Deleting..." : "Delete"}
                    onClick={handleDelete}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-16-medium md:pt-[20px] sm:pt-[8px]">
            {product.sellerId.username}
          </p>
          <p className="text-26-semibold  capitalize line-clamp-1">
            {product.name}
          </p>
        </div>
        <Link href={`/profile/${product.sellerId._id}`} passHref>
          <Image
            src={
              (pathname.startsWith("/profile") && profileImage) ||
              product.sellerId.imgURL ||
              "https://res.cloudinary.com/dpk7ntarg/image/upload/v1746411877/e48089c4-7a32-48ee-b879-0c8a69bbdbe4.png"
            }
            alt={product.sellerId.username}
            height={40}
            width={40}
            className="rounded-full w-[40px] h-[40px] object-cover"
          ></Image>
        </Link>
      </div>
      <p className="startup-card_desc">{product.description}</p>
      <Link href={`/products/${product._id}`} passHref>
        <Image
          src={product.imageUrl}
          width={150}
          height={150}
          alt="Product"
          className="w-[350px] md:h-[200px] h-[150px] object-cover max-w-[100%] rounded-lg pt-[5px]"
        />
      </Link>
      <div className="flex justify-between items-center pt-[15px] ">
        <p className="font-semibold text-2xl">₹{product.price}</p>
        {!(session?.user?.id == product.sellerId._id) ? (
          <CartActions product={product} />
        ) : (
          <Button label="Update Product" onClick={() => handleClick()}></Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
