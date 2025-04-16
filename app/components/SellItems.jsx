"use client";
import React, { useState } from "react";
import Button from "../elements/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const sellItems = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", e.target.productName.value);
    formData.append("price", e.target.price.value);
    formData.append("description", e.target.description.value);
    formData.append("quantity", e.target.quantity.value);
    formData.append("unit", e.target.unit.value);
    formData.append("stock", e.target.stock.value);
    formData.append("address", e.target.address.value);
    formData.append("category", e.target.category.value);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data) {
        router.push("/seller");
        toast.success("Product uploaded successfully!");
      } else {
        alert(data.error || "Failed to upload product");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("An error occurred while uploading the product.");
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl font-semibold pb-5">
        Sell Your <span className="text-button_color">Products</span> Here!
      </h1>
      <div className="border border-formborder rounded-md p-10">
        <form onSubmit={handleFormSubmit}>
          <div className="flex gap-14">
            <div className="">
              <label htmlFor="name" className="block font-semibold">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="productName"
                className="border-formborder border my-5 py-1.5 rounded-sm pl-2"
                placeholder="Enter Product Name"
              />
            </div>
            <div>
              <label htmlFor="price" className="block font-semibold">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                className="border-formborder border my-5 pt-3 rounded-sm pl-2 py-1.5"
                placeholder="Enter Price"
              />
            </div>
            <div>
              <label htmlFor="category" className="block font-semibold">
                Categoroy
              </label>
              <select
                className="border-formborder border my-5 pt-3 rounded-sm pl-2 py-1.5 px-3"
                name="category"
                id="category"
                required
              >
                <option value="fruit">Fruit</option>
                <option value="vegetable">Vegetable</option>
                <option value="dairy">Dairy</option>
                <option value="beverages">Beverages</option>
                <option value="spices">Spices</option>
                <option value="bakery">Bakery</option>
                <option value="pulse">Pulse</option>
                <option value="nuts">Nuts</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold">
              Description
            </label>
            <textarea
              type="text"
              id="description"
              name="description"
              rows="5"
              className="border-formborder border my-3 w-full pt-3 rounded-sm pl-2 py-1.5"
              placeholder="Enter the description of the product you are selling"
            />
          </div>
          <label
            htmlFor="address"
            className="block my-5 rounded-sm font-semibold"
          >
            Quantity
          </label>
          <div className="flex gap-5 mt-2">
            <input
              name="quantity"
              id="quantity"
              className="border-formborder border w-[30%] my-1 py-0  rounded-sm pl-2 h-10"
              placeholder="Enter Quantity"
            />
            <select
              className="border-formborder border w-[20%] my-1 py-2  rounded-sm pl-2 h-10"
              name="unit"
              id="role"
              required
            >
              <option value="kg">Kg</option>
              <option value="gm">Gm</option>
              <option value="ltr">Ltr</option>
              <option value="ml">Ml</option>
              <option value="pcs">Pcs</option>
              <option value="pack">Pack</option>
              <option value="bottle">Bottle</option>
            </select>
          </div>
          <label
            htmlFor="quantity"
            className="block my-5 rounded-sm font-semibold"
          >
            Stock
          </label>
          <input
            name="stock"
            id="stock"
            className="border-formborder border w-[30%] my-1 py-2  rounded-sm pl-2 "
            placeholder="Enter Your Available Stock"
          />

          <label
            htmlFor="address"
            className="block my-5 rounded-sm font-semibold"
          >
            Address
          </label>
          <input
            name="address"
            id="address"
            className="border-formborder border my-1 w-full pt-2 rounded-sm pl-2 py-1.5"
            placeholder="Enter Your Address"
          />

          <div>
            <label
              htmlFor="image"
              className="block my-5 rounded-sm font-semibold"
            >
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="flex gap-5 justify-center">
            <Button
              label={loading ? "Uploading.." : "Sell"}
              className="mt-10  px-10  py-1"
            />
            {loading ? (
              <Link href="/seller" className="px-4 py-1 cursor-not-allowed">
                <Button
                  disabled={loading}
                  label="Cancel"
                  className="mt-10  px-4  py-1 cursor-not-allowed"
                  backColor="white"
                  color="black"
                />
              </Link>
            ) : (
              <Link href="/seller">
                <Button
                  disabled={loading}
                  label="Cancel"
                  className="mt-10  px-4  py-1"
                  backColor="white"
                  color="black"
                />
              </Link>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default sellItems;
