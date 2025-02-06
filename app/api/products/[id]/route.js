import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";

export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = await params;


  try {
    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Product deleted successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ error: "Failed to delete product" }), {
      status: 500,
    });
  }
}
