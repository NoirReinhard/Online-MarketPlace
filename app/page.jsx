import React from "react";
import "./globals.css";
import { getSession } from "./lib/getSession";
import { redirect } from "next/navigation";
import Product from "./models/Products";
import ProductCard from "./components/ProductCard";
import connectDB from "./lib/db";
import { faAngleDown, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Slider from "./components/Slider";               

const page = async () => {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    if (user.role === "seller") redirect("/seller");
  } else {
    redirect("/Login");
  }
  await connectDB();
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
    <div>
      <div className="sm:px-16 px-8 sm:py-10 pb-12">
        <div className="flex justify-around items-center w-[180px] mb-3 hover:cursor-pointer bg-button_color py-[15px] px-[20px] text-white rounded-md font-semibold relative group">
          <FontAwesomeIcon icon={faList} height={20} width={20} />
          <div className="relative inline-block">
            <p className="flex items-center gap-1 cursor-pointer">
              All Categories{" "}
              <FontAwesomeIcon icon={faAngleDown} height={10} width={10} />
            </p>

            {/* Dropdown Menu */}
            <div className="absolute hidden group-hover:block mt-2 w-[200px] py-2 px-2 rounded-md shadow-md z-40 bg-white">
              <ul className="bg-[#f8f8fb] rounded-md py-2 px-2 z-40 flex flex-col gap-2 h-[180px] w-max flex-wrap">
                <div className="category-list">
                  <Link href={`/search/bakery`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🍪 Bakery
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/dairy`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🥛 Dairy
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/vegetable`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🥕 Vegetables
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/beverages`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🍹 Beverages
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/spices`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🌶 Spices
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/nuts`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🥜 Nuts
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/pulse`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🌱 Pulses
                    </li>
                  </Link>
                </div>
                <div className="category-list">
                  <Link href={`/search/fruit`} passHref>
                    <li className="cursor-pointer hover:bg-gray-200 rounded-md p-2">
                      🥭 Fruits
                    </li>
                  </Link>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <Slider />
        <div className="card_grid gap-5">
          {serializedProducts.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
