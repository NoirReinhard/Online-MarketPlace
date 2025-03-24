import React from "react";
import "./globals.css";
import { getSession } from "./lib/getSession";
import { redirect } from "next/navigation";
import Product from "./models/Products";
import ProductCard from "./components/ProductCard";
import connectDB from "./lib/db";
import {
  faCookieBite,
  faList,
  faPieChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <div className="flex justify-around items-center w-[180px] mb-3 bg-button_color py-[15px] px-[20px] text-white rounded-md font-semibold relative">
          <FontAwesomeIcon icon={faList} height={20} width={20} />
          <p>All Categories</p>
          <div className="absolute mt-[280px] ml-[100px] w-[200px] py-2 px-2 rounded-md shadow-md z-40">
            <ul className="bg-[#f8f8fb] rounded-md py-2 px-2 z-40 flex flex-col gap-2">
              <div className="flex gap-2 items-center hover:bg-gray-200 bg-white text-black py-1 px-2">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  height={20}
                  width={20}
                  className=" text-black"
                />
                <li className="">Bakery</li>
              </div>
              <div className="flex gap-2 items-center hover:bg-gray-200 bg-white text-black py-1 px-2">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  height={20}
                  width={20}
                  className=" text-black"
                />
                <li className="">Dairy</li>
              </div>
              <div className="flex gap-2 items-center hover:bg-gray-200 bg-white text-black py-1 px-2">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  height={20}
                  width={20}
                  className=" text-black"
                />
                <li className="">Vegetables</li>
              </div>
              <div className="flex gap-2 items-center hover:bg-gray-200 bg-white text-black py-1 px-2">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  height={20}
                  width={20}
                  className=" text-black"
                />
                <li className="">Nuts</li>
              </div>
              <div className="flex gap-2 items-center hover:bg-gray-200 bg-white text-black py-1 px-2">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  height={20}
                  width={20}
                  className=" text-black"
                />
                <li className="">Pulses</li>
              </div>
              <div className="flex gap-2 items-center hover:bg-gray-200 bg-white text-black py-1 px-2">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  height={20}
                  width={20}
                  className=" text-black"
                />
                <li className="">Fruits</li>
              </div>
            </ul>
          </div>
        </div>
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
