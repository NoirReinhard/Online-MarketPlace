// /app/api/place-order/route.js

import { NextResponse } from "next/server";
import { Order } from "@/app/models/Order";
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import { sendEmail } from "@/app/lib/mailer";
import { getSession } from "@/app/lib/getSession";

export async function POST(req) {
  const session = await getSession();
  try {
    await connectDB();

    const { formData, cart } = await req.json();

    const { address, city, state, postCode } = formData;

    const items = [];
    let subTotal = 0;

    for (const item of cart) {
      const { _id, name, imageUrl, price, cquantity } = item;
      const product = await Product.findById(_id).populate("sellerId");

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product with ID ${_id} not found.` },
          { status: 404 }
        );
      }

      const seller = product.sellerId.toObject();

      if (product.stock < cquantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${product.stock} items left in stock for ${product.name}.`,
          },
          { status: 400 }
        );
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

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
    });
  } catch (err) {
    console.error("[ORDER_API_ERROR]", err);
    return NextResponse.json(
      { success: false, message: "Server error. Try again." },
      { status: 500 }
    );
  }
}
