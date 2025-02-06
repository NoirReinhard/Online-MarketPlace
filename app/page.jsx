import React from "react";
import "./globals.css";
import { getSession } from "./lib/getSession";
import { redirect } from "next/navigation";
import Product from "./models/Products";
import ProductCard from "./components/ProductCard";

const page = async () => {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    if (user.role === "seller") redirect("/seller");
  } else {
    redirect("/Login");
  }
  const products1 = await Product.find();
  for (const product of products1) {
    if (typeof product.createdAt === "string") {
      const dateObj = new Date(product.createdAt);
    }
  }
  // Fetch products and serialize the `_id` field
  const products = await Product.find().sort({ dateobj: -1, _id: -1 }).lean();
  const serializedProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(), // Convert ObjectId to string
  }));

  return (
    <div className="sm:px-16 px-8 sm:py-10 pb-12 card_grid gap-5">
      {serializedProducts.map((product, i) => (
        <ProductCard key={i} product={product} />
      ))}
    </div>
  );
};

export default page;
