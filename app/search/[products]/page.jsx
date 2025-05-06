import ProductCard from "@/app/components/ProductCard";
import Product from "@/app/models/Products";
import React from "react";

const page = async ({ params }) => {
  const { products } = await params;
  const product_name = decodeURIComponent(products).trim();
  var product;
  if (
    product_name == "bakery" ||
    product_name == "dairy" ||
    product_name == "fruit" ||
    product_name == "vegetable" ||
    product_name == "beverages" ||
    product_name == "spices" ||
    product_name == "nuts" ||
    product_name == "pulse"
  ) {
    product = await Product.find({ category: product_name })
      .populate("sellerId")
      .lean();
  } else {
    product = await Product.find({
      name: { $regex: product_name, $options: "i" },
    })
      .lean()
      .populate("sellerId");
  }
  const serializedProducts = product.map((product) => ({
    ...product,
    _id: product._id.toString(),
    sellerId: {
      _id: product.sellerId._id.toString(),
      username: product.sellerId.username,
      email: product.sellerId.email,
      imgURL: product.sellerId.imgURL,
    },
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
          <p className="text-lg font-bold">No products found</p>
        </div>
      )}
    </div>
  );
};

export default page;
