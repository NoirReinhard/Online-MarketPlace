"use client";
import React, { useState } from "react";
import Button from "../elements/Button";
import { useRouter } from "next/navigation";

const sellItems = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", e.target.productName.value);
    formData.append("price", e.target.price.value);
    formData.append("description", e.target.description.value);
    formData.append("address", e.target.address.value);

    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data) {
        // If the product upload is successful, redirect to the seller page
        router.push("/seller");
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
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="border-formborder border my-5 w-full pt-3 rounded-sm pl-2 py-1.5"
              placeholder="Enter the description of the product you are selling"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block my-5 rounded-sm font-semibold"
            >
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows="5"
              className="border-formborder border my-3 w-full pt-3 rounded-sm pl-2 py-1.5"
              placeholder="Enter Your Address"
            />
          </div>

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
            <Button label="Submit" className="mt-10  px-4  py-1" />
            <Button
              label="Cancel"
              className="mt-10  px-4  py-1"
              backColor="white"
              color="black"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default sellItems;
