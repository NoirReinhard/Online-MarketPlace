import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";

export async function GET() {
  await connectDB();
  const products = await Product.find({}).populate("sellerId");
  return Response.json(products);
}
