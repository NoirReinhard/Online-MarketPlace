"use server";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be greater than or equal to 0"],
  },
  address: {
    type: String,
    required: [true, "Adress is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
  },
  imageId: {
    type: String,
    required: [true, "Cloudinary image ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  unit: {
    type: String,
    required: [true, "Unit is required"],
    enum: ["gm", "kg", "ml", "ltr", "pcs", "pack", "bottle"],
  },
  category: {
    type: String,
    required: [true, "Category is Required"],
    enum: [
      "fruit",
      "bakery",
      "dairy",
      "vegetable",
      "nuts",
      "pulse",
      "beverages",
      "spices",
    ],
  },
  stock: {
    type: Number,
    required: [true, "Full quantity is required"],
    min: [0, "Full quantity cannot be negative"],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Seller ID is required"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: String,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
