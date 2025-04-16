import { Order } from "@/app/models/Order";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return Response.json(orders);
}
