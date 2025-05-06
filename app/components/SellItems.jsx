"use client";
import React, { useState } from "react";
import Button from "../elements/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

const SellItems = () => {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const validateForm = ({
    productName,
    price,
    description,
    quantity,
    stock,
    address,
  }) => {
    if (
      !productName ||
      !price ||
      !description ||
      !quantity ||
      !stock ||
      !address
    ) {
      return "Please fill in all required fields.";
    }

    if (isNaN(price) || Number(price) <= 0) {
      return "Price must be a positive number.";
    }

    if (isNaN(quantity) || Number(quantity) <= 0) {
      return "Quantity must be a positive number.";
    }

    if (isNaN(stock) || Number(stock) < 0) {
      return "Stock must be a non-negative number.";
    }

    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the image preview
    };
    if (file) {
      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a valid image.");
      return;
    }

    const form = e.target;
    const formValues = {
      productName: form.productName.value.trim(),
      price: form.price.value.trim(),
      description: form.description.value.trim(),
      quantity: form.quantity.value.trim(),
      stock: form.stock.value.trim(),
      address: form.address.value.trim(),
    };

    const errorMessage = validateForm(formValues);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    Object.entries(formValues).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("unit", form.unit.value);
    formData.append("category", form.category.value);

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
        toast.error(data.error || "Failed to upload product");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("An error occurred while uploading the product.");
    } finally {
      setLoading(false);
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
            <div>
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
                className="border-formborder border my-5 py-1.5 rounded-sm pl-2"
                placeholder="Enter Price"
              />
            </div>
            <div>
              <label htmlFor="category" className="block font-semibold">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="border-formborder border my-5 py-1.5 px-3 rounded-sm"
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
              id="description"
              name="description"
              rows="5"
              className="border-formborder border my-3 w-full pt-3 rounded-sm pl-2 py-1.5"
              placeholder="Enter the description of the product you are selling"
            />
          </div>

          <label htmlFor="quantity" className="block my-5 font-semibold">
            Quantity
          </label>
          <div className="flex gap-5 mt-2">
            <input
              type="text"
              name="quantity"
              className="border-formborder border w-[30%] rounded-sm pl-2 h-10"
              placeholder="Enter Quantity"
            />
            <select
              name="unit"
              className="border-formborder border w-[20%] rounded-sm pl-2 h-10"
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

          <label htmlFor="stock" className="block my-5 font-semibold">
            Stock
          </label>
          <input
            type="text"
            name="stock"
            className="border-formborder border w-[30%] rounded-sm pl-2 py-2"
            placeholder="Enter Your Available Stock"
          />

          <label htmlFor="address" className="block my-5 font-semibold">
            Address
          </label>
          <input
            type="text"
            name="address"
            className="border-formborder border w-full rounded-sm pl-2 py-1.5"
            placeholder="Enter Your Address"
          />

          <div className="my-6 flex flex-col items-start space-y-2">
            <label htmlFor="imageUpload" className="font-semibold">
              Product Image
            </label>

            <div className="relative">
              <input
                id="imageUpload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
              />

              <label
                htmlFor="imageUpload"
                className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 cursor-pointer hover:bg-gray-200 transition duration-200"
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  className="text-gray-500 text-xl"
                />
              </label>
            </div>
            {/* Image Preview */}
            {imagePreview && (
              <div className="pt-[10px]">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="h-64 object-contain rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-5 justify-center">
            <Button
              label={loading ? "Uploading.." : "Sell"}
              className="mt-10 px-10 py-1"
            />
            <Link href="/seller">
              <Button
                disabled={loading}
                label="Cancel"
                className="mt-10 px-4 py-1"
                backColor="white"
                color="black"
              />
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SellItems;
