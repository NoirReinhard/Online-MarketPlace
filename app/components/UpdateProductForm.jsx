"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/app/elements/Button";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UpdateProductForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [product, setProduct] = useState();
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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
        setImage(data.imageUrl);
        if (!data || data.error) {
          toast.error("Invalid product data");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    if (id) fetchProduct();
  }, [id]);

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
    if (isNaN(price) || Number(price) <= 0)
      return "Price must be a positive number.";
    if (isNaN(quantity) || Number(quantity) <= 0)
      return "Quantity must be a positive number.";
    if (isNaN(stock) || Number(stock) < 0)
      return "Stock must be a non-negative number.";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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

    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      const res = await fetch(`/api/update-product/${id}`, {
        method: "PUT",
        body: formPayload,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product updated successfully!");
        router.push("/seller");
      } else {
        toast.error(data.error || "Failed to update product.");
      }
    } catch (error) {
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
      <div className="border border-formborder rounded-md p-10">
        <form onSubmit={handleFormSubmit}>
          {/* form inputs here, like you had before */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
}
