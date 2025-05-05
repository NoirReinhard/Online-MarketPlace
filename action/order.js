"use server";
import { Order } from "@/app/models/Order";
import { getSession } from "@/app/lib/getSession";
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import { sendEmail } from "@/app/lib/mailer";

const order = async (formData, cart) => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("User session not found. Please log in.");
  }

  const { address, city, state, postCode } = formData;
  await connectDB();

  const items = [];
  let subTotal = 0;

  for (const item of cart) {
    const { _id, name, imageUrl, price, cquantity } = item;
    const product = await Product.findById(_id).populate("sellerId");
    const seller = product.sellerId.toObject();

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${_id} not found.`,
      };
    }

    if (product.stock < cquantity) {
      return {
        success: false,
        message: `Only ${product.stock} items left in stock for ${product.name}.`,
      };
    }

    product.stock -= cquantity;
    if (product.stock === 0) {
      product.isAvailable = false;
    }

    await product.save();

    items.push({
      productId: _id,
      productname: name,
      imageUrl,
      price,
      quantity: cquantity,
      sellerId: seller._id,
    });

    await sendEmail({
      to: seller.email,
      subject: "New Order Received – Check Your Dashboard",
      html: `
        <p>Hello ${seller.username},</p>
        <p>Your product <strong>${name}</strong> was just purchased.</p>
        <p><strong>Quantity:</strong> ${cquantity}</p>
        <p><strong>Total:</strong> $${price * cquantity}</p>
        <p>Check your seller dashboard for more details.</p>
        <p>You’re receiving this email because you’re a seller on Noir. Contact us at support@noir.com.</p>
      `,
    });

    subTotal += price * cquantity;
  }

  const delivery = subTotal * 0.05;
  const total = subTotal + delivery;

  await Order.create({
    buyer: session.user.id,
    email: session.user.email,
    phoneNumber: postCode,
    address,
    city,
    state,
    items,
    totalAmount: total,
  });

  return {
    success: true,
    message: "Your Order has been Successfully Placed!",
  };
};

export default order;
