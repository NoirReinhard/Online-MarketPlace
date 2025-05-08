"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Button from "@/app/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    quantity: "",
    unit: "kg",
    category: "fruit",
    stock: "",
    address: "",
    imageUrl: "",
  });

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
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(id, "Product ID from URL");
        const res = await fetch(`/api/get-productDetails/${id}`);
        const data = await res.json();
        setProduct(data);
        setFormData({
          productName: data.name,
          price: data.price,
          description: data.description,
          quantity: data.quantity,
          unit: data.unit,
          category: data.category,
          stock: data.stock,
          address: data.address,
          imageUrl: data.imageUrl,
        });
        setImage(data?.imageUrl);
        if (!data || data.error) {
          toast.error("Invalid product data");
          return;
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting...");

    const errorMessage = validateForm(formData);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setLoading(true);
    const formPayload = new FormData();

    if (image && typeof image !== "string") {
      formPayload.append("image", image);
    } else {
      formPayload.append("imageUrl", formData.imageUrl);
    }

    Object.entries(formData).forEach(([key, value]) =>
      formPayload.append(key, value)
    );
    try {
      const res = await fetch(`/api/update-product/${id}`, {
        method: "PUT",
        body: formPayload,
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/seller");
        toast.success("Product updated successfully!");
      } else {
        toast.error(data.error || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding">
      <h1 className="text-center text-2xl font-semibold pb-5">
        Sell Your <span className="text-button_color">Products</span> Here!
      </h1>
      <div className="border border-formborder rounded-md p-10 ">
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
                value={formData.productName ?? ""}
                onChange={handleInputChange}
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
                value={formData.price ?? ""}
                onChange={handleInputChange}
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
                value={formData.category ?? ""}
                onChange={handleInputChange}
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
              value={formData.description ?? ""}
              onChange={handleInputChange}
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
              value={formData.quantity ?? ""}
              onChange={handleInputChange}
              className="border-formborder border w-[30%] rounded-sm pl-2 h-10"
              placeholder="Enter Quantity"
            />
            <select
              name="unit"
              value={formData.unit ?? ""}
              onChange={handleInputChange}
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
            value={formData.stock ?? ""}
            onChange={handleInputChange}
            className="border-formborder border w-[30%] rounded-sm pl-2 py-2"
            placeholder="Enter Your Available Stock"
          />

          <label htmlFor="address" className="block my-5 font-semibold">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address ?? ""}
            onChange={handleInputChange}
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
            {imagePreview ? (
              <div className="pt-[10px]">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="h-64 object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="pt-[10px]">
                <img
                  src={
                    formData.imageUrl ||
                    "https://res.cloudinary.com/dpk7ntarg/image/upload/v1746604454/32d18bdb-0dae-4c34-b279-f55df27a37a3.png"
                  }
                  alt="Image Preview"
                  className="h-64 object-contain rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-5 justify-center">
            <Button
              className="mt-10 px-10 py-1"
              type="submit"
              label={loading ? "Updating.." : "Update"}
            />

            <Link href="/seller">
              <Button
                disabled={loading}
                label="Cancel"
                className={`${
                  loading ? "cursor-not-allowed" : ""
                } mt-10 px-4 py-1`}
                backColor="white"
                color="black"
              />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
