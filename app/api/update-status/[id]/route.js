export const runtime = 'nodejs'
import { Order } from "@/app/models/Order";
import connectDB from "@/app/lib/db";
import { getSession } from "@/app/lib/getSession";

export async function PUT(req, { params }) {
  const session = await getSession();
  const { id } =  params;
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { status } = await req.json();
  await Order.findByIdAndUpdate(id, { status });

  return Response.json({ success: true, message: "Order status updated." });
}
