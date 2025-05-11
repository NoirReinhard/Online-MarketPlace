"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { sellerfilter } from "../constants";
import Button from "../elements/Button";

const SellerProducts = ({ serializedProducts }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [lb, setLb] = useState("All");

  useEffect(() => {
    setAllProducts(serializedProducts);
    setProducts(serializedProducts);
  }, [serializedProducts]);

  const handleFilter = (label) => {
    setLb(label);
    if (label === "All") {
      setProducts(allProducts);
      return;
    }
    const filteredProducts = allProducts.filter((products) => {
      return products.isAvailable == label;
    });

    setProducts(filteredProducts);
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {sellerfilter.map((category) => {
            const isActive = lb === category.status;
            const color = isActive
              ? "text-white"
              : "text-blue-900 font-semibold";
            const bgColor = isActive ? "bg-green-600" : "bg-white";

            return (
              <Button
                key={category.status}
                label={category.label}
                color={color}
                backColor={bgColor}
                border="border-gray-300"
                rounded
                onClick={() => handleFilter(category.status)}
                className={`${bgColor} ${color} px-4 py-2 rounded-full font-semibold`}
              />
            );
          })}
        </div>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-2">
            <img src="/assets/OrdFnd.png" height="180px" width="180px" alt="" />
            <p className="font-semibold text-gray-500 text-lg">
              No Products Found!
            </p>
          </div>
        ) : (
          <div className="card_grid gap-5">
            {products.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default SellerProducts;
