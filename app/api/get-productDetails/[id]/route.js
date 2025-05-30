export const runtime = 'nodejs'
import Product from "@/app/models/Products";
import connectDB from "@/app/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return new Response("Invalid product ID", { status: 400 });
    }

    const details = await Product.findById(id);

    if (!details) {
      return new Response("Product not found", { status: 404 });
    }

    return new Response(JSON.stringify(details), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error fetching product", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
