import { redirect } from "next/navigation";
import React from "react";
import { getSession } from "../lib/getSession";
import SellItems from "@/app/components/SellItems";
import Image from "next/image";
import connectDB from "../lib/db";
import Product from "../models/Products";
import Button from "../elements/Button";

const seller = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) {
    if (user.role == "buyer") redirect("/");
  } else redirect("/Login");
  await connectDB();
  const product = await Product.find({ "seller.email": user.email });
  return (
    <>
      <div className="sm:px-16 px-8 sm:py-10 pb-12 card_grid gap-5">
        {product.map((product) => (
          <div key={product._id} className="startup-card w-[350px] flex flex-col h-[490px] group">
            <p className="">{product.createdAt}</p>
            <p className="text-16-medium pt-[20px]">{product.seller.name}</p>
            <p className="text-26-semibold capitalize line-clamp-1">{product.name}</p>
            <p className=" startup-card_desc">{product.description}</p>
            <Image
              src={product.imageUrl}
              width={150}
              height={150}
              alt="Obito"
              className="w-[350px] h-[200px] object-cover max-w-[100%] rounded-lg pt-[5px]"
            />
            <div className="flex justify-between items-center pt-[15px] ">
            <p className="font-semibold text-2xl">₹{product.price}</p>
            <Button label="Add To Cart" rounded />
            </div>
          </div>
        ))}
      </div>      
    </>
  );
};

export default seller;
