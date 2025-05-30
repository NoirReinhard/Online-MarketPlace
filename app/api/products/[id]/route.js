export const runtime = 'nodejs'
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import { v2 as cloudinary } from "cloudinary";

export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = params;

  const deleteCloudinaryImage = async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error.message);
    }
  };

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Fetch product first
    const product = await Product.findById(id);
    console.log(product, "Product foundddddddddddd");

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    // Delete image from Cloudinary
    await deleteCloudinaryImage(product.imageId);

    // Now delete product from DB
    const result = await Product.deleteOne({ _id: id });

    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ error: "Failed to delete product" }), {
      status: 500,
    });
  }
}
