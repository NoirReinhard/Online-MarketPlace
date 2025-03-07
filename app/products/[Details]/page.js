import Button from "@/app/elements/Button";
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import Image from "next/image";
import React from "react";

const route = async ({ params }) => {
  const { Details } = await params;
  await connectDB();
  const products = await Product.findById(Details);
  const addcart = async (products) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", products.imageUrl);
    formData.append("productName", products.name);
    formData.append("price", products.price);
    formData.append("description", products.description);
    formData.append("quantity", products.quantity);
    formData.append("unit", products.unit);
    formData.append("stock", products.stock);
    formData.append("address", products.seller.address);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data) {
        router.push("/seller");
      } else {
        alert(data.error || "Failed to upload product");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("An error occurred while uploading the product.");
    }
  };

  return (
    <div>
      <div className="bg-primary flex justify-center h-[200px] flex-col items-center gap-4">
        <p className="bg-gold w-max py-2 px-5 rounded-md font-bold uppercase">
          {products.createdAt}
        </p>
        <h1 className="text-6xl font-bold uppercase bg-black text-white py-2 px-5">
          {products.name}
        </h1>
      </div>
      <div className="sm:px-16 px-8 sm:py-10 pb-12 flex gap-[50px] items-center">
        <div>
          <Image
            src={products.imageUrl}
            alt={products.name}
            height={550}
            width={650}
            className="rounded border-solid border-[5px] border-formborder h-[420px] w-[470px] object-cover"
          ></Image>
        </div>
        <div className="mt-[20px] flex flex-col gap-4">
          <p className="font-bold text-2xl">{products.seller.name}</p>
          <p className="font-semibold text-sm mt-[-12px] text-gray-500">
            {products.seller.email}
          </p>
          <p className="font-semibold text-lg w-[300px]">
            {products.description}
          </p>
          <p className="font-bold text-2xl">₹{products.price}</p>
          <p className="font-semibold text-lg">
            Quantity:{products.quantity}
            {products.unit}
          </p>
          <div className="flex gap-4 items-center">
            <Button
              label="ADD TO CART"
              backColor="bg-border"
              color="text-white"
              className="py-2 font-semibold"
              onClick={() => addcart(products)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default route;
