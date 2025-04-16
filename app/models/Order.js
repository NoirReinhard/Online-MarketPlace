import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    state: {
      type: String,
      required: true,
    },
    buyer: { type: String, required: true },
    productname: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    productId: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", orderSchema);
