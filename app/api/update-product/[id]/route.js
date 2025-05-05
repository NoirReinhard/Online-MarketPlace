import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileToBuffer = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        allowed_formats: ["jpg", "jpeg", "png"],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const deleteCloudinaryImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete old image:", error.message);
  }
};

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    await connectDB();

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response("Invalid product ID", { status: 400 });
    }

    const formData = await req.formData();

    const productName = formData.get("productName");
    const price = formData.get("price");
    const description = formData.get("description");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");
    const stock = formData.get("stock");
    const address = formData.get("address");
    const category = formData.get("category");
    const image = formData.get("image");

    const product = await Product.findById(id);
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    let updatedImageUrl = product.imageUrl;
    let updatedImageId = product.imageId;

    if (image && typeof image === "object") {
      const buffer = await fileToBuffer(image);
      const result = await uploadImageToCloudinary(buffer);

      await deleteCloudinaryImage(product.imageId);

      updatedImageUrl = result.secure_url;
      updatedImageId = result.public_id;
    }

    product.name = productName;
    product.price = parseFloat(price);
    product.description = description;
    product.imageUrl = updatedImageUrl;
    product.imageId = updatedImageId;
    product.quantity = parseInt(quantity);
    product.unit = unit;
    product.stock = parseInt(stock);
    product.seller.address = address;
    product.category = category;

    await product.save();

    return NextResponse.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response("Failed to update product", { status: 500 });
  }
}
