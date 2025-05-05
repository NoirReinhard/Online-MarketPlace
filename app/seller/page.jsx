import { redirect } from "next/navigation";
import React from "react";
import { getSession } from "../lib/getSession";
import connectDB from "../lib/db";
import Product from "../models/Products";
import ProductCard from "../components/ProductCard";

const seller = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) {
    if (user.role == "buyer") redirect("/");
  } else redirect("/Login");
  await connectDB();
  const products1 = await Product.find();

  const products = await Product.find({ sellerId: user.id })
    .populate("sellerId")
    .sort({ dateobj: -1, _id: -1 })
    .lean();
  const serializedProducts = products.map((product) => ({
    ...product,
    sellerId: {
      _id: product.sellerId._id.toString(),
      username: product.sellerId.username,
      email: product.sellerId.email,
      role: product.sellerId.role,
      imgURL: product.sellerId.imgURL,
      isBanned: product.sellerId.isBanned,
    },
    _id: product._id.toString(),
  }));

  return (
    <>
      <div className="sm:px-16 px-8 sm:py-10 pb-12 card_grid gap-5">
        {serializedProducts.map((product, i) => (
          <ProductCard key={i} product={product} ishome="False" />
        ))}
      </div>
    </>
  );
};

export default seller;
