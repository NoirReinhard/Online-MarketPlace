import ProductCard from "@/app/components/ProductCard";
import Product from "@/app/models/Products";
import React from "react";

const page = async ({ params }) => {
  const { products } = await params;
  const product_name = decodeURIComponent(products).trim();
  const product = await Product.find({
    name: { $regex: product_name, $options: "i" },
  }).lean();
  const serializedProducts = product.map((product) => ({
    ...product,
    _id: product._id.toString(), // Convert ObjectId to string
  }));
  return (
    <div className="sm:px-16 px-8 sm:py-10 pb-12 ">
      <h1 className="text-2xl pb-4 font-bold">
        Search Results for:{" "}
        <span className="text-primary">"{product_name}"</span>
      </h1>
      <div className="card_grid gap-5">
        {serializedProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
        {serializedProducts.length === 0 && (
          <div className="flex justify-center items-center w-full h-[50vh]">
            <p className="text-lg font-bold">
              No products found
            </p>
          </div>
        )}
    </div>
  );
};

export default page;
