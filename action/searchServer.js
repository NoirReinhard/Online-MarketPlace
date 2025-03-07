"use server";
import Product from "@/app/models/Products";
import connectDB from "@/app/lib/db";

export async function searchServer(search) {
    await connectDB();
    const products = await Product.find({ name: { $regex: search, $options: "i" } }).lean(); // Convert to plain JSON
    return products;
}