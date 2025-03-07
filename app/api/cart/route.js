import Cart from "@/app/models/Cart";

export async function POST(req) {
  const formData = await req.formData();
  const productName = formData.get("productName");
  const price = formData.get("price");
  const description = formData.get("description");
  const quantity = formData.get("quantity");
  const unit = formData.get("unit");
  const stock = formData.get("stock");
  const image = formData.get("image");

  const Cart = await Cart.create({
    name: productName,
    price: parseFloat(price),
    description: description,
    imageUrl: result.secure_url,
    imageId: result.public_id,
    quantity: parseInt(quantity),
    unit: unit,
    stock: parseInt(stock),
  });
}
