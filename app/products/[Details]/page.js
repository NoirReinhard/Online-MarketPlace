import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import Image from "next/image";
import React from "react";
import CartActions from "@/app/components/CartActions";
import { getSession } from "@/app/lib/getSession";
import Link from "next/link";

export async function generateMetadata({ params }) {
  await connectDB();
  const product = await Product.findById(params.Details).lean();
  return {
    title: product?.name || "Product Details",
    description: product?.description?.slice(0, 150) || "View product info",
  };
}

const ProductDetails = async ({ params }) => {
  const { Details } = params;
  await connectDB();

  const product = await Product.findById(Details).lean().populate("sellerId");
  const session = await getSession();
  const isSeller = session?.user?.role;

  const plain_product = JSON.parse(
    JSON.stringify({
      ...product,
      _id: product._id.toString(),
    })
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-green-50 py-16 px-4 text-center shadow-inner">
        <p className="uppercase tracking-widest text-sm text-gray-500">
          {plain_product.createdAt}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-600 tracking-tight mt-2">
          {plain_product.name}
        </h1>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-[500px] rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
            <Image
              src={plain_product.imageUrl}
              alt={plain_product.name}
              width={600}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          <span
            className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
              plain_product.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {plain_product.isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="border-l-4 border-green-500 pl-4">
            <Link
              href={`/profile/${plain_product.sellerId._id}`}
              className="flex gap-2 items-center"
              passHref
            >
              <Image
                src={plain_product?.sellerId?.imgURL}
                alt={product.sellerId.username}
                height={40}
                width={40}
                className="rounded-full w-[40px] h-[40px] object-cover"
              ></Image>
              <div>
                <p className="text-xl font-semibold text-green-700">
                  {plain_product?.sellerId?.username || "Unknown Seller"}
                </p>
                <p className="text-sm text-gray-500">
                  {plain_product?.sellerId?.email || "No contact available"}
                </p>
              </div>
            </Link>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-4">
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
              Category: {plain_product.category}
            </span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
              Location: {plain_product.address}
            </span>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed">
            {plain_product.description}
          </p>

          {/* Price + Quantity + Stock */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-3xl font-bold text-green-700 tracking-tight">
              ₹{plain_product.price}
            </p>
            <p className="text-lg font-medium text-gray-600">
              Quantity:{" "}
              <span className="font-semibold text-gray-900">
                {plain_product.quantity}
              </span>{" "}
              {plain_product.unit}
            </p>
            <p className="text-sm text-gray-500">
              {plain_product.stock > 0
                ? `${plain_product.stock} left in stock`
                : "Out of stock"}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <Link
              href="/"
              className="text-sm text-green-700 underline hover:text-green-800"
            >
              ← Back to Products
            </Link>
          </div>

          {/* Cart Button */}

          <div className="pt-4">
            <CartActions product={plain_product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
